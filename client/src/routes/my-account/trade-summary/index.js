/**
 * Trade Summary
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { TradeSummaryWdgt } from "Components/MyAccount";

export default class TradeSummary extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.tradeSummary" />}
          match={this.props.match}
        />
        <TradeSummaryWdgt />
      </div>
    );
  }
}
