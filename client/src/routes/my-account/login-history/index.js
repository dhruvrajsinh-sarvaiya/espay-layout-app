/**
 * Login History
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { LoginHistoryDataTable } from "Components/MyAccount";

export default class LoginHistory extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.loginHistory" />}
          match={this.props.match}
        />
        <div className="mb-20">
          <LoginHistoryDataTable />
        </div>
      </div>
    );
  }
}
