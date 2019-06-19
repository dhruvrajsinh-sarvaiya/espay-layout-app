/**
 * Auther : Kevin Ladani
 * Change By : Salim Deraiya
 * Created : 16/10/2018
 * Signup With Blockchain
 */

import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Alert } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

// intl messages
import IntlMessages from "Util/IntlMessages";
// redux action
import { signUpWithBlockchain } from "Actions/MyAccount";

const validateBlockchainSignup = require('../../validation/MyAccount/blockchain_signup');

import {
  getDeviceInfo,
  getIPAddress,
  getHostName,
  getMode
} from "Helpers/helpers";

class SignupWithBlockchainWidget extends Component {
  constructor(props) {
    super();
    this.state = {
      keyPassword: '',
      deviceId: getDeviceInfo(),
      mode: getMode(),
      ipAddress: getIPAddress(),
      hostName: getHostName(),
      err_msg: '',
      success_msg: '',
      err_alert: true,
      success_alert: true,
      loading: false,
      showPassword : false,
      errors: {}
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickShowPasssword = this.handleClickShowPasssword.bind(this);
  }

  handleClickShowPasssword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

    if (nextProps.redirect) {
      window.location.href = '/app/dashboard/trading';
    } else if (nextProps.errObj.returnCode === 1) {
      if (nextProps.errObj.errorCode === 4036) {
        this.setState({ otp_screen: true });
      } else {
        this.setState({ err_alert: true, err_msg: nextProps.errObj.returnMsg });
      }
    } else if (nextProps.data.statusCode === 200) {
      this.setState({ otp_screen: true, success_msg: nextProps.data.returnMsg, success_alert: true });
    }
  }

  onDismiss() {
    this.setState({ err_alert: false, success_alert: false });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    
    const { errors, isValid } = validateBlockchainSignup(this.state);
    this.setState({ err_alert: false, errors: errors });

    if (isValid) {
      let reqObj = {
        keyPassword: this.state.keyPassword,
        deviceId: this.state.deviceId,
        mode: this.state.mode,
        ipAddress: this.state.ipAddress,
        hostName: this.state.hostName
      }
      this.props.signUpWithBlockchain(reqObj);
    }
  }

  render() {
    const { loading, err_alert, err_msg, success_alert, success_msg, keyPassword, showPassword, errors } = this.state;
    return (
      <div>
        <Form>
          <div className="session-head mb-15 text-center">
            <h2>{<IntlMessages id="sidebar.enterstrongpassword" />}</h2>
          </div>
          <div className="session-head mb-15 text-center">
            <Input
              className="input-lg w-50"
              id="adornment-password"
              type={showPassword ? "text" : "password"}
              value={keyPassword}
              placeholder="Do NOT forget to save this!"
              onChange={this.onChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={this.handleClickShowPasssword}>
                    {showPassword ? (
                      <i className="zmdi zmdi-eye-off" />
                    ) : (
                        <i className="zmdi zmdi-eye" />
                      )}
                  </IconButton>
                </InputAdornment>
              }
            />
            <div>
              {errors.keyPassword && <span className="text-danger text-left"><IntlMessages id={errors.keyPassword} /></span>}
            </div>

            <div className="mt-30">
              <h3>This password encrypts your private key.</h3>
            </div>
            <div className="mt-20">
              <h4>
                you will need either the keystore File + Password or your
                Private key to login to your account.
              </h4>
            </div>
            <div className="mt-20">
              <FormGroup>
                <Button className="btn-warning text-white text-bold btn-block w-100" variant="raised" size="large" onClick={this.onUserSignUp}>Register</Button>
              </FormGroup>
              <FormGroup className="mb-15 float-right">Already Registread <Link to="/app/my-account/login">Login</Link>.</FormGroup>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = ({ sgnUpBlkchnRdcer }) => {
  const { data, loading } = sgnUpBlkchnRdcer;
  return { data, loading };
};

export default connect(mapStateToProps, {
  signUpWithBlockchain
})(SignupWithBlockchainWidget);