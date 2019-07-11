/**
 * Reset Password
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ResetPasswordWdgt } from "Components/MyAccount";

export default class ResetPassword extends Component {
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
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.resetPassword" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-8 col-lg-3 mx-auto">
          <div className="session-head mt-15 text-center">
            <h1>{<IntlMessages id="sidebar.resetPassword" />}</h1>
            <ColoredLine color="Orange" />
          </div>

          <ResetPasswordWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
