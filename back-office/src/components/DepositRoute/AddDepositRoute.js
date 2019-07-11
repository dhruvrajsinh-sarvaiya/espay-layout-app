/* 
    Developer : Nishant Vadgama
    Date : 31-01-2019
    File Comment : Add & Edit deposit route component
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import validator from "validator";
import Button from '@material-ui/core/Button';
import { FormGroup, Label, Input } from "reactstrap";
import { injectIntl } from 'react-intl';
import Switch from 'react-toggle-switch';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from 'react-notifications';
import AppConfig from 'Constants/AppConfig';
import {
    getDepositRouteList,
    insertUpdateDepositRoute,
} from "Actions/DepositRoute";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
var DepositRouteRequestValidator = require("../../validation/DepositRoute/DepositRouteRequestValidator");
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
const initialState = {
    Id: 0,
    WalletTypeID: "",
    Status: 0,
    SerProId: "",
    RecordCount: "",
    Limit: "",
    MaxLimit: "",
    IsResetLimit: 0,
    errors: {},
    notificationFlag: false,
    menudetail: [],
    notification: true,
    // fieldList:{},
}

class AddDepositRoute extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('82603087-9747-4497-2155-5AEBB39E8808'); // get wallet menu permission
    }
    //validate reponse on status change 
    componentWillReceiveProps(nextProps) {
        const intl = this.props.props.intl;
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        // validate insert & update response 
        if (nextProps.insertUpdateResponse.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.insertUpdateResponse.ReturnCode == 0) {     //success
                NotificationManager.success(intl.formatMessage({ id: "common.form.edit.success" }));
                this.props.drawerClose();
                setTimeout(function () {
                    this.props.getDepositRouteList({
                        PageNo: 0,
                        PageSize: AppConfig.totalRecordDisplayInList
                    });
                    this.setState({
                        ...initialState,
                    });
                }.bind(this), 3000);
            } else if (nextProps.insertUpdateResponse.ReturnCode != 0) {     //failed
                NotificationManager.error(intl.formatMessage({ id: `apiWalletErrCode.${nextProps.insertUpdateResponse.ErrorCode}` }));
            }
        }
    }
    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            ...initialState,
            // fieldList:menuDetail
        });
    };
    //handle cancel 
    handleCancel() {
        let newObj = Object.assign({}, this.initState);
        newObj.menudetail = this.state.menudetail;
        this.setState(newObj);
        this.props.drawerClose();
    }
    // submit action handler...
    handleSubmit() {
        const { errors, isValid } = DepositRouteRequestValidator(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            this.props.insertUpdateDepositRoute({
                Id: parseInt(this.state.Id),
                WalletTypeID: this.state.WalletTypeID,
                Status: this.state.Status,
                RecordCount: parseInt(this.state.RecordCount),
                Limit: parseInt(this.state.Limit),
                MaxLimit: parseInt(this.state.MaxLimit),
                SerProId: this.state.SerProId,
                IsResetLimit: this.state.IsResetLimit,
                LastTrnID: "",
                PreviousTrnID: "",
                PrevIterationID: "",
                TPSPickupStatus: 0
            });
            this.setState({ notificationFlag: true });
        }
    }
    // on change handler
    handleChange = (e) => {
        if (validator.isNumeric(e.target.value, { no_symbols: true }) || e.target.value == "") {
            this.setState({ [e.target.name]: e.target.value });
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
        var menuDetail = this.checkAndGetMenuAccessDetail('59E1F282-6D9A-4195-7F1C-4A86BF7D1E15');
        const { errors } = this.state;
        const { walletType, serviceProvider, intl } = this.props.props;
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        {this.props.menuLoading && <JbsSectionLoader />}
                        <h2><IntlMessages id="wallet.lblAddRoute" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={(e) => this.handleCancel()}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                {this.props.loading && <JbsSectionLoader />}
                <div className="row">
                    <div className="col-sm-12 ">
                        {(menuDetail['59FA0153-00AE-92B8-8D7F-0DA555939274'] && menuDetail['59FA0153-00AE-92B8-8D7F-0DA555939274'].Visibility === "E925F86B") && //59FA0153-00AE-92B8-8D7F-0DA555939274
                            <FormGroup className="col-sm-12">
                                <Label>
                                    <IntlMessages id="table.currency" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['59FA0153-00AE-92B8-8D7F-0DA555939274'].AccessRight === "11E6E7B0") ? true : false}
                                    className={(errors.WalletTypeID) ? "is-invalid" : ""}
                                    type="select"
                                    name="WalletTypeID"
                                    id="WalletTypeID"
                                    value={this.state.WalletTypeID}
                                    // disabled={(this.state.Id !== 0) ? true : false}
                                    onChange={e => this.setState({ WalletTypeID: e.target.value })}
                                >
                                    <IntlMessages id="wallet.errCurrency">
                                        {(optionValue) =>
                                            <option value="">{optionValue}</option>
                                        }
                                    </IntlMessages>
                                    {walletType.length > 0 && walletType.map((currency, key) => (
                                        <option key={key} value={currency.ID}>{currency.TypeName}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        }
                        {(menuDetail['4873529E-0F37-8E8A-57D1-BA7C7F7C7957'] && menuDetail['4873529E-0F37-8E8A-57D1-BA7C7F7C7957'].Visibility === "E925F86B") && //4873529E-0F37-8E8A-57D1-BA7C7F7C7957
                            <FormGroup className="col-sm-12">
                                <Label for="SerProId">
                                    <IntlMessages id="liquidityprovider.list.option.label.serviceprovider" /> <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail['4873529E-0F37-8E8A-57D1-BA7C7F7C7957'].AccessRight === "11E6E7B0") ? true : false}
                                    className={(errors.SerProId) ? "is-invalid" : ""}
                                    type="select"
                                    name="SerProId"
                                    id="SerProId"
                                    value={this.state.SerProId}
                                    // disabled={(this.state.Id !== 0) ? true : false}
                                    onChange={(e) => this.setState({ SerProId: e.target.value })}
                                >
                                    <option value="">{intl.formatMessage({ id: "sidebar.apiConfAddGen.apiProvider.selectProvider" })}</option>
                                    {serviceProvider.length > 0 && serviceProvider.map((item, key) => (
                                        <option value={item.Id} key={key}>{item.ProviderName}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        }
                        {(menuDetail['9F344DFE-7668-7B51-457D-F63ED48B51BF'] && menuDetail['9F344DFE-7668-7B51-457D-F63ED48B51BF'].Visibility === "E925F86B") && //9F344DFE-7668-7B51-457D-F63ED48B51BF
                            <FormGroup className="col-sm-12 d-flex">
                                <Label className="w-40">
                                    <IntlMessages id="table.status" />
                                </Label>
                                <Switch
                                    onClick={(e) => this.setState({ Status: (this.state.Status === 1) ? 0 : 1 })}
                                    enabled={(menuDetail['9F344DFE-7668-7B51-457D-F63ED48B51BF'].AccessRight === "11E6E7B0") ? false : true}
                                    on={(this.state.Status === 1) ? true : false} />
                            </FormGroup>
                        }
                        <div className="d-flex">
                            {(menuDetail['95AF7E57-50AE-7E74-129F-0045E5C19EB7'] && menuDetail['95AF7E57-50AE-7E74-129F-0045E5C19EB7'].Visibility === "E925F86B") && //95AF7E57-50AE-7E74-129F-0045E5C19EB7
                                <FormGroup className="col-xs-12">
                                    <Label>
                                        <IntlMessages id="wallet.lblRecCount" /> <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(menuDetail['95AF7E57-50AE-7E74-129F-0045E5C19EB7'].AccessRight === "11E6E7B0") ? true : false}
                                        className={(errors.RecordCount) ? "is-invalid" : ""}
                                        type="text"
                                        name="RecordCount"
                                        value={this.state.RecordCount}
                                        placeholder={intl.formatMessage({ id: "wallet.lblRecCount" })}
                                        maxLength="5"
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                </FormGroup>
                            }
                            {(menuDetail['312E56C0-A2C1-8050-17FD-CA4ADCB74AAD'] && menuDetail['312E56C0-A2C1-8050-17FD-CA4ADCB74AAD'].Visibility === "E925F86B") && //312E56C0-A2C1-8050-17FD-CA4ADCB74AAD
                                <FormGroup className="col-xs-12 ml-10">
                                    <Label>
                                        <IntlMessages id="wallet.feeLimit" /> <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(menuDetail['312E56C0-A2C1-8050-17FD-CA4ADCB74AAD'].AccessRight === "11E6E7B0") ? true : false}
                                        className={(errors.Limit) ? "is-invalid" : ""}
                                        type="text"
                                        name="Limit"
                                        value={this.state.Limit}
                                        placeholder={intl.formatMessage({ id: "wallet.feeLimit" })}
                                        maxLength="5"
                                        // disabled={(this.state.Id !== 0) ? true : false}
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                </FormGroup>
                            }
                            {(menuDetail['461EF50D-2F8B-7866-5FA7-27C814833C0C'] && menuDetail['461EF50D-2F8B-7866-5FA7-27C814833C0C'].Visibility === "E925F86B") && //461EF50D-2F8B-7866-5FA7-27C814833C0C
                                <FormGroup className="col-xs-12 ml-10">
                                    <Label>
                                        <IntlMessages id="wallet.lblMaxLimit" /> <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(menuDetail['461EF50D-2F8B-7866-5FA7-27C814833C0C'].AccessRight === "11E6E7B0") ? true : false}
                                        className={(errors.MaxLimit) ? "is-invalid" : ""}
                                        type="text"
                                        name="MaxLimit"
                                        value={this.state.MaxLimit}
                                        placeholder={intl.formatMessage({ id: "wallet.lblMaxLimit" })}
                                        maxLength="5"
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                </FormGroup>
                            }
                        </div>
                        {this.state.Id !== 0 && <FormGroup className="col-sm-12 d-flex">
                            <Label className="w-40">
                                <IntlMessages id="wallet.lblRestartCount" />
                            </Label>
                            <Switch
                                onClick={(e) => this.setState({ IsResetLimit: (this.state.IsResetLimit === 1) ? 0 : 1 })}
                                on={(this.state.IsResetLimit === 1) ? true : false} />
                        </FormGroup>}
                        {Object.keys(menuDetail).length > 0 &&
                            (!this.props.loading && <FormGroup row>
                                <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                    <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            className="btn-primary text-white mr-20"
                                            onClick={(e) => this.handleSubmit()}
                                        >
                                            <IntlMessages id="button.add" />
                                        </Button>{" "}
                                        <Button
                                            variant="raised"
                                            className="btn-danger text-white ml-15"
                                            onClick={(e) => this.handleCancel()}
                                        >
                                            <IntlMessages id="button.cancel" />
                                        </Button>
                                    </div>
                                </div>
                            </FormGroup>)}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ DepositRouteReducer, authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, insertUpdateResponse } = DepositRouteReducer;
    return { loading, insertUpdateResponse, menuLoading, menu_rights };
};

export default connect(mapStateToProps, {
    getDepositRouteList,
    insertUpdateDepositRoute,
    getMenuPermissionByID
})(injectIntl(AddDepositRoute));
