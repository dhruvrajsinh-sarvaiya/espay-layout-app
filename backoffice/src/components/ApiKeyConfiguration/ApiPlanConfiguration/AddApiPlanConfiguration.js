// comoponent for Add Api PLan Config By Tejas 22/2/2019

// import react and component for render the new component
import React from 'react';
// used for connect component to store
import { connect } from "react-redux";
// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";
import { Editor } from "@tinymce/tinymce-react";
// import for design
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
// import button and set design
import CloseButton from '@material-ui/core/Button';
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import { getLedgerCurrencyList } from "Actions/TradingReport";
import { isScriptTag } from "Helpers/helpers";
// import action for fetch Api plan configuration list
import { addApiPlanConfigData, getApiPlanConfigList } from "Actions/ApiKeyConfiguration";
// import for validate numbers in add data
import { validateOnlyNumeric, validateOnlyInteger, validateOnlyAlphaNumeric, validateOnlyFloat } from "Validations/pairConfiguration";
// used for display laoder on page
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
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

class AddApiPlan extends React.Component {
    // constructor
    constructor(props) {
        super(props);
        //define  default state
        this.state = {
            addNewData: false,
            planName: "",
            Price: "",
            charge: "",
            planValidity: "",
            plandescription: "",
            maxPerMin: "",
            maxPerDay: "",
            maxPerMonth: "",
            maxOrderPerSec: "",
            maxRecPerRequest: "",
            maxReqSize: "",
            maxResSize: "",
            whiteListEndPoints: "",
            concurrentEndPoints: "",
            historicalDataMonth: "",
            isRecursive: false,
            priority: "",
            planValidityType: "",
            Status: 1,
            readOnlyApi: [],
            FullAccessAPi: [],
            restApiReadOnly: props.restApiReadOnly ? props.restApiReadOnly : [],
            restApiFullAccess: props.restApiFullAccess ? props.restApiFullAccess : [],
            selectedCurrency: "",
            notificationFlag: true,
            menudetail: [],
        }
    }

    // Handle Checkbox for display particular currency Data
    handleChangeIsRecursive = event => {
        this.setState({ isRecursive: !this.state.isRecursive });
    };

    // componentDidMount() {
    //     this.props.getLedgerCurrencyList({ ActiveOnly: 1 });
    // }

