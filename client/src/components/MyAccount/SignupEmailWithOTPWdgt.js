/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup With Email
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import { Form, FormGroup, Input, Alert } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';

// redux action
import {
    signUpWithEmail,
    signUpEmailResendOTP,
    signUpEmailVerifyOTP,
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

class SignupEmailWithOTPWdgt extends Component {
    constructor(props) {
        super();
        this.state = {
            email: '',
            deviceId: getDeviceInfo(),
            mode: getMode(),
            ipAddress: '', //getIPAddress(),
            hostName: getHostName(),
            err_msg: '',
            success_msg: '',
            err_alert: true,
            success_alert: true,
            btn_disabled: false,
            otp_screen: false,
            loading: false,
            resend_msg: false,
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
            this.setState({ otp: '', success_msg: nextProps.data.ReturnMsg, success_alert: true });
            setTimeout(() => {
                window.location.href = '/signin';
            }, 5000);
        } else if (nextProps.data.ErrorCode === 4036) {
            this.resendOTPForEmail();
            this.setState({ resend_msg: true });
        } else if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (nextProps.data.ReturnCode === 0) {
            var success_msg = this.state.resend_msg ? 'OTP send to your email ID.' : nextProps.data.ReturnMsg;
            this.setState({ otp_screen: true, success_msg: success_msg, success_alert: true, resend_msg: false });
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

        let emailObj = { email: this.state.email };
        const { errors, isValid } = validatesignupEmail(emailObj);
        this.setState({ err_alert: false, errors: errors, btn_disabled: true });

        if (isValid) {
            let emalObj = {
                email: this.state.email,
                deviceId: this.state.deviceId,
                mode: this.state.mode,
                hostName: this.state.hostName,
                PreferedLanguage: AppConfig.locale.locale
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                emalObj.ipAddress = ipAddress;
                self.props.signUpWithEmail(emalObj);
            });
        }
    }

    resendOTPForEmail() {
        let emalObj = {
            email: this.state.email,
            deviceId: this.state.deviceId,
            mode: this.state.mode,
            hostName: this.state.hostName,
            PreferedLanguage: AppConfig.locale.locale
        }

        let self = this;
        getIPAddress().then(function (ipAddress) {
            emalObj.ipAddress = ipAddress;
            self.props.signUpEmailResendOTP(emalObj);
        });
    }

    resendOTP(event) {
        this.setState({ otp: '' });

        event.preventDefault();
        this.resendOTPForEmail();
    }

    verifyOTP(event) {
        event.preventDefault();

        let otpObj = { otp: this.state.otp };
        const { errors, isValid } = validatesignupEmail(otpObj);
        this.setState({ err_alert: false, errors: errors, btn_disabled: true });

        if (isValid) {
            let otpObj = {
                otp: this.state.otp,
                email: this.state.email,
                deviceId: this.state.deviceId,
                mode: this.state.mode,
                hostName: this.state.hostName,
                PreferedLanguage: AppConfig.locale.locale
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                otpObj.ipAddress = ipAddress;
                self.props.signUpEmailVerifyOTP(otpObj);
            });
        }
    }

    render() {
        const { loading, err_alert, err_msg, success_alert, success_msg, email, otp_screen, otp, errors } = this.state;
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
                                <Button disabled={loading} type="submit" className="coolbtn-comman text-white" variant="raised" size="large" onClick={this.verifyOTP}><IntlMessages id="sidebar.btnVerifyOTP" /></Button>
                            </FormGroup>
                            <FormGroup className="mb-15 text-right">
                                <a href="/">Back To Login</a>
                            </FormGroup>
                        </Form>
                        :
                        /* Register Section */
                        <Form>
                            <FormGroup className="has-wrapper">
                                <Input type="email" value={email} name="email" id="email" className="has-input input-lg" placeholder="Enter Email Address" onChange={this.onChange} maxLength="50" /> {/* Add maxlength by Megha Kariya (01/02/2019) */}
                                <span className="has-icon"><i className="ti-email" /></span>
                                {errors.email && <div className="text-danger text-left"><IntlMessages id={errors.email} /></div>}
                            </FormGroup>
                            <FormGroup className="mb-15">
                                <Button disabled={loading} type="submit" className="coolbtn-comman text-white" variant="raised" size="large" onClick={this.onSubmit}><IntlMessages id="sidebar.btnCreateAccount" /></Button>
                            </FormGroup>
                        </Form>
                }
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ sgnUpEmailOTPRdcer }) => {
    var response = {
        data: sgnUpEmailOTPRdcer.data,
        loading: sgnUpEmailOTPRdcer.loading,
        redirect: sgnUpEmailOTPRdcer.redirect
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    signUpWithEmail,
    signUpEmailResendOTP,
    signUpEmailVerifyOTP,
})(SignupEmailWithOTPWdgt));