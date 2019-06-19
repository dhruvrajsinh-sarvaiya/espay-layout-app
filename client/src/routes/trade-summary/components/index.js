/*
 * Created By Megha Kariya 
 * Date :- 09-01-2019
 * Route File for Trade Summary Report
*/
/**
 * Display ORDERS
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { TradeSummary } from "Components/TradingReport";

export default class TradeSummaryWdgt extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.tradeSummary" />}
          match={this.props.match}
        />
        <TradeSummary />
      </div>
    );
  }
}
