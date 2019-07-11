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
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import Switch from 'react-toggle-switch';
import { NotificationManager } from 'react-notifications';
import {
    insertUpdateWalletBlockTrn
} from "Actions/WalletBlockTrnType";
import validator from "validator";
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
    notificationFlag: false,
    menudetail: [],
    notification: true,
}

class AddWalletBlockTrnType extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    //handle close
    close = () => {
        this.setState( initialState);
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
        // validate success
        if (nextProps.formResponse.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.formResponse.ReturnCode == 0) {     //success
                NotificationManager.success(<IntlMessages id="common.form.add.success" />);
                this.props.getWalletBlockTrnList();
                this.props.drawerClose(); 
            } else if (nextProps.formResponse.ReturnCode > 0){     //failed
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
                         response = fieldList;
                    }
                }
            }
        }
            return response;
    }
    //render component
    render() {
        var menuDetail = this.checkAndGetMenuAccessDetail('A38A2D4B-0769-3D35-0056-28F09A7F1BC0');
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><span><IntlMessages id="sidebar.AddTransaction" /></span></h2>
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
                    {(menuDetail['7326CB24-1889-3B1C-001A-D33DB4C57C3D'] && menuDetail['7326CB24-1889-3B1C-001A-D33DB4C57C3D'].Visibility === "E925F86B") && // 7326CB24-1889-3B1C-001A-D33DB4C57C3D
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="table.walletId" /> <span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['7326CB24-1889-3B1C-001A-D33DB4C57C3D'].AccessRight === "11E6E7B0") ? true : false}
                                className={(this.state.errors.WalletId) ? "is-invalid" : ""}
                                type="text"
                                name="WalletId"
                                value={this.state.WalletId}
                                autoComplete="off"
                                maxLength="50"
                                onChange={(e) => {
                                    if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {

                                        this.setState({ WalletId: e.target.value })
                                    }
                                }
                                }
                            />
                        </FormGroup>
                    }
                    {(menuDetail['6ADF8024-4FB3-0D15-3931-067C0B02A224'] && menuDetail['6ADF8024-4FB3-0D15-3931-067C0B02A224'].Visibility === "E925F86B") && //6ADF8024-4FB3-0D15-3931-067C0B02A224
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="wallet.trnType" /> <span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['6ADF8024-4FB3-0D15-3931-067C0B02A224'].AccessRight === "11E6E7B0") ? true : false}
                                className={(this.state.errors.WTrnTypeMasterID) ? "is-invalid" : ""}
                                type="select"
                                name="WTrnTypeMasterID"
                                value={this.state.WTrnTypeMasterID}
                                onChange={(e) => this.setState({ WTrnTypeMasterID: e.target.value })}
                            >
                                <IntlMessages id="wallet.errTrnType">
                                    {(optionValue) => (<option value="">{optionValue}</option>)}
                                </IntlMessages>
                                {this.props.walletTransactionType.length > 0 && this.props.walletTransactionType.map((type, index) => (
                                    <option key={index} value={type.TypeId}>{type.TypeName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    }
                    {(menuDetail['3A0479B9-12E1-0ECE-20EC-2A9EA9BDA48B'] && menuDetail['3A0479B9-12E1-0ECE-20EC-2A9EA9BDA48B'].Visibility === "E925F86B") && //3A0479B9-12E1-0ECE-20EC-2A9EA9BDA48B
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="wallet.titleStatus" />
                            </Label>
                            <Switch
                                enabled={(menuDetail['3A0479B9-12E1-0ECE-20EC-2A9EA9BDA48B'].AccessRight === "11E6E7B0") ? false : true}
                                onClick={(e) => this.setState({ Status: (this.state.Status === 1) ? 0 : 1 })}
                                on={(this.state.Status === 1) ? true : false} />
                        </FormGroup>
                    }
                    {(menuDetail['55102E71-3892-2D98-53EA-EF7DA2B721F6'] && menuDetail['55102E71-3892-2D98-53EA-EF7DA2B721F6'].Visibility === "E925F86B") && //55102E71-3892-2D98-53EA-EF7DA2B721F6
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="wallet.lblRemarks" />
                            </Label>
                            <Input
                                disabled={(menuDetail['55102E71-3892-2D98-53EA-EF7DA2B721F6'].AccessRight === "11E6E7B0") ? true : false}
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
                        {Object.keys(menuDetail).length > 1  && !this.props.loading && <FormGroup row>
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
    return { loading, errors, formResponse, walletTransactionType,menuLoading ,menu_rights};
};

export default connect(mapStateToProps, {
    insertUpdateWalletBlockTrn,
    getMenuPermissionByID
})(AddWalletBlockTrnType);