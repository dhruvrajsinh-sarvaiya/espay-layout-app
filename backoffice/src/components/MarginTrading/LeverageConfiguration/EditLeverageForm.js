/* 
    Developer : Vishva shah
    Date : 18-02-2019
    File Comment : Add & Edit LeverageConfig Form
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import validator from "validator";
import Button from '@material-ui/core/Button';
import { FormGroup, Label, Input, Alert, Row, Col,Form } from "reactstrap";
import { injectIntl } from 'react-intl';
import Switch from 'react-toggle-switch';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import {
    getListLeverage,
    insertUpdateLeverage
} from "Actions/MarginTrading/LeverageConfiguration";
import { NotificationManager } from "react-notifications";
import {
    getWalletType
} from "Actions/WalletUsagePolicy";
import LeverageConfigtValidator from "Validations/MarginTrading/LeverageConfig/LeverageConfigValidation";
//Action methods..
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
    Id: 0,
    WalletTypeId: "",
    LeveragePer: '',
    Status: 0,
    IsAutoApprove: 0,
    SafetyMarginPer: "",
    MarginChargePer: "",
    LeverageChargeDeductionType: "",
    errors: {},
    showError: false,
    showSuccess: false,
    responseMessage: "",
    flag: false,
    errorsleverage: false,
    menudetail: [],
    notificationFlag: true,
}

class EditLeverageForm extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        // this.state = initialState;
        this.state = {
            Id: props.pagedata.Id,
            WalletTypeId: props.pagedata.WalletTypeId,
            LeveragePer: props.pagedata.LeveragePer,
            Status: props.pagedata.Status,
            IsAutoApprove: props.pagedata.IsAutoApprove,
            SafetyMarginPer: props.pagedata.SafetyMarginPer,
            MarginChargePer: props.pagedata.MarginChargePer,
            LeverageChargeDeductionType: props.pagedata.LeverageChargeDeductionType,
            errors: {},
            showError: false,
            showSuccess: false,
            responseMessage: "",
            flag: false,
            //added by parth andhariya 
            fieldList: {},
            menudetail: [],
            notificationFlag: true,
        };
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('BEA68939-55E6-4C3A-8A4B-6FB272FE9F9A'); // get wallet menu permission
        // code added by parth andhariya for handle and check menu detail and store (18-4-2019)
        // var fieldList = {};
        // if (this.props.menuDetail.Fields && this.props.menuDetail.Fields.length) {
        //     this.props.menuDetail.Fields.forEach(function (item) {
        //         fieldList[item.GUID] = item;
        //     });
        //     this.setState({
        //         fieldList: fieldList
        //     });
        // }
        // code end
    }
    //validate reponse on status change 
    componentWillReceiveProps(nextProps) {
        // on edit set data...
        if (nextProps.pagedata.hasOwnProperty('Id')) {
            this.setState({
                Id: nextProps.pagedata.Id,
                WalletTypeId: nextProps.pagedata.WalletTypeId,
                LeveragePer: nextProps.pagedata.LeveragePer,
                Status: nextProps.pagedata.Status,
                IsAutoApprove: nextProps.pagedata.IsAutoApprove,
                SafetyMarginPer: nextProps.pagedata.SafetyMarginPer,
                MarginChargePer: nextProps.pagedata.MarginChargePer,
                LeverageChargeDeductionType: nextProps.pagedata.LeverageChargeDeductionType,
            });
        }
        // validate insert & update response 
        if (nextProps.insertUpdateResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.insertUpdateResponse.ReturnCode == 0) {
                NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
                this.setState({ initialState });
                this.props.drawerClose();
                this.props.getListLeverage({});

            } else if (nextProps.insertUpdateResponse.ReturnCode !== 0 && this.state.flag) {     //failed
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.insertUpdateResponse.ErrorCode}`} />);
                this.setState({ flag: false });
            }
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }
    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
        this.setState({ initialState });
    };
    //handle cancel 
    handleCancel() {
        this.props.drawerClose();
        this.setState({ initialState });
    }
    // submit action handler...
    handleSubmit() {
        const { errors, isValid } = LeverageConfigtValidator(this.state);
        this.setState({ errors: errors });
        if (isValid && !this.state.errorsleverage) {
            this.setState({ flag: true });
            this.props.insertUpdateLeverage(this.state);
        }
    }
    // on change handler
    handleChange(e) {
        if (e.target.name === 'LeveragePer' || e.target.name === 'SafetyMarginPer' || e.target.name === 'MarginChargePer') {
            if (validator.isDecimal(e.target.value, { force_decimal: false, decimal_digits: '0,8' }) || e.target.value == "") {
                this.setState({ [e.target.name]: e.target.value });
            }
        } else if (e.target.name === 'WalletTypeId' || e.target.name === 'LeverageChargeDeductionType') {
            this.setState({ [e.target.name]: e.target.value });
        }
    }
    // on blur safety validation
    onblur(e) {
        if (parseInt(this.state.SafetyMarginPer) > parseInt(this.state.LeveragePer)) {
            this.setState({ errorsleverage: true })
        } else {
            this.setState({ errorsleverage: false })
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
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('2112237F-02D7-034D-6AF1-F6F0F20D3A8D'); //2112237F-02D7-034D-6AF1-F6F0F20D3A8D
        const { errors } = this.state;
        const { walletType, intl } = this.props.props;
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="wallet.editLeverage" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={(e) => this.handleCancel()}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <React.Fragment>
                    <Alert color="danger" isOpen={this.state.showError} toggle={(e) => this.setState({ showError: false })}>
                        {this.state.responseMessage}
                    </Alert>
                    <Alert color="success" isOpen={this.state.showSuccess} toggle={(e) => this.setState({ showSuccess: false })}>
                        {this.state.responseMessage}
                    </Alert>
                </React.Fragment>
                <Form className="tradefrm">
                        {((menuDetail["50E91C00-6974-6DD0-851B-F2B1FD2007A8"]) && (menuDetail["50E91C00-6974-6DD0-851B-F2B1FD2007A8"].Visibility === "E925F86B")) && //50E91C00-6974-6DD0-851B-F2B1FD2007A8
                            <FormGroup row>
                                <Label className="control-label col">
                                    <IntlMessages id="table.currency" /><span className="text-danger">*</span>
                        </Label>
                        <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["50E91C00-6974-6DD0-851B-F2B1FD2007A8"].AccessRight === "11E6E7B0") ? true : false}
                                    className={(errors.WalletTypeId) ? "is-invalid" : ""}
                                    type="select"
                                    name="WalletTypeId"
                                    id="WalletTypeId"
                                    value={this.state.WalletTypeId}
                                    onChange={(e) => this.handleChange(e)}

                                >
                                    <option value="">{intl.formatMessage({ id: 'wallet.errCurrency' })}</option>
                                    {walletType.length && walletType.map((currency, key) => (
                                        <option key={key} value={currency.ID}>{currency.TypeName}</option>
                                    ))}
                        </Input>
                        </div>
                            </FormGroup>
                        }
                        {((menuDetail["9C6C8C7F-3056-8B42-4D7F-771363EB2700"]) && (menuDetail["9C6C8C7F-3056-8B42-4D7F-771363EB2700"].Visibility === "E925F86B")) && //9C6C8C7F-3056-8B42-4D7F-771363EB2700
                            <FormGroup row>
                                <Label className="control-label col">
                                    <IntlMessages id="wallet.LeverageChargeDeductionTypeName" /><span className="text-danger">*</span>
                        </Label>
                        <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["9C6C8C7F-3056-8B42-4D7F-771363EB2700"].AccessRight === "11E6E7B0") ? true : false}
                                    className={(errors.LeverageChargeDeductionType) ? "is-invalid" : ""}
                                    type="select"
                                    name="LeverageChargeDeductionType"
                                    id="LeverageChargeDeductionType"
                                    value={this.state.LeverageChargeDeductionType}
                                    onChange={(e) => this.handleChange(e)}
                                >
                                    <option value="">{intl.formatMessage({ id: "wallet.SelectDeductionType" })}</option>
                                    <option value="0">{intl.formatMessage({ id: "wallet.deductionType.0" })}</option>
                                    <option value="1">{intl.formatMessage({ id: "wallet.deductionType.1" })} </option>
                                    <option value="2">{intl.formatMessage({ id: "wallet.deductionType.2" })}</option>
                                    <option valiue="3">{intl.formatMessage({ id: "wallet.deductionType.3" })}</option>
                                    <option valiue="4">{intl.formatMessage({ id: "wallet.deductionType.4" })}</option>
                            </Input>
                            </div>
                            </FormGroup>
                        }
                    {((menuDetail["3962049E-839A-7858-9165-E864BCD64C2D"]) && (menuDetail["3962049E-839A-7858-9165-E864BCD64C2D"].Visibility === "E925F86B")) && //3962049E-839A-7858-9165-E864BCD64C2D
                        <FormGroup row>
                            <Label className="control-label col">
                                <IntlMessages id="table.status" />
                            </Label>
                            <div className="col-md-8 col-sm-9 col-xs-12">
                            <Switch
                                name="Status"
                                id="Status"
                                onClick={(e) => this.setState({ Status: (this.state.Status === 1) ? 0 : 1 })}
                                enabled={(menuDetail["3962049E-839A-7858-9165-E864BCD64C2D"].AccessRight === "11E6E7B0") ? false : true}
                                on={(this.state.Status === 1) ? true : false}
                            />
                        </div>
                            </FormGroup>
                        }
                        {((menuDetail["83E62901-7FAB-3499-24A2-D8740C17A6B8"]) && (menuDetail["83E62901-7FAB-3499-24A2-D8740C17A6B8"].Visibility === "E925F86B")) && //83E62901-7FAB-3499-24A2-D8740C17A6B8
                            <FormGroup row>
                                <Label className="control-label col">
                                    <IntlMessages id="wallet.IsAutoApprove" />
                        </Label>
                        <div className="col-md-8 col-sm-9 col-xs-12">
                                <Switch
                                    name="IsAutoApprove"
                                    id="IsAutoApprove"
                                    onClick={(e) => this.setState({ IsAutoApprove: (this.state.IsAutoApprove === 1) ? 0 : 1 })}
                                    enabled={(menuDetail["83E62901-7FAB-3499-24A2-D8740C17A6B8"].AccessRight === "11E6E7B0") ? false : true}
                                    on={(this.state.IsAutoApprove === 1) ? true : false}
                        />
                        </div>
                            </FormGroup>
                        }
                        {/* <div className="d-flex"> */}
                            {((menuDetail["B65D65FE-7475-7558-0EA8-77523B2501F7"]) && (menuDetail["B65D65FE-7475-7558-0EA8-77523B2501F7"].Visibility === "E925F86B")) && //B65D65FE-7475-7558-0EA8-77523B2501F7
                                <FormGroup row>
                                    <Label className="control-label col">
                                        <IntlMessages id="wallet.LeveragePer" />
                        </Label>
                        <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                        disabled={(menuDetail["B65D65FE-7475-7558-0EA8-77523B2501F7"].AccessRight === "11E6E7B0") ? true : false}
                                        className={(errors.LeveragePer) ? "is-invalid" : ""}
                                        type="select"
                                        name="LeveragePer"
                                        id="LeveragePer"
                                        value={this.state.LeveragePer}
                                        onChange={(e) => this.handleChange(e)}
                                        onBlur={(e) => this.onblur(e.target.value)}
                                    >
                                        <option value="1">1X</option>
                                        <option value="2">2X</option>
                                        <option value="3">3X</option>
                                        <option value="4">4X</option>
                                        <option value="5">5X</option>
                                        <option value="6">6X</option>
                                        <option value="7">7X</option>
                                        <option value="8">8X</option>
                                        <option value="9">9X</option>
                                        <option value="10">10X</option>
                            </Input>
                            </div>
                                </FormGroup>
                            }
                            {((menuDetail["52A9561A-8932-0469-3B78-6F7A16C563FD"]) && (menuDetail["52A9561A-8932-0469-3B78-6F7A16C563FD"].Visibility === "E925F86B")) && //52A9561A-8932-0469-3B78-6F7A16C563FD
                                <FormGroup row>
                                    <Label className="control-label col">
                                        <IntlMessages id="wallet.SafetyMarginPer" /> (%)<span className="text-danger">*</span>
                        </Label>
                        <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                        disabled={(menuDetail["52A9561A-8932-0469-3B78-6F7A16C563FD"].AccessRight === "11E6E7B0") ? true : false}
                                        className={(errors.SafetyMarginPer) ? "is-invalid" : ""}
                                        type="text"
                                        name="SafetyMarginPer"
                                        id="SafetyMarginPer"
                                        value={this.state.SafetyMarginPer}
                                        onChange={(e) => this.handleChange(e)}
                                        onBlur={(e) => this.onblur(e.target.value)}
                            />
                            </div>
                                    {this.state.errorsleverage && (
                                        <span className="text-danger">
                                            {intl.formatMessage({ id: "wallet.errsafetymargin" })}
                                        </span>
                                    )}
                                </FormGroup>
                            }
                            {((menuDetail["69B39CB0-77C5-2B63-06B9-C06BBC09A2C7"]) && (menuDetail["69B39CB0-77C5-2B63-06B9-C06BBC09A2C7"].Visibility === "E925F86B")) && //69B39CB0-77C5-2B63-06B9-C06BBC09A2C7
                                <FormGroup row>
                                    <Label className="control-label col">
                                        <IntlMessages id="wallet.MarginChargePer" /> (%)<span className="text-danger">*</span>
                        </Label>
                        <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                        disabled={(menuDetail["69B39CB0-77C5-2B63-06B9-C06BBC09A2C7"].AccessRight === "11E6E7B0") ? true : false}
                                        className={(errors.MarginChargePer) ? "is-invalid" : ""}
                                        type="text"
                                        name="MarginChargePer"
                                        id="MarginChargePer"
                                        value={this.state.MarginChargePer}
                                        onChange={(e) => this.handleChange(e)}
                        />
                        </div>
                                </FormGroup>
                            }
                        {!this.props.loading && menuDetail && 
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-20"
                                            onClick={(e) => this.handleSubmit()}
                                        >
                                            <IntlMessages id="sidebar.btnUpdate" />
                                        </Button>
                                        <Button
                                            variant="raised"
                                            className="btn-danger text-white ml-15"
                                            onClick={(e) => this.handleCancel()}
                                        >
                                            <IntlMessages id="button.cancel" />
                                        </Button>
                                    </div>
                                </div>
                            </FormGroup>
                            }
                    
</Form>
            </div>
        )
    }
}
const mapStateToProps = ({ LeverageConfigReducer, authTokenRdcer }) => {
    const { loading, insertUpdateResponse, LeverageList } = LeverageConfigReducer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { loading, insertUpdateResponse, LeverageList, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getListLeverage,
    getWalletType,
    insertUpdateLeverage,
    getMenuPermissionByID
})(injectIntl(EditLeverageForm));
