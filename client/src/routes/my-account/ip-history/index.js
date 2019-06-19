/**
 * IP History
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { IPHistoryDataTable } from "Components/MyAccount";

export default class IPHistory extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.ipHistory" />}
          match={this.props.match}
        />
        <IPHistoryDataTable />
      </div>
    );
  }
}
