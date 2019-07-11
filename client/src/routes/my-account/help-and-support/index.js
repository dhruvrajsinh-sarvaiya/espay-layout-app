/**
 * Complain Report
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ComplainReportsWdgt } from "Components/MyAccount/HelpAndSupport";

export default class ListComplain extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.complain" />}
          match={this.props.match}
        />
        <div className="mb-20">
          <ComplainReportsWdgt />
        </div>
      </div>
    );
  }
}
