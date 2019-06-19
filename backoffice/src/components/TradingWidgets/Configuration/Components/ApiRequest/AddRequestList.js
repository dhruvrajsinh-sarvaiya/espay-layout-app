// component for add new reqyest type in list By tejas 
// import react and component for render the new component
import React, { Component } from 'react';

// used for connect component to store
import { connect } from "react-redux";

// import for design
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
// import button and set design
import CloseButton from '@material-ui/core/Button';
import { NotificationManager } from "react-notifications";
import IntlMessages from "Util/IntlMessages";

// action for call API for get list
import { getProvidersList } from "Actions/LiquidityManager";

// action for call API for get list of apiresponse config
import { getThirdPartyApiResponse } from "Actions/ApiResponseConfig";

// import for validate numbers in add data
import { validateOnlyNumeric } from "Validations/pairConfiguration";

//Action Import for Payment Method  Report Add And Update
import {
    addThirdPartyApiRequestList,
    getAppTypeList,
} from "Actions/ApiRequestConfig";

// used for display laoder on page
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
// class for display add request lis tform
class AddRequestList extends Component {

    // constructor
    constructor(props) {
        super(props);
        //define  default state
        this.state = {
            addNewData: false,
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
            parsingDataID: "",
            appType: "",
            parsingList: [],
            selectedStatus: "",
            //added by parth andhariya 
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('BF30765C-65DD-8965-A757-DE0EE5F02F61'); // get Trading menu permission
        // code added by parth andhariya for handle and check menu detail and store (18-4-2019)
        // var fieldList = {};
        // if (this.props.menuDetail.Fields && this.props.menuDetail.Fields.length) {
        //     this.props.menuDetail.Fields.forEach(function (item) {
        //         fieldList[item.GUID] = item;
        //     });
        //     this.setState({
        //         fieldList: fieldList
        //     });
        // }
        // code end
    }
    // close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    // close drawer and form
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };

    // set state for parsing data ID
    onChangeParsingData(e) {
        this.setState({
            parsingDataID: e.target.value,
        });
    }

    // set state for set app type from drop down
    onChangeAppType(e) {
        this.setState({
            appType: e.target.value,
        });
    }

