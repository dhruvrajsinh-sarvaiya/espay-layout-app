/**
 * CreatedBy : Kevin Ladani
 * Date : 26/09/2018
 */
/**
 * Add Customers
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { AddPatternsAssignmentsWdgt } from "Components/MyAccount";

export default class AddPatternsAssignments extends Component {
  render() {
    return (
      <div>
        <PageTitleBar
          title={
            <IntlMessages id="my_account.patternsAssignments.assignNewPatterns" />
          }
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <AddPatternsAssignmentsWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
