/**
 * View Complain Form
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ViewComplainWdgt } from "Components/MyAccount";

export default class ViewComplainForm extends Component {
  render() {
    return (
      <div className="my-account-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.viewComplain" />}
          match={this.props.match}
        />
        <ViewComplainWdgt />
      </div>
    );
  }
}
