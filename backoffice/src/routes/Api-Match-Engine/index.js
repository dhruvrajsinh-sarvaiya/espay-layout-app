// Component For Api MAtch Engine List By Tejas

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

import { NotificationManager } from "react-notifications";

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
import IntlMessages from "Util/IntlMessages";

import Tooltip from "@material-ui/core/Tooltip";

//Action Import for Payment Method  Report Add And Update
import { getProviderList } from "Actions/APIConfiguration";

import {
  getMatchEngineList,
  addMatchEngineList,
  updateMatchEngineList,
  deleteMatchEngineList
} from "Actions/ApiMatchConfiguration";

import { validateOnlyNumeric } from "../../validation/ApiConfigure/ApiConfiguration";

import { getCurrencyList } from "Actions/DaemonConfigure";

import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import MatButton from "@material-ui/core/Button";

class ApiMatchEngine extends Component {
  constructor() {
    super();
    this.state = {
      matchEngineList: [],
      providerList: [],
      loader: false,
      addNewData: false,
      selectedCurrency: "",
      selectedProvider: "",
      selectedType: "",
      currencyList: [],
      maxOrderAmount: "",
      minOrderAmount: "",
      dailyLimit: "",
      weeklyLimit: "",
      monthlyLimit: "",
      selectedStatus: "",
      updateData: false,
      deleteData: false,
      deleteDataList: []
    };
  }

  handleClose = () => {
    this.setState({
      addNewData: false,
      selectedCurrency: "",
      selectedProvider: "",
      selectedType: "",
      maxOrderAmount: "",
      minOrderAmount: "",
      dailyLimit: "",
      weeklyLimit: "",
      monthlyLimit: "",
      selectedStatus: "",
      updateData: false,
      deleteData: false
    });
  };

  componentWillReceiveProps(nextprops) {
    if (nextprops.matchEngineList.length) {
      this.setState({
        matchEngineList: nextprops.matchEngineList,
        loader: false
      });
    }

    if (nextprops.providerList) {
      this.setState({
        providerList: nextprops.providerList,
        loader: false
      });
    }

    if (nextprops.currencyList) {
      this.setState({
        currencyList: nextprops.currencyList
      });
    }
  }

  addNewData = event => {
    this.setState({
      updateData: false,
      addNewData: true,
      deleteData: false,
      deleteDataList: []
    });
  };
  componentDidMount() {
    this.setState({ loader: true });
    this.props.getMatchEngineList({});
    this.props.getProviderList({});
    this.props.getCurrencyList({});
  }

  handleChangeCurrency = event => {
    this.setState({ selectedCurrency: event.target.value });
  };

  handleChangeType = event => {
    this.setState({ selectedType: event.target.value });
  };

  handleChangeProvider = event => {
    this.setState({ selectedProvider: event.target.value });
  };

  handleChangeStatus = event => {
    this.setState({ selectedStatus: event.target.value });
  };

  addMatchEngineData = () => {
    const {
      selectedCurrency,
      selectedProvider,
      selectedStatus,
      selectedType,
      dailyLimit,
      minOrderAmount,
      maxOrderAmount,
      monthlyLimit,
      weeklyLimit
    } = this.state;

    const data = {
      currency: selectedCurrency,
      provider: selectedProvider,
      status: selectedStatus,
      type: selectedType,
      dailyLimit: dailyLimit,
      monthlyLimit: monthlyLimit,
      weeklyLimit: weeklyLimit,
      minOrderAmount: minOrderAmount,
      maxOrderAmount: maxOrderAmount
    };

    if (
      selectedCurrency === "" ||
      selectedProvider === "" ||
      selectedStatus === "" ||
      selectedType === "" ||
      weeklyLimit === "" ||
      dailyLimit === "" ||
      monthlyLimit === "" ||
      minOrderAmount === "" ||
      maxOrderAmount === ""
    ) {
      NotificationManager.error("Please Enter Proper Data");
    } else {
      this.props.addMatchEngineList(data);
    }
  };

