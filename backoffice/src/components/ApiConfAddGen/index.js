/**
 * Added By Devang parekh
 * Component is used to pair configuration
 * api configuration for address generation page contain add, update delete and multi delete option in list
 *
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";

import MatButton from "@material-ui/core/Button";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import Tooltip from "@material-ui/core/Tooltip";

//Action Import for address generation Report Add And Update
import {
  getApiConfAddGenList,
  getCurrencyList,
  getApiProviderList,
  getCallbackList,
  submitApiConfAddGenForm,
  editApiConfAddGenForm,
  deleteApiConfAddGenForm
} from "Actions/ApiConfAddGen";

import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

const validateapiConfAddGenRequest = require("../../validation/apiConfAddGen");

class ApiConfAddGen extends Component {
  state = {
    apiConfAddGenList: [],
    currencyList: [],
    apiProviderList: [],
    callbackList: [],
    addApiConfAddGenForm: false,
    editNewApiConfAddGenForm: false,
    deleteNewApiConfAddGenForm: false,
    addNewApiDetails: {
      currency: "",
      apiType: "",
      apiProvider: "",
      status: "",
      callbackDetail: ""
    },
    deleteRecordDetail: {},
    successMessage: "",
    errors: "",
    loader: false
  };

  addNewApiConfAddGenForm() {
    this.setState({
      addApiConfAddGenForm: true,
      addNewApiDetails: {
        currency: "",
        apiType: "",
        apiProvider: "",
        status: "",
        callbackDetail: ""
      },
      loader: true,
      errors: {}
    });
    this.getBasicFormDetail();
  }

  async getBasicFormDetail() {
    await this.props.getCurrencyList({});
    await this.props.getApiProviderList({});
    this.setState({ loader: false });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isConfAddGenListFound >= 0) {
      this.setState({ loader: false });
    }

    if (nextProps.apiConfAddGenList) {
      this.setState({ apiConfAddGenList: nextProps.apiConfAddGenList });
    }

    if (nextProps.currencyList) {
      this.setState({ currencyList: nextProps.currencyList });
    }

    if (nextProps.apiProviderList) {
      this.setState({ apiProviderList: nextProps.apiProviderList });
    }

    if (nextProps.callbackList) {
      this.setState({ callbackList: nextProps.callbackList });
    }

    if (nextProps.addApiConfSuccess >= 0) {
      this.setState({
        addApiConfAddGenForm: false,
        addNewApiDetails: {
          currency: "",
          apiType: "",
          apiProvider: "",
          status: "",
          callbackDetail: ""
        },
        loader: false
      });
    }

    if (nextProps.editApiConfSuccess >= 0) {
      this.setState({
        addApiConfAddGenForm: false,
        editNewApiConfAddGenForm: false,
        addNewApiDetails: {
          currency: "",
          apiType: "",
          apiProvider: "",
          status: "",
          callbackDetail: ""
        },
        ID: "",
        loader: false
      });
    }

    if (nextProps.deleteApiConfSuccess >= 0) {
      this.setState({
        deleteRecordDetail: {},
        deleteNewApiConfAddGenForm: false,
        loader: false
      });
    }
  }

  componentDidMount() {
    this.props.getApiConfAddGenList({});
  }

  // start code for add process
  submitApiConfAddGenForm() {
    const { errors, isValid } = validateapiConfAddGenRequest(
      this.state.addNewApiDetails
    );
    this.setState({ errors: errors });

    if (isValid) {
      this.setState({ loader: true });
      this.props.editApiConfAddGenForm(this.state.addNewApiDetails);
    }
  }

  // on change  add new form value
  onChangeaddNewConfDetailForm(key, value) {
    if (key === "apiProvider") {
      if (value === 1) {
      } else if (value === 2) {
      } else if (value === 3) {
      }
    }

    this.setState({
      addNewApiDetails: {
        ...this.state.addNewApiDetails,
        [key]: value
      }
    });
  }

  closeAddApiConfModal() {
    this.setState({
      addApiConfAddGenForm: false,
      editNewApiConfAddGenForm: false,
      addNewApiDetails: {
        currency: "",
        apiType: "",
        apiProvider: "",
        status: "",
        callbackDetail: ""
      },
      loader: false,
      errors: {}
    });
  }

  // end

  // start code for edit process
  onEditApiConfAddGen(selectedData) {
    this.setState({
      addApiConfAddGenForm: true,
      editNewApiConfAddGenForm: true,
      addNewApiDetails: {
        currency: selectedData.currencyID,
        apiType: selectedData.apiType,
        apiProvider: selectedData.apiProviderID,
        status: selectedData.status,
        callbackDetail: selectedData.callbackDetail,
        ID: selectedData.recordID
      },
      loader: true,
      errors: {}
    });
    this.getBasicFormDetail();
  }

  edirapiConfAddGenForm() {
    const { errors, isValid } = validateapiConfAddGenRequest(
      this.state.addNewApiDetails
    );
    this.setState({ errors: errors });

    if (isValid) {
      this.setState({ loader: true });
      this.props.editApiConfAddGenForm(this.state.addNewApiDetails);
    }
  }

  // end
  // start code for delete pair process

  deleteapiConfAddGen(deleteRecordDetail) {
    this.setState({
      deleteRecordDetail: deleteRecordDetail,
      deleteNewApiConfAddGenForm: true
    });
  }

  confirmDeleteApiConfAddGen() {
    if (this.state.deleteRecordDetail) {
      this.setState({
        loader: true
      });
      this.props.deleteApiConfAddGenForm(this.state.deleteRecordDetail);
    }
  }

  closeDeleteApiConfModal() {
    this.setState({
      deleteRecordDetail: {},
      deleteNewApiConfAddGenForm: false
    });
  }

  // end

  render() {
    const {
      addApiConfAddGenForm,
      editNewApiConfAddGenForm,
      deleteNewApiConfAddGenForm,
      addNewApiDetails,
      apiConfAddGenList,
      currencyList,
      apiProviderList,
      loader
    } = this.state;
    const columns = [
      {
        name: "#",
        options: { sort: false, filter: false }
      },
      {
        name: <IntlMessages id="sidebar.apiConfAddGen.list.lable.currency" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.apiConfAddGen.list.lable.apiType" />,
        options: { sort: true, filter: true }
      },
      {
        name: (
          <IntlMessages id="sidebar.apiConfAddGen.list.lable.apiProvider" />
        ),
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.apiConfAddGen.list.lable.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="sidebar.apiConfAddGen.list.lable.action" />,
        options: { sort: false, filter: false }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: true,
      print: false,
      download: false,
      viewColumns: false,
      filter: false,
      customToolbar: () => {
      
        return (
          <MatButton
          variant="raised"
          className="btn-primary text-white"
          onClick={() => this.addNewApiConfAddGenForm()}
        >
  
        <IntlMessages id="sidebar.apiConfAddGen.button.add" />         
        </MatButton>          
        );
      },
      customToolbarSelect: selectedRows => (
        <CustomToolbarSelect
          selectedRows={selectedRows}
          deleteApiConfAddGenForm={this.props.deleteApiConfAddGenForm}
          apiConfAddGenList={apiConfAddGenList}
        />
      )
    };

    return (
      <div className="StackingHistory">
        {this.state.loader && <JbsSectionLoader />}
        {apiConfAddGenList.length !== 0 ? (
          <MUIDataTable
            title={""}
            data={apiConfAddGenList.map((apiConfDetail, key) => {
              return [
                key + 1,
                apiConfDetail.currency,
                apiConfDetail.apiValue,
                apiConfDetail.apiProvider,
                apiConfDetail.status,
                <Fragment>
                  <div className="list-action">
                    <Tooltip
                      title={
                        <IntlMessages id="sidebar.apiConfAddGen.button.update" />
                      }
                    >
                      <a
                        href="javascript:void(0)"
                        className="mr-10"
                        onClick={() => this.onEditApiConfAddGen(apiConfDetail)}
                      >
                        <i className="ti-pencil" />
                      </a>
                    </Tooltip>
                    <Tooltip
                      title={
                        <IntlMessages id="sidebar.apiConfAddGen.tooltip.delete" />
                      }
                    >
                      <a
                        href="javascript:void(0)"
                        className="mr-10"
                        onClick={() => this.deleteapiConfAddGen(apiConfDetail)}
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
          <NotFoundTable title={this.props.title} columns={columns} />
        )}
        {addApiConfAddGenForm && (
          <Modal
            isOpen={addApiConfAddGenForm}
            toggle={() => this.closeAddApiConfModal()}
          >
            <ModalHeader toggle={() => this.closeAddApiConfModal()}>
              {addApiConfAddGenForm ? (
                <IntlMessages id="sidebar.apiConfAddGen.modal.addNewApiConfAddGen" />
              ) : (
                <IntlMessages id="sidebar.apiConfAddGen.modal.editApiConfAddGen" />
              )}
            </ModalHeader>
            <ModalBody>
              {loader ? (
                <CircularProgress
                  className="mr-30 mb-10 progress-success"
                  size={40}
                />
              ) : null}
              <Form className="tradefrm">
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.apiConfAddGen.list.lable.currency" />
                  </Label>
                  <Input
                    type="select"
                    name="currency"
                    value={addNewApiDetails.currency}
                    onChange={e =>
                      this.onChangeaddNewConfDetailForm(
                        "currency",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select Currency</option>

                    {currencyList.map(item => (
                      <option
                        value={item.currencyID}
                        key={item.currencyID}
                        defaultValue={
                          item.currencyID === addNewApiDetails.currency
                            ? true
                            : false
                        }
                      >
                        {item.currency}
                      </option>
                    ))}
                  </Input>
                  {this.state.errors.currency && (
                    <div className="text-center">
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.currency} />
                      </span>
                    </div>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.apiConfAddGen.list.lable.apiType" />
                  </Label>
                  <div className="row">
                    <div className="col-sm-3">
                      <FormGroup check className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="apiType"
                          checked={this.state.addNewApiDetails.apiType === "1"}
                          onChange={e =>
                            this.onChangeaddNewConfDetailForm("apiType", "1")
                          }
                        />{" "}
                        Liquidity
                      </FormGroup>
                    </div>
                    <div className="col-sm-3">
                      <FormGroup check className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="apiType"
                          checked={this.state.addNewApiDetails.apiType === "2"}
                          onChange={e =>
                            this.onChangeaddNewConfDetailForm("apiType", "2")
                          }
                        />{" "}
                        API
                      </FormGroup>
                    </div>
                    <div className="col-sm-3">
                      <FormGroup check className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="apiType"
                          checked={this.state.addNewApiDetails.apiType === "3"}
                          onChange={e =>
                            this.onChangeaddNewConfDetailForm("apiType", "3")
                          }
                        />{" "}
                        Daemon
                      </FormGroup>
                    </div>
                  </div>

                  {this.state.errors.apiType && (
                    <div className="text-center">
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.apiType} />
                      </span>
                    </div>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.apiConfAddGen.list.lable.apiProvider" />
                  </Label>
                  <Input
                    type="select"
                    name="apiProvider"
                    value={addNewApiDetails.apiProvider}
                    onChange={e =>
                      this.onChangeaddNewConfDetailForm(
                        "apiProvider",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select API Type</option>

                    {apiProviderList.map(item => (
                      <option
                        value={item.apiProviderID}
                        key={item.apiProviderID}
                        defaultValue={
                          item.apiProviderID === addNewApiDetails.apiProvider
                            ? true
                            : false
                        }
                      >
                        {item.apiProvider}
                      </option>
                    ))}
                  </Input>

                  {this.state.errors.apiProvider && (
                    <div className="text-center">
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.apiProvider} />
                      </span>
                    </div>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>
                    <IntlMessages id="sidebar.apiConfAddGen.list.lable.status" />
                  </Label>
                  <Input
                    type="select"
                    name="status"
                    value={addNewApiDetails.status}
                    onChange={e =>
                      this.onChangeaddNewConfDetailForm(
                        "status",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select Status</option>
                    <option
                      defaultValue={
                        "Active" === addNewApiDetails.status ? true : false
                      }
                      value="Active"
                    >
                      Active
                    </option>
                    <option
                      defaultValue={
                        "InActive" === addNewApiDetails.status ? true : false
                      }
                      value="InActive"
                    >
                      InActive
                    </option>
                  </Input>
                  {this.state.errors.status && (
                    <div className="text-center">
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.status} />
                      </span>
                    </div>
                  )}
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              {!editNewApiConfAddGenForm ? (
                <div>
                  <Button
                    variant="raised"
                    color="primary"
                    className="text-white"
                    onClick={() => this.submitApiConfAddGenForm()}
                    disabled={this.state.loader}
                  >
                    <IntlMessages id="sidebar.apiConfAddGen.button.add" />
                  </Button>{" "}
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={() => this.closeAddApiConfModal()}
                    disabled={this.state.loader}
                  >
                    <IntlMessages id="sidebar.apiConfAddGen.button.cancel" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="raised"
                    color="primary"
                    className="text-white"
                    onClick={() => this.edirapiConfAddGenForm()}
                    disabled={this.state.loader}
                  >
                    <IntlMessages id="sidebar.apiConfAddGen.button.update" />
                  </Button>{" "}
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={() => this.closeAddApiConfModal()}
                    disabled={this.state.loader}
                  >
                    <IntlMessages id="sidebar.apiConfAddGen.button.cancel" />
                  </Button>
                </div>
              )}
            </ModalFooter>
          </Modal>
        )}
        {deleteNewApiConfAddGenForm && (
          <Modal isOpen={deleteNewApiConfAddGenForm}>
            <ModalHeader toggle={() => this.closeDeleteApiConfModal()}>
              <IntlMessages id="sidebar.apiConfAddGen.modal.deleteNewApiConf" />
            </ModalHeader>
            <ModalBody>
              <div className="text-center">
                {loader ? (
                  <CircularProgress
                    className="mr-30 mb-10 progress-success"
                    size={40}
                  />
                ) : null}
              </div>
              <div>
                <IntlMessages id="sidebar.apiConfAddGen.modal.deleteNewApiConf.message" />
              </div>
            </ModalBody>
            <ModalFooter>
              <div>
                <Button
                  variant="raised"
                  color="primary"
                  className="text-white"
                  onClick={() => this.confirmDeleteApiConfAddGen()}
                  disabled={this.state.loader}
                >
                  <IntlMessages id="sidebar.apiConfAddGen.button.yes" />
                </Button>{" "}
                <Button
                  variant="raised"
                  className="btn-danger text-white"
                  onClick={() => this.closeDeleteApiConfModal()}
                  disabled={this.state.loader}
                >
                  <IntlMessages id="sidebar.apiConfAddGen.button.no" />
                </Button>
              </div>
            </ModalFooter>
          </Modal>
        )}
      </div>
    );
  }
}

class CustomToolbarSelect extends Component {
  deleteMultipleRows() {
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(
        this.props.apiConfAddGenList[this.props.selectedRows[i].index]
      );
    }

    var request = { data: value, isDelete: 1 }; // is delete means delete records
    this.props.deleteApiConfAddGenForm(request);
  }

  activeAll() {
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(
        this.props.apiConfAddGenList[this.props.selectedRows[i].index]
      );
    }

    var request = { data: value, isActive: 1 }; // is active means active selected records
    this.props.deleteApiConfAddGenForm(request);
  }

  inActiveAll() {
    var value = [];
    for (var i = 0; i < this.props.selectedRows.data.length; i++) {
      value.push(
        this.props.apiConfAddGenList[this.props.selectedRows[i].index]
      );
    }

    var request = { data: value, isInActive: 1 }; // is inactive means inactive selected records
    this.props.deleteApiConfAddGenForm(request);
  }

  render() {
    return (
      <div className={"mt-20 mr-20"}>
        <Tooltip
          title={<IntlMessages id="sidebar.apiConfAddGen.tooltip.active" />}
        >
          <a href="javascript:void(0)" onClick={() => this.activeAll()}>
            <i className="ti-unlock font-2x" />
          </a>
        </Tooltip>{" "}
        <Tooltip
          title={<IntlMessages id="sidebar.apiConfAddGen.tooltip.inActive" />}
        >
          <a href="javascript:void(0)" onClick={() => this.inActiveAll()}>
            <i className="ti-lock font-2x" />
          </a>
        </Tooltip>{" "}
        <Tooltip
          title={<IntlMessages id="sidebar.apiConfAddGen.tooltip.delete" />}
        >
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

const mapStateToProps = ({ apiConfAddGen }) => {
  var responce = {
    isConfAddGenListFound: apiConfAddGen.isConfAddGenListFound,
    apiConfAddGenList: apiConfAddGen.apiConfAddGenList,
    currencyList: apiConfAddGen.currencyList,
    apiProviderList: apiConfAddGen.apiProviderList,
    callbackList: apiConfAddGen.callbackList,
    loading: apiConfAddGen.loading,
    addApiConfSuccess: apiConfAddGen.addApiConfSuccess,
    editApiConfSuccess: apiConfAddGen.editApiConfSuccess,
    deleteApiConfSuccess: apiConfAddGen.deleteApiConfSuccess
  };

  return responce;
};

export default connect(
  mapStateToProps,
  {
    getApiConfAddGenList,
    getCurrencyList,
    getApiProviderList,
    getCallbackList,
    submitApiConfAddGenForm,
    editApiConfAddGenForm,
    deleteApiConfAddGenForm
  }
)(ApiConfAddGen);
