import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from 'react-notifications';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import validator from "validator";
import { injectIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import TopupRequestFormValidator from 'Validations/Arbitrage/TopupRequestForm/TopupRequestFormValidator';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import { verify2fa } from "Actions/Deposit";
import classnames from "classnames";
import AppConfig from 'Constants/AppConfig';
import Slide from '@material-ui/core/Slide';
import { AddTopupRequest } from "Actions/Arbitrage/ProviderTopupHistory";
import { ListArbitrageCurrency } from 'Actions/Arbitrage/ArbitrageCurrencyConfiguration';
import { listServiceProvider } from 'Actions/ServiceProvider';
import Select from "react-select";
import {
    getArbitrageAddressList,
} from "Actions/Arbitrage/ArbitrageProviderAddress";
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
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class TopupRequestForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menudetail: [],
            notificationFlag: true,
            WalletTypeID: '',
            Amount: '',
            address: '',
            Toprovider: '',
            FromProvider: '',
            errors: {},
            responseFlag: false,
            handle2faflag: true,
            showdestroyDialog: false,
            code: "",
            Page: 1,
            PageSize: AppConfig.totalRecordDisplayInList,
            FromProviderList: [],
            WalletTypeName: ''
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('A131FA1D-20A8-6DA7-1C27-A050193F631B'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.props.ListArbitrageCurrency();
                this.props.listServiceProvider({ IsArbitrage: 1 });
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        // success 2fa validattion
        if (nextProps.response2fa.hasOwnProperty("ErrorCode") && nextProps.response2fa.ErrorCode == 0 && this.state.handle2faflag) {
            this.props.AddTopupRequest({
                SMSCode: this.state.WalletTypeID,
                Amount: parseFloat(this.state.Amount),
                Address: this.state.address,
                ToServiceProviderId: parseInt(this.state.Toprovider),
                FromServiceProviderId: parseInt(this.state.FromProvider),
            });
            this.setState({ code: "", showDialog: false, handle2faflag: false, responseFlag: true });
        }
        //handle add response
        if (nextProps.TopupRequest.ReturnCode === 0 && this.state.responseFlag) {
            this.props.getListFromServer(this.state.Page, this.state.PageSize); // list api call after add success
            NotificationManager.success(<IntlMessages id={`apiArbitrageErrCode.${nextProps.TopupRequest.ErrorCode}`} />);
            this.setState({ responseFlag: false })
        } else if (nextProps.TopupRequest.ReturnCode !== 0 && this.state.responseFlag) {
            NotificationManager.error(<IntlMessages id={`apiArbitrageErrCode.${nextProps.TopupRequest.ErrorCode}`} />);
            this.setState({ responseFlag: false })
        }
        if (this.state.FromProviderList.length === 0) {
            if (nextProps.listServiceProviderData.ReturnCode === 0 && nextProps.listServiceProviderData !== "undefine") {
                this.setState({
                    FromProviderList: nextProps.listServiceProviderData.Response
                })
            }
        }
    }
    /* handle confirmation of 2fa */
    handleConfirmation() {
        if (this.state.code !== '') {
            this.props.verify2fa({
                'Code': this.state.code,
            });
        }
    }
    //drawer close all event
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            WalletTypeID: '',
            Amount: '',
            address: '',
            Toprovider: '',
            FromProvider: '',
            errors: {},
            responseFlag: false,
            WalletTypeID: '',
            WalletTypeName: ''
        });
    };
    //handle cancel 
    handleCancel() {
        this.props.drawerClose();
        this.setState({
            WalletTypeID: '',
            Amount: '',
            address: '',
            Toprovider: '',
            FromProvider: '',
            errors: {},
            responseFlag: false,
            WalletTypeID: '',
            WalletTypeName: ''
        });
    }
    //handle submit 
    handleSubmit() {
        const { errors, isValid } = TopupRequestFormValidator(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            this.setState({ showDialog: true, handle2faflag: true });
        }
    }
    //handle change radio
    handleChange = (key, e) => {
        if (key == 'Amount') {

            if (validator.isDecimal(e.target.value, { no_symbols: true, decimal_digits: '0,8' }) || (validator.isNumeric(e.target.value, { no_symbols: true })) || e.target.value === "") {
                this.setState({ [key]: e.target.value });
            }
        } else {
            this.setState({ [key]: e.target.value });
        }
    }
    //handle currency change 
    handleChangeCurrency(e) {
        this.setState({ WalletTypeID: e.value, WalletTypeName: { label: e.label } });
    }
    // address api call 
    addressApicall = () => {
        if (this.state.Toprovider !== '' && this.state.WalletTypeID !== '') {
            this.props.getArbitrageAddressList({
                ServiceProviderId: this.state.Toprovider,
                WalletTypeId: this.state.WalletTypeID,
            });
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
        var menuDetail = this.checkAndGetMenuAccessDetail('A43C7826-3757-0EBB-9B6C-3C01AD461B30'); //A43C7826-3757-0EBB-9B6C-3C01AD461B30
        const { intl } = this.props;
        const { errors } = this.state;
        var ArbitrageCurrencyList = this.props.ArbitrageCurrencyList.length ? this.props.ArbitrageCurrencyList : [];
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><span>{<IntlMessages id="lable.TopupRequest" />}</span></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <Button className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={(e) => this.handleCancel()}><i className="zmdi zmdi-mail-reply"></i></Button>
                        <Button className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.closeAll}><i className="zmdi zmdi-home"></i></Button>
                    </div>
                </div>
                {(this.props.menuLoading || this.props.arbitrageAddressLoading || this.props.loading || this.props.ArbitrageCurrencyloading || this.state.arbitrageServiceProviderLoading) && <JbsSectionLoader />}
                <Form>
                    {(menuDetail['7D67492E-36DA-A722-896E-F0567AF50A5F'] && menuDetail['7D67492E-36DA-A722-896E-F0567AF50A5F'].Visibility === "E925F86B") && //7D67492E-36DA-A722-896E-F0567AF50A5F
                        <FormGroup row>
                            <Label sm={4} className="d-inline">
                                <IntlMessages id="table.Fromprovider" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Input
                                    disabled={(menuDetail['7D67492E-36DA-A722-896E-F0567AF50A5F'].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="FromProvider"
                                    className="form-control"
                                    id="FromProvider"
                                    value={this.state.FromProvider}
                                    onChange={e =>
                                        this.handleChange(
                                            "FromProvider",
                                            e
                                        )
                                    }
                                >
                                    <option value="">{intl.formatMessage({ id: "sidebar.pleaseSelect" })}</option>
                                    {this.state.FromProviderList.length &&
                                        this.state.FromProviderList.map((type, index) => (
                                            <option key={index} value={type.Id}>{type.ProviderName}</option>
                                        ))}
                                </Input>
                                {errors.FromProvider && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.FromProvider} />
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                    }
                    {(menuDetail['876CC4B7-735A-9BEB-9774-8BF08E180EF2'] && menuDetail['876CC4B7-735A-9BEB-9774-8BF08E180EF2'].Visibility === "E925F86B") && //876CC4B7-735A-9BEB-9774-8BF08E180EF2
                        <FormGroup row>
                            <Label sm={4} className="d-inline">
                                <IntlMessages id="table.Toprovider" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Input
                                    disabled={(menuDetail['876CC4B7-735A-9BEB-9774-8BF08E180EF2'].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="Toprovider"
                                    className="form-control"
                                    id="Toprovider"
                                    value={this.state.Toprovider}
                                    onChange={e =>
                                        this.handleChange(
                                            "Toprovider",
                                            e
                                        )
                                    }
                                    onBlur={this.addressApicall}
                                >
                                    <option value="">{intl.formatMessage({ id: "sidebar.pleaseSelect" })}</option>
                                    {this.state.FromProviderList.length &&
                                        this.state.FromProviderList.map((type, index) => (
                                            <option key={index} value={type.Id}>{type.ProviderName}</option>
                                        ))}
                                </Input>
                                {errors.Toprovider && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.Toprovider} />
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                    }
                    {(menuDetail['FB65518A-9C34-2097-181D-F6730FB92E88'] && menuDetail['FB65518A-9C34-2097-181D-F6730FB92E88'].Visibility === "E925F86B") && //FB65518A-9C34-2097-181D-F6730FB92E88
                        <FormGroup row>
                            <Label for="currency" sm={4} className="d-inline">
                                <IntlMessages id="table.currency" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Select
                                    disabled={(menuDetail['FB65518A-9C34-2097-181D-F6730FB92E88'].AccessRight === "11E6E7B0") ? true : false}
                                    options={ArbitrageCurrencyList.map((type, index) => ({
                                        label: type.CoinName,
                                        value: type.Id,
                                    }))}
                                    onChange={e => this.handleChangeCurrency(e)}
                                    onBlur={this.addressApicall}
                                    value={this.state.WalletTypeName}
                                    maxMenuHeight={200}
                                    placeholder={intl.formatMessage({ id: "sidebar.sitetoken.list.lable.enter.currencyId" })}
                                />
                                {errors.WalletTypeName && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.WalletTypeName} />
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                    }
                    {(menuDetail['298351AF-8615-2B18-2D54-E0E002AB093A'] && menuDetail['298351AF-8615-2B18-2D54-E0E002AB093A'].Visibility === "E925F86B") && //298351AF-8615-2B18-2D54-E0E002AB093A
                        <FormGroup row>
                            <Label sm={4} className="d-inline">
                                <IntlMessages id="table.address" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Input
                                    disabled={((menuDetail['298351AF-8615-2B18-2D54-E0E002AB093A'].AccessRight === "11E6E7B0") && (!this.props.arbitrageAddressList.length)) ? true : false}
                                    type="select"
                                    name="address"
                                    className="form-control"
                                    id="address"
                                    value={this.state.address}
                                    onChange={e =>
                                        this.handleChange(
                                            "address",
                                            e
                                        )
                                    }
                                >
                                    <option value="">{intl.formatMessage({ id: "sidebar.pleaseSelect" })}</option>
                                    {this.props.arbitrageAddressList.length &&
                                        this.props.arbitrageAddressList.map((type, index) => (
                                            <option key={index} value={type.Address}>{type.Address}</option>
                                        ))}
                                </Input>
                                {errors.address && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.address} />
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                    }
                    {(menuDetail['D4B37E45-A070-761E-04F7-97FE16564C62'] && menuDetail['D4B37E45-A070-761E-04F7-97FE16564C62'].Visibility === "E925F86B") && //D4B37E45-A070-761E-04F7-97FE16564C62
                        <FormGroup row>
                            <Label sm={4} className="d-inline">
                                <IntlMessages id="table.Amount" /><span className="text-danger">*</span>
                            </Label>
                            <Col sm={8}>
                                <Input
                                    disabled={(menuDetail['D4B37E45-A070-761E-04F7-97FE16564C62'].AccessRight === "11E6E7B0") ? true : false}
                                    type="text"
                                    name="Amount"
                                    placeholder={intl.formatMessage({ id: "table.Amount" })}
                                    value={this.state.Amount}
                                    maxLength="12"
                                    onChange={e =>
                                        this.handleChange("Amount", e)
                                    }
                                />
                                {errors.Amount && (
                                    <span className="text-danger">
                                        <IntlMessages id={errors.Amount} />
                                    </span>
                                )}
                            </Col>
                        </FormGroup>
                    }
                    {menuDetail &&
                        <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                            <div className="btn_area">
                                <Button
                                    variant="raised"
                                    className="btn-primary text-white mr-10"
                                    onClick={(e) => this.handleSubmit()}
                                >
                                    {<IntlMessages id="sidebar.btnSubmit" />}
                                </Button>
                                <Button
                                    variant="raised"
                                    className="btn-danger text-white"
                                    onClick={(e) => this.handleCancel()}
                                >
                                    <IntlMessages id="button.cancel" />
                                </Button>
                            </div>
                        </div>
                    }
                </Form>
                <Dialog
                    open={this.state.showDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        <div className="list-action justify-content-between d-flex">
                            <IntlMessages id="myAccount.Dashboard.2faAuthentication" />
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.props.response2fa.loading && <JbsSectionLoader />}
                            <Form onSubmit={(e) => { e.preventDefault() }}>
                                <FormGroup className="mb-0">
                                    <Label for="Code"><IntlMessages id="my_account.googleAuthCode" /></Label>
                                    <Input type="text" name="Code" id="Code" maxLength="6" autoComplete="off" value={this.state.code} onChange={(e) => (this.setState({ code: e.target.value }))} placeholder={intl.formatMessage({ id: "wallet.2FAPlaceholder" })} />
                                    {this.props.error2fa.hasOwnProperty("ErrorCode") && <span className="text-danger"><IntlMessages id={`apiErrCode.${this.props.error2fa.ErrorCode}`} /></span>}
                                </FormGroup>
                                <div className="mt-20 justify-content-between d-flex">
                                    <Button type="button" variant="raised" onClick={(e) => this.setState({ code: "", showDialog: false })} className={classnames("btn-danger text-white")} > <IntlMessages id="button.cancel" /></Button>
                                    <Button type="submit" variant="raised" onClick={(e) => this.handleConfirmation()} className={classnames("btn-success text-white", { "disabled": !this.state.code })} disabled={!this.state.code ? true : false}> <IntlMessages id="sidebar.apiConfAddGen.button.confirm" /></Button>
                                </div>
                            </Form>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}
const mapToProps = ({ authTokenRdcer, dipositReportReducer, TopupHistory, ArbitrageCurrencyConfiguration, ServiceProviderReducer, ArbitrageAddressReducer }) => {
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { reconResponse, response2fa, errors, error2fa } = dipositReportReducer;
    const { TopupRequest, loading } = TopupHistory;
    const { ArbitrageCurrencyList, ArbitrageCurrencyloading } = ArbitrageCurrencyConfiguration;
    const { arbitrageAddressList } = ArbitrageAddressReducer;
    const arbitrageAddressLoading = ArbitrageAddressReducer.loading;
    const { listServiceProviderData } = ServiceProviderReducer;
    const arbitrageServiceProviderLoading = ServiceProviderReducer.loading;
    return { menuLoading, menu_rights, reconResponse, response2fa, errors, error2fa, TopupRequest, loading, ArbitrageCurrencyList, ArbitrageCurrencyloading, listServiceProviderData, arbitrageAddressList, arbitrageAddressLoading, arbitrageServiceProviderLoading };
};

export default connect(mapToProps, {
    getMenuPermissionByID,
    verify2fa,
    AddTopupRequest,
    ListArbitrageCurrency,
    listServiceProvider,
    getArbitrageAddressList,
})(injectIntl(TopupRequestForm));