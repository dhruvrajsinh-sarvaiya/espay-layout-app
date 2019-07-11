// component for api plan subscriptio history by Tejas 5/3/2019

//import Necesssary component 
import React, { Component, Fragment } from 'react';
// used for connect component to store
import { connect } from "react-redux";
// import data table
import MUIDataTable from "mui-datatables";
// used for pagination
import Pagination from "react-js-pagination";
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
// import tooltip
import Tooltip from "@material-ui/core/Tooltip";
import Select from "react-select";
import { getUserDataList } from "Actions/MyAccount";
// used for use multiple classes
import classnames from 'classnames';
// used for display loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// intl messages
import IntlMessages from "Util/IntlMessages";
// import for Pop over
import { Row, Col, Form, Label, Input, Button, FormGroup } from 'reactstrap';
// component for view 
import ViewApiPlan from "./ViewApiPlanSubscription";
// used for drawer for open and edit form
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
// import action for fetch Api plan configuration list
import {
    getApiSubscriptionHistory,
    getApiPlanUserCounts
} from "Actions/ApiKeyConfiguration";
// action for get api config list
import { getApiPlanConfigList } from "Actions/ApiKeyConfiguration";
//usd for card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';

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
        title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.APIPlanSubscriptionHistory" />,
        link: '',
        index: 1
    }
];

//class for subscription history 
class SubscriptionHistory extends Component {
    // constructor that defines default state
    constructor(props) {
        super(props);
        this.state = {
            subScriptionHistory: [],
            open: false,
            userPlanCounts: [],
            componentName: '',
            ViewList: false,
            selectedRow: [],
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            userId: "",
            planid: "",
            status: "",
            planList: [],
            onLoad: 0,
            PageNo: 1,
            PageSize: AppConfig.totalRecordDisplayInList,
            TotalCount: 0,
            TotalPages: 0,
            start_row: 1,
            notificationFlag: true,
            menudetail: [],
        };
    }

