/**
 * Author : Saloni Rathod
 * Created : 05/03/2019
  Affiliate Sms Sent Report 
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { CustomFooter } from './Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Select from "react-select";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { affiliateSmsSentReport, affiliateAllUser } from "Actions/MyAccount";
import { changeDateFormat } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

//BreadCrumb Data....
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
        title: <IntlMessages id="sidebar.affiliateSmsReport" />,
        link: '',
        index: 3
    }
];

//colums names
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAffiliateName" />,
        options: { filter: true, sort: true }
    },

    {
        name: <IntlMessages id="sidebar.colAffiliateUserName" />,
        options: { filter: true, sort: true }
    },

    {
        name: <IntlMessages id="my_account.mobileNo" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDateTime" />,
        options: { filter: true, sort: true }
    }
];

//affiliate list email sent class
class ListAffiliateSmsSentReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smslist: [],
            userlist: [],
            filter: {
                UserId: '',
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList,
                UserLabel: null,
            },
            count: '',
            showReset: false,
            loading: false,
            open: false,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    applyFilter = (event) => {
        event.preventDefault();
        var newObj = Object.assign({}, this.state.filter);
        newObj.UserId = this.state.filter.UserId;
        newObj.FromDate = this.state.filter.FromDate;
        newObj.ToDate = this.state.filter.ToDate;
        newObj.PageNo = 0;
        newObj.PageSize = this.state.filter.PageSize;
        this.setState({ showReset: true, filter: newObj });
        if (newObj.FromDate === "" || newObj.ToDate === "") {
            NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
        } else {
            this.props.affiliateSmsSentReport(newObj);
        }
    }

    clearFilter = () => {
        let curDate = new Date().toISOString().slice(0, 10);
        var newObj = Object.assign({}, this.state.filter);
        newObj.UserLabel = null;
        newObj.UserId = "";
        newObj.FromDate = curDate;
        newObj.ToDate = curDate;
        newObj['PageNo'] = this.state.filter.PageNo;
        newObj['PageSize'] = this.state.filter.PageSize;
        this.setState({ showReset: false, filter: newObj });
        this.props.affiliateSmsSentReport(newObj);
    }

    getaffiliateSmsSentReport = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.filter);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.filter.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.filter.PageSize;
        this.setState({ filter: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.affiliateSmsSentReport(reqObj);
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getaffiliateSmsSentReport(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getaffiliateSmsSentReport(1, event.target.value);
    };

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.filter);
        newObj[event.target.name] = event.target.value;
        this.setState({ filter: newObj });
    }

    //onchange select user
    onChangeSelectUser = (event) => {
        event === null && (event = { label: null, value: "" });
        var newObj = Object.assign({}, this.state.filter);
        newObj.UserId = event.value;
        newObj.UserLabel = event.label;
        this.setState({ filter: newObj });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('AB532624-2924-16E9-A315-594FF7D283AC'); // get wallet menu permission
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

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.affiliateAllUser();
                this.getaffiliateSmsSentReport(this.state.filter.PageNo, this.state.filter.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        if (nextProps.userlist.ReturnCode === 0 && nextProps.userlist.hasOwnProperty('Response')) {
            this.setState({ userlist: nextProps.userlist.Response, totalcount: nextProps.userlist.TotalCount });
        }

        if (nextProps.smslist.ReturnCode === 1 || nextProps.smslist.ReturnCode === 9) {
            this.setState({ smslist: [], totalcount: 0 });
        } else if (nextProps.smslist.ReturnCode === 0) {
            this.setState({ smslist: nextProps.smslist.Response, totalcount: nextProps.smslist.TotalCount });
        }
    }

    render() {
        const { loading, totalcount, smslist, userlist, } = this.state;
        const { FromDate, ToDate, PageNo, PageSize, UserLabel } = this.state.filter;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('0dbd3c36-698f-8678-52a1-e1c102b59385'); //0DBD3C36-698F-8678-52A1-E1C102B59385
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
            serverSide: smslist.length !== 0 ? true : false,
            page: PageNo,
            count: totalcount,
            rowsPerPage: PageSize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'Sms_Sent_List_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getaffiliateSmsSentReport(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.affiliateSmsReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation */}
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="FromDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                    <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                    <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup className="rsel col-md-2 col-sm-4">
                                    <Label for="UserId"><IntlMessages id="sidebar.colUserId" /></Label>
                                    <Select className="r_sel_20"
                                        options={userlist.map((user) => ({
                                            label: user.UserName,
                                            value: user.Id,
                                        }))}
                                        value={this.state.filter.UserLabel === null ? null : ({ label: UserLabel })}
                                        onChange={this.onChangeSelectUser}
                                        isClearable={true}
                                        maxMenuHeight={200}
                                        placeholder={<IntlMessages id="sidebar.searchdot" />}
                                    />
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
                        data={smslist.map((item, key) => {
                            return [
                                key + 1,
                                item.FirstName + ' ' + item.LastName,
                                item.UserName,
                                item.Mobile,
                                changeDateFormat(item.SentTime, 'YYYY-MM-DD HH:mm:ss'),
                            ];
                        })}
                        options={options}
                    />
                </div>
            </div>
        );
    }
}

//Mapstatetoprops...
const mapStateToProps = ({ AffiliateRdcer, authTokenRdcer }) => {
    const { smslist, loading, userlist } = AffiliateRdcer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { smslist, loading, userlist, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    affiliateSmsSentReport,
    affiliateAllUser,
    getMenuPermissionByID
})(ListAffiliateSmsSentReport);