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
import AppConfig from 'Constants/AppConfig';
const validateLogin = require('../../validation/MyAccount/login');

/* function Transition(props) {
	return <Slide direction="up" {...props} />;
} */

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
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.resetData = this.resetData.bind(this);
    }

    resetData() {
        this.setState(this.initState);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('Standard Login:',nextProps);
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.redirect) {
            window.location.href = AppConfig.afterLoginRedirect;
        } else if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (nextProps.data.ReturnCode === 0) {
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

    onSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = validateLogin(this.state.data);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let self = this;
            var reqObj = Object.assign({}, this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.ipAddress = ipAddress;
                self.props.normalLogin(reqObj);
            });
        }
    }

    render() {
        const { username, password } = this.state.data;
        const { err_alert, err_msg, success_msg, success_alert, loading, errors } = this.state;
        return (
            <Fragment>
                {loading && <div><LinearProgress color="secondary" /></div>}
                {success_msg && <div className="alert_area">
                    <Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
                </div>}
                {err_msg && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
                </div>}
                <Form>
                    <FormGroup className="has-wrapper">
                        {/* <IntlMessages id="myaccount.enterUsername">
                            { (placeholder) => */}
                        <Input type="text" disabled={loading} value={username} name="username" id="username" className="has-input input-lg" placeholder="Enter Username" onChange={this.onChange} />
                        {/* }
                        </IntlMessages> */}
                        <span className="has-icon"><i className="ti-user" /></span>
                        {errors.username && <div className="text-danger text-left"><IntlMessages id={errors.username} /></div>}
                    </FormGroup>
                    <FormGroup className="has-wrapper">
                        {/* <IntlMessages id="myaccount.enterPassword">
                            { (placeholder) => */}
                        {/*Added By Bharat Jograna 
                        <Input type="password" disabled={loading} value={password} name="password" id="password" className="has-input input-lg" placeholder="Enter password" onChange={this.onChange} /> */}
                        <Input type="password" disabled={loading} name="password" id="password" className="has-input input-lg" placeholder="Enter password" onChange={this.onChange} />
                        {/* }
                        </IntlMessages> */}
                        <span className="has-icon"><i className="ti-lock" /></span>
                        {errors.password && <div className="text-danger text-left"><IntlMessages id={errors.password} /></div>}
                    </FormGroup>
                    <FormGroup className="mb-15 text-right">
                        <Link to="/forgot-password" tabIndex="4"><IntlMessages id="my_account.forgotPassword" /></Link>
                    </FormGroup>
                    <FormGroup className="mb-15 text-center clearfix">
                        <Button disabled={loading} type="submit" className="btn-info text-white" variant="raised" size="large" onClick={this.onSubmit}><IntlMessages id="sidebar.btnLogin" /></Button>
                    </FormGroup>
                </Form>
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
