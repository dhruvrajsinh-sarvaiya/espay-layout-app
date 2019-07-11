/* 
    Developer : Nishant Vadgama
    Date : 26-12-2018
    File Comment : Stacking Config From component
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import validator from "validator";
import Button from '@material-ui/core/Button';
import { FormGroup, Label, Input } from "reactstrap";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from 'react-toggle-switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { injectIntl } from 'react-intl';
import { NotificationManager } from "react-notifications";
import {
    getWalletType,
} from "Actions/WalletUsagePolicy";
import {
    addStakingConfig,
    getStakingConfigList
} from "Actions/Wallet";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
const initialState = {
    MasterPolicyId: 0,
    CurrencyTypeID: 0,
    StakingType: "1",
    Slab: "1",
    PolicyDetailID: 0,
    DurationMonth: "",
    DurationWeek: "",
    InterestType: "1",
    InterestValue: "",
    Amount: "",
    MinAmount: "",
    MaxAmount: "",
    Status: 0,
    AutoUnstakingEnable: 0,
    RenewUnstakingEnable: 0,
    RenewUnstakingPeriod: "",
    EnableStakingBeforeMaturity: 0,
    EnableStakingBeforeMaturityCharge: "",
    MaturityCurrency: "",
    MakerCharges: "",
    TakerCharges: "",
    errors: {},
    menudetail: [],
    notification: true,
    notificationFlag: true,
    // fieldList:{},
}
const resetState = {
    PolicyDetailID: 0,
    DurationMonth: "",
    DurationWeek: "",
    InterestType: "1",
    InterestValue: "",
    Amount: "",
    MinAmount: "",
    MaxAmount: "",
    Status: 0,
    AutoUnstakingEnable: 0,
    RenewUnstakingEnable: 0,
    RenewUnstakingPeriod: "",
    EnableStakingBeforeMaturity: 0,
    EnableStakingBeforeMaturityCharge: "",
    MaturityCurrency: "",
    MakerCharges: "",
    TakerCharges: "",
    errors: {},
    notificationFlag: true,
    Flag: false
}
var StakingRequestValidator = require("../../../validation/StakingConfiguration/StakingRequestValidator");
class StakingConfigForm extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
    };
    // component will mount actions
    componentWillMount() {
        this.props.getMenuPermissionByID('E3A44946-852D-1D9B-59DD-FC360E6E8A51'); // get wallet menu permission
    }
    //validate reponse on status change 
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        // set from master details
        if (nextProps.MasterDetails.hasOwnProperty('Id')) {
            this.setState({
                MasterPolicyId: nextProps.MasterDetails.Id,
                CurrencyTypeID: nextProps.MasterDetails.WalletTypeId + '',
                StakingType: nextProps.MasterDetails.StakingType + '',
                Slab: nextProps.MasterDetails.SlabType + '',
            });
        }
        // validate success
        if (nextProps.addResponse.hasOwnProperty("ReturnCode") && this.state.Flag) {
            this.setState({ Flag: false });
            if (nextProps.addResponse.ReturnCode === 0) {     //success
                NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
                this.props.drawerClose();
                this.props.getStakingConfigList({ PolicyMasterId: this.state.MasterPolicyId });
                this.setState(resetState);
            } else if (nextProps.addResponse.ReturnCode > 0) {     //failed
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.addResponse.ErrorCode} />);
            }
        }
        // check on edit 
        if (nextProps.stackDetails.hasOwnProperty("ReturnCode") && nextProps.PolicyDetailID !== 0 && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.stackDetails.ReturnCode === 0) {     //success
                const response = nextProps.stackDetails.Details[0];
                this.setState({
                    PolicyDetailID: response.PolicyDetailID,
                    DurationWeek: response.DurationWeek + "",
                    DurationMonth: response.DurationMonth + "",
                    InterestType: response.InterestType + "",
                    InterestValue: response.InterestValue + "",
                    Amount: response.AvailableAmount,
                    MinAmount: parseFloat(response.MinAmount).toFixed(8) + '',
                    MaxAmount: parseFloat(response.MaxAmount).toFixed(8) + '',
                    Status: response.Status,
                    MaturityCurrency: response.MaturityCurrencyID,
                    MakerCharges: parseFloat(response.MakerCharges).toFixed(8) + "",
                    TakerCharges: parseFloat(response.TakerCharges).toFixed(8) + "",
                    AutoUnstakingEnable: response.EnableAutoUnstaking,
                    RenewUnstakingEnable: response.RenewUnstakingEnable,
                    RenewUnstakingPeriod: response.RenewUnstakingPeriod + "",
                    EnableStakingBeforeMaturity: response.EnableStakingBeforeMaturity,
                    EnableStakingBeforeMaturityCharge: parseFloat(response.EnableStakingBeforeMaturityCharge).toFixed(8) + "",
                });
            } else if (nextProps.stackDetails.ReturnCode > 0) {     //failed
                NotificationManager.success(nextProps.stackDetails.ReturnMsg);
            }
        }
    }
    //handle change radio
    handleChange = (e, key) => {
        const regexWeek = /^[0-4]+$/;
        if (key == 'DurationWeek' || key == 'RenewUnstakingPeriod') {
            if ((validator.isNumeric(e.target.value, { no_symbols: true }) && validator.matches(e.target.value,regexWeek)) || e.target.value == "") {
                this.setState({ [key]: e.target.value });
            }
        } else if (key == 'DurationMonth') {
            if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value == "") {
                this.setState({ [key]: e.target.value });
            }
        } else if (key == 'InterestValue' ||
            key == 'Amount' ||
            key == 'MinAmount' ||
            key == 'MaxAmount' ||
            key == 'EnableStakingBeforeMaturityCharge' ||
            key == 'MakerCharges' ||
            key == 'TakerCharges') {
            if (validator.isDecimal(e.target.value, { force_decimal: false, decimal_digits: '0,8' }) || e.target.value == "") {
                this.setState({ [key]: e.target.value });
            }
        } else {
            this.setState({ [key]: e.target.value });
        }
    }
    //handle submit 
    handleSubmit() {
        const { errors, isValid } = StakingRequestValidator(this.state);
        this.setState({ errors: errors, Flag: true });
        if (isValid) {
            this.props.addStakingConfig(this.state);
        }
    }
    //handle cancel 
    handleCancel() {
        this.setState(resetState);
        this.props.drawerClose();
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = {};
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase()) {
                    if (menudetail[index].Fields && menudetail[index].Fields.length) {
                        var fieldList = {};
                        menudetail[index].Fields.forEach(function (item) {
                            fieldList[item.GUID.toUpperCase()] = item;
                        });
                         response = fieldList;
                    }
                }
            }
        }
            return response;
    }
    render() {
        var menuDetail = this.checkAndGetMenuAccessDetail((this.props.PolicyDetailID != 0) ? 'AD58442E-0C70-70A5-5A7A-FCCC7E8A8C2E' : '59FCC4A6-8459-46E3-6CCD-481A06B59F06');
        const { intl } = this.props;
        const { errors } = this.state;
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2>{(this.props.PolicyDetailID != 0) ? <IntlMessages id="tokenStaking.lblUpdateStakingPlan" /> : <IntlMessages id="tokenStaking.lblAddStakingPlan" />}</h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={(e) => this.handleCancel()}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                {this.props.menuLoading && <JbsSectionLoader />}
                {this.props.loading && <JbsSectionLoader />}
                <div className="row">
                    <div className="col-sm-12 ">
                        {(this.props.PolicyDetailID != 0 ? (menuDetail["3942E1B0-17E7-62CE-558B-A7DEBD228CB2"] && menuDetail["3942E1B0-17E7-62CE-558B-A7DEBD228CB2"].Visibility === "E925F86B") : (menuDetail["0E54D452-4B03-4654-608F-CE673A0C14E2"] && menuDetail["0E54D452-4B03-4654-608F-CE673A0C14E2"].Visibility === "E925F86B")) &&
                            // 3942E1B0-17E7-62CE-558B-A7DEBD228CB2  add - 0E54D452-4B03-4654-608F-CE673A0C14E2
                            <FormGroup className="col-sm-12">
                                <Label>
                                    <IntlMessages id="table.currency" />
                                </Label>
                                <Input
                                    className={(errors.CurrencyTypeID) ? "is-invalid" : ""}
                                    type="select"
                                    name="CurrencyTypeID"
                                    id="CurrencyTypeID"
                                    value={this.state.CurrencyTypeID}
                                    disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["3942E1B0-17E7-62CE-558B-A7DEBD228CB2"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["0E54D452-4B03-4654-608F-CE673A0C14E2"].AccessRight === "11E6E7B0" ? true : false))}
                                    onChange={e => this.setState({ CurrencyTypeID: e.target.value })}
                                >
                                    <IntlMessages id="wallet.errCurrency">
                                        {(optionValue) =>
                                            <option value="">{optionValue}</option>
                                        }
                                    </IntlMessages>
                                    {this.props.walletType.length >0 && this.props.walletType.map((currency, key) => (
                                        <option key={key} value={currency.ID}>{currency.TypeName}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        }
                        {(this.props.PolicyDetailID != 0 ? (menuDetail["1B84CFA8-30EB-3588-34BF-5F92E6163FFB"] && menuDetail["1B84CFA8-30EB-3588-34BF-5F92E6163FFB"].Visibility === "E925F86B") : (menuDetail["DB1AFC5E-516D-1DE8-773C-0DD27F6F0381"] && menuDetail["DB1AFC5E-516D-1DE8-773C-0DD27F6F0381"].Visibility === "E925F86B")) &&
                            // 1B84CFA8-30EB-3588-34BF-5F92E6163FFB   add DB1AFC5E-516D-1DE8-773C-0DD27F6F0381
                            <FormGroup row >
                                <Label className="control-label col" >
                                    <IntlMessages id="tokenStaking.stakingType" />
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12 cstm_rdo_btn">
                                    <RadioGroup row aria-label="StakingType" name="StakingType" value={this.state.StakingType} onChange={(e) => this.handleChange(e, 'StakingType')} >
                                        <FormControlLabel value="2" control={<Radio />} label={<IntlMessages id="table.charge" />} disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["1B84CFA8-30EB-3588-34BF-5F92E6163FFB"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["DB1AFC5E-516D-1DE8-773C-0DD27F6F0381"].AccessRight === "11E6E7B0" ? true : false))} />
                                        <FormControlLabel value="1" control={<Radio />} label={<IntlMessages id="tokenStaking.fixedDeposit" />} disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["1B84CFA8-30EB-3588-34BF-5F92E6163FFB"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["DB1AFC5E-516D-1DE8-773C-0DD27F6F0381"].AccessRight === "11E6E7B0" ? true : false))} />
                                    </RadioGroup>
                                </div>
                            </FormGroup>
                        }
                        {(this.props.PolicyDetailID != 0 ? (menuDetail["9D2CE40C-9424-7026-A252-7E85D655A1BA"] && menuDetail["9D2CE40C-9424-7026-A252-7E85D655A1BA"].Visibility === "E925F86B") : (menuDetail["3E2A5E39-9AA5-613F-4F61-B7039361875E"] && menuDetail["3E2A5E39-9AA5-613F-4F61-B7039361875E"].Visibility === "E925F86B")) &&
                            // 9D2CE40C-9424-7026-A252-7E85D655A1BA  add 3E2A5E39-9AA5-613F-4F61-B7039361875E
                            <FormGroup row>
                                <Label className="control-label col" >
                                    <IntlMessages id="tokenStaking.slabType" />
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12 cstm_rdo_btn">
                                    <RadioGroup row aria-label="Slab" name="Slab" disabled value={this.state.Slab} onChange={(e) => this.handleChange(e, 'Slab')}  >
                                        <FormControlLabel value="2" control={<Radio />} label={<IntlMessages id="sidebar.trade.filterLabel.range" />} disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["9D2CE40C-9424-7026-A252-7E85D655A1BA"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["3E2A5E39-9AA5-613F-4F61-B7039361875E"].AccessRight === "11E6E7B0" ? true : false))} />
                                        <FormControlLabel value="1" control={<Radio />} label={<IntlMessages id="wallet.Fixed" />} disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["9D2CE40C-9424-7026-A252-7E85D655A1BA"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["3E2A5E39-9AA5-613F-4F61-B7039361875E"].AccessRight === "11E6E7B0" ? true : false))} />
                                    </RadioGroup>
                                </div>
                            </FormGroup>
                        }
                        {(this.props.PolicyDetailID != 0 ? (menuDetail["810BCF5E-266D-1E24-8251-DE47C6CD6B1E"] && menuDetail["810BCF5E-266D-1E24-8251-DE47C6CD6B1E"].Visibility === "E925F86B") : (menuDetail["F91B5EE9-6708-6E55-2C05-001FDF2F5EFC"] && menuDetail["F91B5EE9-6708-6E55-2C05-001FDF2F5EFC"].Visibility === "E925F86B")) &&
                            // 810BCF5E-266D-1E24-8251-DE47C6CD6B1E  add F91B5EE9-6708-6E55-2C05-001FDF2F5EFC
                            <FormGroup className="col-sm-12 d-flex">
                                <Label className="w-40">
                                    <IntlMessages id="wallet.patternStatus" />
                                </Label>
                                <Switch
                                    onClick={(e) => this.setState({ Status: (this.state.Status === 1) ? 0 : 1 })}
                                    enabled={(this.props.PolicyDetailID != 0 ? (menuDetail["810BCF5E-266D-1E24-8251-DE47C6CD6B1E"].AccessRight === "11E6E7B0" ? false : true) : (menuDetail["F91B5EE9-6708-6E55-2C05-001FDF2F5EFC"].AccessRight === "11E6E7B0" ? false : true))}
                                    on={(this.state.Status === 1) ? true : false} />
                            </FormGroup>
                        }
                        {(this.props.PolicyDetailID != 0 ? (menuDetail["78EC14D1-914F-0D7B-13BB-74E8F34985BB"] && menuDetail["78EC14D1-914F-0D7B-13BB-74E8F34985BB"].Visibility === "E925F86B") : (menuDetail["CD691729-6ADE-6E41-8CBF-F8E054DD4964"] && menuDetail["CD691729-6ADE-6E41-8CBF-F8E054DD4964"].Visibility === "E925F86B")) &&
                            // 78EC14D1-914F-0D7B-13BB-74E8F34985BB  add CD691729-6ADE-6E41-8CBF-F8E054DD4964
                            <div className="d-flex">
                                <FormGroup className="col-sm-6">
                                    <Label>
                                        <IntlMessages id="trading.referralsummary.label.duration" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["78EC14D1-914F-0D7B-13BB-74E8F34985BB"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["CD691729-6ADE-6E41-8CBF-F8E054DD4964"].AccessRight === "11E6E7B0" ? true : false))}
                                        className={(errors.DurationMonth) ? "is-invalid" : ""}
                                        type="text"
                                        name="DurationMonth"
                                        value={this.state.DurationMonth}
                                        placeholder={intl.formatMessage({ id: "tokenStaking.lblMonths" })}
                                        maxLength="3"
                                        onChange={(e) => this.handleChange(e, 'DurationMonth')}
                                    />
                                </FormGroup>
                                <FormGroup className="col-sm-6">
                                    <Label>
                                        &nbsp;
                                </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["78EC14D1-914F-0D7B-13BB-74E8F34985BB"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["CD691729-6ADE-6E41-8CBF-F8E054DD4964"].AccessRight === "11E6E7B0" ? true : false))}
                                        className={(errors.DurationWeek) ? "is-invalid" : ""}
                                        type="text"
                                        name="DurationWeek"
                                        value={this.state.DurationWeek}
                                        placeholder={intl.formatMessage({ id: "tokenStaking.lblWeeks2" })}
                                        maxLength="1"
                                        onChange={(e) => this.handleChange(e, 'DurationWeek')}
                                    />
                                </FormGroup>
                            </div>
                        }
                        {this.state.StakingType == "1" && <React.Fragment>
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["52705E78-2F03-8EC4-05C4-66CF908E9EA6"] && menuDetail["52705E78-2F03-8EC4-05C4-66CF908E9EA6"].Visibility === "E925F86B") : (menuDetail["136DF47B-36FA-A22D-4D09-DC5BA3870743"] && menuDetail["136DF47B-36FA-A22D-4D09-DC5BA3870743"].Visibility === "E925F86B")) &&
                                // 52705E78-2F03-8EC4-05C4-66CF908E9EA6   add 136DF47B-36FA-A22D-4D09-DC5BA3870743
                                <FormGroup row>
                                    <Label className="control-label col" >
                                        <IntlMessages id="tokenStaking.lblInterrestType" />
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12 cstm_rdo_btn">
                                        <RadioGroup row aria-label="InterestType" name="InterestType" value={this.state.InterestType} onChange={(e) => this.handleChange(e, 'InterestType')} >
                                            <FormControlLabel value="2" control={<Radio />} label={<IntlMessages id="wallet.Percentage" disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["52705E78-2F03-8EC4-05C4-66CF908E9EA6"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["136DF47B-36FA-A22D-4D09-DC5BA3870743"].AccessRight === "11E6E7B0" ? true : false))} />} />
                                            <FormControlLabel value="1" control={<Radio />} label={<IntlMessages id="wallet.Fixed" disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["52705E78-2F03-8EC4-05C4-66CF908E9EA6"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["136DF47B-36FA-A22D-4D09-DC5BA3870743"].AccessRight === "11E6E7B0" ? true : false))} />} />
                                        </RadioGroup>
                                    </div>
                                </FormGroup>
                            }
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["F6EAACAC-7E75-481D-0939-302481C74172"] && menuDetail["F6EAACAC-7E75-481D-0939-302481C74172"].Visibility === "E925F86B") : (menuDetail["ACDD4BB9-8238-8B1B-6CD8-CE0326A28E36"] && menuDetail["ACDD4BB9-8238-8B1B-6CD8-CE0326A28E36"].Visibility === "E925F86B")) &&
                                //  F6EAACAC-7E75-481D-0939-302481C74172  add ACDD4BB9-8238-8B1B-6CD8-CE0326A28E36
                                <FormGroup className="col-sm-12">
                                    <Label>
                                        <IntlMessages id="tokenStaking.lblInterrestAmt" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["F6EAACAC-7E75-481D-0939-302481C74172"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["ACDD4BB9-8238-8B1B-6CD8-CE0326A28E36"].AccessRight === "11E6E7B0" ? true : false))}
                                        className={(errors.InterestValue) ? "is-invalid" : ""}
                                        type="text"
                                        name="InterestValue"
                                        value={this.state.InterestValue}
                                        placeholder={intl.formatMessage({ id: "tokenStaking.lblInterrestAmt" })}
                                        maxLength="10"
                                        onChange={(e) => this.handleChange(e, 'InterestValue')}
                                    />
                                </FormGroup>
                            }
                        </React.Fragment>}
                        {(this.props.PolicyDetailID != 0 ? (menuDetail["FD1B1C69-5D4E-9EF2-07BC-0C138E3E8D5C"] && menuDetail["FD1B1C69-5D4E-9EF2-07BC-0C138E3E8D5C"].Visibility === "E925F86B") : (menuDetail["AD921B08-9298-4A64-7540-E1075C116CD9"] && menuDetail["AD921B08-9298-4A64-7540-E1075C116CD9"].Visibility === "E925F86B")) && this.state.Slab == "1" && <FormGroup className="col-sm-12">
                            {/*  FD1B1C69-5D4E-9EF2-07BC-0C138E3E8D5C   add AD921B08-9298-4A64-7540-E1075C116CD9 */}
                            <Label>
                                <IntlMessages id="table.amount" /><span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["FD1B1C69-5D4E-9EF2-07BC-0C138E3E8D5C"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["AD921B08-9298-4A64-7540-E1075C116CD9"].AccessRight === "11E6E7B0" ? true : false))}
                                className={(errors.Amount) ? "is-invalid" : ""}
                                type="text"
                                name="Amount"
                                value={this.state.Amount}
                                placeholder={intl.formatMessage({ id: "table.amount" })}
                                maxLength="10"
                                onChange={(e) => this.handleChange(e, 'Amount')}
                            />
                        </FormGroup>}
                        {this.state.Slab == "2" && <div className="d-flex">
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["94E12C7F-A68E-84F4-555A-B886F02D06A1"] && menuDetail["94E12C7F-A68E-84F4-555A-B886F02D06A1"].Visibility === "E925F86B") : (menuDetail["850A5A18-8B20-498A-1271-CBC3C1EE3FEC"] && menuDetail["850A5A18-8B20-498A-1271-CBC3C1EE3FEC"].Visibility === "E925F86B")) &&
                                <FormGroup className={errors.MaxMinAmount ? "col-sm-6 mb-0" : "col-sm-6"}>
                                    <Label>
                                        <IntlMessages id="lable.MinAmount" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["94E12C7F-A68E-84F4-555A-B886F02D06A1"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["850A5A18-8B20-498A-1271-CBC3C1EE3FEC"].AccessRight === "11E6E7B0" ? true : false))}
                                        className={(errors.MinAmount) ? "is-invalid" : ""}
                                        type="text"
                                        name="MinAmount"
                                        value={this.state.MinAmount}
                                        placeholder={intl.formatMessage({ id: "lable.MinAmount" })}
                                        maxLength="10"
                                        onChange={(e) => this.handleChange(e, 'MinAmount')}
                                    />
                                </FormGroup>
                            }
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["49FADB69-0057-4448-0C72-08E0F1B17EE4"] && menuDetail["49FADB69-0057-4448-0C72-08E0F1B17EE4"].Visibility === "E925F86B") : (menuDetail["45B8375D-502E-5083-71F4-A25F2A8E7B97"] && menuDetail["45B8375D-502E-5083-71F4-A25F2A8E7B97"].Visibility === "E925F86B")) &&
                                <FormGroup className={errors.MaxMinAmount ? "col-sm-6 mb-0" : "col-sm-6"}>
                                    <Label>
                                        <IntlMessages id="lable.MaxAmount" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? (menuDetail["49FADB69-0057-4448-0C72-08E0F1B17EE4"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["45B8375D-502E-5083-71F4-A25F2A8E7B97"].AccessRight === "11E6E7B0" ? true : false))}
                                        className={(errors.MaxAmount) ? "is-invalid" : ""}
                                        type="text"
                                        name="MaxAmount"
                                        value={this.state.MaxAmount}
                                        placeholder={intl.formatMessage({ id: "lable.MaxAmount" })}
                                        maxLength="10"
                                        onChange={(e) => this.handleChange(e, 'MaxAmount')}
                                    />
                                </FormGroup>
                            }
                        </div>}
                        {errors.MaxMinAmount && <FormGroup className="col-sm-12 d-flex">
                            <span className="text-danger"><IntlMessages id={errors.MaxMinAmount} /></span>
                        </FormGroup>}
                        {(this.props.PolicyDetailID != 0 ? (menuDetail["0BE119EA-8F9F-3CCC-2244-7CD8B74257F8"] && menuDetail["0BE119EA-8F9F-3CCC-2244-7CD8B74257F8"].Visibility === "E925F86B") : (menuDetail["59E8EA26-49D2-685E-5ABE-510C0B6D90DC"] && menuDetail["59E8EA26-49D2-685E-5ABE-510C0B6D90DC"].Visibility === "E925F86B")) &&
                            // 0BE119EA-8F9F-3CCC-2244-7CD8B74257F8  add 59E8EA26-49D2-685E-5ABE-510C0B6D90DC
                            <FormGroup className="col-sm-12 d-flex">
                                <Label className="w-40">
                                    <IntlMessages id="tokenStaking.autoUnstakingEnable" />
                                </Label>
                                <Switch
                                    enabled={(this.props.PolicyDetailID != 0 ? ((menuDetail["0BE119EA-8F9F-3CCC-2244-7CD8B74257F8"].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail["59E8EA26-49D2-685E-5ABE-510C0B6D90DC"].AccessRight === "11E6E7B0") ? false : true))}
                                    onClick={(e) => this.setState({ AutoUnstakingEnable: (this.state.AutoUnstakingEnable === 1) ? 0 : 1 })}
                                    on={(this.state.AutoUnstakingEnable === 1) ? true : false} />
                            </FormGroup>
                        }
                        {this.state.StakingType == "1" && <React.Fragment>
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["7EB55659-A188-1F99-8504-57B6BB448EDC"] && menuDetail["7EB55659-A188-1F99-8504-57B6BB448EDC"].Visibility === "E925F86B") : (menuDetail["522A44E6-9B85-A403-0927-2F7DA94D7B34"] && menuDetail["522A44E6-9B85-A403-0927-2F7DA94D7B34"].Visibility === "E925F86B")) &&
                                // 7EB55659-A188-1F99-8504-57B6BB448EDC  add 522A44E6-9B85-A403-0927-2F7DA94D7B34
                                <FormGroup className="col-sm-12 d-flex">
                                    <Label className="w-40">
                                        <IntlMessages id="tokenStaking.renewUnstakingEnable" />
                                    </Label>
                                    <Switch
                                        enabled={(this.props.PolicyDetailID != 0 ? ((menuDetail["7EB55659-A188-1F99-8504-57B6BB448EDC"].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail["522A44E6-9B85-A403-0927-2F7DA94D7B34"].AccessRight === "11E6E7B0") ? false : true))}
                                        onClick={(e) => this.setState({ RenewUnstakingEnable: (this.state.RenewUnstakingEnable === 1) ? 0 : 1 })}
                                        on={(this.state.RenewUnstakingEnable === 1) ? true : false} />
                                </FormGroup>
                            }
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["C5644CF0-06A5-6E89-19FE-655902919688"] && menuDetail["C5644CF0-06A5-6E89-19FE-655902919688"].Visibility === "E925F86B") : (menuDetail["E7C8BEAD-9422-13A3-7E51-794521DB4B7E"] && menuDetail["E7C8BEAD-9422-13A3-7E51-794521DB4B7E"].Visibility === "E925F86B")) &&
                                // C5644CF0-06A5-6E89-19FE-655902919688  add E7C8BEAD-9422-13A3-7E51-794521DB4B7E
                                <FormGroup className="col-sm-12">
                                    <Label>
                                        <IntlMessages id="tokenStaking.renewUnStakingPeriod" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? ((menuDetail["C5644CF0-06A5-6E89-19FE-655902919688"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["E7C8BEAD-9422-13A3-7E51-794521DB4B7E"].AccessRight === "11E6E7B0") ? true : false))}
                                        className={(errors.RenewUnstakingPeriod) ? "is-invalid" : ""}
                                        type="text"
                                        name="RenewUnstakingPeriod"
                                        value={this.state.RenewUnstakingPeriod}
                                        placeholder={intl.formatMessage({ id: "tokenStaking.lblWeeks2" })}
                                        maxLength="1"
                                        onChange={(e) => this.handleChange(e, 'RenewUnstakingPeriod')}
                                    />
                                </FormGroup>
                            }
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["A8EA54E9-9773-8DC9-12DE-047650D1472E"] && menuDetail["A8EA54E9-9773-8DC9-12DE-047650D1472E"].Visibility === "E925F86B") : (menuDetail["7DB51F8A-3D12-A286-7644-745C0D8214F5"] && menuDetail["7DB51F8A-3D12-A286-7644-745C0D8214F5"].Visibility === "E925F86B")) &&
                                // A8EA54E9-9773-8DC9-12DE-047650D1472E  add 7DB51F8A-3D12-A286-7644-745C0D8214F5
                                <FormGroup className="col-sm-12">
                                    <Label>
                                        <IntlMessages id="tokenStaking.maturityCurrencyType" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? ((menuDetail["A8EA54E9-9773-8DC9-12DE-047650D1472E"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["7DB51F8A-3D12-A286-7644-745C0D8214F5"].AccessRight === "11E6E7B0") ? true : false))}
                                        className={(errors.MaturityCurrency) ? "is-invalid" : ""}
                                        type="select"
                                        name="MaturityCurrency"
                                        id="MaturityCurrency"
                                        value={this.state.MaturityCurrency}
                                        onChange={e => this.setState({ MaturityCurrency: e.target.value })}
                                    >
                                        <IntlMessages id="wallet.errCurrency">
                                            {(optionValue) =>
                                                <option value="">{optionValue}</option>
                                            }
                                        </IntlMessages>
                                        {this.props.walletType.length > 0 && this.props.walletType.map((currency, key) => (
                                            <option key={key} value={currency.ID}>{currency.TypeName}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            }
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["946C4197-0570-10DF-61B4-2564D95E2ABD"] && menuDetail["946C4197-0570-10DF-61B4-2564D95E2ABD"].Visibility === "E925F86B") : (menuDetail["62F40997-953B-49D7-96D1-0B79B2CE5320"] && menuDetail["62F40997-953B-49D7-96D1-0B79B2CE5320"].Visibility === "E925F86B")) &&
                                // 946C4197-0570-10DF-61B4-2564D95E2ABD   add 62F40997-953B-49D7-96D1-0B79B2CE5320
                                <FormGroup className="col-sm-12 d-flex">
                                    <Label className="w-40">
                                        <IntlMessages id="tokenStaking.enableStakingBeforeMaturity" />
                                    </Label>
                                    <Switch
                                        enabled={(this.props.PolicyDetailID != 0 ? ((menuDetail["946C4197-0570-10DF-61B4-2564D95E2ABD"].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail["62F40997-953B-49D7-96D1-0B79B2CE5320"].AccessRight === "11E6E7B0") ? false : true))}
                                        onClick={(e) => this.setState({ EnableStakingBeforeMaturity: (this.state.EnableStakingBeforeMaturity === 1) ? 0 : 1 })}
                                        on={(this.state.EnableStakingBeforeMaturity === 1) ? true : false} />
                                </FormGroup>
                            }
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["51938230-3CE2-61BB-A5C1-8A331BB72908"] && menuDetail["51938230-3CE2-61BB-A5C1-8A331BB72908"].Visibility === "E925F86B") : (menuDetail["8A5A97C0-60E8-40AC-357D-777FC899717B"] && menuDetail["8A5A97C0-60E8-40AC-357D-777FC899717B"].Visibility === "E925F86B")) &&
                                // 51938230-3CE2-61BB-A5C1-8A331BB72908    add 8A5A97C0-60E8-40AC-357D-777FC899717B
                                <FormGroup className="col-sm-12">
                                    <Label>
                                        <IntlMessages id="tokenStaking.stakingBeforeMaturityCharge" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? ((menuDetail["51938230-3CE2-61BB-A5C1-8A331BB72908"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["8A5A97C0-60E8-40AC-357D-777FC899717B"].AccessRight === "11E6E7B0") ? true : false))}
                                        className={(errors.EnableStakingBeforeMaturityCharge) ? "is-invalid" : ""}
                                        type="text"
                                        name="EnableStakingBeforeMaturityCharge"
                                        value={this.state.EnableStakingBeforeMaturityCharge}
                                        placeholder={intl.formatMessage({ id: "table.charge" })}
                                        maxLength="10"
                                        onChange={(e) => this.handleChange(e, 'EnableStakingBeforeMaturityCharge')}
                                    />
                                </FormGroup>
                            }
                        </React.Fragment>}
                        {this.state.StakingType == "2" && <div className="d-flex">
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["09AA5C0D-1AD5-250D-181A-E35BE1FF6536"] && menuDetail["09AA5C0D-1AD5-250D-181A-E35BE1FF6536"].Visibility === "E925F86B") : (menuDetail["CD6A2BB6-07CA-1370-A2B9-A5EE0C1147F6"] && menuDetail["CD6A2BB6-07CA-1370-A2B9-A5EE0C1147F6"].Visibility === "E925F86B")) &&
                                <FormGroup className="col-sm-6">
                                    <Label>
                                        <IntlMessages id="lable.makerCharges" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? ((menuDetail["09AA5C0D-1AD5-250D-181A-E35BE1FF6536"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["CD6A2BB6-07CA-1370-A2B9-A5EE0C1147F6"].AccessRight === "11E6E7B0") ? true : false))}
                                        className={(errors.MakerCharges) ? "is-invalid" : ""}
                                        type="text"
                                        name="MakerCharges"
                                        value={this.state.MakerCharges}
                                        placeholder={intl.formatMessage({ id: "lable.makerCharges" })}
                                        maxLength="10"
                                        onChange={(e) => this.handleChange(e, 'MakerCharges')}
                                    />
                                </FormGroup>
                            }
                            {(this.props.PolicyDetailID != 0 ? (menuDetail["8B5BBED9-40FC-182A-23C8-841BE4834358"] && menuDetail["8B5BBED9-40FC-182A-23C8-841BE4834358"].Visibility === "E925F86B") : (menuDetail["1E72E86E-2CAF-55DB-75F6-9319194036BE"] && menuDetail["1E72E86E-2CAF-55DB-75F6-9319194036BE"].Visibility === "E925F86B")) &&
                                <FormGroup className="col-sm-6">
                                    <Label>
                                        <IntlMessages id="lable.takerCharges" /><span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(this.props.PolicyDetailID != 0 ? ((menuDetail["8B5BBED9-40FC-182A-23C8-841BE4834358"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["1E72E86E-2CAF-55DB-75F6-9319194036BE"].AccessRight === "11E6E7B0") ? true : false))}
                                        className={(errors.TakerCharges) ? "is-invalid" : ""}
                                        type="text"
                                        name="TakerCharges"
                                        value={this.state.TakerCharges}
                                        placeholder={intl.formatMessage({ id: "lable.takerCharges" })}
                                        maxLength="10"
                                        onChange={(e) => this.handleChange(e, 'TakerCharges')}
                                    />
                                </FormGroup>
                            }
                        </div>}
                        {Object.keys(menuDetail).length > 0  && !this.props.loading && <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                            <div className="btn_area">
                                <Button
                                    variant="raised"
                                    className="btn-primary text-white mr-10"
                                    onClick={(e) => this.handleSubmit()}
                                >
                                    {(this.props.PolicyDetailID != 0) ? <IntlMessages id="sidebar.btnUpdate" /> : <IntlMessages id="button.add" />}
                                </Button>{" "}
                                <Button
                                    variant="raised"
                                    className="btn-danger text-white"
                                    onClick={(e) => this.handleCancel()}
                                >
                                    <IntlMessages id="button.cancel" />
                                </Button>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ walletUsagePolicy, StakingConfigurationReducer, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { walletType, Loading, } = walletUsagePolicy;
    const { loading, addResponse, stackDetails } = StakingConfigurationReducer
    return { walletType, Loading, loading, addResponse, stackDetails, menu_rights, menuLoading };
};

export default connect(mapStateToProps, {
    addStakingConfig,
    getStakingConfigList,
    getWalletType,
    getMenuPermissionByID
})(injectIntl(StakingConfigForm));