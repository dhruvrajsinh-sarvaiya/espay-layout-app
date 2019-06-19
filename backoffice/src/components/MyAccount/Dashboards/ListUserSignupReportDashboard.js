/*
 * CreatedBy : Kevin Ladani
 * Date :27/09/2018
 * Updated By : Bharat Jograna (BreadCrumb)09 March 2019
 * File Comment : Display Users Signup Reports
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { Form, FormGroup, Label, Input, Button, Badge } from 'reactstrap';
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import IntlMessages from "Util/IntlMessages";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { CustomFooter } from './Widgets';
import { getUserSignupRptData } from "Actions/MyAccount";
import validateSignupReport from 'Validations/MyAccount/user_signup_report';
import AppConfig from 'Constants/AppConfig';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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
    } else if (status) {
        htmlStatus = <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>;
    }
    return htmlStatus;
};

class ListUserSignupReportDashboard extends Component {
    constructor(props) {
        super(props);
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        this.state = {
            data: {
                PageIndex: 1,
                Page_Size: AppConfig.totalRecordDisplayInList,
                EmailAddress: '',
                Username: '',
                Mobile: '',
                Filtration: 'All',
                FromDate: today,
                ToDate: today
            },
            totalCount: 0,
            showReset: false,
            showStatus: true,
            value: "",
            signUpData: [],
            loading: false,
            errors: {},
            open: false,
            menudetail: [],
            notificationFlag: true,
            menuLoading: false,
            pagedata: "",
            ApiCallBit: false

        };
        this.initState = this.state.data;
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    //Get User Signup List form API...
    getUserSignupList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageIndex'] = PageNo > 0 ? PageNo : this.state.data.PageIndex;
        if (PageSize > 0) {
            newObj['Page_Size'] = PageSize > 0 ? PageSize : this.state.data.Page_Size;
        }
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.Filtration = this.state.data.Filtration === 'All' ? '' : newObj.Filtration;
        this.props.getUserSignupRptData(reqObj);
    }

    //Clear Data..
    clearFilter = () => {
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        var newObj = Object.assign({}, this.state.data);
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        newObj.EmailAddress = "";
        newObj.Username = "";
        newObj.Mobile = "";
        newObj.Filtration = "";
        newObj.FromDate = today;
        newObj.ToDate = today;
        this.setState({ showReset: false, data: newObj, errors: '' });
        setTimeout(() => {
            this.getUserSignupList(1, newObj.Page_Size);
        }, 100);
    }

    componentWillMount() {
        this.setState({ ApiCallBit: true })
        this.props.getMenuPermissionByID(this.props.menuDetail.GUID); // my account menu permission

    }

    //Filter Data...
    getFilterData = () => {
        const { errors, isValid } = validateSignupReport(this.state.data);
        const { FromDate, ToDate } = this.state.data;
        this.setState({ errors: errors, showReset: true });
        if (isValid) {
            if (FromDate === "" || ToDate === "") {
                NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
            } else {
                this.getUserSignupList(1, this.state.data.Page_Size);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        setTimeout(() => {
            if (!this.state.ApiCallBit) {
                this.props.getMenuPermissionByID(this.props.menuDetail.GUID);
                this.setState({ ApiCallBit: true })
            }
        }, 1000)
        // if (this.state.ApiCallBit !== this.props.menuDetail.GUID) {
        //     this.setState({ ApiCallBit: this.props.menuDetail.GUID })
        //     this.props.getMenuPermissionByID(this.props.menuDetail.GUID);
        //   }

        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getUserSignupList(this.state.data.PageIndex, this.state.data.Page_Size);
            }
            else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }


        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }

        if (this.state.data.Filtration !== nextProps.pagedata.Filtration) {
            this.setState({
                showStatus: nextProps.pagedata.Filtration !== '' ? false : true,
            });
        }

        if (nextProps.userList.hasOwnProperty('SignReportViewmodes') && nextProps.userList.SignReportViewmodes.SignReportList.length > 0) {
            this.setState({ signUpData: nextProps.userList.SignReportViewmodes.SignReportList, totalCount: nextProps.userList.SignReportViewmodes.Total });
        } else if (nextProps.userList.hasOwnProperty('SignReportViewmodes') && nextProps.userList.SignReportViewmodes.SignReportList.length === 0) {
            this.setState({ signUpData: [], totalCount: nextProps.userList.SignReportViewmodes.Total });
        }
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getUserSignupList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getUserSignupList(1, event.target.value);
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

    Close = () => {
        this.props.drawerClose();
        this.setState({ open: false, componentName: "", ApiCallBit: false, menudetail: [], notificationFlag: true });
    }
    render() {
        const { signUpData, errors, totalCount } = this.state;
        const { drawerClose, loading } = this.props;
        const { Username, EmailAddress, Mobile, Filtration, FromDate, ToDate, PageIndex, Page_Size } = this.state.data;
        const { menudetail } = this.state;
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail((menudetail.length) ? menudetail[0].GUID : null); //7E4FF4CD-29E4-6826-7DFE-3A820EB95941
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        var headetrMsg = <IntlMessages id="sidebar.usersSignupTotalRptList" />;
        if (this.props.pagedata.Filtration === 'Today') {
            headetrMsg = <IntlMessages id="sidebar.usersSignupTodayRptList" />;
        } else if (this.props.pagedata.Filtration === 'Weekly') {
            headetrMsg = <IntlMessages id="sidebar.usersSignupWeeklyRptList" />;
        } else if (this.props.pagedata.Filtration === 'Monthly') {
            headetrMsg = <IntlMessages id="sidebar.usersSignupMonthlyRptList" />;
        }

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
                title: <IntlMessages id="sidebar.usersSignupRptList" />,
                link: '',
                index: 2
            },
            {
                title: headetrMsg,
                link: '',
                index: 3
            }
        ];

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
                    this.getUserSignupList(tableState.page, tableState.rowsPerPage);
                }
            }
        };

        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={headetrMsg} breadCrumbData={BreadCrumbData} drawerClose={this.Close} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation ? */}
                    <JbsCollapsibleCard>
                        <div className="top-filter">
                            <Form className="tradefrm row">
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                    <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" max={today} value={FromDate} onChange={this.onChange} />
                                </FormGroup>
                                <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                    <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" min={FromDate} max={today} value={ToDate} onChange={this.onChange} />
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
                                {this.props.pagedata.Filtration === '' && <FormGroup className="col-md-2 col-sm-4">
                                    <Label for="Filtration"><IntlMessages id="my_account.status" /></Label>
                                    <Input type="select" name="Filtration" id="Filtration" value={Filtration} onChange={(e) => this.onChange(e)}>
                                        <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.today">{(selectOption) => <option value="Today">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.weekly">{(selectOption) => <option value="Weekly">{selectOption}</option>}</IntlMessages>
                                        <IntlMessages id="sidebar.monthly">{(selectOption) => <option value="Monthly">{selectOption}</option>}</IntlMessages>
                                    </Input>
                                </FormGroup>}
                                <FormGroup className="col-md-2 col-sm-4">
                                    <div className={this.props.pagedata.Filtration === '' ? 'btn_area m-0' : 'btn_area'}>
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
                        // title={headetrMsg}
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
                                <ActiveInactiveStatus status={list.RegisterStatus} />,
                            ];
                        })}
                    />
                </div>
            </div>
        );
    }
}

ListUserSignupReportDashboard.defaultProps = {
    pagedata: {
        Filtration: ''
    }
}

//map state to props
const mapStateToProps = ({ usersSignupReport, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    var response = {
        userList: usersSignupReport.UserRptData,
        loading: usersSignupReport.loading,
        drawerclose: drawerclose,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights
    };
    return response;
};

export default connect(mapStateToProps, {
    getUserSignupRptData,
    getMenuPermissionByID
})(ListUserSignupReportDashboard);