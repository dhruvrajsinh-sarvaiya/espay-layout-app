/**
 * CreatedBy : Kevin Ladani
 * Date : 03/10/2018
 */
/**
 * Display Customers
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { PatternsAssignmentsWdgt } from "Components/MyAccount";

export default class DisplayUsers extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.patternsAssignments" />}
          match={this.props.match}
        />
        <PatternsAssignmentsWdgt />
      </div>
    );
  }
}
