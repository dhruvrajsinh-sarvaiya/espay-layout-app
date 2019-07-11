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

import { ForgotPasswordWdgt } from "Components/MyAccount";

export default class ForgotPassword extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="my_account.forgotPassword" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-6 col-lg-3 mx-auto">
          <ForgotPasswordWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
