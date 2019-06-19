/**
 * Created By : Sanjay Rathod
 * Created Date : 31/01/2019
 * Signin With Mobile
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Alert } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
//Import Google 2FA Component
// import TwoFaGoogleAuthentication from "./2FAGoogleAuthentication";
// redux action
import {
    signInWithMobile,
    signInMobileResendOTP,
    signInMobileVerifyOTP,
    gerenateToken
} from "Actions/MyAccount";

// intl messages
import IntlMessages from "Util/IntlMessages";

import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';

const validatesignupEmail = require('../../validation/MyAccount/email_signup');

class SigninMobileWithOTPWdgt extends Component {
    constructor(props) {
        super();
        this.state = {
            mobile: '',
            deviceId: getDeviceInfo(),
            mode: getMode(),
            ipAddress: getIPAddress(),
            hostName: getHostName(),
            appkey: '',
            TwoFAKey: '',
            twoFA: false,
            err_msg: '',
            success_msg: '',
            err_alert: true,
            success_alert: true,
            otp_screen: false,
            loading: false,
            otp: '',
            errors: {}
        };
        this.onDismiss = this.onDismiss.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.verifyOTP = this.verifyOTP.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.redirect) {            
            window.location.href = AppConfig.afterLoginRedirect;
        } else if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (nextProps.generate_token && nextProps.data.ReturnCode === 0) {
            this.setState({ loading: true });
            var reqObj = {
                username: this.state.mobile,
                password: this.state.otp,
                appkey: this.state.appkey
            }
            this.props.gerenateToken(reqObj);
        } else if (nextProps.data.ReturnCode === 0) {
            this.setState({
                appkey: nextProps.data.Appkey,
                otp_screen: true,
                success_msg: nextProps.data.ReturnMsg,
                success_alert: true
            });
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

        let newObj = { mobile: this.state.mobile };
        const { errors, isValid } = validatesignupEmail(newObj);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let reqObj = {
                mobile: this.state.mobile,
                deviceId: this.state.deviceId,
                mode: this.state.mode,
                hostName: this.state.hostName
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                reqObj.ipAddress = ipAddress;
                self.props.signInWithMobile(reqObj);
            });
        }
    }

    resendOTP(event) {
        this.setState({ otp: '' });
        event.preventDefault();
        let reqObj = {
            mobile: this.state.mobile,
            deviceId: this.state.deviceId,
            mode: this.state.mode,
            hostName: this.state.hostName
        }

        let self = this;
        getIPAddress().then(function (ipAddress) {
            reqObj.ipAddress = ipAddress;
            self.props.signInMobileResendOTP(reqObj);
        });
    }

    verifyOTP(event) {
        event.preventDefault();

        let otpObj = { otp: this.state.otp };
        const { errors, isValid } = validatesignupEmail(otpObj);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let reqObj = {
                appkey: this.state.appkey,
                otp: this.state.otp,
                mobile: this.state.mobile,
                deviceId: this.state.deviceId,
                mode: this.state.mode,
                hostName: this.state.hostName
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                reqObj.ipAddress = ipAddress;
                self.props.signInMobileVerifyOTP(reqObj);
            });
        }
    }

    render() {
        const { twoFA, loading, err_alert, err_msg, success_alert, success_msg, mobile, otp_screen, otp, errors } = this.state;
        return (
            <Fragment>
                {loading && <div><LinearProgress color="secondary" /></div>}
                {success_msg && <div className="alert_area">
                    <Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
                </div>}
                {err_msg && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
                </div>}
                {
                    otp_screen
                    ?
                    /* OTP Section */
                    <Form>
                        <FormGroup className="has-wrapper">
                            <div className="input-group mb-3">
                                <Input type="text" value={otp} name="otp" id="otp" maxLength="6" className="has-input input-lg" placeholder="Enter OTP" onChange={this.onChange} />
                                <div className="input-group-append">
                                    <Button disabled={loading} className="btn-success text-white" onClick={this.resendOTP}><IntlMessages id="sidebar.btnResendOTP" /></Button>
                                </div>
                            </div>
                            {errors.otp && <div className="text-danger text-left"><IntlMessages id={errors.otp} /></div>}
                        </FormGroup>
                        <FormGroup className="mb-15">
                            <Button disabled={loading} className="btn-info text-white" type="submit" variant="raised" size="large" onClick={this.verifyOTP}><IntlMessages id="sidebar.btnVerifyOTP" /></Button>
                        </FormGroup>
                    </Form>
                    :
                    /* Register Section */
                    <Form>
                        <FormGroup className="has-wrapper">
                            <Input type="text" value={mobile} name="mobile" id="mobile" className="has-input input-lg" placeholder="Enter Mobile" onChange={this.onChange} />
                            <span className="has-icon"><i className="ti-mobile" /></span>
                            {errors.mobile && <div className="text-danger text-left"><IntlMessages id={errors.mobile} /></div>}
                        </FormGroup>
                        <FormGroup className="mb-15">
                            <Button disabled={loading} type="submit" className="btn-info text-white" variant="raised" size="large" onClick={this.onSubmit}><IntlMessages id="sidebar.btnLogin" /></Button>
                        </FormGroup>
                    </Form>                    
                }
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ signInMobileOTP, authTokenRdcer }) => {
    var response = {
        data: signInMobileOTP.data,
        loading: signInMobileOTP.loading,
        generate_token: signInMobileOTP.generate_token,
        redirect: authTokenRdcer.redirect
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    signInWithMobile,
    signInMobileResendOTP,
    signInMobileVerifyOTP,
    gerenateToken
})(SigninMobileWithOTPWdgt));
