import React, { Component } from "react";
import Card1 from "Components/Wallets/Card1";
import Card2 from "Components/Wallets/Card2";
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

export default class WalletUsers extends Component {
  state = {
    open: false,
    valueFromCard1: "",
    valueFromCard2: "",
    click: null
  };
  myCallback = (dataFromChild1, dataFromChild2) => {
    this.setState({ valueFromCard1: dataFromChild1, click: dataFromChild2 });
  };
  myCallback1 = (dataFromChild1, dataFromChild2) => {
    this.setState({ valueFromCard2: dataFromChild1, click: dataFromChild2 });
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
        name: <IntlMessages id="table.email" />
      },
      {
        name: <IntlMessages id="table.name" />
      },
      {
        name: <IntlMessages id="table.organization" />
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
        email: "Lisa@example.com",
        name: "Lisa Roy",
        organization: "JBSPL",
        balance: 6548.184844,
        status: "Active"
      },
      {
        sr: 2,
        email: "Monica@example.com",
        name: "Monica Brits",
        organization: "JBSPL",
        balance: 15422.254544,
        status: "Active"
      },
      {
        sr: 3,
        email: "Zeel@example.com",
        name: "Zeel Done",
        organization: "JBSPL",
        balance: 15422.254544,
        status: "Active"
      },
      {
        sr: 4,
        email: "Lisa@example.com",
        name: "Lisa Roy",
        organization: "JBSPL",
        balance: 6548.184844,
        status: "Active"
      },
      {
        sr: 5,
        email: "Monica@example.com",
        name: "Monica Brits",
        organization: "JBSPL",
        balance: 15422.254544,
        status: "Inactive"
      },
      {
        sr: 6,
        email: "Zeel@example.com",
        name: "Zeel Done",
        organization: "ABC",
        balance: 15422.254544,
        status: "Active"
      }
    ];

    const userStatusData = [
      {
        value: 215,
        type: "Active"
      },
      {
        value: 45,
        type: "Inactive"
      },
      {
        value: 12,
        type: "Suspended"
      },
      {
        value: 37,
        type: "Deleted"
      },
      {
        value: 14,
        type: "Freeze"
      },
      {
        value: 37,
        type: "Inoperative"
      }
    ];

    const userTypesData = [
      {
        value: 8,
        type: "JBSPL"
      },
      {
        value: 115,
        type: "Bitgo"
      },
      {
        value: 12,
        type: "Fiat"
      },
      {
        value: 24,
        type: "Local"
      },
      {
        value: 5,
        type: "Eth"
      },
      {
        value: 42,
        type: "Other"
      }
    ];
    let statusFilter;
    if (!this.state.click) {
      let value1 = "" + this.state.valueFromCard1;
      statusFilter = data.filter(function(value) {
        return value.status === value1;
      });
    }
    if (this.state.click) {
      let value2 = "" + this.state.valueFromCard2;
      statusFilter = data.filter(function(value) {
        return value.organization === value2;
      });
    }

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
    const { drawerClose } = this.props;
    return (
      <JbsCollapsibleCard>
        <div className="page-title d-flex justify-content-between align-items-center">
          <h2>
            <span>{<IntlMessages id="wallet.walletUser" />}</span>
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
          <h5>{<IntlMessages id="wallet.userStatus" />}</h5>
          <Card1 data={userStatusData} callbackFromParent={this.myCallback} />
        </div>
        <div className="card-title">
          <h5>{<IntlMessages id="wallet.userType" />}</h5>
          <Card2 data={userTypesData} callbackFromParent={this.myCallback1} />
        </div>
        <div className="StackingHistory">
          {this.state.valueFromCard1 !== "" ||
          this.state.valueFromCard2 !== "" ? (
            <MUIDataTable
              title={<IntlMessages id="wallet.recentUsers" />}
              data={statusFilter.map(item => {
                return [
                  item.sr,
                  item.email,
                  item.name,
                  item.organization,
                  item.balance,
                  item.status
                ];
              })}
              columns={columns}
              options={options}
            />
          ) : (
            <MUIDataTable
              title={"Recent Wallets"}
              data={data.map(item => {
                return [
                  item.sr,
                  item.email,
                  item.name,
                  item.organization,
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
