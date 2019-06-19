// comoponent for Update Api PLan Config By Tejas 22/2/2019

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
import { updateApiPlanConfigData, getApiPlanConfigList } from "Actions/ApiKeyConfiguration";
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

class UpdateApiPlan extends React.Component {
    // constructor
    constructor(props) {
        super(props);
        //define  default state
        this.state = {
            updateData: false,
            planName: props.selectedData.PlanName !== "" ? props.selectedData.PlanName : "",
            Price: props.selectedData.Price !== "" ? props.selectedData.Price : "",
            charge: props.selectedData.Charge !== "" ? props.selectedData.Charge : "",
            planValidity: props.selectedData.PlanValidity !== "" ? props.selectedData.PlanValidity : "",
            plandescription: props.selectedData.PlanDesc !== "" ? props.selectedData.PlanDesc : "",
            maxPerMin: props.selectedData.MaxPerMinute !== "" ? props.selectedData.MaxPerMinute : "",
            maxPerDay: props.selectedData.MaxPerDay !== "" ? props.selectedData.MaxPerDay : "",
            maxPerMonth: props.selectedData.MaxPerMonth !== "" ? props.selectedData.MaxPerMonth : "",
            maxOrderPerSec: props.selectedData.MaxOrderPerSec !== "" ? props.selectedData.MaxOrderPerSec : "",
            maxRecPerRequest: props.selectedData.MaxRecPerRequest !== "" ? props.selectedData.MaxRecPerRequest : "",
            maxReqSize: props.selectedData.MaxReqSize !== "" ? props.selectedData.MaxReqSize : "",
            maxResSize: props.selectedData.MaxResSize !== "" ? props.selectedData.MaxResSize : "",
            whiteListEndPoints: props.selectedData.Whitelistendpoints ? props.selectedData.Whitelistendpoints : "",
            concurrentEndPoints: props.selectedData.ConcurrentEndPoints !== "" ? props.selectedData.ConcurrentEndPoints : "",
            historicalDataMonth: props.selectedData.HistoricalDataMonth !== "" ? props.selectedData.HistoricalDataMonth : "",
            Status: props.selectedData.Status !== "" ? props.selectedData.Status : "",
            readOnlyApi: props.selectedData.ReadOnlyAPI ? Object.keys(props.selectedData.ReadOnlyAPI) : [],
            FullAccessAPi: props.selectedData.FullAccessAPI ? Object.keys(props.selectedData.FullAccessAPI) : [],
            restApiReadOnly: props.restApiReadOnly ? props.restApiReadOnly : [],
            restApiFullAccess: props.restApiFullAccess ? props.restApiFullAccess : [],
            id: props.selectedData.ID,
            isUpdate: false,
            isRecursive: props.selectedData.IsPlanRecursive ? true : false,
            priority: props.selectedData.Priority !== "" ? props.selectedData.Priority : "",
            planValidityType: props.selectedData.PlanValidityType !== "" ? props.selectedData.PlanValidityType : "",
            selectedCurrency: props.selectedData.ServiceID !== "" ? props.selectedData.ServiceID : "",
            notificationFlag: true,
            menudetail: [],
        }
    }

    // Handle Checkbox for display particular currency Data
    handleChangeIsRecursive = event => {
        this.setState({ isRecursive: !this.state.isRecursive, isUpdate: true });
    };

    // componentDidMount() {
    //     this.props.getLedgerCurrencyList({ ActiveOnly: 1 });
    // }

    // used to handle change event of select Wallet
    handleChangeCurrency = event => {
        this.setState({ selectedCurrency: event.target.value, isUpdate: true });
    };

    //request for add data of Plan Comfiguration
    updateAPIPlanConfigData = () => {
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
            id,
            priority,
            planValidityType,
            isRecursive,
            selectedCurrency
        } = this.state;

