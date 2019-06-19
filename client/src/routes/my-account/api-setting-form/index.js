/**
 * Agency Dashboard
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import {
  APISettingFormWdgt,
  APISettingEditDelWdgt
} from "Components/MyAccount";

export default class APISettingForm extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.api" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-sm-12 col-md-12 mx-auto">
          <div className="mb-50">
            <APISettingFormWdgt />
          </div>
          <APISettingEditDelWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
