/**
 * Top Gainers
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { TopLosersWdgt } from "Components/MyAccount";

export default class TopLosers extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.topLosers" />}
          match={this.props.match}
        />
        <TopLosersWdgt />
      </div>
    );
  }
}
