// component for api plan configuration history by Tejas 11/3/2019
//import Necesssary component 
import React, { Component, Fragment } from 'react';
// used for connect component to store
import { connect } from "react-redux";
// import data table
import MUIDataTable from "mui-datatables";
//  Used For Display Notification 
import { NotificationManager } from "react-notifications";
// import tooltip
import Tooltip from "@material-ui/core/Tooltip";
// impport button 
// import Button from "@material-ui/core/Button";
// intl messages
import IntlMessages from "Util/IntlMessages";
// import for Pop over
import { Form, FormGroup, Col, Label, Input, Button } from 'reactstrap';
// used for drawer for open and edit form
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import Select from "react-select";

// used for display loader 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// component for view 
import ViewApiPlan from "./../ApiPlanConfiguration/ViewApiPlanConfiguration";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
// import action for fetch Api plan configuration list
import { getApiPlanConfigurationHistory } from "Actions/ApiKeyConfiguration";
// action for get api config list
import { getApiPlanConfigList } from "Actions/ApiKeyConfiguration";
import { CustomFooter } from 'Components/MyAccount/Dashboards/Widgets/CustomFooter';
import AppConfig from 'Constants/AppConfig';
//usd for card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { getUserDataList } from "Actions/MyAccount";
//Action methods..
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
        title: <IntlMessages id="sidebar.ApiKeyConfiguration" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.APIPlanConfigurationHistory" />,
        link: '',
        index: 1
    }
];

//class for apli plan configuration history 
class PlanConfigurationHistory extends Component {

