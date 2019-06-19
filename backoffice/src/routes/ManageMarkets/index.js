// Component For Api COnfiguration List By Tejas

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import { NotificationManager } from "react-notifications";
import MatButton from "@material-ui/core/Button";

import $ from 'jquery';

import {
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Col
} from "reactstrap";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import Tooltip from "@material-ui/core/Tooltip";

//Action Import for Payment Method  Report Add And Update
import {
  getMarketList,
  addMarketList,
  updateMarketList,
  deleteMarketList,

} from "Actions/ManageMarkets";

import { getTradePairs } from "Actions/TradeRecon";

import { getCurrencyList } from "Actions/DaemonConfigure";

import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

class ManageMarkets extends Component {
  constructor() {
    super();
    this.state = {
      marketList: [],
      providerList: [],
      loader: false,
      addNewData: false,
      selectedCurrency: "",
      selectedProvider: "",
      currencyList: [],
      trnLimit: "",
      dailyLimit: "",
      weeklyLimit: "",
      monthlyLimit: "",
      lifetimeLimit: "",
      selectedStatus: "",
      minAmtWithdraw: "",
      updateData: false,
      deleteData: false,
      deleteDataList: [],
      serviceId: 0,
      Id: 0,
      addMarket: false,
      updateMarket: false
    };
  }

  handleClose = () => {
    this.setState({
      addNewData: false,
      selectedCurrency: "",
      selectedProvider: "",
      trnLimit: "",
      dailyLimit: "",
      weeklyLimit: "",
      monthlyLimit: "",
      lifetimeLimit: "",
      selectedStatus: "",
      minAmtWithdraw: "",
      updateData: false,
      deleteData: false,
      addMarket: false,
      updateMarket: false
    });
  };

  componentWillReceiveProps(nextprops) {

    if (nextprops.marketList.length !== 0 && nextprops.error.length == 0 && this.state.addNewData == false && this.state.updateData == false) {
      this.setState({
        marketList: nextprops.marketList,
      })
    } else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      this.setState({
        marketList: [],
      })
    }

