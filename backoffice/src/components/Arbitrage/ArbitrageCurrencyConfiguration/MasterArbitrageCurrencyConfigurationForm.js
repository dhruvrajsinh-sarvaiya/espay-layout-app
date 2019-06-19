/**
 *   Developer : Parth Andhariya
 *   Date: 13-02-2019
 *   Component:  Charge Configuration Form
 */
import React, { Component } from "react";
import Switch from "react-toggle-switch";
import { connect } from "react-redux";
import { FormGroup, Label, Input } from "reactstrap";
import { injectIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { getWalletTransactionType } from "Actions/TransactionPolicy";
import { getWalletType } from "Actions/WalletUsagePolicy";
import validateFormChargeConfiguration from "Validations/ChargeConfigurationValidation/MasterFormValidation";
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
import {
    addChargesConfiguration,
    UpdateChargesConfiguration,
    ListChargeConfiguration
} from "Actions/ChargeConfigurationAction";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
//button style
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};

class MasterArbitrageCurrencyConfigurationForm extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            addRecord: {
                Id: "",
                WalletTypeId: "",
                TrnType: "",
                KYCComplaint: "0",
                Remarks: "",
                Status: "0",
                SpecialChargeConfigurationID: 0,
                SlabType: 1
            },
            notificationFlag: false,
            // fieldList:{},
            menudetail: [],
            notification: true,
        };
    }
    // component will mount actions
    componentWillMount() {
        this.props.getMenuPermissionByID('B5CC5A29-382B-03DE-7D5F-6D026CB26AD9'); // get wallet menu permission
    }
    //validate reponse on status change
    componentWillReceiveProps(nextProps) {
        const intl = this.props.intl;
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.getWalletType({ Status: 1 });
                this.props.getWalletTransactionType();
                this.props.ListArbitrageCurrency({});
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notification: false });
        }
        //validation for set update form
        if (
            nextProps.getChargeById.ReturnCode === 0 &&
            nextProps.Form
        ) {
            this.setState({
                addRecord: {
                    Id: nextProps.getChargeById.Details.Id,
                    WalletTypeId: nextProps.getChargeById.Details.WalletTypeID,
                    TrnType: nextProps.getChargeById.Details.TrnType,
                    KYCComplaint: nextProps.getChargeById.Details.KYCComplaint,
                    Remarks: nextProps.getChargeById.Details.Remarks,
                    Status: nextProps.getChargeById.Details.Status,
                    SpecialChargeConfigurationID: nextProps.getChargeById.Details.SpecialChargeConfigurationID,
                    SlabType: nextProps.getChargeById.Details.SlabType
                },
            });
        }
        // validate success foe addRecord
        if (nextProps.addChargeData.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.addChargeData.ReturnCode === 0) {
                //success
                NotificationManager.success(intl.formatMessage({ id: "common.form.add.success" }));
                this.props.drawerClose();
                setTimeout(function () {
                    this.setState({
                        addRecord: {
                            WalletTypeId: "",
                            TrnType: "",
                            KYCComplaint: "0",
                            Remarks: "",
                            Status: "0",
                            SpecialChargeConfigurationID: 0,
                            SlabType: 1
                        },
                        errors: {}
                    });
                    //list action call
                    if (nextProps.ChargeData.length > 0) {
                        this.props.ListChargeConfiguration({});
                    }
                }.bind(this), 1000);
            } else if (nextProps.addChargeData.ReturnCode !== 0) {
                NotificationManager.error(intl.formatMessage({ id: `apiWalletErrCode.${nextProps.addChargeData.ErrorCode}` }));
            }
        }
        // validate success foe update
        if (nextProps.updateData.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            if (nextProps.updateData.ReturnCode === 0) {
                //success
                NotificationManager.success(intl.formatMessage({ id: "common.form.edit.success" }));
                this.props.drawerClose();
                setTimeout(function () {
                    this.setState({
                        notificationFlag: false,
                        errors: {},
                        addRecord: {
                            WalletTypeId: "",
                            TrnType: "",
                            KYCComplaint: "0",
                            Remarks: "",
                            Status: "0",
                            SpecialChargeConfigurationID: 0,
                            SlabType: 1
                        },
                    });
                    //list api call
                    if (nextProps.ChargeData.length > 0) {
                        this.props.ListChargeConfiguration({});
                    }
                }.bind(this), 1000);
            } else if (nextProps.updateData.ReturnCode !== 0) {
                NotificationManager.error(intl.formatMessage({ id: `apiWalletErrCode.${nextProps.updateData.ErrorCode}` }));
                this.setState({
                    notificationFlag: false
                });
            }
        }
    }
    //drawer close
    closeAll = () => {
        this.props.closeAll();
    };
    //handle cancel button
    handleCancel = () => {
        this.props.drawerClose();
        this.setState({
            errors: {},
            addRecord: {
                WalletTypeId: "",
                TrnType: "",
                KYCComplaint: "0",
                Remarks: "",
                Status: "0",
                SpecialChargeConfigurationID: 0,
                SlabType: 1
            },
        });
    };
    //handle input form
    onChangeAddText(key, value) {
        this.setState({
            addRecord: {
                ...this.state.addRecord,
                [key]: value
            }
        });
    }
    //handle switch
    handleCheckChange = name => (checked) => {
        if (name === "KYCComplaint") {
            this.setState({ [name]: checked });
            this.setState({
                addRecord: {
                    ...this.state.addRecord,
                    KYCComplaint: this.state.addRecord.KYCComplaint === 1 ? 0 : 1
                }
            });
        } if (name === "Status") {
            this.setState({ [name]: checked });
            this.setState({
                addRecord: {
                    ...this.state.addRecord,
                    Status: this.state.addRecord.Status === 1 ? 0 : 1
                }
            });
        }
    };
    // submit new record for charge configuration Details
    onSubmitaddChargeConfigForm() {
        const { errors, isValid } = validateFormChargeConfiguration(this.state);
        this.setState({ errors: errors, notificationFlag: true });
        if (isValid) {
            const { addRecord } = this.state;
            delete addRecord.Id;
            this.props.addChargesConfiguration(addRecord);
        }
    }
    //Update Charge Configuration Details record
    onUpdateChargeConfiguration() {
        //validate form here
        const { errors, isValid } = validateFormChargeConfiguration(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addRecord } = this.state;
            delete addRecord.KYCComplaint;
            delete addRecord.StrKYCComplaint;
            delete addRecord.StrSlabType;
            delete addRecord.StrStatus;
            delete addRecord.TrnType;
            delete addRecord.TrnTypeName;
            delete addRecord.WalletTypeId;
            delete addRecord.WalletTypeName;
            delete addRecord.SpecialChargeConfigurationID;
            this.props.UpdateChargesConfiguration(addRecord);
            this.setState({ notificationFlag: true });
        }
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
        var menuDetail = this.checkAndGetMenuAccessDetail((this.props.Form) ? '325D23B9-5C3C-74AD-2C7B-3C2010D22B3F' : 'BEE7C897-231A-0D98-85FF-CB2ED9A10D07');
        const { errors, addRecord } = this.state;
        const { Form } = this.props;
        const intl = this.props.intl;
        return (
            <div className="jbs-page-content">
                <form>
                    <div className="page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            {Form ? (
                                <h2>
                                    <span>
                                        {intl.formatMessage({
                                            id: "lable.EditArbitrageCurrencyConfiguration"
                                        })}
                                    </span>
                                </h2>
                            ) : (
                                    <h2>
                                        <span>
                                            {intl.formatMessage({
                                                id: "lable.AddArbitrageCurrencyConfiguration"
                                            })}
                                        </span>
                                    </h2>
                                )}
                        </div>
                        <div className="page-title-wrap drawer_btn mb-10 text-right">
                            <Button
                                className="btn-warning text-white mr-10 mb-10"
                                style={buttonSizeSmall}
                                variant="fab"
                                mini
                                onClick={this.handleCancel}
                            >
                                <i className="zmdi zmdi-mail-reply" />
                            </Button>
                            <Button
                                className="btn-info text-white mr-10 mb-10"
                                style={buttonSizeSmall}
                                variant="fab"
                                mini
                                onClick={this.closeAll}
                            >
                                <i className="zmdi zmdi-home" />
                            </Button>
                        </div>
                    </div>
                    {(this.props.menuLoading || this.props.loading || this.props.ArbitrageCurrencyloading) && <JbsSectionLoader />}
                    {(Form ? (menuDetail["73B8913F-42FC-48C7-28AE-504664AE774B"] && menuDetail["73B8913F-42FC-48C7-28AE-504664AE774B"].Visibility === "E925F86B") : (menuDetail["B0D7DCDC-2F03-8408-969E-BE50CDA7263B"] && menuDetail["B0D7DCDC-2F03-8408-969E-BE50CDA7263B"].Visibility === "E925F86B")) &&
                        // 73B8913F-42FC-48C7-28AE-504664AE774B  add B0D7DCDC-2F03-8408-969E-BE50CDA7263B
                        <div className="form-group row">
                            <Label className="col-md-4 col-form-label d-inline">
                                {intl.formatMessage({
                                    id: "lable.WalletTypeName"
                                })}<span className="text-danger"> *</span>
                            </Label>
                            <div className="col-md-8">
                                <Input
                                    disabled={(Form ? ((menuDetail["73B8913F-42FC-48C7-28AE-504664AE774B"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["B0D7DCDC-2F03-8408-969E-BE50CDA7263B"].AccessRight === "11E6E7B0") ? true : false))}
                                    // disabled={Form ? true : false}
                                    type="select"
                                    name="WalletTypeId"
                                    className="form-control"
                                    id="WalletTypeId"
                                    value={
                                        addRecord.WalletTypeId
                                    }
                                    onChange={e =>
                                        this.onChangeAddText("WalletTypeId", e.target.value)
                                    }
                                >
                                    <option value="">
                                        {intl.formatMessage({
                                            id: "wallet.errCurrency"
                                        })}
                                    </option>
                                    {this.props.ArbitrageCurrencyList.length &&
                                        this.props.ArbitrageCurrencyList.map((list, index) => (
                                            <option key={index} value={list.Id}>
                                                {list.CoinName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.WalletTypeId && (
                                    <span className="text-danger">
                                        {intl.formatMessage({ id: errors.WalletTypeId })}
                                    </span>
                                )}
                            </div>
                        </div>
                    }
                    {(Form ? (menuDetail["3C0B3758-04AE-5C6E-484C-F7C4F17D42BF"] && menuDetail["3C0B3758-04AE-5C6E-484C-F7C4F17D42BF"].Visibility === "E925F86B") : (menuDetail["82B59FFB-29E6-09A3-9B4B-9717E4195801"] && menuDetail["82B59FFB-29E6-09A3-9B4B-9717E4195801"].Visibility === "E925F86B")) &&
                        //3C0B3758-04AE-5C6E-484C-F7C4F17D42BF   add 82B59FFB-29E6-09A3-9B4B-9717E4195801
                        <div className="form-group row">
                            <Label className="col-md-4 col-form-label  d-inline">
                                {intl.formatMessage({
                                    id: "sidebar.trntype"
                                })}<span className="text-danger"> *</span>
                            </Label>
                            <div className="col-md-8">
                                <Input
                                    disabled={(Form ? ((menuDetail["3C0B3758-04AE-5C6E-484C-F7C4F17D42BF"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["82B59FFB-29E6-09A3-9B4B-9717E4195801"].AccessRight === "11E6E7B0") ? true : false))}
                                    // disabled={Form ? true : false}
                                    type="select"
                                    name="TrnType"
                                    className="form-control"
                                    id="TrnType"
                                    value={
                                        addRecord.TrnType
                                    }
                                    onChange={e =>
                                        this.onChangeAddText("TrnType", e.target.value)
                                    }
                                >
                                    <option value="">
                                        {intl.formatMessage({
                                            id: "lable.selectType"
                                        })}
                                    </option>
                                    {this.props.walletTransactionType.length &&
                                        this.props.walletTransactionType.map((list, index) => (
                                            <option key={index} value={list.TypeId}>
                                                {list.TypeName}
                                            </option>
                                        ))}
                                </Input>
                                {errors.TrnType && (
                                    <span className="text-danger">
                                        {intl.formatMessage({ id: errors.TrnType })}
                                    </span>
                                )}
                            </div>
                        </div>
                    }
                    {(Form ? (menuDetail["F2F3FA2A-535C-6999-9A30-2FFBCF942FAA"] && menuDetail["F2F3FA2A-535C-6999-9A30-2FFBCF942FAA"].Visibility === "E925F86B") : (menuDetail["C2DF1E6D-317E-59E1-7CC9-248A87B32D5F"] && menuDetail["C2DF1E6D-317E-59E1-7CC9-248A87B32D5F"].Visibility === "E925F86B")) &&
                        //F2F3FA2A-535C-6999-9A30-2FFBCF942FAA   add C2DF1E6D-317E-59E1-7CC9-248A87B32D5F
                        <div className="form-group row">
                            <Label className="col-md-4 col-form-label">
                                {intl.formatMessage({
                                    id: "lable.KYCComplaint"
                                })}
                            </Label>
                            <div className="col-md-8 py-5">
                                <Switch
                                    enabled={(Form ? ((menuDetail["F2F3FA2A-535C-6999-9A30-2FFBCF942FAA"].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail["C2DF1E6D-317E-59E1-7CC9-248A87B32D5F"].AccessRight === "11E6E7B0") ? false : true))}
                                    // enabled={Form ? false : true}
                                    onClick={this.handleCheckChange("KYCComplaint")}
                                    on={
                                        addRecord.KYCComplaint === 1
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                        </div>
                    }
                    {(Form ? (menuDetail["A235855A-5FEC-5BB6-3B46-68F4EA25428F"] && menuDetail["A235855A-5FEC-5BB6-3B46-68F4EA25428F"].Visibility === "E925F86B") : (menuDetail["7F5052F5-05A4-8730-4DF6-F2E4A61B1A6D"] && menuDetail["7F5052F5-05A4-8730-4DF6-F2E4A61B1A6D"].Visibility === "E925F86B")) &&
                        // A235855A-5FEC-5BB6-3B46-68F4EA25428F  add 7F5052F5-05A4-8730-4DF6-F2E4A61B1A6D
                        <div className="form-group row">
                            <Label className="col-md-4 col-form-label d-inline">
                                {intl.formatMessage({ id: "sidebar.remark" })}<span className="text-danger"> *</span>
                            </Label>
                            <div className="col-md-8">
                                <Input
                                    disabled={(Form ? ((menuDetail["A235855A-5FEC-5BB6-3B46-68F4EA25428F"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["7F5052F5-05A4-8730-4DF6-F2E4A61B1A6D"].AccessRight === "11E6E7B0") ? true : false))}
                                    type="text"
                                    name="Remarks"
                                    placeholder={intl.formatMessage({ id: "lable.enter" })}
                                    className="form-control"
                                    id="Remarks"
                                    value={
                                        addRecord.Remarks
                                    }
                                    onChange={e => this.onChangeAddText("Remarks", e.target.value)}
                                />
                                {errors.Remarks && (
                                    <span className="text-danger">
                                        {intl.formatMessage({ id: errors.Remarks })}
                                    </span>
                                )}
                            </div>
                        </div>
                    }
                    {(Form ? (menuDetail["05ED10F9-2C8D-528C-74B3-44549D6E728E"] && menuDetail["05ED10F9-2C8D-528C-74B3-44549D6E728E"].Visibility === "E925F86B") : (menuDetail["A7C57C70-905D-4F1B-598B-F9C06BF1A382"] && menuDetail["A7C57C70-905D-4F1B-598B-F9C06BF1A382"].Visibility === "E925F86B")) &&
                        // 05ED10F9-2C8D-528C-74B3-44549D6E728E  add A7C57C70-905D-4F1B-598B-F9C06BF1A382
                        <div className="form-group row">
                            <Label className="col-md-4 col-form-label">
                                {intl.formatMessage({
                                    id: "table.Status"
                                })}
                            </Label>
                            <div className="col-md-8 py-5">
                                <Switch
                                    enabled={(Form ? ((menuDetail["05ED10F9-2C8D-528C-74B3-44549D6E728E"].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail["A7C57C70-905D-4F1B-598B-F9C06BF1A382"].AccessRight === "11E6E7B0") ? false : true))}
                                    onClick={this.handleCheckChange("Status")}
                                    on={
                                        addRecord.Status === 1
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                        </div>
                    }

                    {(menuDetail) && Form ? (
                        <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                            <div className="btn_area">
                                <Button
                                    variant="raised"
                                    className="btn-primary text-white mr-20"
                                    onClick={() => this.onUpdateChargeConfiguration()}
                                    disabled={this.props.loading}
                                >
                                    {intl.formatMessage({ id: "button.update" })}
                                </Button>
                                <Button
                                    variant="raised"
                                    className="btn-danger text-white"
                                    onClick={this.handleCancel}
                                    disabled={this.props.loading}
                                >
                                    {intl.formatMessage({ id: "button.cancel" })}
                                </Button>
                            </div>
                        </div>
                    ) : (
                            <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                <div className="btn_area">
                                    <Button
                                        variant="raised"
                                        className="btn-primary text-white mr-20"
                                        onClick={e => this.onSubmitaddChargeConfigForm()}
                                        disabled={this.props.loading}
                                    >
                                        {intl.formatMessage({ id: "button.add" })}
                                    </Button>
                                    <Button
                                        variant="raised"
                                        className="btn-danger text-white"
                                        onClick={this.handleCancel}
                                        disabled={this.props.loading}
                                    >
                                        {intl.formatMessage({ id: "button.cancel" })}
                                    </Button>
                                </div>
                            </div>
                        )}

                </form>
            </div>
        );
    }
}
MasterArbitrageCurrencyConfigurationForm.defaultProps = {
    Form: false
};

//map method
const mapStateToProps = ({ ChargeConfiguration, walletUsagePolicy, transactionPolicy, authTokenRdcer, ArbitrageCurrencyConfiguration }) => {
    const {
        ChargeData,
        addChargeData,
        getChargeById,
        updateData,
        loading,
        error
    } = ChargeConfiguration;
    const { ArbitrageCurrencyList, ArbitrageCurrencyloading } = ArbitrageCurrencyConfiguration;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { walletType } = walletUsagePolicy;
    const { walletTransactionType } = transactionPolicy;
    return {
        ChargeData,
        addChargeData,
        getChargeById,
        updateData,
        loading,
        walletType,
        walletTransactionType,
        error,
        menuLoading,
        menu_rights,
        ArbitrageCurrencyList,
        ArbitrageCurrencyloading
    };
};

export default connect(
    mapStateToProps,
    {
        addChargesConfiguration,
        UpdateChargesConfiguration,
        ListChargeConfiguration,
        getWalletType,
        getWalletTransactionType,
        getMenuPermissionByID,
        ListArbitrageCurrency
    }
)(injectIntl(MasterArbitrageCurrencyConfigurationForm));
