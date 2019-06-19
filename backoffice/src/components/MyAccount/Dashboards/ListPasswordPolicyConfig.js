/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount List Domain Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { CustomFooter } from './Widgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getPasswordPolicyData, deletePasswordPolicyData } from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { changeDateFormat, getDeviceInfo, getIPAddress, getHostName, getMode, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import EditPasswordPolicy from './EditPasswordPolicy';
import AppConfig from 'Constants/AppConfig';
//Action methods..
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
        title: <IntlMessages id="sidebar.passwordPolicyConfig" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.passwordPolicyList" />,
        link: '',
        index: 2
    }
];

const components = {
    EditPasswordPolicy: EditPasswordPolicy
};

//dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata, clearFilter, menuDetail) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        pagedata,
        clearFilter,
        menuDetail
    });
};

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colId" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colUserId" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colPwdExpiretime" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMaxfppwdDay" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMaxfppwdMonth" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colLinkExpiryTime" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colOTPExpiryTime" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: false }
    }
];

//Component for MyAccount List Domain Dashboard
class ListPasswordPolicyConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: '',
            open: false,
            componentName: '',
            data: [],
            Id: '',
            DeviceId: getDeviceInfo(),
            IPAddress: '',
            Mode: getMode(),
            HostName: getHostName(),
            loading: false,
            errors: {},
            pagedata: {},
            PageIndex: 1,
            PAGE_SIZE: AppConfig.totalRecordDisplayInList,
            totalCount: 0,
            // menuDetail: {},
            menudetail: [],
            notificationFlag: true,
        }
    }

    onClick = () => {
        this.setState({ open: !this.state.open })
    }

    onClose = () => {
        this.setState({ open: false })
    }

    showComponent = (componentName, viewData, menuDetail) => {
        if (menuDetail.HasChild) {
            this.setState({
                pagedata: viewData,
                componentName: componentName,
                menuDetail: menuDetail,
                open: !this.state.open
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            pagedata: {},
        });
    }

    getListPasswordPolicy = () => {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.getPasswordPolicyData(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('C746F897-8CD6-766B-81A4-9CC748FA4052'); // get myaccount menu permission

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getListPasswordPolicy();
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }

        //Added by Bharat Jograna, (BreadCrumb)09 March 2019
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open3 === false) {
            this.setState({ open: false });
        }

        if (nextProps.ext_flag) {
            if (nextProps.passwordList.ReturnCode === 1) {
                var errMsg = nextProps.passwordList.ErrorCode === 1 ? nextProps.passwordList.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.passwordList.ErrorCode}`} />;
                NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            } else if (nextProps.passwordList.ReturnCode === 0) {
                this.setState({ loading: true });
                NotificationManager.success(nextProps.passwordList.ReturnMsg); //added by Bharat Jograna for success_msg
                setTimeout(() => this.getListPasswordPolicy(), 2000);
            }
        } else if (Object.keys(nextProps.passwordList).length !== undefined && Object.keys(nextProps.passwordList).length > 0 && Object.keys(nextProps.passwordList.UserPasswordPolicyMaster).length > 0) {
            this.setState({ data: nextProps.passwordList.UserPasswordPolicyMaster, totalCount: nextProps.passwordList.TotalCount });
        } else {
            this.setState({ data: [] });
        }
    }

    ondeleteIPDialog(value) {
        this.refs.deleteConfirmationDialog.open();
        this.setState({ Id: value });
    }

    ondeleteIp() {
        let self = this;
        const { Id, DeviceId, Mode, HostName } = this.state
        getIPAddress().then(function (IPAddress) {
            self.props.deletePasswordPolicyData({ Id: Id, DeviceId: DeviceId, Mode: Mode, IPAddress: IPAddress, HostName: HostName });
        });
        this.refs.deleteConfirmationDialog.close();
    }

    handlePageChange = (pageNumber) => {
        this.setState({ PageIndex: pageNumber });
        this.props.getPasswordPolicyData({
            PageIndex: pageNumber,
            PAGE_SIZE: this.state.PAGE_SIZE
        });
    }

    onChangeRowsPerPage = (event) => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        this.props.getPasswordPolicyData({
            PageIndex: 1,
            PAGE_SIZE: event.target.value
        });
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

        const { componentName, open, pagedata, data, totalCount, PageIndex, PAGE_SIZE, menuDetail } = this.state;
        const { drawerClose, loading } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('1B44B4D9-3ACA-1387-09D7-3063EA2076A0'); //1B44B4D9-3ACA-1387-09D7-3063EA2076A0
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
            serverSide: data.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: PAGE_SIZE,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (
                count,
                page,
                rowsPerPage
            ) => {
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changeRowsPerPage':
                        this.setState({
                            PageIndex: tableState.page,
                            PAGE_SIZE: tableState.rowsPerPage,
                        });
                        this.getListPasswordPolicy();
                        break;
                    case 'changePage':
                        this.setState({
                            PageIndex: tableState.page,
                            PAGE_SIZE: tableState.rowsPerPage,
                        });
                        this.getListPasswordPolicy();
                        break;
                    default:
                        break;
                }
            }
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.passwordPolicyList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory">
                    <MUIDataTable
                        // title={<IntlMessages id="sidebar.passwordPolicyList" />}
                        options={options}
                        columns={columns}
                        data={
                            data.map((lst, key) => {
                                return [
                                    lst.Id,
                                    lst.UserId,
                                    lst.PwdExpiretime,
                                    lst.MaxfppwdDay,
                                    lst.MaxfppwdMonth,
                                    lst.LinkExpiryTime,
                                    lst.OTPExpiryTime,
                                    <span className="date">{lst.CreatedDate !== null ? changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss') : '-'}</span>,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('EditPasswordPolicy', lst, this.checkAndGetMenuAccessDetail('1B44B4D9-3ACA-1387-09D7-3063EA2076A0'))} className="ml-3"><i className="ti-pencil" /></a>
                                        }
                                        {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation */}
                                            <a href="javascript:void(0);" onClick={() => this.ondeleteIPDialog(lst.Id)} className="ml-3"> <i className="ti-close" /></a>
                                        }
                                    </div>
                                ]
                            })
                        }
                    />
                </div>
                {/* {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation */}
                <DeleteConfirmationDialog
                    ref="deleteConfirmationDialog"
                    title={<IntlMessages id="sidebar.deleteConfirm" />}
                    message={<IntlMessages id="sidebar.deletePasswordPolicy" />}
                    onConfirm={() => this.ondeleteIp()}
                />
                {/* } */}
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
                    {componentName !== "" &&
                        dynamicComponent(
                            componentName,
                            this.props,
                            this.onClose,
                            this.closeAll,
                            pagedata,
                            this.clearFilter,
                            menuDetail

                        )}
                </Drawer>
            </div>
        );
    }
}

const mapPropsToState = ({ passwordPolicyRdcer, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { passwordList, loading, ext_flag } = passwordPolicyRdcer;
    return { passwordList, loading, ext_flag, drawerclose, menuLoading, menu_rights };
}

export default connect(mapPropsToState, {
    getPasswordPolicyData, deletePasswordPolicyData, getMenuPermissionByID
})(ListPasswordPolicyConfig);