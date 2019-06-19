/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019

 * Affiliate Signup Form component
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input, Alert } from "reactstrap";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import $ from "jquery";
import IntlMessages from "Util/IntlMessages";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import qs from 'query-string';
import { affiliateSignup, affiliateResendConfirmationLink, getAffiliateCommissionPattern } from "Actions/MyAccount";
import { getDeviceInfo, getIPAddress, getHostName, getMode, getMobileNoWithCountryCode } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
const validateAffiliateSignup = require('../../../validation/MyAccount/affiliate_signup');

class SignupForm extends Component {
    constructor() {
        super();
        this.state = {
            data: {
                Username: '',
                Firstname: '',
                Lastname: '',
                Email: '',
                Password: '',
                confirmPassword: '',
                Mobile: '',
                ReferCode: '',
                SchemeType: '',
                passdata: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: getIPAddress(),
                HostName: getHostName()
            },
            schemeTypeList: [],
            type: 0, //0 For basic & 1 for full details
            tem_Mobile: '',
            CountryCode: AppConfig.defaultCountryCode,
            err_msg: '',
            err_alert: true,
            success_msg: '',
            success_alert: true,
            loading: false,
            confirm_link: false,
            errors: {}
        };

        this.onDismiss = this.onDismiss.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        const parsed = qs.parse(location.search);
        var checkPassCode = true;
        if (Object.keys(parsed).length > 0) {
            var newObj = Object.assign({}, this.state.data);
            if (parsed.code !== '') {
                newObj['ReferCode'] = parsed.code;
            } else {
                checkPassCode = false;
            }

            if (parsed.tag !== '') {
                newObj['passdata'] = parsed.tag;
            } else {
                checkPassCode = false;
            }
            this.setState({ data: newObj });

            if (!checkPassCode) {
                this.setState({ err_alert: true, err_msg: 'Check refercode and tag parameter is Compalsory.' });
            }
        }
        this.props.getAffiliateCommissionPattern({ type: this.state.type });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        //Get Affiliate Schemetype...
        if (nextProps.getPlan.hasOwnProperty('Response') && nextProps.getPlan.Response.length > 0) {
            this.setState({ schemeTypeList: nextProps.getPlan.Response });
        }

        if (nextProps.data.ErrorCode === 4036) {
            this.resendConfirmEmail(this.state.data);
            this.setState({ confirm_link: true });
        } else if (nextProps.data.ReturnCode === 1) {
            var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
            this.setState({ err_alert: true, err_msg: errMsg });
        } else if (nextProps.data.ReturnCode === 0) {
            this.setState({ success_msg: nextProps.data.ReturnMsg, success_alert: true, confirm_link: true });
        }
    }

    onDismiss() {
        this.setState({ err_alert: false, success_alert: false });
    }

    onCountryChange(Mobile) {
        var countryCode = $('#countryCode select').val();
        this.setState({ CountryCode: countryCode });
        if (typeof Mobile !== 'undefined') {
            this.setState({ tem_Mobile: Mobile });
        }
    }

