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
import { validateOnlyNumeric } from "Validations/pairConfiguration";
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
import { getMenuPermissionByID } from 'Actions/MyAccount';
const buttonSizeSmall = {
    maxHeight: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    fontSize: '1rem'
}

//  Class for Add Exchange feed configuration 
class AddFeedLimitList extends Component {
    // constructor 
    constructor(props) {
        super(props);
        //define default state
        this.state = {
            addNewData: false,
            selectedLimitType: "",
            selectedLimitDesc: "",
            selectedFeedLimitId: "",
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
            //added by parth andhariya 
            fieldList: {},
            notificationFlag: true,
            menudetail: [],
        };
    }
    //added by parth andhariya 
    componentWillMount() {
        this.props.getMenuPermissionByID('4C320AD6-1876-9C30-1BF0-9288CD82448B'); // get Trading menu permission
    }

    // close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    // close drawer
    handleClose = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    // set state for change feed limit
    handleChangeFeedLimit = (e) => {
        this.state.feedLimits.map((value, key) => {
            if (value.ID === e.target.value) {
                this.setState({
                    selectedFeedLimitId: e.target.value,
                    selectedLimitDesc: value.LimitType
                });
            }
        })
    }

    // set status in state
    handleChangeStatus = event => {
        this.setState({ selectedStatus: event.target.value });
    };