  updateMatchEngineData = () => {
    const {
      selectedCurrency,
      selectedProvider,
      selectedStatus,
      selectedType,
      minOrderAmount,
      dailyLimit,
      monthlyLimit,
      weeklyLimit,
      maxOrderAmount
    } = this.state;

    const data = {
      currency: selectedCurrency,
      provider: selectedProvider,
      status: selectedStatus,
      type: selectedType,
      minOrderAmount: minOrderAmount,
      dailyLimit: dailyLimit,
      monthlyLimit: monthlyLimit,
      weeklyLimit: weeklyLimit,
      maxOrderAmount: maxOrderAmount
    };

    if (
      selectedCurrency === "" ||
      selectedProvider === "" ||
      selectedStatus === "" ||
      selectedType === "" ||
      weeklyLimit === "" ||
      dailyLimit === "" ||
      monthlyLimit === "" ||
      weeklyLimit === "" ||
      maxOrderAmount === ""
    ) {
      NotificationManager.error("Please Enter Proper Data");
    } else {
      this.props.updateMatchEngineList(data);
    }
  };

  deleteMatchEngineData = () => {
    this.setState({
      deleteData: false
    });
    this.props.deleteMatchEngineList(this.state.deleteDataList);
  };

  updateMatchEngineList = (event, value) => {
    this.setState({
      updateData: true,
      addNewData: false,
      deleteData: false,
      selectedCurrency: value.currency_pair,
      selectedProvider: value.apiProvider,
      selectedType: value.type,
      minOrder: value.minOrder,
      maxOrder: value.MaxOrder,
      dailyLimit: value.dailylimit,
      weeklyLimit: value.weeklylimit,
      monthlyLimit: value.monthlylimit,
      selectedStatus: value.status,
      deleteDataList: []
    });
  };

  deleteMatchEngineList = (event, value) => {
    this.setState({
      updateData: false,
      addNewData: false,
      deleteData: true,
      deleteDataList: value
    });
  };

