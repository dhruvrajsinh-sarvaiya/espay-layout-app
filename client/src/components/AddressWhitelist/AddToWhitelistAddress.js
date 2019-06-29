import React, { Component, Fragment } from "react";
import { Col, Form, Input, Label, FormGroup, Button, Row } from "reactstrap";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IntlMessages from "Util/IntlMessages";
import { connect } from "react-redux";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Select from "react-select";
import classnames from "classnames";
import {
    getCurrency,
    getPreference,
    setPreference,
    onSubmitWhithdrawalAddress,
    getAllWhithdrawalAddress,
} from "Actions/AddressWhitelist";
import {
    verify2fa
} from "Actions/Withdraw";
import { NotificationManager } from "react-notifications";
var validateAddressWhitelistRequest = require("../../validation/AddressWhitelist/AddressWhitelist");

class AddToWhitelistAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            coin: "",
            lable: "",
            address: "",
            checked: false,
            checkedSwitch: false,
            errors: {},
            selectObj: null,
            show2FA: false,
            code: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount() {
        this.props.getCurrency();
        this.props.getPreference();
    }
    componentWillReceiveProps(nextProps) {
        // get user preference
        this.setState({ checkedSwitch: nextProps.preference });
        //check set peference response 
        if (nextProps.preferenceResponse.hasOwnProperty('ReturnCode') && nextProps.preferenceResponse.ReturnCode === 0) {
            NotificationManager.success(nextProps.preferenceResponse.ReturnMsg);
            this.props.getPreference();
        } else if (nextProps.preferenceResponse.hasOwnProperty('ReturnCode') && nextProps.preferenceResponse.ReturnCode > 0) {

            NotificationManager.error(nextProps.preferenceResponse.ReturnMsg);
        }
        //checke on sumit form respone
        if (nextProps.submitResponse.hasOwnProperty('ReturnCode') && nextProps.submitResponse.ReturnCode === 0) {
            this.setState({
                coin: '',
                lable: "",
                address: "",
                checked: false,
                selectObj: null,
            });
            NotificationManager.success(nextProps.submitResponse.ReturnMsg);
            this.props.getAllWhithdrawalAddress();
        } else if (nextProps.submitResponse.hasOwnProperty('ReturnCode') && nextProps.submitResponse.ReturnCode > 0) {
            NotificationManager.error(nextProps.submitResponse.ReturnMsg);
        }
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode === 0 && this.state.show2FA) {
            const { coin, address, lable, checked } = this.state;
            this.setState({ show2FA: false, code: "" });
            this.props.onSubmitWhithdrawalAddress({
                "CoinName": coin,
                "BeneficiaryAddress": address,
                "BeneficiaryName": lable,
                "WhitelistingBit": checked ? 1 : 0
            });
        }
    }
    handleChange(event) {
        const target = event.target;
        const value =
            target.type === "checkbox" ? !this.state.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }
    handleCheckChange = name => (event, checked) => {
        this.setState({ [name]: checked });
        if (name === 'checkedSwitch') {
            this.props.setPreference((checked) ? 1 : 0);
        }
    };
    handleClose(e, flag) {
        e.preventDefault();
        if (flag) {
            // set perferenece on 
            this.props.setPreference(1);
            this.setState({ checkedSwitch: true });
        }
        this.setState({ open: false });
    };
    handleSubmit(event) {
        event.preventDefault();
        const { errors, isValid } = validateAddressWhitelistRequest(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { checked, checkedSwitch } = this.state;
            if (checked) {
                if (checkedSwitch) {
                    //check 2FA enable 
                    if (this.props.location.state.hasOwnProperty('userData')
                        && this.props.location.state.userData.TwoFactorEnabled
                        && this.props.location.state.userData.TwoFAToken !== "") {
                        this.setState({
                            show2FA: true
                        });
                    } else {
                        //refirect to enable 2FA
                        NotificationManager.info(<IntlMessages id={`wallet.withdraw2FAWarning`} />);
                        setTimeout(function () {
                            window.location.href = '/app/my-account/my-profile-info';
                        }, 3000);
                    }
                } else {
                    this.setState({ open: true });
                }
            } else {
                //check 2FA enable 
                if (this.props.location.state.hasOwnProperty('userData')
                    && this.props.location.state.userData.TwoFactorEnabled
                    && this.props.location.state.userData.TwoFAToken !== "") {
                    this.setState({
                        show2FA: true
                    });
                } else {
                    //refirect to enable 2FA
                    NotificationManager.info(<IntlMessages id={`wallet.withdraw2FAWarning`} />);
                    setTimeout(function () {
                        window.location.href = '/app/my-account/my-profile-info';
                    }, 3000);
                }
            }
        }
    }
    //close on 2fa screen
    handleClose2FA(e) {
        e.preventDefault();
        this.setState({ show2FA: false, code: "" });
    };
    //2fa submit action
    handleConfirmation = () => {
        if (this.state.code !== "" && this.state.code.length === 6) {
            this.props.verify2fa({
                'Code': this.state.code,
                "TwoFAKey": this.props.location.state.userData.TwoFAToken
            });
        }
    };
    render() {
        const { address, lable, checked, errors } = this.state;
        return (
            <Fragment>
                <JbsCollapsibleCard
                    colClasses="col-sm-12 col-md-12 col-xl-12"
                    heading=""
                    fullBlock
                >
                    {(this.props.coinlist.length === 0 || this.props.formLoading) && <JbsSectionLoader />}
                    <div className="jbs-block-content mb-0">
                        <div className="clearfix">
                            <ul className="msg-list list-unstyled">
                                <li className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-start">
                                        <h3 className="mb-15 fw-semi-bold">
                                            <IntlMessages id="wallet.AddWithdrawalAddress" />
                                        </h3>
                                    </div>
                                    <div className="d-flex align-items-end">

                                    </div>
                                </li>
                            </ul>
                            <Form onSubmit={this.handleSubmit} className="col-sm-8 offset-sm-2">
                                <FormGroup row>
                                    <Label for="coin" sm={2} className="offset-sm-1 d-inline-flex">
                                        <IntlMessages id="lable.coin" /><span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={7}>
                                        <Select
                                            options={this.props.coinlist.filter(function (coin) {
                                                return coin.IsWithdraw;
                                            }).map((coin, i) => ({
                                                label: coin.SMSCode,
                                                value: coin.SMSCode
                                            }))}
                                            onChange={e => this.setState({ coin: e.value, selectObj: { label: e.value } })}
                                            value={this.state.selectObj}
                                            placeholder={<IntlMessages id="wallet.searchCoin" />}
                                        />
                                        {errors.coin && (
                                            <span className="text-danger">
                                                <IntlMessages id={errors.coin} />
                                            </span>
                                        )}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="lable" sm={2} className="offset-sm-1 d-inline-flex">
                                        <IntlMessages id="lable.lable" /><span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={7}>
                                        <Input
                                            type="text"
                                            name="lable"
                                            value={lable}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                            maxLength="50"
                                        />
                                        {errors.lable && (
                                            <span className="text-danger">
                                                <IntlMessages id={errors.lable} />
                                            </span>
                                        )}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="address" sm={2} className="offset-sm-1 d-inline-flex">
                                        <IntlMessages id="lable.address" /><span className="text-danger">*</span>
                                    </Label>
                                    <Col sm={7}>
                                        <Input
                                            type="textarea"
                                            name="address"
                                            value={address}
                                            onChange={this.handleChange}
                                            multiple
                                            maxLength="50"
                                        />
                                        {errors.address && (
                                            <span className="text-danger">
                                                <IntlMessages id={errors.address} />
                                            </span>
                                        )}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={{ offset: 3 }}>
                                        <FormControlLabel className="ml-0"
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={checked}
                                                    onChange={this.handleCheckChange("checked")}
                                                />
                                            }
                                            label={<IntlMessages id="lable.addToWhitelist" />}
                                        />
                                    </Col>
                                </FormGroup>
                                <Col className="justify-content-center d-flex">
                                    <Button className="border-0 rounded-0 perverbtn" ><IntlMessages id="lable.addToWhitelist" /></Button>
                                </Col>
                            </Form>
                        </div>
                    </div>
                </JbsCollapsibleCard>
                <Dialog
                    open={this.state.open}
                    onClose={(e) => this.handleClose(e, false)}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogContent>
                        <DialogContentText>
                            <Row>
                                <Col md={1}>
                                    <span className="alert-addon">
                                        <i className="zmdi zmdi-alert-circle" />
                                    </span>
                                </Col>
                                <Col md={11}>
                                    <p><strong><IntlMessages id={"wallet.confirmNotice1"} /></strong> <IntlMessages id={"wallet.confirmNotice2"} /></p>
                                </Col>
                            </Row>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e) => this.handleClose(e, false)} color="danger" autoFocus>
                            <IntlMessages id={"button.cancel"} />
                        </Button>
                        <Button onClick={(e) => this.handleClose(e, true)} className="perverbtn" autoFocus>
                            <IntlMessages id={"wallet.btnAgree"} />
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.show2FA}
                    fullWidth={true}
                    onClose={(e) => this.handleClose2FA(e)}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {<IntlMessages id="myAccount.Dashboard.2faAuthentication" />}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.props.response2fa.loading && <JbsSectionLoader />}
                            <Form onSubmit={(e) => { e.preventDefault() }}>
                                <FormGroup className="mb-0">
                                    <Label for="Code"><IntlMessages id="my_account.googleAuthCode" /></Label>
                                    <Input type="text" name="Code" id="Code" maxLength="6" autoComplete="off" value={this.state.code} onChange={(e) => (this.setState({ code: e.target.value }))} />
                                    {this.props.errors.hasOwnProperty("ErrorCode") && <span className="text-danger"><IntlMessages id={`apiErrCode.${this.props.errors.ErrorCode}`} /></span>}
                                </FormGroup>
                                <div className="mt-20 justify-content-center d-flex">
                                    <Button type="submit" variant="raised" onClick={this.handleConfirmation} className={classnames(" text-white mr-20 perverbtn", { "disabled": !this.state.code })} > <IntlMessages id="wallet.btnVerify" /></Button>
                                </div>
                            </Form>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

// map state to props
const mapStateToProps = ({ addressWhitelist, withdrawApp }) => {
    const { coinlist, submitResponse, preference, preferenceResponse, formLoading } = addressWhitelist;
    const { response2fa, errors } = withdrawApp;
    return { coinlist, submitResponse, preference, preferenceResponse, formLoading, response2fa, errors };
};

export default connect(mapStateToProps, {
    getCurrency,
    getPreference,
    setPreference,
    onSubmitWhithdrawalAddress,
    getAllWhithdrawalAddress,
    verify2fa
})(AddToWhitelistAddress);
