/**
 * CreatedBy : Kevin Ladani
 * Date : 09/10/2018
 */
/**
 * Add IP WhiteList
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { AddIPWhitelistWdgt } from "Components/MyAccount";

export default class AddIPWhiteList extends Component {
  render() {
    
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.addIpwhitelist" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <AddIPWhitelistWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
