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
import { Form, FormGroup, Label, Input, Alert, Row, Col } from "reactstrap";
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
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

const initialState = {
    Id: 0,
    WalletTypeId: "",
    LeveragePer: '1',
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
    //added by parth andhariya 
    fieldList: {},
    menudetail: [],
    notificationFlag: true,
}

class AddLeverageForm extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = initialState;
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
        // validate insert & update response 
        if (nextProps.insertUpdateResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.insertUpdateResponse.ReturnCode == 0) {
                NotificationManager.success(<IntlMessages id="common.form.add.success" />);
                this.setState(initialState);
                this.props.drawerClose();
                this.props.getListLeverage({});
            } else if (nextProps.insertUpdateResponse.ReturnCode !== 0 && this.state.flag) { //failed
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.insertUpdateResponse.ErrorCode}`} />);
                this.setState({ flag: false });
            }
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
        this.setState(initialState);
    };
    //handle cancel 
    handleCancel() {
        this.props.drawerClose();
        this.setState(initialState);
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
        var menuDetail = this.checkAndGetMenuAccessDetail('6AA154A2-A775-8AAA-654D-A14360B57814'); //6AA154A2-A775-8AAA-654D-A14360B57814
        const { errors } = this.state;
        const { walletType, intl } = this.props.props;
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="wallet.addNewLeverage" /></h2>
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
                        {((menuDetail["DF29A90F-7374-8B03-5CCA-089094342EFC"]) && (menuDetail["DF29A90F-7374-8B03-5CCA-089094342EFC"].Visibility === "E925F86B")) && //DF29A90F-7374-8B03-5CCA-089094342EFC
                            <FormGroup row>
                                <Label className="control-label col">
                                    <IntlMessages id="table.currency" /><span className="text-danger">*</span>
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["DF29A90F-7374-8B03-5CCA-089094342EFC"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["DD3ABC2A-10BF-7FC2-3CDF-78B16366054E"]) && (menuDetail["DD3ABC2A-10BF-7FC2-3CDF-78B16366054E"].Visibility === "E925F86B")) && //DD3ABC2A-10BF-7FC2-3CDF-78B16366054E
                            <FormGroup row>
                                <Label className="control-label col">
                                    <IntlMessages id="wallet.LeverageChargeDeductionTypeName" /><span className="text-danger">*</span>
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                <Input
                                    disabled={(menuDetail["DD3ABC2A-10BF-7FC2-3CDF-78B16366054E"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["8EFE40C7-9894-96B7-95CC-5A7094C58C8A"]) && (menuDetail["8EFE40C7-9894-96B7-95CC-5A7094C58C8A"].Visibility === "E925F86B")) && //8EFE40C7-9894-96B7-95CC-5A7094C58C8A
                            <FormGroup row>
                                <Label className="control-label col">
                                    <IntlMessages id="table.status" />
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                <Switch
                                    name="Status"
                                    id="Status"
                                    onClick={(e) => this.setState({ Status: (this.state.Status === 1) ? 0 : 1 })}
                                    enabled={(menuDetail["8EFE40C7-9894-96B7-95CC-5A7094C58C8A"].AccessRight === "11E6E7B0") ? false : true}
                                    on={(this.state.Status === 1) ? true : false}
                                />
                                </div>
                            </FormGroup>
                        }
                        {((menuDetail["477B12B4-230C-3B2F-60F1-23BD865C910C"]) && (menuDetail["477B12B4-230C-3B2F-60F1-23BD865C910C"].Visibility === "E925F86B")) && //477B12B4-230C-3B2F-60F1-23BD865C910C
                            <FormGroup row>
                                <Label className="control-label col">
                                    <IntlMessages id="wallet.IsAutoApprove" />
                                </Label>
                                <div className="col-md-8 col-sm-9 col-xs-12">
                                <Switch
                                    name="IsAutoApprove"
                                    id="IsAutoApprove"
                                    onClick={(e) => this.setState({ IsAutoApprove: (this.state.IsAutoApprove === 1) ? 0 : 1 })}
                                    enabled={(menuDetail["477B12B4-230C-3B2F-60F1-23BD865C910C"].AccessRight === "11E6E7B0") ? false : true}
                                    on={(this.state.IsAutoApprove === 1) ? true : false}
                                />
                                </div>
                            </FormGroup>
                        }
                        {/* <div className="d-flex"> */}
                            {((menuDetail["337F7E5D-2C6C-2DDA-0DFB-326948532DE2"]) && (menuDetail["337F7E5D-2C6C-2DDA-0DFB-326948532DE2"].Visibility === "E925F86B")) && //337F7E5D-2C6C-2DDA-0DFB-326948532DE2
                                <FormGroup row>
                                    <Label className="control-label col">
                                        <IntlMessages id="wallet.LeveragePer" />
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                        disabled={(menuDetail["337F7E5D-2C6C-2DDA-0DFB-326948532DE2"].AccessRight === "11E6E7B0") ? true : false}
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
                            {((menuDetail["D9FA9178-979E-67AB-9A5E-49EAB64F6CFE"]) && (menuDetail["D9FA9178-979E-67AB-9A5E-49EAB64F6CFE"].Visibility === "E925F86B")) && //D9FA9178-979E-67AB-9A5E-49EAB64F6CFE
                                <FormGroup row>
                                    <Label className="control-label col">
                                        <IntlMessages id="wallet.SafetyMarginPer" /> (%)<span className="text-danger">*</span>
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                        disabled={(menuDetail["D9FA9178-979E-67AB-9A5E-49EAB64F6CFE"].AccessRight === "11E6E7B0") ? true : false}
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
                            {((menuDetail["83138763-19B5-2F51-4B86-293EA4D024A3"]) && (menuDetail["83138763-19B5-2F51-4B86-293EA4D024A3"].Visibility === "E925F86B")) && //83138763-19B5-2F51-4B86-293EA4D024A3
                                <FormGroup row>
                                    <Label className="control-label col">
                                        <IntlMessages id="wallet.MarginChargePer" /> (%)<span className="text-danger">*</span>
                                    </Label>
                                    <div className="col-md-8 col-sm-9 col-xs-12">
                                    <Input
                                        disabled={(menuDetail["83138763-19B5-2F51-4B86-293EA4D024A3"].AccessRight === "11E6E7B0") ? true : false}
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
                        {/* </div> */}
                        {!this.props.loading && menuDetail && 
                            <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-20"
                                            onClick={(e) => this.handleSubmit()}
                                        >
                                            <IntlMessages id="button.add" />
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
                            </FormGroup>}
                            
                    </Form>
            </div>
        )
    }
}
const mapStateToProps = ({ LeverageConfigReducer, authTokenRdcer }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { loading, insertUpdateResponse, LeverageList } = LeverageConfigReducer;
    return { loading, insertUpdateResponse, LeverageList, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getListLeverage,
    getWalletType,
    insertUpdateLeverage,
    getMenuPermissionByID
})(injectIntl(AddLeverageForm));
