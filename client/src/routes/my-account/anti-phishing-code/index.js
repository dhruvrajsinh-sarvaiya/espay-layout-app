/**
 * Anti-Phishing Code Index Page (code added by Parth Jani 20-9-2018)
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { AntiPhishingCodeWdgt } from "Components/MyAccount";

export default class AntiPhishingCode extends Component {
  render() {
    const { match } = this.props;
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.antiPhishingCode" />}
          match={match}
        />
        <JbsCollapsibleCard>
          <AntiPhishingCodeWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
