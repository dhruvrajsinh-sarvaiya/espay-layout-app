/**
 * Form Elemets
 */
/**
 * Add Customer
 */
import React, { Component } from "react";
import { Form, FormGroup, Input, Label, div, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MatButton from "@material-ui/core/Button";

// redux action
import { addCustomers } from "Actions/MyAccount";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Validation
const validateAddCustomers = require("../../validation/MyAccount/add_customer");

class AddCustomerWdgt extends Component {
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
      errors: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  /**
   * On Add Customers
   */
  onAddUser() {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      phoneno,
      exchange,
      country,
      usertype
    } = this.state;
    const { errors, isValid } = validateAddCustomers(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.addCustomers({
        firstname,
        lastname,
        email,
        password,
        confirmpassword,
        phoneno,
        exchange,
        country,
        usertype
      });
    }
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
      errors
    } = this.state;

    return (
      <div>
        <Form>
          <Row>
            <Col md={12}>
              <FormGroup className="row">
                <Label for="firstname" className="col-md-2">
                  {<IntlMessages id="my_account.common.firstname" />}
                </Label>
                <Input
                  type="text"
                  name="firstname"
                  value={firstname}
                  className="col-md-5"
                  id="firstname"
                  placeholder="Enter First Name"
                  onChange={this.handleChange}
                />
                {errors.firstname && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.firstname} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="lastname" className="col-md-2">
                  {<IntlMessages id="my_account.common.lastname" />}
                </Label>
                <Input
                  type="text"
                  name="lastname"
                  value={lastname}
                  className="col-md-5"
                  id="lastname"
                  placeholder="Enter Last Name"
                  onChange={this.handleChange}
                />
                {errors.lastname && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.lastname} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="email" className="col-md-2">
                  {<IntlMessages id="my_account.common.email" />}
                </Label>
                <Input
                  type="text"
                  name="email"
                  value={email}
                  className="col-md-5"
                  id="email"
                  placeholder="Enter Email"
                  onChange={this.handleChange}
                />
                {errors.email && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.email} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="phoneno" className="col-md-2">
                  {<IntlMessages id="my_account.common.phoneno" />}
                </Label>
                <Input
                  type="text"
                  name="phoneno"
                  className="col-md-5"
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
              </FormGroup>

              <FormGroup className="row">
                <Label for="country" className="col-md-2">
                  {<IntlMessages id="my_account.common.country" />}
                </Label>
                <Input
                  type="select"
                  name="country"
                  className="col-md-5"
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
              </FormGroup>

              <FormGroup className="row">
                <Label for="password" className="col-md-2">
                  {<IntlMessages id="my_account.common.password" />}
                </Label>
                <Input
                  type="password"
                  className="col-md-5"
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
              </FormGroup>

              <FormGroup className="row">
                <Label for="confirmpassword" className="col-md-2">
                  {<IntlMessages id="my_account.common.confirmPassword" />}
                </Label>
                <Input
                  type="password"
                  name="confirmpassword"
                  className="col-md-5"
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
              </FormGroup>

              <FormGroup className="row">
                <Label for="usertype" className="col-md-2">
                  {<IntlMessages id="my_account.common.usertype" />}
                </Label>
                <Input
                  type="select"
                  name="usertype"
                  className="col-md-5"
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
              </FormGroup>

              <FormGroup className="row">
                <Label for="exchange" className="col-md-2">
                  {<IntlMessages id="my_account.common.exchange" />}
                </Label>
                <Input
                  type="select"
                  name="exchange"
                  value={exchange}
                  className="col-md-5"
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
              </FormGroup>

              <FormGroup className="has-wrapper" row>
                <div className="col-md-2" />
                <div className="col-md-2 mr-10 p-0">
                  <MatButton
                    variant="raised"
                    className="btn-primary text-white mb-10"
                    onClick={this.onAddUser}
                  >
                    <IntlMessages id="my_account.customerbtn.addNewCustomer" />
                  </MatButton>
                </div>
                <div className="col-md-2 mr-10 p-0">
                  <MatButton
                    component={Link}
                    to="/app/my-account/customers"
                    variant="raised"
                    className="btn-danger text-white mb-10"
                  >
                    <IntlMessages id="my_account.commonbtn.cancel" />
                  </MatButton>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </Form>
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

export default connect(
  mapStateToProps,
  {
    addCustomers
  }
)(AddCustomerWdgt);
