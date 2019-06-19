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

import { DisableGoogleAuthWdgt } from "Components/MyAccount";

export default class DisableGoogleAuth extends Component {
  render() {
    // const { name, email, password } = this.state;

    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.disablegoogleauth" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <div>
            <span className="text-warning">
              *For security purposes, withdrawals are disabled for 24 hours
              after disabling Google Authentication
            </span>
          </div>

          <DisableGoogleAuthWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
