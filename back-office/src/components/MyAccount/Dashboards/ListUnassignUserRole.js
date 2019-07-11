/* 
    Developer : Bharat Jogrna
    Date : 15 March 2019
    Update by  : 
    File Comment : My Account List Unassign User Role Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { Form, FormGroup, Label, Input, Button, Badge } from "reactstrap";
import { CustomFooter } from './Widgets';
import { changeDateFormat } from "Helpers/helpers";
import { listUnassignUserRole, getUserById } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import validateUnassignUserRole from "Validations/MyAccount/unassign_user_role";
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Table Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colUserName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colEmail" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDateTime" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colActions" />,
        options: { filter: false, sort: true }
    }
];

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
        title: <IntlMessages id="sidebar.listUnassignUserRole" />,
        link: '',
        index: 3
    }
];

class ListUnassignUserRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList,
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                UserName: "",
                Status: '',
            },
            open: false,
            componentName: '',
            UnassignUserList: [],
            totalCount: 0,
            errors: {},
            PageData: {},
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('36B05A7B-39B0-7998-410D-F14BAC3983D6'); // get myaccount menu permission

    }

    onClick = () => {
        this.setState({ open: false })
    }

    //to show component onclick of Assign...
    showComponent = (componentName, UserId, menuDetail) => {
        if (menuDetail.HasChild) {
            this.props.getUserById({ UserId });

            this.setState((prevstate) => {
                return {
                    componentName: componentName,
                    open: this.state.open ? false : true,
                    PageData: prevstate.data,
                    menuDetail: menuDetail
                }
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    //Get Rule Sub Module List form API...
    getUnassignUserRole = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.listUnassignUserRole(reqObj);
    }

    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getUnassignUserRole(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getUnassignUserRole(1, event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getUnassignUserRole(this.state.data.PageNo, this.state.data.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }

        //Get Unassign User Role List...
        if (nextProps.unassignData.ReturnCode === 1) {
            this.setState({ UnassignUserList: [], totalCount: '' })
        } else if (nextProps.unassignData.hasOwnProperty('Result') && nextProps.unassignData.Result.length > 0) {
            this.setState({ UnassignUserList: nextProps.unassignData.Result, totalCount: nextProps.unassignData.TotalCount });
        }
    }

    //onchange Filter...
    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    //onchange select user
    onChangeSelectUser = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj.UserName = ((event.label) === undefined ? "" : event.label);
        this.setState({ data: newObj });
    }

    //to apply the filter
    applyFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.PageNo = 1;
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        const { isValid, errors } = validateUnassignUserRole(newObj);
        const { FromDate, ToDate } = this.state.data;
        this.setState({ errors: errors, showReset: true })
        if (isValid) {
            if (FromDate === "" || ToDate === "") {
                NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
            } else {
                this.getUnassignUserRole(newObj.PageNo, newObj.PageSize);
            }
        }
    }

    //to clear all the filter inputs
    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.Status = "";
        newObj.UserName = "";
        newObj.PageNo = 0;
        newObj.PageSize = AppConfig.totalRecordDisplayInList;
        this.setState({ showReset: false, data: newObj, errors: '' });
        this.props.listUnassignUserRole(newObj);
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
        const { componentName, open, UnassignUserList, totalCount, errors, PageData } = this.state;
        const { PageNo, PageSize, FromDate, ToDate, UserName, Status } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('7dae790e-a3a1-1eb7-5c74-4765dbe47e2a'); //7DAE790E-A3A1-1EB7-5C74-4765DBE47E2A
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
            serverSide: UnassignUserList.length !== 0 ? true : false,
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
                filename: 'LIST_UNASSIGN_USER_ROLE_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var pages = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={pages} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getUnassignUserRole(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listUnassignUserRole" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
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
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="UserName"><IntlMessages id="my_account.userName" /></Label>
                                        <IntlMessages id="sidebar.colUserName" >
                                            {(placeholder) => <Input type="text" name="UserName" id="UserName" placeholder={placeholder} value={UserName} onChange={this.onChange} />}
                                        </IntlMessages>
                                        {errors.UserName && <div className="text-danger text-left"><IntlMessages id={errors.UserName} /></div>}
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Status"><IntlMessages id="widgets.status" /></Label>
                                        <Input type="select" name="Status" id="Status" value={Status} onChange={this.onChange}>
                                            <IntlMessages id="sidebar.selStatus">{(selStatus) => <option value="">{selStatus}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.active">{(active) => <option value="1">{active}</option>}</IntlMessages>
                                            <IntlMessages id="sidebar.inactive">{(inactive) => <option value="0">{inactive}</option>}</IntlMessages>
                                        </Input>
                                        {errors.Status && <div className="text-danger text-left"><IntlMessages id={errors.Status} /></div>}
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
                            options={options}
                            data={UnassignUserList.map((item, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize),
                                    item.UserName,
                                    item.Email,
                                    changeDateFormat(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss'),
                                    item.Status ? <Badge color="success"><IntlMessages id="sidebar.active" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation */}
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AssignRoleToUnassign', item.Id, this.checkAndGetMenuAccessDetail('7dae790e-a3a1-1eb7-5c74-4765dbe47e2a'))} className="ml-3"><i className="ti-clipboard ml-2" /></a>
                                        }
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width="50%"
                        handler={false}
                        open={open}
                        placement="right"
                        className="drawer1 half_drawer"
                        level=".drawer0"
                        levelMove={100}
                        height="100%"
                    >
                        {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={PageData} props={this.props} />}
                    </Drawer>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ roleManagementRdcer, drawerclose, authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { unassignData, listLoading } = roleManagementRdcer
    return {
        unassignData, listLoading, drawerclose, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    listUnassignUserRole,
    getUserById,
    getMenuPermissionByID,
})(ListUnassignUserRole);