  // Only Enter Numeric Value
  validateMinOrder = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        minOrderAmount: event.target.value
      });
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({
        minOrderAmount: event.target.value
      });
    }
  };

  // Only Enter Numeric Value
  validateMaxOrder = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        maxOrderAmount: event.target.value
      });
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({
        maxOrderAmount: event.target.value
      });
    }
  };

  // Only Enter Numeric Value
  validateDailyLimit = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        dailyLimit: event.target.value
      });
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({
        dailyLimit: event.target.value
      });
    }
  };

  // Only Enter Numeric Value
  validateWeeklyLimit = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        weeklyLimit: event.target.value
      });
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({
        weeklyLimit: event.target.value
      });
    }
  };

  // Only Enter Numeric Value
  validateMonthlyLimit = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        monthlyLimit: event.target.value
      });
    } else if (event.target.value === "") {
      // process for blank message
      this.setState({
        monthlyLimit: event.target.value
      });
    }
  };

  render() {
    const columns = [
      {
        name: "#",
        options: { sort: false, filter: false }
      },
      {
        name: <IntlMessages id="apiconfiguration.list.form.label.currency" />,
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="apiconfiguration.list.form.label.apiprovider" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="apiconfiguration.list.form.label.type" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="apiconfiguration.list.form.label.minorder" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="apiconfiguration.list.form.label.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="apiconfiguration.list.form.label.action" />,
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
            <IntlMessages id="apiconfiguration.list.button.add" />
            
          </MatButton>
        );
      }
    };
    return (
      <div className="mb-10">
        {this.state.loader && <JbsSectionLoader />}
        <PageTitleBar
          title={<IntlMessages id="sidebar.apimatchengine.title" />}
          match={this.props.match}
        />
        <div className="StackingHistory">
        {this.state.matchEngineList.length !== 0 ? (
          <MUIDataTable
            data={this.state.matchEngineList.map((matchEngineDetail, key) => {
              return [
                matchEngineDetail.id,
                matchEngineDetail.currency_pair,
                matchEngineDetail.apiProvider,
                matchEngineDetail.type,
                matchEngineDetail.minOrder,
                <Fragment>
                  <span
                    style={{ float: "left" }}
                    className={`badge badge-xs ${
                      matchEngineDetail.badgeClass
                    }  position-relative`}
                  >
                    &nbsp;
                  </span>
                  <div className="status pl-30">{matchEngineDetail.status}</div>
                </Fragment>,
                <Fragment>
                  <div className="list-action">
                    <Tooltip
                      title={
                        <IntlMessages id="apiconfiguration.tooltip.update" />
                      }
                    >
                      <a
                        href="javascript:void(0)"
                        className="mr-10"
                        onClick={event =>
                          this.updateMatchEngineList(event, matchEngineDetail)
                        }
                      >
                        <i className="ti-pencil" />
                      </a>
                    </Tooltip>
                    <Tooltip
                      title={
                        <IntlMessages id="apiconfiguration.tooltip.delete" />
                      }
                    >
                      <a
                        href="javascript:void(0)"
                        className="mr-10"
                        onClick={event =>
                          this.deleteMatchEngineList(event, matchEngineDetail)
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
              {<IntlMessages id="apimatchengine.title.add" />}
            </h1>
          </div>
          <ModalBody>
            <Form className="m-10">
              <FormGroup row>
                <Label sm={4} for="curency">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.currency" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="apiconfiguration.list.form.label.currency" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedCurrency}
                      onChange={this.handleChangeCurrency}
                    >
                      {this.state.currencyList
                        ? this.state.currencyList.map((value, key) => (
                            <MenuItem key={key} value={value.symbol}>
                              {value.symbol}
                            </MenuItem>
                          ))
                        : ""}
                    </Select>
                  </FormControl>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="Provider">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.apiprovider" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="apiconfiguration.list.form.label.apiprovider" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedProvider}
                      onChange={this.handleChangeProvider}
                    >
                      {this.state.providerList
                        ? this.state.providerList.map((value, key) => (
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
                <Label sm={4} for="type">
                  {<IntlMessages id="apiconfiguration.list.form.label.type" />}
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="apiconfiguration.list.form.label.type" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedType}
                      onChange={this.handleChangeType}
                    >
                      <MenuItem value="Buy">
                        {
                          <IntlMessages id="apiconfiguration.option.form.label.buy" />
                        }
                      </MenuItem>
                      <MenuItem value="Sell">
                        {
                          <IntlMessages id="apiconfiguration.option.form.label.sell" />
                        }
                      </MenuItem>
                      <MenuItem value="Both">
                        {
                          <IntlMessages id="apiconfiguration.option.form.label.both" />
                        }
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="minorder">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.minorder" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateMinOrder}
                    value={this.state.minOrderAmount}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="maxorder">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.maxorder" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateMaxOrder}
                    value={this.state.maxOrderAmount}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="dailyLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.dailylimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateDailyLimit}
                    value={this.state.dailyLimit}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="weeklyLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.weeklylimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateWeeklyLimit}
                    value={this.state.weeklyLimit}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="monthlyLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.monthlylimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateMonthlyLimit}
                    value={this.state.monthlyLimit}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="Status">
                  {
                    <IntlMessages id="apiconfiguration.list.column.label.status" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="apiconfiguration.list.column.label.status" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedStatus}
                      onChange={this.handleChangeStatus}
                    >
                      <MenuItem value="">
                        <em>
                          {
                            <IntlMessages id="apiconfiguration.list.column.label.none" />
                          }
                        </em>
                      </MenuItem>
                      <MenuItem value="Active">
                        {
                          <IntlMessages id="apiconfiguration.list.column.label.status.active" />
                        }
                      </MenuItem>
                      <MenuItem value="In Active">
                        {
                          <IntlMessages id="apiconfiguration.list.column.label.status.inactive" />
                        }
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
              onClick={() => this.addMatchEngineData()}
            >
              <IntlMessages id="apiconfiguration.list.button.save" />
            </MatButton>

            <MatButton
              variant="raised"
              className="btn-danger text-white"
              onClick={() => this.handleClose()}
            >
              <IntlMessages id="apiconfiguration.list.button.cancel" />
            </MatButton>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.updateData}>
          <div className="text-center m-5">
            <h1 className="mt-10">
              {" "}
              {<IntlMessages id="apimatchengine.title.update" />}
            </h1>
          </div>
          <ModalBody>
            <Form className="m-10">
              <FormGroup row>
                <Label sm={4} for="curency">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.currency" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="apiconfiguration.list.form.label.currency" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedCurrency}
                      onChange={this.handleChangeCurrency}
                    >
                      {this.state.currencyList
                        ? this.state.currencyList.map((value, key) => (
                            <MenuItem key={key} value={value.symbol}>
                              {value.symbol}
                            </MenuItem>
                          ))
                        : ""}
                    </Select>
                  </FormControl>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="Provider">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.apiprovider" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="apiconfiguration.list.form.label.apiprovider" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedProvider}
                      onChange={this.handleChangeProvider}
                    >
                      {this.state.providerList
                        ? this.state.providerList.map((value, key) => (
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
                <Label sm={4} for="type">
                  {<IntlMessages id="apiconfiguration.list.form.label.type" />}
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="apiconfiguration.list.form.label.type" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedType}
                      onChange={this.handleChangeType}
                    >
                      <MenuItem value="Buy">
                        {
                          <IntlMessages id="apiconfiguration.option.form.label.buy" />
                        }
                      </MenuItem>
                      <MenuItem value="Sell">
                        {
                          <IntlMessages id="apiconfiguration.option.form.label.sell" />
                        }
                      </MenuItem>
                      <MenuItem value="Both">
                        {
                          <IntlMessages id="apiconfiguration.option.form.label.both" />
                        }
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="minorder">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.minorder" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateMinOrder}
                    value={this.state.minOrderAmount}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="maxorder">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.maxorder" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateMaxOrder}
                    value={this.state.maxOrderAmount}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="dailyLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.dailylimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateDailyLimit}
                    value={this.state.dailyLimit}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="weeklyLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.weeklylimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateWeeklyLimit}
                    value={this.state.weeklyLimit}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="monthlyLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.monthlylimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateMonthlyLimit}
                    value={this.state.monthlyLimit}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={4} for="Status">
                  {
                    <IntlMessages id="apiconfiguration.list.column.label.status" />
                  }
                </Label>
                <Col sm={8}>
                  <FormControl className="">
                    <InputLabel>
                      {
                        <IntlMessages id="apiconfiguration.list.column.label.status" />
                      }
                    </InputLabel>
                    <Select
                      value={this.state.selectedStatus}
                      onChange={this.handleChangeStatus}
                    >
                      <MenuItem value="">
                        <em>
                          {
                            <IntlMessages id="apiconfiguration.list.column.label.none" />
                          }
                        </em>
                      </MenuItem>
                      <MenuItem value="Active">
                        {
                          <IntlMessages id="apiconfiguration.list.column.label.status.active" />
                        }
                      </MenuItem>
                      <MenuItem value="In Active">
                        {
                          <IntlMessages id="apiconfiguration.list.column.label.status.inactive" />
                        }
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
              onClick={() => this.updateMatchEngineData()}
            >
              <IntlMessages id="apiconfiguration.list.button.update" />
            </MatButton>

            <MatButton
              variant="raised"
              className="btn-danger text-white"
              onClick={() => this.handleClose()}
            >
              <IntlMessages id="apiconfiguration.list.button.cancel" />
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
            <IntlMessages id="apiconfiguration.list.dialog.label.title" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <IntlMessages id="apiconfiguration.list.dialog.label.text" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="raised"
              onClick={this.handleClose}
              className="btn-danger text-white mr-10"
            >
              <IntlMessages id="apiconfiguration.dialogbox.button.no" />
            </Button>
            <Button
              variant="raised"
              onClick={this.deleteMatchEngineData}
              className="btn-primary text-white mr-10"
            >
              <IntlMessages id="apiconfiguration.dialogbox.button.yes" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
  matchEngineList: state.apiMatchConfig.matchEngineList,
  providerList: state.apiConfig.providerList,
  currencyList: state.currencyList.currencyList
});

export default connect(
  mapStateToProps,
  {
    getProviderList,
    getCurrencyList,
    getMatchEngineList,
    addMatchEngineList,
    updateMatchEngineList,
    deleteMatchEngineList
  }
)(ApiMatchEngine);
