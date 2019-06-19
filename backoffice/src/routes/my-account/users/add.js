/**
 * CreatedBy : Kevin Ladani
 * Date : 24/09/2018
 */
/**
 * Add Users
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { AddUsersWdgt } from "Components/MyAccount";

export default class AddUsers extends Component {
  render() {
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.adduser" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <AddUsersWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
