/**
 * CreatedBy : Kevin Ladani
 * Date : 27/09/2018
 */
/**
 * Users Signup Report
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { UsersSignupReportWdgt } from "Components/MyAccount";

export default class UsersSignupReport extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.usersSignupReport" />}
          match={this.props.match}
        />
        <UsersSignupReportWdgt />
      </div>
    );
  }
}
