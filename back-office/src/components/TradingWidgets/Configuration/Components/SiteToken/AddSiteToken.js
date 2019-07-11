// Add Component for site configuration data by Tejas  8/2/2019 
import React, { Component } from 'react';

// used for connect component to store
import { connect } from "react-redux";

// import components for design
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col
} from "reactstrap";

// used for backa and home button
import CloseButton from '@material-ui/core/Button';

import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

// used for apply validation for only numeric data
import {
    validateOnlyNumeric
} from "Validations/pairConfiguration";

//get data from currecy list and base currency list
import { getLedgerCurrencyList, getBaseCurrencyList } from "Actions/TradingReport";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Site Token list and and rate type list
import {
    getSiteTokenList,
    addSiteToken,
    getRateTypeList
} from "Actions/SiteToken";

// import section loader
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

// component for add token
class AddSiteToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addNewData: false,
            CurrencyID: "",
            BaseCurrencyID: "",
            CurrencySMSCode: "",
            BaseCurrencySMSCode: "",
            RateType: "",
            Rate: 0,
            MinLimit: "",
            MaxLimit: "",
            DailyLimit: 0,
            WeeklyLimit: 0,
            MonthlyLimit: 0,
            Note: "",
            Status: "",
            baseCurrencyList: [],
            rateTypes: [],
            currencyList: [],
            //added by parth andhariya 
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.ConfigurationShowCard === 1 ? '42F80880-2041-A374-078D-85E1961564F8' : '92A74EEC-89FB-9FF9-6A7C-F730BB413010'); // get Trading menu permission
    }
    // used for close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    // used for set state for chanage status
    handleChangeStatus = event => {
        this.setState({ Status: event.target.value });
    };

    // used for set state for close drawer
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };

    // will render when get new props in component
    componentWillReceiveProps(nextprops) {

        // set base currency list
        if (nextprops.baseCurrencyList) {
            this.setState({
                baseCurrencyList: nextprops.baseCurrencyList
            })
        }

        //set currency list
        if (nextprops.currencyList) {
            this.setState({
                currencyList: nextprops.currencyList
            })
        }

        //set rate types
        if (nextprops.rateTypes) {
            this.setState({
                rateTypes: nextprops.rateTypes
            })
        }

        // invoke when get data from add data response 
        if (nextprops.addSiteToken && nextprops.addError.length == 0 && this.state.addNewData) {

            NotificationManager.success(<IntlMessages id="sitetoken.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
            })
            this.props.drawerClose();
            //added by parth andhariya 
            if (this.props.ConfigurationShowCard === 1) {
                this.props.getSiteTokenList({ IsMargin: 1 });
            } else {
                this.props.getSiteTokenList({});
            }
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                addNewData: false
            })

        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                //added by parth andhariya 
                if (this.props.ConfigurationShowCard === 1) {
                    this.props.getLedgerCurrencyList({ IsMargin: 1 });
                    this.props.getBaseCurrencyList({ ActiveOnly: 1, IsMargin: 1 })
                    this.props.getRateTypeList({})
                } else {
                    this.props.getLedgerCurrencyList({});
                    this.props.getBaseCurrencyList({ ActiveOnly: 1 })
                    this.props.getRateTypeList({})
                }
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // set request and make call for add data
    addSiteTokenData = () => {

        const {
            CurrencyID, BaseCurrencyID,
            CurrencySMSCode, BaseCurrencySMSCode,
            Rate, MinLimit,
            RateType, MaxLimit,
            DailyLimit, WeeklyLimit,
            MonthlyLimit, Note,
            Status
        } = this.state;

        const data = {
            CurrencyID: CurrencyID,
            BaseCurrencyID: BaseCurrencyID,
            CurrencySMSCode: CurrencySMSCode,
            BaseCurrencySMSCode: BaseCurrencySMSCode,
            Rate: Rate !== '' ? parseFloat(Rate) : parseFloat(0),
            MinLimit: MinLimit !== '' ? parseFloat(MinLimit) : parseFloat(0),
            MaxLimit: MaxLimit !== '' ? parseFloat(MaxLimit) : parseFloat(0),
            RateType: RateType ? parseFloat(RateType) : parseFloat(0),
            DailyLimit: DailyLimit !== '' ? parseFloat(DailyLimit) : parseFloat(0),
            WeeklyLimit: WeeklyLimit !== '' ? parseFloat(WeeklyLimit) : parseFloat(0),
            MonthlyLimit: MonthlyLimit !== '' ? parseFloat(MonthlyLimit) : parseFloat(0),
            Note: Note,
            Status: Status ? parseFloat(Status) : parseFloat(0),
        };

        if (CurrencyID === "" || CurrencyID == null) {

            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.currencyId" />);
        } else if (BaseCurrencyID === "" || BaseCurrencyID == null) {

            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.basecurrencyid" />);
        } else if (RateType === "" || RateType == null) {

            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.ratetype" />);
        } else if (MinLimit !== "" && MaxLimit === '') {

            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.maxlimit" />);
        } else if (MinLimit !== "" && parseFloat(MaxLimit) < parseFloat(MinLimit)) {

            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.enter.maxLimit" />);
        } else if (Note !== '' && isScriptTag(Note)) {

            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validnote" />);
        } else if (Note !== '' && isHtmlTag(Note)) {

            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validnote" />);
        }
        else {
            this.setState({
                addNewData: true
            })
            //added by parth andhariya 
            if (this.props.ConfigurationShowCard === 1) {
                data.IsMargin = 1;
                this.props.addSiteToken(data);
            } else {
                this.props.addSiteToken(data);
            }
        }
    };

    // used to set currency id and currency name
    handleChangeCurrency = event => {

        if (event.target.value === '') {
            this.setState({
                CurrencySMSCode: event.target.value,
                CurrencyID: ''
            })
        }

        this.state.currencyList.map((value, key) => {
            if (value.SMSCode === event.target.value) {
                if (this.state.BaseCurrencyID === value.ServiceId) {

                    NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.notsame.currency" />);
                } else {
                    this.setState({ CurrencySMSCode: event.target.value, CurrencyID: value.ServiceId });
                }
            }
        })
    };

    // used to set base currency id and base currency name
    handleChangeBaseCurrency = event => {

        if (event.target.value === '') {
            this.setState({
                BaseCurrencySMSCode: event.target.value,
                BaseCurrencyID: ""
            })
        }

        this.state.baseCurrencyList.map((value, key) => {
            if (value.CurrencyName === event.target.value) {
                if (this.state.CurrencyID === value.ServiceID) {

                    NotificationManager.error(<IntlMessages id="sidebar.sitetoken.list.lable.enter.notsame.currency" />);
                } else {
                    this.setState({
                        BaseCurrencySMSCode: event.target.value,
                        BaseCurrencyID: value.ServiceID
                    })
                }
            }

        })
    }

    // used to set rate types
    handleChangeRateType = event => {
        this.setState({
            RateType: event.target.value
        })
    }

    // used to set state
    handleChangeData = event => {
        if (validateOnlyNumeric(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value
            })
        }
    }

    // used to set note data
    handleChangeNoteData = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    // invoke when click on close button
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            addNewData: false,
            CurrencyID: "",
            BaseCurrencyID: "",
            CurrencySMSCode: "",
            BaseCurrencySMSCode: "",
            RateType: 0,
            Rate: 0,
            MinLimit: 0,
            MaxLimit: 0,
            DailyLimit: 0,
            WeeklyLimit: 0,
            MonthlyLimit: 0,
            Note: "",
            Status: "",
            baseCurrencyList: [],
            rateTypes: [],
            currencyList: [],
        });
    };
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
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? '3AE6A18B-6572-5C14-6D29-AB56F981A57A' : '65220C3F-9441-731C-0314-F877DE9252E5');//65220C3F-9441-731C-0314-F877DE9252E5   &&  margin_GUID  3AE6A18B-6572-5C14-6D29-AB56F981A57A
        return (
            <div className="m-10 p-5">
                {(this.props.loading || this.props.loader || this.props.baseCurrencyLoader || this.props.loadingData || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="sidebar.add.siteToken" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>

                <Row>
                    <Col md={12}>
                        <Form className="m-10 tradefrm">
                            <FormGroup row>
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["28A5754B-140A-3EFE-6421-5EC07DB56F26"] : menuDetail["B55175C7-4BF0-5216-A420-B91870B230FF"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["28A5754B-140A-3EFE-6421-5EC07DB56F26"].Visibility === "E925F86B" : menuDetail["B55175C7-4BF0-5216-A420-B91870B230FF"].Visibility === "E925F86B")) && //B55175C7-4BF0-5216-A420-B91870B230FF      28A5754B-140A-3EFE-6421-5EC07DB56F26
                                    <Col sm={4} md={4} xs={12}>
                                        <Label for="curency">
                                            {<IntlMessages id="manageMarkets.list.form.label.currency" />}<span className="text-danger">*</span>
                                        </Label>
                                        <Input
                                            disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["28A5754B-140A-3EFE-6421-5EC07DB56F26"].AccessRight === "11E6E7B0" : menuDetail["B55175C7-4BF0-5216-A420-B91870B230FF"].AccessRight === "11E6E7B0") ? true : false}
                                            type="select"
                                            name="currency"
                                            value={this.state.CurrencySMSCode}
                                            onChange={(e) => this.handleChangeCurrency(e)}
                                        >
                                            <IntlMessages id="sidebar.sitetoken.list.lable.enter.select">
                                                {(select) =>
                                                    <option value="">{select}</option>
                                                }
                                            </IntlMessages>
                                            {this.state.currencyList.length > 0 && this.state.currencyList.map((item, key) => (
                                                <option
                                                    value={item.SMSCode}
                                                    key={key}
                                                >
                                                    {item.SMSCode}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["CD6A4DE7-5EDE-2630-A2FC-10C35F710AC4"] : menuDetail["A4B693F5-0276-1D5F-3520-9130DA785D42"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["CD6A4DE7-5EDE-2630-A2FC-10C35F710AC4"].Visibility === "E925F86B" : menuDetail["A4B693F5-0276-1D5F-3520-9130DA785D42"].Visibility === "E925F86B")) && //A4B693F5-0276-1D5F-3520-9130DA785D42        CD6A4DE7-5EDE-2630-A2FC-10C35F710AC4
                                    <Col sm={4} md={4} xs={12}>
                                        <Label for="basecurency">
                                            {<IntlMessages id="manageMarkets.list.form.label.basecurrency" />}<span className="text-danger">*</span>
                                        </Label>
                                        <Input
                                            disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["CD6A4DE7-5EDE-2630-A2FC-10C35F710AC4"].AccessRight === "11E6E7B0" : menuDetail["A4B693F5-0276-1D5F-3520-9130DA785D42"].AccessRight === "11E6E7B0") ? true : false}
                                            type="select"
                                            name="basecurrency"
                                            value={this.state.BaseCurrencySMSCode}
                                            onChange={(e) => this.handleChangeBaseCurrency(e)}
                                        >
                                            <IntlMessages id="sidebar.sitetoken.list.lable.enter.select">
                                                {(select) =>
                                                    <option value="">{select}</option>
                                                }
                                            </IntlMessages>

                                            {this.state.baseCurrencyList.length > 0 && this.state.baseCurrencyList.map((item, key) => (
                                                <option
                                                    value={item.CurrencyName}
                                                    key={key}
                                                >
                                                    {item.CurrencyName}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["BC536FD1-55E1-99AB-A43D-EFC21D104155"] : menuDetail["9A5DAE84-8DAB-2878-7CCB-DDF0985812A2"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["BC536FD1-55E1-99AB-A43D-EFC21D104155"].Visibility === "E925F86B" : menuDetail["9A5DAE84-8DAB-2878-7CCB-DDF0985812A2"].Visibility === "E925F86B")) && //9A5DAE84-8DAB-2878-7CCB-DDF0985812A2         BC536FD1-55E1-99AB-A43D-EFC21D104155
                                    <Col sm={4} md={4} xs={12}>
                                        <Label for="ratetypes">
                                            {<IntlMessages id="manageMarkets.list.form.label.ratetype" />}<span className="text-danger">*</span>
                                        </Label>
                                        <Input
                                            disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["BC536FD1-55E1-99AB-A43D-EFC21D104155"].AccessRight === "11E6E7B0" : menuDetail["9A5DAE84-8DAB-2878-7CCB-DDF0985812A2"].AccessRight === "11E6E7B0") ? true : false}
                                            type="select"
                                            name="ratetypes"
                                            value={this.state.RateType}
                                            onChange={(e) => this.handleChangeRateType(e)}
                                        >
                                            <IntlMessages id="sidebar.sitetoken.list.lable.enter.select">
                                                {(select) =>
                                                    <option value="">{select}</option>
                                                }
                                            </IntlMessages>
                                            {this.state.rateTypes.length > 0 && this.state.rateTypes.map((item, key) => (
                                                <option
                                                    value={item.Id}
                                                    key={key}
                                                >
                                                    {item.SiteTokenType}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["2712D375-65C2-7E26-5736-83E5BAE37B32"] : menuDetail["F85F08C7-5759-51B0-36AD-32545472392F"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["2712D375-65C2-7E26-5736-83E5BAE37B32"].Visibility === "E925F86B" : menuDetail["F85F08C7-5759-51B0-36AD-32545472392F"].Visibility === "E925F86B")) && //F85F08C7-5759-51B0-36AD-32545472392F       2712D375-65C2-7E26-5736-83E5BAE37B32
                                    <Col sm={4} md={4} xs={12}>
                                        <Label for="status">
                                            <IntlMessages id="manageMarkets.list.form.label.status" />
                                        </Label>

                                        <Input
                                            disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["2712D375-65C2-7E26-5736-83E5BAE37B32"].AccessRight === "11E6E7B0" : menuDetail["F85F08C7-5759-51B0-36AD-32545472392F"].AccessRight === "11E6E7B0") ? true : false}
                                            type="select"
                                            name="status"
                                            value={this.state.Status}
                                            onChange={(e) => this.handleChangeStatus(e)}
                                        >
                                            <IntlMessages id="trading.pairconfig.placeholder.selectstatus">
                                                {(select) =>
                                                    <option value="">{select}</option>
                                                }
                                            </IntlMessages>

                                            <IntlMessages id="manageMarkets.list.column.label.status.active">
                                                {(select) =>
                                                    <option value="1">{select}</option>
                                                }
                                            </IntlMessages>

                                            <IntlMessages id="manageMarkets.list.column.label.status.inactive">
                                                {(select) =>
                                                    <option value="0">{select}</option>
                                                }
                                            </IntlMessages>
                                        </Input>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["637B800C-4091-2287-70B7-31B5BAD68DCA"] : menuDetail["E56F9472-3602-45E6-7383-E4F064A03EF1"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["637B800C-4091-2287-70B7-31B5BAD68DCA"].Visibility === "E925F86B" : menuDetail["E56F9472-3602-45E6-7383-E4F064A03EF1"].Visibility === "E925F86B")) && //E56F9472-3602-45E6-7383-E4F064A03EF1       637B800C-4091-2287-70B7-31B5BAD68DCA
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.note" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.note">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["637B800C-4091-2287-70B7-31B5BAD68DCA"].AccessRight === "11E6E7B0" : menuDetail["E56F9472-3602-45E6-7383-E4F064A03EF1"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="Note"
                                                    value={this.state.Note}
                                                    onChange={this.handleChangeNoteData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {this.state.RateType === '3' && ((this.props.ConfigurationShowCard === 1 ? menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"] : menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B" : menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].Visibility === "E925F86B")) &&
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.rate" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.rate">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 && menuDetail["27d380c0-5233-33d6-32e6-9e3b394b7679"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="Rate"
                                                    value={this.state.Rate}
                                                    onChange={this.handleChangeData}

                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["3749D7B4-340A-7A9E-6D52-60A66A3A368A"] : menuDetail["FA884593-5ACD-0648-2811-02354E3F5023"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["3749D7B4-340A-7A9E-6D52-60A66A3A368A"].Visibility === "E925F86B" : menuDetail["FA884593-5ACD-0648-2811-02354E3F5023"].Visibility === "E925F86B")) && //FA884593-5ACD-0648-2811-02354E3F5023       3749D7B4-340A-7A9E-6D52-60A66A3A368A
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.minlimit" />
                                            {"           "}
                                            <Tooltip title={<IntlMessages id="sidebar.sitetoken.minLimitLabelInfo" />}
                                                disableFocusListener
                                                disableTouchListener
                                            >
                                                <a href="javascript:void(0)"
                                                    className="ml-10"
                                                >
                                                    <i className="fa fa-info-circle" />
                                                </a>
                                            </Tooltip>
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.minlimit">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["3749D7B4-340A-7A9E-6D52-60A66A3A368A"].AccessRight === "11E6E7B0" : menuDetail["FA884593-5ACD-0648-2811-02354E3F5023"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="MinLimit"
                                                    value={this.state.MinLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["C887F86E-74E0-431F-11D5-BA87B40A6CE6"] : menuDetail["A6AE2CBF-1F6D-0B6A-6BFE-B302F6AE3FB0"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["C887F86E-74E0-431F-11D5-BA87B40A6CE6"].Visibility === "E925F86B" : menuDetail["A6AE2CBF-1F6D-0B6A-6BFE-B302F6AE3FB0"].Visibility === "E925F86B")) && //A6AE2CBF-1F6D-0B6A-6BFE-B302F6AE3FB0       C887F86E-74E0-431F-11D5-BA87B40A6CE6
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.maxlimit" />
                                            {"           "}
                                            <Tooltip title={<IntlMessages id="sidebar.sitetoken.maxLimitLabelInfo" />}
                                                disableFocusListener
                                                disableTouchListener
                                            >
                                                <a href="javascript:void(0)"
                                                    className="ml-10"
                                                >
                                                    <i className="fa fa-info-circle" />
                                                </a>
                                            </Tooltip>
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.maxlimit">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["C887F86E-74E0-431F-11D5-BA87B40A6CE6"].AccessRight === "11E6E7B0" : menuDetail["A6AE2CBF-1F6D-0B6A-6BFE-B302F6AE3FB0"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="MaxLimit"
                                                    value={this.state.MaxLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["9A26E9A1-69B5-5427-4CFF-4C517DBA2447"] : menuDetail["4A81DCC5-6D72-64DC-4261-511EC2854E19"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["9A26E9A1-69B5-5427-4CFF-4C517DBA2447"].Visibility === "E925F86B" : menuDetail["4A81DCC5-6D72-64DC-4261-511EC2854E19"].Visibility === "E925F86B")) && //4A81DCC5-6D72-64DC-4261-511EC2854E19       9A26E9A1-69B5-5427-4CFF-4C517DBA2447
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.monthlylimit" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.monthlylimit">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["9A26E9A1-69B5-5427-4CFF-4C517DBA2447"].AccessRight === "11E6E7B0" : menuDetail["4A81DCC5-6D72-64DC-4261-511EC2854E19"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="MonthlyLimit"
                                                    value={this.state.MonthlyLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["457A61BC-11EE-9C6B-6042-AA0EAABD2B9E"] : menuDetail["A079DE74-8A82-4E9F-9B8A-696728A673DD"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["457A61BC-11EE-9C6B-6042-AA0EAABD2B9E"].Visibility === "E925F86B" : menuDetail["A079DE74-8A82-4E9F-9B8A-696728A673DD"].Visibility === "E925F86B")) && //A079DE74-8A82-4E9F-9B8A-696728A673DD       457A61BC-11EE-9C6B-6042-AA0EAABD2B9E
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.dailylimit" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.dailylimit">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["457A61BC-11EE-9C6B-6042-AA0EAABD2B9E"].AccessRight === "11E6E7B0" : menuDetail["A079DE74-8A82-4E9F-9B8A-696728A673DD"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="DailyLimit"
                                                    value={this.state.DailyLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["D8616443-4C23-A4BF-1CDD-B82C29926687"] : menuDetail["C3DDDBFB-651B-8BAB-936E-CCA9E3DD024F"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["D8616443-4C23-A4BF-1CDD-B82C29926687"].Visibility === "E925F86B" : menuDetail["C3DDDBFB-651B-8BAB-936E-CCA9E3DD024F"].Visibility === "E925F86B")) && //C3DDDBFB-651B-8BAB-936E-CCA9E3DD024F       D8616443-4C23-A4BF-1CDD-B82C29926687
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.weeklylimit" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.weeklylimit">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["D8616443-4C23-A4BF-1CDD-B82C29926687"].AccessRight === "11E6E7B0" : menuDetail["C3DDDBFB-651B-8BAB-936E-CCA9E3DD024F"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="WeeklyLimit"
                                                    value={this.state.WeeklyLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                            </FormGroup>
                            <hr />
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                                        <div className="btn_area">
                                            <Button color="primary" onClick={() => this.addSiteTokenData()} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.add" /></Button>
                                            <Button color="danger" className="ml-15" onClick={() => this.resetData()} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.cancel" /></Button>
                                        </div>
                                    </div>
                                </FormGroup>
                            }
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    addSiteToken: state.siteToken.addSiteToken,
    loading: state.siteToken.addLoading,
    loadingData: state.siteToken.rateLoading,
    addError: state.siteToken.addError,
    currencyList: state.tradingledgerReducer.currencyList,
    baseCurrencyList: state.tradingledgerReducer.baseCurrencyList,
    rateTypes: state.siteToken.rateTypeList,
    loader: state.tradingledgerReducer.loading,
    baseCurrencyLoader: state.tradingledgerReducer.baseLoader,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getSiteTokenList,
        addSiteToken,
        getLedgerCurrencyList,
        getBaseCurrencyList,
        getRateTypeList,
        getMenuPermissionByID
    }
)(AddSiteToken);