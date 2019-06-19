import React, { Component } from "react";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import WithdrawRouteComponent from "Components/WithdrawRoute/WithdrawRoute";

export default class WithdrawRoute extends Component {
  render() {
    return (
      <div className="mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.withdrawRoute" />}
          match={this.props.match}
        />
        <WithdrawRouteComponent
          history={this.props.history}
          location={this.props.location}
        />
      </div>
    );
  }
}
