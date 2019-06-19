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

import { SmsAuthWidget } from "Components/MyAccount";

export default class smsauth extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.sms-auth" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 col-sm-12 mx-auto">
          <SmsAuthWidget />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
