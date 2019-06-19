/**
 * Form Elemets
 */
/**
 * Forgot Password
 */
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Label, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// redux action
import { editUsers, deleteUsers } from "Actions/MyAccount";
import MatButton from "@material-ui/core/Button";

//intl messages
import IntlMessages from "Util/IntlMessages";
// delete confirmation dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

//Validation
const validateAddUsers = require("../../validation/MyAccount/add_user");

class EditUsersWdgt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      mobileno: "",
      exchange: "",
      profile: "",
      role: "",
      status: "",
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
        mobileno: prevObj.item.mobileno,
        exchange: prevObj.item.exchange,
        profile: prevObj.item.profile,
        role: prevObj.item.role,
        status: prevObj.item.status
      });
    } else {
      this.props.history.push("/app/my-account/customers");
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * On Edit Users
   */
  onEditUser() {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      mobileno,
      exchange,
      profile,
      role,
      status
    } = this.state;
    const { errors, isValid } = validateAddUsers(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.editUsers({
        firstname,
        lastname,
        email,
        password,
        confirmpassword,
        mobileno,
        exchange,
        profile,
        role,
        status
      });
    }
  }

  ondeleteCustomerDialog(data) {
    const { errors, isValid } = validateAddUsers(this.state);
    this.setState({ errors: errors });
    if (isValid) {
      this.refs.deleteConfirmationDialog.open();
      this.setState({ selectedUser: data });
    }
  }

  ondeleteCustomer() {
    const { selectedUser } = this.state;
    this.props.deleteUsers({ selectedUser });

    this.refs.deleteConfirmationDialog.close();
  }

  render() {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      mobileno,
      exchange,
      profile,
      role,
      status,
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
                  className="col-md-5"
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
              </FormGroup>

              <FormGroup className="row">
                <Label for="lastname" className="col-md-2">
                  {<IntlMessages id="my_account.common.lastname" />}
                </Label>
                <Input
                  type="text"
                  name="lastname"
                  className="col-md-5"
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
                <Label for="password" className="col-md-2">
                  {<IntlMessages id="my_account.common.password" />}
                </Label>
                <Input
                  type="password"
                  name="password"
                  // value={password} //Added By Bharat Jograna
                  id="password"
                  className="col-md-5"
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
                  // value={confirmpassword} //Added By Bharat Jograna
                  id="confirmpassword"
                  className="col-md-5"
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
                <Label for="mobileno" className="col-md-2">
                  {<IntlMessages id="my_account.common.mobileno" />}
                </Label>
                <Input
                  type="text"
                  name="mobileno"
                  value={mobileno}
                  className="col-md-5"
                  id="mobileno"
                  placeholder="Enter Mobile Number"
                  onChange={this.handleChange}
                />
                {errors.mobileno && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.mobileno} />
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
                  <option>Please Select</option>
                  <option>OHO Cash</option>
                  <option>PARO Exchange</option>
                  <option>UNIQ Exchange</option>
                </Input>
                {errors.exchange && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.exchange} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="profile" className="col-md-2">
                  {<IntlMessages id="my_account.common.profile" />}
                </Label>
                <Input
                  type="select"
                  name="profile"
                  value={profile}
                  className="col-md-5"
                  id="profile"
                  onChange={this.handleChange}
                >
                  <option>Please Select</option>
                  <option>Administrator</option>
                  <option>Partner</option>
                  <option>Operator</option>
                </Input>
                {errors.profile && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.profile} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="role" className="col-md-2">
                  {<IntlMessages id="my_account.common.role" />}
                </Label>
                <Input
                  type="select"
                  name="role"
                  className="col-md-5"
                  value={role}
                  id="role"
                  onChange={this.handleChange}
                >
                  <option>Please Select</option>
                  <option>Administrator</option>
                  <option>Partner</option>
                  <option>Operator</option>
                </Input>
                {errors.role && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.role} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="row">
                <Label for="status" className="col-md-2">
                  {<IntlMessages id="my_account.common.status" />}
                </Label>
                <Input
                  type="select"
                  name="status"
                  className="col-md-5"
                  value={status}
                  id="status"
                  onChange={this.handleChange}
                >
                  <option>Please Select</option>
                  <option>Active</option>
                  <option>InActive</option>
                </Input>
                {errors.status && (
                  <span className="text-danger text-left">
                    <IntlMessages id={errors.status} />
                  </span>
                )}
              </FormGroup>

              <FormGroup className="has-wrapper" row>
                <div className="col-md-2" />
                <div className="col-md-1 mr-10 p-0">
                  <MatButton
                    variant="raised"
                    className="btn-primary text-white mb-10"
                    onClick={this.onEditUser}
                  >
                    {<IntlMessages id="my_account.user.updateUser" />}
                  </MatButton>
                </div>

                <div className="col-md-1 mr-10 p-0">
                  <MatButton
                    variant="raised"
                    className="btn-danger text-white mb-10"
                    onClick={() => this.ondeleteCustomerDialog(this.state)}
                  >
                    {<IntlMessages id="my_account.user.deleteUser" />}
                  </MatButton>
                </div>

                <div className="col-md-1 mr-10 p-0">
                  <MatButton
                    component={Link}
                    to="/app/my-account/users"
                    variant="raised"
                    className="btn-secondary text-white mb-10"
                  >
                    {<IntlMessages id="my_account.commonbtn.back" />}
                  </MatButton>
                </div>
              </FormGroup>
            </Col>
          </Row>
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
const mapStateToProps = ({ displayUsers }) => {
  var response = {
    userList: displayUsers.displayUsersData,
    loading: displayUsers.loading
  };
  return response;
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      editUsers,
      deleteUsers
    }
  )(EditUsersWdgt)
);
