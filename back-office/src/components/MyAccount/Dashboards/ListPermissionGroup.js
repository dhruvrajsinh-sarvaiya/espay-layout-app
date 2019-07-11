/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    Update By : Bharat Jograna, 05 March 2019 
    File Comment : My Account List Rule Module Component
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
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { CustomFooter } from './Widgets';
import { changeDateFormat } from "Helpers/helpers";
import {
    getRolePermissionGroupList,
    getRolePermissionGroupById,
    changeStatusRolePermissionGroup,
    getConfigurationRolePermissionGroupById,
    getRoleManagementList
} from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//Added By Bharat Jograna
//Table Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colGroupName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colGroupDiscription" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDomainName" />,
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
        title: <IntlMessages id="my_account.permissionGroups" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listRolePermissionGroup" />,
        link: '',
        index: 3
    }
];

const PermissionGroupStatus = ({ status }) => {
    var htmlStr = '';
    if (status === 0) {
        htmlStr = <Badge color="warning"><IntlMessages id="sidebar.inActive" /></Badge>;
    } else if (status === 1) {
        htmlStr = <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>;
    } else if (status === 9) {
        htmlStr = <Badge color="danger"><IntlMessages id="sidebar.delete" /></Badge>;
    }
    return htmlStr;
}

class ListPermissionGroup extends Component {
    constructor(props) {
        super(props);
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
            updateData : {},
            PermissionGroupID: '',
            status: '',
            pagedata: {},
            open: false,
            componentName: '',
            permissionGrpList: [],
            totalCount: 0,
            menuDetail: {},
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    showComponent = (componentName, menuDetail, permissionGroupID = '') => {
         if (menuDetail.HasChild) {
            var pageData = {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList,
                AllRecords: 1
            };
            this.props.getRoleManagementList(pageData);
        var pData = { isEdit: true, prmData : permissionGroupID }
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
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
    listRolePermissionGroup = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getRolePermissionGroupList(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('0A8FB25C-73FB-92CA-9C9B-619FF7364F15');

    }

    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.listRolePermissionGroup(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.listRolePermissionGroup(1, event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.listRolePermissionGroup(this.state.data.PageNo, this.state.data.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        //Get Permission Group List...
        if (nextProps.list.hasOwnProperty('GroupListData') && nextProps.list.GroupListData.length > 0) {
            this.setState({ permissionGrpList: nextProps.list.GroupListData, totalCount: nextProps.list.GroupListData.length });
        }

        //Added By Bharat Jograna
        //Get Updated List 
        if (nextProps.chngStsData.ReturnCode === 1 || nextProps.chngStsData.ReturnCode === 9) {
            var errMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.listRolePermissionGroup(1, this.state.data.PageSize);
            var sucMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }

        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }
    }

    //Open Model Dialog....
    openModel(permissionObj, newStatus) {
        var newMdlObj = Object.assign({}, this.state.modelData);
        var newUpdObj = permissionObj;
        newUpdObj['Status'] = newStatus;

        if (newStatus === 0) {
            newMdlObj['title'] = <IntlMessages id="sidebar.disablePermissionGroup" />;
            newMdlObj['description'] = <IntlMessages id="sidebar.permissionGroupDisableNote" />;
            newMdlObj['btnText'] = <IntlMessages id="sidebar.btnDisableNow" />;
        }
        else if (newStatus === 1) {
            newMdlObj['title'] = <IntlMessages id="sidebar.enablePermissionGroup" />;
            newMdlObj['description'] = <IntlMessages id="sidebar.permissionGroupEnableNote" />;
            newMdlObj['btnText'] = <IntlMessages id="sidebar.btnEnableNow" />;
        }
        else if (newStatus === 9) {
            newMdlObj['title'] = <IntlMessages id="sidebar.deletePermissionGroup" />;
            newMdlObj['description'] = <IntlMessages id="sidebar.permissionGroupDeleteNote" values={{ permissionGroupName: permissionObj.GroupName }} />;
            newMdlObj['btnText'] = <IntlMessages id="sidebar.btnDelete" />;
        }
        this.setState({ modelData: newMdlObj, isModelShow: true, updateData : newUpdObj });
    }

    //Close Model Dialog....
    closeModel() {
        this.setState({ isModelShow: false, updateData : {} });
    }

    //Added By Bharat Jograna
    //Change Status Method...
    //Updated By Salim Deraiya dt:13/03/2019
    changeStatus() {
        this.closeModel();
        this.props.changeStatusRolePermissionGroup(this.state.updateData);
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
        const { componentName, open, permissionGrpList, totalCount, pagedata, isModelShow } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { title, description, btnText } = this.state.modelData;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('627E46A0-6181-4C1A-6B15-A1EF259930E8'); //627E46A0-6181-4C1A-6B15-A1EF259930E8
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
            serverSide: permissionGrpList.length !== 0 ? true : false,
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
                filename: 'PERMISSION_GROUP_LIST_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var tblPage = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={tblPage} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.listRolePermissionGroup(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
               {(this.state.menuLoading ||this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listRolePermissionGroup" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            columns={columns}
                            options={options}
                            //Added By Bharat Jograna
                            data={permissionGrpList.map((item) => {
                                return [
                                    item.GroupName,
                                    item.Description,
                                    <IntlMessages id={"sidebar.domainName"+item.DomainID} />,
                                    <PermissionGroupStatus status={item.Status} />,
                                    <Fragment>
                                
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check edit curd operation
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditPermissionGroup', this.checkAndGetMenuAccessDetail('627E46A0-6181-4C1A-6B15-A1EF259930E8'), item)} className="text-dark mr-10"><i className="ti-pencil" /></a>}
                                        {(item.Status !== 1) && <a href="javascript:void(0)" onClick={() => this.openModel(item, 1)} className="text-dark mr-5"><i className="ti-check" /></a>}
                                        {(item.Status === 1) && <a href="javascript:void(0)" onClick={() => this.openModel(item, 0)} className="text-dark mr-10"><i className="ti-na" /></a>}
                                        {(item.Status !== 9) && <a href="javascript:void(0)" onClick={() => this.openModel(item, 9)} className="text-dark mr-10"><i className="ti-close" /></a>}
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('SetPermission', this.checkAndGetMenuAccessDetail('627E46A0-6181-4C1A-6B15-A1EF259930E8'), item )} className="text-dark mr-10"><i className="ti-settings" /></a>                                  
                                    </Fragment>
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
                        width="100%"
                        handler={false}
                        open={open}
                        placement="right"
                        className="drawer1"
                        level=".drawer0"
                        levelMove={100}
                        height="100%"
                    >
                        {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={pagedata} props={this.props} />}
                    </Drawer>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ rolePermissionGroupRdcer, drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list, chngStsData, listLoading } = rolePermissionGroupRdcer;
    return { list, chngStsData, listLoading, drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapToProps, {
    getRolePermissionGroupList,
    getRolePermissionGroupById,
    changeStatusRolePermissionGroup,
    getConfigurationRolePermissionGroupById,
    getRoleManagementList,
    getMenuPermissionByID,
})(ListPermissionGroup);