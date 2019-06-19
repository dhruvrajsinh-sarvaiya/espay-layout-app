/**
 * Complain Report
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ComplainReportWdgt } from "Components/MyAccount";

export default class ComplainReports extends Component {
  render() {
    return (
      <div className="my-account-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.complainReports" />}
          match={this.props.match}
        />
        <ComplainReportWdgt />
      </div>
    );
  }
}
