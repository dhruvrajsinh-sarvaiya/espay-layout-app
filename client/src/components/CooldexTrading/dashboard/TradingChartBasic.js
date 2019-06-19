/**
 * Overall Traffic Status Widget
 **/
import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
//import CircularProgress from '@material-ui/core/CircularProgress';

// chart
// import StackedBarChart from "Components/Charts/StackedBarChart";

// intl messages
import IntlMessages from "Util/IntlMessages";

// chart config
import ChartConfig from "Constants/chart-config";

// api
//import api from 'Api';

// redux action
/*import {
	getChartDataForTrading
} from 'Actions';
*/

export default class TradingChartBasic extends Component {
  state = {
    chartLabels: null,
    chartDatasets: null,
    onlineSources: 0,
    today: 0,
    lastMonth: 0,
    pair: "BTC/XRP"
  };

  componentDidMount() {
    this.getChartData();
  }

  // get messages
  getChartData() {
    const response = {
      chartLabels: ["0.00", "1.0", "2.0", "3.0", "4.0", "5.0", "6.0"],
      chartDatasets: [
        {
          label: "Series A",
          backgroundColor: ChartConfig.color.primary,
          borderColor: ChartConfig.color.primary,
          borderWidth: 1,
          hoverBackgroundColor: ChartConfig.color.primary,
          hoverBorderColor: ChartConfig.color.primary,
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: "Series B",
          backgroundColor: ChartConfig.color.default,
          borderColor: ChartConfig.color.default,
          borderWidth: 1,
          hoverBackgroundColor: ChartConfig.color.default,
          hoverBorderColor: ChartConfig.color.default,
          data: [45, 39, 40, 60, 35, 25, 60]
        }
      ],
      onlineSources: "3500",
      today: "17,020",
      lastMonth: "20.30%"
    };
    if (response) {
      this.setState({
        chartLabels: response.chartLabels,
        chartDatasets: response.chartDatasets,
        onlineSources: response.onlineSources,
        today: response.today,
        lastMonth: response.lastMonth
      });
    }
  }

  render() {
    const {
      chartLabels,
      chartDatasets,
      onlineSources,
      today,
      lastMonth
    } = this.state;
    return (
      <Fragment>
        <div className="p-20 display-n">
          <Row>
            <Col lg={4} md={4} sm={4} xs={4}>
              <span className="text-muted mb-5 d-block">
                <IntlMessages id="widgets.onlineSources" />
              </span>
              <div className="d-flex justify-content-between">
                <h2 className="text-muted mb-0">{onlineSources}</h2>
                <i className="ti-arrow-up text-info font-lg" />
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={4}>
              <span className="text-muted mb-5 d-block">
                <IntlMessages id="widgets.today" />
              </span>
              <div className="d-flex justify-content-between">
                <h2 className="text-muted mb-0">{today} </h2>
                <i className="ti-arrow-up text-info font-lg" />
              </div>
            </Col>
            <Col lg={4} md={4} sm={4} xs={4}>
              <span className="text-muted mb-5 d-block">
                <IntlMessages id="widgets.lastMonth" />
              </span>
              <div className="d-flex justify-content-between">
                <h2 className="text-muted mb-0">{lastMonth} </h2>
                <i className="ti-arrow-down text-pink font-lg" />
              </div>
            </Col>
          </Row>
        </div>
        {/* <StackedBarChart labels={chartLabels} datasets={chartDatasets} /> */}
      </Fragment>
    );
  }
}
