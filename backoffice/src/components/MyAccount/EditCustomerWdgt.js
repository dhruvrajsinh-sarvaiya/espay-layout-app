/**
 * Edit Customer
 */
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Label, Col } from "reactstrap";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
// redux action
import { editCustomers, deleteCustomers } from "Actions/MyAccount";
import MatButton from "@material-ui/core/Button";

//intl messages
import IntlMessages from "Util/IntlMessages";
// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

//Validation
const validateEditCustomer = require("../../validation/MyAccount/edit_customer");

class EditCustomerWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      phoneno: "",
      exchange: "",
      country: "",
      usertype: "",
      tfa: "",
      documents: "",
      status: "",
      googleauth: "",
      smsauth: "",
      antipishing: "",
      whitelist: "",
      accountstatus: "",
      accountcreatedat: "",
      accountupdatedat: "",
      lastlogin: "",
      errors: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onEditUser = this.onEditUser.bind(this);
    this.ondeleteCustomerDialog = this.ondeleteCustomerDialog.bind(this);
    this.ondeleteCustomer = this.ondeleteCustomer.bind(this);
  }

  componentWillMount() {
    let prevObj = this.props.location.state;

    if (prevObj.id != "") {
      this.setState({
        firstname: prevObj.item.firstname,
        lastname: prevObj.item.lastname,
        email: prevObj.item.email,
        password: prevObj.item.password,
        phoneno: prevObj.item.phoneno,
        country: prevObj.item.country,
        usertype: prevObj.item.usertype,
        tfa: prevObj.item.tfa,
        googleauth: prevObj.item.googleauth,
        smsauth: prevObj.item.smsauth,
        antipishing: prevObj.item.antipishing,
        whitelist: prevObj.item.whitelist,
        documents: prevObj.item.documents,
        accountstatus: prevObj.item.accountstatus,
        exchange: prevObj.item.exchange,
        accountcreatedat: prevObj.item.accountcreatedat,
        accountupdatedat: prevObj.item.accountupdatedat,
        lastlogin: prevObj.item.lastlogin
      });
    } else {
      this.props.history.push("/app/my-account/customers");
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * On Edit Customers
   */
  onEditUser() {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      phoneno,
      exchange,
      country,
      usertype,
      tfa,
      documents,
      googleauth,
      smsauth,
      antipishing,
      whitelist,
      accountstatus,
      accountcreatedat,
      accountupdatedat,
      lastlogin
    } = this.state;
    const { errors, isValid } = validateEditCustomer(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.editCustomers({
        firstname,
        lastname,
        email,
        password,
        confirmpassword,
        phoneno,
        exchange,
        country,
        usertype,
        tfa,
        documents,
        googleauth,
        smsauth,
        antipishing,
        whitelist,
        accountstatus,
        accountcreatedat,
        accountupdatedat,
        lastlogin
      });
    }
  }

  ondeleteCustomerDialog(data) {
    const { errors, isValid } = validateEditCustomer(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      this.refs.deleteConfirmationDialog.open();
      this.setState({ selectedUser: data });
    }
  }

  ondeleteCustomer() {
    const { selectedUser } = this.state;
    this.props.deleteCustomers({ selectedUser });
    this.refs.deleteConfirmationDialog.close();
  }

  render() {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      phoneno,
      exchange,
      country,
      usertype,
      tfa,
      documents,
      googleauth,
      smsauth,
      antipishing,
      whitelist,
      accountstatus,
      accountcreatedat,
      errors
    } = this.state;
    return (
      <div>
        <Form>
          <div className="offset-md-2 mt-20 downloadappbox row">
            <div className="col-md-10">
              <div className="marginbox">
                <div className="d-flex row">
                  <div className="col-md-12">
                    <FormGroup className="has-wrapper text-right" row>
                      <Label
                        for="oldpassword"
                        className="control-label col-md-4"
                      >
                        {<IntlMessages id="my_account.common.firstname" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="text"
                          name="firstname"
                          value={firstname}
                          id="firstname"
                          placeholder="Enter First Name"
                          onChange={this.handleChange}
                        />
                        {errors.firstname && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.firstname} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="lastname" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.lastname" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="text"
                          name="lastname"
                          value={lastname}
                          id="lastname"
                          placeholder="Enter Last Name"
                          onChange={this.handleChange}
                        />
                        {errors.lastname && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.lastname} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="email" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.email" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="text"
                          name="email"
                          value={email}
                          id="email"
                          placeholder="Enter Email"
                          onChange={this.handleChange}
                        />
                        {errors.email && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.email} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="phoneno" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.phoneno" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="text"
                          name="phoneno"
                          value={phoneno}
                          id="phoneno"
                          placeholder="Enter Phone Number"
                          onChange={this.handleChange}
                        />
                        {errors.phoneno && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.phoneno} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="country" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.country" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="country"
                          value={country}
                          id="country"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="India">India</option>
                          <option value="Zimbabwe">Zimbabwe</option>
                          <option value="United States">United States</option>
                        </Input>
                        {errors.country && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.country} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="password" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.password" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="password"
                          name="password"
                          // value={password} //Added By Bharat Jograna
                          id="password"
                          placeholder="Enter Password"
                          onChange={this.handleChange}
                        />
                        {errors.password && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.password} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label
                        for="confirmpassword"
                        className="control-label"
                        sm={4}
                      >
                        {
                          <IntlMessages id="my_account.common.confirmPassword" />
                        }
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="password"
                          name="confirmpassword"
                          // value={confirmpassword} //Added By Bharat Jograna
                          id="confirmpassword"
                          placeholder="Enter Confirm Password"
                          onChange={this.handleChange}
                        />
                        {errors.confirmpassword && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.confirmpassword} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="usertype" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.usertype" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="usertype"
                          value={usertype}
                          id="usertype"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="Individual">Individual</option>
                          <option value="Enterprise">Enterprise</option>
                        </Input>
                        {errors.usertype && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.usertype} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="tfa" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.tfa" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="tfa"
                          value={tfa}
                          id="tfa"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="Disable">Disable</option>
                          <option value="Enable">Enable</option>
                        </Input>
                        {errors.tfa && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.tfa} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label
                        for="googleauth"
                        className="control-label col-md-4"
                      >
                        {<IntlMessages id="my_account.common.googleauth" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="googleauth"
                          value={googleauth}
                          id="googleauth"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="Disable">Disable</option>
                          <option value="Enable">Enable</option>
                        </Input>
                        {errors.googleauth && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.googleauth} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="smsauth" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.smsauth" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="smsauth"
                          value={smsauth}
                          id="smsauth"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="Disable">Disable</option>
                          <option value="Enable">Enable</option>
                        </Input>
                        {errors.smsauth && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.smsauth} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="antipishing" className="control-label" sm={4}>
                        {<IntlMessages id="my_account.common.antipishing" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="antipishing"
                          name="antipishing"
                          value={antipishing}
                          id="antipishing"
                          placeholder="Enter anti pishing Code"
                          onChange={this.handleChange}
                        />
                        {errors.antipishing && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.antipishing} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="whitelist" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.whitelist" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="whitelist"
                          value={whitelist}
                          id="whitelist"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </Input>
                        {errors.whitelist && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.whitelist} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="documents" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.documents" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="documents"
                          value={documents}
                          id="documents"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="Verified">Verified</option>
                          <option value="Not Verified">Not Verified</option>
                        </Input>
                        {errors.documents && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.documents} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label
                        for="accountstatus"
                        className="control-label col-md-4"
                      >
                        {<IntlMessages id="my_account.common.accountstatus" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="accountstatus"
                          value={accountstatus}
                          id="accountstatus"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="Active">Active</option>
                          <option value="In Active">In Active</option>
                        </Input>
                        {errors.accountstatus && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.accountstatus} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <Label for="exchange" className="control-label col-md-4">
                        {<IntlMessages id="my_account.common.exchange" />}
                      </Label>
                      <div className="col-md-8">
                        <Input
                          type="select"
                          name="exchange"
                          value={exchange}
                          id="exchange"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="OHO Cash">OHO Cash</option>
                          <option value="PARO Exchange">PARO Exchange</option>
                          <option value="UNIQ Exchange">UNIQ Exchange</option>
                        </Input>
                        {errors.exchange && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.exchange} />
                          </span>
                        )}
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="accountcreatedat"
                        className="control-label text-right col-md-4"
                      >
                        {
                          <IntlMessages id="my_account.common.accountcreatedat" />
                        }
                      </Label>
                      <div className="col-md-8">
                        <Label for="accountcreatedat" className="control-label">
                          July 9, 2018 at 12:32PM
                        </Label>
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="accountcreatedat"
                        className="control-label text-right col-md-4"
                      >
                        {
                          <IntlMessages id="my_account.common.accountupdatedat" />
                        }
                      </Label>
                      <div className="col-md-8">
                        <Label for="accountcreatedat" className="control-label">
                          July 9, 2018 at 12:32PM
                        </Label>
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="accountcreatedat"
                        className="control-label text-right col-md-4"
                      >
                        {<IntlMessages id="my_account.common.lastlogin" />}
                      </Label>
                      <div className="col-md-8">
                        <Label
                          value={accountcreatedat}
                          for="accountcreatedat"
                          className="control-label"
                        >
                          September 9, 2018 at 12:32PM
                        </Label>
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper text-right" row>
                      <div className="col-md-4">
                        <Label for="exchange" className="control-label">
                          {<IntlMessages id="my_account.common.view" />}
                        </Label>
                      </div>
                      <div className="col-md-3">
                        <Link to="">Wallet Balance</Link>
                      </div>
                      <div className="col-md-1">
                        <Link to="">APIs</Link>
                      </div>
                      <div className="col-md-2">
                        <Link to="">Banks</Link>
                      </div>
                      <div className="col-md-2">
                        <Link to="">Documents</Link>
                      </div>
                      <div className="col-md-4" />
                      <div className="col-md-3">
                        <Link to="">Deposit Addresses</Link>
                      </div>
                      <div className="col-md-4">
                        <Link to="">Withdrawal Addresses</Link>
                      </div>
                      <div className="col-md-1">
                        <Link to="">Orders</Link>
                      </div>
                    </FormGroup>

                    <FormGroup className="has-wrapper" row>
                      <div className="col-md-3" />
                      <div className="col-md-2">
                        <MatButton
                          component={Link}
                          to="/app/my-account/customers"
                          variant="raised"
                          className="btn-secondary text-white"
                        >
                          {<IntlMessages id="my_account.commonbtn.back" />}
                        </MatButton>
                      </div>

                      <div className="col-md-2">
                        <MatButton
                          variant="raised"
                          className="btn-danger text-white"
                          onClick={() =>
                            this.ondeleteCustomerDialog(this.state)
                          }
                        >
                          {<IntlMessages id="my_account.customerbtn.delete" />}
                        </MatButton>
                      </div>
                      <div className="col-md-3">
                        <MatButton
                          variant="raised"
                          className="btn-primary text-white"
                          onClick={this.onEditUser}
                        >
                          {
                            <IntlMessages id="my_account.customerbtn.updateCustomer" />
                          }
                        </MatButton>
                      </div>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
        <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Are You Sure Want To Delete?"
          message="This will delete user permanently."
          onConfirm={() => this.ondeleteCustomer()}
        />
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ costomers }) => {
  var response = {
    userList: costomers.displayCustomersData,
    loading: costomers.loading
  };
  return response;
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      editCustomers,
      deleteCustomers
    }
  )(EditCustomerWdgt)
);
