/**
 * Complain Request Form
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ComplainReplayFormWdgt } from "Components/MyAccount/HelpAndSupport";

export default class ComplainReplayForms extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.replayComplain" />}
          match={this.props.match}
        />
        <div customClasses="card col-sm-6 col-lg-3 mx-auto">
          <ComplainReplayFormWdgt />
        </div>
      </div>
    );
  }
}
