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

// Component For Trading Chart By Tejas : Date : 25/9/2018
import React, { Component, Fragment } from "react";

// import High Chart Details
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

//import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

import { getChartData } from "Actions/Trade";

// import connect function for store
import { connect } from "react-redux";
// component For trading chart
class TradingChartthree extends Component {
  state = {
    chartData: [] , //chartData
    socketData:[]
  };

  // This will invoke After component render
  componentWillMount() {
    
    this.isComponentActive = 1;
    const pair = this.props.state.currencyPair;
    
    // code changed by devang parekh for handling margin trading process
    if(this.props.hasOwnProperty('marginTrading') && this.props.marginTrading === 1) {
      
      // Call Actions For Get chart data List
      this.props.getChartData({ Pair: pair,Interval:'1m', marginTrading:1});
      this.processForMarginTrading(); // call for intialize socket listners for margin trading

    } else {

      // Call Actions For Get chart data List
      this.props.getChartData({ Pair: pair,Interval:'1m' });
      this.processForNormalTrading();// call for intialize socket listners for normal trading

    }

    // code end (21-2-2019)

  }

  // code for handle signalr listners for normal trading
  processForNormalTrading() {

    this.props.hubConnection.on('RecieveChartData', (receivedMessage) => {
      if (this.isComponentActive === 1 && receivedMessage !== null) {

        var charData = this.state.chartData;

        try{

          const receivedMessageData = JSON.parse(receivedMessage);

          if ((receivedMessageData.EventTime && this.state.socketData.length === 0) || 
            (this.state.socketData.length !== 0 && receivedMessageData.EventTime > this.state.socketData.EventTime) ) {

              if(this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 0){                
                charData.push(receivedMessageData.Data)
              this.setState({ chartData: charData, socketData: receivedMessageData });

              } 

          }

        }catch(error){

        }

      }

    });

  }

  // code for handle signalr listners for margin trading
  processForMarginTrading() {

    this.props.hubConnection.on('RecieveChartData', (receivedMessage) => {
      if (this.isComponentActive === 1 && receivedMessage !== null) {

        var charData = this.state.chartData;

        try{

          const receivedMessageData = JSON.parse(receivedMessage);

          if ((receivedMessageData.EventTime && this.state.socketData.length === 0) || 
            (this.state.socketData.length !== 0 && receivedMessageData.EventTime > this.state.socketData.EventTime) ) {

              if(this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 1){
                charData.push(receivedMessageData.Data)
                this.setState({ chartData: charData, socketData: receivedMessageData });

              } 

          }

        }catch(error){
        }

      }

    });
    
  }

  componentWillUnmount() {
    this.isComponentActive = 0;
  }
  
  // This will Invoke when component will recieve Props or when props changed
  componentWillReceiveProps(nextProps) {

    if (nextProps.chartData) {
      // set Chart Data if gets from API only
      this.setState({
        chartData: nextProps.chartData
      });
    } 
  }

  // render component
  render() {

    const info = [];
    const volume = [];
    var dataLength = 0;
    const groupingUnits = [
      [
        "week", // unit name
        [1] // allowed multiples
      ],
      ["month", [1, 2, 3, 4, 6]]
    ];

    var i = 0;

    var theme = false;
    if(localStorage.getItem('Thememode') !== null && localStorage.getItem('Thememode') !== undefined) {
      theme = localStorage.getItem('Thememode');
    }
    if (this.state.chartData.length !== 0) {
      dataLength = this.state.chartData.length;
      this.state.chartData.map((value,key)=>{
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
      colors: ['#000000','#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
      ], 
      chart: {
        backgroundColor: this.props.darkMode && '#2C3644',  
        color:   this.props.darkMode ? 'white': '#464D69', 
     },
     responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                chart: {
                    height:400
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
        },{
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
      selected: 1,
      inputEnabled: false,
    },
      chart: {
        backgroundColor: theme && '#2C3644',   
        color:   theme ? 'white': '#464D69', 
        height:305
      },
      scrollbar:{
        enabled: false
      },
      navigator: {
        enabled: false
      },
       series: [
        {
          data: volume,
          color: '#000000',
        }
      ],
      yAxis: [
        {
          labels: {
            align: "right",
            x: -3
          },
          title: {
            text: "Data"
          },
          lineWidth: 2,
          height:'50%',
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
          name: this.props.firstCurrency + "/"+this.props.secondCurrency,
          data: info,
          dataGrouping: {
            units: groupingUnits
          },
			downColor: 'red'
        },
        {
          type: "column",
          name: "Volume",
          data: volume,
          yAxis: 1,
          dataGrouping: {
            units: groupingUnits
          },
          color: theme ? 'white': '#000000',
        }      
         
      ],  
      plotOptions: {
        candlestick: {
                   	color: 'red',
                	upColor: 'green',
               }
           },
    };

    return (
      <Fragment>
         {this.props.loading && <JbsSectionLoader />}
        <div>       
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

const mapStateToProps = ({ settings, tradeChart }) => {
  const { darkMode } = settings;
  const { chartData,loading } = tradeChart;
  return { darkMode, chartData, loading };
};

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getChartData
  }
)(TradingChartthree);
