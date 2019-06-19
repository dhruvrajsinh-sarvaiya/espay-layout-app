import React, { Component } from "react";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import TradeRouteComponent from "Components/TradeRoute/TradeRoute";

export default class TradeRoute extends Component {
  render() {
    return (
      <div className="mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.tradeRoute" />}
          match={this.props.match}
        />
        <TradeRouteComponent
          history={this.props.history}
          location={this.props.location}
        />
      </div>
    );
  }
}
