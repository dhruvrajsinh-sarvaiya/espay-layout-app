/* 
    Developer : Vishva shah
    File Comment : Update Arbitrage Address component
    Date : 12-06-2019
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
    insertUpdateArbitrageAddress
} from "Actions/Arbitrage/ArbitrageProviderAddress";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
import { listServiceProvider } from 'Actions/ServiceProvider';
import AddFormValidation from "Validations/ArbitrageAddress/AddFormValidation";
import validator from "validator";
import {
    getArbitrageAddressList,
} from "Actions/Arbitrage/ArbitrageProviderAddress";
const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};
const initialState = {
    Id: 0,
    WalletTypeId: "",
    SerProId: "",
    IsDefaultAddress: 0,
    Address: "",
    errors: {},
    notificationFlag: false,
    menudetail: [],
    notification: true,
    Data:[] 
}

class UpdateArbitrageAddress extends Component {
    // construct with initial state
    constructor(props) {
        super(props);
        this.state = {
            Id: props.rowDetails.Id,
            WalletTypeId: props.rowDetails.WalletTypeId,
            SerProId: props.rowDetails.ServiceProviderId,
            IsDefault: props.rowDetails.IsDefaultAddress,
            Address: props.rowDetails.Address,
            errors: {},
            notificationFlag: false,
            // fieldList:{},
            menudetail: [],
            notification: true,
            Data:[]
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
        const { errors, isValid } = AddFormValidation(this.state);
        this.setState({ errors: errors , notificationFlag: true });
        if (isValid) {
            this.props.insertUpdateArbitrageAddress(this.state);
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('29068824-19DF-1316-3626-675C80E21F09'); // get arbitrage menu permission
    }
    //validate reponse on add 
    componentWillReceiveProps(nextProps) {
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) { 
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        /* update data on edit */
        if (nextProps.rowDetails.hasOwnProperty('Id')) {
            this.setState({
                Id: nextProps.rowDetails.Id,
                WalletTypeId: nextProps.rowDetails.WalletTypeId,
                ServiceProviderId: nextProps.rowDetails.ServiceProviderId,
                IsDefault: nextProps.rowDetails.IsDefaultAddress,
                Address: nextProps.rowDetails.Address,
            });
        }
        // validate success
        if (nextProps.formResponse.hasOwnProperty("ReturnCode") && this.state.notificationFlag) {
            this.setState({ notificationFlag: false });
            if (nextProps.formResponse.ReturnCode == 0) {     //success
                NotificationManager.success(<IntlMessages id="common.form.edit.success" />);
                this.props.getArbitrageAddressList({});
                this.props.drawerClose();
            } else if (nextProps.formResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={`apiErrCode.${nextProps.formResponse.ErrorCode}`} />);
            }
        }
        if (nextProps.listServiceProviderData.ReturnCode === 0 && nextProps.listServiceProviderData !== "undefine") {
            this.setState({
                Data: nextProps.listServiceProviderData.Response
            })
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
        var menuDetail = this.checkAndGetMenuAccessDetail('1F23BCB1-5BA8-0400-97D9-75B19DDB80B9');
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><span><IntlMessages id="sidebar.UpdateArbitrageAddress"/></span></h2>
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
                    {(menuDetail['867271A8-7F95-6074-4A93-AB55A71052BC'] && menuDetail['867271A8-7F95-6074-4A93-AB55A71052BC'].Visibility === "E925F86B") && //867271A8-7F95-6074-4A93-AB55A71052BC
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="sidebar.ServiceProvider" /> <span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['867271A8-7F95-6074-4A93-AB55A71052BC'].AccessRight === "11E6E7B0") ? true : false}
                                type="select"
                                name="ServiceProviderId"
                                value={this.state.SerProId}
                                onChange={(e) => this.setState({ SerProId: e.target.value })}
                            >
                                <IntlMessages id="arbitrage.selectServiceProvider">
                                    {(optionValue) => (<option value="">{optionValue}</option>)}
                                </IntlMessages>
                                {this.state.Data.length && this.state.Data.map((type, index) => (
                                    <option key={index} value={type.Id}>{type.ProviderName}</option>
                                ))}
                            </Input>
                            {this.state.errors.SerProId && (
                                <FormGroup className="d-flex mb-0">
                                    <Label>
                                        <span className="text-danger">
                                            <IntlMessages id={this.state.errors.SerProId} />
                                        </span>
                                    </Label>
                                </FormGroup>
                            )}
                        </FormGroup>
                    }
                    {(menuDetail['16090601-2E25-7AF9-5F4B-935F48513EAE'] && menuDetail['16090601-2E25-7AF9-5F4B-935F48513EAE'].Visibility === "E925F86B") && //16090601-2E25-7AF9-5F4B-935F48513EAE
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="my_account.currency" /> <span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['16090601-2E25-7AF9-5F4B-935F48513EAE'].AccessRight === "11E6E7B0") ? true : false}
                                type="select"
                                name="WalletTypeId"
                                value={this.state.WalletTypeId}
                                onChange={(e) => this.setState({ WalletTypeId : e.target.value })}
                            >
                                <IntlMessages id="wallet.errCurrency">
                                    {(optionValue) => (<option value="">{optionValue}</option>)}
                                </IntlMessages>
                                {this.props.ArbitrageCurrencyList.length && this.props.ArbitrageCurrencyList.map((type, index) => (
                                    <option key={index} value={type.Id}>{type.CoinName}</option>
                                ))}
                            </Input>
                            {this.state.errors.WalletTypeId && (
                                <FormGroup className="d-flex mb-0">
                                    <Label>
                                        <span className="text-danger">
                                            <IntlMessages id={this.state.errors.WalletTypeId} />
                                        </span>
                                    </Label>
                                </FormGroup>
                            )}
                        </FormGroup>
                    }
                     {(menuDetail['FEDDE080-3A2B-4052-4383-51F77A1D6792'] && menuDetail['FEDDE080-3A2B-4052-4383-51F77A1D6792'].Visibility === "E925F86B") && //FEDDE080-3A2B-4052-4383-51F77A1D6792
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="components.address"/><span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['FEDDE080-3A2B-4052-4383-51F77A1D6792'].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="Address"
                                autoComplete="off"
                                maxLength="50"
                                value={this.state.Address}
                                onChange={(e) => {if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {
                                    this.setState({ Address: e.target.value })}
                                }}
                            />
                            {this.state.errors.Address && (
                                <FormGroup className="d-flex mb-0">
                                    <Label>
                                        <span className="text-danger">
                                            <IntlMessages id={this.state.errors.Address} />
                                        </span>
                                    </Label>
                                </FormGroup>
                            )}
                        </FormGroup>
                    }
                    {(menuDetail['892A6E79-80EE-040E-7C42-5941AA6629AF'] && menuDetail['892A6E79-80EE-040E-7C42-5941AA6629AF'].Visibility === "E925F86B") && //892A6E79-80EE-040E-7C42-5941AA6629AF
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="arbitrage.IsDefaultAddress" />
                            </Label>
                            <Switch
                                enabled={(menuDetail['892A6E79-80EE-040E-7C42-5941AA6629AF'].AccessRight === "11E6E7B0") ? false : true}
                                onClick={(e) => this.setState({ IsDefault: (this.state.IsDefault === 1) ? 0 : 1 })}
                                on={(this.state.IsDefault === 1) ? true : false} />
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

const mapStateToProps = ({ ArbitrageAddressReducer, ServiceProviderReducer,authTokenRdcer ,ArbitrageCurrencyConfiguration}) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, errors, formResponse } = ArbitrageAddressReducer;
    const { listServiceProviderData} = ServiceProviderReducer;
    const { ArbitrageCurrencyList } = ArbitrageCurrencyConfiguration;
    return { loading, errors, formResponse ,menuLoading,menu_rights,listServiceProviderData,ArbitrageCurrencyList};
};

export default connect(mapStateToProps, {
    insertUpdateArbitrageAddress,
    getMenuPermissionByID,
    listServiceProvider,
    ListArbitrageCurrency,
    getArbitrageAddressList
})(UpdateArbitrageAddress);