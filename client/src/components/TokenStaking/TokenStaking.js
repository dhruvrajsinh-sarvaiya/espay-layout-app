import React from "react";
import { connect } from "react-redux";
import { NotificationManager } from 'react-notifications';
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Form, FormGroup, Input, Button } from "reactstrap";
import { changeDateFormat } from "Helpers/helpers";
import Select from "react-select";
import AppConfig from 'Constants/AppConfig';
import validator from 'validator';
// actions for token staking
import {
    getWalletTypeList,
    getSlabList,
    getPreConfirmationDetails,
    postStackRequest,
    getStakHistory,
    postUnstakRequest,
} from "Actions/TokenStaking";
import {
    getWallets,
} from "Actions/Withdraw";
// add validation
const validateStakingRequest = require("../../validation/TokenStaking/TokenStaking");
const initState = {
    getQuoteEnable: false,
    isEditable: true,
    StatkingTypeID: "1",
    CurrencyTypeID: "",
    CurrencyTypeName: null,
    PolicyDetailID: "",
    amount: "",
    totalValue: 0,
    selectedType: "Freeze",
    selectedSlab: "",
    errors: {},
    EnableAutoUnstaking: 0,
    AccWalletID: "",
    StakeUnstakeRes: "",
    MaturityDetail: "",
    UnstakingDetail: "",
    detailedFlag: false,
    notificationflag: false,
};

