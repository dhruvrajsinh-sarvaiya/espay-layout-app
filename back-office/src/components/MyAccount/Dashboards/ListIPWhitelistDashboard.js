/**
 * Auther : Kevin Ladani
 * Updated By : Bharat Jograna (BreadCrumb)09 March 2019
 * IP Whitelisting Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { Badge } from 'reactstrap';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { listIPWhitelist, DeleteIPToWhitelist, disableIPWhitelist, enableIPWhitelist } from "Actions/MyAccount";
import IntlMessages from "Util/IntlMessages";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { CustomFooter } from './Widgets';
import { changeDateFormat, getDeviceInfo, getIPAddress, getHostName, getMode } from "Helpers/helpers";
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

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
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.ipWhitelist" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="my_account.listIPWhitelist" />,
        link: '',
        index: 3
    }
]

//Columns Object
const columns = [
    {
        name: <IntlMessages id="myaccount.ipWhitelistColumn.ip" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="my_account.IPWhitelis.addColumn.aliasName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="myaccount.ipWhitelistColumn.date" />,
        options: { filter: false, sort: false }
    },
    {
        name: <IntlMessages id="myaccount.ipWhitelistColumn.action" />,
        options: { filter: false, sort: false }
    }
];

class IPWhitelistWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                SelectedIPAddress: '',
                DeviceId: getDeviceInfo(),
                Mode: getMode(),
                IPAddress: '',
                HostName: getHostName()
            },
            editIp: [],
            list: [],
            loading: false,
            checkedSwitch: true,
            edit_screen: false,
            PageIndex: 1,
            PAGE_SIZE: AppConfig.totalRecordDisplayInList,
            totalCount: 0,
            staticIP: '',
            open: false,
            menudetail: [],
            menuLoading: false
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('6CAAF0C5-65BE-6DB9-3E04-DF6627CC4D19'); // get myaccount menu permission

    }

    getIPWhitelist() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.listIPWhitelist(reqObj);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getIPWhitelist();
                let self = this;
                getIPAddress().then(function (ipAddress) {
                    self.setState({ staticIP: ipAddress });
                });
            }
            else if (nextProps.menu_rights.ReturnCode !== 0) {
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

        this.setState({ loading: nextProps.loading, err_msg: '', err_alert: false, success_msg: '', success_alert: false });

        if (nextProps.ext_flag) {
            if (nextProps.data.ReturnCode === 1) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            } else if (nextProps.data.statusCode === 200) {
                this.setState({ loading: true });
                NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for success_msg
                setTimeout(() => this.getIPWhitelist(), 2000);
            }
        } else if (Object.keys(nextProps.data).length > 0 && ((nextProps.data.IpList) !== undefined && nextProps.data.IpList.length > 0)) {
            this.setState({ list: nextProps.data.IpList, totalCount: nextProps.data.TotalRow });
        }
    }

    onEnableIP(IpAddress) {
        const newObj = Object.assign({}, this.state.data);
        newObj.SelectedIPAddress = IpAddress;
        this.setState({ data: newObj });

        let self = this;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.enableIPWhitelist(newObj);
        });
    }

    onDisableIP(IpAddress) {
        const newObj = Object.assign({}, this.state.data);
        newObj.SelectedIPAddress = IpAddress;
        this.setState({ data: newObj });

        let self = this;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.disableIPWhitelist(newObj);
        });
    }

    handleCheckChange = name => (event, checked) => {
        this.setState({ [name]: checked });
    };

    ondeleteIPWhitewlisDialog(IpAddress) {
        const newObj = Object.assign({}, this.state.data);
        newObj.SelectedIPAddress = IpAddress;
        this.setState({ data: newObj });
        this.refs.deleteConfirmationDialog.open();
    }

    ondeleteIPWhitelist() {
        let self = this;
        var reqObj = Object.assign({}, this.state.data);
        getIPAddress().then(function (ipAddress) {
            reqObj.IPAddress = ipAddress;
            self.props.DeleteIPToWhitelist(reqObj);
        });
        this.refs.deleteConfirmationDialog.close();
    }

    oneditIPWhitewlis(ipObj) {
        var editObj = {
            SelectedIPAddress: ipObj.IpAddress,
            IpAliasName: ipObj.IpAliasName
        }
        this.setState({ editIp: editObj });
        this.refs.editIpWhitelistDialog.open();
    }

    handlePageChange(pageNumber) {
        this.setState({ PageIndex: pageNumber });
        this.props.listIPWhitelist({
            PageIndex: pageNumber,
            PAGE_SIZE: this.state.PAGE_SIZE
        });
    }

    onChangeRowsPerPage = event => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        this.props.listIPWhitelist({
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
        const { staticIP, list, loading, totalCount, PageIndex, PAGE_SIZE } = this.state;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('D3F0353D-6CBD-6FDE-882B-7E86F2E97157'); //6CAAF0C5-65BE-6DB9-3E04-DF6627CC4D19
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
            serverSide: list.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: PAGE_SIZE,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'IP_Whitelist_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
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
                if (action == 'changeRowsPerPage' || action == 'changePage') {
                    this.setState({
                        PageIndex: tableState.page,
                        PAGE_SIZE: tableState.rowsPerPage,
                    });
                    this.getIPWhitelist();
                }
            }
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.listIPWhitelist" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="text-success p-15 mb-15 border border-success">
                    <IntlMessages id="sidebar.colIpAddress" /> : {staticIP}
                </div>
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory">
                    <MUIDataTable
                        columns={columns}
                        options={options}
                        data={list.map((item, key) => {
                            return [
                                item.IpAddress,
                                item.IpAliasName == null ? '' : item.IpAliasName,
                                <Fragment>
                                    <Badge color={item.IsEnable ? "success" : "danger"}>{item.IsEnable ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inActive" />}</Badge>
                                </Fragment>,
                                changeDateFormat(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss'),
                                <div className="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('5645F321') !== -1 && //check delete curd operation */}
                                        <a href="javascript:void(0)" onClick={() => this.ondeleteIPWhitewlisDialog(item.IpAddress)} className="ml-3"><i className="ti-close" /></a>
                                    }
                                </div>
                            ];
                        })}
                    />
                    {/* {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation */}
                    <DeleteConfirmationDialog
                        ref="deleteConfirmationDialog"
                        title={<IntlMessages id="sidebar.deleteConfirm" />}
                        message={<IntlMessages id="sidebar.deleteIPNote" />}
                        onConfirm={() => this.ondeleteIPWhitelist()}
                    />
                    {/* } */}
                </div>
            </div>
        );
    }
}

//map state to props
const mapStateToProps = ({ ipwhitelistDashboard, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    var response = {
        data: ipwhitelistDashboard.data,
        ext_flag: ipwhitelistDashboard.ext_flag,
        loading: ipwhitelistDashboard.loading,
        drawerclose: drawerclose,
        menuLoading: authTokenRdcer.menuLoading,
        menu_rights: authTokenRdcer.menu_rights
    };
    return response;
};

export default connect(mapStateToProps, {
    listIPWhitelist,
    DeleteIPToWhitelist,
    disableIPWhitelist,
    enableIPWhitelist,
    getMenuPermissionByID
})(IPWhitelistWdgt);