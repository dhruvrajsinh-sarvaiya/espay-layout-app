/* 
    Developer : Kevin Ladani    
    Date : 04-01-2018
    Updated by: Bharat Jograna (BreadCrumb)09 March 2019, Saloni Rathod(18/03/2019)
    File Comment : List Activity Log Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormGroup, Label, Input, Button, Badge, Form } from 'reactstrap';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { CustomFooter } from './Widgets';
import { activityHistoryList } from "Actions/MyAccount";
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import validateActivityLogReport from 'Validations/MyAccount/activity_log_dashboard';
import { NotificationManager } from "react-notifications";
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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.reportsDashboard" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.ActivityLog" />,
        link: '',
        index: 2
    }
];

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colUserName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="myaccount.userColumn.action" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDeviceName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colIPAddress" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMode" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colLocation" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="my_account.common.status" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: false, sort: false }
    },
];

const StatusBadges = ({ data }) => {
    switch (data) {
        case 1: return <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>
        case 0: return <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>
        default: return null;
    }
}

//Component for MyAccount Organization Form Dashboard
class ListActivityLogDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            componentName: '',
            Getdata: {
                PageIndex: 1,
                Page_Size: AppConfig.totalRecordDisplayInList,
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                UserName: "",
                IpAddress: "",
                Device: "",
                Mode: ""
            },
            getList: [],
            errors: "",
            showReset: false,
            totalCount: 0,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        }
        this.initState = this.state.Getdata;
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.Getdata);
        newObj[event.target.name] = event.target.value;
        this.setState({ Getdata: newObj });
    }

    componentWillMount() {
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        var newObj = Object.assign({}, this.state.Getdata);
        newObj.FromDate = today;
        newObj.ToDate = today;
        this.props.getMenuPermissionByID('37A0AF71-27FC-5B63-70D7-CB8F848F9B4A'); // get myaccount menu permission

    }

    //Apply Filter option
    applyFilter = () => {
        this.setState({ showReset: true })
        const { errors, isValid } = validateActivityLogReport(this.state.Getdata);
        const { FromDate, ToDate } = this.state.Getdata;
        this.setState({ errors: errors });
        if (isValid) {
            if (FromDate === "" || ToDate === "") {
                NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
            } else {
                var newObj = Object.assign({}, this.state.Getdata);
                newObj.PageIndex = 0;
                newObj.Page_Size = this.state.Getdata.Page_Size;
                this.setState({ Getdata: newObj });
                this.props.activityHistoryList(newObj);
            }
        }
    }

    //clear filter
    clearFilter = () => {
        var newObj = Object.assign({}, this.state.Getdata);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.UserName = "";
        newObj.IpAddress = "";
        newObj.Device = "";
        newObj.Mode = "";
        newObj.PageIndex = 0;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        this.setState({ Getdata: newObj, showReset: false, errors: '' });
        this.props.activityHistoryList(newObj);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getActivityHistoryList(this.state.Getdata.PageIndex, this.state.Getdata.Page_Size);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }

        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        if (typeof nextProps.list.ActivityLogHistoryList !== 'undefined' && nextProps.list.ActivityLogHistoryList.length > 0) {
            this.setState({ getList: nextProps.list.ActivityLogHistoryList, totalCount: nextProps.list.TotalRow });
        } else if (typeof nextProps.list.ActivityLogHistoryList !== 'undefined' && nextProps.list.ActivityLogHistoryList.length === 0) {
            this.setState({ getList: [], totalCount: nextProps.list.TotalRow });
        }
    }

    getActivityHistoryList = (PageIndex, PageSize, ) => {
        var newObj = Object.assign({}, this.state.Getdata);
        newObj['PageIndex'] = PageIndex > 0 ? PageIndex : this.state.Getdata.PageIndex;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.Getdata.PageSize;
        this.setState({ Getdata: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageIndex = PageIndex > 0 ? PageIndex - 1 : 1;
        this.props.activityHistoryList(newObj);
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getActivityHistoryList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getActivityHistoryList(1, event.target.value);
    };

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


    render() {
        const { getList, errors, totalCount } = this.state;
        const { UserName, IpAddress, Mode, FromDate, ToDate, PageIndex, Page_Size } = this.state.Getdata;
        const { drawerClose, loading } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('CCC9E449-45D3-4A32-288B-B9F143C89B58'); //CCC9E449-45D3-4A32-288B-B9F143C89B58
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        //Table Options
        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            search: false, //menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            print: false,
            download: false,
            viewColumns: false,
            filter: false,
            sort: false,
            serverSide: getList.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: Page_Size,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'Activity_Log_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getActivityHistoryList(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.ActivityLog" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.props.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory">
                    {menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1 && // check filter curd operation ? */}
                        <JbsCollapsibleCard>
                            <div className="top-filter">
                                <Form className="tradefrm row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                        <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} max={today} onChange={this.onChange} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                        <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={this.onChange} />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="UserName"><IntlMessages id="lable.username" /></Label>
                                        <Input type="text" name="UserName" id="UserName" placeholder="Search.." value={UserName} onChange={(e) => this.onChange(e)} />
                                        {errors.UserName && (<span className="text-danger"><IntlMessages id={errors.UserName} /></span>)}
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="IpAddress"><IntlMessages id="my_account.lblIpAddress" /></Label>
                                        <Input type="text" name="IpAddress" id="IpAddress" placeholder="Search.." value={IpAddress} onChange={(e) => this.onChange(e)} />
                                        {errors.IpAddress && (<span className="text-danger"><IntlMessages id={errors.IpAddress} /></span>)}
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Mode"><IntlMessages id="sidebar.colMode" /></Label>
                                        <Input type="select" name="Mode" id="Mode" value={Mode} onChange={(e) => this.onChange(e)}>
                                            <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.colWeb">{(selectOption) => <option value="Web">{selectOption}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.mobile">{(selectOption) => <option value="Mobile">{selectOption}</option>}</IntlMessages>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button color="primary" onClick={this.applyFilter}><IntlMessages id="sidebar.btnApply" /></Button>
                                            {this.state.showReset && <Button color="danger" className="ml-15" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                    }
                    <div className="StackingHistory">
                        <MUIDataTable
                            columns={columns}
                            data={
                                getList.map((lst, index) => {
                                    return [
                                        index + 1 + (PageIndex * Page_Size),
                                        lst.UserName,
                                        lst.Action,
                                        lst.Device,
                                        lst.IpAddress,
                                        lst.Mode,
                                        lst.Location,
                                        <Fragment>
                                            <StatusBadges data={lst.Status} />
                                        </Fragment>,
                                        <span className="date">{changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                    ]
                                })
                            }
                            options={options}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

//map state to props
const mapStateToProps = ({ actvHstrRdcer, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { list, loading } = actvHstrRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return {
        list, loading, drawerclose, menuLoading,
        menu_rights
    };
};

export default connect(mapStateToProps, {
    activityHistoryList,
    getMenuPermissionByID
})(ListActivityLogDashboard);