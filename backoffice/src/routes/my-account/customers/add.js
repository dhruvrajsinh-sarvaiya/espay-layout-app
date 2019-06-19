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

import { AddCustomerWdgt } from "Components/MyAccount";

export default class AddCustomer extends Component {
  render() {
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.addcustomer" />}
          match={this.props.match}
        />
        <JbsCollapsibleCard customClasses="col-md-12 mx-auto">
          <AddCustomerWdgt />
        </JbsCollapsibleCard>
      </div>
    );
  }
}
