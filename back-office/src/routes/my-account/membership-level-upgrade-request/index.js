/**
 * CreatedBy : Kevin Ladani
 * Date : 05/10/2018
 */
/**
 * Display Customers
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { MembershipLevelUpgradeRequestWdgt } from "Components/MyAccount";

export default class DisplayUsers extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.membershipLevel" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard>
          <MembershipLevelUpgradeRequestWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
