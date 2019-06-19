/**
 * CreatedBy : Kevin Ladani
 * Date : 26/09/2018
 */
/**
 * Edit Customers
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { EditCustomerWdgt } from "Components/MyAccount";

export default class EditCustomer extends Component {
  render() {
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.editcustomer" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <EditCustomerWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