// class For Display token staking component
class TokenStaking extends React.Component {
    state = initState;
    componentWillMount() {
        this.props.getWalletTypeList();
    }
    componentWillReceiveProps(nextProps) {
        //if plan not exist
        if (nextProps.planResponse.hasOwnProperty("ReturnCode") && nextProps.planResponse.ReturnCode === 1 && this.state.notificationflag) {
            this.setState({ notificationflag: false });
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.planResponse.ErrorCode}`} />);
        } else if (nextProps.planResponse.hasOwnProperty("ReturnCode") && nextProps.planResponse.ReturnCode === 0) {
            this.setState({ getQuoteEnable: true });
        }
        // if submit then disable allowed changes to following fields
        if (nextProps.preConfirmationDetails.hasOwnProperty("ReturnCode")) {
            this.setState({ detailedFlag: true })
            if (nextProps.preConfirmationDetails.ReturnCode === 1) {
                NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextProps.preConfirmationDetails.ErrorCode}`} />);
            } else if (nextProps.preConfirmationDetails.ReturnCode === 0) {
                this.setState({
                    isEditable: false,
                    getQuoteEnable: false,
                    EnableAutoUnstaking: nextProps.preConfirmationDetails.StakingDetails.EnableAutoUnstaking,
                    StakeUnstakeRes: nextProps.preConfirmationDetails.hasOwnProperty("StakingDetails") ? nextProps.preConfirmationDetails.StakingDetails : {},
                    MaturityDetail: nextProps.preConfirmationDetails.hasOwnProperty("MaturityDetail") ? nextProps.preConfirmationDetails.MaturityDetail : {}
                });
            }
        }
        if (nextProps.unstakPreconfirmationDetails.hasOwnProperty("ReturnCode")) {
            this.setState({ detailedFlag: true, isEditable: false })
            if (nextProps.unstakPreconfirmationDetails.ReturnCode === 0) {
                this.setState({
                    StakeUnstakeRes: nextProps.unstakPreconfirmationDetails.NewStakingDetails,
                    MaturityDetail: nextProps.unstakPreconfirmationDetails.NewMaturityDetail,
                    UnstakingDetail: nextProps.unstakPreconfirmationDetails.UnstakingDetail,
                });
            }
        }
        // get confirmation response validate
        if (nextProps.stakingResponse.hasOwnProperty('ReturnCode') && nextProps.stakingResponse.ReturnCode === 1) {
            NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.stakingResponse.ErrorCode}`} />);
        } else if (nextProps.stakingResponse.hasOwnProperty('ReturnCode') && nextProps.stakingResponse.ReturnCode === 0) {
            NotificationManager.success(<IntlMessages id={"wallet.tokenstakingSuccess"} />);
            this.handleCancel();
            this.props.getStakHistory({
                PageSize: 10,
                Page: 0
            });
        }
    }
    // handle pre submit event...
    onSubmit(event) {
        const { errors, isValid } = validateStakingRequest(
            this.state,
            this.props.wallets.filter(obj => (obj.AccWalletID === this.state.AccWalletID)),
            this.props.planlist.filter(obj => (obj.PolicyDetailID + '' === this.state.PolicyDetailID))
        );
        this.setState({ errors: errors });
        if (isValid) {
            this.props.getPreConfirmationDetails({
                PolicyDetailID: parseInt(this.state.PolicyDetailID),
                Amount: parseFloat(this.state.amount)
            });
        }
    }
    // handle change event...
    onChangeHanlder(e, key) {
        e.preventDefault();
        if ((key === 'amount' && validator.isDecimal(e.target.value, { force_decimal: false, decimal_digits: '0,8' }) || e.target.value == "") || (key !== 'amount')) {
            this.setState({ [key]: e.target.value });
        }
        if (key === 'StatkingTypeID' && this.state.CurrencyTypeID != '') {
            this.setState({
                PolicyDetailID: "",
                amount: "",
            });
            this.props.getSlabList({
                StatkingTypeID: e.target.value,
                CurrencyTypeID: this.state.CurrencyTypeID
            });
        }
        if (key === 'PolicyDetailID' && this.state.StatkingTypeID === '1') {
            const item = this.props.planlist.filter(function (planlist) {
                return planlist.PolicyDetailID == e.target.value;
            });
            if (item.length) {
                this.setState({ amount: item[0].AvailableAmount });
            }
        }
    }
    //on change switch
    onChangeSwitch(e) {
        e.preventDefault();
        this.setState({ EnableAutoUnstaking: this.state.EnableAutoUnstaking ? 0 : 1 });
    }
    //handle cancel button event...
    handleCancel() {
        var obj = {
            value: this.state.CurrencyTypeID,
            name: this.state.CurrencyTypeName,
        };
        this.onChangeSelectCurrency(obj);
        this.setState({ isEditable: true, AccWalletID: "", detailedFlag: false });
    }
    handleConfirmation(e) {
        e.preventDefault();
        this.props.postStackRequest({
            StakingPolicyDetailID: Number(this.state.PolicyDetailID),
            AccWalletID: Number(this.state.AccWalletID),
            InterestValue: this.state.StakeUnstakeRes.InterestValue,
            ChannelID: 21, // fixed
            Amount: this.state.MaturityDetail.Amount,
            DeductionAmount: this.state.MaturityDetail.DeductionAmount,
            MaturityDate: this.state.MaturityDetail.MaturityDate,
            MaturityAmount: this.state.MaturityDetail.MaturityAmount,
            MakerCharges: this.state.StakeUnstakeRes.MakerCharges,
            TakerCharges: this.state.StakeUnstakeRes.TakerCharges,
            EnableAutoUnstaking: this.state.EnableAutoUnstaking
        });
    }
    //Unstak Partially
    unstackPartial(e) {
        if (this.props.walletList.length) {
            const selectedCurr = this.props.walletList[0];
            var obj = {
                value: selectedCurr.Id,
                name: selectedCurr.CoinName,
            };
            this.onChangeSelectCurrency(obj);
        }
        this.setState({ detailedFlag: false, isEditable: true })
        this.props.postUnstakRequest({
            StakingHistoryId: this.state.UnstakingDetail.StakingHistoryId,
            Type: 2,
            StakingPolicyDetailId: parseFloat(this.state.StakeUnstakeRes.PolicyDetailID),
            Amount: parseFloat(this.state.MaturityDetail.Amount),
            ChannelId: 21,
        });
    }
    //on change select currency...
    onChangeSelectCurrency(e) {
        this.setState({ CurrencyTypeID: e.value, CurrencyTypeName: e.name });
        if (this.state.StatkingTypeID != '') {
            this.setState({
                PolicyDetailID: "",
                amount: "",
                notificationflag: true
            });
            this.props.getSlabList({
                StatkingTypeID: this.state.StatkingTypeID,
                CurrencyTypeID: e.value
            });
            this.props.getWallets({ Coin: e.name });
        }
    }
    handleUnstakeCancel() {
        if (this.props.walletList.length) {
            const selectedCurr = this.props.walletList[0];
            var obj = {
                value: selectedCurr.Id,
                name: selectedCurr.CoinName,
            };
            this.onChangeSelectCurrency(obj);
        }
        this.setState({
            detailedFlag: false,
            isEditable: true
        })
    }
    render() {
        const { errors } = this.state;
        return (
            <JbsCollapsibleCard
                colClasses="col-sm-12 col-md-12 col-xl-12"
                heading=""
                fullBlock
            >
                <div className="row">
                    <div className="col-sm-6">
                        <JbsCollapsibleCard
                            colClasses="col-sm-12 col-md-12 col-xl-12 p-30"
                            customClasses="mb-0"
                            heading={<IntlMessages id="wallet.TSStakingRequest" />}
                            fullBlock
                        >
                            <div className="col-sm-12 col-md-12 col-xl-12 pt-0 pl-20 pr-20 pb-30">
                                <div className="lazy-up">
                                    <div className=" col-sm-12 col-md-12 col-xl-12 p-0">
                                        <Form onSubmit={(e) => { e.preventDefault() }}>
                                            <FormGroup className="mb-0">
                                                <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mb-10">
                                                    <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                                        <h5 className="pt-10">
                                                            {<IntlMessages id="trading.holdingorder.label.currency" />}<span className="text-danger">*</span>
                                                        </h5>
                                                    </div>
                                                    <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                                        <Select
                                                            options={this.props.walletList.map((coin, i) => ({
                                                                label: (
                                                                    <span>
                                                                        <img
                                                                            src={AppConfig.coinlistImageurl + '/' + coin.CoinName + '.png'}
                                                                            className="mr-10"
                                                                            height="25px"
                                                                            width="25px"
                                                                            alt={coin.CoinName}
                                                                            onError={(e) => {
                                                                                e.target.src = require(`Assets/icon/default.png`) // default img
                                                                            }}
                                                                        />
                                                                        {coin.CoinName}
                                                                    </span>
                                                                ),
                                                                value: coin.Id,
                                                                name: coin.CoinName,
                                                            }))}
                                                            onChange={e => this.onChangeSelectCurrency(e)}
                                                            placeholder={<IntlMessages id="wallet.searchCoin" />}
                                                        />
                                                        {errors.CurrencyTypeID && (
                                                            <span className="text-danger">
                                                                <IntlMessages id={errors.CurrencyTypeID} />
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0">
                                                    <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                                        <h5 className="pt-15">
                                                            {<IntlMessages id="wallet.TSSelectType" />}
                                                        </h5>
                                                    </div>
                                                    <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                                        <RadioGroup
                                                            row
                                                            aria-label="type"
                                                            name="type"
                                                            value={this.state.StatkingTypeID}
                                                            disabled={!this.state.isEditable}
                                                            onChange={e => this.onChangeHanlder(e, 'StatkingTypeID')}
                                                        >
                                                            <FormControlLabel
                                                                value="1"
                                                                control={<Radio />}
                                                                label={<IntlMessages id="wallet.FixedDeposit" />}
                                                                disabled={!this.state.isEditable}
                                                            />
                                                            <FormControlLabel
                                                                value="2"
                                                                control={<Radio />}
                                                                label={<IntlMessages id="wallet.Charge" />}
                                                                disabled={!this.state.isEditable}
                                                            />
                                                        </RadioGroup>
                                                        {errors.StatkingTypeID && (
                                                            <span className="text-danger">
                                                                <IntlMessages id={errors.StatkingTypeID} />
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {this.state.CurrencyTypeID != '' && this.state.StatkingTypeID != '' && <React.Fragment>
                                                    {this.props.planlist.length !== 0 && <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mb-20">
                                                        <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                                            <h5 className="pt-10">
                                                                {<IntlMessages id="wallet.stakingPlan" />}<span className="text-danger">*</span>
                                                            </h5>
                                                        </div>
                                                        <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                                            <Input
                                                                type="select"
                                                                name="PolicyDetailID"
                                                                id="PolicyDetailID"
                                                                onChange={e => this.onChangeHanlder(e, "PolicyDetailID")}
                                                                value={this.state.PolicyDetailID}
                                                                disabled={!this.state.isEditable}
                                                            >
                                                                <option value="" disabled={true}>
                                                                    {<IntlMessages id="wallet.selectPlan" />}
                                                                </option>
                                                                {this.props.planlist.map((item, key) => (
                                                                    <option value={item.PolicyDetailID} key={key}>
                                                                        {item.AvailableAmount}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                            {errors.PolicyDetailID && (
                                                                <span className="text-danger">
                                                                    <IntlMessages id={errors.PolicyDetailID} />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>}
                                                    {this.props.planlist.length !== 0 && this.props.wallets.length != 0 && <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mb-20 mt-5">
                                                        <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                                            <h5 className="pt-10">
                                                                {<IntlMessages id="wallet.stakingWallet" />}<span className="text-danger">*</span>
                                                            </h5>
                                                        </div>
                                                        <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                                            <Input
                                                                type="select"
                                                                name="AccWalletID"
                                                                id="AccWalletID"
                                                                onChange={e => this.onChangeHanlder(e, "AccWalletID")}
                                                                value={this.state.AccWalletID}
                                                                disabled={!this.state.isEditable}
                                                            >
                                                                <option value="" disabled={true}>
                                                                    {<IntlMessages id="wallet.WDSelectWallet" />}
                                                                </option>
                                                                {this.props.wallets.map((item, key) => (
                                                                    <option value={item.AccWalletID} key={key}> {item.WalletName} [{item.Balance.toFixed(8)}]</option>
                                                                ))}
                                                            </Input>
                                                            {errors.AccWalletID && (
                                                                <span className="text-danger">
                                                                    <IntlMessages id={errors.AccWalletID} />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>}
                                                    {this.props.planlist.length !== 0 && <div className="col-sm-12 col-md-12 col-xl-12 d-inline-flex p-0 mt-5">
                                                        <div className="col-sm-3 col-md-3 col-xl-3 p-0">
                                                            <h5 className="pt-10">
                                                                {<IntlMessages id="wallet.CTAmount" />}<span className="text-danger">*</span>
                                                            </h5>
                                                        </div>
                                                        <div className=" col-sm-9 col-md-9 col-xl-9 pr-0">
                                                            <Input
                                                                type="text"
                                                                name="amount"
                                                                id="amount"
                                                                onChange={e => this.onChangeHanlder(e, "amount")}
                                                                value={this.state.amount}
                                                                autoComplete="off"
                                                                disabled={!this.state.isEditable || this.state.StatkingTypeID === '1'}
                                                            >
                                                            </Input>
                                                            {errors.amount && (
                                                                <span className="text-danger">
                                                                    <IntlMessages id={errors.amount} />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>}
                                                    {this.props.planlist.length !== 0 && <div className="col-sm-12 col-md-12 col-xl-12 mt-30 p-0">
                                                        <div className="d-flex justify-content-center">
                                                            <Button
                                                                type="button"
                                                                disabled={!this.state.getQuoteEnable}
                                                                variant="raised"
                                                                className="rounded-0 border-0 w-20 perverbtn"
                                                                onClick={e => this.onSubmit(e)}
                                                            >
                                                                <IntlMessages id="wallet.getQuote" />
                                                            </Button>
                                                        </div>
                                                    </div>}
                                                </React.Fragment>}
                                            </FormGroup>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </JbsCollapsibleCard>
                    </div>
                    {this.state.detailedFlag &&
                        <div className="col-sm-6">
                            <div className="d-block p-30">
                                {
                                    (this.props.preConfirmationDetails.ReturnCode === 0 || this.props.unstakPreconfirmationDetails.ReturnCode === 0) &&
                                    this.state.StakeUnstakeRes !== "" &&
                                    <React.Fragment>
                                        <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <strong>{<IntlMessages id="wallet.stakingDetails" />}</strong>
                                            </h4>
                                        </div>
                                        <Divider />
                                        {this.state.StakeUnstakeRes.hasOwnProperty('StakingType') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.StakingType" />
                                            </h4>
                                            <h4 className="p-10 m-0">{this.state.StakeUnstakeRes.StakingType === 1 ? <IntlMessages id="wallet.FixedDeposit" /> : <IntlMessages id="wallet.Charge" />}</h4>
                                        </div>}
                                        <Divider />
                                        {this.state.StakeUnstakeRes.hasOwnProperty('SlabTypeName') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.slabtype" />
                                            </h4>
                                            <h4 className="p-10 m-0">{this.state.StakeUnstakeRes.SlabType === 1 ? <IntlMessages id="wallet.Fixed" /> : <IntlMessages id="wallet.Range" />}</h4>
                                        </div>}
                                        <Divider />
                                        {this.state.StakeUnstakeRes.StakingType == 1 && <React.Fragment>
                                            <div className="col-sm-12 p-0 d-flex">
                                                <h4 className="w-40 p-10 m-0">
                                                    <IntlMessages id="wallet.interestType" />
                                                </h4>
                                                <h4 className="p-10 m-0">{this.state.StakeUnstakeRes.InterestType === 1 ? <IntlMessages id="wallet.Fixed" /> : <IntlMessages id="wallet.Percentage" />}</h4>
                                            </div>
                                            <Divider />
                                            <div className="col-sm-12 p-0 d-flex">
                                                <h4 className="w-40 p-10 m-0">
                                                    <IntlMessages id="wallet.interest" />
                                                </h4>
                                                <h4 className="p-10 m-0">{parseFloat(this.state.StakeUnstakeRes.InterestValue).toFixed(2)}</h4>
                                            </div>
                                            <Divider />
                                        </React.Fragment>}
                                        {this.state.StakeUnstakeRes.hasOwnProperty('DurationMonth') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.duration" />
                                            </h4>
                                            <h4 className="p-10 m-0">{this.state.StakeUnstakeRes.DurationMonth} <IntlMessages id="wallet.Months" />, {this.state.StakeUnstakeRes.DurationWeek} <IntlMessages id="wallet.Weeks" /></h4>
                                        </div>}
                                        <Divider />
                                        {this.state.StakeUnstakeRes.StakingType == 2 && <React.Fragment>
                                            <div className="col-sm-12 p-0 d-flex">
                                                <h4 className="w-40 p-10 m-0">
                                                    <IntlMessages id="wallet.TSCurrentTradingFees" />
                                                </h4>
                                                <h4 className="p-10 m-0">
                                                    <IntlMessages id="trading.placeorder.label.makers" /> : {parseFloat(this.state.StakeUnstakeRes.MakerCharges).toFixed(8)}&nbsp;
                                                <IntlMessages id="trading.placeorder.label.takers" /> :{" "}{parseFloat(this.state.StakeUnstakeRes.TakerCharges).toFixed(8)}
                                                </h4>
                                            </div>
                                            <Divider />
                                        </React.Fragment>}
                                        <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.EnableAutoUnstaking" />
                                            </h4>
                                            <FormControlLabel className="ml-0"
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={this.state.EnableAutoUnstaking}
                                                        onChange={(e) => this.onChangeSwitch(e)}
                                                    />
                                                }
                                            />
                                        </div>
                                    </React.Fragment>
                                }
                                {(this.props.preConfirmationDetails.ReturnCode === 0 || this.props.unstakPreconfirmationDetails.ReturnCode === 0) &&
                                    <React.Fragment>
                                        <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <strong>{<IntlMessages id="wallet.maturityDetail" />}</strong>
                                            </h4>
                                        </div>
                                        <Divider />
                                        {this.state.StakeUnstakeRes.hasOwnProperty('MaturityCurrencyName') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.MaturityCurrency" />
                                            </h4>
                                            <h4 className="p-10 m-0">{this.state.StakeUnstakeRes.MaturityCurrencyName}</h4>
                                        </div>}
                                        <Divider />
                                        {this.state.MaturityDetail.hasOwnProperty('Amount') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.CTAmount" />
                                            </h4>
                                            <h4 className="p-10 m-0">{parseFloat(this.state.MaturityDetail.Amount).toFixed(8)}</h4>
                                        </div>}
                                        <Divider />
                                        {this.state.MaturityDetail.hasOwnProperty('InterestAmount') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.InterestAmount" />
                                            </h4>
                                            <h4 className="p-10 m-0">{parseFloat(this.state.MaturityDetail.InterestAmount).toFixed(8)}</h4>
                                        </div>}
                                        <Divider />
                                        {this.state.MaturityDetail.hasOwnProperty('MaturityAmount') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.MaturityAmount" />
                                            </h4>
                                            <h4 className="p-10 m-0">{parseFloat(this.state.MaturityDetail.MaturityAmount).toFixed(8)}</h4>
                                        </div>}
                                        <Divider />
                                        {this.state.StakeUnstakeRes.hasOwnProperty('EnableStakingBeforeMaturity') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                <IntlMessages id="wallet.EnableStakingBeforeMaturity" />
                                            </h4>
                                            <h4 className="p-10 m-0">{this.state.StakeUnstakeRes.EnableStakingBeforeMaturity ? <IntlMessages id="sidebar.btnYes" /> : <IntlMessages id="sidebar.btnNo" />}</h4>
                                        </div>}
                                        <Divider />
                                        {this.state.StakeUnstakeRes.hasOwnProperty('EnableStakingBeforeMaturityCharge') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                {<IntlMessages id="wallet.EnableStakingBeforeMaturityCharge" />}
                                            </h4>
                                            <h4 className="p-10 m-0">{parseFloat(this.state.StakeUnstakeRes.EnableStakingBeforeMaturityCharge).toFixed(8)}</h4>
                                        </div>}
                                        <Divider />
                                        {this.state.MaturityDetail.hasOwnProperty('MaturityDate') && <div className="col-sm-12 p-0 d-flex">
                                            <h4 className="w-40 p-10 m-0">
                                                {<IntlMessages id="wallet.MaturityDate" />}
                                            </h4>
                                            <h4 className="p-10 m-0">{changeDateFormat(this.state.MaturityDetail.MaturityDate, 'YYYY-MM-DD HH:mm:ss', false)}</h4>
                                        </div>}
                                    </React.Fragment>
                                }
                                {this.props.preConfirmationDetails.hasOwnProperty('StakingDetails') &&
                                    this.props.preConfirmationDetails.ReturnCode === 0 &&
                                    <React.Fragment>
                                        <div className="col-sm-12 p-0 d-flex justify-content-center mt-10">
                                            <Button variant="raised" onClick={(e) => this.handleConfirmation(e)} className="perverbtn text-white mr-10 border-0 rounded-0"><IntlMessages id="wallet.btnConfirm" /></Button>
                                            <Button variant="raised" onClick={(e) => this.handleCancel()} className="btn-danger text-white mr-10 border-0 rounded-0"><IntlMessages id="button.cancel" /></Button>
                                        </div>
                                    </React.Fragment>
                                }
                                {this.props.unstakPreconfirmationDetails.hasOwnProperty('NewStakingDetails') &&
                                    this.props.unstakPreconfirmationDetails.ReturnCode === 0 &&
                                    <React.Fragment>
                                        <div className="col-sm-12 p-0 d-flex justify-content-center mt-10">
                                            <Button variant="raised" onClick={(e) => this.unstackPartial(e)} className="perverbtn text-white mr-10 border-0 rounded-0"><IntlMessages id="wallet.btnConfirm" /></Button>
                                            <Button variant="raised" onClick={(e) => this.handleUnstakeCancel()} className="btn-danger text-white mr-10 border-0 rounded-0"><IntlMessages id="button.cancel" /></Button>
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    }
                </div>
                {this.props.showLoading && <JbsSectionLoader />}
            </JbsCollapsibleCard>
        );
    }
}

const mapDispatchToProps = ({ tokenStakingReducer, withdrawApp }) => {
    const { wallets } = withdrawApp;
    const { showLoading, planlist, planResponse, preConfirmationDetails, selectedSlab, walletList, stakingResponse, unstakPreconfirmationDetails } = tokenStakingReducer;
    return { showLoading, planlist, planResponse, preConfirmationDetails, selectedSlab, walletList, wallets, stakingResponse, unstakPreconfirmationDetails };
};

export default connect(mapDispatchToProps, {
    getWallets,
    getWalletTypeList,
    postStackRequest,
    getSlabList,
    getPreConfirmationDetails,
    getStakHistory,
    postUnstakRequest,
})(TokenStaking);
