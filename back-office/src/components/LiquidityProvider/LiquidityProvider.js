/**
 * Basic Table
 */
import React, { Component, Fragment } from "react";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { NotificationManager } from "react-notifications";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MatButton from "@material-ui/core/Button";
import { validateOnlyNumeric } from "../../validation/ApiConfigure/ApiConfiguration";

import {
  Fade,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Col
} from "reactstrap";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

//Added By Tejas For Get Data With Saga
import {
  getLiquidityProviderList,
  addLiquidityProviderList,
  updateLiquidityProviderList,
  deleteLiquidityProviderList,
  getProvidersList
} from "Actions/LiquidityManager";

// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

class LiquidityProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      fadeInspotorder: false,
      fadeInmarketorder: false,
      fadeInlimitspotorder: false,
      openViewUserDialog: false,
      employeePayroll: null,
      liquidityProviderList: [],
      selectedUser: "",
      updateData: false,
      addNewData: false,
      deleteData: false,
      deleteDataList: [],
      selectedPair: "",
      selectedLiquidityProvider: "",
      selectedCurrencyPair: "",
      selectedStatus: "",
      spendingLimit: "",
      spotMinOrder: "",
      spotMaxOrder: "",
      marketMinOrder: "",
      marketMaxOrder: "",
      limitSpotMinOrder: "",
      limitSpotMaxOrder: ""
    };

    this.toggle = this.toggle.bind(this);
    this.spotorder = this.spotorder.bind(this);
    this.marketorder = this.marketorder.bind(this);
    this.limitspotorder = this.limitspotorder.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  spotorder() {
    this.setState({
      fadeInspotorder: !this.state.fadeInspotorder,
      spotMinOrder: "",
      spotMaxOrder: ""
    });
  }
  marketorder() {
    this.setState({
      fadeInmarketorder: !this.state.fadeInmarketorder,
      marketMinOrder: "",
      marketMaxOrder: ""
    });
  }
  limitspotorder() {
    this.setState({
      fadeInlimitspotorder: !this.state.fadeInlimitspotorder,
      limitSpotMinOrder: "",
      limitSpotMaxOrder: ""
    });
  }

  handleChangeLiquidityProvider = event => {
    this.setState({
      selectedLiquidityProvider: event.target.value
    });
  };

  handleChangeCurrencyPair = event => {
    this.setState({
      selectedCurrencyPair: event.target.value
    });
  };

  handleChangeStatus = event => {
    this.setState({
      selectedStatus: event.target.value
    });
  };

  handleChangeSpendingLimit = event => {
    if ((validateOnlyNumeric(event.target.value)) || (event.target.value === "")) {
      this.setState({
        spendingLimit: event.target.value
      });
    }
  };

  handleChangeSpotMinAmount = event => {
    if ((event.target.value !== "" && validateOnlyNumeric(event.target.value)) || (event.target.value === "")) {
      this.setState({
        spotMinOrder: event.target.value
      });
    }
  };

  handleChangeSpotMaxAmount = event => {
    if ((event.target.value !== "" && validateOnlyNumeric(event.target.value)) || (event.target.value === "")) {
      this.setState({
        spotMaxOrder: event.target.value
      });
    }
  };

  handleChangeMarketMinAmount = event => {
    if ((event.target.value !== "" && validateOnlyNumeric(event.target.value)) || (event.target.value === "")) {
      this.setState({
        marketMinOrder: event.target.value
      });
    }
  };

  handleChangeMarketMaxAmount = event => {
    if ((event.target.value !== "" && validateOnlyNumeric(event.target.value)) || (event.target.value === "")) {
      this.setState({
        marketMaxOrder: event.target.value
      });
    }
  };

  handleChangeLimitSpotMinAmount = event => {
    if ((event.target.value !== "" && validateOnlyNumeric(event.target.value)) || (event.target.value === "")) {
      this.setState({
        limitSpotMinOrder: event.target.value
      });
    }
  };

  handleChangeLimitSpotMaxAmount = event => {
    if ((event.target.value !== "" && validateOnlyNumeric(event.target.value)) || (event.target.value === "")) {
      this.setState({
        limitSpotMaxOrder: event.target.value
      });
    }
  };

  /**
   * View Liquidity Provider
   */
  viewUserDetail(data) {
    this.setState({ openViewUserDialog: true, selectedUser: data });
  }
  onDelete(data) {
    this.refs.deleteConfirmationDialog.open();
    this.setState({ selectedUser: data });
  }

  handleClose = () => {
    this.setState({
      updateData: false,
      addNewData: false,
      deleteData: false,
      deleteDataList: [],
      selectedPair: "",
      selectedLiquidityProvider: "",
      selectedCurrencyPair: "",
      selectedStatus: "",
      spendingLimit: "",
      fadeInspotorder: false,
      spotMinOrder: "",
      spotMaxOrder: "",
      fadeInmarketorder: false,
      marketMinOrder: "",
      marketMaxOrder: "",
      fadeInlimitspotorder: false,
      limitSpotMinOrder: "",
      limitSpotMaxOrder: ""
    });
  };

  addNewProviderData = event => {
    this.setState({
      updateData: false,
      addNewData: true,
      deleteData: false,
      deleteDataList: [],
      selectedPair: "",
      selectedLiquidityProvider: "",
      selectedCurrencyPair: "",
      selectedStatus: "",
      spendingLimit: "",
      fadeInspotorder: false,
      spotMinOrder: "",
      spotMaxOrder: "",
      fadeInmarketorder: false,
      marketMinOrder: "",
      marketMaxOrder: "",
      fadeInlimitspotorder: false,
      limitSpotMinOrder: "",
      limitSpotMaxOrder: ""
    });
  };

  deleteProviderList = value => {
    this.setState({
      updateData: false,
      addNewData: false,
      deleteData: true,
      deleteDataList: value
    });
  };

  deleteProviderData = () => {
    this.setState({
      deleteData: false
    });
    this.props.deleteLiquidityProviderList(this.state.deleteDataList);
  };

  componentWillReceiveProps(nextprops) {
    if (nextprops.addLiquidityProviderList) {
      this.setState({
        updateData: false,
        addNewData: false,
        deleteData: false,
        deleteProviderData: []
      });
    }

    if (nextprops.updateLiquidityProviderList) {
      this.setState({
        updateData: false,
        addNewData: false,
        deleteData: false,
        deleteProviderData: []
      });
    }
    if (nextprops.deleteLiquidityProviderList) {
      this.setState({
        updateData: false,
        addNewData: false,
        deleteData: false,
        deleteProviderData: []
      });
    }
  }

  componentDidMount() {
    this.props.getLiquidityProviderList();
    this.props.getProvidersList();
  }

  addProviderData = () => {
    const {
      selectedCurrencyPair,
      selectedLiquidityProvider,
      selectedStatus,
      spendingLimit,
      fadeInspotorder,
      spotMinOrder,
      spotMaxOrder,
      fadeInmarketorder,
      marketMinOrder,
      marketMaxOrder,
      fadeInlimitspotorder,
      limitSpotMinOrder,
      limitSpotMaxOrder
    } = this.state;

    const data = {
      currencyPair: selectedCurrencyPair,
      liquidityProvider: selectedLiquidityProvider,
      spendingLimit: spendingLimit,
      status: selectedStatus,
      spotOrder: fadeInspotorder,
      spotMinOrder: spotMinOrder,
      spotMaxOrder: spotMaxOrder,
      marketOrder: fadeInmarketorder,
      marketMinOrder: marketMinOrder,
      marketMaxOrder: marketMaxOrder,
      limitSpotOrder: fadeInlimitspotorder,
      limitSpotMinOrder: limitSpotMinOrder,
      limitSpotMaxOrder: limitSpotMaxOrder
    };

    if (
      selectedCurrencyPair === "" ||
      selectedLiquidityProvider === "" ||
      selectedStatus === "" ||
      spendingLimit === "" ||
      (fadeInmarketorder
        ? marketMinOrder === "" || marketMaxOrder === ""
        : false) ||
      (fadeInspotorder ? spotMinOrder === "" || spotMaxOrder === "" : false) ||
      (fadeInlimitspotorder
        ? limitSpotMinOrder === "" || limitSpotMaxOrder === ""
        : false)
    ) {
      NotificationManager.error("Please Enter Proper Data");
    } else {
      this.props.addLiquidityProviderList(data);
    }
  };

  updateProviderData = () => {
    const {
      selectedCurrencyPair,
      selectedLiquidityProvider,
      selectedStatus,
      spendingLimit,
      fadeInspotorder,
      spotMinOrder,
      spotMaxOrder,
      fadeInmarketorder,
      marketMinOrder,
      marketMaxOrder,
      fadeInlimitspotorder,
      limitSpotMinOrder,
      limitSpotMaxOrder
    } = this.state;

    const data = {
      currencyPair: selectedCurrencyPair,
      liquidityProvider: selectedLiquidityProvider,
      spendingLimit: spendingLimit,
      status: selectedStatus,
      spotOrder: fadeInspotorder,
      spotMinOrder: spotMinOrder,
      spotMaxOrder: spotMaxOrder,
      marketOrder: fadeInmarketorder,
      marketMinOrder: marketMinOrder,
      marketMaxOrder: marketMaxOrder,
      limitSpotOrder: fadeInlimitspotorder,
      limitSpotMinOrder: limitSpotMinOrder,
      limitSpotMaxOrder: limitSpotMaxOrder
    };

    if (
      selectedCurrencyPair === "" ||
      selectedLiquidityProvider === "" ||
      selectedStatus === "" ||
      spendingLimit === ""
    ) {
      NotificationManager.error("Please Enter Proper Data");
    } else {
      if (fadeInspotorder) {
        if (spotMinOrder === "" || spotMaxOrder === "") {
          NotificationManager.error("Please Enter Spot Order Data");
        }
      } else if (fadeInmarketorder) {
        if (marketMinOrder === "" || marketMaxOrder === "") {
          NotificationManager.error("Please Enter MArket  Order Data");
        }
      } else if (fadeInlimitspotorder) {
        if (limitSpotMinOrder === "" || limitSpotMaxOrder === "") {
          NotificationManager.error("Please Enter Spot Limit Order Data");
        }
      } else {
        this.props.updateLiquidityProviderList(data);
      }
    }
  };

  updateProviderList = value => {
    this.setState({
      updateData: true,
      addNewData: false,
      deleteData: false,
      selectedLiquidityProvider: "",
      selectedCurrencyPair: value.Pair,
      selectedStatus: value.status,
      spendingLimit: value.SpendingLimit,
      spotMinOrder: value.SpotOrder,
      spotMaxOrder: "",
      marketMinOrder: value.MarketOrder,
      marketMaxOrder: "",
      limitSpotMinOrder: value.LimitStopOrder,
      limitSpotMaxOrder: "",
      deleteDataList: []
    });
  };

  render() {
    const { selectedUser } = this.state;
    const { liquidityProviderList, currencyList, providersList } = this.props;

    const columns = [
      {
        name: <IntlMessages id="liquidityprovider.list.column.label.pair" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="liquidityprovider.list.column.label.spendinglimit" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="liquidityprovider.list.column.label.marketorder" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="liquidityprovider.list.column.label.spotorder" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="liquidityprovider.list.column.label.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="liquidityprovider.list.column.label.action" />,
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
            onClick={this.addNewProviderData}
          >
            <IntlMessages id="liquidityprovider.list.button.add" />
          </MatButton>
        );
      }
    };

    return (
      <div className="table-wrapper">
        <JbsCollapsibleCard fullBlock>
          <div className="StackingHistory">
            {liquidityProviderList !== 0 ? (
              <MUIDataTable
                title={this.props.title}
                data={liquidityProviderList.map((item, key) => {
                  return [
                    item.Pair,
                    item.SpendingLimit,
                    item.MarketOrder,
                    item.SpotOrder,
                    <Fragment>
                      <span
                        style={{ float: "left" }}
                        className={`badge badge-xs ${
                          item.badgeClass
                          }  position-relative`}
                      >
                        &nbsp;
                    </span>
                      <div className="status pl-30">{item.status}</div>
                    </Fragment>,
                    <Fragment>
                      <div className="list-action">
                        <Tooltip
                          title={
                            <IntlMessages id="liquidityprovider.tooltip.view" />
                          }
                        >
                          <a
                            href="javascript:void(0)"
                            className="mr-10"
                            onClick={event => this.viewUserDetail(item)}
                          >
                            <i className="ti-eye" />
                          </a>
                        </Tooltip>

                        <Tooltip
                          title={
                            <IntlMessages id="liquidityprovider.tooltip.update" />
                          }
                        >
                          <a
                            href="javascript:void(0)"
                            className="mr-10"
                            onClick={event => this.updateProviderList(item)}
                          >
                            <i className="ti-pencil" />
                          </a>
                        </Tooltip>
                        <Tooltip
                          title={
                            <IntlMessages id="liquidityprovider.tooltip.delete" />
                          }
                        >
                          <a
                            href="javascript:void(0)"
                            className="mr-10"
                            onClick={event => this.deleteProviderList(item)}
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
        </JbsCollapsibleCard>
        <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Are You Sure Want To Delete?"
          message="This will delete user permanently."
          onConfirm={() => this.deleteUserPermanently()}
        />
        <Row>
          <Modal
            isOpen={this.state.addNewData}
            toggle={this.toggle}
            className={this.props.className}
          >
            <div className="text-center m-5">
              <h1 className="mt-10">
                {" "}
                {<IntlMessages id="liquidityprovider.list.title.addnewlist" />}
              </h1>
            </div>
            <ModalBody className="LiquidityProviderScroll">
              <Form className="m-10">
                <FormGroup row>
                  <Label sm={4} for="Provider">
                    {<IntlMessages id="liquidityprovider.list.option.label.liquidityprovider" />}
                  </Label>
                  <Col sm={8}>
                    <FormControl className="">
                      <InputLabel>
                        {<IntlMessages id="liquidityprovider.list.option.label.liquidityprovider" />}
                      </InputLabel>
                      <Select
                        value={this.state.selectedLiquidityProvider}
                        onChange={this.handleChangeLiquidityProvider}
                      >
                        {providersList
                          ? providersList.map((value, key) => (
                            <MenuItem key={key} value={value.name}>
                              {value.name}
                            </MenuItem>
                          ))
                          : ""}
                      </Select>
                    </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} for="Provider">
                    {<IntlMessages id="liquidityprovider.list.option.label.currencypair" />}
                  </Label>
                  <Col sm={8}>
                    <FormControl className="">
                      <InputLabel>
                        {<IntlMessages id="liquidityprovider.list.option.label.currencypair" />}
                      </InputLabel>
                      <Select
                        value={this.state.selectedCurrencyPair}
                        onChange={this.handleChangeCurrencyPair}
                      >
                        {currencyList
                          ? currencyList.map((value, key) => (
                            <MenuItem key={key} value={value.pair}>
                              {value.pair}
                            </MenuItem>
                          ))
                          : ""}
                      </Select>
                    </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} for="spendinglimit">
                    <IntlMessages id="liquidityprovider.list.column.label.spendinglimit" />
                  </Label>
                  <Col sm={8}>
                    <Input
                      type="text"
                      name="spendinglimit"
                      id="spendinglimit"
                      placeholder=""
                      value={this.state.spendingLimit}
                      onChange={this.handleChangeSpendingLimit}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm={4} for="Provider">
                    {<IntlMessages id="liquidityprovider.list.column.label.status" />}
                  </Label>
                  <Col sm={8}>
                    <FormControl className="">
                      <InputLabel>
                        {<IntlMessages id="liquidityprovider.list.column.label.status" />}
                      </InputLabel>
                      <Select
                        value={this.state.selectedStatus}
                        onChange={this.handleChangeStatus}
                      >
                        <MenuItem value="Enable">
                          <IntlMessages id="liquidityprovider.list.option.label.enable" />
                        </MenuItem>
                        <MenuItem value="Disable">
                          <IntlMessages id="liquidityprovider.list.option.label.disable" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup className="ml-20">
                  <Row>
                    <Col sm={4}>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="marketorder"
                          id="marketorder"
                          onClick={this.marketorder}
                        />
                        <IntlMessages id="liquidityprovider.list.column.label.marketorder" />
                      </Label>
                    </Col>
                    <Col sm={4}>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="spotorder"
                          id="spotorder"
                          onClick={this.spotorder}
                        />
                        <IntlMessages id="liquidityprovider.list.column.label.spotorder" />
                      </Label>
                    </Col>
                    <Col sm={4}>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="limitspotorder"
                          id="limitspotorder"
                          onClick={this.limitspotorder}
                        />
                        <IntlMessages id="liquidityprovider.list.column.label.limitspotorder" />
                      </Label>
                    </Col>
                  </Row>
                </FormGroup>
                <Fade in={this.state.fadeInmarketorder} tag="div">
                  <FormGroup row>
                    <Label sm={4} for="minorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.marketminorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="minorderamount"
                        id="minorderamount"
                        placeholder="Min Order Amount"
                        value={this.state.marketMinOrder}
                        onChange={this.handleChangeMarketMinAmount}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} for="mixorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.marketmaxorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="mixorderamount"
                        id="mixorderamount"
                        placeholder="Mix Order Amount"
                        value={this.state.marketMaxOrder}
                        onChange={this.handleChangeMarketMaxAmount}
                      />
                    </Col>
                  </FormGroup>
                </Fade>
                <Fade in={this.state.fadeInspotorder} tag="div">
                  <FormGroup row>
                    <Label sm={4} for="spotminorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.spotminorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="spotminorderamount"
                        id="spotminorderamount"
                        placeholder="Spot Min Order Amount"
                        value={this.state.spotMinOrder}
                        onChange={this.handleChangeSpotMinAmount}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} for="spotmixorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.spotmaxorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="spotmixorderamount"
                        id="spotmixorderamount"
                        placeholder="Spot Mix Order Amount"
                        value={this.state.spotMaxOrder}
                        onChange={this.handleChangeSpotMaxAmount}
                      />
                    </Col>
                  </FormGroup>
                </Fade>
                <Fade in={this.state.fadeInlimitspotorder} tag="div">
                  <FormGroup row>
                    <Label sm={4} for="limitspotminorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.limitspotminorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="limitspotminorderamount"
                        id="limitspotminorderamount"
                        placeholder="Limit Spot Min Order Amount"
                        value={this.state.limitSpotMinOrder}
                        onChange={this.handleChangeLimitSpotMinAmount}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} for="limitspotmixorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.limitspotmaxorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="limitspotmixorderamount"
                        id="limitspotmixorderamount"
                        placeholder="Limit Spot Mix Order Amount"
                        value={this.state.limitSpotMaxOrder}
                        onChange={this.handleChangeLimitSpotMaxAmount}
                      />
                    </Col>
                  </FormGroup>
                </Fade>
              </Form>
            </ModalBody>
            <ModalFooter>
              <MatButton
                variant="raised"
                className="btn-primary text-white"
                onClick={() => this.addProviderData()}
              >
                <IntlMessages id="liquidityprovider.list.button.save" />
              </MatButton>
              <MatButton
                variant="raised"
                className="btn-danger text-white"
                onClick={() => this.handleClose()}
              >
                <IntlMessages id="liquidityprovider.list.button.cancel" />
              </MatButton>
            </ModalFooter>
          </Modal>
          <Modal
            isOpen={this.state.updateData}
            toggle={this.toggle}
            className={this.props.className}
          >
            <div className="text-center m-5">
              <h1 className="mt-10">
                {" "}
                {<IntlMessages id="liquidityapi.list.title.updatelistpro" />}
              </h1>
            </div>
            <ModalBody className="LiquidityProviderScroll">
              <Form className="m-10">
                <FormGroup row>
                  <Label sm={4} for="Provider">
                    {<IntlMessages id="liquidityprovider.list.option.label.liquidityprovider" />}
                  </Label>
                  <Col sm={8}>
                    <FormControl className="">
                      <InputLabel>
                        {<IntlMessages id="liquidityprovider.list.option.label.liquidityprovider" />}
                      </InputLabel>
                      <Select
                        value={this.state.selectedLiquidityProvider}
                        onChange={this.handleChangeLiquidityProvider}
                      >
                        {providersList
                          ? providersList.map((value, key) => (
                            <MenuItem key={key} value={value.name}>
                              {value.name}
                            </MenuItem>
                          ))
                          : ""}
                      </Select>
                    </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} for="Provider">
                    {<IntlMessages id="liquidityprovider.list.option.label.currencypair" />}
                  </Label>
                  <Col sm={8}>
                    <FormControl className="">
                      <InputLabel>
                        {<IntlMessages id="liquidityprovider.list.option.label.currencypair" />}
                      </InputLabel>
                      <Select
                        value={this.state.selectedCurrencyPair}
                        onChange={this.handleChangeCurrencyPair}
                      >
                        {currencyList
                          ? currencyList.map((value, key) => (
                            <MenuItem key={key} value={value.pair}>
                              {value.pair}
                            </MenuItem>
                          ))
                          : ""}
                      </Select>
                    </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} for="spendinglimit">
                    <IntlMessages id="liquidityprovider.list.column.label.spendinglimit" />
                  </Label>
                  <Col sm={8}>
                    <Input
                      type="text"
                      name="spendinglimit"
                      id="spendinglimit"
                      placeholder=""
                      value={this.state.spendingLimit}
                      onChange={this.handleChangeSpendingLimit}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} for="Provider">
                    {<IntlMessages id="liquidityprovider.list.column.label.status" />}
                  </Label>
                  <Col sm={8}>
                    <FormControl className="">
                      <InputLabel>
                        {<IntlMessages id="liquidityprovider.list.column.label.status" />}
                      </InputLabel>
                      <Select
                        value={this.state.selectedStatus}
                        onChange={this.handleChangeStatus}
                      >
                        <MenuItem value="Enable">
                          <IntlMessages id="liquidityprovider.list.option.label.enable" />
                        </MenuItem>
                        <MenuItem value="Disable">
                          <IntlMessages id="liquidityprovider.list.option.label.disable" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup className="ml-20">
                  <Row>
                    <Col sm={4}>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="marketorder"
                          id="marketorder"
                          onClick={this.marketorder}
                        />
                        <IntlMessages id="liquidityprovider.list.column.label.marketorder" />
                      </Label>
                    </Col>
                    <Col sm={4}>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="spotorder"
                          id="spotorder"
                          onClick={this.spotorder}
                        />
                        <IntlMessages id="liquidityprovider.list.column.label.spotorder" />
                      </Label>
                    </Col>
                    <Col sm={4}>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="limitspotorder"
                          id="limitspotorder"
                          onClick={this.limitspotorder}
                        />
                        <IntlMessages id="liquidityprovider.list.column.label.limitspotorder" />
                      </Label>
                    </Col>
                  </Row>
                </FormGroup>
                <Fade in={this.state.fadeInmarketorder} tag="div">
                  <FormGroup row>
                    <Label sm={4} for="minorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.marketminorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="minorderamount"
                        id="minorderamount"
                        placeholder="Min Order Amount"
                        value={this.state.marketMinOrder}
                        onChange={this.handleChangeMarketMinAmount}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} for="mixorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.marketmaxorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="mixorderamount"
                        id="mixorderamount"
                        placeholder="Mix Order Amount"
                        value={this.state.marketMaxOrder}
                        onChange={this.handleChangeMarketMaxAmount}
                      />
                    </Col>
                  </FormGroup>
                </Fade>
                <Fade in={this.state.fadeInspotorder} tag="div">
                  <FormGroup row>
                    <Label sm={4} for="spotminorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.spotminorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="spotminorderamount"
                        id="spotminorderamount"
                        placeholder="Spot Min Order Amount"
                        value={this.state.spotMinOrder}
                        onChange={this.handleChangeSpotMinAmount}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} for="spotmixorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.spotmaxorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="spotmixorderamount"
                        id="spotmixorderamount"
                        placeholder="Spot Mix Order Amount"
                        value={this.state.spotMaxOrder}
                        onChange={this.handleChangeSpotMaxAmount}
                      />
                    </Col>
                  </FormGroup>
                </Fade>
                <Fade in={this.state.fadeInlimitspotorder} tag="div">
                  <FormGroup row>
                    <Label sm={4} for="limitspotminorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.limitspotminorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="limitspotminorderamount"
                        id="limitspotminorderamount"
                        placeholder="Limit Spot Min Order Amount"
                        value={this.state.limitSpotMinOrder}
                        onChange={this.handleChangeLimitSpotMinAmount}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4} for="limitspotmixorderamount">
                      <IntlMessages id="liquidityprovider.list.column.label.limitspotmaxorder" />
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="limitspotmixorderamount"
                        id="limitspotmixorderamount"
                        placeholder="Limit Spot Mix Order Amount"
                        value={this.state.limitSpotMaxOrder}
                        onChange={this.handleChangeLimitSpotMaxAmount}
                      />
                    </Col>
                  </FormGroup>
                </Fade>
              </Form>
            </ModalBody>
            <ModalFooter>
              <MatButton
                variant="raised"
                className="btn-primary text-white"
                onClick={() => this.updateProviderData()}
              >
                <IntlMessages id="liquidityprovider.list.button.save" />
              </MatButton>
              <MatButton
                variant="raised"
                className="btn-danger text-white"
                onClick={() => this.handleClose()}
              >
                <IntlMessages id="liquidityprovider.list.button.cancel" />
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
              <IntlMessages id="liquidityprovider.list.dialog.label.title" />
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <IntlMessages id="liquidityprovider.list.dialog.label.text" />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="raised"
                onClick={this.handleClose}
                className="btn-danger text-white mr-10"
              >
                <IntlMessages id="liquidityprovider.dialogbox.button.no" />
              </Button>
              <Button
                variant="raised"
                onClick={this.deleteProviderData}
                className="btn-primary text-white mr-10"
              >
                <IntlMessages id="liquidityprovider.dialogbox.button.yes" />
              </Button>
            </DialogActions>
          </Dialog>
        </Row>
        <Dialog
          onClose={() => this.setState({ openViewUserDialog: false })}
          open={this.state.openViewUserDialog}
        >
          <DialogContent>
            {selectedUser !== null && (
              <div>
                <div className="clearfix d-flex">
                  <div className="media pull-left">
                    <div className="media-body">
                      <p>
                        <IntlMessages id="liquidityprovider.list.column.label.pair" />{" "}
                        : <span className="fw-bold">{selectedUser.Pair}</span>
                      </p>
                      <p>
                        <IntlMessages id="liquidityprovider.list.column.label.spendinglimit" />{" "}
                        :{" "}
                        <span className="fw-bold">
                          {selectedUser.SpendingLimit}
                        </span>
                      </p>
                      <p>
                        <IntlMessages id="liquidityprovider.list.column.label.marketorder" />{" "}
                        :{" "}
                        <span className="badge badge-warning">
                          {selectedUser.MarketOrder}
                        </span>
                      </p>
                      <p>
                        <IntlMessages id="liquidityprovider.list.column.label.spotorder" />{" "}
                        :{" "}
                        <span className="badge badge-success">
                          {selectedUser.SpotOrder}
                        </span>
                      </p>
                      <p>
                        <IntlMessages id="liquidityprovider.list.column.label.status" />{" "}
                        : {selectedUser.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

//export default LiquidityProvider;
// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  liquidityProviderList: state.liquidityManager.liquidityProviderList,
  providersList: state.currencyList.providersList,
  currencyList: state.currencyList.currencyList
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getLiquidityProviderList,
    addLiquidityProviderList,
    updateLiquidityProviderList,
    deleteLiquidityProviderList,
    getProvidersList,
  }
)(LiquidityProvider);