    // constructor that defines default state
    constructor(props) {
        super(props);
        this.state = {
            apiPlanConfigurationHistory: [],
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
    onViewList = (List) => {
        this.setState({
            selectedRow: List,
            ViewList: true,
        })
    }

    onChangeSelectUser = (event) => {
        this.setState({ userId: (typeof (event.value) === "undefined" ? "" : event.value) });
    }

    // toogle drawer 
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
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

    // on change if change in any field store value in state
    handleChange = (event) => {

        this.setState({ [event.target.name]: event.target.value });
    }

    // set component and open drawer
    showComponent = (componentName) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
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
            //status: "",
            //planList: [],
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

            if (this.state.PageNo > 1) {
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
            this.props.getApiPlanConfigurationHistory(request);
        }
    }

    // close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            componentName: ''
        });
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

            /* if (this.state.status !== "") {
                request.Status = this.state.status;
            } */

            this.setState({
                onLoad: 1
            })
            request.PageNo = pageNumber - 1;
            request.PageSize = this.state.PageSize;
            this.setState({ PageNo: pageNumber, onLoad: 1 });
            this.props.getApiPlanConfigurationHistory({
                PageNo: pageNumber - 1,
                PageSize: this.state.PageSize,
                FromDate: this.state.start_date,
                ToDate: this.state.end_date,
            });
        }
    }


    // invoke after render and call api for get list
    // componentDidMount() {
    //     this.setState({
    //         onLoad: 1,
    //         PageNo: 1
    //     })
    //     this.props.getApiPlanConfigList({})
    //     this.props.getUserDataList();
    //     this.props.getApiPlanConfigurationHistory({
    //         PageNo: this.state.PageNo - 1,
    //         PageSize: this.state.PageSize,
    //         FromDate: this.state.start_date,
    //         ToDate: this.state.end_date
    //     })
    // }
    componentWillMount() {
        this.props.getMenuPermissionByID('B94E2126-3CB0-775A-7B89-80508A4D4DD1'); // get Trading menu permission
    }
    // invoke when component will about to get props 
    componentWillReceiveProps(nextprops) {

        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
        if (typeof nextprops.TotalCount !== 'undefined' && this.state.TotalCount !== nextprops.TotalCount) {
            this.setState({ TotalCount: nextprops.TotalCount })
        } else {
            this.setState({ TotalCount: 0 })
        }

        if (typeof nextprops.TotalPages !== 'undefined' && this.state.TotalPages !== nextprops.TotalPages) {
            this.setState({ TotalPages: nextprops.TotalPages })
        } else {
            this.setState({ TotalPages: 0 })
        }

        if (typeof nextprops.apiPlanConfigList !== 'undefined' && nextprops.apiPlanConfigList.length > 0) {

            this.setState({
                planList: nextprops.apiPlanConfigList
            })
        }

        if (nextprops.apiPlanConfigurationHistory && nextprops.apiPlanConfigurationHistory.length > 0 &&
            nextprops.error.length === 0 && this.state.onLoad) {
            this.setState({
                apiPlanConfigurationHistory: nextprops.apiPlanConfigurationHistory,
                onLoad: 0
            })
        } else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0 && this.state.onLoad) {
            NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
            this.setState({
                apiPlanConfigurationHistory: [],
                onLoad: 0
            })
        }

        if (nextprops.ErrorCode === 4501 && nextprops.error.length === 0 && this.state.onLoad) {
            NotificationManager.error(<IntlMessages id="trading.market.label.nodata" />);
            this.setState({
                apiPlanConfigurationHistory: [],
                onLoad: 0
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                this.setState({
                    onLoad: 1,
                    PageNo: 1
                })
                this.props.getApiPlanConfigList({})
                this.props.getUserDataList();
                this.props.getApiPlanConfigurationHistory({
                    PageNo: this.state.PageNo - 1,
                    PageSize: this.state.PageSize,
                    FromDate: this.state.start_date,
                    ToDate: this.state.end_date
                })
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
        var response = false;
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
        if (this.state.apiPlanConfigurationHistory.length === 0) {
            this.state.start_row = 0
        }
        else {
            this.state.start_row = 1
        }

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('B321C3A9-8C6C-26CE-2700-E4E30E467C71');//getting object detail for checking permissions // B321C3A9-8C6C-26CE-2700-E4E30E467C71
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        // defines columns header
        const columns = [
            {
                name: <IntlMessages id="apiplanconfiguration.title.planname" />,
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planvalidity" />
            },
            {
                name: <IntlMessages id="sidebar.priority" />,
                options: { sort: true, filter: false }
            },
            {
                name: <IntlMessages id="widgets.price" />,
            },
            {
                name: <IntlMessages id="table.charge" />,
            },
            {
                name: <IntlMessages id="apiplanconfiguration.title.planrecursive" />
            },
            {
                name: <IntlMessages id="sidebar.modifyDetail" />,
            },
            {
                name: <IntlMessages id="sidebar.Status" />,
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
            serverSide: this.state.apiPlanConfigurationHistory.length !== 0 ? true : false,
            page: this.state.PageNo,
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            customFooter: (count, page, rowsPerPage) => {
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
        };

        return (
            <React.Fragment>
                <div className="jbs-page-content">
                    {
                        (this.props.loading
                            || this.props.userPlanCountsLoading
                            || this.props.planListLoading
                            || this.props.userListLoading
                            || this.props.menuLoading
                        )

                        && <JbsSectionLoader />}
                    <Col md={12}>
                        <WalletPageTitle title={<IntlMessages id="sidebar.APIPlanConfigurationHistory" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                        <Col md={12} className="api-subscription">

                            {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check for filter permission
                                <JbsCollapsibleCard>
                                    <div className="top-filter">
                                        <Form className="frm_search tradefrm row">
                                            <FormGroup className="col-md-2 col-sm-4">
                                                <Label for="userId"><IntlMessages id="my_account.userName" /></Label>
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
                                                <div className="btn_area">
                                                    <Button color="primary" onClick={this.onApply} ><IntlMessages id="sidebar.tradingLedger.button.apply" /></Button>
                                                    <Button color="danger" className="ml-15" onClick={this.onClear}><IntlMessages id="sidebar.btnClear" /></Button>
                                                </div>
                                            </FormGroup>

                                        </Form>
                                    </div>
                                </JbsCollapsibleCard>
                            }
                            <div className="tbl_overflow_auto">
                                <MUIDataTable
                                    title={this.props.title}
                                    data={this.state.apiPlanConfigurationHistory && this.state.apiPlanConfigurationHistory.length !== 0 && this.state.apiPlanConfigurationHistory.map((item, key) => {
                                        var status = item.Status === 1 ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inactive" />
                                        var plan = item.IsPlanRecursive === 1 ? <IntlMessages id="button.yes" /> : <IntlMessages id="sidebar.no" />
                                        var type = item.PlanValidityType === 1 ? <IntlMessages id="sidebar.day" />
                                            : item.PlanValidityType === 2 ? <IntlMessages id="sidebar.month" /> :
                                                item.PlanValidityType === 3 ? <IntlMessages id="sidebar.year" /> : ""

                                        return [
                                            item.PlanName,
                                            <Fragment>
                                                {item.PlanValidity}   {type}
                                            </Fragment>,
                                            item.Priority,
                                            item.Price,
                                            item.Charge,
                                            <Fragment>
                                                {plan}
                                            </Fragment>,
                                            item.ModifyDetails,
                                            <Fragment>
                                                {item.Status == "1" &&
                                                    <span
                                                        style={{ float: "left" }}
                                                        className={`badge badge-xs badge-success position-relative`}
                                                    >
                                                        &nbsp;
                                                </span>
                                                }
                                                {item.Status == "0" &&
                                                    <span
                                                        style={{ float: "left" }}
                                                        className={`badge badge-xs badge-danger position-relative`}
                                                    >
                                                        &nbsp;
                                                </span>
                                                }
                                                <div className="status pl-30">{status}</div>
                                            </Fragment>,

                                            menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 ?
                                                <Fragment>
                                                    <div className="list-action">
                                                        <Tooltip title={<IntlMessages id="liquidityprovider.tooltip.view" />}
                                                            disableFocusListener disableTouchListener
                                                        >
                                                            <a href="javascript:void(0)" className="mr-10" onClick={(event) => {
                                                                this.onViewList(item)
                                                                this.showComponent('ViewApiPlan')
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
                        </Col>
                    </Col>

                    <Drawer
                        width="70%"
                        handler={false}
                        open={this.state.open}
                        onMaskClick={this.toggleDrawer}
                        className="drawer2 half_drawer"
                        level=".drawer1"
                        placement="right"
                        levelMove={100}
                    >
                        {(this.state.ViewList && this.state.selectedRow) &&
                            <ViewApiPlan {...this.props} selectedData={this.state.selectedRow} drawerClose={this.toggleDrawer} closeAll={this.closeAll} GUID="B321C3A9-8C6C-26CE-2700-E4E30E467C71" />
                        }
                    </Drawer>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = ({ actvHstrRdcer, ApiPlanConfigurationHistory, ApiPlanConfig, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { apiPlanConfigurationHistory, loading, error, TotalCount, TotalPages, ErrorCode } = ApiPlanConfigurationHistory;
    const { apiPlanConfigList } = ApiPlanConfig;
    const { getUser } = actvHstrRdcer;
    const userListLoading = actvHstrRdcer.loading;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { apiPlanConfigurationHistory, loading, error, TotalCount, getUser, userListLoading, TotalPages, ErrorCode, apiPlanConfigList, drawerclose, menuLoading, menu_rights }
}

// export this component with action methods and props
export default connect(
    mapStateToProps,
    {
        getApiPlanConfigList,
        getApiPlanConfigurationHistory,
        getUserDataList,
        getMenuPermissionByID
    }
)(PlanConfigurationHistory);