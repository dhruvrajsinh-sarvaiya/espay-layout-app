import React, { Component } from "react";
import { Badge } from "reactstrap";

import MUIDataTable from "mui-datatables";

export default class TransferInOut extends Component {
  render() {
    const columns = [
      "S.No",
      "Date",
      "Coin",
      "From Address",
      "To Address",
      "Confirmation"
    ];

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false
    };
    return (
      <div className={this.props.darkMode ? 'transaction-history-detail-darkmode':'transaction-history-detail'}>
      <MUIDataTable
        title={this.props.title}
        data={this.props.data.map(item => {
          return [
            item.SNo,
            item.Date,
            item.Coin,
            item.fromAddress,
            item.toAddress,
            <Badge className="mb-10 mr-10 mt-10" color="success" pill>
              {item.Confirmation}
            </Badge>
          ];
        })}
        columns={columns}
        options={options}
      />
      </div>
    )
  }
}

// const mapDispatchToProps = ({ settings }) => {
//   const { darkMode } = settings;
//   return { darkMode };
// };

// export default connect(
//   mapDispatchToProps,
//   {
//     getStackHistory
//   }
// )(TransferInOut);