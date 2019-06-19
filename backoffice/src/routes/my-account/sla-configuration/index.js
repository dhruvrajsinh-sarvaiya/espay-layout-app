/**
 * Created By : Salim Deraiya
 * Created Date : 09/10/2018
 * Route for list SLA configuration
 */

import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ListSLAWdgt } from "Components/MyAccount/SLAConfiguration";

export default class ListSLA extends Component {
  render() {
    return (
      <div className="my-account-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.slaConfiguration" />}
          match={this.props.match}
        />
        <ListSLAWdgt />
      </div>
    );
  }
}
