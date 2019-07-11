// update by : Bharat Jograna (BreadCrumb)09 March 2019
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { getProfileType } from 'Actions/MyAccount';
import { FormGroup, Label, Input, Row, Form, Button } from "reactstrap";
import { addProfileConfigData, getKYCLevelList, getProfileLevelList, getCurrencyList } from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import validateProfileConfig from "Validations/MyAccount/profile_configuration"
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//BreadCrumbData
const BreadCrumbData = [
    {
        title: <IntlMessages id="sidebar.app" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.dashboard" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.profileConfiguration" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.addProfileConfigDashboard" />,
        link: '',
        index: 2
    }
];

//initial state
const initialStateData = {
    TypeId: "",
    ProfileFree: "",
    Description: "",
    KYCLevel: "",
    LevelName: "",
    DepositFee: "",
    Withdrawalfee: "",
    Tradingfee: "",
    Profilelevel: "",
    IsProfileExpiry: "",
    IsRecursive: "",
    SubscriptionAmount: "",
    transactionLimits: [],
    TransactionLimit: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
    WithdrawalLimit: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
    TradeLimit: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
    DepositLimit: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
    DeviceId: getDeviceInfo(),
    Mode: getMode(),
    IPAddress: '',
    HostName: getHostName(),
    open: false,
    loading: false,
    errors: {},
    Ntf_flage: true,
    fieldList: {},
    menudetail: [],
    menuLoading: false,
    notificationFlag: true,

};

class AddProfileConfigDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = initialStateData;
        this.initState = this.state;
        this.onChange = this.onChange.bind(this);
    }

    closeAll = () => {
        this.resetState();
        this.props.closeAll();
        this.setState({ open: false });
    };

    handleCancel(e) {
        e.preventDefault();
        this.resetState();
        this.props.drawerClose();
    }

    handleSubmit(e) {
        e.preventDefault();
        const { errors, isValid } = validateProfileConfig(this.state);
        this.setState({ errors: errors });
        if (isValid) {
            let self = this;
            const { TypeId, ProfileFree, Description, KYCLevel, LevelName, DepositFee, Withdrawalfee, Tradingfee, Profilelevel, IsProfileExpiry, IsRecursive, SubscriptionAmount, TransactionLimit, WithdrawalLimit, TradeLimit, DepositLimit, DeviceId, Mode, HostName } = this.state
            getIPAddress().then(function (IPAddress) {
                self.props.addProfileConfigData({ TypeId, ProfileFree, Description, KYCLevel, LevelName, DepositFee, Withdrawalfee, Tradingfee, Profilelevel, IsProfileExpiry, IsRecursive, SubscriptionAmount, TransactionLimit, WithdrawalLimit, TradeLimit, DepositLimit, IPAddress, DeviceId, Mode, HostName });
            });
            this.resetState();
        }
    }

    //add dynamic column
    addNewColumn(value) {
        if (value === "TransactionLimit") {
            /* check if already submited and error object has been created */
            if (this.state.errors.hasOwnProperty("transLimit")) {
                const tempErrors = Object.assign([], this.state.errors);
                const tempObj = {};
                tempErrors.transLimit.push(tempObj);
                this.setState({ errors: tempErrors });
            }
            let newObj1 = { CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" };
            this.setState({ TransactionLimit: this.state.TransactionLimit.concat(newObj1) });
        }
        if (value === "WithdrawalLimit") {
            /* check if already submited and error object has been created */
            if (this.state.errors.hasOwnProperty("withLimit")) {
                const tempErrors = Object.assign([], this.state.errors);
                const tempObj = {};
                tempErrors.withLimit.push(tempObj);
                this.setState({ errors: tempErrors });
            }
            let newObj2 = { CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" };
            this.setState({ WithdrawalLimit: this.state.WithdrawalLimit.concat(newObj2) });
        }
        if (value === "TradeLimit") {
            /* check if already submited and error object has been created */
            if (this.state.errors.hasOwnProperty("tradLimit")) {
                const tempErrors = Object.assign([], this.state.errors);
                const tempObj = {};
                tempErrors.tradLimit.push(tempObj);
                this.setState({ errors: tempErrors });
            }
            let newObj3 = { CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" };
            this.setState({ TradeLimit: this.state.TradeLimit.concat(newObj3) });
        }
        if (value === "DepositLimit") {
            /* check if already submited and error object has been created */
            if (this.state.errors.hasOwnProperty("depositLimit")) {
                const tempErrors = Object.assign([], this.state.errors);
                const tempObj = {};
                tempErrors.depositLimit.push(tempObj);
                this.setState({ errors: tempErrors });
            }
            let newObj4 = { CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" };
            this.setState({ DepositLimit: this.state.DepositLimit.concat(newObj4) });
        }
    }

    //handle change
    handleChange(e, index, key, vlaue1) {
        if (vlaue1 === "TransactionLimit") {
            let tmpObject1 = Object.assign([], this.state.TransactionLimit);
            tmpObject1[index][key] = e.target.value;
            this.setState({ TransactionLimit: tmpObject1 });
        }
        if (vlaue1 === "WithdrawalLimit") {
            let tmpObject2 = Object.assign([], this.state.WithdrawalLimit);
            tmpObject2[index][key] = e.target.value;
            this.setState({ WithdrawalLimit: tmpObject2 });
        }
        if (vlaue1 === "TradeLimit") {
            let tmpObject3 = Object.assign([], this.state.TradeLimit);
            tmpObject3[index][key] = e.target.value;
            this.setState({ TradeLimit: tmpObject3 });
        }
        if (vlaue1 === "DepositLimit") {
            let tmpObject4 = Object.assign([], this.state.DepositLimit);
            tmpObject4[index][key] = e.target.value;
            this.setState({ DepositLimit: tmpObject4 });
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('BC797A84-37E8-1A38-0DE2-82DEF23A9819');
    }

    //Handle Change
    onChange(event) { this.setState({ [event.target.name]: event.target.value }); }

    //handle back to page
    handleBack() { this.resetState(); this.props.drawerClose(); }

    //reset state to default
    resetState() {
        this.setState({
            TypeId: "",
            KYCLevel: "",
            Profilelevel: "",
            IsProfileExpiry: "",
            ProfileFree: "",
            DepositFee: "",
            Withdrawalfee: "",
            Tradingfee: "",
            Description: "",
            IsRecursive: "",
            SubscriptionAmount: "",
            errors: {},
            TransactionLimit: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
            WithdrawalLimit: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
            TradeLimit: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
            DepositLimit: [{ CurrencyId: "", Hourly: "", Daily: "", Weekly: "", Monthly: "", Qauterly: "", Yearly: "" }],
            Ntf_flage: false
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getKYCLevelList();
                this.props.getProfileLevelList();
                this.props.getProfileType();
                this.props.getCurrencyList();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        this.setState({ loading: nextProps.loading });

        if (nextProps.ext_flag) {
            if (this.state.Ntf_flage && (nextProps.data.ReturnCode === 1 || nextProps.data.ReturnCode === 9)) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
                this.setState({ Ntf_flage: false })
            } else if (this.state.Ntf_flage && nextProps.data.ReturnCode === 0) {
                this.setState({ data: '', Ntf_flage: false });
                NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
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
    render() {
        const { TypeId, KYCLevel, Profilelevel, Description, ProfileFree, DepositFee, Withdrawalfee, LevelName, Tradingfee, IsProfileExpiry, IsRecursive, SubscriptionAmount, errors } = this.state;
        const { drawerClose, loading } = this.props;
        const getProfileTypes = this.props.profileType.TypeMasterList;
        const getKYCLevelListData = this.props.kycLevelList.KYCLevelList;
        const getProfileLevelListData = this.props.profileLevelList.GetProfilelevelmasters;
        const getWalletTypeData = this.props.currencyList.walletTypeMasters;
        var menuDetail = this.checkAndGetMenuAccessDetail('57095600-4437-2ECB-19F1-651202082D83');
        if (!menuDetail) {
            menuDetail = { Utility: [], CrudOption: [] }
        }
        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.addProfileConfigDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <Fragment>
                        <Form className="tradefrm">
                            <div className="top-filter row">
                                {(menuDetail["0D2CBF79-4124-23B9-97F3-9195A35F0F35"] && menuDetail["0D2CBF79-4124-23B9-97F3-9195A35F0F35"].Visibility === "E925F86B") && //0D2CBF79-4124-23B9-97F3-9195A35F0F35
                                    <FormGroup className="col-md-4 col-sm-4 col-xs-12">
                                        <Label for="TypeId"><IntlMessages id="my_account.typeName" /><span className="text-danger">*</span></Label>
                                        <Input disabled={(menuDetail["0D2CBF79-4124-23B9-97F3-9195A35F0F35"].AccessRight === "11E6E7B0") ? true : false} type="select" name="TypeId" id="TypeId" value={TypeId} onChange={this.onChange}>
                                            <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                            {getProfileTypes &&
                                                getProfileTypes.map((list, index) => (
                                                    <option key={index} value={list.id}>
                                                        {list.Type}
                                                    </option>
                                                ))}
                                        </Input>
                                        {errors.TypeId && (<span className="text-danger"><IntlMessages id={errors.TypeId} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["3D31E86B-1707-5D97-1DF8-377F031A7558"] && menuDetail["3D31E86B-1707-5D97-1DF8-377F031A7558"].Visibility === "E925F86B") && //3956E88A-3126-107A-1996-88AAA6CF3038
                                    <FormGroup className="col-md-4 col-sm-4 col-xs-12">
                                        <Label for="KYCLevel"><IntlMessages id="my_account.kycLevel" /><span className="text-danger">*</span></Label>
                                        <Input type="select" name="KYCLevel" id="KYCLevel" value={KYCLevel} onChange={this.onChange}>
                                            <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                            {getKYCLevelListData &&
                                                getKYCLevelListData.map((list, index) => (
                                                    <option key={index} value={list.Id}>
                                                        {list.KYCName}
                                                    </option>
                                                ))}
                                        </Input>
                                        {errors.KYCLevel && (<span className="text-danger"><IntlMessages id={errors.KYCLevel} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["F29A74DF-3315-11D7-381A-44CFCD663874"] && menuDetail["F29A74DF-3315-11D7-381A-44CFCD663874"].Visibility === "E925F86B") && //DDA146C5-3361-5A74-9D9A-B7AFF99C302F
                                    <FormGroup className="col-md-4 col-sm-4 col-xs-12">
                                        <Label for="Profilelevel"><IntlMessages id="my_account.profileLevel" /><span className="text-danger">*</span></Label>
                                        <Input type="select" name="Profilelevel" id="Profilelevel" value={Profilelevel} onChange={this.onChange}>
                                            <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                            {getProfileLevelListData &&
                                                getProfileLevelListData.map((list, index) => (
                                                    <option key={index} value={list.Id}>
                                                        {list.ProfileName}
                                                    </option>
                                                ))}
                                        </Input>
                                        {errors.Profilelevel && (<span className="text-danger"><IntlMessages id={errors.Profilelevel} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["4EA4D051-2D93-75EB-94E1-80569BAF52E6"] && menuDetail["4EA4D051-2D93-75EB-94E1-80569BAF52E6"].Visibility === "E925F86B") && //0042FD64-0F6F-9386-0234-82DD1FEE6DF2
                                    <FormGroup className="col-md-4 col-sm-4 col-xs-12">
                                        <Label for="SubscriptionAmount"><IntlMessages id="my_account.subscriptionLimit" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="SubscriptionAmount" id="SubscriptionAmount" placeholder="Enter SubscriptionAmount" value={SubscriptionAmount} onChange={this.onChange} />
                                        {errors.SubscriptionAmount && (<span className="text-danger"><IntlMessages id={errors.SubscriptionAmount} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["10D6C865-48C4-71FD-242D-037B7ECB2EB5"] && menuDetail["10D6C865-48C4-71FD-242D-037B7ECB2EB5"].Visibility === "E925F86B") && //53DDA72A-51A9-98A6-6920-A48163B8017E
                                    <FormGroup className="col-md-4 col-sm-4 col-xs-12">
                                        <Label for="IsProfileExpiry"><IntlMessages id="my_account.isProfileExpiry" /><span className="text-danger">*</span></Label>
                                        <Input type="select" name="IsProfileExpiry" id="IsProfileExpiry" value={IsProfileExpiry} onChange={this.onChange}>
                                            <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.true">{(selectOption) => <option value="true">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.false">{(selectOption) => <option value="false">{selectOption}</option>}</IntlMessages>
                                        </Input>
                                        {errors.IsProfileExpiry && (<span className="text-danger"><IntlMessages id={errors.IsProfileExpiry} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["1E1244DA-12BF-5E46-8643-F93DE9F93C86"] && menuDetail["1E1244DA-12BF-5E46-8643-F93DE9F93C86"].Visibility === "E925F86B") && //A56D045A-1499-0F4C-8E4B-8E3DF39998CB
                                    <FormGroup className="col-md-4 col-sm-4 col-xs-12">
                                        <Label for="IsRecursive"><IntlMessages id="my_account.isRecursive" /><span className="text-danger">*</span></Label>
                                        <Input type="select" name="IsRecursive" id="IsRecursive" value={IsRecursive} onChange={this.onChange}>
                                            <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.true">{(selectOption) => <option value="true">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.false">{(selectOption) => <option value="false">{selectOption}</option>}</IntlMessages>
                                        </Input>
                                        {errors.IsRecursive && (<span className="text-danger"><IntlMessages id={errors.IsRecursive} /></span>)}
                                    </FormGroup>
                                }
                            </div>
                            <div className="top-filter row">
                                {(menuDetail["2ADB7425-693F-3680-6B6D-9D166B7A8946"] && menuDetail["2ADB7425-693F-3680-6B6D-9D166B7A8946"].Visibility === "E925F86B") && //C3EEEE93-7E8C-03BD-7E27-D1AE10459789
                                    <FormGroup className="col-md-2 col-sm-2 col-xs-6">
                                        <Label for="ProfileFree"><IntlMessages id="my_account.profileFee" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="ProfileFree" id="ProfileFree" placeholder="Enter ProfileFreeProfileFree" value={ProfileFree} onChange={this.onChange} />
                                        {errors.ProfileFree && (<span className="text-danger"><IntlMessages id={errors.ProfileFree} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["1F5B9190-42DD-8BBB-40B3-5CD48A416068"] && menuDetail["1F5B9190-42DD-8BBB-40B3-5CD48A416068"].Visibility === "E925F86B") && //CEF55A95-0010-9CA6-8BEB-6C6CCAD139F8
                                    <FormGroup className="col-md-2 col-sm-2 col-xs-6">
                                        <Label for="DepositFee"><IntlMessages id="my_account.depositFee" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="DepositFee" id="DepositFee" placeholder="Enter DepositFee" value={DepositFee} onChange={this.onChange} />
                                        {errors.DepositFee && (<span className="text-danger"><IntlMessages id={errors.DepositFee} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["EF04D1AF-5F2B-6AD8-6B1C-2BF028420804"] && menuDetail["EF04D1AF-5F2B-6AD8-6B1C-2BF028420804"].Visibility === "E925F86B") && //1D7BEB32-74F1-20CE-08AC-7E200B027484
                                    <FormGroup className="col-md-2 col-sm-3 col-xs-6">
                                        <Label for="Withdrawalfee"><IntlMessages id="my_account.withdrawlFee" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="Withdrawalfee" id="Withdrawalfee" placeholder="Enter Withdrawalfee" value={Withdrawalfee} onChange={this.onChange} />
                                        {errors.Withdrawalfee && (<span className="text-danger"><IntlMessages id={errors.Withdrawalfee} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["A5AD0465-9606-1E6C-4D68-69D3994B72F3"] && menuDetail["A5AD0465-9606-1E6C-4D68-69D3994B72F3"].Visibility === "E925F86B") && //E90E8E7B-9C3E-4014-164C-9A66DD88A389
                                    <FormGroup className="col-md-2 col-sm-2 col-xs-6">
                                        <Label for="Tradingfee"><IntlMessages id="my_account.tradingFee" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="Tradingfee" id="Tradingfee" placeholder="Enter Trading Fee" value={Tradingfee} onChange={this.onChange} />
                                        {errors.Tradingfee && (<span className="text-danger"><IntlMessages id={errors.Tradingfee} /></span>)}
                                    </FormGroup>
                                }
                                {(menuDetail["F26C8E22-5612-3681-23A7-F825EDAD18E1"] && menuDetail["F26C8E22-5612-3681-23A7-F825EDAD18E1"].Visibility === "E925F86B") && //2D7DEA00-2DCD-24EC-7F78-55A7F46813F8
                                    <FormGroup className="col-md-2 col-sm-2 col-xs-6">
                                        <Label for="LevelName"><IntlMessages id="my_account.levelName" /><span className="text-danger">*</span></Label>
                                        <Input type="text" name="LevelName" id="LevelName" placeholder="Enter Level Name" value={LevelName} onChange={this.onChange} />
                                        {errors.LevelName && (<span className="text-danger"><IntlMessages id={errors.LevelName} /></span>)}
                                    </FormGroup>
                                }
                            </div>
                            <div className="top-filter row">
                                {(menuDetail["138518E4-8904-77D8-22F5-3F1D8C1F5548"] && menuDetail["138518E4-8904-77D8-22F5-3F1D8C1F5548"].Visibility === "E925F86B") && //735CE16C-0B0A-956D-8848-476EF9CD5B7A
                                    <FormGroup className="col-md-12">
                                        <Label for="Description"><IntlMessages id="my_account.description" /><span className="text-danger">*</span></Label>
                                        <Input type="textarea" name="Description" rows="5" id="Description" placeholder="Enter Description" value={Description} onChange={this.onChange} />
                                        {errors.Description && (<span className="text-danger"><IntlMessages id={errors.Description} /></span>)}
                                    </FormGroup>
                                }
                            </div>
                        </Form>
                        {/* Transaction Limit */}
                        {this.state.errors.selectTransLimit && (
                            <FormGroup className="d-flex mb-0">
                                <Label><span className="text-danger">{" "} <IntlMessages id={this.state.errors.selectTransLimit} /> </span> </Label>
                            </FormGroup>
                        )}
                        <div className="activity-board-wrapper">
                            <div className="comment-box mb-4 p-20">
                                <h1><IntlMessages id="my_account.transactionLimit" /></h1>
                                {this.state.TransactionLimit.length > 0 && this.state.TransactionLimit.map((transLimit, index) => (
                                    <div key={index} className="Tranlimitbox clearfix">
                                        {(menuDetail["8C1368A3-878F-98D1-2340-0B87E6826D70"] && menuDetail["8C1368A3-878F-98D1-2340-0B87E6826D70"].Visibility === "E925F86B") && //20FE53BE-60A4-3D6C-54D7-8CD6B8955BF9
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.currency" /><span className="text-danger">*</span></Label>
                                                    <Input type="select"
                                                        className={(this.state.errors.transLimit && this.state.errors.transLimit[index].CurrencyId) ? "is-invalid" : ""}
                                                        name={"CurrencyId" + index} id={"CurrencyId" + index} onChange={e => this.handleChange(e, index, "CurrencyId", "TransactionLimit")} value={this.state.TransactionLimit[index].CurrencyId}>
                                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                                        {getWalletTypeData &&
                                                            getWalletTypeData.map((list, indexes) => (
                                                                <option key={indexes} value={list.Id}>
                                                                    {list.CoinName}
                                                                </option>
                                                            ))}
                                                    </Input>
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["C2407987-98D0-426F-85E4-4D3459949DB8"] && menuDetail["C2407987-98D0-426F-85E4-4D3459949DB8"].Visibility === "E925F86B") && //19AD2616-4E19-55FC-9D51-0E2A95758911
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.hourly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.transLimit && this.state.errors.transLimit[index].Hourly) ? "is-invalid" : ""}
                                                        name={"Hourly" + index} value={this.state.TransactionLimit[index].Hourly} onChange={e => this.handleChange(e, index, "Hourly", "TransactionLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["EF76FDE9-826F-4D5F-13DC-531AC08C2F8C"] && menuDetail["EF76FDE9-826F-4D5F-13DC-531AC08C2F8C"].Visibility === "E925F86B") && //3E834152-A5C5-253F-626B-A4560E2D601A
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.daily" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.transLimit && this.state.errors.transLimit[index].Daily) ? "is-invalid" : ""}
                                                        name={"Daily" + index} value={this.state.TransactionLimit[index].Daily} onChange={e => this.handleChange(e, index, "Daily", "TransactionLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["E7E3BBB5-40B6-09FF-92F5-8CA6868A3F21"] && menuDetail["E7E3BBB5-40B6-09FF-92F5-8CA6868A3F21"].Visibility === "E925F86B") && //42149C89-2FA6-5E2F-870C-D90C95AD8D4E
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.weekly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.transLimit && this.state.errors.transLimit[index].Weekly) ? "is-invalid" : ""}
                                                        name={"Weekly" + index} value={this.state.TransactionLimit[index].Weekly} onChange={e => this.handleChange(e, index, "Weekly", "TransactionLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["021A012E-04E7-5D32-3C68-698DC9FD6901"] && menuDetail["021A012E-04E7-5D32-3C68-698DC9FD6901"].Visibility === "E925F86B") && //9DC75A19-1F4B-47D6-86E9-BF13A9F34F23
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.monthly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.transLimit && this.state.errors.transLimit[index].Monthly) ? "is-invalid" : ""}
                                                        name={"Monthly" + index} value={this.state.TransactionLimit[index].Monthly} onChange={e => this.handleChange(e, index, "Monthly", "TransactionLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["852BC6C5-3DBB-0735-7448-90C7E6132A88"] && menuDetail["852BC6C5-3DBB-0735-7448-90C7E6132A88"].Visibility === "E925F86B") && //AB1E4C29-71E7-77C8-38EF-86E870D17D64
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.quaterly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.transLimit && this.state.errors.transLimit[index].Qauterly) ? "is-invalid" : ""}
                                                        name={"Qauterly" + index} value={this.state.TransactionLimit[index].Qauterly} onChange={e => this.handleChange(e, index, "Qauterly", "TransactionLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["49DD72A8-30BC-6115-792E-D1692FE955F6"] && menuDetail["49DD72A8-30BC-6115-792E-D1692FE955F6"].Visibility === "E925F86B") && //6B5D3323-2B93-8A71-1D51-93E6BF7716FF
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.yearly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.transLimit && this.state.errors.transLimit[index].Yearly) ? "is-invalid" : ""}
                                                        name={"Yearly" + index} value={this.state.TransactionLimit[index].Yearly} onChange={e => this.handleChange(e, index, "Yearly", "TransactionLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        <div className="lmt_box btn_del">
                                            <FormGroup>
                                                {this.state.TransactionLimit.length > 1 && <a className="font-2x text-dark" href="javascript:void(0)" onClick={e => this.setState({ TransactionLimit: this.state.TransactionLimit.filter((_, i) => i !== index) })}> <i className="zmdi zmdi-delete"></i> </a>}
                                            </FormGroup>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(menuDetail).length > 0 &&
                                    <Row>
                                        <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block">
                                            <Button variant="raised" color="primary" className="text-white" onClick={e => this.addNewColumn("TransactionLimit")} > <IntlMessages id="wallet.btnAddRoutes" /> </Button>
                                        </div>
                                    </Row>
                                }
                            </div>
                        </div>
                        {/* Withdrawl Limit */}
                        {this.state.errors.selectWithLimit && (
                            <FormGroup className="d-flex mb-0">
                                <Label><span className="text-danger">{" "} <IntlMessages id={this.state.errors.selectWithLimit} /> </span> </Label>
                            </FormGroup>
                        )}
                        <div className="activity-board-wrapper">
                            <div className="comment-box mb-4 p-20">
                                <h1><IntlMessages id="my_account.withdrawlLimit" /></h1>
                                {this.state.WithdrawalLimit.length > 0 && this.state.WithdrawalLimit.map((withLimit, index) => (
                                    <div key={index} className="Tranlimitbox clearfix">
                                        {(menuDetail["3F5522D3-29D9-0430-A5EC-53A022C60660"] && menuDetail["3F5522D3-29D9-0430-A5EC-53A022C60660"].Visibility === "E925F86B") && //47D90E8E-4147-1EEC-5E64-9C90E69842D5
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.currency" /><span className="text-danger">*</span></Label>
                                                    <Input type="select"
                                                        className={(this.state.errors.withLimit && this.state.errors.withLimit[index].CurrencyId) ? "is-invalid" : ""}
                                                        name={"CurrencyId" + index} id={"CurrencyId" + index} onChange={e => this.handleChange(e, index, "CurrencyId", "WithdrawalLimit")} value={this.state.WithdrawalLimit[index].CurrencyId}>
                                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                                        {getWalletTypeData &&
                                                            getWalletTypeData.map((list, indexs) => (
                                                                <option key={indexs} value={list.Id}>
                                                                    {list.CoinName}
                                                                </option>
                                                            ))}
                                                    </Input>
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["32194A0E-2EBC-8191-A391-24AD71BB4F62"] && menuDetail["32194A0E-2EBC-8191-A391-24AD71BB4F62"].Visibility === "E925F86B") && //D81380C7-7AEC-5D84-1A4C-4F7C17C91CB5
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.hourly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.withLimit && this.state.errors.withLimit[index].Hourly) ? "is-invalid" : ""}
                                                        name={"Hourly" + index} value={this.state.WithdrawalLimit[index].Hourly} onChange={e => this.handleChange(e, index, "Hourly", "WithdrawalLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["B1530167-4457-A62A-41D6-B736FE2974C3"] && menuDetail["B1530167-4457-A62A-41D6-B736FE2974C3"].Visibility === "E925F86B") && //6E5A0758-A20A-8E67-4115-06B1A6EF79FE
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.daily" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.withLimit && this.state.errors.withLimit[index].Daily) ? "is-invalid" : ""}
                                                        name={"Daily" + index} value={this.state.WithdrawalLimit[index].Daily} onChange={e => this.handleChange(e, index, "Daily", "WithdrawalLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["21DA2B82-90E7-6318-29B4-581316263CA7"] && menuDetail["21DA2B82-90E7-6318-29B4-581316263CA7"].Visibility === "E925F86B") && //5A1BF663-3D82-0302-A57D-938604DB252B
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.weekly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.withLimit && this.state.errors.withLimit[index].Weekly) ? "is-invalid" : ""}
                                                        name={"Weekly" + index} value={this.state.WithdrawalLimit[index].Weekly} onChange={e => this.handleChange(e, index, "Weekly", "WithdrawalLimit")} />
                                                </FormGroup>
                                            </div>
                                        }

                                        {(menuDetail["43568C32-94CA-9BEC-A104-988C78985055"] && menuDetail["43568C32-94CA-9BEC-A104-988C78985055"].Visibility === "E925F86B") && //4A86E08A-9E5B-5C82-77D3-3450D4E05451
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.monthly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.withLimit && this.state.errors.withLimit[index].Monthly) ? "is-invalid" : ""}
                                                        name={"Monthly" + index} value={this.state.WithdrawalLimit[index].Monthly} onChange={e => this.handleChange(e, index, "Monthly", "WithdrawalLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["2890675C-153A-7A4F-0729-833F64F386F3"] && menuDetail["2890675C-153A-7A4F-0729-833F64F386F3"].Visibility === "E925F86B") && //16C5547A-1DEC-5095-11A2-25D33306A367
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.quaterly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.withLimit && this.state.errors.withLimit[index].Qauterly) ? "is-invalid" : ""}
                                                        name={"Qauterly" + index} value={this.state.WithdrawalLimit[index].Qauterly} onChange={e => this.handleChange(e, index, "Qauterly", "WithdrawalLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["35A109BF-9C19-28A6-9881-70575C192E94"] && menuDetail["35A109BF-9C19-28A6-9881-70575C192E94"].Visibility === "E925F86B") && //0FC13E8F-87B3-5BBD-2D3F-CF9292100A75
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.yearly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.withLimit && this.state.errors.withLimit[index].Yearly) ? "is-invalid" : ""}
                                                        name={"Yearly" + index} value={this.state.WithdrawalLimit[index].Yearly} onChange={e => this.handleChange(e, index, "Yearly", "WithdrawalLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        <div className="lmt_box btn_del">
                                            <FormGroup>
                                                {this.state.WithdrawalLimit.length > 1 && <a className="font-2x text-dark" href="javascript:void(0)" onClick={e => this.setState({ WithdrawalLimit: this.state.WithdrawalLimit.filter((_, i) => i !== index) })}> <i className="zmdi zmdi-delete"></i> </a>}
                                            </FormGroup>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(menuDetail).length > 0 &&
                                    <Row>
                                        <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block">
                                            <Button variant="raised" color="primary" className="text-white" onClick={e => this.addNewColumn("WithdrawalLimit")} > <IntlMessages id="wallet.btnAddRoutes" /> </Button>
                                        </div>
                                    </Row>
                                }
                            </div>
                        </div>
                        {/* Trade Limit */}
                        {this.state.errors.selectTradeLimit && (
                            <FormGroup className="d-flex mb-0">
                                <Label><span className="text-danger">{" "} <IntlMessages id={this.state.errors.selectTradeLimit} /> </span> </Label>
                            </FormGroup>
                        )}
                        <div className="activity-board-wrapper">
                            <div className="comment-box mb-4 p-20">
                                <h1><IntlMessages id="my_account.tradeLimit" /></h1>
                                {this.state.TradeLimit.length > 0 && this.state.TradeLimit.map((tradLimit, index) => (
                                    <div key={index} className="Tranlimitbox clearfix">
                                        {(menuDetail["D59B04D7-6DA4-3BF9-9874-DE43E07A6845"] && menuDetail["D59B04D7-6DA4-3BF9-9874-DE43E07A6845"].Visibility === "E925F86B") && //F161091D-A393-6339-5242-726F30766008
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.currency" /><span className="text-danger">*</span></Label>
                                                    <Input type="select"
                                                        className={(this.state.errors.tradLimit && this.state.errors.tradLimit[index].CurrencyId) ? "is-invalid" : ""}
                                                        name={"CurrencyId" + index} id={"CurrencyId" + index} onChange={e => this.handleChange(e, index, "CurrencyId", "TradeLimit")} value={this.state.TradeLimit[index].CurrencyId}>
                                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                                        {getWalletTypeData &&
                                                            getWalletTypeData.map((list, ind) => (
                                                                <option key={ind} value={list.Id}>
                                                                    {list.CoinName}
                                                                </option>
                                                            ))}
                                                    </Input>
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["D7B2644D-6545-2D5C-6310-EC365FDE4D41"] && menuDetail["D7B2644D-6545-2D5C-6310-EC365FDE4D41"].Visibility === "E925F86B") && //D7B2644D-6545-2D5C-6310-EC365FDE4D41
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.hourly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.tradLimit && this.state.errors.tradLimit[index].Hourly) ? "is-invalid" : ""}
                                                        name={"Hourly" + index} value={this.state.TradeLimit[index].Hourly} onChange={e => this.handleChange(e, index, "Hourly", "TradeLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["A87FD09E-2D3F-8494-839F-A1D9A3FCA349"] && menuDetail["A87FD09E-2D3F-8494-839F-A1D9A3FCA349"].Visibility === "E925F86B") && //4F7A9DE5-9B7A-1272-33F0-10082903A0EC
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.daily" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.tradLimit && this.state.errors.tradLimit[index].Daily) ? "is-invalid" : ""}
                                                        name={"Daily" + index} value={this.state.TradeLimit[index].Daily} onChange={e => this.handleChange(e, index, "Daily", "TradeLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["5278C1BC-4783-2C1F-35D4-A6F18A940F91"] && menuDetail["5278C1BC-4783-2C1F-35D4-A6F18A940F91"].Visibility === "E925F86B") && //8E27A91F-93CC-3DAE-3913-0567EF8968D8
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.weekly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.tradLimit && this.state.errors.tradLimit[index].Weekly) ? "is-invalid" : ""}
                                                        name={"Weekly" + index} value={this.state.TradeLimit[index].Weekly} onChange={e => this.handleChange(e, index, "Weekly", "TradeLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["BB69BF03-A39E-593F-61E1-34E152E59FFF"] && menuDetail["BB69BF03-A39E-593F-61E1-34E152E59FFF"].Visibility === "E925F86B") && //EF33AA99-1C44-8998-1660-73356F3A3FB9
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.monthly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.tradLimit && this.state.errors.tradLimit[index].Monthly) ? "is-invalid" : ""}
                                                        name={"Monthly" + index} value={this.state.TradeLimit[index].Monthly} onChange={e => this.handleChange(e, index, "Monthly", "TradeLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["C5C007F9-A3CF-049B-30E9-7EF0783E0BCD"] && menuDetail["C5C007F9-A3CF-049B-30E9-7EF0783E0BCD"].Visibility === "E925F86B") && //FC3B42A8-9B87-3FD7-8E38-B2AEEF877BE5
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.quaterly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.tradLimit && this.state.errors.tradLimit[index].Qauterly) ? "is-invalid" : ""}
                                                        name={"Qauterly" + index} value={this.state.TradeLimit[index].Qauterly} onChange={e => this.handleChange(e, index, "Qauterly", "TradeLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["1F648B81-2F4E-239C-70D6-3309D182943D"] && menuDetail["1F648B81-2F4E-239C-70D6-3309D182943D"].Visibility === "E925F86B") && //10670ED4-A48F-2DD7-831F-1AA3F215572A
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.yearly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.tradLimit && this.state.errors.tradLimit[index].Yearly) ? "is-invalid" : ""}
                                                        name={"Yearly" + index} value={this.state.TradeLimit[index].Yearly} onChange={e => this.handleChange(e, index, "Yearly", "TradeLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        <div className="lmt_box btn_del">
                                            <FormGroup>
                                                {this.state.TradeLimit.length > 1 && <a className="font-2x text-dark" href="javascript:void(0)" onClick={e => this.setState({ TradeLimit: this.state.TradeLimit.filter((_, i) => i !== index) })}> <i className="zmdi zmdi-delete"></i> </a>}
                                            </FormGroup>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(menuDetail).length > 0 &&
                                    <Row>
                                        <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block">
                                            <Button variant="raised" color="primary" className="text-white" onClick={e => this.addNewColumn("TradeLimit")} > <IntlMessages id="wallet.btnAddRoutes" /> </Button>
                                        </div>
                                    </Row>
                                }
                            </div>
                        </div>
                        {/* Deposit Limit */}
                        {this.state.errors.selectDepositLimit && (
                            <FormGroup className="d-flex mb-0">
                                <Label><span className="text-danger">{" "} <IntlMessages id={this.state.errors.selectDepositLimit} /> </span> </Label>
                            </FormGroup>
                        )}
                        <div className="activity-board-wrapper">
                            <div className="comment-box mb-4 p-20">
                                <h1><IntlMessages id="my_account.depositLimit" /></h1>
                                {this.state.DepositLimit.length > 0 && this.state.DepositLimit.map((depositLimit, index) => (
                                    <div key={index} className="Tranlimitbox clearfix">
                                        {(menuDetail["D59B04D7-6DA4-3BF9-9874-DE43E07A6845"] && menuDetail["D59B04D7-6DA4-3BF9-9874-DE43E07A6845"].Visibility === "E925F86B") && //D1BE541C-3DAF-914D-17BD-740DC21494A0
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.currency" /><span className="text-danger">*</span></Label>
                                                    <Input type="select"
                                                        className={(this.state.errors.depositLimit && this.state.errors.depositLimit[index].CurrencyId) ? "is-invalid" : ""}
                                                        name={"CurrencyId" + index} id={"CurrencyId" + index} onChange={e => this.handleChange(e, index, "CurrencyId", "DepositLimit")} value={this.state.DepositLimit[index].CurrencyIdCurrencyId}>
                                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                                        {getWalletTypeData &&
                                                            getWalletTypeData.map((list, key) => (
                                                                <option key={key} value={list.Id}>
                                                                    {list.CoinName}
                                                                </option>
                                                            ))}
                                                    </Input>
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["A87FD09E-2D3F-8494-839F-A1D9A3FCA349"] && menuDetail["A87FD09E-2D3F-8494-839F-A1D9A3FCA349"].Visibility === "E925F86B") && //A87FD09E-2D3F-8494-839F-A1D9A3FCA349
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.hourly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.depositLimit && this.state.errors.depositLimit[index].Hourly) ? "is-invalid" : ""}
                                                        name={"Hourly" + index} value={this.state.DepositLimit[index].Hourly} onChange={e => this.handleChange(e, index, "Hourly", "DepositLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["B95A87AA-6F24-8F3F-322E-3AFC58101805"] && menuDetail["B95A87AA-6F24-8F3F-322E-3AFC58101805"].Visibility === "E925F86B") && //B95A87AA-6F24-8F3F-322E-3AFC58101805
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.daily" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.depositLimit && this.state.errors.depositLimit[index].Daily) ? "is-invalid" : ""}
                                                        name={"Daily" + index} value={this.state.DepositLimit[index].Daily} onChange={e => this.handleChange(e, index, "Daily", "DepositLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["5278C1BC-4783-2C1F-35D4-A6F18A940F91"] && menuDetail["5278C1BC-4783-2C1F-35D4-A6F18A940F91"].Visibility === "E925F86B") && //5278C1BC-4783-2C1F-35D4-A6F18A940F91
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.weekly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.depositLimit && this.state.errors.depositLimit[index].Weekly) ? "is-invalid" : ""}
                                                        name={"Weekly" + index} value={this.state.DepositLimit[index].Weekly} onChange={e => this.handleChange(e, index, "Weekly", "DepositLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["BB69BF03-A39E-593F-61E1-34E152E59FFF"] && menuDetail["BB69BF03-A39E-593F-61E1-34E152E59FFF"].Visibility === "E925F86B") && //BB69BF03-A39E-593F-61E1-34E152E59FFF
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.monthly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.depositLimit && this.state.errors.depositLimit[index].Monthly) ? "is-invalid" : ""}
                                                        name={"Monthly" + index} value={this.state.DepositLimit[index].Monthly} onChange={e => this.handleChange(e, index, "Monthly", "DepositLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["C5C007F9-A3CF-049B-30E9-7EF0783E0BCD"] && menuDetail["C5C007F9-A3CF-049B-30E9-7EF0783E0BCD"].Visibility === "E925F86B") && //C5C007F9-A3CF-049B-30E9-7EF0783E0BCD
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.quaterly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.depositLimit && this.state.errors.depositLimit[index].Qauterly) ? "is-invalid" : ""}
                                                        name={"Qauterly" + index} value={this.state.DepositLimit[index].Qauterly} onChange={e => this.handleChange(e, index, "Qauterly", "DepositLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        {(menuDetail["1F648B81-2F4E-239C-70D6-3309D182943D"] && menuDetail["1F648B81-2F4E-239C-70D6-3309D182943D"].Visibility === "E925F86B") && //1F648B81-2F4E-239C-70D6-3309D182943D
                                            <div className="lmt_box">
                                                <FormGroup>
                                                    <Label className=""><IntlMessages id="my_account.yearly" /><span className="text-danger">*</span></Label>
                                                    <Input type="text"
                                                        className={(this.state.errors.depositLimit && this.state.errors.depositLimit[index].Yearly) ? "is-invalid" : ""}
                                                        name={"Yearly" + index} value={this.state.DepositLimit[index].Yearly} onChange={e => this.handleChange(e, index, "Yearly", "DepositLimit")} />
                                                </FormGroup>
                                            </div>
                                        }
                                        <div className="lmt_box btn_del">
                                            <FormGroup>
                                                {this.state.DepositLimit.length > 1 && <a className="font-2x text-dark" href="javascript:void(0)" onClick={e => this.setState({ DepositLimit: this.state.DepositLimit.filter((_, i) => i !== index) })}> <i className="zmdi zmdi-delete"></i> </a>}
                                            </FormGroup>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(menuDetail).length > 0 &&
                                    <Row>
                                        <div className="col-xs-12 col-sm-12 col-md-12 justify-content-end d-inline-block">
                                            <Button variant="raised" color="primary" className="text-white" onClick={e => this.addNewColumn("DepositLimit")} > <IntlMessages id="wallet.btnAddRoutes" /> </Button>
                                        </div>
                                    </Row>
                                }
                            </div>
                        </div>
                    </Fragment>
                    {Object.keys(menuDetail).length > 0 &&
                        <FormGroup className="text-center">
                            <div className="btn_area">
                                <Button variant="raised" color="primary" className="text-white" onClick={e => this.handleSubmit(e)}> <IntlMessages id={"button.add"} /> </Button>
                                <Button variant="raised" className="ml-15 btn-danger text-white" onClick={e => this.handleCancel(e)}> <IntlMessages id="button.cancel" /> </Button>
                            </div>
                        </FormGroup>
                    }
                </JbsCollapsibleCard>
            </div >
        );
    }
}

const mapStateToProps = ({ profileConfigurationRdcer, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { data, currencyList, profileType, loading, kycLevelList, profileLevelList, ext_flag } = profileConfigurationRdcer;
    return {
        data, currencyList, profileType, loading, kycLevelList, profileLevelList, ext_flag, drawerclose, menuLoading,
        menu_rights
    };
};

export default connect(mapStateToProps, {
    addProfileConfigData, getProfileType, getKYCLevelList, getProfileLevelList, getCurrencyList,
    getMenuPermissionByID
})(AddProfileConfigDashboard);