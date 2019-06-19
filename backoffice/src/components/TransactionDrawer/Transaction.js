import React, { Component } from "react";
import Card1 from "Components/Wallets/Card1";
import MUIDataTable from "mui-datatables";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Button from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

export default class Transaction extends Component {
  state = {
    open: false,
    valueFromCard: ""
  };
  myCallback = dataFromChild => {
    this.setState({ valueFromCard: dataFromChild });
  };
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false
    });
  };
  render() {
    const columns = [
      {
        name: <IntlMessages id="table.sr" />
      },
      {
        name: <IntlMessages id="table.walletId" />
      },
      {
        name: <IntlMessages id="table.name" />
      },
      {
        name: <IntlMessages id="table.currency" />
      },
      {
        name: <IntlMessages id="table.balance" />
      },
      {
        name: <IntlMessages id="table.status" />
      }
    ];
    const data = [
      {
        sr: 1,
        walletId: "3as2d13216a5sd4f3a2s1d3213df1",
        name: "BTC_Admin",
        currency: "BTC",
        balance: 6548.184844,
        status: "Transaction"
      },
      {
        sr: 2,
        walletId: "3as2d13216a5sd4f3a2s1d3213df1",
        name: "ETH_Default",
        currency: "ETH",
        balance: 15422.254544,
        status: "Active"
      },
      {
        sr: 3,
        walletId: "3as2d13216a5sd4f3a2s1d3213df1",
        name: "ATCC_Fist",
        currency: "ATCC",
        balance: 15422.254544,
        status: "Active"
      }
    ];

    const transactionTypeData = [
      {
        value: 248,
        type: "Transaction"
      },
      {
        value: 42,
        type: "Buy Trade"
      },
      {
        value: 38,
        type: "Sell Trade"
      },
      {
        value: 14,
        type: "Withdraw"
      },
      {
        value: 7,
        type: "Shopping Cart"
      },
      {
        value: 58,
        type: "Deposit"
      },
      {
        value: 145,
        type: "Ganerate Address"
      },
      {
        value: 172,
        type: "Topup"
      },
      {
        value: 65,
        type: "Charge"
      },
      {
        value: 247,
        type: "Commission"
      }
    ];

    const options = {
      filterType: "multiselect",
      responsive: "scroll",
      selectableRows: false,
      download: false,
      viewColumns: false,
      filter: false,
      print: false,
      search: false,
      pagination: false
    };

    let statusFilter;
    if (this.state.valueFromCard !== "") {
      let value1 = "" + this.state.valueFromCard;
      statusFilter = data.filter(function(value) {
        return value.status === value1;
      });
      // console.log("statusFilter", statusFilter);
    }

    const { drawerClose } = this.props;
    return (
      <JbsCollapsibleCard>
        <div className="page-title d-flex justify-content-between align-items-center">
          <h2>
            <span>{<IntlMessages id="wallet.transaction" />}</span>
          </h2>
          <div className="page-title-wrap">
            <Button
              className="btn-warning text-white mr-10 mb-10"
              style={buttonSizeSmall}
              variant="fab"
              mini
              onClick={drawerClose}
            >
              <i className="zmdi zmdi-mail-reply" />
            </Button>
            <Button
              className="btn-info text-white mr-10 mb-10"
              style={buttonSizeSmall}
              variant="fab"
              mini
              onClick={this.closeAll}
            >
              <i className="zmdi zmdi-home" />
            </Button>
          </div>
        </div>
        <div className="card-title">
          <h5>{<IntlMessages id="wallet.types" />}</h5>
          <Card1
            data={transactionTypeData}
            callbackFromParent={this.myCallback}
          />
        </div>
        <div className="StackingHistory">
          {this.state.valueFromCard !== "" ? (
            <MUIDataTable
              title={<IntlMessages id="wallet.transaction" />}
              data={statusFilter.map(item => {
                return [
                  item.sr,
                  item.walletId,
                  item.name,
                  item.currency,
                  item.balance,
                  item.status
                ];
              })}
              columns={columns}
              options={options}
            />
          ) : (
            <MUIDataTable
              title={"Recent Transactions"}
              data={data.map(item => {
                return [
                  item.sr,
                  item.walletId,
                  item.name,
                  item.currency,
                  item.balance,
                  item.status
                ];
              })}
              columns={columns}
              options={options}
            />
          )}
        </div>
      </JbsCollapsibleCard>
    );
  }
}
