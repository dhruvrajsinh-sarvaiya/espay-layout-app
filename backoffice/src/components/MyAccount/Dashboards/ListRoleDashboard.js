/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    File Comment : My Account List Rule Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import { Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from './Widgets';
import { changeDateFormat } from "Helpers/helpers";
import {
    getRoleManagementList,
    getRoleManagementById,
    changeStatusRoleManagement,
    listUserRoleAssignByRoleId
} from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
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
        name: <IntlMessages id="sidebar.colRoleName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colRoleDesc" />,
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
        title: <IntlMessages id="sidebar.listRoles" />,
        link: '',
        index: 3
    }
];


const RoleStatus = ({ status }) => {
    var htmlStr = '';
    if (status === 0) {
        htmlStr = <Badge color="warning">Inactive</Badge>;
    } else if (status === 1) {
        htmlStr = <Badge color="success">Active</Badge>;
    } else if (status === 9) {
        htmlStr = <Badge color="danger">Delete</Badge>;
    }
    return htmlStr;
}

class ListRoleDashboard extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            isModelShow: false,
            modelData: {
                title: '',
                description: '',
                btnText: ''
            },
            roleID: '',
            status: '',
            pagedata: {},
            open: false,
            componentName: '',
            roleList: [],
            totalCount: 0,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    onClick = () => {
        this.setState({ open: !this.state.open })
    }

    showComponent = (componentName, roleID = '', menuDetail) => {
        if (menuDetail.HasChild) {
        if (componentName === 'ViewRoleDetails') {
            this.props.listUserRoleAssignByRoleId({ ID: roleID });
        }
        if (roleID > 0) {
            this.props.getRoleManagementById({ ID: roleID });
        }
        var pData = { isEdit: true, roleID: roleID }

        this.setState({
            componentName: componentName,
            open: !this.state.open,
            pagedata: pData,
            menuDetail: menuDetail
        });
    } else {
        NotificationManager.error(<IntlMessages id={"error.permission"} />);
    }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    //Get Role Permission Group List form API...
    getRoleList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        }
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getRoleManagementList(reqObj);
    }

    //Change Status Method...
    changeStatus() {
        var reqObj = {
            RoleId: this.state.roleID,
            Status: this.state.status
        }
        this.closeModel();
        this.props.changeStatusRoleManagement(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('16E7252D-823A-3C9C-1934-E5F9064851F2'); // get myaccount menu permission
    }

    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getRoleList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getRoleList(1, event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')&& this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getRoleList(this.state.data.PageNo, this.state.data.PageSize);
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

        //Get Role List...
        if (nextProps.list.hasOwnProperty('Details') && nextProps.list.Details.length > 0) {
            this.setState({ roleList: nextProps.list.Details, totalCount: nextProps.list.TotalCount });
        }

        //Get Change Status response...
        if (nextProps.chngStsData.ReturnCode === 1) {
            var errMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.getRoleList(1, this.state.data.PageSize);
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    //Open Model Dialog....
    openModel(roleId, status, roleName = '') {
        var newMdlObj = Object.assign({}, this.state.modelData);

        if (status === 0) {
            newMdlObj['title'] = <IntlMessages id="sidebar.disableRole" />;
            newMdlObj['description'] = <IntlMessages id="sidebar.roleDisableNote" />;
            newMdlObj['btnText'] = <IntlMessages id="sidebar.btnDisableNow" />;
        }
        else if (status === 1) {
            newMdlObj['title'] = <IntlMessages id="sidebar.enableRole" />;
            newMdlObj['description'] = <IntlMessages id="sidebar.roleEnableNote" />;
            newMdlObj['btnText'] = <IntlMessages id="sidebar.btnEnableNow" />;
        }
        else if (status === 9) {
            newMdlObj['title'] = <IntlMessages id="sidebar.deleteRole" />;
            newMdlObj['description'] = <IntlMessages id="sidebar.roleDeleteNote" values={{ roleName: roleName }} />;
            newMdlObj['btnText'] = <IntlMessages id="sidebar.btnDelete" />;
        }
        this.setState({ modelData: newMdlObj, isModelShow: true, roleID: roleId, status: status });
    }

    //Close Model Dialog....
    closeModel() {
        this.setState({ isModelShow: false });
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
        const { componentName, open, roleList, totalCount, pagedata, isModelShow } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { title, description, btnText } = this.state.modelData;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('c65c0b7a-404e-9eac-4cbd-a675695075ae'); //C65C0B7A-404E-9EAC-4CBD-A675695075AE
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
            serverSide: roleList.length !== 0 ? true : false,
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
                filename: 'ROLE_LIST_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getRoleList(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listRoles" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            // title={<IntlMessages id="sidebar.listRoles" />} 
                            columns={columns}
                            options={options}
                            data={roleList.map((item, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize),
                                    item.RoleName,
                                    item.RoleDescription,
                                    <RoleStatus status={item.Status} />,
                                    <div className="list-action">
                                        {/* {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check edit curd operation
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditRole',item.RoleID)} className="mr-10"><i className="zmdi zmdi-edit zmdi-hc-2x" /></a>}
                                        { (menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && item.Status !== 1) && <a href="javascript:void(0)" onClick={() => this.openModel(item.RoleID,1)} className="mr-10"><i className="zmdi zmdi-check zmdi-hc-2x" /></a> }
                                        { (menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && item.Status === 1) && <a href="javascript:void(0)" onClick={() => this.openModel(item.RoleID,0)} className="mr-10"><i className="zmdi zmdi-close zmdi-hc-2x" /></a> }
                                        { (menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && item.Status !== 9) && <a href="javascript:void(0)" onClick={() => this.openModel(item.RoleID,9,item.roleName)} className="mr-10"><i className="zmdi zmdi-delete zmdi-hc-2x" /></a> }
                                        {menuPermissionDetail.CrudOption.indexOf('6AF64827') !== -1 && // check view curd operation
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ViewRoleDetails',item.RoleID)} className="ml-3"><i className="ti-eye" /></a>}
                                        { (menuPermissionDetail.CrudOption.indexOf('5645F321') !== -1 && item.Status === 1) && <a href="javascript:void(0)" onClick={(e) => this.showComponent('AssignRole',item.RoleID)} className="text-dark"><i className="ti-clipboard" /></a> } */}
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation */}
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditRole', item.RoleID, this.checkAndGetMenuAccessDetail('c65c0b7a-404e-9eac-4cbd-a675695075ae'))} className="mr-10"><i className="ti-pencil" /></a>
                                        }
                                        {(item.Status !== 1) && <a href="javascript:void(0)" onClick={() => this.openModel(item.RoleID, 1)} className="mr-10"><i className="ti-check" /></a>}
                                        {(item.Status === 1) && <a href="javascript:void(0)" onClick={() => this.openModel(item.RoleID, 0)} className="mr-10"><i className="ti-na" /></a>}
                                        {(item.Status !== 9) && <a href="javascript:void(0)" onClick={() => this.openModel(item.RoleID, 9, item.roleName)} className="mr-10"><i className="ti-close" /></a>}
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ViewRoleDetails', item.RoleID, this.checkAndGetMenuAccessDetail('c65c0b7a-404e-9eac-4cbd-a675695075ae'))} className="mr-10"><i className="ti-eye" /></a>
                                        {(item.Status === 1) && <a href="javascript:void(0)" onClick={(e) => this.showComponent('AssignRole', item.RoleID, this.checkAndGetMenuAccessDetail('c65c0b7a-404e-9eac-4cbd-a675695075ae'))} className="mr-10"><i className="ti-clipboard" /></a>}
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Modal isOpen={isModelShow} className="watch_model modal-dialog-centered" toggle={() => this.closeModel()}>
                        <ModalHeader>{title}</ModalHeader>
                        <ModalBody>
                            <p>{description}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="raised" className="perverbtn" onClick={() => this.changeStatus()}>{btnText}</Button>
                            <Button variant="raised" color="danger" onClick={() => this.closeModel()}><IntlMessages id="sidebar.btnCancel" /></Button>
                        </ModalFooter>
                    </Modal>
                    <Drawer
                        width={componentName === 'AddEditRole' || componentName === 'AssignRole' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditRole' || componentName === 'AssignRole' ? "drawer1 half_drawer" : "drawer1"}
                        level=".drawer0"
                        levelMove={100}
                        height="100%"
                    >
                        {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={pagedata} props={this.props} menuDetail={this.checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />}
                    </Drawer>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ roleManagementRdcer, drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list, chngStsData, listLoading } = roleManagementRdcer;
    return { list, chngStsData, listLoading, drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapToProps, {
    getRoleManagementList,
    getRoleManagementById,
    changeStatusRoleManagement,
    listUserRoleAssignByRoleId,
    getMenuPermissionByID,
})(ListRoleDashboard);