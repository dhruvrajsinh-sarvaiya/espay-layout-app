/**
 * Author : Saloni Rathod
 * Created : 05/03/2019
  Affiliate Email Sent Report 
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { CustomFooter } from './Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Select from "react-select";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { affiliateEmailSentReport, affiliateAllUser } from "Actions/MyAccount";
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
        title: <IntlMessages id="sidebar.affiliateEmailReport" />,
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
        name: <IntlMessages id="sidebar.colEmail" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDateTime" />,
        options: { filter: false, sort: true }
    }
];

//affiliate list email sent class
class ListAffiliateEmailSentReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emaillist: [],
            userlist: [],
            userLable: null,
            filter: {
                UserId: '',
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList
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
        this.setState({ showReset: true });
        if (this.state.filter.FromDate === "" || this.state.filter.ToDate === "") {
            NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
        } else {
            this.props.affiliateEmailSentReport(newObj);
        }
    }

    clearFilter = () => {
        let curDate = new Date().toISOString().slice(0, 10);
        var newObj = Object.assign({}, this.state.filter);
        newObj.UserId = "";
        newObj.FromDate = curDate;
        newObj.ToDate = curDate;
        newObj['PageNo'] = this.state.filter.PageNo;
        newObj['PageSize'] = this.state.filter.PageSize;
        this.setState({ showReset: false, filter: newObj, userLable: null });
        this.props.affiliateEmailSentReport(newObj);
    }

    getaffiliateemailSentReport = (PageNo, PageSize, ) => {
        var newObj = Object.assign({}, this.state.filter);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.filter.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.filter.PageSize;
        this.setState({ filter: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.affiliateEmailSentReport(reqObj);
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getaffiliateemailSentReport(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getaffiliateemailSentReport(1, event.target.value);
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
        this.setState({ filter: newObj, userLable: event.label });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('D3F8AD91-0686-3C5C-60F5-0233F78B8E04'); // get wallet menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.affiliateAllUser();
                this.getaffiliateemailSentReport(this.state.filter.PageNo, this.state.filter.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }

        if (nextProps.userlist.ReturnCode === 0 && nextProps.userlist.hasOwnProperty('Response')) {
            this.setState({ userlist: nextProps.userlist.Response, totalcount: nextProps.userlist.TotalCount });
        }

        if (nextProps.emaillist.ReturnCode === 1 || nextProps.emaillist.ReturnCode === 9) {
            this.setState({ emaillist: [], totalcount: 0 });
        } else if (nextProps.emaillist.ReturnCode === 0) {
            this.setState({ emaillist: nextProps.emaillist.Response, totalcount: nextProps.emaillist.TotalCount });
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

    render() {
        const { loading, totalcount, emaillist, userlist, userLable } = this.state;
        const { FromDate, ToDate, PageNo, PageSize } = this.state.filter;
        const { drawerClose } = this.props

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('AFC50DD2-2525-4E54-A0CA-E54BF55AF5A5'); //86C6118D-347D-2F8E-A458-3D6591455D8A
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
            serverSide: emaillist.length !== 0 ? true : false,
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
                filename: 'Email_Sent_List_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getaffiliateemailSentReport(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.affiliateEmailReport" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation */}
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
                                    <Label for="UserId"><IntlMessages id="sidebar.colUserId" /></Label>
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
                        data={emaillist.map((item, key) => {
                            return [
                                key + 1,
                                item.FirstName + ' ' + item.LastName,
                                item.UserName,
                                item.Email,
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
    const { emaillist, loading, userlist } = AffiliateRdcer;
    const { menuLoading, menu_rights } = authTokenRdcer;
    return { emaillist, loading, userlist, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    affiliateEmailSentReport,
    affiliateAllUser,
    getMenuPermissionByID
})(ListAffiliateEmailSentReport);