/**
 * Created By : Salim Deraiya
 * Created Date : 09/10/2018
 * Route for Add SLA configuration
 */

import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { AddSLAFormWdgt } from "Components/MyAccount/SLAConfiguration";

export default class AddSLAForm extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.addSla" />}
          match={this.props.match}
        />
        <AddSLAFormWdgt />
      </div>
    );
  }
}
