// Component For Api COnfiguration List By Tejas
// import react, component and fragment for Component
import React, { Component, Fragment } from "react";
// used for connect store
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
// display message for success or failure
import { NotificationManager } from "react-notifications";
// used for display input lable
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
import Tooltip from "@material-ui/core/Tooltip";
import MUIDataTable from "mui-datatables";

// used for components like form, modal
import { Modal, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col } from "reactstrap";

//Action Import for Payment Method  Report Add And Update
import {
  getConfigurationList,
  getProviderList,
  addConfigurationList,
  updateConfigurationList,
  deleteConfigurationList
} from "Actions/APIConfiguration";
// validate input for only numeric value
import { validateOnlyNumeric } from "../../../../../validation/ApiConfigure/ApiConfiguration";
// action for get currency list
import { getCurrencyList } from "Actions/DaemonConfigure";
// used for display loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

//import Button from '@material-ui/core/Button';
const buttonSizeSmall = {
  maxHeight: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  fontSize: '1rem'
}

// class for api configuration
class ApiConfigurationData extends Component {
  // constructor that defines default state
  constructor() {
    super();
    this.state = {
      configurationList: [],
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
      open: false,
      componentName: ''

    };
  }

  // used for set state for component name
  showComponent = (componentName) => {
    this.setState({
      componentName: componentName,
      open: !this.state.open,
    });
  }

  // used for close drawer
  closeAll = () => {
    this.props.closeAll();
    this.setState({
      open: false,
    });
  }

