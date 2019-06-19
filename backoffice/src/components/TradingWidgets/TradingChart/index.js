
// Added by devang parekh for fetch data based on param
/*
1m - 1 Minute
3m - 3 Minute
5m - 5 Minute
15m - 15 Minute
30m - 30 Minute
1H - 1 Hour
2H - 2 Hour
4H - 4 Hour
6H - 6 Hour
1D - 1 Day
1W - 1 Week
1M - 1 Month
*/

// Component For Trading Chart By Tejas Date : 7/1/2019

import React, { Component, Fragment } from "react";

// import connect function for store
import { connect } from "react-redux";
import { Input } from 'reactstrap';

// import High Chart Details
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { getChartDataList } from "Actions/Trading";
// import pairlist data action 
import { getTradePairs } from "Actions/TradeRecon";
//import loader component
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// component For trading chart
class TradingChart extends Component {
   state = {
      chartData: [],
      pair: 'INR_BTC',
      pairList: [],
      //added by parth andhariya
      marginTradingBit: this.props.marginTradingBit
   };

   // This will invoke After component render
   componentWillMount() {
      //added by parth andhariya
      if (this.state.marginTradingBit === 1) {
         // Call Actions For Get Chart Data      
         this.props.getChartDataList({ Pair: this.state.pair, Interval: '1m', IsMargin: 1 });
         this.props.getTradePairs({ IsMargin: 1 })
      } else {
         this.props.getChartDataList({ Pair: this.state.pair, Interval: '1m' });
         this.props.getTradePairs({})
      }
   }

   // This will Invoke when component will recieve Props or when props changed
   componentWillReceiveProps(nextProps) {
      if (nextProps.pairList.length) {
         this.setState({
            pairList: nextProps.pairList
         })
      }
      if (nextProps.chartData) {
         // set Chart Data if gets from API only
         this.setState({
            chartData: nextProps.chartData
         });
      }
   }

   //set order type
   handleChangeOrder = (event) => {
      //added by parth andhariya
      if (this.state.marginTradingBit === 1) {
         this.props.getChartDataList({ Pair: event.target.value, Interval: '1m', IsMargin: 1 });
      } else {
         this.props.getChartDataList({ Pair: event.target.value, Interval: '1m' });
      }
      this.setState({
         pair: event.target.value
      })
   }

   // render component
   render() {
      const info = [];
      const volume = [];
      const groupingUnits = [
         [
            "week", // unit name
            [1] // allowed multiples
         ],
         ["month", [1, 2, 3, 4, 6]]
      ];

      if (this.state.chartData.length !== 0) {
         this.state.chartData.map((value, key) => {
            info.push(
               [
                  value.DataDate,
                  value.Open,
                  value.High,
                  value.Low,
                  value.Close
               ]
            )
            volume.push([
               value.DataDate,
               value.Volume
            ])
         })
      }
      const options = {
         colors: ['#000000', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
            '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
         ],
         responsive: {
            rules: [{
               condition: {
                  maxWidth: 500
               },
               chartOptions: {
                  chart: {
                     height: 400
                  },
                  subtitle: {
                     text: null
                  },
                  navigator: {
                     enabled: false
                  }
               }
            }]
         },
         rangeSelector: {
            buttons: [
               {
                  type: 'minute',
                  count: 1,
                  text: '1m'
               },
               {
                  type: 'minute',
                  count: 5,
                  text: '5m'
               },
               {
                  type: 'minute',
                  count: 15,
                  text: '15m'
               },
               {
                  type: 'minute',
                  count: 30,
                  text: '30m'
               },
               {
                  type: 'hour',
                  count: 1,
                  text: '1h'
               }, {
                  type: 'hour',
                  count: 6,
                  text: '6h'
               },
               {
                  type: 'day',
                  count: 1,
                  text: '1d'
               },
               {
                  type: 'month',
                  count: 1,
                  text: '1m'
               },
               {
                  type: 'month',
                  count: 3,
                  text: '3m'
               },
               {
                  type: 'month',
                  count: 6,
                  text: '6m'
               },
               {
                  type: 'year',
                  count: 1,
                  text: '1y'
               }
            ],
            selected: 9,
            inputEnabled: false,
         },
         chart: {
            backgroundColor: this.props.darkMode && '#2C3644',
            color: this.props.darkMode ? 'white' : '#464D69',
            height: 305
         },
         scrollbar: {
            enabled: false
         },
         navigator: {
            enabled: false
         },
         title: {
            text: ""
         },
         yAxis: [
            {
               labels: {
                  align: "right",
                  x: -3
               },
               title: {
                  text: "Data"
               },
               height: "60%",
               lineWidth: 2,
               resize: {
                  enabled: true
               }
            },
            {
               labels: {
                  align: "right",
                  x: -3
               },
               title: {
                  text: "Volume"
               },
               top: "65%",
               height: "35%",
               offset: 0,
               lineWidth: 2
            }
         ],

         tooltip: {
            split: true
         },

         series: [
            {
               type: "candlestick",
               name: this.state.pair,
               data: info,
               dataGrouping: {
                  units: groupingUnits
               },
               color: 'green',
            },
            {
               type: "column",
               name: "Volume",
               data: volume,
               yAxis: 1,
               dataGrouping: {
                  units: groupingUnits
               },
               color: this.props.darkMode ? 'white' : '#000000',
            }

         ],
         plotOptions: {
            candlestick: {
               color: 'green',
               upColor: 'red'
            }
         },
      };

      return (
         <Fragment>
            {this.props.loading && <JbsSectionLoader />}
            <div className="chart card">
               <Input type="select" name="pair" value={this.state.pair} id="Select-1" onChange={this.handleChangeOrder} style={{ zIndex: '1' }}>
                  {this.state.pairList.map((currency, key) =>
                     <option key={key} value={currency.PairName}>{currency.PairName}</option>
                  )}
               </Input>
               <HighchartsReact
                  highcharts={Highcharts}
                  constructorType={"stockChart"}
                  options={options}
               />
            </div>
         </Fragment>
      );
   }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
   chartData: state.tradeChart.chartData,
   loading: state.tradeChart.loading,
   error: state.tradeChart.error,
   pairList: state.tradeRecon.pairList
});

// connect action with store for dispatch
export default connect(
   mapStateToProps,
   {
      getChartDataList,
      getTradePairs
   }
)(TradingChart);