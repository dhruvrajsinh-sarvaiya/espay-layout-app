/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount List Customer Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { CustomFooter } from './Widgets';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import MUIDataTable from "mui-datatables";
import { getCustomerRptData } from "Actions/MyAccount";
import { Form, FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by salim (BreadCrumb) dt:09/03/2019
import { changeDateFormat } from "Helpers/helpers";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import validateSignupReport from 'Validations/MyAccount/user_signup_report';
import AppConfig from 'Constants/AppConfig';
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
        title: <IntlMessages id="sidebar.customerDashboard" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.listCustomers" />,
        link: '',
        index: 2
    },
];

//Table Columns
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colUserName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colEmail" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMobile" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colFirstName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colLastName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colType" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: false }
    }
];

const ActiveInactiveStatus = ({ status }) => {
    let htmlStatus = "";
    if (!status) {
        htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>;
    } else {
        htmlStatus = <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>;
    }
    return htmlStatus;
};

//Component for MyAccount List Customer Dashboard
class ListCustomerDashboard extends Component {
    constructor(props) {
        super(props);
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        this.state = {
            Getdata: {
                PageIndex: 1,
                Page_Size: AppConfig.totalRecordDisplayInList,
                EmailAddress: "",
                Username: "",
                Mobile: "",
                Filtration: "",
                FromDate: today,
                ToDate: today
            },
            showReset: false,
            value: "",
            signUpData: [],
            loading: false,
            errors: {},
            open: false,
            totalCount: 0,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
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

    clearFilter = () => {
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        var newObj = Object.assign({}, this.state.Getdata);
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        newObj.EmailAddress = "";
        newObj.Username = "";
        newObj.Mobile = "";
        newObj.Filtration = "";
        newObj.FromDate = today;
        newObj.ToDate = today;
        this.setState({ showReset: false, Getdata: newObj, errors: '' });
        setTimeout(() => {
            this.getCustomerList(1, newObj.Page_Size);
        }, 100);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('2C0CE3EA-5B58-5DA1-9062-1BBBF86D638E'); // get wallet menu permission

    }

    //Get Customer List form API...
    getCustomerList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.Getdata);
        newObj['PageIndex'] = PageNo > 0 ? PageNo : this.state.Getdata.PageIndex;
        newObj['Page_Size'] = PageSize > 0 ? PageSize : this.state.Getdata.Page_Size;
        this.setState({ Getdata: newObj });

        //For Action API...
        var reqObj = newObj;
        this.props.getCustomerRptData(reqObj);
    }

    getFilterData = () => {
        this.setState({ showReset: true });
        const { errors, isValid } = validateSignupReport(this.state.Getdata);
        const { FromDate, ToDate } = this.state.Getdata;
        this.setState({ errors: errors });
        if (isValid) {
            if (FromDate === "" || ToDate === "") {
                NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
            } else {
                this.getCustomerList(1, this.state.Getdata.Page_Size);
            }
        }
    }

    componentWillReceiveProps(nextProps) {


        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getCustomerList(this.state.Getdata.PageIndex, this.state.Getdata.Page_Size);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
        // Added by salim (BreadCrumb) dt:09/03/2019
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        if (nextProps.userList.hasOwnProperty('SignReportViewmodes') && Object.keys(nextProps.userList.SignReportViewmodes.SignReportList).length > 0) {
            this.setState({ signUpData: nextProps.userList.SignReportViewmodes.SignReportList, totalCount: nextProps.userList.SignReportViewmodes.Total });
        } else if (nextProps.userList.hasOwnProperty('SignReportViewmodes') && Object.keys(nextProps.userList.SignReportViewmodes.SignReportList).length === 0) {
            this.setState({ signUpData: [], totalCount: nextProps.userList.SignReportViewmodes.Total });
        }
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getCustomerList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getCustomerList(1, event.target.value);
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
        const { signUpData, errors, totalCount } = this.state;
        const { drawerClose, loading } = this.props;
        const { Username, EmailAddress, Mobile, Filtration, FromDate, ToDate, PageIndex, Page_Size } = this.state.Getdata;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('89D371A8-0A4D-9604-8A43-CB625467532F'); //89D371A8-0A4D-9604-8A43-CB625467532F
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

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
            serverSide: signUpData.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: Page_Size,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getCustomerList(tableState.page, tableState.rowsPerPage);
                }
            }
        };

        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.listCustomers" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1 && // check filter curd operation ?
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                    <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" max={today} value={FromDate} onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                    <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="EmailAddress"><IntlMessages id="my_account.emailAddress" /></Label>
                                    <Input type="text" name="EmailAddress" id="EmailAddress" placeholder="Enter Email Address" value={EmailAddress} onChange={(e) => this.onChange(e)} />
                                    {errors.EmailAddress && (<span className="text-danger"><IntlMessages id={errors.EmailAddress} /></span>)}
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Username"><IntlMessages id="my_account.userName" /></Label>
                                    <Input type="text" name="Username" id="Username" placeholder="Enter Username" value={Username} onChange={(e) => this.onChange(e)} />
                                    {errors.Username && (<span className="text-danger"><IntlMessages id={errors.Username} /></span>)}
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Mobile"><IntlMessages id="my_account.mobileNo" /></Label>
                                    <Input type="text" name="Mobile" id="Mobile" placeholder="Enter Mobile No" value={Mobile} onChange={(e) => this.onChange(e)} />
                                    {errors.Mobile && (<span className="text-danger"><IntlMessages id={errors.Mobile} /></span>)}
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Filtration"><IntlMessages id="my_account.status" /></Label>
                                    <Input type="select" name="Filtration" id="Filtration" value={Filtration} onChange={(e) => this.onChange(e)}>
                                        <IntlMessages id="sidebar.pleaseSelect">{selStatus => <option value="">{selStatus}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.today">{todays => <option value="1">{todays}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.weekly">{weekly => <option value="2">{weekly}</option>}</IntlMessages>
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <div className="btn_area m-0">
                                        <Button color="primary" onClick={this.getFilterData}><IntlMessages id="sidebar.btnApply" /></Button>
                                        {this.state.showReset && <Button color="danger" className="ml-10" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                    </JbsCollapsibleCard>
                }
                <div className="StackingHistory mt-20 statusbtn-comm">
                    <MUIDataTable
                        // title={<IntlMessages id="sidebar.listCustomers" />}
                        columns={columns}
                        options={options}
                        data={signUpData.map((list, index) => {
                            return [
                                index + 1 + (PageIndex - 1) * Page_Size,
                                list.UserName,
                                list.Email,
                                list.Mobile,
                                list.Firstname,
                                list.Lastname,
                                list.RegType,
                                <span className="date">{changeDateFormat(list.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                <ActiveInactiveStatus status={list.Status} />,
                            ];
                        })}
                    />
                </div>
            </div>
        );
    }
}

//map state to props
const mapStateToProps = ({ custDashRdcer, drawerclose, authTokenRdcer }) => {

    //Added by salim (BreadCrumb) dt:09/03/2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    var response = {
        userList: custDashRdcer.custDashData,
        loading: custDashRdcer.loading,
        drawerclose: drawerclose,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights
    };
    // const {
    //     menuLoading,
    //     menu_rights
    // } = authTokenRdcer;
    return response;

};

export default connect(mapStateToProps, {
    getCustomerRptData,
    getMenuPermissionByID
})(ListCustomerDashboard);