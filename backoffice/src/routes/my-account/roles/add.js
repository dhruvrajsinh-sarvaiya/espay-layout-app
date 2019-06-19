/**
 * List Roles
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { AddRolesWdgt } from "Components/MyAccount";

export default class AddRoles extends Component {
  render() {
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="my_account.addNewRole" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <AddRolesWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
