/**
 * Reset Password
 */
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { PresonalDashboard } from "Components/MyAccount";

export default class PersonalDashboard extends Component {
  render() {
    return (
      <div>
        <PageTitleBar title={<IntlMessages id="sidebar.personalDashboard" />} match={this.props.match} />
        <PresonalDashboard />
      </div>
    );
  }
}