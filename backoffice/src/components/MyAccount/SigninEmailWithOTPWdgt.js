/**
 * Created By : Sanjay Rathod
 * Created Date: 31/01/2019
 * Signin With Email
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Alert } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
//Import Google 2FA Component
// import TwoFaGoogleAuthentication from "../../components/MyAccount/2FAGoogleAuthentication";
// redux action
import {
    signInWithEmail,
    signInEmailResendOTP,
    signInEmailVerifyOTP,
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

class SigninEmailWithOTPWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            deviceId: getDeviceInfo(),
            mode: getMode(),
            ipAddress: '', //getIPAddress(),
            hostName: getHostName(),
            appkey: '',
            deviceModel: false,
            deviceMsg: '',
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
        this.dialogClose = this.dialogClose.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.verifyOTP = this.verifyOTP.bind(this);
    }

    dialogClose() {
        this.setState({ deviceModel: false, otp_screen: false, twoFA: false, otp: '', email: '', appkey: '' });
    };

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
                username: this.state.email,
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

        let emailObj = { email: this.state.email };
        const { errors, isValid } = validatesignupEmail(emailObj);
        this.setState({ err_alert: false, errors: errors, deviceModel: false });

        if (isValid) {
            let emalObj = {
                email: this.state.email,
                deviceId: this.state.deviceId,
                mode: this.state.mode,
                hostName: this.state.hostName
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                emalObj.ipAddress = ipAddress;
                self.props.signInWithEmail(emalObj);
            });
        }
    }

    resendOTP(event) {
        this.setState({ otp: '' });

        event.preventDefault();
        let emalObj = {
            email: this.state.email,
            deviceId: this.state.deviceId,
            mode: this.state.mode,
            hostName: this.state.hostName
        }

        let self = this;
        getIPAddress().then(function (ipAddress) {
            emalObj.ipAddress = ipAddress;
            self.props.signInEmailResendOTP(emalObj);
        });
    }

    verifyOTP(event) {
        event.preventDefault();

        let otpObj = { otp: this.state.otp };
        const { errors, isValid } = validatesignupEmail(otpObj);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let otpObj = {
                appkey: this.state.appkey,
                otp: this.state.otp,
                email: this.state.email,
                deviceId: this.state.deviceId,
                mode: this.state.mode,
                hostName: this.state.hostName
            }

            let self = this;
            getIPAddress().then(function (ipAddress) {
                otpObj.ipAddress = ipAddress;
                self.props.signInEmailVerifyOTP(otpObj);
            });
        }
    }

    render() {
        const { deviceModel, deviceMsg, twoFA, loading, err_alert, err_msg, success_alert, success_msg, email, otp_screen, otp, errors } = this.state;
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
                            <Button disabled={loading} type="submit" className="btn-info text-white" variant="raised" size="large" onClick={this.verifyOTP}><IntlMessages id="sidebar.btnVerifyOTP" /></Button>
                        </FormGroup>
                    </Form>
                    :
                    /* Register Section */
                    <Form>
                        <FormGroup className="has-wrapper">
                            <Input type="email" value={email} name="email" id="email" className="has-input input-lg" placeholder="Enter Email Address" onChange={this.onChange} />
                            <span className="has-icon"><i className="ti-email" /></span>
                            {errors.email && <div className="text-danger text-left"><IntlMessages id={errors.email} /></div>}
                        </FormGroup>
                        <FormGroup className="mb-15">
                            <Button disabled={loading} type="submit" className="btn-info text-white" variant="raised" size="large" onClick={this.onSubmit}><IntlMessages id="sidebar.btnLogin" /></Button>
                        </FormGroup>
                    </Form>
                }
                <Dialog
                    open={deviceModel}
                    keepMounted
                    onClose={this.dialogClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">{deviceMsg}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="raised" onClick={this.dialogClose} className="btn-danger text-white mr-10"><IntlMessages id="sidebar.btnClose" /></Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ signInWithEmai, authTokenRdcer }) => {
    var response = {
        data: signInWithEmai.data,
        loading: signInWithEmai.loading,
        generate_token: signInWithEmai.generate_token,
        redirect: authTokenRdcer.redirect
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    signInWithEmail,
    signInEmailResendOTP,
    signInEmailVerifyOTP,
    gerenateToken
})(SigninEmailWithOTPWdgt));