    //request for add data of Plan Comfiguration
    addAPIPlanConfigData = () => {
        const {
            planName,
            Price,
            charge,
            planValidity,
            plandescription,
            maxPerMin,
            maxPerDay,
            maxPerMonth,
            maxOrderPerSec,
            maxRecPerRequest,
            maxReqSize,
            maxResSize,
            whiteListEndPoints,
            concurrentEndPoints,
            historicalDataMonth,
            Status,
            readOnlyApi,
            FullAccessAPi,
            priority,
            planValidityType,
            isRecursive,
            selectedCurrency
        } = this.state;

        const data = {
            PlanName: planName !== "" ? planName : "",
            Price: Price !== "" ? parseFloat(Price) : parseFloat(0),
            Charge: charge !== "" ? parseFloat(charge) : parseFloat(0),
            PlanValidity: planValidity !== "" ? parseInt(planValidity) : parseInt(0),
            PlanDesc: plandescription !== "" ? plandescription : "",
            MaxPerMinute: maxPerMin !== "" ? parseInt(maxPerMin) : parseInt(0),
            MaxPerDay: maxPerDay !== "" ? parseInt(maxPerDay) : parseInt(0),
            MaxPerMonth: maxPerMonth !== "" ? parseInt(maxPerMonth) : parseInt(0),
            MaxOrderPerSec: maxOrderPerSec !== "" ? parseInt(maxOrderPerSec) : parseInt(0),
            MaxRecPerRequest: maxRecPerRequest !== "" ? parseInt(maxRecPerRequest) : parseInt(0),
            MaxReqSize: maxReqSize !== "" ? parseInt(maxReqSize) : parseInt(0),
            MaxResSize: maxResSize !== "" ? parseInt(maxResSize) : parseInt(0),
            WhitelistedEndPoints: whiteListEndPoints !== "" ? parseInt(whiteListEndPoints) : parseInt(0),
            ConcurrentEndPoints: concurrentEndPoints !== "" ? parseInt(concurrentEndPoints) : parseInt(0),
            HistoricalDataMonth: historicalDataMonth !== "" ? parseInt(historicalDataMonth) : parseInt(0),
            PlanValidityType: planValidityType !== "" ? parseInt(planValidityType) : parseInt(0),
            Priority: priority !== "" ? parseInt(priority) : parseInt(0),
            IsPlanRecursive: isRecursive ? parseInt(1) : parseInt(0),
            ReadonlyAPI: readOnlyApi ? readOnlyApi : [],
            FullAccessAPI: FullAccessAPi ? FullAccessAPi : [],
            Status: Status !== "" ? parseInt(Status) : parseInt(0),
            ServiceID: selectedCurrency !== "" ? parseInt(selectedCurrency) : parseInt(0)
        };

        if (planName === "" || planName == null) {
            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.list.lable.enter.planname" />);
        } else if (Status === "" || Status == null) {
            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status" />);
        } else if (planName !== '' && isScriptTag(planName)) {
            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validplanname" />);
        } else if (Price !== "" && !validateOnlyFloat(Price)) {
            NotificationManager.error(<IntlMessages id="sidebar.apiplan.enter.valid.price" />);
        } else if (charge !== "" && !validateOnlyFloat(charge)) {
            NotificationManager.error(<IntlMessages id="sidebar.apiplan.enter.valid.charge" />);
        } else if (priority === "" || parseFloat(priority) === 0) {
            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validpriority" />);
        } else if (selectedCurrency === "" || selectedCurrency == null) {
            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.marketCurrency" />);
        } else if (planValidityType === "" || parseFloat(planValidityType) === 0) {
            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validplanvalitytype" />);
        } else if (planValidity === "" || parseFloat(planValidity) === 0) {
            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validplanvality" />);
        } else if (plandescription !== '' && isScriptTag(plandescription)) {
            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validplandesc" />);
        } else if (parseFloat(planValidityType) === 1 && parseFloat(planValidity) > 31) {
            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validdays" />);
        } else if (parseFloat(planValidityType) === 2 && parseFloat(planValidity) > 12) {
            NotificationManager.error(<IntlMessages id="sidebar.sitetoken.note.enter.validmonth" />);
        }
        else {
            this.setState({
                addNewData: true
            })
            this.props.addApiPlanConfigData(data);
        }
    }

    // used to handle change event of select Wallet
    handleChangeCurrency = event => {
        this.setState({ selectedCurrency: event.target.value });
    };

