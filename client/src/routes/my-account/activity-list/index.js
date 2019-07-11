/**
 * Agency Dashboard
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ActivityListWdgt } from "Components/MyAccount";

export default class ActivityList extends Component {
  render() {
    return (
      <div className="my-account-wrapper">
        <PageTitleBar
          title={<IntlMessages id="sidebar.activityList" />}
          match={this.props.match}
        />
        <div className="mb-20">
          <ActivityListWdgt />
        </div>
      </div>
    );
  }
}
