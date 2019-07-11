// component for update request list  by Tejas
import React, { Component } from 'react';
// used for connect component 
import { connect } from "react-redux";
// import components for design
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
// import button and set design
import CloseButton from '@material-ui/core/Button';

// action for get provider list used in dropdown
import { getProvidersList } from "Actions/LiquidityManager";

// action for get third party response
import { getThirdPartyApiResponse } from "Actions/ApiResponseConfig";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
// validate input for only numeric value
import { validateOnlyNumeric } from "Validations/pairConfiguration";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Payment Method  Report Update And Update
import {
    updateThirdPartyApiRequestList,
    getAppTypeList,
} from "Actions/ApiRequestConfig";

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";

// used for display loader
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

// class for update request record
class UpdateRequestList extends Component {
    //  constructor
    constructor(props) {
        super(props);
        //set default state
        this.state = {
            updateNewData: false,
            apiName: this.props.selectedData.APIName ? this.props.selectedData.APIName : "",
            apiSendURL: this.props.selectedData.APISendURL ? this.props.selectedData.APISendURL : "",
            apiValidateURL: this.props.selectedData.APIValidateURL ? this.props.selectedData.APIValidateURL : "",
            apiBalURL: this.props.selectedData.APIBalURL ? this.props.selectedData.APIBalURL : "",
            apiStatusCheckURL: this.props.selectedData.APIStatusCheckURL ? this.props.selectedData.APIStatusCheckURL : "",
            merchantCode: this.props.selectedData.MerchantCode ? this.props.selectedData.MerchantCode : "",
            requestSuccess: this.props.selectedData.ResponseSuccess ? this.props.selectedData.ResponseSuccess : "",
            apiRequestBody: this.props.selectedData.APIRequestBody ? this.props.selectedData.APIRequestBody : "",
            appTypeList: [],
            TransactionIdPrefix: this.props.selectedData.TransactionIdPrefix ? this.props.selectedData.TransactionIdPrefix : "",
            RequestFailure: this.props.selectedData.ResponseFailure ? this.props.selectedData.ResponseFailure : "",
            requestHold: this.props.selectedData.ResponseHold ? this.props.selectedData.ResponseHold : "",
            authHeader: this.props.selectedData.AuthHeader ? this.props.selectedData.AuthHeader : "",
            contentType: this.props.selectedData.ContentType ? this.props.selectedData.ContentType : "",
            methodType: this.props.selectedData.MethodType ? this.props.selectedData.MethodType : "",
            parsingDataID: this.props.selectedData.ParsingDataID ? parseInt(this.props.selectedData.ParsingDataID) : parseInt(0),
            appType: this.props.selectedData.AppType ? parseInt(this.props.selectedData.AppType) : parseInt(0),
            parsingList: [],
            Id: this.props.selectedData.Id ? this.props.selectedData.Id : 0,
            isUpdate: false,
            selectedStatus: this.props.selectedData.Status ? parseInt(this.props.selectedData.Status) : parseInt(0),
            //added by parth andhariya 
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('BF30765C-65DD-8965-A757-DE0EE5F02F61'); // get Trading menu permission
    }
    // close drawer 
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            isUpdate: false
        });
    }

    // close edit form 
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            isUpdate: false
        });
    };

    // set state for parsing data
    onChangeParsingData(e) {
        this.setState({
            parsingDataID: e.target.value,
            isUpdate: true
        });
    }

    // set state for app type
    onChangeAppType(e) {
        this.setState({
            appType: e.target.value,
            isUpdate: true
        });
    } w

    // set staus on change of drop down
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value, isUpdate: true });
    };

    // function for validate URL
    validateUrl = (url) => {
        var urlReg = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})"
       return (url.match(urlReg)) ? true : false;
    }

    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {
        // added By Jinesh bhatt for set new data in drawer load 01-02-2019
        if (nextprops.selectedData) {
            this.setState({
                apiName: nextprops.selectedData.APIName ? nextprops.selectedData.APIName : "",
                apiSendURL: nextprops.selectedData.APISendURL ? nextprops.selectedData.APISendURL : "",
                apiValidateURL: nextprops.selectedData.APIValidateURL ? nextprops.selectedData.APIValidateURL : "",
                apiBalURL: nextprops.selectedData.APIBalURL ? nextprops.selectedData.APIBalURL : "",
                apiStatusCheckURL: nextprops.selectedData.APIStatusCheckURL ? nextprops.selectedData.APIStatusCheckURL : "",
                merchantCode: nextprops.selectedData.MerchantCode ? nextprops.selectedData.MerchantCode : "",
                requestSuccess: nextprops.selectedData.ResponseSuccess ? nextprops.selectedData.ResponseSuccess : "",
                apiRequestBody: nextprops.selectedData.APIRequestBody ? nextprops.selectedData.APIRequestBody : "",
                appTypeList: [],
                TransactionIdPrefix: nextprops.selectedData.TransactionIdPrefix ? nextprops.selectedData.TransactionIdPrefix : "",
                RequestFailure: nextprops.selectedData.ResponseFailure ? nextprops.selectedData.ResponseFailure : "",
                requestHold: nextprops.selectedData.ResponseHold ? nextprops.selectedData.ResponseHold : "",
                authHeader: nextprops.selectedData.AuthHeader ? nextprops.selectedData.AuthHeader : "",
                contentType: nextprops.selectedData.ContentType ? nextprops.selectedData.ContentType : "",
                methodType: nextprops.selectedData.MethodType ? nextprops.selectedData.MethodType : "",
                parsingDataID: nextprops.selectedData.ParsingDataID ? parseInt(nextprops.selectedData.ParsingDataID) : parseInt(0),
                appType: nextprops.selectedData.AppType ? parseInt(nextprops.selectedData.AppType) : parseInt(0),
                parsingList: [],
                Id: nextprops.selectedData.Id ? nextprops.selectedData.Id : 0
            })
            /* update menu details if not set */
            if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
                if (nextprops.menu_rights.ReturnCode === 0) {
                    this.props.getAppTypeList({})
                    this.props.getThirdPartyApiResponse({})
                    this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
                } else if (nextprops.menu_rights.ReturnCode !== 0) {
                    this.setState({ notificationFlag: false });
                    NotificationManager.error(<IntlMessages id={"error.permission"} />);
                    this.props.drawerClose();
                }
            }
        }

        // set state for apptype list
        if (nextprops.appTypeList) {
            this.setState({
                appTypeList: nextprops.appTypeList
            })
        }

        //set state for parsing data
        if (nextprops.parsingDataList) {
            this.setState({
                parsingList: nextprops.parsingDataList
            })
        }

        // display success or failure notification when call For update record
        if (nextprops.updateRequestList && nextprops.updateRequestList.ReturnCode == 0 && this.state.updateNewData) {
            NotificationManager.success(<IntlMessages id="apiRequest.update.currency.success" />);
            this.setState({
                updateNewData: false,
                open: false,
                isUpdate: false
            })
            this.props.drawerClose();
            this.props.getProvidersList({});
            //code change by jayshreeba Gohil (17-6-2019) for handle arbitrage configuration detail
            var reqObject = {};
            if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                reqObject.IsArbitrage = this.props.IsArbitrage;
            }
            this.props.getProvidersList(reqObject);
            //end
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.updateError.ErrorCode}`} />);
            this.setState({
                updateNewData: false,
                isUpdate: false
            })
        }
    }

    // prepare Request for update record
    updateAPIRequestData = () => {
        if (this.state.isUpdate) {
            const {
                apiName, apiSendURL,
                apiValidateURL, apiBalURL,
                apiStatusCheckURL, merchantCode,
                requestSuccess, apiRequestBody,
                TransactionIdPrefix, RequestFailure,
                requestHold, authHeader,
                contentType, methodType,
                parsingDataID, appType,
                selectedStatus,
                Id
            } = this.state;
            const data = {
                APIName: apiName,
                APISendURL: apiSendURL,
                APIValidateURL: apiValidateURL,
                APIBalURL: apiBalURL,
                APIStatusCheckURL: apiStatusCheckURL,
                APIRequestBody: apiRequestBody,
                TransactionIdPrefix: TransactionIdPrefix,
                MerchantCode: merchantCode,
                ResponseSuccess: requestSuccess,
                ResponseFailure: RequestFailure,
                ResponseHold: requestHold,
                AuthHeader: authHeader,
                ContentType: contentType,
                MethodType: methodType,
                AppType: appType ? parseInt(appType) : parseInt(0),
                ParsingDataID: parsingDataID ? parseInt(parsingDataID) : parseInt(0),
                Id: Id,
                Status: selectedStatus ? parseInt(selectedStatus) : parseInt(0)
            };
            if (apiName === "" || apiName == null) {
                NotificationManager.error(<IntlMessages id="sidebar.apiresponse.list.lable.enter.apiname" />);
            }
            else if (isScriptTag(apiName)) {
                NotificationManager.error(<IntlMessages id="my_account.err.scriptTag" />);
            }
            else if (isHtmlTag(apiName)) {
                NotificationManager.error(<IntlMessages id="my_account.err.htmlTag" />);
            }
            else if (apiSendURL === "" || apiSendURL == null) {
                NotificationManager.error(<IntlMessages id="sidebar.apiresponse.list.lable.enter.apiurl" />);
            }
            else if (appType === "" || appType == null) {
                NotificationManager.error(<IntlMessages id="sidebar.apiresponse.list.lable.enter.appType" />);
            }
            else {
                if (
                    apiSendURL != '' && !this.validateUrl(apiSendURL) ||
                    apiValidateURL !== '' && !this.validateUrl(apiValidateURL) ||
                    apiBalURL !== '' && !this.validateUrl(apiBalURL) ||
                    apiStatusCheckURL !== '' && !this.validateUrl(apiStatusCheckURL)
                ) {
                    NotificationManager.error(<IntlMessages id="my_account.err.validUrl" />);
                } else {

                    this.setState({
                        updateNewData: true
                    })
                    this.props.updateThirdPartyApiRequestList(data);
                }
                //code change by jayshreeba Gohil (17-6-2019) for handle arbitrage configuration detail
                var reqObject = data;
                if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.updateThirdPartyApiRequestList(reqObject);
            }
        } else {
            NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
        }
    };

    // set state for set values in text bozes and validate value is numeric or not
    handleChangeData = event => {
        if (!validateOnlyNumeric(event.target.value) || event.target.value == '') {
            this.setState({
                [event.target.name]: event.target.value,
                isUpdate: true
            })
        }
    }

    // reset data 
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            updateNewData: false,
            apiName: "",
            apiSendURL: "",
            apiValidateURL: "",
            apiBalURL: "",
            apiStatusCheckURL: "",
            merchantCode: "",
            requestSuccess: "",
            apiRequestBody: "",
            appTypeList: [],
            TransactionIdPrefix: "",
            RequestFailure: "",
            requestHold: "",
            authHeader: "",
            contentType: "",
            methodType: "",
            parsingDataID: parseInt(0),
            appType: parseInt(0),
            parsingList: [],
            Id: 0,
            isUpdate: false,
            selectedStatus: 0
        });
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
    // renders the component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('EC34D9FD-8C64-267F-3C09-0DBA62CA5EE6');//EC34D9FD-8C64-267F-3C09-0DBA62CA5EE6
        const { drawerClose } = this.props;
        return (
            <div className="m-10 p-5">
                {
                    (
                        this.props.loading
                        || this.props.apiResponseListLoading
                        || this.props.appTypeListLoading
                        || this.props.menuLoading)
                    && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="apiRequest.list.title.updatelist" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={drawerClose}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>

                <Row>
                    <Col md={12}>
                        <Form className="m-10 tradefrm">
                            <FormGroup>
                                <Row>
                                    {((menuDetail["01064D97-8907-4A5D-7A4E-D20D47348B3C"]) && (menuDetail["01064D97-8907-4A5D-7A4E-D20D47348B3C"].Visibility === "E925F86B")) && //01064D97-8907-4A5D-7A4E-D20D47348B3C
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="liquidityprovider.list.column.label.apiname" />
                                                <span className="text-danger">*</span>
                                            </Label>
                                            <IntlMessages id="liquidityprovider.list.column.label.apiname">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["01064D97-8907-4A5D-7A4E-D20D47348B3C"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiName"
                                                        value={this.state.apiName}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["7C3F9887-38B4-1441-9E6B-CD49D9335F14"]) && (menuDetail["7C3F9887-38B4-1441-9E6B-CD49D9335F14"].Visibility === "E925F86B")) && //7C3F9887-38B4-1441-9E6B-CD49D9335F14
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="liquidityprovider.list.column.label.apiurl" />
                                                <span className="text-danger">*</span>
                                                {"           "}
                                                <Tooltip title={<IntlMessages id="sidebar.apirequest.url" />}
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
                                            <IntlMessages id="liquidityprovider.list.column.label.apiurl">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["7C3F9887-38B4-1441-9E6B-CD49D9335F14"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiSendURL"
                                                        value={this.state.apiSendURL}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    {((menuDetail["DAEDA128-697E-A4C0-773A-6DCD487E8ED2"]) && (menuDetail["DAEDA128-697E-A4C0-773A-6DCD487E8ED2"].Visibility === "E925F86B")) && //DAEDA128-697E-A4C0-773A-6DCD487E8ED2
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.validateurl" />
                                                {"           "}
                                                <Tooltip title={<IntlMessages id="sidebar.apirequest.url" />}
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
                                            <IntlMessages id="apiresponse.list.title.validateurl">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["DAEDA128-697E-A4C0-773A-6DCD487E8ED2"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiValidateURL"
                                                        value={this.state.apiValidateURL}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["F4F89C53-9532-1112-A74E-B596859357A3"]) && (menuDetail["F4F89C53-9532-1112-A74E-B596859357A3"].Visibility === "E925F86B")) && //F4F89C53-9532-1112-A74E-B596859357A3
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.balurl" />
                                                {"           "}
                                                <Tooltip title={<IntlMessages id="sidebar.apirequest.url" />}
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
                                            <IntlMessages id="apiresponse.list.title.balurl">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["F4F89C53-9532-1112-A74E-B596859357A3"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiBalURL"
                                                        value={this.state.apiBalURL}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>


                            <FormGroup>
                                <Row>
                                    {((menuDetail["B996A534-8BAB-0919-61FE-75DDBCFF8784"]) && (menuDetail["B996A534-8BAB-0919-61FE-75DDBCFF8784"].Visibility === "E925F86B")) && //B996A534-8BAB-0919-61FE-75DDBCFF8784
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.statusurl" />
                                                {"           "}
                                                <Tooltip title={<IntlMessages id="sidebar.apirequest.url" />}
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
                                            <IntlMessages id="apiresponse.list.title.statusurl">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["B996A534-8BAB-0919-61FE-75DDBCFF8784"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiStatusCheckURL"
                                                        value={this.state.apiStatusCheckURL}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["540CEA37-09B1-2755-3D33-ADFAAC21623C"]) && (menuDetail["540CEA37-09B1-2755-3D33-ADFAAC21623C"].Visibility === "E925F86B")) && //540CEA37-09B1-2755-3D33-ADFAAC21623C
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.apirequest" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.apirequest">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["540CEA37-09B1-2755-3D33-ADFAAC21623C"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiRequestBody"
                                                        value={this.state.apiRequestBody}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>


                            <FormGroup>
                                <Row>
                                    {((menuDetail["286826EB-0DF1-1B95-4AA8-343DE86C762A"]) && (menuDetail["286826EB-0DF1-1B95-4AA8-343DE86C762A"].Visibility === "E925F86B")) && //286826EB-0DF1-1B95-4AA8-343DE86C762A
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.trnidprefix" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.trnidprefix">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["286826EB-0DF1-1B95-4AA8-343DE86C762A"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="TransactionIdPrefix"
                                                        value={this.state.TransactionIdPrefix}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["C1D21936-469F-8445-7D04-45BBAAF1954B"]) && (menuDetail["C1D21936-469F-8445-7D04-45BBAAF1954B"].Visibility === "E925F86B")) && //C1D21936-469F-8445-7D04-45BBAAF1954B
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.merchantCode" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.merchantCode">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["C1D21936-469F-8445-7D04-45BBAAF1954B"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="merchantCode"
                                                        value={this.state.merchantCode}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    {((menuDetail["633449BA-0527-6D6C-15C4-EA980F24A629"]) && (menuDetail["633449BA-0527-6D6C-15C4-EA980F24A629"].Visibility === "E925F86B")) && //633449BA-0527-6D6C-15C4-EA980F24A629
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.successresponse" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.successresponse">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["633449BA-0527-6D6C-15C4-EA980F24A629"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="requestSuccess"
                                                        value={this.state.requestSuccess}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["23014AF0-1E8F-4D3F-9015-A25DE06F7350"]) && (menuDetail["23014AF0-1E8F-4D3F-9015-A25DE06F7350"].Visibility === "E925F86B")) && //23014AF0-1E8F-4D3F-9015-A25DE06F7350
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.failureresponse" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.failureresponse">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["23014AF0-1E8F-4D3F-9015-A25DE06F7350"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="RequestFailure"
                                                        value={this.state.RequestFailure}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>


                            <FormGroup>
                                <Row>
                                    {((menuDetail["3DE0FDDE-953B-A768-6825-1C0D941A2CB1"]) && (menuDetail["3DE0FDDE-953B-A768-6825-1C0D941A2CB1"].Visibility === "E925F86B")) && //3DE0FDDE-953B-A768-6825-1C0D941A2CB1
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.holdresponse" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.holdresponse">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["3DE0FDDE-953B-A768-6825-1C0D941A2CB1"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="requestHold"
                                                        value={this.state.requestHold}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["AB3E7981-159D-9C5F-1DE2-F54597523837"]) && (menuDetail["AB3E7981-159D-9C5F-1DE2-F54597523837"].Visibility === "E925F86B")) && //AB3E7981-159D-9C5F-1DE2-F54597523837
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.authHeader" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.authHeader">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["AB3E7981-159D-9C5F-1DE2-F54597523837"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="authHeader"
                                                        value={this.state.authHeader}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    {((menuDetail["3B336DAB-3959-9C6E-A3C2-19F5EB8F0E17"]) && (menuDetail["3B336DAB-3959-9C6E-A3C2-19F5EB8F0E17"].Visibility === "E925F86B")) && //3B336DAB-3959-9C6E-A3C2-19F5EB8F0E17
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.contenttype" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.contenttype">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["3B336DAB-3959-9C6E-A3C2-19F5EB8F0E17"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="contentType"
                                                        value={this.state.contentType}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["ED00D143-4AFF-4F09-78D9-EE808D4F58AE"]) && (menuDetail["ED00D143-4AFF-4F09-78D9-EE808D4F58AE"].Visibility === "E925F86B")) && //ED00D143-4AFF-4F09-78D9-EE808D4F58AE
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.methodtype" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.methodtype">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["ED00D143-4AFF-4F09-78D9-EE808D4F58AE"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="methodType"
                                                        value={this.state.methodType}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    {((menuDetail["A540FA78-A20A-0A9E-6936-B274DCC9A744"]) && (menuDetail["A540FA78-A20A-0A9E-6936-B274DCC9A744"].Visibility === "E925F86B")) && //A540FA78-A20A-0A9E-6936-B274DCC9A744
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.apptype" />
                                                <span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                disabled={(menuDetail["A540FA78-A20A-0A9E-6936-B274DCC9A744"].AccessRight === "11E6E7B0") ? true : false}
                                                type="select"
                                                name="appType"
                                                value={this.state.appType}
                                                onChange={e => this.onChangeAppType(e)}
                                            >
                                                <IntlMessages id="apiresponse.list.title.select.apptype">
                                                    {(select) =>
                                                        <option value="">{select}</option>
                                                    }
                                                </IntlMessages>

                                                {this.state.appTypeList.length > 0 && this.state.appTypeList.map((item, key) => (
                                                    <option
                                                        value={item.Id}
                                                        key={key}
                                                    >
                                                        {item.AppTypeName}
                                                    </option>
                                                ))}
                                            </Input>

                                        </Col>
                                    }
                                    {((menuDetail["EFF35D4D-3803-7113-041C-E010D7B0913A"]) && (menuDetail["EFF35D4D-3803-7113-041C-E010D7B0913A"].Visibility === "E925F86B")) && //EFF35D4D-3803-7113-041C-E010D7B0913A
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.parsingdata" />
                                            </Label>
                                            <Input
                                                disabled={(menuDetail["EFF35D4D-3803-7113-041C-E010D7B0913A"].AccessRight === "11E6E7B0") ? true : false}
                                                type="select"
                                                name="parsingDataID"
                                                value={this.state.parsingDataID}
                                                onChange={e => this.onChangeParsingData(e)}
                                            >
                                                <IntlMessages id="apiresponse.list.title.select.parsingdata">
                                                    {(select) =>
                                                        <option value="">{select}</option>
                                                    }
                                                </IntlMessages>

                                                {this.state.parsingList.length > 0 && this.state.parsingList.map((item, key) => (
                                                    <option
                                                        value={item.Id}
                                                        key={key}
                                                    >
                                                        {item.Id}
                                                    </option>
                                                ))}
                                            </Input>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    {((menuDetail["197C2C97-59EB-0594-4BF9-4CBC327C8EEA"]) && (menuDetail["197C2C97-59EB-0594-4BF9-4CBC327C8EEA"].Visibility === "E925F86B")) && //197C2C97-59EB-0594-4BF9-4CBC327C8EEA
                                        <Col md={6} sm={6}>
                                            <Label for="status">
                                                <IntlMessages id="manageMarkets.list.form.label.status" />
                                            </Label>
                                            <Input
                                                disabled={(menuDetail["197C2C97-59EB-0594-4BF9-4CBC327C8EEA"].AccessRight === "11E6E7B0") ? true : false}
                                                type="select"
                                                name="status"
                                                value={this.state.selectedStatus}
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
                                                <IntlMessages id="sidebar.btnDisable">
                                                    {(select) =>
                                                        <option value="9">{select}</option>
                                                    }
                                                </IntlMessages>
                                            </Input>

                                        </Col>
                                    }
                                </Row>
                            </FormGroup>

                            <hr />
                            {Object.keys(menuDetail).length > 0 &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button
                                                variant="raised"
                                                color="primary"
                                                className="text-white"
                                                onClick={() => this.updateAPIRequestData()}
                                                disabled={this.props.loading}
                                            >
                                                <IntlMessages id="sidebar.pairConfiguration.button.update" />
                                            </Button>
                                            <Button
                                                variant="raised"
                                                color="danger"
                                                className="text-white ml-15"
                                                onClick={() => this.resetData()}
                                                disabled={this.props.loading}
                                            >
                                                <IntlMessages id="sidebar.pairConfiguration.button.cancel" />
                                            </Button>
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

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    updateRequestList: state.thirdPartyApiRequest.updateRequestList,
    appTypeList: state.thirdPartyApiRequest.appTypeList,
    appTypeListLoading: state.thirdPartyApiRequest.appTypeListLoading,
    parsingDataList: state.thirdPartyApiResponse.apiResponseList,
    apiResponseListLoading: state.thirdPartyApiResponse.apiResponseListLoading,
    loading: state.thirdPartyApiRequest.updateLoading,
    updateError: state.thirdPartyApiRequest.updateError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        updateThirdPartyApiRequestList,
        getAppTypeList,
        getProvidersList,
        getThirdPartyApiResponse,
        getMenuPermissionByID
    }
)(UpdateRequestList);