/**
 * CreatedBy : Kevin Ladani
 * Date : 26/09/2018
 */
/**
 * Edit Patterns Assignments
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { EditPatternsAssignmentsWdgt } from "Components/MyAccount";

export default class EditPatternsAssignments extends Component {
  render() {
    return (
      <div>
        <PageTitleBar
          title={
            <IntlMessages id="my_account.patternsAssignments.editPatternsAssignments" />
          }
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <EditPatternsAssignmentsWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
