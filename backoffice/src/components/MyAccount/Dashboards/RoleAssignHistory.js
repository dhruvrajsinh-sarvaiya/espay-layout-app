/*
    Developer : Bharat Jograna
    Date : 18-02-2019
    Update by  : Bharat Jograna (BreadCrumb)13 March 2019
    File Comment : Role Assign History Component
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import { CustomFooter } from './Widgets';
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { Form, FormGroup, Label, Input, Button, Badge } from "reactstrap";
import Select from "react-select";
import { NotificationManager } from "react-notifications";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { roleAssignHistory, getUserDataList } from 'Actions/MyAccount';
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
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
        title: <IntlMessages id="sidebar.userManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.roleManagement" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="my_account.roleAssignHistory" />,
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
        name: <IntlMessages id="sidebar.colUserName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.modules" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colmodificationdetails" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colchangeson" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="widgets.status" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colIPAddress" />,
        options: { filter: true, sort: true }
    }
];

//Component for MyAccount Role Assign History Dashboard
class RoleAssignHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList,
                UserId: "",
                UserLabel: null,
                ModuleId: '',
                Status: '',
            },
            showReset: false,
            loading: false,
            totalCount: 0,
            roleAssignList: [],
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        }
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('16E7252D-823A-3C9C-1934-E5F9064851F2'); // get myaccount menu permission

    }

    //onchange module and status
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
        newObj.UserLabel = event.label;
        this.setState({ data: newObj });
    }

    //to apply the filter
    applyFilter = () => {
        this.setState({ showReset: true });
        if (this.state.data.FromDate === "" || this.state.data.ToDate === "") {
            NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
        } else {
            var newObj = Object.assign({}, this.state.data);
            newObj.PageNo = 1;
            newObj.PageSize = AppConfig.totalRecordDisplayInList;
            this.getListRoleAssignHistory(newObj.PageNo, newObj.PageSize);
        }
    }

    //to clear all the filter inputs
    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.Status = "";
        newObj.UserId = "";
        newObj.UserLabel = null;
        newObj.ModuleId = "";
        newObj.PageNo = 1;
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        this.setState({ showReset: false, data: newObj });
        this.props.roleAssignHistory(newObj);
    }

    closeAll = () => {
        this.props.closeAll();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getListRoleAssignHistory(this.state.data.PageNo, this.state.data.PageSize);
                this.props.getUserDataList();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }

        this.setState({ loading: nextProps.loading });
        if (nextProps.hasOwnProperty('roleAssignData')) {
            if (nextProps.roleAssignData.ReturnCode === 1 || nextProps.roleAssignData.ReturnCode === 9) {
                this.setState({ roleAssignList: [], totalCount: nextProps.roleAssignData.TotalCount })
            } else if (nextProps.roleAssignData.ReturnCode === 0 && nextProps.roleAssignData.hasOwnProperty('Data')) {
                this.setState({ roleAssignList: nextProps.roleAssignData.Data, totalCount: nextProps.roleAssignData.TotalCount });
            }
        }
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getListRoleAssignHistory(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getListRoleAssignHistory(1, event.target.value);
    };

    //Get Login History Data form API...
    getListRoleAssignHistory = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo '] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        }
        this.setState({ data: newObj });
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.roleAssignHistory(reqObj);
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
        const { roleAssignList, totalCount } = this.state;
        const { drawerClose, loading } = this.props;
        const { PageNo, PageSize, FromDate, ToDate, UserLabel, Status, ModuleId } = this.state.data;
        const userlist = this.props.getUser.hasOwnProperty('GetUserData') ? this.props.getUser.GetUserData : [];

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('c65c0b7a-404e-9eac-4cbd-a675695075ae'); //6E8BDE77-560D-8817-4B3E-4245CAE861C6
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
            serverSide: roleAssignList.length !== 0 ? true : false,
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
                filename: 'Role_Assign_History_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
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
                <WalletPageTitle title={<IntlMessages id="my_account.roleAssignHistory" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
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
                                <Label for="UserId"><IntlMessages id="my_account.userName" /></Label>
                                <Select
                                    options={userlist.map((user) => ({
                                        label: user.UserName,
                                        value: user.Id,
                                    }))}
                                    value={this.state.data.UserLabel === null ? null : ({ label: UserLabel })}
                                    onChange={this.onChangeSelectUser}
                                    isClearable={true}
                                    maxMenuHeight={200}
                                    placeholder={<IntlMessages id="sidebar.searchdot" />}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="ModuleId"><IntlMessages id="sidebar.modules" /></Label>
                                <Input type="select" name="ModuleId" value={ModuleId} id="ModuleId" onChange={this.onChange}>
                                    <IntlMessages id="sidebar.selModule">{(selModuleName) => <option value="">{selModuleName}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.role">{(role) => <option value="1">{role}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.groups">{(groups) => <option value="2">{groups}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.modules">{(modules) => <option value="3">{modules}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.users">{(users) => <option value="4">{users}</option>}</IntlMessages>
                                </Input>
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="Status"><IntlMessages id="widgets.status" /></Label>
                                <Input type="select" name="Status" id="Status" value={Status} onChange={this.onChange}>
                                    <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.active">{(active) => <option value="1">{active}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.inactive">{(inactive) => <option value="0">{inactive}</option>}</IntlMessages>
                                </Input>
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
                        // title={<IntlMessages id="my_account.roleAssignHistory" />}
                        columns={columns}
                        options={options}
                        data={
                            roleAssignList.map((lst, key) => {
                                return [
                                    key + 1 + (PageSize - 1) * PageNo,
                                    lst.UserName,
                                    lst.Module,
                                    lst.ModificationDetail,
                                    changeDateFormat(lst.UpdatedDate, 'DD-MM-YYYY hh:mm:ss'),
                                    lst.Status ? <Badge color="success"><IntlMessages id="sidebar.active" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>,
                                    lst.IPAddress
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
const mapStateToProps = ({ roleManagementRdcer, actvHstrRdcer, drawerclose, authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { roleAssignData, loading } = roleManagementRdcer;
    const { getUser } = actvHstrRdcer;
    return {
        roleAssignData, loading, getUser, drawerclose, menuLoading,
        menu_rights
    };
}

export default connect(mapStateToProps, {
    roleAssignHistory,
    getUserDataList,
    getMenuPermissionByID,
})(RoleAssignHistory);