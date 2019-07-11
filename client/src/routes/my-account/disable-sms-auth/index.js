/**
 * Agency Dashboard
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { DisableSmsAuthWdgt } from "Components/MyAccount";

export default class DisableSmsAuth extends Component {
  render() {

    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.disablesmsauth" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <div>
            <span className="text-warning">
              *For security purposes, withdrawals are disabled for 24 hours
              after disabling SMS Authentication
            </span>
          </div>
          <DisableSmsAuthWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
