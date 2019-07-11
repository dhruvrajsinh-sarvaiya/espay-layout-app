/* 
    Developer : Saloni Rathod
    Date : 28-02-2019
    File Comment : My Account List user Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import Drawer from 'rc-drawer';
import { Badge } from 'reactstrap';
import 'rc-drawer/assets/index.css';
import { CustomFooter } from './Widgets';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { changeDateFormat } from "Helpers/helpers";
import { listUser, getUserById, changeUserStatus, reInviteUser } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import { getMenuPermissionByID } from 'Actions/MyAccount';

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
        name: <IntlMessages id="sidebar.colFullName" />,
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
        name: <IntlMessages id="sidebar.colPermissionGroup" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMobileNo" />,
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
        title: <IntlMessages id="sidebar.userDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listUsers" />,
        link: '',
        index: 3
    }
];

const StatusBadges = ({ data }) => {
    switch (data) {
        case 0: return <Badge color="warning"><IntlMessages id="sidebar.inactive" /></Badge>
        case 1: return <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>
        case 2: return <Badge color="secondary"><IntlMessages id="sidebar.confirmed" /></Badge>
        case 3: return <Badge color="primary"><IntlMessages id="sidebar.unConfirmed" /></Badge>
        case 4: return <Badge color="info"><IntlMessages id="sidebar.unAssigned" /></Badge>
        case 5: return <Badge className="purple"><IntlMessages id="sidbar.suspended" /></Badge>
        case 6: return <Badge className="orange"><IntlMessages id="sidebar.block" /></Badge>
        case 7: return <Badge className="indigo"><IntlMessages id="sidebar.reqDeleted" /></Badge>
        case 8: return <Badge className="cyan"><IntlMessages id="sidebar.suspicious" /></Badge>
        case 9: return <Badge className="white"><IntlMessages id="sidebar.delete" /></Badge>
        case 10: return <Badge className="pink"><IntlMessages id="sidebar.policyViolated" /></Badge>
        default: return null;
    }
}

//List-User Component
class ListUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            pagedata: {},
            open: false,
            componentName: '',
            dataList: [],
            totalCount: 0,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    showComponent = (componentName, menuDetail, UserId = '') => {
        if (menuDetail.HasChild) {
            if (UserId > 0) {
                this.props.getUserById({ UserId: UserId });
            }
            var pData = { isEdit: true }
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                pagedata: pData,
                menuDetail: menuDetail
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    //to change Status
    reinvite(email) {
        var reqObj = { Email: email }
        this.props.reInviteUser(reqObj);
    }

    //Get Rule Field List form API...
    getUserList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.listUser(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('6934CCA1-3F29-2407-61E9-7865837C0905');
    }

    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.getUserList(pageNumber);
    }

    //to change Status
    changeStatus(UserId, status) {
        var reqObj = {
            Id: UserId,
            Status: status
        }
        this.props.changeUserStatus(reqObj);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getUserList(1, event.target.value);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getUserList(this.state.data.PageNo, this.state.data.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        //Get User List...
        if (nextProps.list.hasOwnProperty('Data') && nextProps.list.Data.length > 0) {
            this.setState({ dataList: nextProps.list.Data, totalCount: nextProps.list.TotalCount });
        }

        //to send link
        if (nextProps.link.ReturnCode === 1) {
            var errMsg = nextProps.link.ErrorCode === 1 ? nextProps.link.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.link.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.link.ReturnCode === 0) {
            var sucMsg = nextProps.link.ErrorCode === 0 ? nextProps.link.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.link.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }

        //Change Status
        if (nextProps.chngStsData && nextProps.chngStsData.ReturnCode === 1) {
            var errMsg1 = nextProps.list.ErrorCode === 1 ? nextProps.list.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.list.ErrorCode}`} />;
            NotificationManager.error(errMsg1);
        } else if (nextProps.chngStsData && nextProps.chngStsData.ReturnCode === 0) {
            this.getUserList(1, this.state.data.PageSize);
            sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
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
        const { componentName, open, dataList, totalCount, pagedata } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('AB0A8F90-6808-3660-1921-DF04924E94D9'); //AB0A8F90-6808-3660-1921-DF04924E94D9
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
            serverSide: dataList.length !== 0 ? true : false,
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
                filename: 'USER_LIST_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var tblPage = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={tblPage} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getUserList(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading ||this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listUsers" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                        columns={columns} 
                        options={options}
                            data={dataList.map((item, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize),
                                    item.UserName,
                                    item.FirstName + ' ' + item.LastName,
                                    item.Email,
                                    item.RoleName,
                                    item.PermissionGroup,
                                    item.Mobile,
                                    <Fragment>
                                        <StatusBadges data={item.Status} />
                                    </Fragment>,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation */}
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditUser',this.checkAndGetMenuAccessDetail('AB0A8F90-6808-3660-1921-DF04924E94D9'), item.UserId)} className="ml-3"><i className="ti-pencil" /></a>}
                                            {item.Status !== 1 && <a href="javascript:void(0)" onClick={(e) => this.changeStatus(item.UserId, 1)} className="ml-3"><i className="ti-check"></i></a>}
                                            {item.Status !== 0 && <a href="javascript:void(0)" onClick={(e) => this.changeStatus(item.UserId, 0)} className="ml-3"><i className="ti-na"></i></a>}
                                            {item.Status !== 6 && <a href="javascript:void(0)" onClick={(e) => this.changeStatus(item.UserId, 6)} className="ml-3"><i className="ti-trash"></i></a>}
                                         
                                        {item.Status === 3 && item.Email !== "" && item.Email !== null &&
                                            <a href="javascript:void(0)" onClick={(e) => this.reinvite(item.Email)} className="ml-3"><i className="zmdi  zmdi-email zmdi-hc-2x" /></a>
                                        }
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditUser' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditUser' ? "drawer1 half_drawer" : "drawer1"}
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

const mapToProps = ({ UserRdcer, drawerclose ,authTokenRdcer}) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { list, listLoading, link, chngStsData } = UserRdcer;
    return { list, listLoading, link, chngStsData, drawerclose, menuLoading, menu_rights};
}

export default connect(mapToProps, {
    listUser,
    getUserById,
    changeUserStatus,
    reInviteUser,
    getMenuPermissionByID,
})(ListUser);