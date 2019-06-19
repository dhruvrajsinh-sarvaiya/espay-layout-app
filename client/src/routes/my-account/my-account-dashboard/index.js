/**
 * Agency Dashboard
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { MyAccountDashboardWdgt } from "Components/MyAccount";

export default class myAccountDashboard extends Component {
  render() {
    return (
      <div className="my-account-wrapper Myaccountheader">
        <PageTitleBar
          title={<IntlMessages id="sidebar.myaccountdashboard" />}
          match={this.props.match}
        />

        <MyAccountDashboardWdgt {...this.props} />
      </div>
    );
  }
}
