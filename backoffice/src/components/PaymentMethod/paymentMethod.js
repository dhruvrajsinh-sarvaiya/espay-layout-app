import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input } from "reactstrap";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";

// Import component for validation
import validator from "validator";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
import NotFoundTable from "../NotFoundTable/notFoundTable";
import { NotificationManager } from "react-notifications";

//Action Import for Payment Method  Report Add And Update
import { addPaymentMethod, onUpdatePaymentMethod } from "Actions/PaymentMethod";

import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";

var validatePaymentMethod = require("../../validation/PaymentMethod/paymentMethod");
var validateAddPaymentMethod = require("../../validation/PaymentMethod/addPaymnetMethod");

const buttonSizeSmall = {
  maxHeight: "28px",
  minHeight: "28px",
  maxWidth: "28px",
  fontSize: "1rem"
};

class PaymentMethod extends Component {
  state = {
    editPaymentMethodModal: false,
    editPaymentMethod: null,
    addNewPaymentMethod: false,
    addNewPaymentMethodForm: false,
    addNewPaymentMethodDetails: {
      id: "",
      name: "",
      displayName: "",
      status: "",
      withdraw: "",
      withdrawCommission: "",
      Exchange: ""
    },
    successMessage: "",
    errors: ""
  };
  // edit Payment Method
  onEditPaymentMethod(payment) {
    this.setState({
      editPaymentMethodModal: true,
      editPaymentMethod: payment,
      addNewPaymentMethodForm: false
    });
  }

  // toggle edit Payment method  modal
  toggleEditPaymentMethodModal = () => {
    this.setState({
      editPaymentMethodModal: !this.state.editPaymentMethodModal,
      errors: {}
    });
  };

  closeAll = () => {
    this.props.closeAll();
    this.setState({
      editPaymentMethodModal: false
    });
  };

  // submit payment Method form
  onSubmitPaymentMethodForm() {
    const { errors, isValid } = validatePaymentMethod(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      const { editPaymentMethod } = this.state;

      this.setState({
        editPaymentMethodModal: false
      });
      let indexOfCustomer;
      for (let i = 0; i < this.props.data.length; i++) {
        const paymnetMethod = this.props.data[i];
        if (paymnetMethod.id === editPaymentMethod.id) {
          indexOfCustomer = i;
        }
      }
      this.props.onUpdatePaymentMethod(this.state.editPaymentMethod);
      NotificationManager.success("Report has been Edit successfully!");
    }
  }

  // on change Payment Method report
  onChangePaymentMethod(key, value) {
    this.setState({
      editPaymentMethod: {
        ...this.state.editPaymentMethod,
        [key]: value
      }
    });
  }

  // add new Payment Method report
  addNewPaymentMethod() {
    this.setState({
      editPaymentMethodModal: true,
      addNewPaymentMethodForm: true,
      editPaymentMethod: null,
      addNewPaymentMethodDetails: {
        id: "",
        name: "",
        displayName: "",
        status: "",
        withdraw: "",
        withdrawCommission: "",
        Exchange: ""
      }
    });
  }

  // on change Payment Method add new form value
  onChangePaymnetMethodAddNewForm(key, value) {
    this.setState({
      addNewPaymentMethodDetails: {
        ...this.state.addNewPaymentMethodDetails,
        [key]: value
      }
    });
  }

  // on submit add new Paytment Method Report form
  onSubmitAddNewPaymentMethodForm() {
    const { errors, isValid } = validateAddPaymentMethod(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      const { addNewPaymentMethodDetails } = this.state;

      this.setState({ editPaymentMethodModal: false });
      let newPaymentMethod = addNewPaymentMethodDetails;

      this.props.addPaymentMethod(newPaymentMethod);
      NotificationManager.success("Report has been Add successfully!");
    }
  }

  //function for allow only integer in text box for new from
  onChangeNumber(key, value) {
    if (
      validator.isDecimal(value, {
        force_decimal: false,
        decimal_digits: "0,8"
      }) ||
      validator.isNumeric(value)
    ) {
      this.setState({
        addNewPaymentMethodDetails: {
          ...this.state.addNewPaymentMethodDetails,
          [key]: value
        }
      });
    }
  }

  //function for allow only integer in text box for Edit from
  onChangeEditNumber(key, value) {
    if (
      validator.isDecimal(value, {
        force_decimal: false
      }) ||
      validator.isNumeric(value)
    ) {
      this.setState({
        editPaymentMethod: {
          ...this.state.editPaymentMethod,
          [key]: value
        }
      });
    }
  }

