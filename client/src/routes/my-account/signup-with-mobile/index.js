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

import { SignupWithMobileWidget } from "Components/MyAccount";

export default class SignupWithMobile extends Component {
  render() {
    const ColoredLine = ({ color }) => (
      <hr
        style={{
          color: color,
          backgroundColor: color,
          height: 2
        }}
      />
    );
    const { loading } = this.props;
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.signupWithmobile" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-8 col-lg-3 mx-auto">
          <div className="session-head mt-15 text-center">
            <h1>{<IntlMessages id="sidebar.signupmobile" />}</h1>
            <ColoredLine color="Orange" />
          </div>
          <SignupWithMobileWidget />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
