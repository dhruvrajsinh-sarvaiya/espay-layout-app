
// Component For Trading Chart By Tejas : Date : 25/9/2018
import React, { Component, Fragment } from "react";
// import High Chart Details
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { getChartData } from "Actions/Trade";
// import connect function for store
import { connect } from "react-redux";
import { chartData } from "./ChartData";

// component For trading chart
class CooldexFundingChart extends Component {
  state = {
    chartData: chartData,
    socketData: []
  };
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

    if (this.state.chartData.length !== 0) {
      dataLength = this.state.chartData.length;

      for (i; i < dataLength; i += 1) {
        info.push([
          this.state.chartData[i][0], // the date
          this.state.chartData[i][1], // open
          this.state.chartData[i][2], // high
          this.state.chartData[i][3], // low
          this.state.chartData[i][4] // close
        ]);

        volume.push([
          this.state.chartData[i][0], // the date
          this.state.chartData[i][5] // the volume
        ]);
      }

    }
    const options = {
      colors: ['#000000', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
        '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
      ],
      chart: {
        backgroundColor: this.props.darkMode ? '#2c3644' : 'white',
        color: this.props.darkMode ? 'white' : '#464D69',
        height: 280
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            chart: {
              height: 300
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
            type: 'day',
            count: 1,
            text: '1d'
          }, {
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
          }],
        selected: 2,
        inputEnabled: false,
      },
      scrollbar: {
        enabled: false
      },
      navigator: {
        enabled: false
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
          lineWidth: 2,
          height: '60%',
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
          name: this.props.firstCurrency + "/" + this.props.secondCurrency,
          data: info,
          dataGrouping: {
            units: groupingUnits
          }
        },
        {
          type: "column",
          name: "Volume",
          data: volume,
          color: '#000000',
          yAxis: 1,
          dataGrouping: {
            units: groupingUnits
          },
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
        <div className="cooldexgraph">
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
  const { loading } = tradeChart;
  return { darkMode, loading };
};

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getChartData
  }
)(CooldexFundingChart);
