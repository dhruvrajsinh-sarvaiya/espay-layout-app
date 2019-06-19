/**
 * Auther : Salim Deraiya
 * Created : 13/10/2018
 * Signup With Mobile
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Alert } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
import $ from "jquery";

// redux action
import {
    signUpWithMobile,
    signUpMobileResendOTP,
    signUpMobileVerifyOTP
} from "Actions/MyAccount";

// intl messages
import IntlMessages from "Util/IntlMessages";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode,
    getMobileNoWithCountryCode
} from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
const validateMobileSignup = require('../../validation/MyAccount/mobile_signup');

class SignupMobileWithOTPWdgt extends Component {
    constructor(props) {
        super();
        this.state = {
            mobile: '',
            deviceId: getDeviceInfo(),
            mode: getMode(),
            ipAddress: '', //getIPAddress(),
            hostName: getHostName(),
            tem_mobile: '',
            CountryCode: AppConfig.defaultCountryCode,
            err_msg: '',
            success_msg: '',
            err_alert: true,
            success_alert: true,
            otp_screen: false,
            loading: false,
            resend_msg: false,
            otp: '',
            errors: ""
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
            this.resendOTPForMobile();
            this.setState({ resend_msg: true });
        } else if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (nextProps.data.ReturnCode === 0) {
            var success_msg = this.state.resend_msg ? 'OTP send to your mobile.' : nextProps.data.ReturnMsg;
            this.setState({ otp_screen: true, success_msg: success_msg, success_alert: true, resend_msg: false });
        }
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    onCountryChange(mobile) {
        var countryCode = $('#countryCode select').val();
        this.setState({ CountryCode: countryCode });
        if (typeof mobile !== 'undefined') {
            this.setState({ tem_mobile: mobile });
        }
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        event.preventDefault();

        let mobileObj = {
            mobile: this.state.tem_mobile + '',
            CountryCode: this.state.CountryCode
        };
        const { errors, isValid } = validateMobileSignup(mobileObj);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            var mObj = getMobileNoWithCountryCode(this.state.tem_mobile);
            this.state.mobile = mObj.mobile;
            let mobObj = {
                mobile: this.state.mobile,
                CountryCode: this.state.CountryCode,
                deviceId: this.state.deviceId,
                mode: this.state.mode,
                hostName: this.state.hostName,
                PreferedLanguage: AppConfig.locale.locale
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                mobObj.ipAddress = ipAddress;
                self.props.signUpWithMobile(mobObj);
            });
        }
    }

    resendOTPForMobile() {
        let mobObj = {
            mobile: this.state.mobile,
            CountryCode: this.state.CountryCode,
            deviceId: this.state.deviceId,
            mode: this.state.mode,
            hostName: this.state.hostName,
            PreferedLanguage: AppConfig.locale.locale
        }

        let self = this;
        getIPAddress().then(function (ipAddress) {
            mobObj.ipAddress = ipAddress;
            self.props.signUpMobileResendOTP(mobObj);
        });
    }

    resendOTP(event) {
        this.setState({ otp: '' });
        event.preventDefault();
        this.resendOTPForMobile();
    }

    verifyOTP(event) {
        event.preventDefault();

        let otpObj = { otp: this.state.otp };
        const { errors, isValid } = validateMobileSignup(otpObj);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let otpObj = {
                otp: this.state.otp,
                mobile: this.state.mobile,
                deviceId: this.state.deviceId,
                mode: this.state.mode,
                hostName: this.state.hostName,
                PreferedLanguage: AppConfig.locale.locale
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                otpObj.ipAddress = ipAddress;
                self.props.signUpMobileVerifyOTP(otpObj);
            });
        }
    }

    render() {
        const { loading, err_alert, err_msg, success_alert, success_msg, otp_screen, otp, errors, tem_mobile, CountryCode } = this.state;
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
                            <FormGroup className="has-wrapper" id="countryCode">
                                <IntlMessages id="myaccount.enterMobileNo">
                                    {(placeholder) =>
                                        <PhoneInput className="has-input input-lg" name="tem_mobile" id="tem_mobile" country={CountryCode} limitMaxLength={true} international={false} placeholder={placeholder} value={tem_mobile} onChange={(e) => this.onCountryChange(e)} />
                                    }
                                </IntlMessages>
                                <span className="has-icon"><i className="ti-mobile" /></span>
                                {errors.mobile && <div className="text-danger text-left"><IntlMessages id={errors.mobile} /></div>}
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
const mapStateToProps = ({ sgnUpMobileOTPRdcer }) => {
    var response = {
        data: sgnUpMobileOTPRdcer.data,
        loading: sgnUpMobileOTPRdcer.loading,
        redirect: sgnUpMobileOTPRdcer.redirect
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    signUpWithMobile,
    signUpMobileResendOTP,
    signUpMobileVerifyOTP
})(SignupMobileWithOTPWdgt));