    onChange(event) {
        let newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    resendConfirmEmail(data) {
        let cnfmObj = {
            Email: data.Email,
            DeviceId: data.DeviceId,
            Mode: data.Mode,
            HostName: data.HostName
        }

        let self = this;
        getIPAddress().then(function (IPAddress) {
            cnfmObj.IPAddress = IPAddress;
            self.props.affiliateResendConfirmationLink(cnfmObj);
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState(
            {
                data: {
                    ...this.state.data,
                    Mobile: this.state.tem_Mobile + '',
                    CountryCode: this.state.CountryCode,
                }
            })
        setTimeout(() => {
            const { errors, isValid } = validateAffiliateSignup(this.state.data);
            this.setState({ err_alert: false, errors: errors });

            if (isValid) {
                var mObj = getMobileNoWithCountryCode(this.state.tem_Mobile);

                let signupObj = Object.assign({}, this.state.data);
                signupObj['Mobile'] = mObj.mobile;

                //Delete Extra Signup Object..
                delete signupObj["confirmPassword"];

                let self = this;
                getIPAddress().then(function (IPAddress) {
                    signupObj['IPAddress'] = IPAddress
                    self.props.affiliateSignup(signupObj);
                });
            }
        }, 100)
    }

    render() {
        const { Username, Firstname, Lastname, Email, Password, confirmPassword, ReferCode, SchemeType } = this.state.data;
        const { schemeTypeList, tem_Mobile, confirm_link, err_alert, err_msg, success_msg, success_alert, loading, errors, CountryCode } = this.state;

        return (
            <Fragment>
                {loading && <JbsSectionLoader />}
                {success_msg && <div className="alert_area">
                    <Alert color="success" isOpen={success_alert} toggle={this.onDismiss}>{success_msg}</Alert>
                </div>}
                {err_msg && <div className="alert_area">
                    <Alert color="danger" isOpen={err_alert} toggle={this.onDismiss}>{err_msg}</Alert>
                </div>}
                {
                    confirm_link
                        ?
                        <div className="text-left my-15">
                            <h2><IntlMessages id="my_account.confTitle" /></h2>
                            <h4><IntlMessages id="my_account.confHey" /> {Firstname + ' ' + Lastname}</h4>
                            <p><IntlMessages id="my_account.confTitle" /> {Email} <IntlMessages id="my_account.confMsg2" /></p>
                            <div className="clearfix">
                                <Button className="btn-info text-white" variant="raised" size="large" onClick={() => this.resendConfirmEmail(this.state.data)}><IntlMessages id="sidebar.btnResendConfirmEmail" /></Button>
                                <a className="btn-danger btn text-white float-right" href="/"><IntlMessages id="sidebar.btnBackToLogin" /></a>
                            </div>
                        </div>
                        :
                        <Form>
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <IntlMessages id="myaccount.enterFirstName">
                                            {(placeholder) =>
                                                <Input style={{ backgroundColor: '#fff !important' }} type="text" tabIndex="1" value={Firstname} name="Firstname" id="Firstname" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" />
                                            }
                                        </IntlMessages>
                                        <span className="has-icon"><i className="ti-user" /></span>
                                        {errors.Firstname && <div className="text-danger text-left"><IntlMessages id={errors.Firstname} /></div>}
                                    </FormGroup>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <IntlMessages id="myaccount.enterLastName">
                                            {(placeholder) =>
                                                <Input style={{ backgroundColor: '#fff !important' }} type="text" tabIndex="2" value={Lastname} name="Lastname" id="Lastname" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" />
                                            }
                                        </IntlMessages>
                                        <span className="has-icon"><i className="ti-user" /></span>
                                        {errors.Lastname && <div className="text-danger text-left"><IntlMessages id={errors.Lastname} /></div>}
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <IntlMessages id="myaccount.enterUsername">
                                            {(placeholder) =>
                                                <Input style={{ backgroundColor: '#fff !important' }} type="text" tabIndex="3" value={Username} name="Username" id="Username" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" />
                                            }
                                        </IntlMessages>
                                        <span className="has-icon"><i className="ti-user" /></span>
                                        {errors.Username && <div className="text-danger text-left"><IntlMessages id={errors.Username} /></div>}
                                    </FormGroup>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <IntlMessages id="myaccount.enterReferral">
                                            {(placeholder) =>
                                                <Input style={{ backgroundColor: '#fff !important' }} type="text" tabIndex="4" value={ReferCode} name="ReferCode" id="ReferCode" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" />
                                            }
                                        </IntlMessages>
                                        <span className="has-icon"><i className="ti-bookmark-alt" /></span>
                                        {errors.ReferCode && <div className="text-danger text-left"><IntlMessages id={errors.ReferCode} /></div>}
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <IntlMessages id="myaccount.enterEmailAdd">
                                            {(placeholder) =>
                                                <Input style={{ backgroundColor: '#fff !important' }} type="Email" tabIndex="5" value={Email} name="Email" id="Email" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="50" />
                                            }
                                        </IntlMessages>
                                        <span className="has-icon"><i className="ti-email" /></span>
                                        {errors.Email && <div className="text-danger text-left"><IntlMessages id={errors.Email} /></div>}
                                    </FormGroup>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper" id="countryCode">
                                        <IntlMessages id="myaccount.enterMobileNo">
                                            {(placeholder) =>
                                                <PhoneInput style={{ backgroundColor: '#fff !important' }} className="has-input input-lg" tabIndex="6" name="tem_Mobile" id="tem_Mobile" country={CountryCode} limitMaxLength={true} international={false} placeholder={placeholder} value={tem_Mobile} onChange={(e) => this.onCountryChange(e)} />
                                            }
                                        </IntlMessages>
                                        <span className="has-icon"><i className="ti-mobile" /></span>
                                        {errors.Mobile && <div className="text-danger text-left"><IntlMessages id={errors.Mobile} /></div>}
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <IntlMessages id="myaccount.enterPassword">
                                            {(placeholder) =>
                                                /*added by Bharat Jograna
                                                <Input style={{ backgroundColor: '#fff !important' }} type="Password" tabIndex="7" value={Password} name="Password" id="Password" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" />*/
                                                <Input style={{ backgroundColor: '#fff !important' }} type="Password" tabIndex="7" name="Password" id="Password" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" />
                                            }
                                        </IntlMessages>
                                        <span className="has-icon"><i className="ti-lock" /></span>
                                        {errors.Password && <div className="text-danger text-left"><IntlMessages id={errors.Password} /></div>}
                                    </FormGroup>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <IntlMessages id="myaccount.enterConfirmPassword">
                                            {(placeholder) =>
                                                /*Added By Bharat Jograna
                                                <Input style={{ backgroundColor: '#fff !important' }} type="Password" tabIndex="8" value={confirmPassword} name="confirmPassword" id="confirmPassword" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" />*/
                                                <Input style={{ backgroundColor: '#fff !important' }} type="Password" tabIndex="8" name="confirmPassword" id="confirmPassword" className="has-input input-lg" placeholder={placeholder} onChange={this.onChange} maxLength="30" />
                                            }
                                        </IntlMessages>
                                        <span className="has-icon"><i className="ti-lock" /></span>
                                        {errors.confirmPassword && <div className="text-danger text-left"><IntlMessages id={errors.confirmPassword} /></div>}
                                    </FormGroup>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <FormGroup className="has-wrapper">
                                        <Input style={{ backgroundColor: '#fff !important' }} type="select" tabIndex="9" value={SchemeType} name="SchemeType" id="SchemeType" className="has-input input-lg cstm_sel" style={{ "height": "3.100rem" }} onChange={this.onChange}>
                                            <IntlMessages id="myaccount.selSchemeType">{(selectType) => <option value="">{selectType}</option>}</IntlMessages>
                                            {schemeTypeList.length > 0 && schemeTypeList.map((sList, index) => (
                                                <option key={index} value={sList.Id}>{sList.Value}</option>
                                            ))}
                                        </Input>
                                        {errors.SchemeType && <div className="text-danger text-left"><IntlMessages id={errors.SchemeType} /></div>}
                                    </FormGroup>
                                </div>
                            </div>
                            <FormGroup className="mb-15 text-center">
                                <Button disabled={loading} type="submit" tabIndex="10" className="coolbtn-comman text-white" variant="raised" size="large" onClick={this.onSubmit}><IntlMessages id="sidebar.btnRegister" /></Button>

                            </FormGroup>
                        </Form>
                }
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ affiliateRdcer }) => {
    var response = {
        data: affiliateRdcer.data,
        getPlan: affiliateRdcer.getPlan,
        loading: affiliateRdcer.loading,
        confirm_link: affiliateRdcer.confirm_link
    };
    return response;
};

export default withRouter(connect(mapStateToProps, {
    affiliateSignup,
    affiliateResendConfirmationLink,
    getAffiliateCommissionPattern
})(SignupForm));