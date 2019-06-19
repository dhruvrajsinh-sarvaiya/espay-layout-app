/**
 * List Roles
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { DeleteRolesWdgt } from "Components/MyAccount";

export default class AddRoles extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.deleteRoles" />}
          match={this.props.match}
        />
        <DeleteRolesWdgt />
      </div>
    );
  }
}
