/**
 * Auther : Bharat Jograna
 * Created : 05 March 2019
 * Affiliate Click On Affiliate Link Report
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import { CustomFooter } from './Widgets';
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Select from "react-select";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { affiliateClickOnLinkReport, affiliateAllUser } from 'Actions/MyAccount';
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
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
        title: <IntlMessages id="sidebar.adminPanel" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="sidebar.affiliateManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.affiliateReport" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="my_account.affiliateClickOnAffiliateLinkReport" />,
        link: '',
        index: 3
    }
];

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colUserName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.email" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colIPAddress" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.coldatentime" />,
        options: { filter: true, sort: true }
    },
];

// Component for MyAccount Click On Affiliate Link Report
class ListAffiliateClickOnLinkReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0,
            ClickOnAffiliateLinkList: [],
            data: {
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList,
                UserId: "",
            },
            showReset: false,
            loading: false,

            userlist: [],
            userLable: null,
            menudetail: [],
			menuLoading: false,
			notificationFlag: true,
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('3EAD5829-8C3F-13E4-456F-0CEC66F52FDA'); // get wallet menu permission

    }

    // onchange module and status
    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    //onchange select user
    onChangeSelectUser = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.data);
        newObj.UserId = event.value;
        this.setState({ data: newObj, userLable: event.label });
    }

    // to apply the filter
    applyFilter = () => {
        this.setState({ showReset: true });
        var newObj = Object.assign({}, this.state.data);
        newObj.PageNo = 1;
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        if (this.state.data.FromDate === "" || this.state.data.ToDate === "") {
            NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
        } else {
            this.getClickOnAffiliateList(newObj.PageNo, newObj.PageSize);
        }
    }

    // to clear all the filter inputs
    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.UserId = "";
        newObj.PageNo = 1;
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        this.setState({ showReset: false, data: newObj, userLable: null });
        this.props.affiliateClickOnLinkReport(newObj);
    }

    closeAll = () => {
        this.props.closeAll();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading:nextProps.menuLoading});
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getClickOnAffiliateList(this.state.data.PageNo, this.state.data.PageSize);
                this.props.affiliateAllUser();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }

        // To set userList in React-select
        if (nextProps.userlist.ReturnCode === 0 && nextProps.userlist.hasOwnProperty('Response')) {
            this.setState({ userlist: nextProps.userlist.Response, totalCount: nextProps.userlist.TotalCount });
        }

        this.setState({ loading: nextProps.loading });
        if (nextProps.clist.ReturnCode === 1 || nextProps.clist.ReturnCode === 9) {
            this.setState({ ClickOnAffiliateLinkList: [], totalCount: 0 })
        } else if (nextProps.clist.ReturnCode === 0 && nextProps.clist.hasOwnProperty('Response')) {
            this.setState({ ClickOnAffiliateLinkList: nextProps.clist.Response, totalCount: nextProps.clist.TotalCount });
        }
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getClickOnAffiliateList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getClickOnAffiliateList(1, event.target.value);
    };

    //Get Click On Affiliate Data form API...
    getClickOnAffiliateList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        }
        this.setState({ data: newObj });
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.affiliateClickOnLinkReport(reqObj);
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
    render() {
        const { ClickOnAffiliateLinkList, userLable, userlist, totalCount } = this.state;
        const { drawerClose, loading } = this.props;
        const { PageNo, PageSize, FromDate, ToDate } = this.state.data;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('d9ce121a-a544-6f3f-396c-fa98081d43c3'); //D9CE121A-A544-6F3F-396C-FA98081D43C3
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

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
            serverSide: ClickOnAffiliateLinkList.length !== 0 ? true : false,
            page: PageNo,
            count: totalCount,
            rowsPerPage: PageSize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'Click_On_Affiliate_Link_Report_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getSendMailList(tableState.page, tableState.rowsPerPage);
                }
            }
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.affiliateClickOnAffiliateLinkReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
				{(this.state.menuLoading || loading) && <JbsSectionLoader />}
                 {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && // check filter curd operation */}
                <JbsCollapsibleCard>
                    <div className="top-filter">
                        <Form className="tradefrm row">
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} onChange={this.onChange} />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} onChange={this.onChange} />
                            </FormGroup>
                            <FormGroup className="rsel col-md-2 col-sm-4">
                                <Label for="UserId"><IntlMessages id="my_account.userName" /></Label>
                                <Select className="r_sel_20"
                                    options={userlist.map((user) => ({
                                        label: user.UserName,
                                        value: user.Id,
                                    }))}
                                    value={this.state.userLable === null ? null : ({ label: userLable })}
                                    onChange={this.onChangeSelectUser}
                                    isClearable={true}
                                    maxMenuHeight={200}
                                    placeholder={<IntlMessages id="sidebar.searchdot" />}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <div className="btn_area">
                                    <Button color="primary" onClick={this.applyFilter}><IntlMessages id="sidebar.btnApply" /></Button>
                                    {this.state.showReset && <Button color="danger" className="ml-10" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </JbsCollapsibleCard>
                 }
                <div className="StackingHistory">
                    <MUIDataTable
                        // title={<IntlMessages id="my_account.affiliateClickOnAffiliateLinkReport" />}
                        columns={columns}
                        options={options}
                        data={
                            ClickOnAffiliateLinkList.map((lst, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize),
                                    lst.FirstName + " " + lst.LastName,
                                    lst.UserName,
                                    lst.UserEmail,
                                    lst.IpAddress,
                                    changeDateFormat(lst.ClickTime, 'DD-MM-YYYY hh:mm:ss')
                                ]
                            })
                        }
                    />
                </div>
            </div>
        );
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ AffiliateRdcer, drawerclose,authTokenRdcer }) => {
    // To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { clist, loading, userlist } = AffiliateRdcer;
    return { clist, loading, userlist, drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapStateToProps, {
    affiliateClickOnLinkReport,
    affiliateAllUser,
    getMenuPermissionByID
})(ListAffiliateClickOnLinkReport);