/* 
    Developer : Bharat Jograna
    Date : 01 MARCH 2019
    Update by : 
    File Comment : My Account List User Role Assign Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import { Badge } from "reactstrap";
import MUIDataTable from "mui-datatables";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from './Widgets';
import { changeDateFormat } from "Helpers/helpers";
import { listUserRoleAssignByRoleId, getUserById } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
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
        name: <IntlMessages id="sidebar.colRoleName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colRoleStatus" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: true }
    },
];

//List User Role Assign Component
class ListUserRoleAssign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RoleID: this.props.pagedata.roleID,
            open: false,
            componentName: '',
            pageData: {
                PageNo: 0,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            listUserRoleAssign: [],
            totalCount: 0,
            menuDetail: {},
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
    }

    onClick = () => {
        this.setState({ open: false })
    }

    //To close all the drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false })
    }

    //Get Rule Module List form API...
    getUserRoles = () => {
        this.props.listUserRoleAssignByRoleId({ ID: this.state.RoleID });
    }

    //Pagination Change Method...
    handlePageChange = () => {
        this.getUserRoles();
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = () => {
        this.getUserRoles();
    };
    componentWillMount() {
        this.props.getMenuPermissionByID('C65C0B7A-404E-9EAC-4CBD-A675695075AE'); // get myaccount menu permission
        //  this.props.getMenuPermissionByID('64BA3351-22DF-3931-496B-76096D9E4593'); // get myaccount menu permission

    }
    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.getUserRoles();
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            }
            //Get List User Role Assign...
            if (nextProps.hasOwnProperty('userRoleList')) {
                // this.setState({ listUserRoleAssign: [] })
                if (nextProps.userRoleList.ReturnCode === 1 || nextProps.userRoleList.ReturnCode === 9) {
                    var errMsg = nextProps.userRoleList.ErrorCode === 1 ? nextProps.userRoleList.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.userRoleList.ErrorCode}`} />;
                    NotificationManager.error(errMsg);
                } else if (nextProps.userRoleList.hasOwnProperty('Data') && nextProps.userRoleList.Data.length > 0) {
                    this.setState({ listUserRoleAssign: nextProps.userRoleList.Data, totalCount: nextProps.userRoleList.TotalRecords });
                }
            }
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
    showComponent = (componentName, UserId, menuDetail) => {
        if (menuDetail.HasChild) {
            this.props.getUserById({ UserId })
            var pData = { isEdit: true, UserId: UserId }
            this.setState({
                componentName: componentName,
                open: !this.state.open,
                pageData: pData,
                menuDetail: menuDetail
            });
        }else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    render() {
        const { listUserRoleAssign, componentName, open, pageData } = this.state;
        const { PageNo, PageSize } = this.state.pageData;
        const { drawerClose } = this.props;
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('0B2076D0-A57A-9200-2078-F959AE608B7F'); //C65C0B7A-404E-9EAC-4CBD-A675695075AE
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }
        const options = {
            filterType: "select",
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            viewColumns: false,
            filter: false,
            download: false,
            page: PageNo,
            rowsPerPage: PageSize,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'List_User_Role_Assign' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getUserRoles();
                }
            },
        };

        return (
            <Fragment>
                {this.props.listLoading && <JbsSectionLoader />}
                <div className={this.props.isShowPageTitle ? "jbs-page-content" : "jbs-page-content p-0"}>
                    {this.props.isShowPageTitle &&
                        <WalletPageTitle title={this.props.dynPageTitle} drawerClose={drawerClose} closeAll={this.closeAll} />
                    }
                    <div className="StackingHistory">
                        <MUIDataTable
                            // title={this.props.dynPageTitle} 
                            columns={columns}
                            options={options}
                            data={listUserRoleAssign.map((item, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize),
                                    item.UserName,
                                    item.Email,
                                    item.RoleName,
                                    changeDateFormat(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss'),
                                    item.Status ? <Badge color="success"><IntlMessages id="sidebar.active" /></Badge> : <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>,
                                    <div className="list-action">
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('UpdateAssignRole', item.Id, this.checkAndGetMenuAccessDetail('0B2076D0-A57A-9200-2078-F959AE608B7F'))} className="ml-3"><i className="ti-clipboard" /></a>
                                    </div>
                                ];
                            })}
                        />
                    </div>
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
                    {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={pageData} props={this.props} menuDetail={checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />}
                </Drawer>
            </Fragment>
        )
    }
}

ListUserRoleAssign.defaultProps = {
    roleID: '',
    isShowPageTitle: true,
    dynPageTitle: <IntlMessages id="sidebar.listUserRoleAssign" />
}

//function map to props
const mapToStateProps = ({ roleManagementRdcer,authTokenRdcer }) => {
    const { userRoleList, assignData, listLoading } = roleManagementRdcer;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { userRoleList, assignData, listLoading ,        menuLoading,
        menu_rights};
}

export default connect(mapToStateProps, {
    listUserRoleAssignByRoleId,
    getUserById,
    getMenuPermissionByID,
})(ListUserRoleAssign);