/**
 * Add User Wdgt
 */
import React, { Component } from "react";
import { Form, FormGroup, Input, Label, Col } from "reactstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// redux action
import { addUsers } from "Actions/MyAccount";
import MatButton from "@material-ui/core/Button";

//intl messages
import IntlMessages from "Util/IntlMessages";

//Validation
const validateAddUsers = require("../../validation/MyAccount/add_user");

class AddUsersWdgt extends Component {
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
    this.onAddUser = this.onAddUser.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  /**
   * On Submit SendSms
   */
  onAddUser() {
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
      this.props.addUsers({
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
          <div className="offset-md-1 mt-20 downloadappbox row">
            <div className="col-md-12">
              <div className="marginbox">
                <div className="d-flex row">
                  <div className="col-md-12">
                    <FormGroup className="has-wrapper" row>
                      <Label
                        for="oldpassword"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.firstname" />}
                      </Label>
                      <Col sm={6}>
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
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="lastname"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.lastname" />}
                      </Label>
                      <Col sm={6}>
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
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="email"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.email" />}
                      </Label>
                      <Col sm={6}>
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
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="password"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.password" />}
                      </Label>
                      <Col sm={6}>
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
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="confirmpassword"
                        className="control-label text-right"
                        sm={3}
                      >
                        {
                          <IntlMessages id="my_account.common.confirmPassword" />
                        }
                      </Label>
                      <Col sm={6}>
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
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="mobileno"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.mobileno" />}
                      </Label>
                      <Col sm={6}>
                        <Input
                          type="text"
                          name="mobileno"
                          value={mobileno}
                          id="mobileno"
                          placeholder="Enter Mobile Number"
                          onChange={this.handleChange}
                        />
                        {errors.mobileno && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.mobileno} />
                          </span>
                        )}
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="exchange"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.exchange" />}
                      </Label>
                      <Col sm={6}>
                        <Input
                          type="select"
                          name="exchange"
                          value={exchange}
                          id="exchange"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="1">OHO Cash</option>
                          <option value="2">PARO Exchange</option>
                          {/* <option value="3">UNIQ Exchange</option> */}
                        </Input>
                        {errors.exchange && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.exchange} />
                          </span>
                        )}
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="profile"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.profile" />}
                      </Label>
                      <Col sm={6}>
                        <Input
                          type="select"
                          name="profile"
                          value={profile}
                          id="profile"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="1">Administrator</option>
                          <option value="2">Partner</option>
                          <option value="3">Operator</option>
                        </Input>
                        {errors.profile && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.profile} />
                          </span>
                        )}
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="role"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.role" />}
                      </Label>
                      <Col sm={6}>
                        <Input
                          type="select"
                          name="role"
                          value={role}
                          id="role"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="1">Administrator</option>
                          <option value="2">Partner</option>
                          <option value="3">Operator</option>
                        </Input>
                        {errors.role && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.role} />
                          </span>
                        )}
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper " row>
                      <Label
                        for="status"
                        className="control-label text-right"
                        sm={3}
                      >
                        {<IntlMessages id="my_account.common.status" />}
                      </Label>
                      <Col sm={6}>
                        <Input
                          type="select"
                          name="status"
                          value={status}
                          id="status"
                          onChange={this.handleChange}
                        >
                          <option value="">Please Select</option>
                          <option value="1">Active</option>
                          <option value="2">InActive</option>
                        </Input>
                        {errors.status && (
                          <span className="text-danger text-left">
                            <IntlMessages id={errors.status} />
                          </span>
                        )}
                      </Col>
                    </FormGroup>

                    <FormGroup className="has-wrapper" row>
                      <Col sm={3} />
                      <Col sm={2}>
                        <MatButton
                          component={Link}
                          to="/app/my-account/users"
                          variant="raised"
                          className="btn-danger text-white"
                        >
                          <IntlMessages id="my_account.commonbtn.cancel" />
                        </MatButton>
                      </Col>
                      <Col sm={2}>
                        <MatButton
                          variant="raised"
                          className="btn-primary text-white"
                          onClick={this.onAddUser}
                        >
                          <IntlMessages id="my_account.user.addNewUser" />
                        </MatButton>
                      </Col>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
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

export default connect(
  mapStateToProps,
  {
    addUsers
  }
)(AddUsersWdgt);