    // function for validate URL
    validateUrl = (url) => {
        var urlReg = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})"
        if (url.match(urlReg)) {
            return true
        } else {
            return false
        }
    }

    // invoke when component is about to get props
    componentWillReceiveProps(nextprops) {
        // set app type list in state
        if (nextprops.appTypeList) {
            this.setState({
                appTypeList: nextprops.appTypeList
            })
        }
        // set parsing data list in state
        if (nextprops.parsingDataList) {
            this.setState({
                parsingList: nextprops.parsingDataList
            })
        }
        // display success or failure message when call api for add new data
        if (nextprops.addRequestList && nextprops.addError.length == 0 && this.state.addNewData) {
            NotificationManager.success(<IntlMessages id="apiRequest.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
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
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                addNewData: false
            })
        }
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

    // used for set request for call add new request type
    addAPIRequestData = () => {
        const {
            apiName, apiSendURL,
            apiValidateURL, apiBalURL,
            apiStatusCheckURL, merchantCode,
            requestSuccess, apiRequestBody,
            TransactionIdPrefix, RequestFailure,
            requestHold, authHeader,
            contentType, methodType,
            parsingDataID, appType,
            selectedStatus
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
                apiSendURL !== '' && !this.validateUrl(apiSendURL) ||
                apiValidateURL !== '' && !this.validateUrl(apiValidateURL) ||
                apiBalURL !== '' && !this.validateUrl(apiBalURL) ||
                apiStatusCheckURL !== '' && !this.validateUrl(apiStatusCheckURL)
            ) {
                NotificationManager.error(<IntlMessages id="my_account.err.validUrl" />);
            } else {
                this.setState({
                    addNewData: true
                })
                this.props.addThirdPartyApiRequestList(data);
                //code change by jayshreeba Gohil (17-6-2019) for handle arbitrage configuration detail
                var reqObject = data;
                if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.addThirdPartyApiRequestList(reqObject);
                //end
            }
        }
    };

    // invoke after render component and call ai for get types 
    // componentDidMount() {
    //     this.props.getAppTypeList({})
    //     this.props.getThirdPartyApiResponse({})
    // }

    // set data for textboxes in state and validate the value
    handleChangeData = event => {
        if (!validateOnlyNumeric(event.target.value) || event.target.value == '') {
            this.setState({
                [event.target.name]: event.target.value
            })
        }
    }

    // added by Jinesh bhatt for button close event Date : 04-02-2019
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            addNewData: false,
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
            parsingDataID: "",
            appType: "",
            parsingList: [],
            selectedStatus: 0
        });
    };

    // set staus on change of drop down
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value });
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
    // renders the component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('30025EE8-38BB-985F-A3B4-97F87BDC99EC');//30025EE8-38BB-985F-A3B4-97F87BDC99EC
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
                        <h2><IntlMessages id="apiRequest.list.title.addnewlist" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>

                <Row>

                    <div className="jbs-page-content col-md-12 mx-auto">
                        <Form className="tradefrm">
                            <FormGroup>
                                <Row>
                                    {((menuDetail["30CC9260-2697-1B56-19F3-BF0283287489"]) && (menuDetail["30CC9260-2697-1B56-19F3-BF0283287489"].Visibility === "E925F86B")) && //30CC9260-2697-1B56-19F3-BF0283287489
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="liquidityprovider.list.column.label.apiname" />
                                                <span className="text-danger">*</span>
                                            </Label>
                                            <IntlMessages id="liquidityprovider.list.column.label.apiname">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["30CC9260-2697-1B56-19F3-BF0283287489"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiName"
                                                        value={this.state.apiName}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["DA0AFD4D-0FCF-1395-8017-DC5EDD5C9B63"]) && (menuDetail["DA0AFD4D-0FCF-1395-8017-DC5EDD5C9B63"].Visibility === "E925F86B")) && //DA0AFD4D-0FCF-1395-8017-DC5EDD5C9B63
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
                                                        disabled={(menuDetail["DA0AFD4D-0FCF-1395-8017-DC5EDD5C9B63"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["4E2A2FD3-3A3E-1B73-70B1-8299B6BD9475"]) && (menuDetail["4E2A2FD3-3A3E-1B73-70B1-8299B6BD9475"].Visibility === "E925F86B")) && //4E2A2FD3-3A3E-1B73-70B1-8299B6BD9475
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
                                                        disabled={(menuDetail["4E2A2FD3-3A3E-1B73-70B1-8299B6BD9475"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiValidateURL"
                                                        value={this.state.apiValidateURL}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["F95FD3FB-6039-26A2-98F8-09E451178431"]) && (menuDetail["F95FD3FB-6039-26A2-98F8-09E451178431"].Visibility === "E925F86B")) && //F95FD3FB-6039-26A2-98F8-09E451178431
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
                                                        disabled={(menuDetail["F95FD3FB-6039-26A2-98F8-09E451178431"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["BFCF0607-7215-6A36-800B-C3086A145B2B"]) && (menuDetail["BFCF0607-7215-6A36-800B-C3086A145B2B"].Visibility === "E925F86B")) && //BFCF0607-7215-6A36-800B-C3086A145B2B
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
                                                        disabled={(menuDetail["BFCF0607-7215-6A36-800B-C3086A145B2B"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="apiStatusCheckURL"
                                                        value={this.state.apiStatusCheckURL}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["B2415B06-5409-138C-5916-3EECC1859FD0"]) && (menuDetail["B2415B06-5409-138C-5916-3EECC1859FD0"].Visibility === "E925F86B")) && //B2415B06-5409-138C-5916-3EECC1859FD0
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.apirequest" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.apirequest">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["B2415B06-5409-138C-5916-3EECC1859FD0"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["CB15DEFD-8C1E-A5BB-2022-0619BAB083F4"]) && (menuDetail["CB15DEFD-8C1E-A5BB-2022-0619BAB083F4"].Visibility === "E925F86B")) && //CB15DEFD-8C1E-A5BB-2022-0619BAB083F4
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.trnidprefix" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.trnidprefix">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["CB15DEFD-8C1E-A5BB-2022-0619BAB083F4"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="TransactionIdPrefix"
                                                        value={this.state.TransactionIdPrefix}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["F16F99D7-4030-3CE0-5619-AF8E70BCA665"]) && (menuDetail["F16F99D7-4030-3CE0-5619-AF8E70BCA665"].Visibility === "E925F86B")) && //F16F99D7-4030-3CE0-5619-AF8E70BCA665
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.merchantCode" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.merchantCode">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["F16F99D7-4030-3CE0-5619-AF8E70BCA665"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["F781118F-8761-90B4-3ADA-726ADC11448B"]) && (menuDetail["F781118F-8761-90B4-3ADA-726ADC11448B"].Visibility === "E925F86B")) && //F781118F-8761-90B4-3ADA-726ADC11448B
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.successresponse" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.successresponse">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["F781118F-8761-90B4-3ADA-726ADC11448B"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="requestSuccess"
                                                        value={this.state.requestSuccess}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["035E9321-3BA6-7763-54D3-2392204F1949"]) && (menuDetail["035E9321-3BA6-7763-54D3-2392204F1949"].Visibility === "E925F86B")) && //035E9321-3BA6-7763-54D3-2392204F1949
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.failureresponse" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.failureresponse">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["035E9321-3BA6-7763-54D3-2392204F1949"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["ABCB43A6-8268-325A-003F-F22B9B012292"]) && (menuDetail["ABCB43A6-8268-325A-003F-F22B9B012292"].Visibility === "E925F86B")) && //ABCB43A6-8268-325A-003F-F22B9B012292
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.holdresponse" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.holdresponse">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["ABCB43A6-8268-325A-003F-F22B9B012292"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="requestHold"
                                                        value={this.state.requestHold}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["38B8EDE5-842A-8A5A-2AB6-2705D2A89055"]) && (menuDetail["38B8EDE5-842A-8A5A-2AB6-2705D2A89055"].Visibility === "E925F86B")) && //38B8EDE5-842A-8A5A-2AB6-2705D2A89055
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.authHeader" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.authHeader">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["38B8EDE5-842A-8A5A-2AB6-2705D2A89055"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["CB1664A3-1CCD-510D-A05D-2895C82D7792"]) && (menuDetail["CB1664A3-1CCD-510D-A05D-2895C82D7792"].Visibility === "E925F86B")) && //CB1664A3-1CCD-510D-A05D-2895C82D7792
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.contenttype" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.contenttype">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["CB1664A3-1CCD-510D-A05D-2895C82D7792"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="contentType"
                                                        value={this.state.contentType}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["620D55F2-978F-8740-668B-49357B0C65E6"]) && (menuDetail["620D55F2-978F-8740-668B-49357B0C65E6"].Visibility === "E925F86B")) && //620D55F2-978F-8740-668B-49357B0C65E6
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.methodtype" />
                                            </Label>
                                            <IntlMessages id="apiresponse.list.title.methodtype">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["620D55F2-978F-8740-668B-49357B0C65E6"].AccessRight === "11E6E7B0") ? true : false}
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
                                    {((menuDetail["8CC8B085-00F5-57DD-5E96-7A129B1640AD"]) && (menuDetail["8CC8B085-00F5-57DD-5E96-7A129B1640AD"].Visibility === "E925F86B")) && //8CC8B085-00F5-57DD-5E96-7A129B1640AD
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.apptype" />
                                                <span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                disabled={(menuDetail["8CC8B085-00F5-57DD-5E96-7A129B1640AD"].AccessRight === "11E6E7B0") ? true : false}
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

                                                {this.state.appTypeList.length && this.state.appTypeList.map((item, key) => (
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
                                    {((menuDetail["9A11604A-042F-79A8-16BF-F1E5B6AB4000"]) && (menuDetail["9A11604A-042F-79A8-16BF-F1E5B6AB4000"].Visibility === "E925F86B")) && //9A11604A-042F-79A8-16BF-F1E5B6AB4000
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="apiresponse.list.title.parsingdata" />
                                            </Label>
                                            <Input
                                                disabled={(menuDetail["9A11604A-042F-79A8-16BF-F1E5B6AB4000"].AccessRight === "11E6E7B0") ? true : false}
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

                                                {this.state.parsingList.length && this.state.parsingList.map((item, key) => (
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
                                    {((menuDetail["CF40D710-1300-1F9C-54A2-CA66EC837F84"]) && (menuDetail["CF40D710-1300-1F9C-54A2-CA66EC837F84"].Visibility === "E925F86B")) && //CF40D710-1300-1F9C-54A2-CA66EC837F84
                                        <Col md={6} sm={6}>
                                            <Label for="status">
                                                <IntlMessages id="manageMarkets.list.form.label.status" />
                                            </Label>

                                            <Input
                                                disabled={(menuDetail["CF40D710-1300-1F9C-54A2-CA66EC837F84"].AccessRight === "11E6E7B0") ? true : false}
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
                            {/* added By jinesh bhatt cancel button add and change button alignment to center date : 04-02-2019 */}
                            <hr />
                            {menuDetail &&
                                <FormGroup row>
                                    <div className="offset-md-4 col-md-8 offset-sm-3 col-sm-9 col-xs-12">
                                        <div className="btn_area">
                                            <Button
                                                variant="raised"
                                                color="primary"
                                                className="text-white"
                                                onClick={() => this.addAPIRequestData()}
                                                disabled={this.props.loading}
                                            >
                                                <IntlMessages id="sidebar.pairConfiguration.button.add" />
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
                    </div>
                </Row>
            </div>
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    addRequestList: state.thirdPartyApiRequest.addRequestList,
    appTypeList: state.thirdPartyApiRequest.appTypeList,
    appTypeListLoading: state.thirdPartyApiRequest.appTypeListLoading,
    parsingDataList: state.thirdPartyApiResponse.apiResponseList,
    apiResponseListLoading: state.thirdPartyApiResponse.apiResponseListLoading,
    loading: state.thirdPartyApiRequest.addLoading,
    addError: state.thirdPartyApiRequest.addError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        addThirdPartyApiRequestList,
        getAppTypeList,
        getProvidersList,
        getThirdPartyApiResponse,
        getMenuPermissionByID
    }
)(AddRequestList);