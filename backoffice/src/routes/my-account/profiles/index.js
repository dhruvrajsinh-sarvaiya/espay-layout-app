/**
 * CreatedBy : Kevin Ladani
 * Date : 28/09/2018
 */
/**
 * Display Profiles
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ProfilesWdgt } from "Components/MyAccount";

export default class DisplayProfiles extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.profiles" />}
          match={this.props.match}
        />
        <ProfilesWdgt />
      </div>
    );
  }
}
