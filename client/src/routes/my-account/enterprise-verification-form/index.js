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

import { EnterpriseVerificationFormWdgt } from "Components/MyAccount";

export default class EnterpriseVerificationForm extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.enterpriseVerification" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-12 col-lg-8 mx-auto">
          <EnterpriseVerificationFormWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