    // invoke when component recieve props
    componentWillReceiveProps(nextprops) {
        // set feed limits in state
        if (nextprops.feedLimits && nextprops.feedLimits.length > 0) {
            this.setState({ feedLimits: nextprops.feedLimits })
        }

        // display notification success or failure
        if (nextprops.addFeedLimitList && nextprops.addError.length === 0 && this.state.addNewData) {
            NotificationManager.success(<IntlMessages id="feedLimit.add.currency.success" />);
            this.setState({
                addNewData: false,
                open: false
            })
            this.props.drawerClose();
            this.props.getFeedLimitList({});
        } else if (nextprops.addError.length !== 0 && nextprops.addError.ReturnCode !== 0 && this.state.addNewData) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.addError.ErrorCode}`} />);
            this.setState({
                addNewData: false
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

    // requesrt for add limit data
    addFeedLimitData = () => {
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
            selectedStatus
        } = this.state;

        const data = {
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
        } else if (parseFloat(minSize) > parseFloat(maxSize)) {
            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.minSize" />);
        } else if (parseFloat(minRecordCount) > parseFloat(maxRecordCount)) {
            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.minCount" />);
        } else if (parseFloat(minLimit) > parseFloat(maxLimit)) {
            NotificationManager.error(<IntlMessages id="exchangefeed.title.select.minLimit" />);
        } else {
            this.setState({ addNewData: true });
            this.props.addFeedLimitList(data);
        }
    };

    // set state for only numeric values in text boxes
    handleChangeData = event => {
        if (validateOnlyNumeric(event.target.value) || event.target.value === '') {
            this.setState({ [event.target.name]: event.target.value })
        }
    }

    // reset data
    resetData = () => {
        this.props.drawerClose();
        this.setState({
            addNewData: false,
            selectedLimitType: "",
            selectedLimitDesc: "",
            selectedFeedLimitId: "",
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
        });
    };

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        let response = {};
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

    // render component
    render() {
        /* check menu permission */
        var menuDetail = this.checkAndGetMenuAccessDetail('11259F23-9F8D-5482-0E12-22ED050A6E2C');//11259F23-9F8D-5482-0E12-22ED050A6E2C
        return (
            <div className="m-10 p-5">
                {(
                    this.props.loading
                    || this.props.feedLimitLoading
                    || this.props.addLoading
                    || this.props.menuLoading
                ) && <JbsSectionLoader />}
                <div className="m-20 page-title d-flex justify-content-between align-items-center">
                    <div className="page-title-wrap">
                        <h2><IntlMessages id="exchangefeed.title.select.addfeed" /></h2>
                    </div>
                    <div className="page-title-wrap drawer_btn mb-10 text-right">
                        <CloseButton className="btn-warning text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={() => this.resetData()}><i className="zmdi zmdi-mail-reply"></i></CloseButton>
                        <CloseButton className="btn-info text-white mr-10 mb-10" style={buttonSizeSmall} variant="fab" mini onClick={this.props.closeAll}><i className="zmdi zmdi-home"></i></CloseButton>
                    </div>
                </div>
                <Form className="m-10 tradefrm">
                    <FormGroup>
                        <Row>
                            {((menuDetail["22576EA5-5427-5536-50C8-79FC3A485018"]) && (menuDetail["22576EA5-5427-5536-50C8-79FC3A485018"].Visibility === "E925F86B")) && //22576EA5-5427-5536-50C8-79FC3A485018
                                <Col md={6} sm={6}>
                                    <Label>
                                        <IntlMessages id="exchangefeed.title.select.feedlimit" /> <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(menuDetail["22576EA5-5427-5536-50C8-79FC3A485018"].AccessRight === "11E6E7B0") ? true : false}
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
                                        {this.state.feedLimits.length > 0 && this.state.feedLimits.map((item, key) => (
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
                            {((menuDetail["876B1E1C-3EFD-5820-7FB5-71A6C19A2382"]) && (menuDetail["876B1E1C-3EFD-5820-7FB5-71A6C19A2382"].Visibility === "E925F86B")) && //876B1E1C-3EFD-5820-7FB5-71A6C19A2382
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
                                                disabled={(menuDetail["876B1E1C-3EFD-5820-7FB5-71A6C19A2382"].AccessRight === "11E6E7B0") ? true : false}
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
                            {((menuDetail["7F6E19AE-3DE1-2AB2-9643-06C7E6D04C57"]) && (menuDetail["7F6E19AE-3DE1-2AB2-9643-06C7E6D04C57"].Visibility === "E925F86B")) && //7F6E19AE-3DE1-2AB2-9643-06C7E6D04C57
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
                                                disabled={(menuDetail["7F6E19AE-3DE1-2AB2-9643-06C7E6D04C57"].AccessRight === "11E6E7B0") ? true : false}
                                                name="minSize"
                                                value={this.state.minSize}
                                                onChange={this.handleChangeData}
                                                placeholder={placeholder} ></Input>
                                        }
                                    </IntlMessages>
                                </Col>
                            }
                            {((menuDetail["D16698BD-07BB-662A-01FD-90A2E0F06EC3"]) && (menuDetail["D16698BD-07BB-662A-01FD-90A2E0F06EC3"].Visibility === "E925F86B")) && //D16698BD-07BB-662A-01FD-90A2E0F06EC3
                                <Col md={6} sm={6}>
                                    <Label>
                                        <IntlMessages id="exchangefeed.title.maxSize" />
                                        {"           "}
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
                                                disabled={(menuDetail["D16698BD-07BB-662A-01FD-90A2E0F06EC3"].AccessRight === "11E6E7B0") ? true : false}
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
                            {((menuDetail["1943453B-3735-57E8-08E5-77272DC487DB"]) && (menuDetail["1943453B-3735-57E8-08E5-77272DC487DB"].Visibility === "E925F86B")) && //1943453B-3735-57E8-08E5-77272DC487DB
                                <Col md={6} sm={6}>
                                    <Label>
                                        <IntlMessages id="exchangefeed.title.minRoundCount" />
                                        {"           "}
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
                                                disabled={(menuDetail["1943453B-3735-57E8-08E5-77272DC487DB"].AccessRight === "11E6E7B0") ? true : false}
                                                name="minRecordCount"
                                                value={this.state.minRecordCount}
                                                onChange={this.handleChangeData}
                                                placeholder={placeholder} ></Input>
                                        }
                                    </IntlMessages>
                                </Col>
                            }
                            {((menuDetail["68412D41-7C03-46E4-45FD-F2B318895216"]) && (menuDetail["68412D41-7C03-46E4-45FD-F2B318895216"].Visibility === "E925F86B")) && //68412D41-7C03-46E4-45FD-F2B318895216
                                <Col md={6} sm={6}>
                                    <Label>
                                        <IntlMessages id="exchangefeed.title.maxRoundCount" />
                                        {"           "}
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
                                                disabled={(menuDetail["68412D41-7C03-46E4-45FD-F2B318895216"].AccessRight === "11E6E7B0") ? true : false}
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
                            {((menuDetail["6AF0E537-9327-6091-95BB-B10CAE8B5022"]) && (menuDetail["6AF0E537-9327-6091-95BB-B10CAE8B5022"].Visibility === "E925F86B")) && //6AF0E537-9327-6091-95BB-B10CAE8B5022
                                <Col md={6} sm={6}>
                                    <Label>
                                        <IntlMessages id="exchangefeed.title.minLimit" />
                                        {"           "}
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
                                                disabled={(menuDetail["6AF0E537-9327-6091-95BB-B10CAE8B5022"].AccessRight === "11E6E7B0") ? true : false}
                                                name="minLimit"
                                                value={this.state.minLimit}
                                                onChange={this.handleChangeData}
                                                placeholder={placeholder} ></Input>
                                        }
                                    </IntlMessages>
                                </Col>
                            }
                            {((menuDetail["0EB1BC11-3918-76B3-2570-F35C91F84B6F"]) && (menuDetail["0EB1BC11-3918-76B3-2570-F35C91F84B6F"].Visibility === "E925F86B")) && //0EB1BC11-3918-76B3-2570-F35C91F84B6F
                                <Col md={6} sm={6}>
                                    <Label>
                                        <IntlMessages id="exchangefeed.title.maxLimit" />
                                        {"           "}
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
                                                disabled={(menuDetail["0EB1BC11-3918-76B3-2570-F35C91F84B6F"].AccessRight === "11E6E7B0") ? true : false}
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
                            {((menuDetail["474AECDD-91C5-1F5B-8D13-594F3B063B45"]) && (menuDetail["474AECDD-91C5-1F5B-8D13-594F3B063B45"].Visibility === "E925F86B")) && //474AECDD-91C5-1F5B-8D13-594F3B063B45
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
                                                disabled={(menuDetail["474AECDD-91C5-1F5B-8D13-594F3B063B45"].AccessRight === "11E6E7B0") ? true : false}
                                                name="rowLengthSize"
                                                value={this.state.rowLengthSize}
                                                onChange={this.handleChangeData}
                                                placeholder={placeholder} ></Input>
                                        }
                                    </IntlMessages>
                                </Col>
                            }
                            {((menuDetail["35AD525A-17F1-9869-4E9D-DF9298767D74"]) && (menuDetail["35AD525A-17F1-9869-4E9D-DF9298767D74"].Visibility === "E925F86B")) && //35AD525A-17F1-9869-4E9D-DF9298767D74
                                <Col md={6} sm={6}>
                                    <Label>
                                        <IntlMessages id="manageMarkets.list.form.label.status" /> <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        disabled={(menuDetail["35AD525A-17F1-9869-4E9D-DF9298767D74"].AccessRight === "11E6E7B0") ? true : false}
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
                    {Object.keys(menuDetail).length > 0 &&
                        <FormGroup row>
                            <div className="offset-md-5 col-md-7 offset-sm-5 col-sm-7 col-xs-12">
                                <div className="btn_area">
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        className="text-white"
                                        onClick={() => this.addFeedLimitData()}
                                        disabled={this.props.loading}
                                    >
                                        <IntlMessages id="button.add" />
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
        )
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = state => ({
    feedLimits: state.feedLimit.feedLimitTypes,
    feedLimitLoading: state.feedLimit.feedLimitLoading,
    addFeedLimitList: state.feedLimit.addFeedLimitList,
    addLoading: state.feedLimit.addLoading,
    addError: state.feedLimit.addError,
    menuLoading: state.authTokenRdcer.menuLoading,
    menu_rights: state.authTokenRdcer.menu_rights,
});

// export this component with action methods and props
export default connect(mapStateToProps, {
    addFeedLimitList,
    getFeedLimitList,
    updateFeedLimitList,
    getExchangeFeedLimit,
    getMenuPermissionByID
})(AddFeedLimitList);