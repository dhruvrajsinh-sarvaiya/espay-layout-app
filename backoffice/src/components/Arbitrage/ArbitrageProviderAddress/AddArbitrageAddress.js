/* 
    Developer : Vishva shah
    File Comment : Add arbitrage address component
    Date : 12-06-2019
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
    insertUpdateArbitrageAddress
} from "Actions/Arbitrage/ArbitrageProviderAddress";
import validator from "validator";
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import { listServiceProvider } from 'Actions/ServiceProvider';
import AddFormValidation from "Validations/ArbitrageAddress/AddFormValidation";
import { injectIntl } from "react-intl";
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
    IsDefault: 0,
    SerProId:"",
    Address: "",
    errors: {},
    notificationFlag: false,
    menudetail: [],
    notification: true,
    Data: [],
}

class AddArbitrageAddress extends Component {
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
        const { errors, isValid } = AddFormValidation(this.state);
        this.setState({errors: errors , notificationFlag: true });
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
                this.props.ListArbitrageCurrency({});
                var reqObject = {};
                if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.getArbitrageAddressList({});
                this.props.listServiceProvider(reqObject); 
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
                this.props.getArbitrageAddressList({});
                this.props.drawerClose(); 
            } else if (nextProps.formResponse.ReturnCode !== 0) {     //failed
                NotificationManager.error(<IntlMessages id={`apiErrCode.${nextProps.formResponse.ErrorCode}`} />);
            }
        }
        if (nextProps.listServiceProviderData.hasOwnProperty("ReturnCode") && nextProps.listServiceProviderData.ReturnCode === 0 && nextProps.listServiceProviderData !== "undefine") {
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
        const intl = this.props.intl;
        var menuDetail = this.checkAndGetMenuAccessDetail('B859626D-102C-5A97-0EB0-7D5257C80B3F');
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><span><IntlMessages id="sidebar.AddArbitrageAddress" /></span></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.close}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <div className="row">
                    <div className="col-sm-12 ">
                    {(menuDetail['FA893D21-914E-6615-7B2E-E1F524E41FBD'] && menuDetail['FA893D21-914E-6615-7B2E-E1F524E41FBD'].Visibility === "E925F86B") && //FA893D21-914E-6615-7B2E-E1F524E41FBD
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="sidebar.ServiceProvider" /> <span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['FA893D21-914E-6615-7B2E-E1F524E41FBD'].AccessRight === "11E6E7B0") ? true : false}
                                type="select"
                                name="SerProId"
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
                    {(menuDetail['6EC2A829-175A-4E5D-6D03-498091A03C9D'] && menuDetail['6EC2A829-175A-4E5D-6D03-498091A03C9D'].Visibility === "E925F86B") && //6EC2A829-175A-4E5D-6D03-498091A03C9D
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="my_account.currency" /> <span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['6EC2A829-175A-4E5D-6D03-498091A03C9D'].AccessRight === "11E6E7B0") ? true : false}
                                type="select"
                                name="WalletTypeId"
                                value={this.state.WalletTypeId}
                                onChange={(e) => this.setState({ WalletTypeId: e.target.value })}
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
                    {(menuDetail['8BB248C4-7C69-031F-07EA-8A3A9270A406'] && menuDetail['8BB248C4-7C69-031F-07EA-8A3A9270A406'].Visibility === "E925F86B") && //8BB248C4-7C69-031F-07EA-8A3A9270A406
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="components.address" /><span className="text-danger">*</span>
                            </Label>
                            <Input
                                disabled={(menuDetail['8BB248C4-7C69-031F-07EA-8A3A9270A406'].AccessRight === "11E6E7B0") ? true : false}
                                type="text"
                                name="Address"
                                maxLength="50"
                                value={this.state.Address}
                                placeholder ={intl.formatMessage({ id: "lable.enter" })}
                                onChange={(e) => {if (validator.isAlphanumeric(e.target.value) || e.target.value === "") {

                                    this.setState({ Address: e.target.value })
                                }}}
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
                    {(menuDetail['A57A9A98-89BC-A18B-85F1-7EF0CCD432EE'] && menuDetail['A57A9A98-89BC-A18B-85F1-7EF0CCD432EE'].Visibility === "E925F86B") && //A57A9A98-89BC-A18B-85F1-7EF0CCD432EE
                        <FormGroup className="col-sm-12">
                            <Label>
                                <IntlMessages id="arbitrage.IsDefaultAddress" />
                            </Label>
                            <Switch
                                enabled={(menuDetail['A57A9A98-89BC-A18B-85F1-7EF0CCD432EE'].AccessRight === "11E6E7B0") ? false : true}
                                onClick={(e) => this.setState({ IsDefault: (this.state.IsDefault === 1) ? 0 : 1 })}
                                on={(this.state.IsDefault === 1) ? true : false} />
                        </FormGroup>
                    }
                        {menuDetail  && !this.props.loading && <FormGroup row>
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
                                className="btn-danger text-white ml-10"
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

const mapStateToProps = ({ ArbitrageAddressReducer,authTokenRdcer,ArbitrageCurrencyConfiguration ,ServiceProviderReducer}) => {
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { loading, errors, formResponse } = ArbitrageAddressReducer;
    const { ArbitrageCurrencyList } = ArbitrageCurrencyConfiguration;
    const { listServiceProviderData} = ServiceProviderReducer;
    return { loading, errors, formResponse,menuLoading ,menu_rights,ArbitrageCurrencyList,listServiceProviderData};
};

export default connect(mapStateToProps, {
    insertUpdateArbitrageAddress,
    getMenuPermissionByID,
    ListArbitrageCurrency,
    listServiceProvider,
    getArbitrageAddressList
})(injectIntl(AddArbitrageAddress));