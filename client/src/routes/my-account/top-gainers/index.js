/**
 * Top Gainers
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { TopGainersWdgt } from "Components/MyAccount";

export default class TopGainers extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.topGainers" />}
          match={this.props.match}
        />
        <TopGainersWdgt />
      </div>
    );
  }
}
