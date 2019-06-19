/**
 * Edit Complain Form
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { EditComplainFormWdgt } from "Components/MyAccount";

export default class EditComplainForm extends Component {
  render() {
    return (
      <div className="my-account-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.editComplain" />}
          match={this.props.match}
        />
        <EditComplainFormWdgt />
      </div>
    );
  }
}
