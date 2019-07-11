import React, { Component } from "react";

import MUIDataTable from "mui-datatables";

export default class NotFoundTable extends Component {
  render() {
    const NotFound = [["Data Does Not Found"]];
    const NotFoundOptions = {
      pagination: false,
      selectableRows: false,
      responsive: "scroll",
      rowHover: false,
      sortFilterList: false,
      sort: false,
      filter: false,
      search: false,
      print: false,
      download: false,
      viewColumns: false
    };

    return (
      <div>
        <MUIDataTable
          title={this.props.title}
          data={NotFound}
          columns={this.props.columns}
          options={NotFoundOptions}
        />
      </div>
    );
  }
}
