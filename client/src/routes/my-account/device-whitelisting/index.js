/**
 * Created By : Kevin Ladani
 * Created Date : 09/10/2018
 * Route for Device Whitelisting
 */

import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { DeviceWhitelistingWdgt } from "Components/MyAccount";

export default class DeviceWhitelisting extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.deviceWhitelisting" />}
          match={this.props.match}
        />
        <DeviceWhitelistingWdgt />
      </div>
    );
  }
}
