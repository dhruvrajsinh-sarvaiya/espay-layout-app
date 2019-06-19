import React, { Component } from "react";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import MUIDataTable from "mui-datatables";

export default class TransferInOut extends Component {
  render() {
    const columns = [
      {
        name: <IntlMessages id="table.id" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.date" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.username" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.type" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.amount" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="table.status" />,
        options: {
          sort: false,
          filter: true
        }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false
    };

    return (
      <div className="StackingHistory">
        <MUIDataTable
          data={this.props.data.map(item => {
            return [
              item.SNo,
              item.Date,
              item.Username,
              item.Type,
              item.Amount,
              item.Status
            ];
          })}
          columns={columns}
          options={options}
        />
      </div>
    );
  }
}
