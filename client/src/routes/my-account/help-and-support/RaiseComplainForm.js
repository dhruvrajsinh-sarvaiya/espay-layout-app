/**
 * Complain Request Form
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ComplainFormWdgt } from "Components/MyAccount/HelpAndSupport";

export default class RaiseComplainForm extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.raiseComplain" />}
          match={this.props.match}
        />
        <div customClasses="card col-sm-12 col-md-12 mx-auto">
          <ComplainFormWdgt />
        </div>
      </div>
    );
  }
}