  // used for handle close drawer
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
      deleteData: false
    });
  };

  // invoke when component is about to get props
  componentWillReceiveProps(nextprops) {
    // setstate for configuration list
    if (nextprops.configurationList) {
      this.setState({
        configurationList: nextprops.configurationList,
        loader: false
      });
    }

    // set state for provider list
    if (nextprops.providerList) {
      this.setState({
        providerList: nextprops.providerList,
        loader: false
      });
    }

    // set state for currency list
    if (nextprops.currencyList) {
      this.setState({
        currencyList: nextprops.currencyList
      });
    }
  }

  // open drawer foradd data
  addNewData = event => {
    this.setState({
      updateData: false,
      addNewData: true,
      deleteData: false,
      deleteDataList: []
    });
  };

  // call api for get configuration list, provider list and currency list
  componentDidMount() {
    this.setState({ loader: true });
    this.props.getConfigurationList({});
    this.props.getProviderList({});
    this.props.getCurrencyList({});
  }

  // handle dropdown data for set state currency 
  handleChangeCurrency = event => {
    this.setState({ selectedCurrency: event.target.value });
  };

  // handle dropdown data for set state provider
  handleChangeProvider = event => {
    this.setState({ selectedProvider: event.target.value });
  };

  // handle dropdown data for set state status
  handleChangeStatus = event => {
    this.setState({ selectedStatus: event.target.value });
  };

  // request data for add new data
  addConfigureData = () => {
    const {
      selectedCurrency,
      selectedProvider,
      selectedStatus,
      trnLimit,
      dailyLimit,
      monthlyLimit,
      weeklyLimit,
      lifetimeLimit,
      minAmtWithdraw
    } = this.state;

    const data = {
      currency: selectedCurrency,
      provider: selectedProvider,
      status: selectedStatus,
      trnLimit: trnLimit,
      dailyLimit: dailyLimit,
      monthlyLimit: monthlyLimit,
      weeklyLimit: weeklyLimit,
      lifetimeLimit: lifetimeLimit,
      minAmtWithdraw: minAmtWithdraw
    };

    if (
      selectedCurrency === "" ||
      selectedProvider === "" ||
      selectedStatus === "" ||
      trnLimit === "" ||
      weeklyLimit === "" ||
      dailyLimit === "" ||
      monthlyLimit === "" ||
      lifetimeLimit === "" ||
      minAmtWithdraw === ""
    ) {
      NotificationManager.error("Please Enter Proper Data");
    } else {
      this.props.addConfigurationList(data);
    }
  };

  updateConfigureData = () => {
    const {
      selectedCurrency,
      selectedProvider,
      selectedStatus,
      trnLimit,
      dailyLimit,
      monthlyLimit,
      weeklyLimit,
      lifetimeLimit,
      minAmtWithdraw
    } = this.state;

    const data = {
      currency: selectedCurrency,
      provider: selectedProvider,
      status: selectedStatus,
      trnLimit: trnLimit,
      dailyLimit: dailyLimit,
      monthlyLimit: monthlyLimit,
      weeklyLimit: weeklyLimit,
      lifetimeLimit: lifetimeLimit,
      minAmtWithdraw: minAmtWithdraw
    };

    if (
      selectedCurrency === "" ||
      selectedProvider === "" ||
      selectedStatus === "" ||
      trnLimit === "" ||
      weeklyLimit === "" ||
      dailyLimit === "" ||
      monthlyLimit === "" ||
      lifetimeLimit === "" ||
      minAmtWithdraw === ""
    ) {
      NotificationManager.error("Please Enter Proper Data");
    } else {
      this.props.updateConfigurationList(data);
    }
  };

  deleteConfigureData = () => {
    this.setState({
      deleteData: false
    });
    this.props.deleteConfigurationList(this.state.deleteDataList);
  };

  updateApiConfigurationList = (event, value) => {
    this.setState({
      updateData: true,
      addNewData: false,
      deleteData: false,
      selectedCurrency: value.currency,
      selectedProvider: value.apiProvider,
      trnLimit: value.trnlimit,
      dailyLimit: value.dailylimit,
      weeklyLimit: value.weeklylimit,
      monthlyLimit: value.monthlylimit,
      lifetimeLimit: value.lifetimelimit,
      selectedStatus: value.status,
      minAmtWithdraw: value.minamtwithdraw,
      deleteDataList: []
    });
  };

  deleteApiConfigurationList = (event, value) => {
    this.setState({
      updateData: false,
      addNewData: false,
      deleteData: true,
      deleteDataList: value
    });
  };

  // Only Enter Numeric Value
  validateTrnLimit = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        trnLimit: event.target.value
      });
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({
        trnLimit: event.target.value
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
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({
        monthlyLimit: event.target.value
      });
    }
  };

  // Only Enter Numeric Value
  validateLifeTimeLimit = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        lifetimeLimit: event.target.value
      });
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({
        lifetimeLimit: event.target.value
      });
    }
  };

  // Only Enter Numeric Value
  validateMinAmtWithdraw = event => {
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({
        minAmtWithdraw: event.target.value
      });
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({
        minAmtWithdraw: event.target.value
      });
    }
  };

  render() {
    const { drawerClose } = this.props;
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
        name: <IntlMessages id="apiconfiguration.list.form.label.trnlimit" />,
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="apiconfiguration.list.form.label.minamtwithdraw" />
        ),
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
      responsive: "scroll",
      selectableRows: false,
      print: false,
      search: false,
      download: false,
      viewColumns: false,
      filter: false,
      customToolbar: () => {
        return (
          <Button
            variant="raised"
            className="btn-primary text-white"
            onClick={this.addNewData}
          >
            <IntlMessages id="apiconfiguration.list.button.add" />
          </Button>
        );
      }
    };

    return (
      <div className="mb-10">
        {this.state.loader && <JbsSectionLoader />}
        <div className="m-20 page-title d-flex justify-content-between align-items-center">
          <div className="page-title-wrap">
            <h2>Configurations</h2>
          </div>
          <div className="page-title-wrap">
            <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></Button>
            <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
          </div>
        </div>
        <div className="StackingHistory">
          {this.state.configurationList.length !== 0 ? (
            <MUIDataTable
              title={this.props.title}
              data={this.state.configurationList.map((configDetail, key) => {
                return [
                  key + 1,
                  configDetail.currency,
                  configDetail.apiProvider,
                  configDetail.trnlimit,
                  configDetail.minamtwithdraw,
                  <Fragment>
                    <span
                      style={{ float: "left" }}
                      className={`badge badge-xs ${
                        configDetail.badgeClass
                        }  position-relative`}
                    >
                      &nbsp;
                  </span>
                    <div className="status pl-30">{configDetail.status}</div>
                  </Fragment>,
                  <Fragment>
                    <div className="list-action">
                      <Tooltip
                        title={
                          <IntlMessages id="apiconfiguration.tooltip.update" />
                        }
                        disableFocusListener disableTouchListener
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={event =>
                            this.updateApiConfigurationList(event, configDetail)
                          }
                        >
                          <i className="ti-pencil" />
                        </a>
                      </Tooltip>
                      <Tooltip
                        title={
                          <IntlMessages id="apiconfiguration.tooltip.delete" />
                        }
                        disableFocusListener disableTouchListener
                      >
                        <a
                          href="javascript:void(0)"
                          className="mr-10"
                          onClick={event =>
                            this.deleteApiConfigurationList(event, configDetail)
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
              {<IntlMessages id="apiconfiguration.title.add" />}
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
                <Label sm={4} for="trnLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.trnlimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateTrnLimit}
                    value={this.state.trnLimit}
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
                <Label sm={4} for="lifetimeLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.lifetimelimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateLifeTimeLimit}
                    value={this.state.lifetimeLimit}
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
              <FormGroup row>
                <Label sm={4} for="minAMount">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.minamtwithdraw" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateMinAmtWithdraw}
                    value={this.state.minAmtWithdraw}
                  />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="raised"
              onClick={() => this.addConfigureData()}
              className="btn-primary text-white"
            >
              <span>
                <IntlMessages id="apiconfiguration.list.button.save" />
              </span>
            </Button>

            <Button
              variant="raised"
              onClick={() => this.handleClose()}
              className="btn-danger text-white"
            >
              <span>
                <IntlMessages id="apiconfiguration.list.button.cancel" />
              </span>
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.updateData}>
          <div className="text-center m-5">
            <h1 className="mt-10">
              {" "}
              {<IntlMessages id="apiconfiguration.title.update" />}
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
                <Label sm={4} for="trnLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.trnlimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateTrnLimit}
                    value={this.state.trnLimit}
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
                <Label sm={4} for="lifetimeLimit">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.lifetimelimit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateLifeTimeLimit}
                    value={this.state.lifetimeLimit}
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
              <FormGroup row>
                <Label sm={4} for="minAMount">
                  {
                    <IntlMessages id="apiconfiguration.list.form.label.minamtwithdraw" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="Name"
                    id="Name"
                    onChange={this.validateMinAmtWithdraw}
                    value={this.state.minAmtWithdraw}
                  />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="raised"
              onClick={() => this.updateConfigureData()}
              className="btn-primary text-white"
            >
              <span>
                <IntlMessages id="apiconfiguration.list.button.update" />
              </span>
            </Button>

            <Button
              variant="raised"
              onClick={() => this.handleClose()}
              className="btn-danger text-white"
            >
              <span>
                <IntlMessages id="apiconfiguration.list.button.cancel" />
              </span>
            </Button>
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
              onClick={this.deleteConfigureData}
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
  configurationList: state.apiConfig.configurationList,
  providerList: state.apiConfig.providerList,
  currencyList: state.currencyList.currencyList,
  loading: state.bugReport.loading
});

export default connect(
  mapStateToProps,
  {
    getConfigurationList,
    getProviderList,
    addConfigurationList,
    updateConfigurationList,
    deleteConfigurationList,
    getCurrencyList
  }
)(ApiConfigurationData);
