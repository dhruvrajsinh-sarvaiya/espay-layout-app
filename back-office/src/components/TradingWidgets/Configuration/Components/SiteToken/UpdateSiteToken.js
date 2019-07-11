// Update Component for site configuration data by Tejas  8/2/2019 
import React, { Component } from 'react';

import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

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
    updateSiteToken,
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

class UpdateSiteToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateNewData: false,
            CurrencyID: this.props.selectedData.CurrencyID ? this.props.selectedData.CurrencyID : "",
            BaseCurrencyID: this.props.selectedData.BaseCurrencyID ? this.props.selectedData.BaseCurrencyID : "",
            CurrencySMSCode: this.props.selectedData.CurrencySMSCode ? this.props.selectedData.CurrencySMSCode : "",
            BaseCurrencySMSCode: this.props.selectedData.BaseCurrencySMSCode ? this.props.selectedData.BaseCurrencySMSCode : "",
            RateType: this.props.selectedData.RateType ? this.props.selectedData.RateType : 0,
            Rate: this.props.selectedData.Rate ? this.props.selectedData.Rate : 0,
            MinLimit: this.props.selectedData.MinLimit ? this.props.selectedData.MinLimit : 0,
            MaxLimit: this.props.selectedData.MaxLimit ? this.props.selectedData.MaxLimit : 0,
            DailyLimit: this.props.selectedData.DailyLimit ? this.props.selectedData.DailyLimit : 0,
            WeeklyLimit: this.props.selectedData.WeeklyLimit ? this.props.selectedData.WeeklyLimit : 0,
            MonthlyLimit: this.props.selectedData.MonthlyLimit ? this.props.selectedData.MonthlyLimit : 0,
            Note: this.props.selectedData.Note ? this.props.selectedData.Note : "",
            Status: this.props.selectedData.Status !== "" ? this.props.selectedData.Status : "",
            baseCurrencyList: [],
            rateTypes: [],
            currencyList: [],
            ID: this.props.selectedData.ID ? this.props.selectedData.ID : 0,
            IsUpdate: false,
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
        this.setState({ Status: event.target.value, IsUpdate: true });
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

        // invoke when get data from Update data response 
        if (nextprops.updateSiteToken && nextprops.updateError.length == 0 && this.state.updateNewData) {
            NotificationManager.success(<IntlMessages id="sitetoken.update.currency.success" />);
            this.setState({
                updateNewData: false,
                open: false,
                IsUpdate: false
            })
            this.props.drawerClose();
            //added by parth andhariya 
            if (this.props.ConfigurationShowCard === 1) {
                this.props.getSiteTokenList({ IsMargin: 1 });
            } else {
                this.props.getSiteTokenList({});
            }
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                updateNewData: false,
                IsUpdate: false
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

    // set request and make call for update data
    updateSiteTokenData = () => {
        const {
            CurrencyID, BaseCurrencyID,
            CurrencySMSCode, BaseCurrencySMSCode,
            Rate, MinLimit,
            RateType, MaxLimit,
            DailyLimit, WeeklyLimit,
            MonthlyLimit, Note,
            Status, ID
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
            ID: ID
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
            if (this.state.IsUpdate) {

                this.setState({
                    updateNewData: true,
                })
                //added by parth andhariya 
                if (this.props.ConfigurationShowCard === 1) {
                    data.IsMargin = 1;
                    this.props.updateSiteToken(data);
                } else {
                    this.props.updateSiteToken(data);
                }
            } else {
                NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
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
                    this.setState({ CurrencySMSCode: event.target.value, CurrencyID: value.ServiceId, IsUpdate: true });
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
                        BaseCurrencyID: value.ServiceID,
                        IsUpdate: true
                    })
                }
            }
        })
    }

    // used to set rate types
    handleChangeRateType = event => {

        this.setState({
            RateType: event.target.value,
            IsUpdate: true
        })
    }

    // used to set state
    handleChangeData = event => {
        if (validateOnlyNumeric(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value,
                IsUpdate: true
            })
        }
    }

    // used to set note data
    handleChangeNoteData = event => {
        this.setState({
            [event.target.name]: event.target.value,
            IsUpdate: true
        })
    }

    // invoke when click on close button
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            updateNewData: false,
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
            ID: 0,
            IsUpdate: false
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
        var menuDetail = this.checkAndGetMenuAccessDetail(this.props.ConfigurationShowCard === 1 ? 'DF499F0B-2096-555A-9CF0-2B2C711DA35D' : '863A3044-7582-9E9F-402C-0244217693EA');// 863A3044-7582-9E9F-402C-0244217693EA    &&  margin_GUID  DF499F0B-2096-555A-9CF0-2B2C711DA35D
        return (
            <div className="m-10 p-5">
                {(this.props.loading || this.props.loader || this.props.baseCurrencyLoader || this.props.loadingData || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="sidebar.update.siteToken" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>

                <Row>
                    <Col md={12}>
                        <Form className="m-10 tradefrm">
                            <FormGroup row>
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["5CBEE8DC-11B4-50F4-468E-065745A49B8E"] : menuDetail["B33AFA78-9A59-803E-74FD-468F88CC6ECE"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["5CBEE8DC-11B4-50F4-468E-065745A49B8E"].Visibility === "E925F86B" : menuDetail["B33AFA78-9A59-803E-74FD-468F88CC6ECE"].Visibility === "E925F86B")) && //B33AFA78-9A59-803E-74FD-468F88CC6ECE      5CBEE8DC-11B4-50F4-468E-065745A49B8E
                                    <Col sm={4} md={4} xs={12}>
                                        <Label for="curency">
                                            {<IntlMessages id="manageMarkets.list.form.label.currency" />}<span className="text-danger">*</span>
                                        </Label>

                                        <Input
                                            disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["5CBEE8DC-11B4-50F4-468E-065745A49B8E"].AccessRight === "11E6E7B0" : menuDetail["B33AFA78-9A59-803E-74FD-468F88CC6ECE"].AccessRight === "11E6E7B0") ? true : false}
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
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["DCFB2522-87FA-363D-3B3F-5FCD77035C1E"] : menuDetail["1608D05A-0E40-322E-2091-7ED4203C4ACB"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["DCFB2522-87FA-363D-3B3F-5FCD77035C1E"].Visibility === "E925F86B" : menuDetail["1608D05A-0E40-322E-2091-7ED4203C4ACB"].Visibility === "E925F86B")) && //1608D05A-0E40-322E-2091-7ED4203C4ACB      DCFB2522-87FA-363D-3B3F-5FCD77035C1E
                                    <Col sm={4} md={4} xs={12}>
                                        <Label for="basecurency">
                                            {<IntlMessages id="manageMarkets.list.form.label.basecurrency" />}<span className="text-danger">*</span>
                                        </Label>

                                        <Input
                                            disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["DCFB2522-87FA-363D-3B3F-5FCD77035C1E"].AccessRight === "11E6E7B0" : menuDetail["1608D05A-0E40-322E-2091-7ED4203C4ACB"].AccessRight === "11E6E7B0") ? true : false}
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
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["45B09833-52DB-9B25-024F-38B1B3CD365C"] : menuDetail["60AF6554-42C1-14CF-6466-95D13B526E22"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["45B09833-52DB-9B25-024F-38B1B3CD365C"].Visibility === "E925F86B" : menuDetail["60AF6554-42C1-14CF-6466-95D13B526E22"].Visibility === "E925F86B")) && //60AF6554-42C1-14CF-6466-95D13B526E22       45B09833-52DB-9B25-024F-38B1B3CD365C
                                    <Col sm={4} md={4} xs={12}>

                                        <Label for="ratetypes">
                                            {<IntlMessages id="manageMarkets.list.form.label.ratetype" />}<span className="text-danger">*</span>
                                        </Label>

                                        <Input
                                            disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["45B09833-52DB-9B25-024F-38B1B3CD365C"].AccessRight === "11E6E7B0" : menuDetail["60AF6554-42C1-14CF-6466-95D13B526E22"].AccessRight === "11E6E7B0") ? true : false}
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
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["39BAEF2F-0FD9-7501-651A-85582FF76218"] : menuDetail["8087A95E-5F44-76CB-A010-ED584DD28E36"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["39BAEF2F-0FD9-7501-651A-85582FF76218"].Visibility === "E925F86B" : menuDetail["8087A95E-5F44-76CB-A010-ED584DD28E36"].Visibility === "E925F86B")) && //8087A95E-5F44-76CB-A010-ED584DD28E36     39BAEF2F-0FD9-7501-651A-85582FF76218
                                    <Col sm={4} md={4} xs={12}>
                                        <Label for="status">
                                            <IntlMessages id="manageMarkets.list.form.label.status" />
                                        </Label>

                                        <Input
                                            disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["39BAEF2F-0FD9-7501-651A-85582FF76218"].AccessRight === "11E6E7B0" : menuDetail["8087A95E-5F44-76CB-A010-ED584DD28E36"].AccessRight === "11E6E7B0") ? true : false}
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
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["7E8C207B-0967-366E-8DC4-8241556F8CE1"] : menuDetail["F75747EF-3D49-8DCF-2E71-344B1DB777F8"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["7E8C207B-0967-366E-8DC4-8241556F8CE1"].Visibility === "E925F86B" : menuDetail["F75747EF-3D49-8DCF-2E71-344B1DB777F8"].Visibility === "E925F86B")) && //F75747EF-3D49-8DCF-2E71-344B1DB777F8       7E8C207B-0967-366E-8DC4-8241556F8CE1
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.note" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.note">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["7E8C207B-0967-366E-8DC4-8241556F8CE1"].AccessRight === "11E6E7B0" : menuDetail["F75747EF-3D49-8DCF-2E71-344B1DB777F8"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="Note"
                                                    value={this.state.Note}
                                                    onChange={this.handleChangeNoteData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>

                                    </Col>
                                }
                                {this.state.RateType === '3' && ((this.props.ConfigurationShowCard === 1 ? menuDetail["45B09833-52DB-9B25-024F-38B1B3CD365C"] : menuDetail["60AF6554-42C1-14CF-6466-95D13B526E22"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["45B09833-52DB-9B25-024F-38B1B3CD365C"].Visibility === "E925F86B" : menuDetail["60AF6554-42C1-14CF-6466-95D13B526E22"].Visibility === "E925F86B")) &&
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.rate" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.rate">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["45B09833-52DB-9B25-024F-38B1B3CD365C"].AccessRight === "11E6E7B0" : menuDetail["60AF6554-42C1-14CF-6466-95D13B526E22"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="Rate"
                                                    value={this.state.Rate}
                                                    onChange={this.handleChangeData}

                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["E4790F63-290B-8069-A18E-D1E003463878"] : menuDetail["6F5B18B4-452D-7741-48AF-7DC35B5A0662"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["E4790F63-290B-8069-A18E-D1E003463878"].Visibility === "E925F86B" : menuDetail["6F5B18B4-452D-7741-48AF-7DC35B5A0662"].Visibility === "E925F86B")) && //6F5B18B4-452D-7741-48AF-7DC35B5A0662      E4790F63-290B-8069-A18E-D1E003463878
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
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["E4790F63-290B-8069-A18E-D1E003463878"].AccessRight === "11E6E7B0" : menuDetail["6F5B18B4-452D-7741-48AF-7DC35B5A0662"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="MinLimit"
                                                    value={this.state.MinLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["E4875687-A09D-22B3-5AA0-2486F9F92074"] : menuDetail["5EED9F3D-3882-A111-A36E-EE0B9A3A7DE6"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["E4875687-A09D-22B3-5AA0-2486F9F92074"].Visibility === "E925F86B" : menuDetail["5EED9F3D-3882-A111-A36E-EE0B9A3A7DE6"].Visibility === "E925F86B")) && //5EED9F3D-3882-A111-A36E-EE0B9A3A7DE6      E4875687-A09D-22B3-5AA0-2486F9F92074
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
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["E4875687-A09D-22B3-5AA0-2486F9F92074"].AccessRight === "11E6E7B0" : menuDetail["5EED9F3D-3882-A111-A36E-EE0B9A3A7DE6"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="MaxLimit"
                                                    value={this.state.MaxLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["E994A6E0-1830-2D08-8518-58BB4B6E0974"] : menuDetail["C34B35E9-6422-54CC-249A-1B3392F98DA3"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["E994A6E0-1830-2D08-8518-58BB4B6E0974"].Visibility === "E925F86B" : menuDetail["C34B35E9-6422-54CC-249A-1B3392F98DA3"].Visibility === "E925F86B")) && //C34B35E9-6422-54CC-249A-1B3392F98DA3      E994A6E0-1830-2D08-8518-58BB4B6E0974
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.monthlylimit" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.monthlylimit">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["E994A6E0-1830-2D08-8518-58BB4B6E0974"].AccessRight === "11E6E7B0" : menuDetail["C34B35E9-6422-54CC-249A-1B3392F98DA3"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="MonthlyLimit"
                                                    value={this.state.MonthlyLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["49D2E5FB-8871-00DB-1208-4F571F491E1B"] : menuDetail["323EAB02-000A-1102-7EBF-C91346D548F9"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["49D2E5FB-8871-00DB-1208-4F571F491E1B"].Visibility === "E925F86B" : menuDetail["323EAB02-000A-1102-7EBF-C91346D548F9"].Visibility === "E925F86B")) && //323EAB02-000A-1102-7EBF-C91346D548F9       49D2E5FB-8871-00DB-1208-4F571F491E1B
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.dailylimit" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.dailylimit">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["49D2E5FB-8871-00DB-1208-4F571F491E1B"].AccessRight === "11E6E7B0" : menuDetail["323EAB02-000A-1102-7EBF-C91346D548F9"].AccessRight === "11E6E7B0") ? true : false}
                                                    name="DailyLimit"
                                                    value={this.state.DailyLimit}
                                                    onChange={this.handleChangeData}
                                                    placeholder={placeholder} ></Input>
                                            }
                                        </IntlMessages>
                                    </Col>
                                }
                                {((this.props.ConfigurationShowCard === 1 ? menuDetail["2BB2D2A8-102C-369E-0EB8-87DF052E3E36"] : menuDetail["150714D1-43A9-768E-55B8-BB7A9B9C8520"]) && (this.props.ConfigurationShowCard === 1 ? menuDetail["2BB2D2A8-102C-369E-0EB8-87DF052E3E36"].Visibility === "E925F86B" : menuDetail["150714D1-43A9-768E-55B8-BB7A9B9C8520"].Visibility === "E925F86B")) && //150714D1-43A9-768E-55B8-BB7A9B9C8520       2BB2D2A8-102C-369E-0EB8-87DF052E3E36
                                    <Col sm={4} md={4} xs={12}>
                                        <Label>
                                            <IntlMessages id="sidebar.sitetoken.weeklylimit" />
                                        </Label>
                                        <IntlMessages id="sidebar.sitetoken.weeklylimit">
                                            {(placeholder) =>
                                                <Input type="text"
                                                    disabled={(this.props.ConfigurationShowCard === 1 ? menuDetail["2BB2D2A8-102C-369E-0EB8-87DF052E3E36"].AccessRight === "11E6E7B0" : menuDetail["150714D1-43A9-768E-55B8-BB7A9B9C8520"].AccessRight === "11E6E7B0") ? true : false}
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
                                            <Button color="primary" onClick={() => this.updateSiteTokenData()} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.update" /></Button>
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
    updateSiteToken: state.siteToken.updateSiteToken,
    loading: state.siteToken.updateLoading,
    loadingData: state.siteToken.rateLoading,
    updateError: state.siteToken.updateError,
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
        updateSiteToken,
        getLedgerCurrencyList,
        getBaseCurrencyList,
        getRateTypeList,
        getMenuPermissionByID
    }
)(UpdateSiteToken);