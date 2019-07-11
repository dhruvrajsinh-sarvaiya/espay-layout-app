/**
 * Basic Table
 */
import React, { Component, Fragment } from "react";
import { Modal, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col } from "reactstrap";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MatButton from "@material-ui/core/Button";

import { NotificationManager } from "react-notifications";

import { validateOnlyNumeric } from "Validations/ApiConfigure/ApiConfiguration";

//Added By Tejas For Get Data With Saga
import {
  getLiquidityManagerList,
  addLiquidityManagerList,
  updateLiquidityManagerList
} from "Actions/LiquidityManager";


import { connect } from "react-redux";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

import AppConfig from 'Constants/AppConfig';

class LiquidityApiManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      updateData: false,
      addNewData: false,
      selectedProvider: "",
      apiKey: "",
      isUsedBuyTransaction: false,
      apiSecret: "",
      callLimit: "",
      selectedStatus: "",
      isUsedSellTransaction: false,
      isUsedWithdrawTransaction: false,
      isUsedAddressGeneration: false,
      liquidityApiList: []
    };

    this.toggle = this.toggle.bind(this);
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.addliquidityApiList) {
      this.setState({
        updateData: false,
        addNewData: false
      });
    }

    if (nextprops.liquidityApiList) {
      this.setState({
        liquidityApiList: nextprops.liquidityApiList
      })
    }

    if (nextprops.updateliquidityApiList) {
      this.setState({
        updateData: false,
        addNewData: false
      });
    }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  state = {
    liquidityApiList: null
  };

  componentDidMount() {
    this.props.getLiquidityManagerList();
  }

  addNewAPIData = event => {
    this.setState({
      updateData: false,
      addNewData: true,
      selectedProvider: "",
      selectedStatus: "",
      apiKey: "",
      isUsedBuyTransaction: false,
      apiSecret: "",
      callLimit: "",
      isUsedSellTransaction: false,
      isUsedWithdrawTransaction: false,
      isUsedAddressGeneration: false
    });
  };

  updateAPIList = value => {
    this.setState({
      updateData: true,
      addNewData: false,
      selectedProvider: "",
      apiKey: "",
      isUsedBuyTransaction: false,
      apiSecret: "",
      callLimit: "",
      selectedStatus: value.status,
      isUsedSellTransaction: false,
      isUsedWithdrawTransaction: false,
      isUsedAddressGeneration: false
    });
  };

  handleClose = () => {
    this.setState({
      updateData: false,
      addNewData: false,
      selectedProvider: "",
      apiKey: "",
      isUsedBuyTransaction: false,
      apiSecret: "",
      callLimit: "",
      selectedStatus: "",
      isUsedSellTransaction: false,
      isUsedWithdrawTransaction: false,
      isUsedAddressGeneration: false
    });
  };

  addAPIProviderData = () => {
    const {
      selectedProvider,
      apiKey,
      isUsedBuyTransaction,
      apiSecret,
      callLimit,
      selectedStatus,
      isUsedSellTransaction,
      isUsedWithdrawTransaction,
      isUsedAddressGeneration
    } = this.state;

    const data = {
      provider: selectedProvider,
      apikey: apiKey,
      apisecret: apiSecret,
      callLimit: callLimit,
      status: selectedStatus,
      isSellTransaction: isUsedSellTransaction,
      isBuyTransaction: isUsedBuyTransaction,
      isUsedWithdrawTransaction: isUsedWithdrawTransaction,
      isAddressGeneration: isUsedAddressGeneration
    };

    if (
      apiKey === "" ||
      apiSecret === "" ||
      callLimit === "" ||
      selectedStatus === "" ||
      selectedProvider === ""
    ) {
      NotificationManager.error("Please Enter Proper Data");
    } else {
      this.props.addLiquidityManagerList(data);
    }
  };

  handleChangeProvider = event => {
    this.setState({
      selectedProvider: event.target.value
    });
  };

  handleChangeStatus = event => {
    this.setState({
      selectedStatus: event.target.value
    });
  };

  handleChangeApiSecret = event => {
    this.setState({
      apiSecret: event.target.value
    });
  };

  handleChangeApiKey = event => {
    this.setState({
      apiKey: event.target.value
    });
  };

  handleChangeCallLimit = event => {
    if (validateOnlyNumeric(event.target.value) || event.target.value === "") {
      this.setState({
        callLimit: event.target.value
      });
    }
  };

  handleChangeIsUsedBuy = () => {
    this.setState({
      isUsedBuyTransaction: !this.state.isUsedBuyTransaction
    });
  };

  handleChangeIsUsedSell = () => {
    this.setState({
      isUsedSellTransaction: !this.state.isUsedSellTransaction
    });
  };

  handleChangeIsUsedWithdraw = () => {
    this.setState({
      isUsedWithdrawTransaction: !this.state.isUsedWithdrawTransaction
    });
  };

  handleChangeIsAddressGen = () => {
    this.setState({
      isUsedAddressGeneration: !this.state.isUsedAddressGeneration
    });
  };

  updateAPIProviderData = () => {
    const {
      selectedProvider,
      apiKey,
      isUsedBuyTransaction,
      apiSecret,
      callLimit,
      selectedStatus,
      isUsedSellTransaction,
      isUsedWithdrawTransaction,
      isUsedAddressGeneration
    } = this.state;

    const data = {
      provider: selectedProvider,
      apikey: apiKey,
      apisecret: apiSecret,
      callLimit: callLimit,
      status: selectedStatus,
      isSellTransaction: isUsedSellTransaction,
      isBuyTransaction: isUsedBuyTransaction,
      isUsedWithdrawTransaction: isUsedWithdrawTransaction,
      isAddressGeneration: isUsedAddressGeneration
    };

    if (
      apiKey === "" ||
      apiSecret === "" ||
      callLimit === "" ||
      selectedStatus === "" ||
      selectedProvider === ""
    ) {
      NotificationManager.error("Please Enter Proper Data");
    } else {
      this.props.updateLiquidityManagerList(data);
    }
  };

  render() {
    const { providersList } = this.props;
    const { match } = this.props;

    const columns = [
      {
        name: <IntlMessages id="contactus.title.id" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="liquidityprovider.list.column.label.apiname" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="liquidityprovider.list.column.label.type" />,
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
      rowsPerPage: this.state.Page_Size,
      rowsPerPageOptions: AppConfig.rowsPerPageOptions,
      customToolbar: () => {
        return (
          <MatButton
            variant="raised"
            className="btn-primary text-white"
            onClick={this.addNewAPIData}
          >
            <IntlMessages id="liquidityprovider.list.button.add" />
          </MatButton>
        );
      }
    };

    return (
      <div className="jbs-page-content">
        <PageTitleBar
          title={<IntlMessages id="sidebar.Liquidity-API-Manager" />}
          match={match}
        />
        <JbsCollapsibleCard fullBlock>
          <div className="StackingHistory">
            {this.state.liquidityApiList.length !== 0 ? (
              <MUIDataTable
                title={this.props.title}
                data={this.state.liquidityApiList.map((item, key) => {
                  return [
                    key + 1,
                    item.Name,
                    item.TransactionTypeName,
                    <Fragment>
                      {item.StatusText == "Active" &&
                        <span
                          style={{ float: "left" }}
                          className={`badge badge-xs badge-success position-relative`}
                        >
                          &nbsp;
                    </span>
                      }
                      {item.StatusText == "InActive" &&
                        <span
                          style={{ float: "left" }}
                          className={`badge badge-xs badge-danger position-relative`}
                        >
                          &nbsp;
                    </span>
                      }
                      <div className="status pl-30">{item.StatusText}</div>
                    </Fragment>,
                    <Fragment>
                      <div className="list-action">
                        <Tooltip
                          title={
                            <IntlMessages id="liquidityprovider.tooltip.update" />
                          }
                          disableFocusListener disableTouchListener
                        >
                          <a
                            href="javascript:void(0)"
                            className="mr-10"
                            onClick={event => this.updateAPIList(item)}
                          >
                            <i className="ti-pencil" />
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
        <Modal
          isOpen={this.state.addNewData}
          toggle={this.toggle}
          className={this.props.className}
        >
          <div className="text-center m-5">
            <h1 className="mt-10">
              {" "}
              {<IntlMessages id="liquidityapi.list.title.addnewlist" />}
            </h1>
          </div>
          <ModalBody className="LiquidityProviderScroll">
            <Form className="m-10">
              <FormGroup row>
                <Label sm={4} for="Provider">
                  {
                    <IntlMessages id="liquidityprovider.list.option.label.apiprovider" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="liquidityprovider.list.option.label.apiprovider" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedProvider}
                      onChange={this.handleChangeProvider}
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
                <Label sm={4} for="apisecret">
                  <IntlMessages id="liquidityprovider.list.option.apisecret" />
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="apisecret"
                    id="apisecret"
                    placeholder=""
                    value={this.state.apiSecret}
                    onChange={this.handleChangeApiSecret}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="apikey">
                  <IntlMessages id="liquidityprovider.list.option.apikey" />
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="apikey"
                    id="apikey"
                    placeholder=""
                    value={this.state.apiKey}
                    onChange={this.handleChangeApiKey}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="calllimit">
                  <IntlMessages id="liquidityprovider.list.option.calllimit" />
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="calllimit"
                    id="calllimit"
                    placeholder=""
                    value={this.state.callLimit}
                    onChange={this.handleChangeCallLimit}
                  />
                </Col>
              </FormGroup>
              <FormGroup check>
                <FormGroup row>
                  <Label sm={4} />
                  <Col sm={8}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick={this.handleChangeIsUsedBuy}
                      />
                      <IntlMessages id="liquidityprovider.list.option.usedinbuy" />
                    </Label>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} />
                  <Col sm={8}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick={this.handleChangeIsUsedSell}
                      />

                      <IntlMessages id="liquidityprovider.list.option.usedinsell" />
                    </Label>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} />
                  <Col sm={8}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick={this.handleChangeIsUsedWithdraw}
                      />
                      <IntlMessages id="liquidityprovider.list.option.usedinwithdraw" />
                    </Label>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} />
                  <Col sm={8}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick={this.handleChangeIsAddressGen}
                      />
                      <IntlMessages id="liquidityprovider.list.option.usedinaddressgenerationn" />
                    </Label>
                  </Col>
                </FormGroup>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="Provider">
                  {
                    <IntlMessages id="liquidityprovider.list.column.label.status" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="liquidityprovider.list.column.label.status" />
                      }
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
            </Form>
          </ModalBody>
          <ModalFooter>
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => this.addAPIProviderData()}
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
              {<IntlMessages id="liquidityapi.list.title.updatelist" />}
            </h1>
          </div>
          <ModalBody className="LiquidityProviderScroll">
            <Form className="m-10">
              <FormGroup row>
                <Label sm={4} for="Provider">
                  {
                    <IntlMessages id="liquidityprovider.list.option.label.apiprovider" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="liquidityprovider.list.option.label.apiprovider" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedProvider}
                      onChange={this.handleChangeProvider}
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
                <Label sm={4} for="apisecret">
                  <IntlMessages id="liquidityprovider.list.option.apisecret" />
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="apisecret"
                    id="apisecret"
                    placeholder=""
                    value={this.state.apiSecret}
                    onChange={this.handleChangeApiSecret}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="apikey">
                  <IntlMessages id="liquidityprovider.list.option.apikey" />
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="apikey"
                    id="apikey"
                    placeholder=""
                    value={this.state.apiKey}
                    onChange={this.handleChangeApiKey}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="calllimit">
                  <IntlMessages id="liquidityprovider.list.option.calllimit" />
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="calllimit"
                    id="calllimit"
                    placeholder=""
                    value={this.state.callLimit}
                    onChange={this.handleChangeCallLimit}
                  />
                </Col>
              </FormGroup>
              <FormGroup check>
                <FormGroup row>
                  <Label sm={4} />
                  <Col sm={8}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick={this.handleChangeIsUsedBuy}
                      />
                      <IntlMessages id="liquidityprovider.list.option.usedinbuy" />
                    </Label>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} />
                  <Col sm={8}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick={this.handleChangeIsUsedSell}
                      />

                      <IntlMessages id="liquidityprovider.list.option.usedinsell" />
                    </Label>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} />
                  <Col sm={8}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick={this.handleChangeIsUsedWithdraw}
                      />
                      <IntlMessages id="liquidityprovider.list.option.usedinwithdraw" />
                    </Label>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4} />
                  <Col sm={8}>
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick={this.handleChangeIsAddressGen}
                      />
                      <IntlMessages id="liquidityprovider.list.option.usedinaddressgenerationn" />
                    </Label>
                  </Col>
                </FormGroup>
              </FormGroup>
              <FormGroup row>
                <Label sm={4} for="Provider">
                  {
                    <IntlMessages id="liquidityprovider.list.column.label.status" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="liquidityprovider.list.column.label.status" />
                      }
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
            </Form>
          </ModalBody>
          <ModalFooter>
            <MatButton
              variant="raised"
              className="btn-primary text-white"
              onClick={() => this.updateAPIProviderData()}
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
      </div>
    );
  }
}

//export default index;
// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  liquidityApiList: state.liquidityManager.liquidityApiList,
  addliquidityApiList: state.liquidityManager.addliquidityApiList,
  updateliquidityApiList: state.liquidityManager.updateliquidityApiList,
  providersList: state.currencyList.providersList
});

// export this component with action methods and props
export default connect(
  mapStateToProps,
  {
    getLiquidityManagerList,
    addLiquidityManagerList,
    updateLiquidityManagerList,
  }
)(LiquidityApiManager);
