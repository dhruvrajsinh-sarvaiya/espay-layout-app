/* 
    Developer : Kevin Ladani
    Date : 01-09-2019
    UpdateBy Sanjay 07/02/2019, Bharat Jograna (BreadCrumb)09 March 2019
    File Comment : MyAccount Organization List Priority Dashboard Component
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle'; //Added by Bharat Jograna, (BreadCrumb)09 March 2019 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { CustomFooter } from './Widgets';
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader"; //added by Bharat Jograna for Loader and NotificationManager
import { NotificationManager } from "react-notifications"; //added by Bharat Jograna for Loader and NotificationManager
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { slaConfigurationList, deleteSLAConfiguration } from "Actions/MyAccount";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import EditSLAConfigurationDashboard from './EditSLAConfigurationDashboard';
import AppConfig from 'Constants/AppConfig';
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
        title: <IntlMessages id="sidebar.slaConfiguration" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.getpriorityList" />,
        link: '',
        index: 2
    }
];

const components = {
    EditSLAConfigurationDashboard: EditSLAConfigurationDashboard
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

//Table Columns
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colPriority" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colPriorityTime" />,
        options: { filter: true, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreatedDt" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: false }
    }
];

class ListSLAPriorityDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData: '',
            open: false,
            componentName: '',
            PageIndex: 1,
            PAGE_SIZE: AppConfig.totalRecordDisplayInList,
            totalCount: 0,
            Id: '',
            Getdata: [],
            loading: false,
            errors: {},
            pagedata: {},
            data: {
                Id: "",
                Priority: "",
                PriorityTime: "",
                Timewith: '',
            },
            menudetail: [],
            menuLoading: false
        }
    }

    onClick = () => {
        this.setState({ open: !this.state.open })
    }

    showComponent = (componentName, viewData, menuDetail) => {
        var newObj = Object.assign({}, this.state.data);
        newObj.Id = viewData.Id;
        newObj.Priority = viewData.Priority;
        newObj.PriorityTime = viewData.PriorityTime;
        let getTime = viewData.PriorityTime.split(" ");
        newObj.PriorityTime = getTime[0];
        newObj.Timewith = getTime[1];

                //check permission go on next page or not
        if (menuDetail.HasChild) {
                    
            this.setState({
                pagedata: newObj,
                        componentName: componentName,
                        open: !this.state.open,
                        menuDetail: menuDetail
                    });
                } else {
                    NotificationManager.error(<IntlMessages id={"error.permission"} />);
                }
    }

    onClose = () => {
        this.setState({ open: false })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('48AB76E4-811E-9916-2FC1-1B4D9C617D63'); // get myaccount menu permission

    }

    getslaConfigurationList = () => {
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        this.props.slaConfigurationList(reqObj);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ loading: nextProps.loading, menuLoading: nextProps.menuLoading });

        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getslaConfigurationList();
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
                setTimeout(() => this.getslaConfigurationList(), 2000);
            }
        } else if (Object.keys(nextProps.list).length !== undefined && Object.keys(nextProps.list).length > 0 && Object.keys(nextProps.list.ComplaintPriorityGet).length > 0) {
            this.setState({ Getdata: nextProps.list.ComplaintPriorityGet, totalCount: nextProps.list.TotalCount });
        } else {
            this.setState({ Getdata: [] });
        }
    }

    ondeleteCustomerDialog = (value) => {
        this.refs.deleteConfirmationDialog.open();
        this.setState({ Id: value });
    }

    ondeleteCustomer = () => {
        this.props.deleteSLAConfiguration({ Id: this.state.Id });
        this.refs.deleteConfirmationDialog.close();
    }

    handlePageChange = (pageNumber) => {
        this.setState({ PageIndex: pageNumber });
        this.props.slaConfigurationList({
            PageIndex: pageNumber,
            PAGE_SIZE: this.state.PAGE_SIZE
        });
    }

    onChangeRowsPerPage = (event) => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        this.props.slaConfigurationList({
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
        const { componentName, open, pagedata, Getdata, loading, totalCount, PageIndex, PAGE_SIZE, menuDetail } = this.state;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('9D15F612-8C2F-9943-3AB5-74EB80331CEA'); //9D15F612-8C2F-9943-3AB5-74EB80331CEA
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        //Table Options
        const options = {
            filter: false,
            responsive: "scroll",
            selectableRows: false,
            resizableColumns: false,
            search: false, //menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            print: false,
            download: false,
            viewColumns: false,
            sort: false,
            serverSide: Getdata.length !== 0 ? true : false,
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
                        this.getslaConfigurationList();
                        break;
                    case 'changePage':
                        this.setState({
                            PageIndex: tableState.page,
                            PAGE_SIZE: tableState.rowsPerPage,
                        });
                        this.getslaConfigurationList();
                        break;
                    default:
                        break;
                }
            }
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="sidebar.getpriorityList" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || loading) && <JbsSectionLoader />}
                <div className="StackingHistory mt-20">
                    <MUIDataTable
                        // title={<IntlMessages id="sidebar.getpriorityList" />}
                        options={options}
                        columns={columns}
                        data={Getdata.map((list, index) => {
                            return [
                                index + 1,
                                list.Priority,
                                list.PriorityTime,
                                <span className="date">{changeDateFormat(list.CreatedDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                <div class="list-action">
                                    {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation
                                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('EditSLAConfigurationDashboard', list, this.checkAndGetMenuAccessDetail('9D15F612-8C2F-9943-3AB5-74EB80331CEA'))} className=" ml-3"><i className="ti-pencil" /></a>
                                    }
                                    {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation */}
                                        <a href="javascript:void(0);" onClick={() => this.ondeleteCustomerDialog(list.Id)} className="ml-3"> <i className="ti-close" /> </a>
                                    }
                                </div>,
                            ];
                        })}
                    />
                </div>
                {/* {menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && //check delete curd operation */}
                <DeleteConfirmationDialog
                    ref="deleteConfirmationDialog"
                    title={<IntlMessages id="sidebar.deleteConfirm" />}
                    message={<IntlMessages id="sidebar.deletePriority" />}
                    onConfirm={() => this.ondeleteCustomer()}
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
                            menuDetail,
                        )}
                </Drawer>
            </div>
        );
    }
}

//map state to props
const mapStateToProps = ({ slaRdcer, drawerclose, authTokenRdcer }) => {
    //Added by Bharat Jograna (BreadCrumb)09 March 2019
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { list, loading, conversion, ext_flag } = slaRdcer;
    return { list, loading, conversion, ext_flag, drawerclose, menuLoading, menu_rights };
};

export default connect(mapStateToProps,
    { slaConfigurationList, deleteSLAConfiguration, getMenuPermissionByID }
)(ListSLAPriorityDashboard);