    if (nextprops.addMarketList.length && nextprops.error.length == 0 && this.state.addNewData) {
      this.props.getMarketList({})
      this.setState({
        addNewData: false
      })
    } else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0 && this.state.addNewData) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      this.setState({
        addNewData: false
      })
      //this.props.getMarketList({})
    }

    if (nextprops.updateMarketList && nextprops.error.length == 0 && this.state.updateData) {
      this.props.getMarketList({})
      this.setState({
        updateData: false
      })
    } else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0 && this.state.updateData) {
      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      this.setState({
        updateData: false
      })
      //this.props.getMarketList({})
    }


    if (nextprops.pairList) {
      this.setState({
        currencyList: nextprops.pairList
      });
    }
  }

  addNewData = event => {
    this.setState({
      updateData: false,
      addNewData: true,
      deleteData: false,
      deleteDataList: [],

    });
  };
  componentDidMount() {
    this.setState({ loader: true });
    this.props.getMarketList({});
    this.props.getTradePairs({});
  }

  handleChangeCurrency = event => {

    this.state.currencyList.map((value, key) => {
      if (value.SMSCode === event.target.value) {
        this.setState({ selectedCurrency: event.target.value, serviceId: value.ServiceId });
      }
    })
  };

  handleChangeStatus = event => {
    this.setState({ selectedStatus: event.target.value });
  };

  addCurrencyData = () => {
    const { selectedCurrency, selectedStatus, serviceId } = this.state;

    const data = {
      CurrencyName: selectedCurrency,
      Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0),
      ServiceID: serviceId
    };

    if (selectedCurrency === "") {
      NotificationManager.error("Please Select Currency");
    } else if (selectedStatus === "") {

      NotificationManager.error("Please Select Status");
    }
    else {
      this.props.addMarketList(data);
    }
  };

  updateCurrencyData = () => {
    const { selectedCurrency, selectedStatus, serviceId, Id } = this.state;

    const data = {
      CurrencyName: selectedCurrency,
      Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0),
      ServiceID: serviceId,
      ID: Id
    };

    if (selectedCurrency === "") {
      NotificationManager.error("Please Select Currency");
    } else if (selectedStatus === "") {

      NotificationManager.error("Please Select Status");
    } else {
      this.props.updateMarketList(data);
    }
  };

  deleteCurrencyData = () => {
    this.setState({
      deleteData: false
    });
    this.props.deleteMarketList(this.state.deleteDataList);
  };

  updateMarketList = (event, value) => {

    this.setState({
      updateData: true,
      addNewData: false,
      deleteData: false,
      selectedCurrency: value.CurrencyName,
      selectedStatus: value.Status,
      serviceId: value.ServiceID,
      Id: value.ID,
      deleteDataList: []
    });
  };

  deleteMarketList = (event, value) => {
    this.setState({
      updateData: false,
      addNewData: false,
      deleteData: true,
      deleteDataList: value
    });
  };

  render() {

    const columns = [
      {
        name: "#",
        options: { sort: false, filter: false }
      },
      {
        name: <IntlMessages id="manageMarkets.list.form.label.currency" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="manageMarkets.list.form.label.code" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="manageMarkets.list.form.label.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="manageMarkets.list.form.label.action" />,
        options: { sort: true, filter: true }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "stacked",
      selectableRows: false,
      print: false,
      search: false,
      download: false,
      viewColumns: false,
      filter: false,
      customToolbar: () => {
        return (
          <MatButton
            variant="raised"
            className="btn-primary text-white"
            onClick={this.addNewData}
          >
            <IntlMessages id="exchangefeedConfig.pairConfiguration.button.add" />
          </MatButton>
        );
      }
    };

    return (
      <div className="mb-10">
        {this.props.loading && <JbsSectionLoader />}
        <PageTitleBar
          title={<IntlMessages id="sidebar.manageMarkets" />}
          match={this.props.match}
        />
        <div className="StackingHistory">
          {this.state.marketList.length !== 0 ? (
            <MUIDataTable
              title={this.props.title}
              data={this.state.marketList.map((marketData, key) => {
                return [
                  key + 1,
                  marketData.CurrencyDesc,
                  marketData.CurrencyName,
                  <Fragment>
                    {marketData.Status == "Active" &&
                      <span
                        style={{ float: "left" }}
                        className={`badge badge-xs badge-success position-relative`}
                      >
                        &nbsp;
                  </span>
                    }

                    {marketData.Status == "InActive" &&
                      <span
                        style={{ float: "left" }}
                        className={`badge badge-xs badge-danger position-relative`}
                      >
                        &nbsp;
                  </span>
                    }


                    <div className="status pl-30">{marketData.Status}</div>
                  </Fragment>,
                  <Fragment>
                    <div className="list-action">
                      <Tooltip
                        title={<IntlMessages id="manageMarkets.tooltip.update" />}
                        disableFocusListener disableTouchListener
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={event =>
                            this.updateMarketList(event, marketData)
                          }
                        >
                          <i className="ti-pencil" />
                        </a>
                      </Tooltip>
                      <Tooltip
                        title={<IntlMessages id="manageMarkets.tooltip.delete" />}
                        disableFocusListener disableTouchListener
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={event =>
                            this.deleteMarketList(event, marketData)
                          }
                        >
                          <i className="ti-close" />
                        </a>
                      </Tooltip>
                    </div>
                  </Fragment>
                ];
              })}
              columns={columns}
              options={options}
            />
          ) : (
              ""
            )}
        </div>
        <Modal isOpen={this.state.addNewData}>
          <div className="text-center m-5">
            <h1 className="mt-10">
              {" "}
              {<IntlMessages id="manageMarkets.title.add" />}
            </h1>
          </div>
          <ModalBody>
            <Form className="m-10">
              <FormGroup row>
                <Label sm={4} for="curency">
                  {<IntlMessages id="manageMarkets.list.form.label.currency" />}
                </Label>
                <Col sm={8}>
                  <Input
                    type="select"
                    name="currency"
                    value={this.state.selectedCurrency}
                    onChange={(e) => this.handleChangeCurrency(e)}
                  >
                    <IntlMessages id="sidebar.pairConfiguration.errors.pairCurrency">
                      {(select) =>
                        <option value="">{select}</option>
                      }
                    </IntlMessages>

                    {this.state.currencyList.length && this.state.currencyList.map((item, key) => (
                      <option
                        value={item.SMSCode}
                        key={key}
                      >
                        {item.SMSCode}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="status">
                  <IntlMessages id="manageMarkets.list.form.label.status" />
                </Label>
                <Col sm={8}>
                  <Input
                    type="select"
                    name="status"
                    value={this.state.selectedStatus}
                    onChange={(e) => this.handleChangeStatus(e)}
                  >
                    <IntlMessages id="trading.pairconfig.placeholder.selectstatus">
                      {(select) =>
                        <option value="">{select}</option>
                      }
                    </IntlMessages>

                    <IntlMessages id="manageMarkets.list.column.label.status.active">
                      {(select) =>
                        <option value="1">{select}</option>
                      }
                    </IntlMessages>

                    <IntlMessages id="manageMarkets.list.column.label.status.inactive">
                      {(select) =>
                        <option value="0">{select}</option>
                      }
                    </IntlMessages>
                  </Input>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => this.addCurrencyData()}
            >
              <IntlMessages id="manageMarkets.list.button.save" />
            </MatButton>

            <MatButton
              variant="raised"
              className="btn-danger text-white"
              onClick={() => this.handleClose()}
            >
              <IntlMessages id="manageMarkets.list.button.cancel" />
            </MatButton>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.updateData}>
          <div className="text-center m-5">
            <h1 className="mt-10">
              {" "}
              {<IntlMessages id="manageMarkets.title.update" />}
            </h1>
          </div>
          <ModalBody>
            <Form className="m-10">
              <FormGroup row>
                <Label sm={4} for="curency">
                  {<IntlMessages id="manageMarkets.list.form.label.currency" />}
                </Label>
                <Col sm={8}>
                  <Input
                    type="select"
                    name="currency"
                    value={this.state.selectedCurrency}
                    onChange={(e) => this.handleChangeCurrency(e)}
                  >
                    <IntlMessages id="sidebar.pairConfiguration.errors.pairCurrency">
                      {(select) =>
                        <option value="">{select}</option>
                      }
                    </IntlMessages>

                    {this.state.currencyList.length && this.state.currencyList.map((item, key) => (
                      <option
                        value={item.SMSCode}
                        key={key}
                      >
                        {item.SMSCode}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="status">
                  <IntlMessages id="manageMarkets.list.form.label.status" />
                </Label>
                <Col sm={8}>
                  <Input
                    type="select"
                    name="status"
                    value={this.state.selectedStatus}
                    onChange={(e) => this.handleChangeStatus(e)}
                  >
                    <IntlMessages id="trading.pairconfig.placeholder.selectstatus">
                      {(select) =>
                        <option value="">{select}</option>
                      }
                    </IntlMessages>

                    <IntlMessages id="manageMarkets.list.column.label.status.active">
                      {(select) =>
                        <option value="1">{select}</option>
                      }
                    </IntlMessages>

                    <IntlMessages id="manageMarkets.list.column.label.status.inactive">
                      {(select) =>
                        <option value="0">{select}</option>
                      }
                    </IntlMessages>
                  </Input>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => this.updateCurrencyData()}
            >
              <IntlMessages id="manageMarkets.list.button.update" />
            </MatButton>

            <MatButton
              variant="raised"
              className="btn-danger text-white"
              onClick={() => this.handleClose()}
            >
              <IntlMessages id="manageMarkets.list.button.cancel" />
            </MatButton>
          </ModalFooter>
        </Modal>

        <Dialog
          open={this.state.deleteData}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            <IntlMessages id="manageMarkets.list.dialog.label.title" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <IntlMessages id="manageMarkets.list.dialog.label.text" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="raised"
              onClick={this.handleClose}
              className="btn-danger text-white mr-10"
            >
              <IntlMessages id="manageMarkets.dialogbox.button.no" />
            </Button>
            <Button
              variant="raised"
              onClick={this.deleteCurrencyData}
              className="btn-primary text-white mr-10"
            >
              <IntlMessages id="manageMarkets.dialogbox.button.yes" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

class CustomToolbarSelect extends Component {
  deleteMultipleRows() {
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(this.props.MarketList[this.props.selectedRows[i].index]);
    }
    var request = { data: value, isDelete: 1 }; // is delete means delete records
    this.props.deleteMarketForm(request);
  }

  activeAll() {
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(this.props.MarketList[this.props.selectedRows[i].index]);
    }

    var request = { data: value, isActive: 1 }; // is active means active selected records
    this.props.deleteMarketForm(request);
  }

  inActiveAll() {
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(this.props.MarketList[this.props.selectedRows[i].index]);
    }

    var request = { data: value, isInActive: 1 }; // is inactive means inactive selected records
    this.props.deleteMarketForm(request);
  }

  render() {
    return (
      <div className={"mt-20 mr-20"}>
        <Tooltip title={<IntlMessages id="sidebar.Market.tooltip.active" />}
                 disableFocusListener disableTouchListener>
          <a href="javascript:void(0)" onClick={() => this.activeAll()}>
            <i className="ti-unlock font-2x" />
          </a>
        </Tooltip>{" "}
        <Tooltip title={<IntlMessages id="sidebar.Market.tooltip.inActive" />}
                 disableFocusListener disableTouchListener>
          <a href="javascript:void(0)" onClick={() => this.inActiveAll()}>
            <i className="ti-lock font-2x" />
          </a>
        </Tooltip>{" "}
        <Tooltip title={<IntlMessages id="sidebar.Market.tooltip.delete" />}
                 disableFocusListener disableTouchListener>
          <a
            href="javascript:void(0)"
            onClick={() => this.deleteMultipleRows()}
          >
            <i className="ti-trash font-2x" />
          </a>
        </Tooltip>
      </div>
    );
  }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  marketList: state.manageMarkets.marketList,
  currencyList: state.currencyList.currencyList,
  loading: state.manageMarkets.loading,
  error: state.manageMarkets.error,
  pairList: state.tradeRecon.pairList,
  addMarketList: state.manageMarkets.addMarketList,
  updateMarketList: state.manageMarkets.updateMarketList,
});

export default connect(
  mapStateToProps,
  {
    getMarketList,
    addMarketList,
    updateMarketList,
    deleteMarketList,
    getCurrencyList,
    getTradePairs
  }
)(ManageMarkets);
