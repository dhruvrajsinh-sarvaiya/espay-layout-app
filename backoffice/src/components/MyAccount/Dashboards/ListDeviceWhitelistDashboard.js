/**
 * Updated by:Bharat Jograna (BreadCrumb)09 March 2019, Saloni Rathod(18/03/2019)
 * List Device WhiteListing
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import { FormGroup, Label, Input, Button, Badge, Form } from 'reactstrap';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019
import { CustomFooter } from './Widgets';
import AppConfig from 'Constants/AppConfig';
import { deviceWhiteList, deleteDeviceWhiteList, disableDeviceWhiteList, enableDeviceWhiteList } from "Actions/MyAccount";
import { changeDateFormat, getDeviceInfo, getIPAddress, getHostName, getMode, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import validateDeviceWhiteListReport from 'Validations/MyAccount/device_whitelist';
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
        title: <IntlMessages id="my_account.manageAccount" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.deviceWhitelist" />,
        link: '',
        index: 2
    }
]

//Table Object...
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
        name: <IntlMessages id="my_account.deviceWhitelisting.colDevice_name" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.deviceos" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colStatus" />,
        options: { filter: false, sort: true }
    },
];

class DeviceWhitelistingWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                SelectedDeviceId: '',
                DeviceId: getDeviceInfo(),
                DeviceOS: '',
                Mode: getMode(),
                HostName: getHostName(),
                FromDate: new Date().toISOString().slice(0, 10),
                ToDate: new Date().toISOString().slice(0, 10),
                PageIndex: 1,
                Page_Size: AppConfig.totalRecordDisplayInList
            },
            list: [],
            errors: '',
            loading: false,
            totalCount: 0,
            menudetail: [],
            menuLoading:false
        }
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.data);
        newObj[event.target.name] = event.target.value;
        this.setState({ data: newObj });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('DBF511E8-47C8-63CE-7063-2C74606D0F35'); // get myaccount menu permission

    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getDeviceWhiteList(this.state.data.PageIndex, this.state.data.Page_Size);
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
            if (nextProps.data.ReturnCode === 1) {
                var errMsg = nextProps.data.ErrorCode === 1 ? nextProps.data.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.data.ErrorCode}`} />;
                NotificationManager.error(errMsg); //added by Bharat Jograna for errMsg
            } else if (nextProps.data.statusCode === 200) {
                NotificationManager.success(nextProps.data.ReturnMsg); //added by Bharat Jograna for errMsg
                this.setState({ loading: true });
                setTimeout(() => this.getDeviceWhiteList(this.state.data.PageIndex, this.state.data.Page_Size), 2000);
            }
        } else if (Object.keys(nextProps.data).length > 0 && (typeof (nextProps.data.DeviceList) !== 'undefined' || nextProps.data.DeviceList.length > 0)) {
            this.setState({ list: nextProps.data.DeviceList, totalCount: nextProps.data.TotalCount });
        }
    }

    onEnableDevice(deviceId) {
        const newObj = Object.assign({}, this.state.data);
        newObj.SelectedDeviceId = deviceId;
        delete newObj.DeviceOS
        delete newObj.PageIndex
        delete newObj.Page_Size
        delete newObj.FromDate
        delete newObj.ToDate
        this.setState({ data: newObj });
        let self = this;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.enableDeviceWhiteList(newObj);
        });
    }

    onDisableDevice(deviceId) {
        const newObj = Object.assign({}, this.state.data);
        newObj.SelectedDeviceId = deviceId;
        delete newObj.DeviceOS
        delete newObj.PageIndex
        delete newObj.Page_Size
        delete newObj.FromDate
        delete newObj.ToDate
        this.setState({ data: newObj });

        let self = this;
        getIPAddress().then(function (ipAddress) {
            newObj.IPAddress = ipAddress;
            self.props.disableDeviceWhiteList(newObj);
        });
    }

    onDeleteDeviceDialog(Id, device) {
        const newObj = Object.assign({}, this.state.data);
        newObj.SelectedDeviceId = Id;
        delete newObj.DeviceOS
        delete newObj.PageIndex
        delete newObj.Page_Size
        delete newObj.FromDate
        delete newObj.ToDate
        this.setState({ data: newObj });

        this.refs.deleteConfirmationDialog.open();
    }

    //To delete Device
    onDeleteDevice() {
        let self = this;
        var reqObj = Object.assign({}, this.state.data);
        getIPAddress().then(function (ipAddress) {
            reqObj.IPAddress = ipAddress;
            self.props.deleteDeviceWhiteList(reqObj);
        });
        this.refs.deleteConfirmationDialog.close();
    }

    //Apply Filter option
    applyFilter = () => {
        const { errors, isValid } = validateDeviceWhiteListReport(this.state.data);
        const { FromDate, ToDate } = this.state.data;
        this.setState({ errors: errors, showReset: true });
        if (isValid) {
            if (FromDate === "" || ToDate === "") {
                NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
            } else {
                var newObj = Object.assign({}, this.state.data);
                newObj.PageIndex = 0;
                newObj.Page_Size = this.state.data.Page_Size;
                this.setState({ data: newObj });
                this.props.deviceWhiteList(newObj);
            }
        }
    }

    //clear filter
    clearFilter = () => {
        var newObj = Object.assign({}, this.state.data);
        newObj.FromDate = new Date().toISOString().slice(0, 10);
        newObj.ToDate = new Date().toISOString().slice(0, 10);
        newObj.UserName = "";
        newObj.DeviceOS = "";
        newObj.PageIndex = 0;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        this.setState({ data: newObj, showReset: false, errors: '' });
        this.props.deviceWhiteList(newObj);
    }

    getDeviceWhiteList = (PageIndex, Page_Size) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageIndex'] = PageIndex > 0 ? PageIndex : this.state.data.PageIndex;
        if (Page_Size > 0) {
            newObj['Page_Size'] = Page_Size > 0 ? Page_Size : this.state.data.Page_Size;
        }
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageIndex = PageIndex > 0 ? PageIndex - 1 : 1;
        this.props.deviceWhiteList(newObj);
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getDeviceWhiteList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.getDeviceWhiteList(1, event.target.value);
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
        const { list, loading, totalCount, errors } = this.state;
        const { UserName, FromDate, ToDate, PageIndex, Page_Size, DeviceOS } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('3E35CB8B-A4BF-5F33-17A5-33A2B7AAA1DA'); //3E35CB8B-A4BF-5F33-17A5-33A2B7AAA1DA
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();

        //Table Options
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
            rowsPerPage: Page_Size,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            downloadOptions: {
                filename: 'Device_WhiteList_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getDeviceWhiteList(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.deviceWhitelist" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                 {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation */}
                <JbsCollapsibleCard>
                    <div className="top-filter">
                        <Form className="tradefrm row">
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="startDate"><IntlMessages id="my_account.startDate" /><span className="text-danger">*</span></Label>
                                <Input type="date" name="FromDate" id="FromDate" placeholder="dd/mm/yyyy" value={FromDate} max={today} onChange={this.onChange} />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="endDate"><IntlMessages id="my_account.endDate" /><span className="text-danger">*</span></Label>
                                <Input type="date" name="ToDate" id="ToDate" placeholder="dd/mm/yyyy" value={ToDate} min={FromDate} max={today} onChange={this.onChange} />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="UserName"><IntlMessages id="lable.username" /></Label>
                                <Input type="text" name="UserName" id="UserName" placeholder="Search.." value={UserName} onChange={(e) => this.onChange(e)} />
                                {errors.UserName && (<span className="text-danger"><IntlMessages id={errors.UserName} /></span>)}
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="DeviceOS"><IntlMessages id="sidebar.deviceos" /></Label>
                                <Input type="text" name="DeviceOS" id="DeviceOS" placeholder="Search.." value={DeviceOS} onChange={(e) => this.onChange(e)} />
                                {errors.DeviceOS && (<span className="text-danger"><IntlMessages id={errors.DeviceOS} /></span>)}
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
                    // title={<IntlMessages id="sidebar.deviceWhitelisting" />} 
                    columns={columns} 
                    options={options}
                        data={list.map((item, key) => {
                            return [
                                key + 1 + (PageIndex * Page_Size),
                                item.UserName,
                                item.Device,
                                item.DeviceOS,
                                changeDateFormat(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss'),
                                <Fragment>
                                    {/* {
                                    menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 //check edit curd operation
                                    ?
                                    (item.IsEnable
                                        ?
                                        <Badge color="success" onClick={() => this.onDisableDevice(item.Id)} style={{ 'cursor': 'pointer' }}>
                                            <IntlMessages id="sidebar.active" />
                                        </Badge>
                                        :
                                        <Badge color="danger" onClick={() => this.onEnableDevice(item.Id)} style={{ 'cursor': 'pointer' }}>
                                            <IntlMessages id="sidebar.inActive" />
                                        </Badge>
                                    )
                                    : */}
                                    <Badge color={item.IsEnable ? "success" : "danger"}>{item.IsEnable ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inActive" />}</Badge>
                                    {/* } */}
                                </Fragment>,
                                /* <Fragment>
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation
                                    <a href="javascript:void(0)" onClick={(e) => this.onDeleteDeviceDialog(item.Id, item.Device)} className="text-dark"><i className="zmdi zmdi-delete zmdi-hc-2x" /></a>}
                                </Fragment> */
                            ];
                        })}
                    />
                    {/* {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation */}
                    <DeleteConfirmationDialog
                        ref="deleteConfirmationDialog"
                        title={<IntlMessages id="sidebar.deleteConfirm" />}
                        message={<IntlMessages id="sidebar.deleteDeviceNote" />}
                        onConfirm={() => this.onDeleteDevice()}
                    />
                    {/* } */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ devicewhitelistDashboard, drawerclose,authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { data, loading, ext_flag } = devicewhitelistDashboard;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { data, loading, ext_flag, drawerclose,menuLoading, menu_rights }
}

export default withRouter(connect(mapStateToProps, {
    deviceWhiteList,
    deleteDeviceWhiteList,
    disableDeviceWhiteList,
    enableDeviceWhiteList,
    getMenuPermissionByID
})(DeviceWhitelistingWdgt));