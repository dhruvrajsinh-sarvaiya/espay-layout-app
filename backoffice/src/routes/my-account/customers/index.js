/**
 * CreatedBy : Kevin Ladani
 * Date : 26/09/2018
 */
/**
 * Display Customers
 */
import React, { Component } from "react";
import MUIDataTable from "mui-datatables";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import { connect } from "react-redux";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { CustomersWdgt } from "Components/MyAccount";

export default class DisplayUsers extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.displaycustomer" />}
          match={this.props.match}
        />
        <CustomersWdgt />
      </div>
    );
  }
}
