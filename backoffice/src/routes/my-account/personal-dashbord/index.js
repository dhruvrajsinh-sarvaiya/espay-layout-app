/**
 * Reset Password
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { PresonalDashboard } from "Components/MyAccount";

export default class PersonalDashboard extends Component {
  render() {
    const ColoredLine = ({ color }) => (
      <hr
        style={{
          color: color,
          backgroundColor: color,
          height: 2
        }}
      />
    );
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.personalDashboard" />}
          match={this.props.match}
        />
        <PresonalDashboard />
      </div>
    );
  }
}