    // reset data on cancel or close drawer
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            addNewData: false,
            planName: "",
            Price: "",
            charge: "",
            planValidity: "",
            plandescription: "",
            maxPerMin: "",
            maxPerDay: "",
            maxPerMonth: "",
            maxOrderPerSec: "",
            maxRecPerRequest: "",
            maxReqSize: "",
            maxResSize: "",
            whiteListEndPoints: "",
            concurrentEndPoints: "",
            historicalDataMonth: "",
            isRecursive: false,
            priority: "",
            planValidityType: "",
            Status: 1,
            readOnlyApi: [],
            FullAccessAPi: [],
            restApiReadOnly: [],
            restApiFullAccess: [],
            selectedCurrency: ""
        })
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('FD169CF2-5F24-8A1D-7E08-24C6F2801E07'); // get Trading menu permission
    }
    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {
        // set rest apis 
        if (nextprops.restApiReadOnly) {
            this.setState({
                restApiReadOnly: nextprops.restApiReadOnly
            })
        }
        // set rest apis 
        if (nextprops.restApiFullAccess) {
            this.setState({
                restApiFullAccess: nextprops.restApiFullAccess
            })
        }
        // display success or failure message when call api for add new data
        if (nextprops.addApiConfigList && nextprops.addError.length === 0 && this.state.addNewData) {
            NotificationManager.success(<IntlMessages id="apiplanconfiguration.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
            })
            this.props.drawerClose();
            this.props.getApiPlanConfigList({});
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                addNewData: false
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.props.getLedgerCurrencyList({ ActiveOnly: 1 });
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // handle and set state for read only methods
    handleChangeRestMethodsReadOnly = event => {
        var options = event.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(parseInt(options[i].value));
            }
        }
        this.setState({
            readOnlyApi: value
        })
    }

    // handle and set state for full access methods
    handleChangeRestMethodsFullAccess = event => {
        var options = event.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(parseInt(options[i].value));
            }
        }
        this.setState({
            FullAccessAPi: value
        })
    }

    // set data or state for Api Name
    handlePlanName = (event) => {
        if (validateOnlyAlphaNumeric(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value
            })
        }
    }

    // set data or state for Api Name
    handleDataChange = (event) => {
        if (validateOnlyInteger(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value
            })
        }
    }

    // validate Float value
    HandleChangePrice = (event) => {
        if (validateOnlyNumeric(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value
            })
        }
    }

    // validate Float value
    validateFloatData = (event) => {
        if (!validateOnlyFloat(event.target.value) && event.target.value !== '') {
            NotificationManager.error(<IntlMessages id={`sidebar.apiplan.enter.price`} values={{ Param1: [event.target.name] }} />)
            this.setState({
                [event.target.name]: ""
            })
        }
    }

    // set data or state for Api Name
    handlePlanDesc = (event, value) => {
        this.setState({
            plandescription: value
        })
    }

    // set state for status 
    handleChangeStatus = event => {
        this.setState({ Status: event.target.value });
    };

    // set state for status 
    handleChangePlanValidityType = event => {
        this.setState({ planValidityType: event.target.value });
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
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }
    // render the component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('BB50CE7C-41A1-1D58-21D4-034001C15CF5');//BB50CE7C-41A1-1D58-21D4-034001C15CF5
        // returns the component
        return (
            <div className="m-10 p-5">
                {(this.props.currencyLoader || this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="sidebar.APIPlanConfiguration.add" /></h2>
                    </div>
                    <div className="page-title-wrap">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                <Form className="m-20 tradefrm">
                    <FormGroup className="row">
                        {((menuDetail["1787D254-3EF4-3C67-6CAA-96503C988C93"]) && (menuDetail["1787D254-3EF4-3C67-6CAA-96503C988C93"].Visibility === "E925F86B")) && //1787D254-3EF4-3C67-6CAA-96503C988C93
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.planname" />
                                    <span className="text-danger">*</span>
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.planname">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["1787D254-3EF4-3C67-6CAA-96503C988C93"].AccessRight === "11E6E7B0") ? true : false}
                                            name="planName"
                                            value={this.state.planName}
                                            onChange={this.handlePlanName}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["48CE2A19-22A4-01FD-6428-E49F757539C2"]) && (menuDetail["48CE2A19-22A4-01FD-6428-E49F757539C2"].Visibility === "E925F86B")) && //48CE2A19-22A4-01FD-6428-E49F757539C2
                            <Col md={3} sm={6} xs={12}>
                                <Label for="status">
                                    <IntlMessages id="apiplanconfiguration.title.planvaliditytype" />
                                    <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail["48CE2A19-22A4-01FD-6428-E49F757539C2"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="status"
                                    value={this.state.planValidityType}
                                    onChange={(e) => this.handleChangePlanValidityType(e)}
                                >
                                    <IntlMessages id="sidebar.sitetoken.list.lable.enter.select">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.day">
                                        {(select) =>
                                            <option value="1">{select}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.month">
                                        {(select) =>
                                            <option value="2">{select}</option>
                                        }
                                    </IntlMessages>
                                    <IntlMessages id="sidebar.year">
                                        {(select) =>
                                            <option value="3">{select}</option>
                                        }
                                    </IntlMessages>
                                </Input>
                            </Col>
                        }
                        {((menuDetail["EF7E22D3-26CF-488E-4691-EFFE2A434EE4"]) && (menuDetail["EF7E22D3-26CF-488E-4691-EFFE2A434EE4"].Visibility === "E925F86B")) && //EF7E22D3-26CF-488E-4691-EFFE2A434EE4
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.planvalidity" />
                                    <span className="text-danger">*</span>
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.planvalidity">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["EF7E22D3-26CF-488E-4691-EFFE2A434EE4"].AccessRight === "11E6E7B0") ? true : false}
                                            name="planValidity"
                                            value={this.state.planValidity}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["13BDCCFE-1FFF-0AF4-3866-AABC301E61B8"]) && (menuDetail["13BDCCFE-1FFF-0AF4-3866-AABC301E61B8"].Visibility === "E925F86B")) && //13BDCCFE-1FFF-0AF4-3866-AABC301E61B8
                            <Col md={3} sm={6} xs={12}>
                                <Label for="wallets">

                                    <IntlMessages id="table.currency" />
                                    <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail["13BDCCFE-1FFF-0AF4-3866-AABC301E61B8"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="selectedCurrency"
                                    value={this.state.selectedCurrency}
                                    onChange={this.handleChangeCurrency}
                                >
                                    <IntlMessages id="sidebar.pleaseSelect">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>
                                    {this.props.currencyList && this.props.currencyList.length && this.props.currencyList.map((item, key) => (
                                        <option
                                            value={item.ServiceId}
                                            key={key}
                                        >
                                            {item.SMSCode}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        }
                    </FormGroup>

                    <FormGroup className="row">
                        {((menuDetail["E5573065-4365-9EE7-93BE-36D7ABFC311B"]) && (menuDetail["E5573065-4365-9EE7-93BE-36D7ABFC311B"].Visibility === "E925F86B")) && //E5573065-4365-9EE7-93BE-36D7ABFC311B
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="widgets.price" />
                                </Label>
                                <IntlMessages id="widgets.price">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["E5573065-4365-9EE7-93BE-36D7ABFC311B"].AccessRight === "11E6E7B0") ? true : false}
                                            name="Price"
                                            value={this.state.Price}
                                            onChange={this.HandleChangePrice}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["C4D7E5A0-8351-1207-2475-22732176355E"]) && (menuDetail["C4D7E5A0-8351-1207-2475-22732176355E"].Visibility === "E925F86B")) && //C4D7E5A0-8351-1207-2475-22732176355E
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="table.charge" />
                                </Label>
                                <IntlMessages id="table.charge">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["C4D7E5A0-8351-1207-2475-22732176355E"].AccessRight === "11E6E7B0") ? true : false}
                                            name="charge"
                                            value={this.state.charge}
                                            onChange={this.HandleChangePrice}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["4565E747-6C32-686D-1A14-A1E3AF7C5D8B"]) && (menuDetail["4565E747-6C32-686D-1A14-A1E3AF7C5D8B"].Visibility === "E925F86B")) && //4565E747-6C32-686D-1A14-A1E3AF7C5D8B
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxpermin" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxpermin">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["4565E747-6C32-686D-1A14-A1E3AF7C5D8B"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxPerMin"
                                            value={this.state.maxPerMin}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["DA4D2862-0949-249B-3325-30D2EB7601A8"]) && (menuDetail["DA4D2862-0949-249B-3325-30D2EB7601A8"].Visibility === "E925F86B")) && //DA4D2862-0949-249B-3325-30D2EB7601A8
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxperday" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxperday">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["DA4D2862-0949-249B-3325-30D2EB7601A8"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxPerDay"
                                            value={this.state.maxPerDay}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                    </FormGroup>

                    <FormGroup className="row">
                        {((menuDetail["DFC316FA-2601-597F-9188-125ACF219858"]) && (menuDetail["DFC316FA-2601-597F-9188-125ACF219858"].Visibility === "E925F86B")) && //DFC316FA-2601-597F-9188-125ACF219858
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxpermonth" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxpermonth">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["DFC316FA-2601-597F-9188-125ACF219858"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxPerMonth"
                                            value={this.state.maxPerMonth}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["AB9267EB-1D5D-0559-7662-3E29BBA113FD"]) && (menuDetail["AB9267EB-1D5D-0559-7662-3E29BBA113FD"].Visibility === "E925F86B")) && //AB9267EB-1D5D-0559-7662-3E29BBA113FD
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxorderpersec" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxorderpersec">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["AB9267EB-1D5D-0559-7662-3E29BBA113FD"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxOrderPerSec"
                                            value={this.state.maxOrderPerSec}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["692EEFFA-4D0A-80BB-14C6-E87B0F6150B5"]) && (menuDetail["692EEFFA-4D0A-80BB-14C6-E87B0F6150B5"].Visibility === "E925F86B")) && //692EEFFA-4D0A-80BB-14C6-E87B0F6150B5
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxrecperrequest" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxrecperrequest">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["692EEFFA-4D0A-80BB-14C6-E87B0F6150B5"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxRecPerRequest"
                                            value={this.state.maxRecPerRequest}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["1173B26A-7384-43FF-4DEA-2E6BF1D65855"]) && (menuDetail["1173B26A-7384-43FF-4DEA-2E6BF1D65855"].Visibility === "E925F86B")) && //1173B26A-7384-43FF-4DEA-2E6BF1D65855
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxreqsize" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxreqsize">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["1173B26A-7384-43FF-4DEA-2E6BF1D65855"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxReqSize"
                                            value={this.state.maxReqSize}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                    </FormGroup>

                    <FormGroup className="row">
                        {((menuDetail["EE7F9DD5-1EBE-9EDB-3BA9-4DCDB4963EF0"]) && (menuDetail["EE7F9DD5-1EBE-9EDB-3BA9-4DCDB4963EF0"].Visibility === "E925F86B")) && //EE7F9DD5-1EBE-9EDB-3BA9-4DCDB4963EF0
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxressize" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxressize">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["EE7F9DD5-1EBE-9EDB-3BA9-4DCDB4963EF0"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxResSize"
                                            value={this.state.maxResSize}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["CBE8A66A-9B01-0CFC-7740-3149CA122C1C"]) && (menuDetail["CBE8A66A-9B01-0CFC-7740-3149CA122C1C"].Visibility === "E925F86B")) && //CBE8A66A-9B01-0CFC-7740-3149CA122C1C
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.whitelistendpoints" />

                                    {"           "}
                                    <Tooltip title={<IntlMessages id="exchangefeed.tooltip.whitelist" />}
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
                                <IntlMessages id="apiplanconfiguration.title.whitelistendpoints">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["CBE8A66A-9B01-0CFC-7740-3149CA122C1C"].AccessRight === "11E6E7B0") ? true : false}
                                            name="whiteListEndPoints"
                                            value={this.state.whiteListEndPoints}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["3D357201-217C-A216-7B91-B3FDFFF33EF2"]) && (menuDetail["3D357201-217C-A216-7B91-B3FDFFF33EF2"].Visibility === "E925F86B")) && //3D357201-217C-A216-7B91-B3FDFFF33EF2
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.councurrentendpoints" />

                                    {"           "}
                                    <Tooltip title={<IntlMessages id="exchangefeed.tooltip.concurrent" />}
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
                                <IntlMessages id="apiplanconfiguration.title.councurrentendpoints">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["3D357201-217C-A216-7B91-B3FDFFF33EF2"].AccessRight === "11E6E7B0") ? true : false}
                                            name="concurrentEndPoints"
                                            value={this.state.concurrentEndPoints}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["9D162853-21DC-579C-4CBA-CC6C112D6220"]) && (menuDetail["9D162853-21DC-579C-4CBA-CC6C112D6220"].Visibility === "E925F86B")) && //9D162853-21DC-579C-4CBA-CC6C112D6220
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.historicaldatamonth" />

                                    {"           "}
                                    <Tooltip title={<IntlMessages id="exchangefeed.tooltip.historical" />}
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
                                <IntlMessages id="apiplanconfiguration.title.historicaldatamonth">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["9D162853-21DC-579C-4CBA-CC6C112D6220"].AccessRight === "11E6E7B0") ? true : false}
                                            name="historicalDataMonth"
                                            value={this.state.historicalDataMonth}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                    </FormGroup>

                    <FormGroup className="row">
                        {((menuDetail["0DC1BC3D-3515-A19D-06C9-9D4776BF3D6E"]) && (menuDetail["0DC1BC3D-3515-A19D-06C9-9D4776BF3D6E"].Visibility === "E925F86B")) && //0DC1BC3D-3515-A19D-06C9-9D4776BF3D6E
                            <Col md={6} sm={6} xs={12}>
                                <Label for="readOnlyApi" className="d-inline">
                                    {<IntlMessages id="apiplanconfiguration.title.readonlyapi" />}

                                    {"           "}
                                    <Tooltip title={<IntlMessages id="exchangefeed.tooltip.readonly" />}
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
                                <Input
                                    disabled={(menuDetail["0DC1BC3D-3515-A19D-06C9-9D4776BF3D6E"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="readOnlyApi"
                                    multiple="multiple"
                                    value={this.state.readOnlyApi}
                                    onChange={this.handleChangeRestMethodsReadOnly}
                                >
                                    <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.trntype">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>

                                    {this.state.restApiReadOnly.length && this.state.restApiReadOnly.map((item, key) => (
                                        <option
                                            value={item.ID}
                                            key={key}
                                        >
                                            {item.MethodName}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        }
                        {((menuDetail["AA361464-9CEB-6EA5-1AE9-995C267C485A"]) && (menuDetail["AA361464-9CEB-6EA5-1AE9-995C267C485A"].Visibility === "E925F86B")) && //AA361464-9CEB-6EA5-1AE9-995C267C485A
                            <Col md={6} sm={6} xs={12}>
                                <Label for="FullAccessAPi" className="d-inline">
                                    {<IntlMessages id="apiplanconfiguration.title.fullaccessapi" />}

                                    {"           "}
                                    <Tooltip title={<IntlMessages id="exchangefeed.tooltip.fullaccessapi" />}
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
                                <Input
                                    disabled={(menuDetail["AA361464-9CEB-6EA5-1AE9-995C267C485A"].AccessRight === "11E6E7B0") ? true : false}
                                    type="select"
                                    name="FullAccessAPi"
                                    multiple="multiple"
                                    value={this.state.FullAccessAPi}
                                    onChange={this.handleChangeRestMethodsFullAccess}
                                >
                                    <IntlMessages id="sidebar.pairConfiguration.list.lable.enter.trntype">
                                        {(select) =>
                                            <option value="">{select}</option>
                                        }
                                    </IntlMessages>

                                    {this.state.restApiFullAccess.length && this.state.restApiFullAccess.map((item, key) => (
                                        <option
                                            value={item.ID}
                                            key={key}

                                        >
                                            {item.MethodName}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        }
                    </FormGroup>
                    {((menuDetail["13055C81-699A-29AA-8E03-774073605337"]) && (menuDetail["13055C81-699A-29AA-8E03-774073605337"].Visibility === "E925F86B")) && //13055C81-699A-29AA-8E03-774073605337
                        <FormGroup>
                            <Label><IntlMessages id="apiplanconfiguration.title.plandesc" /></Label>
                            <Editor
                                init={{
                                    height: 300,
                                    plugins: 'link image code lists advlist table preview',
                                    toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                                    statusbar: false
                                }}
                                disabled={(menuDetail["13055C81-699A-29AA-8E03-774073605337"].AccessRight === "11E6E7B0") ? true : false}
                                value={this.state.plandescription}
                                onChange={(e) => this.handlePlanDesc(e, e.target.getContent())}
                            />

                        </FormGroup>
                    }
                    <FormGroup className="row">
                        {((menuDetail["C7D26C4C-46CF-96E7-A092-D643F5FD9B47"]) && (menuDetail["C7D26C4C-46CF-96E7-A092-D643F5FD9B47"].Visibility === "E925F86B")) && //C7D26C4C-46CF-96E7-A092-D643F5FD9B47
                            <Col md={4} sm={4} xs={12}>
                                <Label>
                                    <IntlMessages id="sidebar.priority" />
                                    <span className="text-danger">*</span>
                                    {"           "}
                                    <Tooltip title={<IntlMessages id="exchangefeed.tooltip.priority" />}
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
                                <IntlMessages id="sidebar.priority">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["C7D26C4C-46CF-96E7-A092-D643F5FD9B47"].AccessRight === "11E6E7B0") ? true : false}
                                            name="priority"
                                            value={this.state.priority}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["223B7C55-5359-8D3F-9874-F03B31949007"]) && (menuDetail["223B7C55-5359-8D3F-9874-F03B31949007"].Visibility === "E925F86B")) && //223B7C55-5359-8D3F-9874-F03B31949007
                            <Col md={4} sm={4} xs={12} className="d-inline mt-15">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.isRecursive}
                                            disabled={(menuDetail["223B7C55-5359-8D3F-9874-F03B31949007"].AccessRight === "11E6E7B0") ? true : false}
                                            onChange={this.handleChangeIsRecursive}
                                            icon={<CheckBoxOutlineBlankIcon />}
                                            checkedIcon={<CheckBoxIcon />}
                                        />
                                    }
                                    label={<IntlMessages id="apiplanconfiguration.title.planrecursive" />}
                                />
                                {"           "}
                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.planrecursive" />}
                                    disableFocusListener
                                    disableTouchListener
                                >
                                    <a href="javascript:void(0)"
                                        className="ml-10"
                                    >
                                        <i className="fa fa-info-circle" />
                                    </a>
                                </Tooltip>

                            </Col>
                        }
                        {((menuDetail["96DD780E-8B78-97F2-4C4D-992248466E51"]) && (menuDetail["96DD780E-8B78-97F2-4C4D-992248466E51"].Visibility === "E925F86B")) && //96DD780E-8B78-97F2-4C4D-992248466E51
                            <Col md={4} sm={4} xs={12}>
                                <Label for="status">
                                    <IntlMessages id="manageMarkets.list.form.label.status" />
                                    <span className="text-danger">*</span>
                                </Label>

                                <Input
                                    disabled={(menuDetail["96DD780E-8B78-97F2-4C4D-992248466E51"].AccessRight === "11E6E7B0") ? true : false}
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
                    </FormGroup>

                    <hr />
                    {menuDetail &&
                        <FormGroup>
                            <div className="btn_area">
                                <Button variant="raised" color="primary" className="text-white" onClick={() => this.addAPIPlanConfigData()} disabled={this.props.loading}><IntlMessages id="manageMarkets.list.button.save" /></Button>
                                <Button variant="raised" color="danger" className="ml-15 text-white" onClick={() => this.resetData()} disabled={this.props.loading}><IntlMessages id="sidebar.pairConfiguration.button.cancel" /></Button>
                            </div>
                        </FormGroup>
                    }
                </Form>
            </div>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    addApiConfigList: state.ApiPlanConfig.addApiConfigList,
    loading: state.ApiPlanConfig.addLoading,
    addError: state.ApiPlanConfig.addError,
    currencyList: state.tradingledger.currencyList,
    currencyLoader: state.tradingledger.loadingCurrency,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        addApiPlanConfigData,
        getApiPlanConfigList,
        getLedgerCurrencyList,
        getMenuPermissionByID
    }
)(AddApiPlan);