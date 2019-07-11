/**
 * IP WhiteList
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { IPWhitelistWdgt } from "Components/MyAccount";

export default class IPWhitelist extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.ipWhitelist" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard>
          <IPWhitelistWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
