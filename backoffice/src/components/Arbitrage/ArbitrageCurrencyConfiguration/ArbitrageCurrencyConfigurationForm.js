/**
 *   Developer : Parth Andhariya
 *   Date: 20-03-2019
 *   Component:  Charge Configuration Detail Form
 */
import React, { Component, Fragment } from "react";
import Switch from "react-toggle-switch";
import { Alert } from "reactstrap";
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
import validateFormChargeConfiguration from "Validations/ChargeConfigurationValidation/DetailsFormValidation";
import {
    addChargeConfigurationList,
    updateChargeConfigurationList,
    getChargeConfigurationList
} from "Actions/ChargeConfigurationAction";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";
//validation file for form
//button style
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};

class ArbitrageCurrencyConfigurationForm extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            addRecord: {
                ChargeConfigDetailId: "",
                ChargeConfigurationMasterID: props.MasterId,
                ChargeDistributionBasedOn: 1,
                ChargeType: "1",
                DeductionWalletTypeId: "",
                ChargeValue: "",
                ChargeValueType: "1",
                MakerCharge: "",
                TakerCharge: "",
                MinAmount: "",
                MaxAmount: "",
                Remarks: "",
                Status: "0"
            },
            notificationFlag: false,
            Flag: false,
            menudetail: [],
            notification: true,
            // fieldList:{},
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
                ChargeConfigurationMasterID: nextProps.MasterId,
                DeductionWalletTypeId: nextProps.walletTypeId
            }
        })
        if (
            nextProps.getDetails.ReturnCode === 0 &&
            nextProps.Form
        ) {
            this.setState({
                addRecord: {
                    ChargeConfigDetailId: nextProps.getDetails.Details.ChargeConfigDetailId,
                    ChargeConfigurationMasterID: nextProps.getDetails.Details.ChargeConfigurationMasterID,
                    ChargeDistributionBasedOn: nextProps.getDetails.Details.ChargeDistributionBasedOn,
                    ChargeType: nextProps.getDetails.Details.ChargeType.toString(),
                    DeductionWalletTypeId: nextProps.getDetails.Details.DeductionWalletTypeId,
                    ChargeValue: nextProps.getDetails.Details.ChargeValue,
                    ChargeValueType: nextProps.getDetails.Details.ChargeValueType.toString(),
                    MakerCharge: nextProps.getDetails.Details.MakerCharge,
                    TakerCharge: nextProps.getDetails.Details.TakerCharge,
                    MinAmount: nextProps.getDetails.Details.MinAmount,
                    MaxAmount: nextProps.getDetails.Details.MaxAmount,
                    Remarks: nextProps.getDetails.Details.Remarks,
                    Status: nextProps.getDetails.Details.Status
                },
            });
        }
        // validate success foe addRecord
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
                                ChargeConfigurationMasterID: this.props.MasterId,
                                ChargeDistributionBasedOn: 1,
                                ChargeType: "1",
                                DeductionWalletTypeId: this.props.walletTypeId,
                                ChargeValue: "",
                                ChargeValueType: "1",
                                MakerCharge: "",
                                TakerCharge: "",
                                MinAmount: "",
                                MaxAmount: "",
                                Remarks: "",
                                Status: 0
                            },
                            errors: {}
                        });
                        //list action call
                        this.props.getChargeConfigurationList({
                            MasterId: this.state.addRecord.ChargeConfigurationMasterID
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
                                ChargeConfigurationMasterID: nextProps.MasterId,
                                ChargeDistributionBasedOn: 1,
                                ChargeType: "1",
                                DeductionWalletTypeId: this.props.walletTypeId,
                                ChargeValue: "",
                                ChargeValueType: "1",
                                MakerCharge: "",
                                TakerCharge: "",
                                MinAmount: "",
                                MaxAmount: "",
                                Remarks: "",
                                Status: 0
                            },
                        });
                        //list api call
                        this.props.getChargeConfigurationList({
                            MasterId: this.state.addRecord.ChargeConfigurationMasterID
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
                ChargeConfigurationMasterID: this.props.MasterId,
                ChargeDistributionBasedOn: 1,
                ChargeType: "1",
                DeductionWalletTypeId: this.props.walletTypeId,
                ChargeValue: "",
                ChargeValueType: "1",
                MakerCharge: "",
                TakerCharge: "",
                MinAmount: "",
                MaxAmount: "",
                Remarks: "",
                Status: 0
            },
        });
    };
    // numberic value only
    validateOnlyNumeric(value) {
        const regexNumeric = /^[0-9.]+$/;
        if (
            validator.matches(value, regexNumeric) &&
            validator.isDecimal(value, {
                force_decimal: false,
                decimal_digits: "0,8"
            })
        ) {
            return true;
        } else {
            return false;
        }
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
        if (key == "Remarks") {
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
    onSubmitaddChargeConfigForm() {
        const { errors, isValid } = validateFormChargeConfiguration(this.state);
        this.setState({ errors: errors, Flag: true });
        if (isValid) {
            const { addRecord } = this.state;
            delete addRecord.ChargeConfigDetailId;
            this.props.addChargeConfigurationList(addRecord);
            this.props.loading && <JbsSectionLoader />;
        }
    }
    //Update Charge Configuration Details record
    onUpdateChargeConfiguration() {
        //validate form here
        const { errors, isValid } = validateFormChargeConfiguration(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            const { addRecord } = this.state;
            this.props.updateChargeConfigurationList(addRecord);
            this.setState({ notificationFlag: true });
            this.props.loading && <JbsSectionLoader />;
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
        var menuDetail = this.checkAndGetMenuAccessDetail((this.props.Form) ? '1550242F-3C36-8153-999D-D415365B5700' : '24DC250B-A773-3FF0-5B86-8381F6906D59');
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
                    <div className="row">
                        <div className="col-sm-12 ">
                            {(Form ? (menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"] && menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].Visibility === "E925F86B") : (menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"] && menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].Visibility === "E925F86B")) &&
                                //10FD1178-1E8A-93FE-4B5E-F0F53F4164B5  add 2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90
                                <FormGroup >
                                    <Label className="control-label col">
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
                                                label={intl.formatMessage({ id: "lable.Recurring" })}
                                                disabled={(Form ? ((menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].AccessRight === "11E6E7B0") ? true : false))}
                                            />
                                            <FormControlLabel
                                                disabled={(Form ? ((menuDetail["10FD1178-1E8A-93FE-4B5E-F0F53F4164B5"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["2A43BA3E-7AF4-0A46-0A43-D21AF1D22D90"].AccessRight === "11E6E7B0") ? true : false))}
                                                value="1"
                                                control={<Radio />}
                                                label={intl.formatMessage({ id: "lable.Regular" })}
                                            />
                                        </RadioGroup>
                                    </div>
                                </FormGroup>
                            }
                            <div className="d-flex">
                                {this.props.menuLoading && <JbsSectionLoader />}
                                {(Form ? (menuDetail["E2ECC8DF-3931-08EC-6D82-4F69962215BD"] && menuDetail["E2ECC8DF-3931-08EC-6D82-4F69962215BD"].Visibility === "E925F86B") : (menuDetail["7CEE3A2E-4EFD-6681-6FA9-3201795F80EC"] && menuDetail["7CEE3A2E-4EFD-6681-6FA9-3201795F80EC"].Visibility === "E925F86B")) &&
                                    // E2ECC8DF-3931-08EC-6D82-4F69962215BD add 7CEE3A2E-4EFD-6681-6FA9-3201795F80EC
                                    <FormGroup className="col-sm-6">
                                        <Label className="col-form-label">
                                            {intl.formatMessage({
                                                id: "lable.WalletTypeName"
                                            })}
                                        </Label>
                                        <Input
                                            disabled={(Form ? ((menuDetail["E2ECC8DF-3931-08EC-6D82-4F69962215BD"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["7CEE3A2E-4EFD-6681-6FA9-3201795F80EC"].AccessRight === "11E6E7B0") ? true : false))}
                                            type="select"
                                            name="DeductionWalletTypeId"
                                            className="form-control"
                                            id="DeductionWalletTypeId"
                                            // disabled
                                            value={
                                                addRecord.DeductionWalletTypeId
                                            }
                                            onChange={e =>
                                                this.onChangeAddText("DeductionWalletTypeId", e.target.value)
                                            }
                                        >
                                            <option value="">
                                                {intl.formatMessage({
                                                    id: "wallet.errCurrency"
                                                })}
                                            </option>
                                            {this.props.walletType.length &&
                                                this.props.walletType.map((list, index) => (
                                                    <option key={index} value={list.ID}>
                                                        {list.TypeName}
                                                    </option>
                                                ))}
                                        </Input>
                                        {errors.DeductionWalletTypeId && (
                                            <span className="text-danger">
                                                {intl.formatMessage({ id: errors.DeductionWalletTypeId })}
                                            </span>
                                        )}
                                    </FormGroup>
                                }
                                {(Form ? (menuDetail["BFDD9CA7-82A9-6321-358F-5E8592664009"] && menuDetail["BFDD9CA7-82A9-6321-358F-5E8592664009"].Visibility === "E925F86B") : (menuDetail["6DBDD249-783C-0388-3197-52B236D37374"] && menuDetail["6DBDD249-783C-0388-3197-52B236D37374"].Visibility === "E925F86B")) &&
                                    // BFDD9CA7-82A9-6321-358F-5E8592664009  add 6DBDD249-783C-0388-3197-52B236D37374
                                    <FormGroup className="col-sm-6">
                                        <Label className="d-inline col-form-label">
                                            {intl.formatMessage({ id: "lable.ChargeValue" })} <span className="text-danger">*</span>
                                        </Label>
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
                                        {errors.ChargeValue && (
                                            <span className="text-danger">
                                                {intl.formatMessage({ id: errors.ChargeValue })}
                                            </span>
                                        )}
                                    </FormGroup>
                                }
                            </div>
                            {(Form ? (menuDetail["F2929CD2-84D2-8059-9CAD-8423EF5429AB"] && menuDetail["F2929CD2-84D2-8059-9CAD-8423EF5429AB"].Visibility === "E925F86B") : (menuDetail["B5ADDEF4-6924-8294-91CB-1561C7650FA3"] && menuDetail["B5ADDEF4-6924-8294-91CB-1561C7650FA3"].Visibility === "E925F86B")) &&
                                // F2929CD2-84D2-8059-9CAD-8423EF5429AB  add B5ADDEF4-6924-8294-91CB-1561C7650FA3
                                <FormGroup >
                                    <Label className="control-label col">
                                        {intl.formatMessage({ id: "lable.ChargeValueType" })}
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12 cstm_rdo_btn">
                                        <RadioGroup
                                            row
                                            aria-label="ChargeValueType"
                                            name="ChargeValueType"
                                            value={
                                                addRecord.ChargeValueType
                                            }
                                            onChange={e => this.handleChange(e, "ChargeValueType")}
                                        >
                                            <FormControlLabel
                                                value="2"
                                                control={<Radio />}
                                                label={intl.formatMessage({ id: "lable.Percentage" })}
                                                disabled={(Form ? ((menuDetail["F2929CD2-84D2-8059-9CAD-8423EF5429AB"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["B5ADDEF4-6924-8294-91CB-1561C7650FA3"].AccessRight === "11E6E7B0") ? true : false))}
                                            />
                                            <FormControlLabel
                                                value="1"
                                                control={<Radio />}
                                                label={intl.formatMessage({ id: "lable.Fixed" })}
                                                disabled={(Form ? ((menuDetail["F2929CD2-84D2-8059-9CAD-8423EF5429AB"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["B5ADDEF4-6924-8294-91CB-1561C7650FA3"].AccessRight === "11E6E7B0") ? true : false))}
                                            />
                                        </RadioGroup>
                                    </div>
                                </FormGroup>
                            }
                            <div className="d-flex">
                                {(Form ? (menuDetail["552F92E9-171A-0208-5E1B-F777419F76DF"] && menuDetail["552F92E9-171A-0208-5E1B-F777419F76DF"].Visibility === "E925F86B") : (menuDetail["27DFA483-A761-3849-5A7B-818C4AF96ACA"] && menuDetail["27DFA483-A761-3849-5A7B-818C4AF96ACA"].Visibility === "E925F86B")) &&
                                    // 552F92E9-171A-0208-5E1B-F777419F76DF  add 27DFA483-A761-3849-5A7B-818C4AF96ACA
                                    <FormGroup className="col-sm-6">
                                        <Label className="d-inline col-form-label">
                                            {intl.formatMessage({ id: "lable.MakerCharge" })}  <span className="text-danger">*</span>
                                        </Label>
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
                                        {errors.MakerCharge && (
                                            <span className="text-danger">
                                                {intl.formatMessage({ id: errors.MakerCharge })}
                                            </span>
                                        )}
                                    </FormGroup>
                                }
                                {(Form ? (menuDetail["09333EDE-A325-84FC-76A4-9E8CCCD22A65"] && menuDetail["09333EDE-A325-84FC-76A4-9E8CCCD22A65"].Visibility === "E925F86B") : (menuDetail["32A25458-4614-6EB4-1EF1-4F5A03477D8C"] && menuDetail["32A25458-4614-6EB4-1EF1-4F5A03477D8C"].Visibility === "E925F86B")) &&
                                    // 09333EDE-A325-84FC-76A4-9E8CCCD22A65  add 32A25458-4614-6EB4-1EF1-4F5A03477D8C
                                    <FormGroup className="col-sm-6">
                                        <Label className="d-inline col-form-label">
                                            {intl.formatMessage({ id: "lable.TakerCharge" })} <span className="text-danger">*</span>
                                        </Label>
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
                                        {errors.TakerCharge && (
                                            <span className="text-danger">
                                                {intl.formatMessage({ id: errors.TakerCharge })}
                                            </span>
                                        )}
                                    </FormGroup>
                                }
                            </div>
                            <div className="d-flex">
                                {(Form ? (menuDetail["37414DE2-86A3-9558-34B4-066833CF6246"] && menuDetail["37414DE2-86A3-9558-34B4-066833CF6246"].Visibility === "E925F86B") : (menuDetail["F239AA62-181A-1133-00D9-5328170FA435"] && menuDetail["F239AA62-181A-1133-00D9-5328170FA435"].Visibility === "E925F86B")) &&
                                    //37414DE2-86A3-9558-34B4-066833CF6246  add F239AA62-181A-1133-00D9-5328170FA435
                                    <FormGroup className="col-sm-6">
                                        <Label className="d-inline col-form-label">
                                            {intl.formatMessage({ id: "lable.MinAmount" })} <span className="text-danger">*</span>
                                        </Label>

                                        <Input
                                            disabled={(Form ? ((menuDetail["37414DE2-86A3-9558-34B4-066833CF6246"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["F239AA62-181A-1133-00D9-5328170FA435"].AccessRight === "11E6E7B0") ? true : false))}
                                            type="text"
                                            name="MinAmount"
                                            placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                            className="form-control"
                                            id="MinAmount"
                                            maxLength="10"
                                            value={
                                                addRecord.MinAmount
                                            }
                                            onChange={e =>
                                                this.onChangeAddText("MinAmount", e.target.value)
                                            }
                                        />
                                        {errors.MinAmount && (
                                            <span className="text-danger">
                                                {intl.formatMessage({ id: errors.MinAmount })}
                                            </span>
                                        )}
                                    </FormGroup>
                                }
                                {(Form ? (menuDetail["73FD09DB-8881-2E01-1932-3A622E7D5332"] && menuDetail["73FD09DB-8881-2E01-1932-3A622E7D5332"].Visibility === "E925F86B") : (menuDetail["16F7C432-12E4-0C6B-8856-9F70D1328FB6"] && menuDetail["16F7C432-12E4-0C6B-8856-9F70D1328FB6"].Visibility === "E925F86B")) &&
                                    //73FD09DB-8881-2E01-1932-3A622E7D5332  add 16F7C432-12E4-0C6B-8856-9F70D1328FB6
                                    <FormGroup className="col-sm-6">
                                        <Label className="d-inline col-form-label">
                                            {intl.formatMessage({ id: "lable.MaxAmount" })} <span className="text-danger">*</span>
                                        </Label>

                                        <Input
                                            disabled={(Form ? ((menuDetail["73FD09DB-8881-2E01-1932-3A622E7D5332"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["16F7C432-12E4-0C6B-8856-9F70D1328FB6"].AccessRight === "11E6E7B0") ? true : false))}
                                            type="text"
                                            name="MaxAmount"
                                            placeholder={intl.formatMessage({ id: "lable.minmaxmassage" })}
                                            className="form-control"
                                            id="MaxAmount"
                                            maxLength="10"
                                            value={
                                                addRecord.MaxAmount
                                            }
                                            onChange={e =>
                                                this.onChangeAddText("MaxAmount", e.target.value)
                                            }
                                        />
                                        {errors.MaxAmount && (
                                            <span className="text-danger">
                                                {intl.formatMessage({ id: errors.MaxAmount })}
                                            </span>
                                        )}
                                    </FormGroup>
                                }
                            </div>
                            {(Form ? (menuDetail["DE853D3D-5A6F-734D-733E-8F0F70E092E6"] && menuDetail["DE853D3D-5A6F-734D-733E-8F0F70E092E6"].Visibility === "E925F86B") : (menuDetail["EA225D64-8A14-75FF-6DC1-4CF077380E5F"] && menuDetail["EA225D64-8A14-75FF-6DC1-4CF077380E5F"].Visibility === "E925F86B")) &&
                                // DE853D3D-5A6F-734D-733E-8F0F70E092E6  add EA225D64-8A14-75FF-6DC1-4CF077380E5F
                                <div className="form-group">
                                    <Label className="col-md-4 col-form-label">
                                        {intl.formatMessage({
                                            id: "sidebar.Status"
                                        })}
                                    </Label>
                                    <div className="col-md-8 py-5">
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
                                </div>
                            }
                            {(Form ? (menuDetail["D46E2278-5178-1F2E-4537-AEB0D5C0824D"] && menuDetail["D46E2278-5178-1F2E-4537-AEB0D5C0824D"].Visibility === "E925F86B") : (menuDetail["368C1816-A634-0D6B-325F-4FA7E3F832A8"] && menuDetail["368C1816-A634-0D6B-325F-4FA7E3F832A8"].Visibility === "E925F86B")) &&
                                //D46E2278-5178-1F2E-4537-AEB0D5C0824D  add 368C1816-A634-0D6B-325F-4FA7E3F832A8
                                <FormGroup className="col-sm-12">
                                    <Label className="d-inline col-form-label">
                                        {intl.formatMessage({ id: "sidebar.remark" })} <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(Form ? ((menuDetail["D46E2278-5178-1F2E-4537-AEB0D5C0824D"].AccessRight === "11E6E7B0") ? true : false) : ((menuDetail["368C1816-A634-0D6B-325F-4FA7E3F832A8"].AccessRight === "11E6E7B0") ? true : false))}
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
                                </FormGroup>
                            }
                        </div>
                    </div>

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
                {this.props.loading && <JbsSectionLoader />}
            </div>
        );
    }
}
ArbitrageCurrencyConfigurationForm.defaultProps = {
    Form: false
};

//map method
const mapStateToProps = ({ ChargeConfiguration, walletUsagePolicy, authTokenRdcer }) => {
    const {
        Details,
        addDetails,
        getDetails,
        updateDetails,
        loading
    } = ChargeConfiguration;
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
        addChargeConfigurationList,
        getWalletType,
        updateChargeConfigurationList,
        getChargeConfigurationList,
        getMenuPermissionByID
    }
)(injectIntl(ArbitrageCurrencyConfigurationForm));
