/* 
    Developer : Nishant Vadgama
    Date : 25-09-2018
    File Commet : Configuration and Preference setting page
*/
import React, { Component, Fragment } from "react";
import validator from "validator";
import { connect } from "react-redux";
import { TimePicker } from "material-ui-pickers";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Divider from "@material-ui/core/Divider";
import { NotificationManager } from "react-notifications";
import Select from "react-select";
// Used For Set Conditional Base Classes
import classnames from "classnames";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { getWallets, getLimitInfo, postLimitInfo } from "Actions/LimitsControl";
// add validation
const validateTradeLimitRequest = require("../../validation/LimitsControl/ValidateTradeRequest");
const validateWithdrawLimitRequest = require("../../validation/LimitsControl/ValidateWithdrawRequest");
const validateDepositLimitRequest = require("../../validation/LimitsControl/ValidateDepositRequest");
const validateApiLimitRequest = require("../../validation/LimitsControl/ValidateApiRequest");
/* Trn Type ENUM constants */
const TRNTYPE_TRADE = 1;
const TRNTYPE_WITHDRAW = 9;//2;
const TRNTYPE_DEPOSIT = 2;//3;
const TRNTYPE_API = 4;

class LimitsControl extends Component {
    state = {
        trade: {
            AccWalletID: "",
            AccWalletObj: null,
            TrnType: TRNTYPE_TRADE,
            LimitPerDay: "0",
            LimitPerHour: "0",
            LimitPerTransaction: "0",
            LifeTime: "0",
            StartTime: null,
            EndTime: null
        },
        withdraw: {
            AccWalletID: "",
            AccWalletObj: null,
            TrnType: TRNTYPE_WITHDRAW,
            LimitPerDay: "0",
            LimitPerHour: "0",
            LimitPerTransaction: "0",
            LifeTime: "0",
            StartTime: null,
            EndTime: null
        },
        deposit: {
            AccWalletID: "",
            AccWalletObj: null,
            TrnType: TRNTYPE_DEPOSIT,
            LimitPerDay: "0",
            LimitPerHour: "0",
            LimitPerTransaction: "0",
            LifeTime: "0",
            StartTime: null,
            EndTime: null
        },
        apicalls: {
            AccWalletID: "",
            AccWalletObj: null,
            TrnType: TRNTYPE_API,
            LimitPerDay: "0",
            LimitPerHour: "0",
            LimitPerTransaction: "0",
            LifeTime: "0",
            StartTime: null,
            EndTime: null
        },
        showTrade: false,
        showWithdraw: false,
        showDeposit: false,
        showApi: false,
        errors: {}
    };
    componentWillMount() {
        this.props.getWallets();
    }
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.limitInfo &&
            nextProps.limitInfo.ReturnCode === 0 &&
            nextProps.limitInfo.statusCode === 200
        ) {
            let tradeObj = {
                AccWalletID: this.state.trade.AccWalletID,
                TrnType: TRNTYPE_TRADE,
                LimitPerDay: "0",
                LimitPerHour: "0",
                LimitPerTransaction: "0",
                LifeTime: "0",
                StartTime: null,
                EndTime: null
            };
            let withdrawObj = {
                AccWalletID: this.state.withdraw.AccWalletID,
                TrnType: TRNTYPE_WITHDRAW,
                LimitPerDay: "0",
                LimitPerHour: "0",
                LimitPerTransaction: "0",
                LifeTime: "0",
                StartTime: null,
                EndTime: null
            };
            let depositObj = {
                AccWalletID: this.state.deposit.AccWalletID,
                TrnType: TRNTYPE_DEPOSIT,
                LimitPerDay: "0",
                LimitPerHour: "0",
                LimitPerTransaction: "0",
                LifeTime: "0",
                StartTime: null,
                EndTime: null
            };
            let apicallsObj = {
                AccWalletID: this.state.apicalls.AccWalletID,
                TrnType: TRNTYPE_API,
                LimitPerDay: "0",
                LimitPerHour: "0",
                LimitPerTransaction: "0",
                LifeTime: "0",
                StartTime: null,
                EndTime: null
            };
            if (nextProps.limitInfo.WalletLimitConfigurationRes.length) {
                nextProps.limitInfo.WalletLimitConfigurationRes.forEach(function (config) {
                    if (
                        config.TrnType === TRNTYPE_TRADE &&
                        tradeObj.AccWalletID === config.AccWalletID
                    ) {
                        // trade
                        tradeObj["LimitPerDay"] = "" + config.LimitPerDay;
                        tradeObj["LimitPerHour"] = "" + config.LimitPerHour;
                        tradeObj["LimitPerTransaction"] = "" + config.LimitPerTransaction;
                        tradeObj["LifeTime"] = "" + config.LifeTime;
                        if (config.StartTime === 0) {
                            tradeObj["StartTime"] = null;
                        } else {
                            tradeObj["StartTime"] = config.StartTime;
                        }
                        if (config.EndTime === 0) {
                            tradeObj["EndTime"] = null;
                        } else {
                            tradeObj["EndTime"] = config.EndTime;
                        }
                    } else if (
                        config.TrnType === TRNTYPE_WITHDRAW &&
                        withdrawObj.AccWalletID === config.AccWalletID
                    ) {
                        // withdraw
                        withdrawObj["LimitPerDay"] = "" + config.LimitPerDay;
                        withdrawObj["LimitPerHour"] = "" + config.LimitPerHour;
                        withdrawObj["LimitPerTransaction"] = "" + config.LimitPerTransaction;
                        withdrawObj["LifeTime"] = "" + config.LifeTime;
                        if (config.StartTime === 0) {
                            withdrawObj["StartTime"] = null;
                        } else {
                            withdrawObj["StartTime"] = config.StartTime;
                        }
                        if (config.EndTime === 0) {
                            withdrawObj["EndTime"] = null;
                        } else {
                            withdrawObj["EndTime"] = config.EndTime;
                        }
                    } else if (
                        config.TrnType === TRNTYPE_DEPOSIT &&
                        depositObj.AccWalletID === config.AccWalletID
                    ) {
                        // deposit
                        depositObj["LimitPerDay"] = "" + config.LimitPerDay;
                        depositObj["LimitPerHour"] = "" + config.LimitPerHour;
                        depositObj["LimitPerTransaction"] = "" + config.LimitPerTransaction;
                        depositObj["LifeTime"] = "" + config.LifeTime;
                        if (config.StartTime === 0) {
                            depositObj["StartTime"] = null;
                        } else {
                            depositObj["StartTime"] = config.StartTime;
                        }
                        if (config.EndTime === 0) {
                            depositObj["EndTime"] = null;
                        } else {
                            depositObj["EndTime"] = config.EndTime;
                        }
                    } else if (
                        config.TrnType === TRNTYPE_API &&
                        apicallsObj.AccWalletID == config.AccWalletID
                    ) {
                        // API calls
                        apicallsObj["LimitPerDay"] = "" + config.LimitPerDay;
                        apicallsObj["LimitPerHour"] = "" + config.LimitPerHour;
                        apicallsObj["LimitPerTransaction"] = "" + config.LimitPerTransaction;
                        apicallsObj["LifeTime"] = "" + config.LifeTime;
                        if (config.StartTime === 0) {
                            apicallsObj["StartTime"] = null;
                        } else {
                            apicallsObj["StartTime"] = config.StartTime;
                        }
                        if (config.EndTime === 0) {
                            apicallsObj["EndTime"] = null;
                        } else {
                            apicallsObj["EndTime"] = config.EndTime;
                        }
                    }
                });
                this.setState({ trade: tradeObj });
                this.setState({ withdraw: withdrawObj });
                this.setState({ deposit: depositObj });
                this.setState({ apicalls: apicallsObj });
            }
        }
        //get response
        if (
            nextProps.response.hasOwnProperty("ReturnCode") &&
            nextProps.response.ReturnCode == 0 &&
            (this.state.showApi || this.state.showDeposit || this.state.showTrade || this.state.showWithdraw)
        ) {
            NotificationManager.success(nextProps.response.ReturnMsg);
            this.setState({
                showApi: false,
                showDeposit: false,
                showTrade: false,
                showWithdraw: false
            });
            if (nextProps.limitInfo.WalletLimitConfigurationRes != null && nextProps.limitInfo.WalletLimitConfigurationRes.length) {
                nextProps.limitInfo.WalletLimitConfigurationRes.forEach(function (config) {
                    nextProps.getLimitInfo(config.AccWalletID);
                });
            }
        } else if (
            nextProps.response.hasOwnProperty("ReturnCode") &&
            nextProps.response.ReturnCode != 0 &&
            (this.state.showApi || this.state.showDeposit || this.state.showTrade || this.state.showWithdraw)
        ) {
            NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.response.ErrorCode}`} />);
        }
    }
    // numberic value only
    validateOnlyNumeric(value) {
        const regexNumeric = /^[0-9.]+$/;

        return (
            validator.matches(value, regexNumeric) &&
            validator.isDecimal(value, {
                force_decimal: false,
                decimal_digits: "0,8"
            })
        ) ? true : false;
    }
    // on change trade block
    onTradeChange(e) {
        if (this.validateOnlyNumeric(e.target.value) || e.target.value == "") {
            let tempObj = this.state.trade;
            tempObj[e.target.name] = e.target.value;
            this.setState({ showTrade: true, trade: tempObj });
        }
    }
    // on change select trade search
    onTradeChangeSelectCurrency(e) {
        // Trade
        let tempObj = this.state.trade;
        tempObj["LimitPerDay"] = "0";
        tempObj["LimitPerHour"] = "0";
        tempObj["LimitPerTransaction"] = "0";
        tempObj["LifeTime"] = "0";
        tempObj["StartTime"] = null;
        tempObj["EndTime"] = null;
        tempObj["AccWalletID"] = e.value;
        tempObj["AccWalletObj"] = e.label;
        this.setState({
            showWithdraw: false,
            showDeposit: false,
            showApi: false,
            showTrade: true,
            trade: tempObj
        });
        this.props.getLimitInfo(e.value);
    }
    /* handle trade date change */
    handleTradeDateChange = (type, e) => {
        let tempObj = this.state.trade;
        if (e !== null) {
            //removed second and milisecond from time
            tempObj[type] = e.seconds(0).milliseconds(0).valueOf();
        } else {
            tempObj[type] = null;
        }
        this.setState({ showTrade: true, trade: tempObj })
    };
    /* handle withdraw date change */
    handleWithdrawDateChange = (type, e) => {
        let tempObj = this.state.withdraw;
        if (e !== null) {
            //removed second and milisecond from time
            tempObj[type] = e.seconds(0).milliseconds(0).valueOf();
        } else {
            tempObj[type] = null;
        }
        this.setState({ showWithdraw: true, withdraw: tempObj })
    };
    /* handle deposit date change */
    handleDepositDateChange = (type, e) => {
        let tempObj = this.state.deposit;
        if (e !== null) {
            //removed second and milisecond from time
            tempObj[type] = e.seconds(0).milliseconds(0).valueOf();
        } else {
            tempObj[type] = null;
        }
        this.setState({ showDeposit: true, deposit: tempObj })
    };
    /* handle api data change */
    handleApiDateChange = (type, e) => {
        let tempObj = this.state.apicalls;
        if (e !== null) {
            //removed second and milisecond from time
            tempObj[type] = e.seconds(0).milliseconds(0).valueOf();
        } else {
            tempObj[type] = null;
        }
        this.setState({ showApi: true, apicalls: tempObj })
    };

    // on change withdraw block
    onWithdrawChange(e) {
        if (this.validateOnlyNumeric(e.target.value) || e.target.value == "") {
            let tempObj = this.state.withdraw;
            tempObj[e.target.name] = e.target.value;
            this.setState({ showWithdraw: true, withdraw: tempObj });
        }
    }
    // on change select withdraw search
    onWithdrawChangeSelectCurrency(e) {
        let tempObj = this.state.withdraw;
        tempObj["LimitPerDay"] = "0";
        tempObj["LimitPerHour"] = "0";
        tempObj["LimitPerTransaction"] = "0";
        tempObj["LifeTime"] = "0";
        tempObj["StartTime"] = null;
        tempObj["EndTime"] = null;
        tempObj["AccWalletID"] = e.value;
        tempObj["AccWalletObj"] = e.label;
        this.setState({
            showTrade: false,
            showDeposit: false,
            showApi: false,
            showWithdraw: true,
            withdraw: tempObj
        });
        this.props.getLimitInfo(e.value);
    }
    // on change deposit block
    onDepositChange(e) {
        if (this.validateOnlyNumeric(e.target.value) || e.target.value == "") {
            let tempObj = this.state.deposit;
            tempObj[e.target.name] = e.target.value;
            this.setState({ showDeposit: true, deposit: tempObj });
        }
    }
    // on change select deposit search
    onDepositChangeSelectCurrency(e) {
        let tempObj = this.state.deposit;
        tempObj["LimitPerDay"] = "0";
        tempObj["LimitPerHour"] = "0";
        tempObj["LimitPerTransaction"] = "0";
        tempObj["LifeTime"] = "0";
        tempObj["StartTime"] = null;
        tempObj["EndTime"] = null;
        tempObj["AccWalletID"] = e.value;
        tempObj["AccWalletObj"] = e.label;
        this.setState({
            showTrade: false,
            showWithdraw: false,
            showApi: false,
            showDeposit: true,
            deposit: tempObj
        });
        this.props.getLimitInfo(e.value);
    }
    // on change trade block
    onAPIChange(e) {
        if (this.validateOnlyNumeric(e.target.value) || e.target.value == "") {
            let tempObj = this.state.apicalls;
            tempObj[e.target.name] = e.target.value;
            this.setState({ showApi: true, apicalls: tempObj });
        }
    }
    // on change select deposit search
    onAPIChangeSelectCurrency(e) {
        let tempObj = this.state.apicalls;
        tempObj["LimitPerDay"] = "0";
        tempObj["LimitPerHour"] = "0";
        tempObj["LimitPerTransaction"] = "0";
        tempObj["LifeTime"] = "0";
        tempObj["StartTime"] = null;
        tempObj["EndTime"] = null;
        tempObj["AccWalletID"] = e.value;
        tempObj["AccWalletObj"] = e.label;
        this.setState({
            showTrade: false,
            showWithdraw: false,
            showDeposit: false,
            showApi: true,
            apicalls: tempObj
        });
        this.props.getLimitInfo(e.value);
    }
    //on close hide buttons trade
    onCloseTrade(e) {
        this.setState({
            showTrade: false,
            errors: {},
            trade: {
                AccWalletID: "",
                AccWalletObj: null,
                TrnType: TRNTYPE_TRADE,
                LimitPerDay: "0",
                LimitPerHour: "0",
                LimitPerTransaction: "0",
                LifeTime: "0",
                StartTime: null,
                EndTime: null
            },
        });
    }
    //on close hide buttons withdraw
    onCloseWithdraw(e) {
        this.setState({
            showWithdraw: false,
            errors: {},
            withdraw: {
                AccWalletID: "",
                AccWalletObj: null,
                TrnType: TRNTYPE_WITHDRAW,
                LimitPerDay: "0",
                LimitPerHour: "0",
                LimitPerTransaction: "0",
                LifeTime: "0",
                StartTime: null,
                EndTime: null
            },
        });
    }
    //on close hide buttons deposit
    onCloseDeposit(e) {
        this.setState({
            showDeposit: false,
            errors: {},
            deposit: {
                AccWalletID: "",
                AccWalletObj: null,
                TrnType: TRNTYPE_DEPOSIT,
                LimitPerDay: "0",
                LimitPerHour: "0",
                LimitPerTransaction: "0",
                LifeTime: "0",
                StartTime: null,
                EndTime: null
            },
        });
    }
    //on close hide buttons APi
    onCloseApi(e) {
        this.setState({
            showApi: false,
            errors: {},
            apicalls: {
                AccWalletID: "",
                AccWalletObj: null,
                TrnType: TRNTYPE_API,
                LimitPerDay: "0",
                LimitPerHour: "0",
                LimitPerTransaction: "0",
                LifeTime: "0",
                StartTime: null,
                EndTime: null
            },
        });
    }
    // on submit trade limit control
    onSubmitTrade(event) {
        event.preventDefault();
        const { errors, isValid } = validateTradeLimitRequest(this.state.trade);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.postLimitInfo(this.state.trade);
        }
    }
    // on submit withdraw limit control
    onSubmitWithdraw(event) {
        event.preventDefault();
        const { errors, isValid } = validateWithdrawLimitRequest(this.state.withdraw);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.postLimitInfo(this.state.withdraw);
        }
    }
    // on submit deposit limit control
    onSubmitDeposit(event) {
        event.preventDefault();
        const { errors, isValid } = validateDepositLimitRequest(this.state.deposit);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.postLimitInfo(this.state.deposit);
        }
    }
    // on submit deposit limit control
    onSubmitApi(event) {
        event.preventDefault();
        const { errors, isValid } = validateApiLimitRequest(this.state.apicalls);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.postLimitInfo(this.state.apicalls);
        }
    }
    render() {
        const { errors } = this.state;
        const { intl } = this.props;
        return (
            <Fragment>
                <div className="row justify-content-center">
                    <JbsCollapsibleCard
                        colClasses={classnames(
                            { commonwalletjbscard_darkmode: this.props.darkMode },
                            "col-sm-12 col-md-10 col-lg-8"
                        )}
                        fullBlock
                        heading={<IntlMessages id="wallet.CFLCTradingLimits" />}
                        customClasses="overflow-hidden"
                    >
                        {this.props.loading && <JbsSectionLoader />}
                        <div className="col-sm-12 px-30 py-10">
                            <Divider />
                        </div>
                        <div className="col-sm-12 px-30 py-20">
                            {this.state.showTrade && this.props.showLoading && (
                                <JbsSectionLoader />
                            )}
                            <Form className="row">
                                <div className="col-sm-3">
                                    <FormGroup>
                                        <Label for="AccWalletID" className="font-weight-bold">
                                            <IntlMessages id={"wallet.WDSelectWallet"} />
                                        </Label>
                                        <Select
                                            options={this.props.wallets.map((wallet, key) => ({
                                                label: wallet.WalletName + '-' + wallet.CoinName,
                                                value: wallet.AccWalletID,
                                            }))}
                                            onChange={e => this.onTradeChangeSelectCurrency(e)}
                                            value={this.state.trade.AccWalletObj}
                                            placeholder={<IntlMessages id={"widgets.search"} />}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-sm-9">
                                    <div className="row">
                                        <FormGroup className="col-sm-4">
                                            <Label for="LimitPerHour" className="font-weight-bold">
                                                <IntlMessages id={"wallet.limitperhour"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerHour"
                                                id="LimitPerHour"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.trade.LimitPerHour}
                                                onChange={e => this.onTradeChange(e)}
                                                disabled={!this.state.trade.AccWalletID}
                                            />
                                            {errors.tradeLimitHour && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.tradeLimitHour} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label for="LimitPerDay" className="font-weight-bold">
                                                <IntlMessages id={"wallet.limitperday"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerDay"
                                                id="LimitPerDay"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.trade.LimitPerDay}
                                                onChange={e => this.onTradeChange(e)}
                                                disabled={!this.state.trade.AccWalletID}
                                            />
                                            {errors.tradeLimitDay && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.tradeLimitDay} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label
                                                for="LimitPerTransaction"
                                                className="font-weight-bold"
                                            >
                                                <IntlMessages id={"wallet.limitpertrn"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerTransaction"
                                                id="LimitPerTransaction"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.trade.LimitPerTransaction}
                                                onChange={e => this.onTradeChange(e)}
                                                disabled={!this.state.trade.AccWalletID}
                                            />
                                            {errors.tradeLimitTrn && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.tradeLimitTrn} />
                                                </span>
                                            )}
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup className="col-sm-4">
                                            <Label for="LifeTime" className="font-weight-bold">
                                                <IntlMessages id={"wallet.lifetimeLimit"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LifeTime"
                                                id="LifeTime"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.trade.LifeTime}
                                                onChange={e => this.onTradeChange(e)}
                                                disabled={!this.state.trade.AccWalletID}
                                            />
                                            {errors.tradeLifeTimeLimit && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.tradeLifeTimeLimit} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label for="StartTime" className="font-weight-bold">
                                                <IntlMessages id={"wallet.fromTime"} />
                                            </Label>
                                            <div className="timePicker col-sm-12 p-0">
                                                <TimePicker
                                                    clearable
                                                    name="StartTime"
                                                    value={this.state.trade.StartTime}
                                                    onChange={e =>
                                                        this.handleTradeDateChange("StartTime", e)
                                                    }
                                                    disabled={!this.state.trade.AccWalletID}
                                                />
                                                {errors.tradeStartTime && (
                                                    <span className="text-danger">
                                                        <IntlMessages id={errors.tradeStartTime} />
                                                    </span>
                                                )}
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label for="EndTime" className="font-weight-bold">
                                                <IntlMessages id={"wallet.endTime"} />
                                            </Label>
                                            <div className="timePicker col-sm-12 p-0">
                                                <TimePicker
                                                    clearable
                                                    name="EndTime"
                                                    value={this.state.trade.EndTime}
                                                    onChange={e =>
                                                        this.handleTradeDateChange("EndTime", e)
                                                    }
                                                    disabled={!this.state.trade.AccWalletID}
                                                />
                                                {errors.tradeEndTime && (
                                                    <span className="text-danger">
                                                        <IntlMessages id={errors.tradeEndTime} />
                                                    </span>
                                                )}
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="col-sm-12 px-30 pb-20 pt-0 justify-content-center d-flex">
                            {this.state.showTrade && !this.props.showLoading && (
                                <FormGroup className="mb-10">
                                    <Button
                                        size="sm"
                                        className="border-0 rounded-0 mx-10 px-20 perverbtn"
                                        onClick={e => this.onSubmitTrade(e)}
                                    >
                                        <IntlMessages id={"button.save"} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="border-0 rounded-0 mx-10 px-20"
                                        color="danger"
                                        onClick={e => this.onCloseTrade(e)}
                                    >
                                        <IntlMessages id={"button.cancel"} />
                                    </Button>
                                </FormGroup>
                            )}
                        </div>
                    </JbsCollapsibleCard>
                </div>
                <div className="row justify-content-center">
                    <JbsCollapsibleCard
                        colClasses={classnames(
                            { commonwalletjbscard_darkmode: this.props.darkMode },
                            "col-sm-12 col-md-10 col-lg-8"
                        )}
                        fullBlock
                        heading={<IntlMessages id="wallet.CFLCWithdrawLimist" />}
                        customClasses="overflow-hidden"
                    >
                        {this.props.loading && <JbsSectionLoader />}
                        <div className="col-sm-12 px-30 py-10">
                            <Divider />
                        </div>
                        <div className="col-sm-12 px-30 py-20">
                            {this.state.showWithdraw && this.props.showLoading && (
                                <JbsSectionLoader />
                            )}
                            <Form className="row">
                                <div className="col-sm-3">
                                    <FormGroup>
                                        <Label for="AccWalletID" className="font-weight-bold">
                                            <IntlMessages id={"wallet.WDSelectWallet"} />
                                        </Label>
                                        <Select
                                            options={this.props.wallets.map((wallet, key) => ({
                                                label: wallet.WalletName + '-' + wallet.CoinName,
                                                value: wallet.AccWalletID,
                                            }))}
                                            onChange={e => this.onWithdrawChangeSelectCurrency(e)}
                                            value={this.state.withdraw.AccWalletObj}
                                            placeholder={<IntlMessages id={"widgets.search"} />}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-sm-9">
                                    <div className="row">
                                        <FormGroup className="col-sm-4">
                                            <Label for="LimitPerHour" className="font-weight-bold">
                                                <IntlMessages id={"wallet.limitperhour"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerHour"
                                                id="LimitPerHour"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.withdraw.LimitPerHour}
                                                onChange={e => this.onWithdrawChange(e)}
                                                disabled={!this.state.withdraw.AccWalletID}
                                            />
                                            {errors.withdrawLimitHour && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.withdrawLimitHour} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label for="LimitPerDay" className="font-weight-bold">
                                                <IntlMessages id={"wallet.limitperday"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerDay"
                                                id="LimitPerDay"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.withdraw.LimitPerDay}
                                                onChange={e => this.onWithdrawChange(e)}
                                                disabled={!this.state.withdraw.AccWalletID}
                                            />
                                            {errors.withdrawLimitDay && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.withdrawLimitDay} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label
                                                for="LimitPerTransaction"
                                                className="font-weight-bold"
                                            >
                                                <IntlMessages id={"wallet.limitpertrn"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerTransaction"
                                                id="LimitPerTransaction"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.withdraw.LimitPerTransaction}
                                                onChange={e => this.onWithdrawChange(e)}
                                                disabled={!this.state.withdraw.AccWalletID}
                                            />
                                            {errors.withdrawLimitTrn && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.withdrawLimitTrn} />
                                                </span>
                                            )}
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup className="col-sm-4">
                                            <Label for="LifeTime" className="font-weight-bold">
                                                <IntlMessages id={"wallet.lifetimeLimit"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LifeTime"
                                                id="LifeTime"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.withdraw.LifeTime}
                                                onChange={e => this.onWithdrawChange(e)}
                                                disabled={!this.state.withdraw.AccWalletID}
                                            />
                                            {errors.withdrawLifeTimeLimit && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.withdrawLifeTimeLimit} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label
                                                for="LimitPerTransaction"
                                                className="font-weight-bold"
                                            >
                                                <IntlMessages id={"wallet.fromTime"} />
                                            </Label>
                                            <div className="timePicker col-sm-12 p-0">
                                                <TimePicker
                                                    clearable
                                                    value={this.state.withdraw.StartTime}
                                                    onChange={e =>
                                                        this.handleWithdrawDateChange("StartTime", e)
                                                    }
                                                    disabled={!this.state.withdraw.AccWalletID}
                                                />
                                                {errors.withdrawStartTime && (
                                                    <span className="text-danger">
                                                        <IntlMessages id={errors.withdrawStartTime} />
                                                    </span>
                                                )}
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label
                                                for="LimitPerTransaction"
                                                className="font-weight-bold"
                                            >
                                                <IntlMessages id={"wallet.endTime"} />
                                            </Label>
                                            <div className="timePicker col-sm-12 p-0">
                                                <TimePicker
                                                    clearable
                                                    value={this.state.withdraw.EndTime}
                                                    onChange={e =>
                                                        this.handleWithdrawDateChange("EndTime", e)
                                                    }
                                                    disabled={!this.state.withdraw.AccWalletID}
                                                />
                                                {errors.withdrawEndTime && (
                                                    <span className="text-danger">
                                                        <IntlMessages id={errors.withdrawEndTime} />
                                                    </span>
                                                )}
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="col-sm-12 px-30 py-20 justify-content-center d-flex">
                            {this.state.showWithdraw && !this.props.showLoading && (
                                <FormGroup className="mb-10">
                                    <Button
                                        size="sm"
                                        className="border-0 rounded-0 mx-10 px-20 perverbtn"
                                        onClick={e => this.onSubmitWithdraw(e)}
                                    >
                                        <IntlMessages id={"button.save"} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="border-0 rounded-0 mx-10 px-20"
                                        color="danger"
                                        onClick={e => this.onCloseWithdraw(e)}
                                    >
                                        <IntlMessages id={"button.cancel"} />
                                    </Button>
                                </FormGroup>
                            )}
                        </div>
                    </JbsCollapsibleCard>
                </div>
                <div className="row justify-content-center">
                    <JbsCollapsibleCard
                        colClasses={classnames(
                            { commonwalletjbscard_darkmode: this.props.darkMode },
                            "col-sm-12 col-md-10 col-lg-8"
                        )}
                        fullBlock
                        heading={<IntlMessages id="wallet.CFLCDepositLimits" />}
                        customClasses="overflow-hidden"
                    >
                        {this.props.loading && <JbsSectionLoader />}
                        <div className="col-sm-12 px-30 py-10">
                            <Divider />
                        </div>
                        <div className="col-sm-12 px-30 py-20">
                            {this.state.showDeposit && this.props.showLoading && (
                                <JbsSectionLoader />
                            )}
                            <Form className="row">
                                <div className="col-sm-3">
                                    <FormGroup>
                                        <Label for="AccWalletID" className="font-weight-bold">
                                            <IntlMessages id={"wallet.WDSelectWallet"} />
                                        </Label>
                                        <Select
                                            options={this.props.wallets.map((wallet, key) => ({
                                                label: wallet.WalletName + '-' + wallet.CoinName,
                                                value: wallet.AccWalletID,
                                            }))}
                                            onChange={e => this.onDepositChangeSelectCurrency(e)}
                                            value={this.state.deposit.AccWalletObj}
                                            placeholder={<IntlMessages id={"widgets.search"} />}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-sm-9">
                                    <div className="row">
                                        <FormGroup className="col-sm-4">
                                            <Label for="LimitPerHour" className="font-weight-bold">
                                                <IntlMessages id={"wallet.limitperhour"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerHour"
                                                id="LimitPerHour"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.deposit.LimitPerHour}
                                                onChange={e => this.onDepositChange(e)}
                                                disabled={!this.state.deposit.AccWalletID}
                                            />
                                            {errors.depositLimitHour && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.depositLimitHour} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label for="LimitPerDay" className="font-weight-bold">
                                                <IntlMessages id={"wallet.limitperday"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerDay"
                                                id="LimitPerDay"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.deposit.LimitPerDay}
                                                onChange={e => this.onDepositChange(e)}
                                                disabled={!this.state.deposit.AccWalletID}
                                            />
                                            {errors.depositLimitDay && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.depositLimitDay} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label
                                                for="LimitPerTransaction"
                                                className="font-weight-bold"
                                            >
                                                <IntlMessages id={"wallet.limitpertrn"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LimitPerTransaction"
                                                id="LimitPerTransaction"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.deposit.LimitPerTransaction}
                                                onChange={e => this.onDepositChange(e)}
                                                disabled={!this.state.deposit.AccWalletID}
                                            />
                                            {errors.depositLimitTrn && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.depositLimitTrn} />
                                                </span>
                                            )}
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup className="col-sm-4">
                                            <Label for="LifeTime" className="font-weight-bold">
                                                <IntlMessages id={"wallet.lifetimeLimit"} /><span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                name="LifeTime"
                                                id="LifeTime"
                                                placeholder={intl.formatMessage({ id: "wallet.limitHint" })}
                                                maxLength="10"
                                                value={this.state.deposit.LifeTime}
                                                onChange={e => this.onDepositChange(e)}
                                                disabled={!this.state.deposit.AccWalletID}
                                            />
                                            {errors.depositLifeTimeLimit && (
                                                <span className="text-danger">
                                                    <IntlMessages id={errors.depositLifeTimeLimit} />
                                                </span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label
                                                for="LimitPerTransaction"
                                                className="font-weight-bold"
                                            >
                                                <IntlMessages id={"wallet.fromTime"} />
                                            </Label>
                                            <div className="timePicker col-sm-12 p-0">
                                                <TimePicker
                                                    clearable
                                                    value={this.state.deposit.StartTime}
                                                    onChange={e =>
                                                        this.handleDepositDateChange("StartTime", e)
                                                    }
                                                    disabled={!this.state.deposit.AccWalletID}
                                                />
                                                {errors.depositStartTime && (
                                                    <span className="text-danger">
                                                        <IntlMessages id={errors.depositStartTime} />
                                                    </span>
                                                )}
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="col-sm-4">
                                            <Label
                                                for="LimitPerTransaction"
                                                className="font-weight-bold"
                                            >
                                                <IntlMessages id={"wallet.endTime"} />
                                            </Label>
                                            <div className="timePicker col-sm-12 p-0">
                                                <TimePicker
                                                    clearable
                                                    value={this.state.deposit.EndTime}
                                                    onChange={e =>
                                                        this.handleDepositDateChange("EndTime", e)
                                                    }
                                                    disabled={!this.state.deposit.AccWalletID}
                                                />
                                                {errors.depositEndTime && (
                                                    <span className="text-danger">
                                                        <IntlMessages id={errors.depositEndTime} />
                                                    </span>
                                                )}
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="col-sm-12 px-30 py-20 justify-content-center d-flex">
                            {this.state.showDeposit && !this.props.showLoading && (
                                <FormGroup className="mb-10">
                                    <Button
                                        size="sm"
                                        className="border-0 rounded-0 mx-10 px-20 perverbtn"
                                        onClick={e => this.onSubmitDeposit(e)}
                                    >
                                        <IntlMessages id={"button.save"} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="border-0 rounded-0 mx-10 px-20"
                                        color="danger"
                                        onClick={e => this.onCloseDeposit(e)}
                                    >
                                        <IntlMessages id={"button.cancel"} />
                                    </Button>
                                </FormGroup>
                            )}
                        </div>
                    </JbsCollapsibleCard>
                </div>
            </Fragment >
        );
    }
}

const mapDispatchToProps = ({ limitsControl, settings }) => {
    const { darkMode } = settings;
    const { wallets, showLoading, limitInfo, loading, response } = limitsControl;
    return { wallets, showLoading, limitInfo, loading, response, darkMode };
};

export default connect(
    mapDispatchToProps,
    {
        getWallets,
        getLimitInfo,
        postLimitInfo
    }
)(LimitsControl);
