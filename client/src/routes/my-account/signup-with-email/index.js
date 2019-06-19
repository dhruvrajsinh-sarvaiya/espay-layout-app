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

import { SignupWithEmailWidget } from "Components/MyAccount";

export default class SignupWithEmail extends Component {
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
          title={<IntlMessages id="sidebar.signupWithemail" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-8 col-lg-4 mx-auto">
          <div className="session-head mt-15 text-center">
            <h1>{<IntlMessages id="sidebar.registerwithemail" />}</h1>
            <ColoredLine color="Orange" />
          </div>
          <SignupWithEmailWidget />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
