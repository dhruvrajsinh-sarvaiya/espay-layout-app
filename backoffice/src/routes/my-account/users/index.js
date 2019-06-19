/**
 * CreatedBy : Kevin Ladani
 * Date : 24/09/2018
 */
/**
 * Display Users
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { UsersWdgt } from "Components/MyAccount";

export default class Users extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="my_account.users.displayusers" />}
          match={this.props.match}
        />
        <UsersWdgt />
      </div>
    );
  }
}
