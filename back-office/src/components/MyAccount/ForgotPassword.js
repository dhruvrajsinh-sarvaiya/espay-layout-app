/**
 * Create By : Sanjay 
 * Created Date: 31/01/2019
 * Forgot Password Component
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Form, FormGroup, Input, Alert, Button } from "reactstrap";
import LinearProgress from '@material-ui/core/LinearProgress';
// intl messages
import IntlMessages from "Util/IntlMessages";
// redux action
import { forgotScreenPassword } from "Actions/MyAccount";
import { 
    getDeviceInfo,
    getIPAddress,
    getHostName,
    getMode
} from "Helpers/helpers";
const validateForgotPassword = require('../../validation/MyAccount/forgot_password_screen');

class ForgotPasswordWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : {
                email: '',
                deviceId: getDeviceInfo(),
                mode: getMode(),
                ipAddress: '', //getIPAddress(),
                hostName: getHostName()
            },
            err_msg: "",
            err_alert: true,
            success_msg: "",
            success_alert: true,
            loading : false,
            errors: {}
        };

        this.onDismiss = this.onDismiss.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading : nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.data.ReturnCode === 1) {
			var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
			this.setState({ err_alert: true, err_msg: errMsg });
		} else if (nextProps.data.ReturnCode === 0) {
            this.setState({ success_msg:nextProps.data.ReturnMsg, success_alert: true });               
            setTimeout(() => { 
                window.location.href = '/signin';
            }, 5000);
        }
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert : false });
    }

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data : newObj });
    }

    onSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = validateForgotPassword(this.state.data);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let self = this;
            var reqObj = Object.assign({},this.state.data);
            getIPAddress().then(function (ipAddress) {
                reqObj.ipAddress = ipAddress;
                self.props.forgotScreenPassword(reqObj);
            });
        }
    }

    render() {
        const { email } = this.state.data;
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
                        <IntlMessages id="myaccount.enterEmailAdd">
                            { (placeholder) =>
                                <Input type="email" tabIndex="1" value={email} name="email" id="email" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} />
                            }
                        </IntlMessages>
                        {/* <Input type="email" value={email} name="email" id="email" className="has-input input-lg" placeholder="Enter Email Address" onChange={this.onChange} /> */}
                        <span className="has-icon"><i className="ti-email" /></span>
                        {errors.email && <div className="text-danger text-left"><IntlMessages id={errors.email} /></div>}
                    </FormGroup>
                    <FormGroup className="mb-15 text-left clearfix">
                        <Link to="/signin" tabIndex="3" className="lnkToBtn perverbtn btn-danger" variant="raised"><IntlMessages id="sidebar.btnBackToLogin" /></Link>
                        <Button disabled={loading} tabIndex="2" type="submit" className="perverbtn text-white float-right lnkToBtn" variant="raised" onClick={this.onSubmit}><IntlMessages id="sidebar.btnSubmit" /></Button>
                    </FormGroup>
                </Form>
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ forgotPasswordRdsr }) => {
    var response = {
        data: forgotPasswordRdsr.data,
        loading: forgotPasswordRdsr.loading
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    forgotScreenPassword
})(ForgotPasswordWdgt));
