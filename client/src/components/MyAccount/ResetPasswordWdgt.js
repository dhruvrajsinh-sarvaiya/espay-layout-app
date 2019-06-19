/**
 * Reset Password
 */
import React, { Component } from "react";
import { connect } from "react-redux";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { Label, Form, FormGroup, Input, Button, Alert } from "reactstrap";

// redux action
import { setNewPassword } from "Actions/MyAccount";
const validateSetNewPassword = require('../../validation/MyAccount/set_new_password');

class ResetPasswordWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            err_msg: '',
            err_alert: true,
            success_msg: '',
            success_alert: true,
            setPass: {
                password: '',
                confirmPassword: ''
            },
            loading: false
        };
        this.onDismiss = this.onDismiss.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    cleanData() {
        this.setState({
            setPass: {
                password: '',
                confirmPassword: ''
            },
        })
    }

    onChange(event) {
        var newObj = Object.assign({}, this.state.setPass);
        newObj[event.target.name] = event.target.value;
        this.setState({ setPass: newObj });
    }

    onSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = validateSetNewPassword(this.state.setPass);
        this.setState({ err_alert: false, errors: errors });

        if (isValid) {
            let changeObj = {
                Id: this.props.Id,
                password: this.state.setPass.password
            }
            this.props.setNewPassword(changeObj);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });
        if (nextProps.setPassData.ReturnCode === 1) {
            let errMsg = nextProps.setPassData.ErrorCode === 1 ? nextProps.setPassData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.setPassData.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (nextProps.setPassData.hasOwnProperty("ReturnCode")) {
            this.setState({ success_msg: nextProps.setPassData.ReturnMsg, success_alert: true });
            setTimeout(function () {
                this.setState({ success_alert: false });
                window.location.href = '/signin';
                this.cleanData();
            }.bind(this), 1000);
        }
    }

    render() {
        const { err_alert, err_msg, success_msg, success_alert, loading, errors } = this.state;
        const { password, confirmPassword } = this.state.setPass;
        return (
            <div className="forgotconfirmradius">
                {success_msg && (
                    <div className="alert_area">
                        <Alert
                            color="success"
                            isOpen={success_alert}
                            toggle={this.onDismiss}
                        >
                            {success_msg}
                        </Alert>
                    </div>
                )}
                {err_msg && (
                    <div className="alert_area">
                        <Alert
                            color="danger"
                            isOpen={err_alert}
                            toggle={this.onDismiss}
                        >
                            {err_msg}
                        </Alert>
                    </div>
                )}
                <Form className="formForgotePass">
                    <FormGroup className="lableCenter">
                        <Label size="lg">
                            <IntlMessages id="lable.resetYourPassword" />
                        </Label>
                    </FormGroup>
                    <FormGroup className="row">
                        <Label
                            for="password"
                            className="control-label col-md-4"
                        >
                            <IntlMessages id="sidebar.password" />
                        </Label>
                        <div className="col-md-8">
                            <IntlMessages id="myaccount.enterPass">
                                {(placeholder) => (
                                    <Input
                                        type="password"
                                        tabIndex="1"
                                        name="password"
                                        // value={password} //Added By Bharat Jograna
                                        id="password"
                                        placeholder={placeholder}
                                        onChange={this.onChange}
                                    />
                                )}
                            </IntlMessages>
                            {errors.password && (
                                <div className="text-danger text-left">
                                    <IntlMessages id={errors.password} />
                                </div>
                            )}
                        </div>
                    </FormGroup>
                    <FormGroup className="row">
                        <Label
                            for="confirmPassword"
                            className="control-label col-md-4"
                        >
                            <IntlMessages id="sidebar.confirmPass" />
                        </Label>
                        <div className="col-md-8">
                            <IntlMessages id="myaccount.CofirmPass">
                                {(placeholder) => (
                                    <Input
                                        type="password"
                                        tabIndex="2"
                                        name="confirmPassword"
                                        // value={confirmPassword} //Added By Bharat Jograna
                                        id="confirmPassword"
                                        placeholder={placeholder}
                                        onChange={this.onChange}
                                    />
                                )}
                            </IntlMessages>
                            {errors.confirmPassword && (
                                <div className="text-danger text-left">
                                    <IntlMessages
                                        id={errors.confirmPassword}
                                    />
                                </div>
                            )}
                        </div>
                    </FormGroup>
                    <FormGroup className="row">
                        <Label className="col-md-4" />
                        <div className="col-md-8">
                            <Button
                                disabled={loading}
                                variant="raised"
                                tabIndex="3"
                                type="submit"
                                color="primary"
                                className="w-50"
                                onClick={this.onSubmit}
                            >
                                <IntlMessages id="sidebar.btnResetPassword" />
                            </Button>
                        </div>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ forgotConfirmation }) => {
    const { setPassData, loading } = forgotConfirmation;
    return { setPassData, loading };
};

export default connect(mapStateToProps, {
    setNewPassword
})(ResetPasswordWdgt);
