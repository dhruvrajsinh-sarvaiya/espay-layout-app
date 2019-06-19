/**
 * Created By : Salim Deraiya
 * Created Date : 09/10/2018
 * Route for Edit SLA configuration
 */

import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { EditSLAFormWdgt } from "Components/MyAccount/SLAConfiguration";

export default class EditSLAForm extends Component {
  render() {
    return (
      <div className="my-account-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.editSla" />}
          match={this.props.match}
        />
        <EditSLAFormWdgt />
      </div>
    );
  }
}