        const data = {
            ID: id,
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
            FullAccessAPI: FullAccessAPi ? FullAccessAPi : [],
            Priority: priority !== "" ? parseInt(priority) : parseInt(0),
            PlanValidityType: planValidityType !== "" ? parseInt(planValidityType) : parseInt(0),
            IsPlanRecursive: isRecursive ? parseInt(1) : parseInt(0),
            ReadonlyAPI: readOnlyApi ? readOnlyApi : [],
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
            if (this.state.isUpdate) {
                this.setState({
                    updateData: true
                })
                this.props.updateApiPlanConfigData(data);
            } else {
                NotificationManager.error(
                    <IntlMessages id="sidebar.apiplan.pleaseupdate" />
                )
            }
        }
    }

    // reset data on cancel or close drawer
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            updateData: false,
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
            Status: 1,
            readOnlyApi: [],
            FullAccessAPi: [],
            restApiReadOnly: [],
            restApiFullAccess: [],
            id: 0,
            isUpdate: false,
            isRecursive: false,
            priority: "",
            planValidityType: "",
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
        if (nextprops.updateApiConfigList && nextprops.updateError.length === 0 && this.state.updateData) {

            NotificationManager.success(<IntlMessages id="apiplanconfiguration.update.currency.success" />);
            this.setState({
                updateData: false,
                open: false,
                isUpdate: false
            })
            this.props.drawerClose();
            this.props.getApiPlanConfigList({});
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                updateData: false,
                isUpdate: false
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
            readOnlyApi: value,
            isUpdate: true
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
            FullAccessAPi: value,
            isUpdate: true
        })
    }

    // set data or state for Api Name
    handlePlanName = (event) => {
        if (validateOnlyAlphaNumeric(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value,
                isUpdate: true
            })
        }
    }

    // set data or state for Api Name
    handleDataChange = (event) => {
        if (validateOnlyInteger(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value,
                isUpdate: true
            })
        }
    }

    // validate Float value
    HandleChangePrice = (event) => {
        if (validateOnlyNumeric(event.target.value) || event.target.value === '') {
            this.setState({
                [event.target.name]: event.target.value,
                isUpdate: true
            })
        }
    }

    // validate Float value
    validateFloatData = (event) => {
        if (!validateOnlyFloat(event.target.value) && event.target.value !== '') {

            NotificationManager.error(<IntlMessages id={`sidebar.apiplan.enter.price`} values={{ Param1: [event.target.name] }} />)
        }
    }

    // set data or state for Api Name
    handlePlanDesc = (event, value) => {
        this.setState({
            plandescription: value,
            isUpdate: true
        })
    }

    // set state for status 
    handleChangeStatus = event => {
        this.setState({ Status: event.target.value, isUpdate: true });
    };

    // set state for status 
    handleChangePlanValidityType = event => {
        this.setState({ planValidityType: event.target.value, isUpdate: true, });
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
        var menuDetail = this.checkAndGetMenuAccessDetail('02F9DCD8-211C-351B-716B-F4B93F223D33');//02F9DCD8-211C-351B-716B-F4B93F223D33
        // returns the component
        return (
            <div className="m-10 p-5">
                {(this.props.currencyLoader || this.props.loading) || this.props.menuLoading && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="sidebar.APIPlanConfiguration.update" /></h2>
                    </div>
                    <div className="page-title-wrap">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                <Form className="m-20 tradefrm">
                    <FormGroup className="row">
                        {((menuDetail["8A86BB6C-005A-31E5-123C-6D62101C653E"]) && (menuDetail["8A86BB6C-005A-31E5-123C-6D62101C653E"].Visibility === "E925F86B")) && //8A86BB6C-005A-31E5-123C-6D62101C653E
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.planname" />
                                    <span className="text-danger">*</span>
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.planname">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["8A86BB6C-005A-31E5-123C-6D62101C653E"].AccessRight === "11E6E7B0") ? true : false}
                                            name="planName"
                                            value={this.state.planName}
                                            onChange={this.handlePlanName}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["AFDC7FFC-A3DE-3F82-2AD7-AD8F100A536D"]) && (menuDetail["AFDC7FFC-A3DE-3F82-2AD7-AD8F100A536D"].Visibility === "E925F86B")) && //AFDC7FFC-A3DE-3F82-2AD7-AD8F100A536D
                            <Col md={3} sm={6} xs={12}>
                                <Label for="status">
                                    <IntlMessages id="apiplanconfiguration.title.planvaliditytype" />
                                    <span className="text-danger">*</span>
                                </Label>

                                <Input
                                    disabled={(menuDetail["AFDC7FFC-A3DE-3F82-2AD7-AD8F100A536D"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["9D5FCFCA-3DA9-3443-16F0-9F3850BB63E0"]) && (menuDetail["9D5FCFCA-3DA9-3443-16F0-9F3850BB63E0"].Visibility === "E925F86B")) && //9D5FCFCA-3DA9-3443-16F0-9F3850BB63E0
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.planvalidity" />
                                    <span className="text-danger">*</span>
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.planvalidity">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["9D5FCFCA-3DA9-3443-16F0-9F3850BB63E0"].AccessRight === "11E6E7B0") ? true : false}
                                            name="planValidity"
                                            value={this.state.planValidity}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["8048896F-2D81-78EB-4968-7E2A55FE8867"]) && (menuDetail["8048896F-2D81-78EB-4968-7E2A55FE8867"].Visibility === "E925F86B")) && //8048896F-2D81-78EB-4968-7E2A55FE8867
                            <Col md={3} sm={6} xs={12}>
                                <Label for="wallets">
                                    <IntlMessages id="table.currency" />
                                    <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    disabled={(menuDetail["8048896F-2D81-78EB-4968-7E2A55FE8867"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["DED41E48-8310-1363-6F3F-27FE17915AE7"]) && (menuDetail["DED41E48-8310-1363-6F3F-27FE17915AE7"].Visibility === "E925F86B")) && //DED41E48-8310-1363-6F3F-27FE17915AE7
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="widgets.price" />
                                </Label>
                                <IntlMessages id="widgets.price">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["DED41E48-8310-1363-6F3F-27FE17915AE7"].AccessRight === "11E6E7B0") ? true : false}
                                            name="Price"
                                            value={this.state.Price}
                                            onChange={this.HandleChangePrice}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["F4923E4E-7227-2C56-744F-0DC57E380354"]) && (menuDetail["F4923E4E-7227-2C56-744F-0DC57E380354"].Visibility === "E925F86B")) && //F4923E4E-7227-2C56-744F-0DC57E380354
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="table.charge" />
                                </Label>
                                <IntlMessages id="table.charge">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["F4923E4E-7227-2C56-744F-0DC57E380354"].AccessRight === "11E6E7B0") ? true : false}
                                            name="charge"
                                            value={this.state.charge}
                                            onChange={this.HandleChangePrice}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["CAB10CEA-6664-50AB-62C5-4DD83A4C7783"]) && (menuDetail["CAB10CEA-6664-50AB-62C5-4DD83A4C7783"].Visibility === "E925F86B")) && //CAB10CEA-6664-50AB-62C5-4DD83A4C7783
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxpermin" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxpermin">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["CAB10CEA-6664-50AB-62C5-4DD83A4C7783"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxPerMin"
                                            value={this.state.maxPerMin}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["DD4DA2B1-3142-8569-3654-D7BB56204FD0"]) && (menuDetail["DD4DA2B1-3142-8569-3654-D7BB56204FD0"].Visibility === "E925F86B")) && //DD4DA2B1-3142-8569-3654-D7BB56204FD0
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxperday" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxperday">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["DD4DA2B1-3142-8569-3654-D7BB56204FD0"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["2DBE86C0-1E53-733A-3815-324C5F7C4845"]) && (menuDetail["2DBE86C0-1E53-733A-3815-324C5F7C4845"].Visibility === "E925F86B")) && //2DBE86C0-1E53-733A-3815-324C5F7C4845
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxpermonth" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxpermonth">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["2DBE86C0-1E53-733A-3815-324C5F7C4845"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxPerMonth"
                                            value={this.state.maxPerMonth}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["8F9CA8B7-2D00-3293-8B40-D87543E06B64"]) && (menuDetail["8F9CA8B7-2D00-3293-8B40-D87543E06B64"].Visibility === "E925F86B")) && //8F9CA8B7-2D00-3293-8B40-D87543E06B64
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxorderpersec" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxorderpersec">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["8F9CA8B7-2D00-3293-8B40-D87543E06B64"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxOrderPerSec"
                                            value={this.state.maxOrderPerSec}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["1DD9A6E1-4DF2-1A68-42A4-42C0F3973E45"]) && (menuDetail["1DD9A6E1-4DF2-1A68-42A4-42C0F3973E45"].Visibility === "E925F86B")) && //1DD9A6E1-4DF2-1A68-42A4-42C0F3973E45
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxrecperrequest" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxrecperrequest">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["1DD9A6E1-4DF2-1A68-42A4-42C0F3973E45"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxRecPerRequest"
                                            value={this.state.maxRecPerRequest}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["D4798757-445F-70E7-A2EE-938D4DF921C2"]) && (menuDetail["D4798757-445F-70E7-A2EE-938D4DF921C2"].Visibility === "E925F86B")) && //D4798757-445F-70E7-A2EE-938D4DF921C2
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxreqsize" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxreqsize">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["D4798757-445F-70E7-A2EE-938D4DF921C2"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["75C01625-6C81-7FAE-44CD-45FBD3C38581"]) && (menuDetail["75C01625-6C81-7FAE-44CD-45FBD3C38581"].Visibility === "E925F86B")) && //75C01625-6C81-7FAE-44CD-45FBD3C38581
                            <Col md={3} sm={6} xs={12}>
                                <Label>
                                    <IntlMessages id="apiplanconfiguration.title.maxressize" />
                                </Label>
                                <IntlMessages id="apiplanconfiguration.title.maxressize">
                                    {(placeholder) =>
                                        <Input type="text"
                                            disabled={(menuDetail["75C01625-6C81-7FAE-44CD-45FBD3C38581"].AccessRight === "11E6E7B0") ? true : false}
                                            name="maxResSize"
                                            value={this.state.maxResSize}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["442A12B3-A0A5-2E3D-4306-5239E92C10F9"]) && (menuDetail["442A12B3-A0A5-2E3D-4306-5239E92C10F9"].Visibility === "E925F86B")) && //442A12B3-A0A5-2E3D-4306-5239E92C10F9
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
                                            disabled={(menuDetail["442A12B3-A0A5-2E3D-4306-5239E92C10F9"].AccessRight === "11E6E7B0") ? true : false}
                                            name="whiteListEndPoints"
                                            value={this.state.whiteListEndPoints}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["AEAAA36C-7085-1AFF-9826-EAE5F54C1846"]) && (menuDetail["AEAAA36C-7085-1AFF-9826-EAE5F54C1846"].Visibility === "E925F86B")) && //AEAAA36C-7085-1AFF-9826-EAE5F54C1846
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
                                            disabled={(menuDetail["AEAAA36C-7085-1AFF-9826-EAE5F54C1846"].AccessRight === "11E6E7B0") ? true : false}
                                            name="concurrentEndPoints"
                                            value={this.state.concurrentEndPoints}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["D4701377-5D5E-A58C-266F-13B530D21BE5"]) && (menuDetail["D4701377-5D5E-A58C-266F-13B530D21BE5"].Visibility === "E925F86B")) && //D4701377-5D5E-A58C-266F-13B530D21BE5
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
                                            disabled={(menuDetail["D4701377-5D5E-A58C-266F-13B530D21BE5"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["8E49565C-7E46-4949-779C-A64E7EBA20AC"]) && (menuDetail["8E49565C-7E46-4949-779C-A64E7EBA20AC"].Visibility === "E925F86B")) && //8E49565C-7E46-4949-779C-A64E7EBA20AC
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
                                    disabled={(menuDetail["8E49565C-7E46-4949-779C-A64E7EBA20AC"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["40C800D3-1161-2A25-7713-165FE5BE3725"]) && (menuDetail["40C800D3-1161-2A25-7713-165FE5BE3725"].Visibility === "E925F86B")) && //40C800D3-1161-2A25-7713-165FE5BE3725
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
                                    disabled={(menuDetail["40C800D3-1161-2A25-7713-165FE5BE3725"].AccessRight === "11E6E7B0") ? true : false}
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
                    {((menuDetail["BCDD456A-9E03-226A-4239-248608C26372"]) && (menuDetail["BCDD456A-9E03-226A-4239-248608C26372"].Visibility === "E925F86B")) && //BCDD456A-9E03-226A-4239-248608C26372
                        <FormGroup>
                            <Label><IntlMessages id="apiplanconfiguration.title.plandesc" /></Label>
                            <Editor
                                init={{
                                    height: 300,
                                    plugins: 'link image code lists advlist table preview',
                                    toolbar: "bold italic underline strikethrough | subscript superscript | bullist numlist | alignleft aligncenter alignright alignjustify | undo redo | link image code | preview selectall | table formatselect | fontselect fontsizeselect",
                                    statusbar: false
                                }}
                                disabled={(menuDetail["BCDD456A-9E03-226A-4239-248608C26372"].AccessRight === "11E6E7B0") ? true : false}
                                value={this.state.plandescription}
                                onChange={(e) => this.handlePlanDesc(e, e.target.getContent())}
                            />

                        </FormGroup>
                    }
                    <FormGroup className="row">
                        {((menuDetail["69F50879-4E09-7772-A74E-7FCA803286CF"]) && (menuDetail["69F50879-4E09-7772-A74E-7FCA803286CF"].Visibility === "E925F86B")) && //69F50879-4E09-7772-A74E-7FCA803286CF
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
                                            disabled={(menuDetail["69F50879-4E09-7772-A74E-7FCA803286CF"].AccessRight === "11E6E7B0") ? true : false}
                                            name="priority"
                                            value={this.state.priority}
                                            onChange={this.handleDataChange}
                                            placeholder={placeholder} ></Input>
                                    }
                                </IntlMessages>
                            </Col>
                        }
                        {((menuDetail["5B3D65DF-9C9D-1633-0EDD-12FF836C07D8"]) && (menuDetail["5B3D65DF-9C9D-1633-0EDD-12FF836C07D8"].Visibility === "E925F86B")) && //5B3D65DF-9C9D-1633-0EDD-12FF836C07D8
                            <Col md={4} sm={4} xs={12} className="d-inline mt-15">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.isRecursive}
                                            disabled={(menuDetail["5B3D65DF-9C9D-1633-0EDD-12FF836C07D8"].AccessRight === "11E6E7B0") ? true : false}
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
                        {((menuDetail["2A790794-9547-7CCC-03DC-D578D848578E"]) && (menuDetail["2A790794-9547-7CCC-03DC-D578D848578E"].Visibility === "E925F86B")) && //2A790794-9547-7CCC-03DC-D578D848578E
                            <Col md={4} sm={4} xs={12}>
                                <Label for="status">
                                    <IntlMessages id="manageMarkets.list.form.label.status" />
                                    <span className="text-danger">*</span>
                                </Label>

                                <Input
                                    disabled={(menuDetail["2A790794-9547-7CCC-03DC-D578D848578E"].AccessRight === "11E6E7B0") ? true : false}
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
                                <Button variant="raised" color="primary" className="text-white" onClick={() => this.updateAPIPlanConfigData()} disabled={this.props.loading}><IntlMessages id="manageMarkets.list.button.save" /></Button>
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
    updateApiConfigList: state.ApiPlanConfig.updateApiConfigList,
    loading: state.ApiPlanConfig.updateLoading,
    updateError: state.ApiPlanConfig.updateError,
    currencyList: state.tradingledger.currencyList,
    currencyLoader: state.tradingledger.loadingCurrency,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        updateApiPlanConfigData,
        getApiPlanConfigList,
        getLedgerCurrencyList,
        getMenuPermissionByID
    }
)(UpdateApiPlan);