  render() {
    const {
      editPaymentMethodModal,
      editPaymentMethod,
      addNewPaymentMethodForm,
      addNewPaymentMethodDetails
    } = this.state;

    const columns = [
      {
        name: <IntlMessages id="lable.name" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="lable.dispalyName" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="lable.status" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="lable.withdraw" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="lable.withdrawCommission" />,
        options: { sort: true, filter: false }
      },
      {
        name: <IntlMessages id="lable.exchange" />,
        options: { sort: true, filter: true }
      },
      {
        name: <IntlMessages id="table.action" />,
        options: { sort: false, filter: false }
      }
    ];

    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
      print: false,
      download: false,
      viewColumns: false,
      filter: true,
      customToolbar: () => {
        return (
          <Button
            variant="raised"
            className="btn-primary text-white mt-5"
            style={{ float: "right" }}
            onClick={() => this.addNewPaymentMethod()}
          >
            <IntlMessages id="button.addNew" />
          </Button>
        );
      }
    };
    return (
      <div className="StackingHistory">
        {this.props.data.length !== 0 ? (
          <MUIDataTable
            title={this.props.title}
            data={this.props.data.map(item => {
              return [
                item.name,
                item.displayName,
                item.status,
                item.withdraw,
                item.withdrawCommission,
                item.Exchange,
                <div className="list-action">
                  <a
                    href="javascript:void(0)"
                    color="primary"
                    onClick={() => this.onEditPaymentMethod(item)}
                  >
                    <i className="ti-pencil" />
                  </a>
                </div>
              ];
            })}
            columns={columns}
            options={options}
          />
        ) : (
          <NotFoundTable title={this.props.title} columns={columns} />
        )}
        {editPaymentMethodModal && (
          <Drawer
            width="50%"
            handler={false}
            open={this.state.editPaymentMethodModal}
            onMaskClick={this.toggleEditPaymentMethodModal}
            level=".drawer1"
            className="drawer12"
            placement="right"
          >
            <JbsCollapsibleCard>
              <div className="page-title d-flex justify-content-between align-items-center">
                {addNewPaymentMethodForm ? (
                  <h2>
                    <span>
                      <IntlMessages id="modal.addNewPaymentMethod" />
                    </span>
                  </h2>
                ) : (
                  <h2>
                    <span>
                      <IntlMessages id="modal.editPaymentMethod" />
                    </span>
                  </h2>
                )}
                <div className="page-title-wrap">
                  <Button
                    className="btn-warning text-white mr-10 mb-10"
                    style={buttonSizeSmall}
                    variant="fab"
                    mini
                    onClick={this.toggleEditPaymentMethodModal}
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
              {addNewPaymentMethodForm ? (
                <Form>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.name" />
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      value={addNewPaymentMethodDetails.name}
                      onChange={e =>
                        this.onChangePaymnetMethodAddNewForm(
                          "name",
                          e.target.value
                        )
                      }
                    />
                    {this.state.errors.name && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.name} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.dispalyName" />
                    </Label>
                    <Input
                      type="text"
                      name="displayName"
                      value={addNewPaymentMethodDetails.displayName}
                      onChange={e =>
                        this.onChangePaymnetMethodAddNewForm(
                          "displayName",
                          e.target.value
                        )
                      }
                    />
                    {this.state.errors.displayName && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.displayName} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.status" />
                    </Label>
                    <Input
                      type="select"
                      name="status"
                      value={addNewPaymentMethodDetails.status}
                      onChange={e =>
                        this.onChangePaymnetMethodAddNewForm(
                          "status",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Please Select</option>
                      <option value="Active">Active</option>
                      <option value="InActive">InActive</option>
                    </Input>
                    {this.state.errors.status && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.status} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.withdraw" />
                    </Label>
                    <Input
                      type="select"
                      name="withdraw"
                      value={addNewPaymentMethodDetails.withdraw}
                      onChange={e =>
                        this.onChangePaymnetMethodAddNewForm(
                          "withdraw",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Please Select</option>
                      <option value="Active">Active</option>
                      <option value="InActive">InActive</option>
                    </Input>
                    {this.state.errors.withdraw && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.withdraw} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.withdrawCommission" />
                    </Label>
                    <Input
                      type="text"
                      name="withdrawCommission"
                      value={addNewPaymentMethodDetails.withdrawCommission}
                      onChange={e =>
                        this.onChangeNumber(
                          "withdrawCommission",
                          e.target.value
                        )
                      }
                    />
                    {this.state.errors.withdrawCommission && (
                      <span className="text-danger">
                        <IntlMessages
                          id={this.state.errors.withdrawCommission}
                        />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.exchange" />
                    </Label>
                    <Input
                      type="text"
                      name="Exchange"
                      value={addNewPaymentMethodDetails.Exchange}
                      onChange={e =>
                        this.onChangePaymnetMethodAddNewForm(
                          "Exchange",
                          e.target.value
                        )
                      }
                    />
                    {this.state.errors.Exchange && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.Exchange} />
                      </span>
                    )}
                  </FormGroup>
                </Form>
              ) : (
                <Form>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.id" />
                    </Label>
                    <Input
                      type="text"
                      defaultValue={editPaymentMethod.id}
                      readOnly
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.name" />
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      value={editPaymentMethod.name}
                      onChange={e =>
                        this.onChangePaymentMethod("name", e.target.value)
                      }
                    />
                    {this.state.errors.name && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.name} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.dispalyName" />
                    </Label>
                    <Input
                      type="text"
                      name="displayName"
                      value={editPaymentMethod.displayName}
                      onChange={e =>
                        this.onChangePaymentMethod(
                          "displayName",
                          e.target.value
                        )
                      }
                    />
                    {this.state.errors.displayName && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.displayName} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.status" />
                    </Label>
                    <Input
                      type="select"
                      name="status"
                      value={editPaymentMethod.status}
                      onChange={e =>
                        this.onChangePaymentMethod("status", e.target.value)
                      }
                    >
                      <option value="">Please Select</option>
                      <option value="Active" defaultValue>
                        Active
                      </option>
                      <option value="InActive">InActive</option>
                    </Input>
                    {this.state.errors.status && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.status} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.withdraw" />
                    </Label>
                    <Input
                      type="select"
                      name="withdraw"
                      value={editPaymentMethod.withdraw}
                      onChange={e =>
                        this.onChangePaymentMethod("withdraw", e.target.value)
                      }
                    >
                      <option value="">Please Select</option>
                      <option value="Active" defaultValue>
                        Active
                      </option>
                      <option value="InActive">InActive</option>
                    </Input>
                    {this.state.errors.withdraw && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.withdraw} />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.withdrawCommission" />
                    </Label>
                    <Input
                      type="text"
                      name="withdrawCommission"
                      value={editPaymentMethod.withdrawCommission}
                      onChange={e =>
                        this.onChangeEditNumber(
                          "withdrawCommission",
                          e.target.value
                        )
                      }
                    />
                    {this.state.errors.withdrawCommission && (
                      <span className="text-danger">
                        <IntlMessages
                          id={this.state.errors.withdrawCommission}
                        />
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="lable.exchange" />
                    </Label>
                    <Input
                      type="text"
                      name="Exchange"
                      value={editPaymentMethod.Exchange}
                      onChange={e =>
                        this.onChangePaymentMethod("Exchange", e.target.value)
                      }
                    />
                    {this.state.errors.Exchange && (
                      <span className="text-danger">
                        <IntlMessages id={this.state.errors.Exchange} />
                      </span>
                    )}
                  </FormGroup>
                </Form>
              )}
              {addNewPaymentMethodForm ? (
                <div>
                  <Button
                    variant="raised"
                    className="btn-primary text-white"
                    onClick={() => this.onSubmitAddNewPaymentMethodForm()}
                  >
                    <IntlMessages id="button.add" />
                  </Button>{" "}
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={this.toggleEditPaymentMethodModal}
                  >
                    <IntlMessages id="button.cancel" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="raised"
                    className="btn-primary text-white"
                    onClick={() => this.onSubmitPaymentMethodForm()}
                  >
                    <IntlMessages id="button.update" />
                  </Button>{" "}
                  <Button
                    variant="raised"
                    className="btn-danger text-white"
                    onClick={this.toggleEditPaymentMethodModal}
                  >
                    <IntlMessages id="button.cancel" />
                  </Button>
                </div>
              )}
            </JbsCollapsibleCard>
          </Drawer>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ paymetMethod }) => {
  var responce = {
    paymentMethodData: paymetMethod.paymentMethodData,
    loading: paymetMethod.Loading
  };
  return responce;
};

export default connect(
  mapStateToProps,
  {
    onUpdatePaymentMethod,
    addPaymentMethod
  }
)(PaymentMethod);