    // Set OR Open Dialog box for display List
    onViewList = (List, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                selectedRow: List,
                ViewList: true,
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // toogle drawer 
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: '',
            ViewList: false,
            selectedRow: [],
        })
    }

    // close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            ViewList: false,
            selectedRow: [],
            componentName: ''
        });
    }

    // set state for user id
    handleChangeUserId = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    // used for set state for chanage status
    handleChangeStatus = event => {
        this.setState({ status: event.target.value });
    };

    // on change if change in any field store value in state
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    // set component and open drawer
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: true
        });
    }

    // used for clear state
    onClear = event => {
        event.preventDefault();
        this.setState({
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            userId: "",
            planid: "",
            status: "",
            onLoad: 0
        })
    }


    // call APi onclick of apply button
    onApply = (event) => {
        if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
            NotificationManager.error(<IntlMessages id="report.organizationLedger.startDate" />);
        } else if (this.state.end_date < this.state.start_date) {
            NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
        } else if (this.state.end_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
        } else if (this.state.start_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
        } else {
            var request = { FromDate: this.state.start_date, ToDate: this.state.end_date };
            if (this.state.userId) {
                request.UserID = this.state.userId;
            }
            if (this.state.planid) {
                request.PlanID = this.state.planid;
            }
            if (this.state.status !== "") {
                request.Status = this.state.status;
            }
            if (this.state.PageNo > 1) {
                this.setState({ PageNo: 1 });
                request.PageNo = 0;
            }
            else {
                request.PageNo = this.state.PageNo - 1;
            }
            request.PageSize = this.state.PageSize;

            this.setState({
                onLoad: 1,
                PageNo: 1
            })
            // call action method which call when click on filter
            this.props.getApiSubscriptionHistory(request);
        }
    }

    onChangeSelectUser = (event) => {
        this.setState({ userId: (typeof (event.value) === "undefined" ? "" : event.value) });
    }

    //For handle Page Change
    handlePageChange = (pageNumber) => {
        if ((this.state.start_date !== '' && this.state.end_date === '') || (this.state.end_date !== '' && this.state.start_date === '')) {
            NotificationManager.error(<IntlMessages id="report.organizationLedger.startDate" />);
        } else if (this.state.end_date < this.state.start_date) {
            NotificationManager.error(<IntlMessages id="trading.openorders.datediff" />);
        } else if (this.state.end_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.endcurrentdate" />);
        } else if (this.state.start_date > this.state.currentDate) {
            NotificationManager.error(<IntlMessages id="trading.openorders.startcurrentdate" />);
        } else {
            var request = { FromDate: this.state.start_date, ToDate: this.state.end_date };
            if (this.state.userId) {
                request.UserID = this.state.userId;
            }
            if (this.state.planid) {
                request.PlanID = this.state.planid;
            }
            if (this.state.status !== "") {
                request.Status = this.state.status;
            }
            this.setState({ onLoad: 1 })
            request.PageNo = pageNumber - 1;
            request.PageSize = this.state.PageSize;
            this.setState({ PageNo: pageNumber, onLoad: 1 });
            this.props.getApiSubscriptionHistory({
                PageNo: pageNumber - 1,
                PageSize: this.state.PageSize,
                FromDate: this.state.start_date,
                ToDate: this.state.end_date,
            });
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('EB10806A-1260-128C-2CAA-FB5E194E5C20'); // get Trading menu permission
    }

    // invoke when component will about to get props 
    componentWillReceiveProps(nextprops) {
        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open2 === false) {
            this.setState({ open: false })
        }
        if (this.state.TotalCount !== nextprops.TotalCount) {
            this.setState({ TotalCount: nextprops.TotalCount })
        }

        if (this.state.TotalPages !== nextprops.TotalPages) {
            this.setState({ TotalPages: nextprops.TotalPages })
        }

        if (typeof nextprops.apiPlanConfigList !== 'undefined' && nextprops.apiPlanConfigList.length > 0) {
            this.setState({ planList: nextprops.apiPlanConfigList })
        }

        if (nextprops.subscriptionHistory && nextprops.subscriptionHistory.length > 0 &&
            nextprops.error.length === 0 && this.state.onLoad) {
            this.setState({
                subScriptionHistory: nextprops.subscriptionHistory,
                onLoad: 0
            })
        } else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0 && this.state.onLoad) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
            this.setState({
                subScriptionHistory: [],
                onLoad: 0
            })
        }

        if (nextprops.ErrorCode === 4501 && nextprops.error.length === 0 && this.state.onLoad) {
            NotificationManager.error(<IntlMessages id="trading.market.label.nodata" />);
            this.setState({
                subScriptionHistory: [],
                onLoad: 0
            })
        }

        if (nextprops.userPlanCounts && nextprops.userPlanCounts.length > 0) {
            this.setState({ userPlanCounts: nextprops.userPlanCounts })
        }

        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.setState({
                    onLoad: 1,
                    PageNo: 1
                })
                this.props.getUserDataList();
                this.props.getApiPlanConfigList({})
                this.props.getApiSubscriptionHistory({
                    PageNo: this.state.PageNo - 1,
                    PageSize: this.state.PageSize,
                    FromDate: this.state.start_date,
                    ToDate: this.state.end_date,
                })
                this.props.getApiPlanUserCounts({})
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        let response = false;
        var index;
        const { menudetail } = this.state;
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }

    // render the component
    render() {
        const { drawerClose } = this.props;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];
        let start_row = this.state.subScriptionHistory.length > 0 ? 1 : 0;

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('9476C9B2-4057-60A2-6057-4B1712870CDA');//getting object detail for checking permissions // 9476C9B2-4057-60A2-6057-4B1712870CDA

        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        // defines columns header
        const columns = [
            {
                name: <IntlMessages id="tradingLedger.filterLabel.userID" />,
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planname" />
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.plannameamount" />,
                options: { sort: true, filter: false }
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planstatus" />,
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planvalidity" />,
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.autorenew" />
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planRequested" />,
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planActivated" />,
            },
            {
                name: <IntlMessages id="liquidityprovider.list.column.label.action" />,
            }
        ];

        // set options for table (MUI data table)
        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            download: false,
            viewColumns: false,
            filter: false,
            pagination: false,
        };

        return (
            <React.Fragment>
                <Col md={12} className="jbs-page-content">
                    {
                        (this.props.loading
                            || this.props.userPlanCountsLoading
                            || this.props.planListLoading
                            || this.props.userListLoading
                            || this.props.menuLoading
                        )
                        && <JbsSectionLoader />}
                    <WalletPageTitle title={<IntlMessages id="sidebar.APIPlanSubscriptionHistory" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <Col Md={12} className="api-subscription">
                        {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission
                            <JbsCollapsibleCard>
                                <div className="top-filter">
                                    <Form className="frm_search tradefrm row">
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="UserId"><IntlMessages id="my_account.userName" /></Label>
                                            <Select className="r_sel_20"
                                                options={userlist.map((user) => ({
                                                    label: user.UserName,
                                                    value: user.Id,
                                                }))}
                                                onChange={this.onChangeSelectUser}
                                                maxMenuHeight={200}
                                                placeholder={<IntlMessages id="sidebar.searchdot" />}
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="planid">{<IntlMessages id="apiplanconfiguration.title.planid" />}</Label>
                                            <div className="app-selectbox-sm">
                                                <Input type="select" name="planid" value={this.state.planid} id="Select-2" onChange={this.handleChange}>
                                                    <IntlMessages id="apiplanconfiguration.selectplan">
                                                        {(selectCurrency) =>
                                                            <option value="">{selectCurrency}</option>
                                                        }
                                                    </IntlMessages>
                                                    {this.state.planList.map((plan, key) =>
                                                        <option key={key} value={plan.ID}>{plan.PlanName}</option>
                                                    )}
                                                </Input>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="startDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.startDate" />}</Label>
                                            <Input type="date" name="start_date" value={this.state.start_date} id="startDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                                        </FormGroup>

                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="endDate1">{<IntlMessages id="sidebar.tradingLedger.filterLabel.endDate" />}</Label>
                                            <Input type="date" name="end_date" value={this.state.end_date} id="endDate1" placeholder="dd/mm/yyyy" onChange={this.handleChange} />
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <Label for="status">
                                                <IntlMessages id="manageMarkets.list.form.label.status" />
                                            </Label>
                                            <Input
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
                                                <IntlMessages id="sidebar.active">
                                                    {(select) =>
                                                        <option value="1">{select}</option>
                                                    }
                                                </IntlMessages>
                                                <IntlMessages id="apiplanconfiguration.title.inprocess">
                                                    {(select) =>
                                                        <option value="9">{select}</option>
                                                    }
                                                </IntlMessages>
                                                <IntlMessages id="apiplanconfiguration.title.expire">
                                                    {(select) =>
                                                        <option value="0">{select}</option>
                                                    }
                                                </IntlMessages>
                                                <IntlMessages id="sidebar.btnDisable">
                                                    {(select) =>
                                                        <option value="2">{select}</option>
                                                    }
                                                </IntlMessages>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup className="col-md-2 col-sm-4">
                                            <div className="btn_area">
                                                <Button variant="raised" color="primary" onClick={this.onApply} ><IntlMessages id="sidebar.tradingLedger.button.apply" /></Button>
                                                <Button color="danger" className="ml-15" onClick={this.onClear}><IntlMessages id="sidebar.btnClear" /></Button>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </div>
                            </JbsCollapsibleCard>
                        }
                        {/* 1- Active, 2-Disable,  0 - Renew request, 9 -  expire */}
                        <div className="tbl_overflow_auto">
                            <MUIDataTable
                                title=""
                                data={this.state.subScriptionHistory.length !== 0 && this.state.subScriptionHistory.map((item, key) => {

                                    var status = item.Status === 1 ? <IntlMessages id="sidebar.active" /> :
                                        item.Status === 9 ? <IntlMessages id="apiplanconfiguration.title.expire" /> :
                                            item.Status === 0 ? <IntlMessages id="apiplanconfiguration.status.renewRequest" /> :
                                                item.Status === 2 ? <IntlMessages id="sidebar.btnDisable" /> : "-";
                                    var plan = item.IsPlanRecursive === 1 ? <IntlMessages id="button.yes" /> : <IntlMessages id="sidebar.no" />
                                    var type = item.PlanValidityType === 1 ? <IntlMessages id="sidebar.day" />
                                        : item.PlanValidityType === 2 ? <IntlMessages id="sidebar.month" /> :
                                            item.PlanValidityType === 3 ? <IntlMessages id="sidebar.year" /> : ""
                                    return [
                                        item.UserID,
                                        item.PlanName,
                                        item.TotalAmt,
                                        <Fragment>
                                            {item.Status === "1" &&
                                                <span
                                                    style={{ float: "left" }}
                                                    className={`badge badge-xs badge-success position-relative`}
                                                >
                                                    &nbsp;
                                                </span>
                                            }
                                            {item.Status === "0" &&
                                                <span
                                                    style={{ float: "left" }}
                                                    className={`badge badge-xs badge-warning position-relative`}
                                                >
                                                    &nbsp;
                                                </span>
                                            }
                                            {item.Status === "9" &&
                                                <span
                                                    style={{ float: "left" }}
                                                    className={`badge badge-xs badge-danger position-relative`}
                                                >
                                                    &nbsp;
                                                </span>
                                            }
                                            {item.Status === "2" &&
                                                <span
                                                    style={{ float: "left" }}
                                                    className={`badge badge-xs badge-warning position-relative`}
                                                >
                                                    &nbsp;
                                                </span>
                                            }
                                            <div className={classnames(item.Status === 1 ? "text-success" : item.Status === 0 ? "text-warning" : item.Status === 9 ? "text-danger" : "", "status pl-30 font-weight-bold")}>
                                                {status}
                                            </div>
                                        </Fragment>,
                                        <Fragment>
                                            {item.PlanValidity} {" "} {type}
                                        </Fragment>,
                                        <Fragment>
                                            <div className={item.IsPlanRecursive === 1 ? "text-primary font-weight-bold" : "text-warning font-weight-bold"}>{plan}</div>
                                        </Fragment>,
                                        item.RequestedDate.replace('T', ' ').split('.')[0],
                                        item.ActivationDate.replace('T', ' ').split('.')[0],
                                        menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 ?
                                            <Fragment>
                                                <div className="list-action">
                                                    <Tooltip title={<IntlMessages id="liquidityprovider.tooltip.view" />}
                                                        disableFocusListener disableTouchListener
                                                    >
                                                        <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                                            this.onViewList(item, this.checkAndGetMenuAccessDetail('9476C9B2-4057-60A2-6057-4B1712870CDA').HasChild)
                                                            this.showComponent('ViewApiPlan', this.checkAndGetMenuAccessDetail('9476C9B2-4057-60A2-6057-4B1712870CDA').HasChild)
                                                        }}><i className="ti-eye" />
                                                        </a>
                                                    </Tooltip>
                                                </div>
                                            </Fragment>
                                            : '-'
                                    ];
                                })}
                                columns={columns}
                                options={options}
                            />
                        </div>
                        {this.state.TotalCount > this.state.PageSize ?
                            <Row>
                                <Col md={5} className="mt-20">
                                    <span><IntlMessages id="apiplanconfiguration.totalpages" /> :- {this.state.TotalPages + 1}</span>
                                </Col>
                                <Col md={4} className="text-right">
                                    <div id="pagination_div">
                                        <Pagination className="pagination"
                                            activePage={this.state.PageNo}
                                            itemsCountPerPage={this.state.PageSize}
                                            totalItemsCount={this.state.TotalCount}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange}
                                            prevPageText='<'
                                            nextPageText='>'
                                            firstPageText='<<'
                                            lastPageText='>>'
                                        />
                                    </div>
                                </Col>
                                <Col md={3} className="text-right mt-20">
                                    <span>{this.state.PageNo > 1 ? (start_row) + (this.state.PageSize * (this.state.PageNo - 1)) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo)) : (start_row) + ' - ' + ((this.state.PageSize * this.state.PageNo) > this.state.TotalCount ? (this.state.TotalCount) : (this.state.PageSize * this.state.PageNo))} of {this.state.TotalCount} Records</span>
                                </Col>
                            </Row> :
                            null
                        }
                    </Col>
                </Col>
                <Drawer
                    width="50%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer2 half_drawer"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.ViewList && this.state.selectedRow &&
                        <ViewApiPlan {...this.props} selectedData={this.state.selectedRow} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                </Drawer>
            </React.Fragment>
        )
    }
}

const mapStateToProps = ({ actvHstrRdcer, ApiPlanSubscription, ApiPlanConfig, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { subscriptionHistory, loading, error, userPlanCounts, userPlanCountsLoading, userPlanCountsError, TotalCount, TotalPages, ErrorCode } = ApiPlanSubscription;
    const { apiPlanConfigList } = ApiPlanConfig;
    const { getUser } = actvHstrRdcer;
    const userListLoading = actvHstrRdcer.loading;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { getUser, userListLoading, subscriptionHistory, loading, error, userPlanCounts, userPlanCountsLoading, userPlanCountsError, TotalCount, TotalPages, ErrorCode, apiPlanConfigList, drawerclose, menuLoading, menu_rights }
}

// export this component with action methods and props
export default connect(mapStateToProps, {
    getApiPlanConfigList,
    getApiSubscriptionHistory,
    getApiPlanUserCounts,
    getUserDataList,
    getMenuPermissionByID
})(SubscriptionHistory);