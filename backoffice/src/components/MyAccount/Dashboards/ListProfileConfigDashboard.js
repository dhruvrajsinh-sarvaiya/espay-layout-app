/* 
    Developer : Kevin Ladani
    Date : 23-01-2019
    Update by : Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount List Profile Config Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import { CustomFooter } from './Widgets';
import MUIDataTable from "mui-datatables";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { getProfileConfigData, getProfileType, deleteProfileConfigData, getProfileById } from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { changeDateFormat, getDeviceInfo, getIPAddress, getHostName, getMode, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import EditProfileConfigDashboard from './EditProfileConfigDashboard';
import AppConfig from 'Constants/AppConfig';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';

const components = {
    EditProfileConfigDashboard: EditProfileConfigDashboard
};

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
        title: <IntlMessages id="sidebar.profileConfiguration" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.listProfileConfigDashboard" />,
        link: '',
        index: 2
    }
];

//dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, pagedata, clearFilter, menuDetail) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        pagedata,
        clearFilter,
        menuDetail,
    });
};

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colId" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colTypeName" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colSubscriptionAmount" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDescription" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDepositFee" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colWithdrawalfee" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colIsRecursive" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colIsProfileExpiry" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colProfileFee" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colProfilelevel" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colTradingfee" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colProfileName" />,
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
class ListProfileConfigDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: '',
            open: false,
            componentName: '',
            data: [],
            Getdata: {
                PageIndex: 1,
                Page_Size: AppConfig.totalRecordDisplayInList,
                TypeId: "0",
                IsRecursive: true,
                FromDate: '',
                ToDate: ''
            },
            Id: '',
            DeviceId: getDeviceInfo(),
            IPAddress: '',
            Mode: getMode(),
            HostName: getHostName(),
            loading: false,
            errors: {},
            pagedata: {},
            totalCount: 0,
            // menuDetail: {},
            menudetail: [],
            notificationFlag: true,
            menuLoading:false
        }
    }

    //clear filter
    clearFilter = () => {
        let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        var newObj = Object.assign({}, this.state.Getdata);
        newObj.FromDate = today;
        newObj.ToDate = today;
        newObj.TypeId = "0";
        newObj.IsRecursive = true;
        newObj.PageIndex = 1;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        this.setState({ Getdata: newObj, showReset: false, errors: '' });
        this.props.getProfileType();
        this.props.getProfileConfigData(newObj);
    }

    onClick = () => {
        this.setState({ open: !this.state.open })
    }

    onClose = () => {
        this.setState({ open: false })
    }

    onEditProfileConfig(item) {
        this.props.getProfileById(item.Id);
        this.showComponent("EditProfileConfigDashboard", this.checkAndGetMenuAccessDetail('4DF10E06-6CDB-42A8-140E-D5F1D709A5CA').HasChild);
    }

    showComponent = (componentName, menuDetail) => {
        this.setState({
            componentName: componentName,
            open: !this.state.open,
            menuDetail: menuDetail
        });
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('668AC471-3A6B-81EF-3AF9-3A672EBA3837'); // get myaccount menu permission

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
              let today = new Date();
        today = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        var newObj = Object.assign({}, this.state.Getdata);
        newObj.FromDate = today;
        newObj.ToDate = today;
        newObj.PageIndex = 1;
        newObj.Page_Size = AppConfig.totalRecordDisplayInList;
        this.setState({ Getdata: newObj });
        this.props.getProfileType();
        this.props.getProfileConfigData(newObj);
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
                setTimeout(() => this.props.getProfileConfigData(this.state.Getdata), 2000);
            }
        } else if (Object.keys(nextProps.profileList).length !== undefined && Object.keys(nextProps.profileList).length > 0 && Object.keys(nextProps.profileList.getProfileConfiguration).length > 0) {
            this.setState({ data: nextProps.profileList.getProfileConfiguration, totalCount: nextProps.profileList.TotalCount });
        } else if (Object.keys(nextProps.profileList).length !== undefined && Object.keys(nextProps.profileList).length > 0) {
            this.setState({ data: [], totalCount: nextProps.profileList.TotalCount });
        }
    }

    ondeleteIPDialog(value) {
        this.refs.deleteConfirmationDialog.open();
        this.setState({ Id: value });
    }

    onChange = (event) => {
        var newObj = Object.assign({}, this.state.Getdata);
        newObj[event.target.name] = event.target.value;
        this.setState({ Getdata: newObj });
    }

    getFilterData = () => {
        this.setState({ showReset: true });
        const { FromDate, ToDate } = this.state.Getdata;
        if (FromDate === "" || ToDate === "") {
            NotificationManager.error(<IntlMessages id="my_account.err.enteryFromNTodayDate" />);
        } else {
            var newObj = Object.assign({}, this.state.Getdata);
            newObj.PageIndex = 1;
            newObj.Page_Size = this.state.Getdata.Page_Size;
            this.props.getProfileConfigData(newObj);
        }
    }

    ondeleteIp() {
        let self = this;
        const { Id, DeviceId, Mode, HostName, Getdata } = this.state
        getIPAddress().then(function (IPAddress) {
            self.props.deleteProfileConfigData({ Id: Id, DeviceId: DeviceId, Mode: Mode, IPAddress: IPAddress, HostName: HostName });
        });
        this.props.getProfileConfigData(Getdata);
        this.refs.deleteConfirmationDialog.close();
    }

    handlePageChange = (pageNumber) => {
        this.setState({
            Getdata: {
                ...this.state.Getdata,
                PageIndex: pageNumber
            }
        });
        this.props.getProfileConfigData({
            ...this.state.Getdata,
            PageIndex: pageNumber,
        });
    }

    onChangeRowsPerPage = event => {
        this.setState({
            Getdata: {
                ...this.state.Getdata,
                PageIndex: 1,
                Page_Size: event.target.value
            }
        });
        this.props.getProfileConfigData({
            ...this.state.Getdata,
            PageIndex: 1,
            Page_Size: event.target.value
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
        const { componentName, open, pagedata, data, errors, totalCount, menuDetail } = this.state;
        const { drawerClose, loading } = this.props;
        const { TypeId, IsRecursive, FromDate, ToDate, PageIndex, Page_Size } = this.state.Getdata;
        const getProfileType = this.props.profileType.TypeMasterList;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('4DF10E06-6CDB-42A8-140E-D5F1D709A5CA'); //4DF10E06-6CDB-42A8-140E-D5F1D709A5CA
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
            rowsPerPage: Page_Size,
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
                            GetData: {
                                ...this.state.Getdata,
                                PageIndex: tableState.page,
                                Page_Size: tableState.rowsPerPage
                            }
                        });
                        this.props.getProfileConfigData({
                            ...this.state.Getdata,
                            PageIndex: tableState.page,
                            Page_Size: tableState.rowsPerPage
                        });
                        break;
                    case 'changePage':
                        this.setState({
                            GetData: {
                                ...this.state.Getdata,
                                PageIndex: tableState.page,
                                Page_Size: tableState.rowsPerPage
                            }
                        });
                        this.props.getProfileConfigData({
                            ...this.state.Getdata,
                            PageIndex: tableState.page,
                            Page_Size: tableState.rowsPerPage
                        });
                        break;
                    default:
                        break;
                }
            }
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.listProfileConfigDashboard" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
             {menuPermissionDetail.Utility.indexOf('18736530') !== -1 && //check filter curd operation ? */}
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
                                <Label for="TypeId"><IntlMessages id="my_account.typeName" /></Label>
                                <Input type="select" name="TypeId" id="TypeId" placeholder="Enter TypeId" value={TypeId} onChange={(e) => this.onChange(e)} >
                                    <IntlMessages id="sidebar.pleaseSelect">{(selectOption) => <option value="">{selectOption}</option>}</IntlMessages>
                                    {getProfileType &&
                                        getProfileType.map((list, index) => (
                                            <option key={index} value={list.id}>
                                                {list.Type}
                                            </option>
                                        ))}
                                </Input>
                                {errors.TypeId && (<span className="text-danger"><IntlMessages id={errors.TypeId} /></span>)}
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <Label for="IsRecursive"><IntlMessages id="my_account.isRecursive" /></Label>
                                <Input type="select" name="IsRecursive" id="IsRecursive" value={IsRecursive} onChange={(e) => this.onChange(e)}>
                                    <IntlMessages id="sidebar.true">{(selectOption) => <option value="true">{selectOption}</option>}</IntlMessages>
                                    <IntlMessages id="sidebar.false">{(selectOption) => <option value="false">{selectOption}</option>}</IntlMessages>
                                </Input>
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <div className="btn_area">
                                    <Button color="primary" onClick={this.getFilterData}><IntlMessages id="sidebar.btnApply" /></Button>
                                    {this.state.showReset && <Button color="danger" className="ml-10" onClick={this.clearFilter}><IntlMessages id="sidebar.btnClear" /></Button>}
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </JbsCollapsibleCard>
                 }
                <div className="StackingHistory">
                    <MUIDataTable
                        // title={<IntlMessages id="my_account.listProfileConfigDashboard" />}
                        columns={columns}
                        options={options}
                        data={
                            data.map((lst, key) => {
                                return [
                                    lst.Id,
                                    lst.TypeName,
                                    lst.SubscriptionAmount,
                                    lst.Description,
                                    lst.DepositFee,
                                    lst.Withdrawalfee,
                                    <span>{lst.IsRecursive === true ? "True" : "False"}</span>,
                                    <span>{lst.IsProfileExpiry === true ? "True" : "False"}</span>,
                                    lst.ProfileFree,
                                    lst.Profilelevel,
                                    lst.Tradingfee,
                                    lst.ProfileName,
                                    <span className="date">{lst.CreatedDate !== null ? changeDateFormat(lst.CreatedDate, 'YYYY-MM-DD HH:mm:ss') : '-'}</span>,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation
                                        <a href="javascript:void(0)" onClick={() => this.onEditProfileConfig(lst)} className="ml-3"><i className="ti-pencil" /></a>
                                         }
                                        {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation */}
                                        <a href="javascript:void(0)" onClick={() => this.ondeleteIPDialog(lst.Id)} className="ml-3"><i className="ti-close" /></a>
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
                    message={<IntlMessages id="sidebar.deleteProfileConfig" />}
                    onConfirm={() => this.ondeleteIp()}
                />
                {/* } */}
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

const mapPropsToState = ({ profileConfigurationRdcer, drawerclose,authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { profileType, profileList, loading, ext_flag, conversion } = profileConfigurationRdcer;
    return { profileType, profileList, loading, ext_flag, conversion, drawerclose,menuLoading, menu_rights };
}

export default connect(mapPropsToState, {
    getProfileConfigData,
    getProfileType,
    deleteProfileConfigData,
    getProfileById,
    getMenuPermissionByID
})(ListProfileConfigDashboard);