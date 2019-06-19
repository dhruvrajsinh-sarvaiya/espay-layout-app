/**
 * Active User Component
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import {
    Form,
    FormGroup,
    Input,
    Button
} from 'reactstrap';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import LoginBlockchain from './LoginBlockchain';

//Import Login...
import { login } from 'Actions/MyAccount';
import {
    FacebookLoginButtonWdgt,
    GoogleLoginButtonWdgt
} from './SocialWidget';

const validateLogin = require('../../validation/MyAccount/login');

class LoginNormal extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            email: '',
            password: '',
            type: 'normal',
            is_show_blockchain_login: false,
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showBlockchainLogin = this.showBlockchainLogin.bind(this);
    }

    showBlockchainLogin(e) {
        e.preventDefault();
        this.setState({ is_show_blockchain_login: true });
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = validateLogin(this.state);
        this.setState({ errors: errors });

        if (isValid) {
            this.props.login(this.state);
            this.props.history.push('/app/my-account/2fa-authentication');
        }
    }

    render() {
        const { email, password, is_show_blockchain_login, errors } = this.state;
        return (
            <Fragment>
                {
                    !is_show_blockchain_login
                        ?
                        <div className="mb-0">
                            <h2 className="heading pb-10 mb-20 text-center border-bottom border-danger"><IntlMessages id="my_account.welcomeMessage" /></h2>
                            <h2 className="heading mb-20 text-center"><IntlMessages id="my_account.login" /></h2>
                            <Form className="innerborder">
                                <FormGroup className="has-wrapper">
                                    <Input type="mail" value={email} name="email" id="email" className="has-input input-lg" onChange={this.onChange} />
                                    <span className="has-icon"><i className="ti-email" /></span>
                                    {errors.email && <span className="text-danger text-left"><IntlMessages id={errors.email} /></span>}
                                </FormGroup>
                                <FormGroup className="has-wrapper">
                                    {/*Added By Bharat Jograna 
                                    <Input type="Password" value={password} name="password" id="password" className="has-input input-lg" onChange={this.onChange} /> */}
                                    <Input type="Password" name="password" id="password" className="has-input input-lg" onChange={this.onChange} />
                                    <span className="has-icon"><i className="ti-lock" /></span>
                                    {errors.password && <span className="text-danger text-left"><IntlMessages id={errors.password} /></span>}
                                </FormGroup>
                                <FormGroup>
                                    <div className="p-15 text-center border border-danger">Captcha</div>
                                </FormGroup>
                                <Button variant="raised" color="success" className="text-white btn-block" onClick={this.onSubmit}><IntlMessages id="sidebar.btnLogin" /></Button>
                                <div className="p-10 text-center">OR</div>
                                {/* <Link to="/app/my-account/login-blockchain" className="text-white btn bg-success btn-block"><IntlMessages id="sidebar.btnLoginWithBlockchain" /></Link> */}
                                <Button variant="raised" color="success" className="text-white btn-block" onClick={this.showBlockchainLogin}><IntlMessages id="sidebar.btnLoginWithBlockchain" /></Button>
                                <div className="row mt-10">
                                    <Link to="/app/my-account/forgot-password" className="text-primary col-6"><IntlMessages id="my_account.forgotPassword" /></Link>
                                    <Link to="/app/my-account/signup-with-mobile" className="text-primary col-6 text-right"><IntlMessages id="my_account.register" /></Link>
                                </div>
                            </Form>
                            <div className="p-10 text-center text-uppercase">Or Login With</div>
                            <div className="row">
                                <div className="col-md-6 col-sm-12 pt-10">
                                    <FacebookLoginButtonWdgt />
                                </div>
                                <div className="col-md-6 col-sm-12 pt-10">
                                    <GoogleLoginButtonWdgt />
                                </div>
                            </div>
                        </div>
                        :
                        <LoginBlockchain />
                }
            </Fragment>
        )
    }
}

const mapStateToProps = ({ loginRdcer }) => {
    /* const { tList, loading } = twoFAAuth;
    return { tList, loading } */
    return { loginRdcer };
}

export default withRouter(connect(mapStateToProps, { login })(LoginNormal));
