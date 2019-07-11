/* 
    Developer : Kevin Ladani
    Date : 16-01-2019
    Updated By : Bharat Jograna (BreadCrumb)09 March 2019 
    File Comment : List IPRange List Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import { Badge } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import { CustomFooter } from './Widgets';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import { getIPRangeData, deleteIPRangeData } from 'Actions/MyAccount';
import { getDeviceInfo, getIPAddress, getHostName, getMode, changeDateFormat, } from "Helpers/helpers";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import AppConfig from 'Constants/AppConfig';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';

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
        title: <IntlMessages id="sidebar.ipProfiling" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.listIPRange" />,
        link: '',
        index: 2
    }
];

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colId" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStartIp" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colEndIp" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDate" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: false }
    }
];

const ActiveInactiveStatus = ({ status }) => {
    var htmlStatus = '';
    if (status) {
        htmlStatus = <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>;
    } else {
        htmlStatus = <Badge color="danger"><IntlMessages id="sidebar.inactive" /></Badge>;
    }
    return htmlStatus;
}

class ListIPRangeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            list: [],
            Id: '',
            DeviceId: getDeviceInfo(),
            Mode: getMode(),
            HostName: getHostName(),
            loading: false,
            PageIndex: 1,
            PAGE_SIZE: AppConfig.totalRecordDisplayInList,
            totalCount: 0,
            menudetail: [],
            notificationFlag: true,
            menuLoading: false
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    getListIPRange() {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.getIPRangeData(reqObj);
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('83F32458-1156-8CE5-38A8-F2298B3D61A4'); // get myaccount menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getListIPRange();
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
            if (nextProps.conversion.ReturnCode === 1) {
                var errMsg = nextProps.conversion.ErrorCode === 1 ? nextProps.conversion.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.conversion.ErrorCode}`} />;
                NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            } else if (nextProps.conversion.ReturnCode === 0) {
                NotificationManager.success(nextProps.conversion.ReturnMsg); //added by Bharat Jograna for success_msg
                setTimeout(() => this.getListIPRange(), 2000);
            }
        } else if (Object.keys(nextProps.IPRangeData).length > 0 && Object.keys(nextProps.IPRangeData.IPRangeGet).length > 0) {
            this.setState({ list: nextProps.IPRangeData.IPRangeGet, totalCount: nextProps.IPRangeData.TotalCount });
        } else {
            this.setState({ list: [] });
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
            self.props.deleteIPRangeData({ Id: Id, DeviceId: DeviceId, Mode: Mode, IPAddress: IPAddress, HostName: HostName });
        });
        this.refs.deleteConfirmationDialog.close();
    }

    handlePageChange(pageNumber) {
        this.setState({ PageIndex: pageNumber });
        this.props.getIPRangeData({
            PageIndex: pageNumber,
            PAGE_SIZE: this.state.PAGE_SIZE
        });
    }

    onChangeRowsPerPage = event => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        this.props.getIPRangeData({
            PageIndex: 1,
            PAGE_SIZE: event.target.value
        });
    };

    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        let response = false;
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
        const { drawerClose } = this.props;
        const { loading, list, totalCount, PageIndex, PAGE_SIZE } = this.state;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('5dc05354-5573-6284-7264-e46a688342c7'); //5DC05354-5573-6284-7264-E46A688342C7
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
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.setState({
                        PageIndex: tableState.page,
                        PAGE_SIZE: tableState.rowsPerPage,
                    });
                    this.getListIPRange();
                }
            }
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.listIPRange" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory mt-20">
                    <MUIDataTable
                        options={options}
                        columns={columns}
                        data={
                            list.map((lst, key) => {
                                return [
                                    key + 1,
                                    lst.StartIp,
                                    lst.EndIp,
                                    <Fragment>
                                        <ActiveInactiveStatus status={lst.Status} />
                                    </Fragment>,
                                    <span className="date">{changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation
                                            <a href="javascript:void(0);" onClick={() => this.ondeleteIPDialog(lst.Id)} className="ml-3"><i className="ti-close" /></a>
                                        }
                                    </div>,
                                ]
                            })
                        }
                    />
                </div>
                <DeleteConfirmationDialog
                    ref="deleteConfirmationDialog"
                    title={<IntlMessages id="sidebar.deleteConfirm" />}
                    message={<IntlMessages id="sidebar.deleteIPRange" />}
                    onConfirm={() => this.ondeleteIp()}
                />
            </div>
        )
    }
}


const mapStateToProps = ({ ipProfilingRdcer, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { IPRangeData, loading, conversion, ext_flag } = ipProfilingRdcer;
    return { IPRangeData, loading, conversion, ext_flag, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    getIPRangeData,
    deleteIPRangeData,
    getMenuPermissionByID
})(ListIPRangeDashboard);