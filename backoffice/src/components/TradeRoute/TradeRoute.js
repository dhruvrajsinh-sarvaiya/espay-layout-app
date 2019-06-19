import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { Table } from "reactstrap";
import { connect } from "react-redux";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import IntlMessages from "Util/IntlMessages";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import { getTradeRouteList, deleteTradeRoute } from "Actions/TradeRoute";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MatButton from "@material-ui/core/Button";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { getUserWallets } from "Actions/Wallet";
import TradeRouteAdd from "Components/TradingWidgets/Configuration/Components/trade-route/add";
import TradeRouteEdit from "Components/TradingWidgets/Configuration/Components/trade-route/edit";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';

const components = {
  TradeRouteAdd: TradeRouteAdd,
  TradeRouteEdit: TradeRouteEdit
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata) => {
  return React.createElement(components[TagName], {
    props,
    drawerClose,
    closeAll,
    pagedata
  });
};

class TradeRoute extends Component {
  state = {
    selectedDeletedTradeRoute: null,
    showDialog: false,
    dialogData: {},
    open: false,
    componentName: "",
    pagedata: {},
    Page_Size: AppConfig.totalRecordDisplayInList
  };
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false
    });
  };
  onClick = () => {
    this.setState({
      open: !this.state.open
    });
  };
  componentWillReceiveProps(nextprops) {
     if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
       this.setState({
        open: false,
      })
     
    }
   
  }
  showComponent = (componentName, page = "") => {
    if (typeof page != "undefined" && page !== "") {
      this.setState({ pagedata: page });
    }
    this.setState({
      componentName: componentName,
      open: !this.state.open
    });
  };
  componentWillMount() {
     
    this.props.getTradeRouteList();
  }
  onDeleteTradeRoute(item) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedDeletedTradeRoute: item });
  }
  deleteTradeRoute() {
    this.refs.deleteConfirmationDialog.close();
    let tradeRouteData = this.props.tradeRouteList;
    let index = tradeRouteData.indexOf(this.state.selectedDeletedTradeRoute);
    setTimeout(() => {
      tradeRouteData.splice(index, 1);
    }, 1500);
    this.props.deleteTradeRoute(index);
  }
  // addNewTradeRoute() {
  //   this.props.history.push({ pathname: "/app/trade-route/add" });
  // }
  viewRouteDetail(data) {
    this.setState({ showDialog: true, dialogData: data });
  }
  render() {
    const { drawerClose } = this.props;
    const columns = [
      {
        name: <IntlMessages id="table.id" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.pair" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.type" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.trnType" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.action" />,
        options: { sort: true, filter: false }
      }
    ];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      download: false,
      viewColumns: false,
      print: false,
      search: true,
      rowsPerPage: this.state.Page_Size,
      customToolbar: () => {
        return (
          <MatButton
            variant="raised"
            className="btn-primary text-white mt-5"
            style={{ float: "right" }}
            onClick={() => this.showComponent("TradeRouteAdd")}
          >
            <IntlMessages id="button.addNew" />
          </MatButton>
        );
      }
    };
    return (
      <JbsCollapsibleCard>
        <WalletPageTitle title={<IntlMessages id="sidebar.tradeRoute" />} drawerClose={drawerClose} closeAll={this.closeAll} />
        <div className="StackingHistory">
          <MUIDataTable
            data={this.props.tradeRouteList.map(item => {
              return [
                item.id,
                item.pair,
                item.type,
                item.trnType,
                item.status,
                <div className="list-action">
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.viewRouteDetail(item)}
                  >
                    <i className="ti-eye" />
                  </a>
                  <a
                    className="mr-10"
                    href="javascript:void(0)"
                    onClick={e => this.showComponent("TradeRouteEdit", item.id)}
                  // onClick={e =>
                  //   this.props.history.push({
                  //     pathname: "/app/trade-route/edit",
                  //     state: {
                  //       tradeRouteId: item.id
                  //     }
                  //   })
                  // }
                  >
                    <i className="ti-pencil" />
                  </a>
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.onDeleteTradeRoute(item)}
                  >
                    <i className="ti-close" />
                  </a>
                </div>
              ];
            })}
            columns={columns}
            options={options}
          />
          {/* Delete Customer Confirmation Dialog */}
          <DeleteConfirmationDialog
            ref="deleteConfirmationDialog"
            title="Are You Sure Want To Delete?"
            message="Are You Sure Want To Delete Permanently This Data."
            onConfirm={() => this.deleteTradeRoute()}
          />
          <Dialog
            onClose={() => this.setState({ showDialog: false })}
            open={this.state.showDialog}
            style={{ zIndex: "99999" }}
          >
            <DialogTitle id="form-dialog-title">
              <span className="justify-content-between d-flex">
                <span className="py-15">BTC/ETH</span>
                <IconButton
                  onClick={() => this.setState({ showDialog: false })}
                >
                  <CloseIcon />
                </IconButton>
              </span>
            </DialogTitle>
            <DialogContent>
              {this.state.selectedData !== null && (
                <div>
                  <div className="clearfix d-flex">
                    <div className="media pull-left">
                      <div className="media-body">
                        <Table bordered>
                          <thead>
                            <tr>
                              <th>
                                <IntlMessages id="Order" />
                              </th>
                              <th>
                                <IntlMessages id="Routes" />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{1}</td>
                              <td>{"www.binance.com"}</td>
                            </tr>
                            <tr>
                              <td>{2}</td>
                              <td>{"www.tradesatoshi.com"}</td>
                            </tr>
                            <tr>
                              <td>{3}</td>
                              <td>{"www.coinbase.com"}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <Drawer
          width="100%"
          handler={false}
          open={this.state.open}
          onMaskClick={this.toggleDrawer}
          className="drawer2"
          level=".drawer1"
          placement="right"
          levelMove={100}
        >
          {this.state.componentName !== "" &&
            dynamicComponent(
              this.state.componentName,
              this.props,
              this.onClick,
              this.closeAll,
              this.state.pagedata
            )}
        </Drawer>
      </JbsCollapsibleCard>
    );
  }
}

const mapStateToProps = ({ tradeRoute, drawerclose }) => {
  const { tradeRouteList, loading } = tradeRoute;
  if (drawerclose.bit === 1) {
    setTimeout(function () {
      drawerclose.bit = 2
    }, 1000);
  }
  return { tradeRouteList, loading, drawerclose };
};

export default connect(
  mapStateToProps,
  {
    getTradeRouteList,
    deleteTradeRoute
  }
)(TradeRoute);
