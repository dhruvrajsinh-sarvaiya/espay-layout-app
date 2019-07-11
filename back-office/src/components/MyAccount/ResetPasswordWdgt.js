/**
 * Form Elemets
 */
/**
 * Reset Password
 */
import React, { Component } from "react";
import { Form, FormGroup, Input } from "reactstrap";
import { connect } from "react-redux";

// intl messages
import IntlMessages from "Util/IntlMessages";
import MatButton from "@material-ui/core/Button";

// redux action
import { resetPassword } from "Actions/MyAccount";

//Validation
const validateResetPassword = require("../../validation/MyAccount/reset_password");

class ResetPasswordWdgt extends Component {
  constructor(props) {
    super();
    this.state = {
      newpassword: "",
      confirmpassword: "",
      errors: ""
    };
    this.onResetpwd = this.onResetpwd.bind(this);
  }

  /**
   * Reset Password
   */
  onResetpwd() {
    const { newpassword, confirmpassword } = this.state;
    const { errors, isValid } = validateResetPassword(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      this.props.resetPassword({ newpassword, confirmpassword });
    }
  }

  render() {
    const { newpassword, errors } = this.state;
    return (
      <div>
        <Form>
          <FormGroup className="has-wrapper">
            <Input
              type="text"
              value={newpassword}
              name="newpassword"
              id="newpassword"
              className="has-input input-lg"
              placeholder="Enter New Password"
              onChange={e => this.setState({ newpassword: e.target.value })}
            />
            <span className="has-icon">
              <i className="ti-lock" />
            </span>
            {errors.newpassword && (
              <span className="text-danger">
                <IntlMessages id={errors.newpassword} />
              </span>
            )}
          </FormGroup>

          <FormGroup className="has-wrapper">
            <Input
              type="Password"
              // value={confirmpassword} //Added By Bharat Jograna
              name="confirm-pwd"
              id="confirm-pwd"
              className="has-input input-lg"
              placeholder="Confirm Password"
              onChange={e => this.setState({ confirmpassword: e.target.value })}
            />
            <span className="has-icon">
              <i className="ti-lock" />
            </span>
            {errors.confirmpassword && (
              <span className="text-danger">
                <IntlMessages id={errors.confirmpassword} />
              </span>
            )}
          </FormGroup>

          <FormGroup className="mb-15">
            <MatButton
              variant="raised"
              className="btn-warning text-white w-100"
              onClick={this.onResetpwd}
            >
              <IntlMessages id={"sidebar.btnSubmit"} />
            </MatButton>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ resetPasswordReducer }) => {
  var response = {
    userList: resetPasswordReducer.resetPassword,
    loading: resetPasswordReducer.loading
  };
  return response;
};

export default connect(
  mapStateToProps,
  {
    resetPassword
  }
)(ResetPasswordWdgt);
