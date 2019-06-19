// component for add Exchange feed configuration By Tejas 15/2/2019

import React, { Component } from 'react';

// Used for connect to store
import { connect } from "react-redux";

// import for tooltip
import Tooltip from "@material-ui/core/Tooltip";

// used for set design
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col
} from "reactstrap";

// used for close buttons
import CloseButton from '@material-ui/core/Button';

// import for insert only numeric data
import {
    validateOnlyNumeric
} from "Validations/pairConfiguration";

//  Used For Display Notification 
import { NotificationManager } from "react-notifications";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

//Action Import for Payment Method  Report Add And Update
import {
    addFeedLimitList,
    getFeedLimitList,
    updateFeedLimitList,
    getExchangeFeedLimit
} from "Actions/ExchangeFeedConfig";

// import section loader
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
//  Class for Update Exchange feed configuration 
class UpdateFeedLimitList extends Component {
    // constructor 
    constructor(props) {
        super(props);
        // define default state
        this.state = {
            updateNewData: false,
            selectedFeedLimitId: this.props.selectedData.LimitType !== "" ? this.props.selectedData.LimitType : "",
            selectedLimitDesc: this.props.selectedData.LimitDesc ? this.props.selectedData.LimitDesc : "",
            feedLimits: [],
            selectedStatus: this.props.selectedData.Status !== "" ? this.props.selectedData.Status : "",
            maxSize: this.props.selectedData.MaxSize !== "" ? this.props.selectedData.MaxSize : "",
            minSize: this.props.selectedData.MinSize !== "" ? this.props.selectedData.MinSize : "",
            rowLengthSize: this.props.selectedData.RowLenghtSize !== "" ? this.props.selectedData.RowLenghtSize : "",
            maxRowCount: this.props.selectedData.MaxRowCount !== "" ? this.props.selectedData.MaxRowCount : "",
            maxRecordCount: this.props.selectedData.MaxRecordCount !== "" ? this.props.selectedData.MaxRecordCount : "",
            minRecordCount: this.props.selectedData.MinRecordCount !== "" ? this.props.selectedData.MinRecordCount : "",
            maxLimit: this.props.selectedData.MaxLimit !== "" ? this.props.selectedData.MaxLimit : "",
            minLimit: this.props.selectedData.MinLimit !== "" ? this.props.selectedData.MinLimit : "",
            Id: this.props.selectedData.ID ? this.props.selectedData.ID : 0,
            //added by parth andhariya 
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('4C320AD6-1876-9C30-1BF0-9288CD82448B'); // get Trading menu permission
        // code added by parth andhariya for handle and check menu detail and store (19-4-2019)
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

    // close drawer
    handleClose = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    };

    // set state for change feed limit
    handleChangeFeedLimit = (e) => {
        this.state.feedLimits.map((value, key) => {
            if (value.ID == e.target.value) {
                this.setState({
                    selectedFeedLimitId: e.target.value,
                    selectedLimitDesc: value.LimitType,
                    isUpdate: true
                });
            }
        })
    }

    // set status in state
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value, isUpdate: true });
    };

    // invoke when component recieve props
    componentWillReceiveProps(nextprops) {
        // set feed limits in state
        if (nextprops.feedLimits && nextprops.feedLimits.length > 0) {
            this.setState({
                feedLimits: nextprops.feedLimits
            })
        }

        // display notification success or failure
        if (nextprops.updateFeedLimitList && nextprops.updateError.length == 0 && this.state.updateNewData) {

            NotificationManager.success(<IntlMessages id="feedLimit.update.currency.success" />);
            this.setState({
                updateNewData: false,
                open: false
            })
            this.props.drawerClose();
            this.props.getFeedLimitList({});
        } else if (nextprops.updateError.length !== 0 && nextprops.updateError.ReturnCode !== 0 && this.state.updateNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                updateNewData: false
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.props.getExchangeFeedLimit({})
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    // requesrt for Update limit data
    updateFeedLimitData = () => {
        const {
            selectedFeedLimitId,
            selectedLimitDesc,
            maxSize, minSize,
            rowLengthSize,
            maxRowCount,
            maxRecordCount,
            minRecordCount,
            maxLimit,
            minLimit,
            selectedStatus, Id
        } = this.state;

        const data = {
            ID: Id,
            MaxSize: maxSize !== "" ? parseFloat(maxSize) : 0,
            MinSize: minSize !== "" ? parseFloat(minSize) : 0,
            RowLenghtSize: rowLengthSize !== "" ? parseFloat(rowLengthSize) : 0,
            MaxRowCount: maxRowCount !== "" ? parseFloat(maxRowCount) : 0,
            MaxRecordCount: maxRecordCount !== "" ? parseFloat(maxRecordCount) : 0,
            MinRecordCount: minRecordCount !== "" ? parseFloat(minRecordCount) : 0,
            MaxLimit: maxLimit !== "" ? parseFloat(maxLimit) : 0,
            MinLimit: minLimit !== "" ? parseFloat(minLimit) : 0,
            LimitType: selectedFeedLimitId !== "" ? parseFloat(selectedFeedLimitId) : 0,
            LimitDesc: selectedLimitDesc,
            Status: selectedStatus !== "" ? parseFloat(selectedStatus) : 0,
        };

        if (selectedFeedLimitId === "" || selectedFeedLimitId == null) {


            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.enter.feedlimit" />);
        } else if (selectedLimitDesc === "" || selectedLimitDesc == null) {

            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.enter.feedlimit" />);
        } else if (selectedStatus === "" || selectedStatus == null) {

            NotificationManager.error(<IntlMessages id="sidebar.pairConfiguration.errors.status" />);
        } else if ((minSize !== "" && maxSize === "") || (maxSize !== "" && minSize === "")) {

            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.both.size" />);
        } else if ((minLimit !== "" && maxLimit === "") || (maxLimit !== "" && minLimit === "")) {

            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.both.limit" />);
        } else if ((minRecordCount !== "" && maxRecordCount === "") || (maxRecordCount !== "" && minRecordCount === "")) {

            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.both.recordcount" />);
        } else if ((minSize !== "" || minSize !== null) && (maxSize !== "" || maxSize !== null) && minSize > maxSize) {

            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.minSize" />);
        } else if ((minRecordCount !== "" || minRecordCount !== null) && (maxRecordCount !== "" || maxRecordCount !== null) && minRecordCount > maxRecordCount) {

            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.minCount" />);
        } else if ((minLimit !== "" || minLimit !== null) && (maxLimit !== "" || maxLimit !== null) && minLimit > maxLimit) {

            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.minLimit" />);
        }
        else {
            if (this.state.isUpdate) {
                this.setState({
                    updateNewData: true
                })
                this.props.updateFeedLimitList(data);
            } else {
                NotificationManager.error(<IntlMessages id="sidebar.apikeypolicy.pleaseChange" />)
            }
        }
    };

    // invoke after render 
    // componentDidMount() {
    //     this.props.getExchangeFeedLimit({})
    // }

    // set state for only numeric values in text boxes
    handleChangeData = event => {
        if (validateOnlyNumeric(event.target.value) || event.target.value === '') {
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
            selectedLimitType: "",
            selectedLimitDesc: "",
            feedLimits: [],
            selectedStatus: "",
            maxSize: "",
            minSize: "",
            rowLengthSize: "",
            maxRowCount: "",
            maxRecordCount: "",
            minRecordCount: "",
            maxLimit: "",
            minLimit: "",
            isUpdate: false
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
                        return response = fieldList;
                    }
                }
            }
        } else {
            return response;
        }
    }
    // render component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('4619E8FB-6ED9-8C50-85A3-D7F56C669B9F');//4619E8FB-6ED9-8C50-85A3-D7F56C669B9F
        return (
            <div className="m-10 p-5">
                {(
                    this.props.loading
                    || this.props.feedLimitLoading
                    || this.props.updateLoading
                    || this.props.menuLoading
                ) && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="exchangefeed.title.select.updatefeed" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                       <Form className="m-10 tradefrm">

                            <FormGroup>
                                <Row>
                                    {((menuDetail["F5FE1C64-5079-4B28-5647-C4CB2ACD7E41"]) && (menuDetail["F5FE1C64-5079-4B28-5647-C4CB2ACD7E41"].Visibility === "E925F86B")) && //F5FE1C64-5079-4B28-5647-C4CB2ACD7E41
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.select.feedlimit" /> <span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                disabled={(menuDetail["F5FE1C64-5079-4B28-5647-C4CB2ACD7E41"].AccessRight === "11E6E7B0") ? true : false}
                                                type="select"
                                                name="methodId"
                                                value={this.state.selectedFeedLimitId}
                                                onChange={(e) => this.handleChangeFeedLimit(e)}
                                            >
                                                <IntlMessages id="exchangefeed.title.select.enter.feedlimit">
                                                    {(select) =>
                                                        <option value="">{select}</option>
                                                    }
                                                </IntlMessages>

                                                {this.state.feedLimits.length && this.state.feedLimits.map((item, key) => (
                                                    <option
                                                        value={item.ID}
                                                        key={key}
                                                    >
                                                        {item.LimitType ? item.LimitType : "-"}
                                                    </option>
                                                ))}
                                            </Input>
                                        </Col>
                                    }
                                    {((menuDetail["13CD1D96-26B3-697D-29F7-0A45B77961DC"]) && (menuDetail["13CD1D96-26B3-697D-29F7-0A45B77961DC"].Visibility === "E925F86B")) && //13CD1D96-26B3-697D-29F7-0A45B77961DC
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.maxRowCount" />

                                                {"           "}
                                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.maxrowcount" />}
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
                                            <IntlMessages id="exchangefeed.title.maxRowCount">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["13CD1D96-26B3-697D-29F7-0A45B77961DC"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="maxRowCount"
                                                        value={this.state.maxRowCount}
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
                                    {((menuDetail["DFDB0095-328D-21B5-3207-AC549589683D"]) && (menuDetail["DFDB0095-328D-21B5-3207-AC549589683D"].Visibility === "E925F86B")) && //DFDB0095-328D-21B5-3207-AC549589683D
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.minSize" />

                                                {"           "}
                                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.minsize" />}
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
                                            <IntlMessages id="exchangefeed.title.minSize">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["DFDB0095-328D-21B5-3207-AC549589683D"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="minSize"
                                                        value={this.state.minSize}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["D16A2C38-0DF9-4A6A-0611-D988E36213EA"]) && (menuDetail["D16A2C38-0DF9-4A6A-0611-D988E36213EA"].Visibility === "E925F86B")) && //D16A2C38-0DF9-4A6A-0611-D988E36213EA
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.maxSize" />
                                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.maxsize" />}
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
                                            <IntlMessages id="exchangefeed.title.maxSize">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["D16A2C38-0DF9-4A6A-0611-D988E36213EA"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="maxSize"
                                                        value={this.state.maxSize}
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
                                    {((menuDetail["6A36C74B-8080-78BB-9B02-AC4A59B8184D"]) && (menuDetail["6A36C74B-8080-78BB-9B02-AC4A59B8184D"].Visibility === "E925F86B")) && //6A36C74B-8080-78BB-9B02-AC4A59B8184D
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.minRoundCount" />
                                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.minrecordcount" />}
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
                                            <IntlMessages id="exchangefeed.title.minRoundCount">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["6A36C74B-8080-78BB-9B02-AC4A59B8184D"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="minRecordCount"
                                                        value={this.state.minRecordCount}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["066A5603-1831-79F5-5C08-61872F4F9FB3"]) && (menuDetail["066A5603-1831-79F5-5C08-61872F4F9FB3"].Visibility === "E925F86B")) && //066A5603-1831-79F5-5C08-61872F4F9FB3
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.maxRoundCount" />
                                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.maxrecordcount" />}
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
                                            <IntlMessages id="exchangefeed.title.maxRoundCount">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["066A5603-1831-79F5-5C08-61872F4F9FB3"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="maxRecordCount"
                                                        value={this.state.maxRecordCount}
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
                                    {((menuDetail["927F91D8-8802-5004-981A-46E7FE359F60"]) && (menuDetail["927F91D8-8802-5004-981A-46E7FE359F60"].Visibility === "E925F86B")) && //927F91D8-8802-5004-981A-46E7FE359F60
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.minLimit" />
                                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.minlimit" />}
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
                                            <IntlMessages id="exchangefeed.title.minLimit">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["927F91D8-8802-5004-981A-46E7FE359F60"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="minLimit"
                                                        value={this.state.minLimit}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["EF3B73F0-96CA-524E-3057-6303CC473928"]) && (menuDetail["EF3B73F0-96CA-524E-3057-6303CC473928"].Visibility === "E925F86B")) && //EF3B73F0-96CA-524E-3057-6303CC473928
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.maxLimit" />
                                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.maxlimit" />}
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
                                            <IntlMessages id="exchangefeed.title.maxLimit">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["EF3B73F0-96CA-524E-3057-6303CC473928"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="maxLimit"
                                                        value={this.state.maxLimit}
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
                                    {((menuDetail["97988938-636F-50D0-A1DC-EACA319E704E"]) && (menuDetail["97988938-636F-50D0-A1DC-EACA319E704E"].Visibility === "E925F86B")) && //97988938-636F-50D0-A1DC-EACA319E704E
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="exchangefeed.title.rowsize" />

                                                {"           "}
                                                <Tooltip title={<IntlMessages id="exchangefeed.tooltip.rowlength" />}
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
                                            <IntlMessages id="exchangefeed.title.rowsize">
                                                {(placeholder) =>
                                                    <Input type="text"
                                                        disabled={(menuDetail["97988938-636F-50D0-A1DC-EACA319E704E"].AccessRight === "11E6E7B0") ? true : false}
                                                        name="rowLengthSize"
                                                        value={this.state.rowLengthSize}
                                                        onChange={this.handleChangeData}
                                                        placeholder={placeholder} ></Input>
                                                }
                                            </IntlMessages>
                                        </Col>
                                    }
                                    {((menuDetail["4FFB669D-9C63-7451-6CAD-F2300E385D5E"]) && (menuDetail["4FFB669D-9C63-7451-6CAD-F2300E385D5E"].Visibility === "E925F86B")) && //4FFB669D-9C63-7451-6CAD-F2300E385D5E
                                        <Col md={6} sm={6}>
                                            <Label>
                                                <IntlMessages id="manageMarkets.list.form.label.status" /> <span className="text-danger">*</span>
                                            </Label>
                                            <Input
                                                disabled={(menuDetail["4FFB669D-9C63-7451-6CAD-F2300E385D5E"].AccessRight === "11E6E7B0") ? true : false}
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
                                            </Input>
                                        </Col>
                                    }
                                </Row>
                            </FormGroup>

                            <hr />
                            {menuDetail &&
                                <FormGroup row>
                                <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                                    <div className="btn_area">
                                        <Button
                                            variant="raised"
                                            color="primary"
                                            className="text-white"
                                            onClick={() => this.updateFeedLimitData()}
                                            disabled={this.props.loading}
                                        >
                                            <IntlMessages id="sidebar.pairConfiguration.button.update" />
                                        </Button>
                                        <Button
                                            variant="raised"
                                            color="danger"
                                            className="text-white ml-10"
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
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    feedLimits: state.feedLimit.feedLimitTypes,
    feedLimitLoading: state.feedLimit.feedLimitLoading,
    updateFeedLimitList: state.feedLimit.updateFeedLimitList,
    updateLoading: state.feedLimit.updateLoading,
    updateError: state.feedLimit.updateError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        addFeedLimitList,
        getFeedLimitList,
        updateFeedLimitList,
        getExchangeFeedLimit,
        getMenuPermissionByID
    }
)(UpdateFeedLimitList);