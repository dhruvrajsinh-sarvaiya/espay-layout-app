/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Normal Login
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Alert } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// redux action
import { normalLogin, gerenateToken } from "Actions/MyAccount";

// intl messages
import IntlMessages from "Util/IntlMessages";
import {
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
import Slide from '@material-ui/core/Slide';
//Import Google 2FA Component
import TwoFaGoogleAuthentication from "../../components/MyAccount/2FAGoogleAuthentication";
import AppConfig from 'Constants/AppConfig';
const validateLogin = require('../../validation/MyAccount/login');

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class NormalLoginWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                username: '',
                password: '',
                deviceId: getDeviceInfo(),
                mode: getMode(),
                ipAddress: '', //getIPAddress(),
                hostName: getHostName()
            },
            deviceModel: false,
            deviceMsg: '',
            TwoFAKey: '',
            twoFA: false,
            err_msg: '',
            err_alert: true,
            success_msg: '',
            success_alert: true,
            loading: false,
            errors: {}
        };
        this.initState = this.state;
        this.onDismiss = this.onDismiss.bind(this);
        this.dialogClose = this.dialogClose.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.socialLoginData = this.socialLoginData.bind(this);
        this.resetData = this.resetData.bind(this);
    }

    resetData() {
        this.setState(this.initState);
    }

    dialogClose() {
        this.setState({ deviceModel: false, twoFA: false });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
        if (nextProps.redirect) {
            // added for withdraw approval screen
            if (localStorage.getItem('RefNo') !== null && localStorage.getItem('Bit') !== null) {
                window.location.href = AppConfig.WithdrawRedirect;
            } else {
                window.location.href = AppConfig.afterLoginRedirect;
            }
        } else if (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9) {
            localStorage.setItem('Thememode', nextProps.data.Thememode);
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (nextProps.data.ErrorCode === 4060) {
            localStorage.setItem('Thememode', nextProps.data.Thememode);
            this.setState({ twoFA: true, TwoFAKey: nextProps.data.TwoFAToken });
        } else if (nextProps.data.ErrorCode === 4137) {
            localStorage.setItem('Thememode', nextProps.data.Thememode);
            this.setState({ deviceModel: true, deviceMsg: <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} values={{ siteName: AppConfig.brandName }} /> });
        } else if (nextProps.data.ReturnCode === 0) {
            localStorage.setItem('Thememode', nextProps.data.Thememode);
            localStorage.setItem('locale', nextProps.data.PreferedLanguage);
            this.setState({ loading: true });
            var reqObj = {
                username: this.state.data.username,
                password: this.state.data.password
            }
            this.props.gerenateToken(reqObj);
        }
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    //Get Data to child component (Facebook & Google)...
    socialLoginData(socialResponse) {
        this.setState({ loading: socialResponse.loading });
        if (socialResponse.err_msg !== '') {
            this.setState({ err_alert: true, err_msg: socialResponse.err_msg });
        }
        this.resetData();
    }

    onSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = validateLogin(this.state.data);
        this.setState({ err_alert: false, errors: errors, deviceModel: false });

        if (isValid) {
            let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (ipAddress) {
                if (ipAddress.hasOwnProperty('ReturnMsg')) {
                    self.setState({ err_msg: <IntlMessages id={ipAddress.ReturnMsg} />, err_alert: true });
                } else {
                    reqObj.ipAddress = ipAddress;
                    self.props.normalLogin(reqObj);
                }
            });
        }
    }

    render() {
        var twoFAData = {
            username: this.state.data.username,
            password: this.state.data.password,
            appkey: '',
            TwoFAKey: this.state.TwoFAKey
        }

        const { username, password } = this.state.data;
        const { deviceModel, deviceMsg, twoFA, err_alert, err_msg, success_msg, success_alert, loading, errors } = this.state;
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
                    twoFA
                        ?
                        <TwoFaGoogleAuthentication loginData={twoFAData} />
                        :
                        <Fragment>
                            <Form>
                                <FormGroup className="has-wrapper">
                                    <IntlMessages id="myaccount.enterUsername">
                                        {(placeholder) =>
                                            <Input type="text" tabIndex="1" disabled={loading} value={username} name="username" id="username" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="50" /> // Add maxlength by Megha Kariya (31/01/2019)
                                        }
                                    </IntlMessages>
                                    <span className="has-icon"><i className="ti-user" /></span>
                                    {errors.username && <div className="text-danger text-left"><IntlMessages id={errors.username} /></div>}
                                </FormGroup>
                                <FormGroup className="has-wrapper">
                                    <IntlMessages id="myaccount.enterPassword">
                                        {(placeholder) =>
                                            /*Added By Bharat Jograna
                                            <Input type="password" tabIndex="2" disabled={loading} value={password} name="password" id="password" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" /> // Add maxlength by Megha Kariya (31/01/2019) */
                                            <Input type="password" tabIndex="2" disabled={loading} name="password" id="password" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" /> // Add maxlength by Megha Kariya (31/01/2019)
                                        }
                                    </IntlMessages>
                                    <span className="has-icon"><i className="ti-lock" /></span>
                                    {errors.password && <div className="text-danger text-left"><IntlMessages id={errors.password} /></div>}
                                </FormGroup>
                                <FormGroup className="mb-15 text-right">
                                    <Link to="/forgot-password" tabIndex="4"><IntlMessages id="my_account.forgotPassword" /></Link>
                                </FormGroup>
                                <FormGroup className="mb-15 text-center clearfix">
                                    <Button disabled={loading} tabIndex="3" type="submit" className="coolbtn-comman text-white" variant="raised" size="large" onClick={this.onSubmit}><IntlMessages id="sidebar.btnLogin" /></Button>
                                </FormGroup>
                            </Form>
                            <Dialog
                                open={deviceModel}
                                TransitionComponent={Transition}
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
                }
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ nrlLoginRdcer, authTokenRdcer }) => {
    var response = {
        data: nrlLoginRdcer.data,
        loading: nrlLoginRdcer.loading,
        redirect: authTokenRdcer.redirect
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    normalLogin,
    gerenateToken
})(NormalLoginWdgt));