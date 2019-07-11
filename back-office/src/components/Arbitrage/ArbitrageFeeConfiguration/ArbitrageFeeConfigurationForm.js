/**
 *   Developer : Parth Andhariya
 *   Date: 20-03-2019
 *   Component:  Charge Configuration Detail Form
 */
import React, { Component } from "react";
import Switch from "react-toggle-switch";
import validator from "validator";
import { connect } from "react-redux";
import { FormGroup, Label, Input } from "reactstrap";
import { injectIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { getWalletType } from "Actions/WalletUsagePolicy";
import validateArbitrageFeeConfigurationForm from "Validations/Arbitrage/ArbitrageFeeConfiguration/DetailsFormValidation";
import { getFeeConfigurationList, addFeeConfigurationList, updateFeeConfigurationList } from 'Actions/Arbitrage/ArbitrageFeeConfiguration';
import { getMenuPermissionByID } from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";

//button style
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};

class ArbitrageFeeConfigurationForm extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            addRecord: {
                ChargeConfigDetailId: "",
                FeeConfigurationMasterID: props.MasterId,
                ChargeDistributionBasedOn: 1,
                ChargeType: "1",
                DeductionWalletTypeId: "",
                ChargeValue: "",
                ChargeValueType: "1",
                MakerCharge: "",
                TakerCharge: "",
                Status: "0",
                MarkupType: "1",
                MarkupValue: ""
            },
            notificationFlag: false,
            Flag: false,
            menudetail: [],
            notification: true,
        };
    }
    // component will mount actions
    componentWillMount() {
        this.props.getMenuPermissionByID('FAA37144-6DFF-7514-4273-A6C349C270DE'); // get wallet menu permission
    }
    //validate reponse on status change
    componentWillReceiveProps(nextProps) {
        const intl = this.props.intl;
        /* update menu details if not set */
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
        //to get updated masterId from parant 
        this.setState({
            addRecord: {
                ...this.state.addRecord,
                FeeConfigurationMasterID: nextProps.MasterId,
            }
        })
        if (
            nextProps.getDetails.ReturnCode === 0 &&
            nextProps.Form
        ) {
            this.setState({
                addRecord: {
                    ChargeConfigDetailId: nextProps.getDetails.Details.ChargeConfigDetailId,
                    FeeConfigurationMasterID: nextProps.getDetails.Details.FeeConfigurationMasterID,
                    ChargeDistributionBasedOn: nextProps.getDetails.Details.ChargeDistributionBasedOn,
                    ChargeType: nextProps.getDetails.Details.ChargeType.toString(),
                    ChargeValue: nextProps.getDetails.Details.ChargeValue,
                    ChargeValueType: nextProps.getDetails.Details.ChargeValueType.toString(),
                    MakerCharge: nextProps.getDetails.Details.MakerCharge,
                    TakerCharge: nextProps.getDetails.Details.TakerCharge,
                    Status: nextProps.getDetails.Details.Status,
                },
            });
        }
        // validate success for addRecord
        if (nextProps.addDetails.hasOwnProperty("ReturnCode") && this.state.Flag) {
            this.setState({ Flag: false });
            if (nextProps.addDetails.ReturnCode === 0) {
                //success
                NotificationManager.success(intl.formatMessage({ id: "common.form.add.success" }));
                this.props.drawerClose();
                setTimeout(
                    function () {
                        this.setState({
                            addRecord: {
                                ChargeConfigDetailId: "",
                                FeeConfigurationMasterID: this.props.MasterId,
                                ChargeDistributionBasedOn: 1,
                                ChargeType: "1",
                                ChargeValue: "",
                                ChargeValueType: "1",
                                MakerCharge: "",
                                TakerCharge: "",
                                Status: 0,
                                MarkupType: "1",
                                MarkupValue: ""
                            },
                            errors: {}
                        });
                        //list action call
                        this.props.getFeeConfigurationList({
                            MasterId: this.state.addRecord.FeeConfigurationMasterID
                        });
                    }.bind(this),
                    1000
                );
            } else if (nextProps.addDetails.ReturnCode !== 0) {
                NotificationManager.error(intl.formatMessage({ id: `apiWalletErrCode.${nextProps.addDetails.ErrorCode}` }));
            }
        }
        // validate success for update
        if (nextProps.updateDetails.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.updateDetails.ReturnCode === 0) {
                //success
                NotificationManager.success(intl.formatMessage({ id: "common.form.edit.success" }));
                this.props.drawerClose();
                setTimeout(
                    function () {
                        this.setState({
                            errors: {},
                            addRecord: {
                                ChargeConfigDetailId: "",
                                FeeConfigurationMasterID: nextProps.MasterId,
                                ChargeDistributionBasedOn: 1,
                                ChargeType: "1",
                                ChargeValue: "",
                                ChargeValueType: "1",
                                MakerCharge: "",
                                TakerCharge: "",
                                Status: 0,
                                MarkupType: "1",
                                MarkupValue: ""
                            },
                        });
                        //list api call
                        this.props.getFeeConfigurationList({
                            MasterId: this.state.addRecord.FeeConfigurationMasterID
                        });

                    }.bind(this),
                    1000
                );
            } else if (nextProps.updateDetails.ReturnCode !== 0) {
                NotificationManager.error(intl.formatMessage({ id: `apiWalletErrCode.${nextProps.updateDetails.ErrorCode}` }));
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
                ChargeConfigDetailId: "",
                FeeConfigurationMasterID: this.props.MasterId,
                ChargeDistributionBasedOn: 1,
                ChargeType: "1",
                ChargeValue: "",
                ChargeValueType: "1",
                MakerCharge: "",
                TakerCharge: "",
                Status: 0,
                MarkupType: "1",
                MarkupValue: "",
            },
        });
    };
    // numberic value only
    validateOnlyNumeric(value) {
        const regexNumeric = /^[0-9.]+$/;
        return (validator.matches(value, regexNumeric) && validator.isDecimal(value, { force_decimal: false, decimal_digits: "0,8" })) ? true : false;
    }
    //handle input form
    onChangeAddText(key, value) {
        if (this.validateOnlyNumeric(value) || value == "") {
            this.setState({
                addRecord: {
                    ...this.state.addRecord,
                    [key]: value
                }
            });
        }
    }
    //handle change radio
    handleChange = (e, key) => {
        if (key == "ChargeValueType") {
            this.setState({
                addRecord: {
                    ...this.state.addRecord,
                    ChargeValueType:
                        this.state.addRecord.ChargeValueType === "1" ? "2" : "1"
                }
            });
        }
        if (key == "ChargeType") {
            this.setState({
                addRecord: {
                    ...this.state.addRecord,
                    ChargeType: this.state.addRecord.ChargeType === "1" ? "2" : "1"
                }
            });
        }
        if (key == "MarkupType") {
            this.setState({
                addRecord: {
                    ...this.state.addRecord,
                    MarkupType: this.state.addRecord.MarkupType === "1" ? "2" : "1"
                }
            });
        }
    };
    //handle switch
    handleCheckChange = name => (event, checked) => {
        this.setState({ [name]: checked });
        this.setState({
            addRecord: {
                ...this.state.addRecord,
                Status: this.state.addRecord.Status === 1 ? 0 : 1
            }
        });
    };
    // submit new record for charge configuration Details
    onSubmitaddFeeConfigForm() {
        const { errors, isValid } = validateArbitrageFeeConfigurationForm(this.state);
        this.setState({ errors: errors, Flag: true });
        if (isValid) {
            const { addRecord } = this.state;
            delete addRecord.ChargeConfigDetailId;
            this.props.addFeeConfigurationList(addRecord);
        }
    }
    //Update Charge Configuration Details record
    onUpdateChargeConfiguration() {
        //validate form here
        const { errors, isValid } = validateArbitrageFeeConfigurationForm(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addRecord } = this.state;
            this.props.updateFeeConfigurationList(addRecord);
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
                        response = fieldList;
                    }
                }
            }
        }
        return response;
    }
    render() {
        var menuDetail = this.checkAndGetMenuAccessDetail((this.props.Form) ? '1550242F-3C36-8153-999D-D415365B5700' : '24DC250B-A773-3FF0-5B86-8381F6906D59');
        const { errors, addRecord } = this.state;
        const { Form } = this.props;
        const intl = this.props.intl;
        return (
            <div className="jbs-page-content">
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <form>
                    <div className="page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            {Form ? (
                                <h2>
                                    <span>
                                        {intl.formatMessage({
                                            id: "lable.EditArbitrageFeeConfiguration"
                                        })}
                                    </span>
                                </h2>
                            ) : (
                                    <h2>
                                        <span>
                                            {intl.formatMessage({
                                                id: "lable.AddArbitrageFeeConfiguration"
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
                    <div className="row">
                        <div className="col-sm-12 ">
                            {(Form ? (menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"] && menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].Visibility === "E925F86B") : (menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"] && menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].Visibility === "E925F86B")) &&
                                //10FD1178-1E8A-93FE-4B5E-F0F53F4164B5  add 2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90
                                <FormGroup row >
                                    <Label className="control-label col" >
                                        {intl.formatMessage({ id: "lable.ChargeType" })}
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12 cstm_rdo_btn">
                                        <RadioGroup
                                            row
                                            aria-label="ChargeType"
                                            name="ChargeType"
                                            value={
                                                addRecord.ChargeType
                                            }
                                            onChange={e => this.handleChange(e, "ChargeType")}
                                        >
                                            <FormControlLabel
                                                value="2"
                                                control={<Radio />}
                                                label={intl.formatMessage({ id: "lable.Percentage" })}
                                                disabled={(Form ? ((menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].AccessRight === "11E6E7B0") ? true : false))}
                                            />
                                            <FormControlLabel
                                                disabled={(Form ? ((menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].AccessRight === "11E6E7B0") ? true : false))}
                                                value="1"
                                                control={<Radio />}
                                                label={intl.formatMessage({ id: "lable.Fixed" })}
                                            />
                                        </RadioGroup>
                                    </div>
                                </FormGroup>
                            }
                            {(Form ? (menuDetail["BFDD9CA7-82A9-6321-358F-5E8592664009"] && menuDetail["BFDD9CA7-82A9-6321-358F-5E8592664009"].Visibility === "E925F86B") : (menuDetail["6DBDD249-783C-0388-3197-52B236D37374"] && menuDetail["6DBDD249-783C-0388-3197-52B236D37374"].Visibility === "E925F86B")) &&
                                // BFDD9CA7-82A9-6321-358F-5E8592664009  add 6DBDD249-783C-0388-3197-52B236D37374
                                <FormGroup row>
                                    <Label className="control-label col">
                                        {intl.formatMessage({ id: "lable.ChargeValue" })} <span className="text-danger">*</span>
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(Form ? ((menuDetail["BFDD9CA7-82A9-6321-358F-5E8592664009"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["6DBDD249-783C-0388-3197-52B236D37374"].AccessRight === "11E6E7B0") ? true : false))}
                                            type="text"
                                            name="ChargeValue"
                                            placeholder={intl.formatMessage({ id: "lable.enter" })}
                                            className="form-control"
                                            id="ChargeValue"
                                            maxLength="10"
                                            value={
                                                addRecord.ChargeValue
                                            }
                                            onChange={e =>
                                                this.onChangeAddText("ChargeValue", e.target.value)
                                            }
                                        />
                                    </div>
                                    {errors.ChargeValue && (
                                        <span className="text-danger">
                                            {intl.formatMessage({ id: errors.ChargeValue })}
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(Form ? (menuDetail["552F92E9-171A-0208-5E1B-F777419F76DF"] && menuDetail["552F92E9-171A-0208-5E1B-F777419F76DF"].Visibility === "E925F86B") : (menuDetail["27DFA483-A761-3849-5A7B-818C4AF96ACA"] && menuDetail["27DFA483-A761-3849-5A7B-818C4AF96ACA"].Visibility === "E925F86B")) &&
                                // 552F92E9-171A-0208-5E1B-F777419F76DF  add 27DFA483-A761-3849-5A7B-818C4AF96ACA
                                <FormGroup row>
                                    <Label className="control-label col">
                                        {intl.formatMessage({ id: "lable.MakerCharge" })}  <span className="text-danger">*</span>
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(Form ? ((menuDetail["552F92E9-171A-0208-5E1B-F777419F76DF"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["27DFA483-A761-3849-5A7B-818C4AF96ACA"].AccessRight === "11E6E7B0") ? true : false))}
                                            type="text"
                                            name="MakerCharge"
                                            placeholder={intl.formatMessage({ id: "lable.enter" })}
                                            className="form-control"
                                            id="MakerCharge"
                                            maxLength="10"
                                            value={
                                                addRecord.MakerCharge
                                            }
                                            onChange={e =>
                                                this.onChangeAddText("MakerCharge", e.target.value)
                                            }
                                        />
                                    </div>
                                    {errors.MakerCharge && (
                                        <span className="text-danger">
                                            {intl.formatMessage({ id: errors.MakerCharge })}
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(Form ? (menuDetail["09333EDE-A325-84FC-76A4-9E8CCCD22A65"] && menuDetail["09333EDE-A325-84FC-76A4-9E8CCCD22A65"].Visibility === "E925F86B") : (menuDetail["32A25458-4614-6EB4-1EF1-4F5A03477D8C"] && menuDetail["32A25458-4614-6EB4-1EF1-4F5A03477D8C"].Visibility === "E925F86B")) &&
                                // 09333EDE-A325-84FC-76A4-9E8CCCD22A65  add 32A25458-4614-6EB4-1EF1-4F5A03477D8C
                                <FormGroup row>
                                    <Label className="control-label col">
                                        {intl.formatMessage({ id: "lable.TakerCharge" })} <span className="text-danger">*</span>
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(Form ? ((menuDetail["09333EDE-A325-84FC-76A4-9E8CCCD22A65"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["32A25458-4614-6EB4-1EF1-4F5A03477D8C"].AccessRight === "11E6E7B0") ? true : false))}
                                            type="text"
                                            name="TakerCharge"
                                            placeholder={intl.formatMessage({ id: "lable.enter" })}
                                            className="form-control"
                                            id="TakerCharge"
                                            maxLength="10"
                                            value={
                                                addRecord.TakerCharge
                                            }
                                            onChange={e =>
                                                this.onChangeAddText("TakerCharge", e.target.value)
                                            }
                                        />
                                    </div>
                                    {errors.TakerCharge && (
                                        <span className="text-danger">
                                            {intl.formatMessage({ id: errors.TakerCharge })}
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(Form ? (menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"] && menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].Visibility === "E925F86B") : (menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"] && menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].Visibility === "E925F86B")) &&
                                //10FD1178-1E8A-93FE-4B5E-F0F53F4164B5  add 2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90
                                <FormGroup row>
                                    <Label className="control-label col">
                                        {intl.formatMessage({ id: "lable.MarkupType" })}
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <RadioGroup
                                            row
                                            aria-label="MarkupType"
                                            name="MarkupType"
                                            value={
                                                addRecord.MarkupType
                                            }
                                            onChange={e => this.handleChange(e, "MarkupType")}
                                        >
                                            <FormControlLabel
                                                value="2"
                                                control={<Radio />}
                                                label={intl.formatMessage({ id: "lable.Percentage" })}
                                                disabled={(Form ? ((menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].AccessRight === "11E6E7B0") ? true : false))}
                                            />
                                            <FormControlLabel
                                                disabled={(Form ? ((menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].AccessRight === "11E6E7B0") ? true : false))}
                                                value="1"
                                                control={<Radio />}
                                                label={intl.formatMessage({ id: "lable.Fixed" })}
                                            />
                                        </RadioGroup>
                                    </div>
                                </FormGroup>
                            }
                            {(Form ? (menuDetail["BFDD9CA7-82A9-6321-358F-5E8592664009"] && menuDetail["BFDD9CA7-82A9-6321-358F-5E8592664009"].Visibility === "E925F86B") : (menuDetail["6DBDD249-783C-0388-3197-52B236D37374"] && menuDetail["6DBDD249-783C-0388-3197-52B236D37374"].Visibility === "E925F86B")) &&
                                // BFDD9CA7-82A9-6321-358F-5E8592664009  add 6DBDD249-783C-0388-3197-52B236D37374
                                <FormGroup row>
                                    <Label className="control-label col">
                                        {intl.formatMessage({ id: "lable.MarkupValue" })} <span className="text-danger">*</span>
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Input
                                            disabled={(Form ? ((menuDetail["BFDD9CA7-82A9-6321-358F-5E8592664009"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["6DBDD249-783C-0388-3197-52B236D37374"].AccessRight === "11E6E7B0") ? true : false))}
                                            type="text"
                                            name="MarkupValue"
                                            placeholder={intl.formatMessage({ id: "lable.enter" })}
                                            className="form-control"
                                            id="MarkupValue"
                                            maxLength="10"
                                            value={
                                                addRecord.MarkupValue
                                            }
                                            onChange={e =>
                                                this.onChangeAddText("MarkupValue", e.target.value)
                                            }
                                        />
                                    </div>
                                    {errors.MarkupValue && (
                                        <span className="text-danger">
                                            {intl.formatMessage({ id: errors.MarkupValue })}
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {(Form ? (menuDetail["DE853D3D-5A6F-734D-733E-8F0F70E092E6"] && menuDetail["DE853D3D-5A6F-734D-733E-8F0F70E092E6"].Visibility === "E925F86B") : (menuDetail["EA225D64-8A14-75FF-6DC1-4CF077380E5F"] && menuDetail["EA225D64-8A14-75FF-6DC1-4CF077380E5F"].Visibility === "E925F86B")) &&
                                // DE853D3D-5A6F-734D-733E-8F0F70E092E6  add EA225D64-8A14-75FF-6DC1-4CF077380E5F
                                <FormGroup row>
                                    <Label className="control-label col">
                                        {intl.formatMessage({
                                            id: "sidebar.Status"
                                        })}
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                        <Switch
                                            enabled={(Form ? ((menuDetail["DE853D3D-5A6F-734D-733E-8F0F70E092E6"].AccessRight === "11E6E7B0") ? false : true) : ((menuDetail["EA225D64-8A14-75FF-6DC1-4CF077380E5F"].AccessRight === "11E6E7B0") ? false : true))}
                                            onClick={this.handleCheckChange()}
                                            on={
                                                addRecord.Status === 1
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </div>
                                </FormGroup>
                            }

                            {Object.keys(menuDetail).length > 0 && Form ? (
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
                                                onClick={e => this.onSubmitaddFeeConfigForm()}
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
                        </div>
                    </div>
                </form>
                {this.props.loading && <JbsSectionLoader />}
            </div>
        );
    }
}
ArbitrageFeeConfigurationForm.defaultProps = {
    Form: false
};

//map method
const mapStateToProps = ({ FeeConfigurationReducer, walletUsagePolicy, authTokenRdcer }) => {
    const {
        Details,
        addDetails,
        getDetails,
        updateDetails,
        loading
    } = FeeConfigurationReducer;
    const { walletType } = walletUsagePolicy;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        Details,
        addDetails,
        getDetails,
        updateDetails,
        loading,
        walletType,
        menuLoading,
        menu_rights
    };
};
export default connect(
    mapStateToProps,
    {
        addFeeConfigurationList,
        getWalletType,
        updateFeeConfigurationList,
        getFeeConfigurationList,
        getMenuPermissionByID
    }
)(injectIntl(ArbitrageFeeConfigurationForm));
