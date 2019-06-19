/* 
    Developer : Nishant Vadgama
    File Comment : wallet block transaction type list component
    Date : 19-12-2018
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Button from '@material-ui/core/Button';
import { FormGroup, Label, Input } from "reactstrap";
import Switch from 'react-toggle-switch';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from 'react-notifications';
import {
    insertUpdateWalletBlockTrn
} from "Actions/WalletBlockTrnType";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
var validateWalletBlockTrnRequest = require("../../../validation/WalletBlockTrnType/validateWalletBlockTrnRequest");
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
const initialState = {
    Id: 0,
    WalletId: "",
    WTrnTypeMasterID: "",
    Status: 0,
    Remarks: "",
    errors: {},
    notificationFlag: true,
    menudetail: [],
    notification: true,
    
}

class WalletBlockTrnTypeForm extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = {
            showError: false,
            showSuccess: false,
            responseMessage: "",
            Id: props.rowDetails.Id,
            WalletId: props.rowDetails.WalletId,
            WTrnTypeMasterID: props.rowDetails.TrnTypeId,
            Status: props.rowDetails.Status,
            Remarks: props.rowDetails.Remarks,
            errors: {},
            notificationFlag: false,
            // fieldList:{},
            menudetail: [],
            notification: true,
        };
    }
    //handle close
    close = () => {
        this.setState({initialState,
        menudetail:this.state.menudetail});
        this.props.drawerClose();
    }
    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
    };
    //handle submit event
    handleSubmit = () => {
        const { errors, isValid } = validateWalletBlockTrnRequest(this.state);
        this.setState({ errors: errors , notificationFlag: true });
        if (isValid) {
            this.props.insertUpdateWalletBlockTrn(this.state);
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('0A5D3E63-8545-9791-698A-68DE98CD435A'); // get wallet menu permission
    }
    //validate reponse on add 
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
        /* update data on edit */
        if (nextProps.rowDetails.hasOwnProperty('Id')) {
            this.setState({
                Id: nextProps.rowDetails.Id,
                WalletId: nextProps.rowDetails.WalletId,
                WTrnTypeMasterID: nextProps.rowDetails.TrnTypeId,
                Status: nextProps.rowDetails.Status,
                Remarks: nextProps.rowDetails.Remarks,
            });
        }
        // validate success
        if (nextProps.formResponse.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.formResponse.ReturnCode == 0) {     //success
                NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
                this.props.getWalletBlockTrnList();
                this.props.drawerClose();
            } else if (nextProps.formResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.formResponse.ErrorCode}`} />);
            }
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
    //render component
    render() {
        var menuDetail = this.checkAndGetMenuAccessDetail('B79BB194-8496-8CB0-37F0-59C81BF743D7');
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><span><IntlMessages id="sidebar.EditTransaction"/></span></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.close}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                {this.props.menuLoading && <JbsSectionLoader />}
                {this.props.loading && <JbsSectionLoader />}
                <div className="row">
                    <div className="col-sm-12 ">
                    {(menuDetail['55ECC680-338A-65FC-49DE-60F46844739A'] && menuDetail['55ECC680-338A-65FC-49DE-60F46844739A'].Visibility === "E925F86B") && //55ECC680-338A-65FC-49DE-60F46844739A
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="table.walletId" /> <span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['55ECC680-338A-65FC-49DE-60F46844739A'].AccessRight === "11E6E7B0") ? true : false}
                                className={(this.state.errors.WalletId) ? "is-invalid" : ""}
                                type="text"
                                // disabled
                                name="WalletId"
                                value={this.state.WalletId}
                                onChange={(e) => this.setState({ WalletId: e.target.value })}
                            />
                        </FormGroup>
                    }
                    {(menuDetail['084F33F5-9573-3091-91CD-6334172B7053'] && menuDetail['084F33F5-9573-3091-91CD-6334172B7053'].Visibility === "E925F86B") && //084F33F5-9573-3091-91CD-6334172B7053
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="wallet.trnType" /> <span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['084F33F5-9573-3091-91CD-6334172B7053'].AccessRight === "11E6E7B0") ? true : false}
                                className={(this.state.errors.WTrnTypeMasterID) ? "is-invalid" : ""}
                                type="select"
                                // disabled
                                name="WTrnTypeMasterID"
                                value={this.state.WTrnTypeMasterID}
                                onChange={(e) => this.setState({ WTrnTypeMasterID: e.target.value })}
                            >
                                <IntlMessages id="wallet.errTrnType">
                                    {(optionValue) => (<option value="">{optionValue}</option>)}
                                </IntlMessages>
                                {this.props.walletTransactionType.length && this.props.walletTransactionType.map((type, index) => (
                                    <option key={index} value={type.TypeId}>{type.TypeName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    }
                    {(menuDetail['50E7020A-4C42-68F6-9533-09E44981A4B4'] && menuDetail['50E7020A-4C42-68F6-9533-09E44981A4B4'].Visibility === "E925F86B") && //50E7020A-4C42-68F6-9533-09E44981A4B4
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="wallet.titleStatus" />
                            </Label>
                            <Switch
                                enabled={(menuDetail['50E7020A-4C42-68F6-9533-09E44981A4B4'].AccessRight === "11E6E7B0") ? false : true}
                                onClick={(e) => this.setState({ Status: (this.state.Status === 1) ? 0 : 1 })}
                                on={(this.state.Status === 1) ? true : false} />
                        </FormGroup>
                    }
                    {(menuDetail['6C83DF06-6E1D-1FCD-31E4-9EE69E815CEF'] && menuDetail['6C83DF06-6E1D-1FCD-31E4-9EE69E815CEF'].Visibility === "E925F86B") && //6C83DF06-6E1D-1FCD-31E4-9EE69E815CEF
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="wallet.lblRemarks" />
                            </Label>
                            <Input
                                disabled={(menuDetail['6C83DF06-6E1D-1FCD-31E4-9EE69E815CEF'].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="Remarks"
                                autoComplete="off"
                                maxLength="100"
                                value={this.state.Remarks}
                                onChange={(e) => this.setState({ Remarks: e.target.value })}
                            />
                            {this.state.errors.Remarks && (
                                <FormGroup className="d-flex mb-0">
                                    <Label>
                                        <span className="text-danger">
                                            <IntlMessages id={this.state.errors.Remarks} />
                                        </span>
                                    </Label>
                                </FormGroup>
                            )}
                        </FormGroup>
                    }
                        {menuDetail  && !this.props.loading && <FormGroup row>
                        <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                <div className="btn_area">
                            <Button
                                variant="raised"
                                className="btn-primary text-white mr-10"
                                onClick={(e) => this.handleSubmit()}
                            >
                                <IntlMessages id="sidebar.btnUpdate" />
                            </Button>{" "}
                            <Button
                                variant="raised"
                                className="btn-danger text-white"
                                onClick={this.close}
                            >
                                <IntlMessages id="button.cancel" />
                            </Button>
                            </div>
                                </div>
                        </FormGroup>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ WalletBlockTrnTypeReducer, transactionPolicy,authTokenRdcer }) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, errors, formResponse } = WalletBlockTrnTypeReducer;
    const { walletTransactionType } = transactionPolicy;
    return { loading, errors, formResponse, walletTransactionType ,menuLoading,menu_rights};
};

export default connect(mapStateToProps, {
    insertUpdateWalletBlockTrn,
    getMenuPermissionByID
})(WalletBlockTrnTypeForm);