/* 
    Developer : Nishant Vadgama
    Date : 17-01-2019
    File Comment : Master staking form
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
import { NotificationManager } from "react-notifications";
import {
    getWalletType,
} from "Actions/WalletUsagePolicy";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import {
    insertUpdateWalletMaster,
    getMasterStakingList
} from "Actions/Wallet";
var MasterStakingRequestValidator = require("../../../validation/StakingConfiguration/MasterStakingRequestValidator");
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
const initialState = {
    Id: 0,
    WalletTypeID: "",
    StakingType: "1",
    SlabType: "1",
    Status: 0,
    errors: {},
    showError: false,
    showSuccess: false,
    responseMessage: "",
    notificationFlag: true,
    fieldList: {},
    menudetail: [],
    notification: true,
}

class MasterStakingForm extends Component {
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
        this.props.getMenuPermissionByID('24CB0E8F-06D4-0AB7-8B21-76193A2F53D3'); // get wallet menu permission
    }
    //validate reponse on status change 
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        if (nextProps.MasterDetails.hasOwnProperty('Id')) {
            this.setState({
                Id: nextProps.MasterDetails.Id,
                WalletTypeID: nextProps.MasterDetails.WalletTypeId + '',
                StakingType: nextProps.MasterDetails.StakingType + '',
                SlabType: nextProps.MasterDetails.SlabType + '',
                Status: nextProps.MasterDetails.Status,
            });
        }
        // validate success
        if (nextProps.masterResponse.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.masterResponse.ReturnCode == 0) {     //success
                NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
                this.props.drawerClose();
                this.props.getMasterStakingList({});
                this.setState({
                    Id: 0,
                    WalletTypeID: "",
                    StakingType: "1",
                    SlabType: "1",
                    Status: 0,
                    errors: {},
                    showError: false,
                    showSuccess: false,
                    responseMessage: "",
                });
            } else if (nextProps.masterResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.masterResponse.ErrorCode} />);
            }
        }
    }
    //handle change radio
    handleChange = (e, key) => {
        const regexWeek = /^[1-4]+$/;
        if (key == 'DurationWeek' || key == 'RenewUnstakingPeriod') {
            if ((validator.isNumeric(e.target.value, { no_symbols: true }) && (validator.matches(e.target.value,regexWeek))) || e.target.value == "") {
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
        const { errors, isValid } = MasterStakingRequestValidator(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.insertUpdateWalletMaster({
                "Id": this.state.Id,
                "WalletTypeID": this.state.WalletTypeID,
                "SlabType": this.state.SlabType,
                "StakingType": this.state.StakingType,
                "Status": this.state.Status
            });
            this.setState({ notificationFlag: true });
        }
    }
    //handle cancel 
    handleCancel() {
        this.props.drawerClose();
        this.setState({
            Id: 0,
            WalletTypeID: "",
            StakingType: "1",
            SlabType: "1",
            Status: 0,
            errors: {},
            showError: false,
            showSuccess: false,
            responseMessage: "",
            notificationFlag: false
        });
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
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }
    render() {
        var menuDetail = this.checkAndGetMenuAccessDetail((this.state.Id != 0) ? 'B169DB2E-084C-8C7B-A511-50CB9A091A59' : 'EDFC12B0-5ABA-2D76-1D96-943D4538052F');
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><span>{(this.state.Id != 0) ? <IntlMessages id="tokenStaking.lblUpdateStakingPlan" /> : <IntlMessages id="tokenStaking.lblAddStakingPlan" />}</span></h2>
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
                        {(this.state.Id !== 0 ? (menuDetail["0F9D837A-6D5B-5FF2-4C6E-B3F91EE91DB0"] && menuDetail["0F9D837A-6D5B-5FF2-4C6E-B3F91EE91DB0"].Visibility === "E925F86B") : (menuDetail["392EDEE6-964E-4103-4567-0F0D95030AD4"] && menuDetail["392EDEE6-964E-4103-4567-0F0D95030AD4"].Visibility === "E925F86B")) &&
                            //edit - 0F9D837A-6D5B-5FF2-4C6E-B3F91EE91DB0  add- 392EDEE6-964E-4103-4567-0F0D95030AD4
                            <FormGroup row >
                                <Label className="control-label col" >
                                    <IntlMessages id="table.currency" /> <span className="text-danger">*</span>
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                        className={(this.state.errors.WalletTypeID) ? "is-invalid" : ""}
                                        type="select"
                                        name="WalletTypeID"
                                        id="WalletTypeID"
                                        value={this.state.WalletTypeID}
                                        disabled={(this.state.Id !== 0 ? (menuDetail["0F9D837A-6D5B-5FF2-4C6E-B3F91EE91DB0"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["392EDEE6-964E-4103-4567-0F0D95030AD4"].AccessRight === "11E6E7B0" ? true : false))}
                                        onChange={e => this.setState({ WalletTypeID: e.target.value })}
                                    >
                                        <IntlMessages id="wallet.errCurrency">
                                            {(optionValue) =>
                                                <option value="">{optionValue}</option>
                                            }
                                        </IntlMessages>
                                        {this.props.walletType.length && this.props.walletType.map((currency, key) => (
                                            <option key={key} value={currency.ID}>{currency.TypeName}</option>
                                        ))}
                                    </Input>
                                </div>
                            </FormGroup>
                        }
                        {(this.state.Id !== 0 ? (menuDetail["20279B9E-7E41-5F4E-1B19-382A456059AB"] && menuDetail["20279B9E-7E41-5F4E-1B19-382A456059AB"].Visibility === "E925F86B") : (menuDetail["5867C59C-7C37-41D8-937C-DABE90539EC7"] && menuDetail["5867C59C-7C37-41D8-937C-DABE90539EC7"].Visibility === "E925F86B")) &&
                            // edit - 20279B9E-7E41-5F4E-1B19-382A456059AB  add -5867C59C-7C37-41D8-937C-DABE90539EC7
                            <FormGroup row >
                                <Label className="control-label col" >
                                    <IntlMessages id="tokenStaking.stakingType" />
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12 cstm_rdo_btn">
                                    <RadioGroup row aria-label="StakingType" name="StakingType" value={this.state.StakingType} onChange={(e) => this.handleChange(e, 'StakingType')} >
                                        <FormControlLabel value="2" control={<Radio />} label={<IntlMessages id="table.charge" />} disabled={(this.state.Id !== 0 ? (menuDetail["20279B9E-7E41-5F4E-1B19-382A456059AB"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["5867C59C-7C37-41D8-937C-DABE90539EC7"].AccessRight === "11E6E7B0" ? true : false))} />
                                        <FormControlLabel value="1" control={<Radio />} label={<IntlMessages id="tokenStaking.fixedDeposit" />} disabled={(this.state.Id !== 0 ? (menuDetail["20279B9E-7E41-5F4E-1B19-382A456059AB"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["5867C59C-7C37-41D8-937C-DABE90539EC7"].AccessRight === "11E6E7B0" ? true : false))} />
                                    </RadioGroup>
                                </div>
                            </FormGroup>
                        }
                        {(this.state.Id !== 0 ? (menuDetail["C2F6EDD3-06C9-9FD7-208B-FAF59DFD3EB5"] && menuDetail["C2F6EDD3-06C9-9FD7-208B-FAF59DFD3EB5"].Visibility === "E925F86B") : (menuDetail["FBE5BA81-0877-5F22-67BD-EE5BBB476858"] && menuDetail["FBE5BA81-0877-5F22-67BD-EE5BBB476858"].Visibility === "E925F86B")) &&
                            //edit - C2F6EDD3-06C9-9FD7-208B-FAF59DFD3EB5   add -FBE5BA81-0877-5F22-67BD-EE5BBB476858
                            <FormGroup row >
                                <Label className="control-label col" >
                                    <IntlMessages id="tokenStaking.slabType" />
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12 cstm_rdo_btn">
                                    <RadioGroup row aria-label="SlabType" name="SlabType" value={this.state.SlabType} onChange={(e) => this.handleChange(e, 'SlabType')} >
                                        <FormControlLabel value="2" control={<Radio />} label={<IntlMessages id="sidebar.trade.filterLabel.range" disabled={(this.state.Id !== 0 ? (menuDetail["C2F6EDD3-06C9-9FD7-208B-FAF59DFD3EB5"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["FBE5BA81-0877-5F22-67BD-EE5BBB476858"].AccessRight === "11E6E7B0" ? true : false))} />} />
                                        <FormControlLabel value="1" control={<Radio />} label={<IntlMessages id="wallet.Fixed" disabled={(this.state.Id !== 0 ? (menuDetail["C2F6EDD3-06C9-9FD7-208B-FAF59DFD3EB5"].AccessRight === "11E6E7B0" ? true : false) : (menuDetail["FBE5BA81-0877-5F22-67BD-EE5BBB476858"].AccessRight === "11E6E7B0" ? true : false))} />} />
                                    </RadioGroup>
                                </div>
                            </FormGroup>
                        }
                        {(this.state.Id !== 0 ? (menuDetail["4B533638-9CA7-972F-65F1-14E9F53E5BA6"] && menuDetail["4B533638-9CA7-972F-65F1-14E9F53E5BA6"].Visibility === "E925F86B") : (menuDetail["7D4E21D0-262B-6544-1016-25AFAF4132C2"] && menuDetail["7D4E21D0-262B-6544-1016-25AFAF4132C2"].Visibility === "E925F86B")) &&
                            // edit - 4B533638-9CA7-972F-65F1-14E9F53E5BA6 add - 7D4E21D0-262B-6544-1016-25AFAF4132C2
                            <FormGroup row >
                                <Label className="control-label col" >
                                    <IntlMessages id="table.status" />
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Switch
                                        onClick={(e) => this.setState({ Status: (this.state.Status === 1) ? 0 : 1 })}
                                        enabled={(this.state.Id !== 0 ? ((menuDetail["4B533638-9CA7-972F-65F1-14E9F53E5BA6"].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail["7D4E21D0-262B-6544-1016-25AFAF4132C2"].AccessRight === "11E6E7B0") ? false : true))}
                                        on={(this.state.Status === 1) ? true : false} />
                                </div>
                            </FormGroup>
                        }
                        {menuDetail && !this.props.loading && <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                            <div className="btn_area">
                                <Button
                                    variant="raised"
                                    className="btn-primary text-white mr-10"
                                    onClick={(e) => this.handleSubmit()}
                                >
                                    {(this.state.Id != 0) ? <IntlMessages id="sidebar.btnUpdate" /> : <IntlMessages id="button.add" />}
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
    const { walletType } = walletUsagePolicy;
    const { loading, masterResponse } = StakingConfigurationReducer
    return { walletType, loading, masterResponse, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    insertUpdateWalletMaster,
    getMasterStakingList,
    getWalletType,
    getMenuPermissionByID
})(MasterStakingForm);