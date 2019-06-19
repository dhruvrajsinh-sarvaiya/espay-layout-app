/**
 * List Roles
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ListRolesWdgt } from "Components/MyAccount";

export default class ListRoles extends Component {
  render() {
    return (
      <div className="mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.roles" />}
          match={this.props.match}
        />
        <ListRolesWdgt />
      </div>
    );
  }
}
