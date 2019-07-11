/* 
    Developer : Saloni Rathod
    Date : 28-03-2019
    File Comment : My Account List Affiliate Scheme Detail Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import 'rc-drawer/assets/index.css';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { Badge } from 'reactstrap';
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { CustomFooter } from './Widgets';
import { getAffiliateSchemeDetailList, getAffiliateSchemeDetailById, changeStatusAffiliateSchemeDetail } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import Tooltip from "@material-ui/core/Tooltip";

//Table Columns...
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colSchemeMappingName" />,
        options: { filter: false, sort: true }
    },

    {
        name: <IntlMessages id="sidebar.colAffiliateLevel" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMinimumValue" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colMaximumValue" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCreditWalletTypeName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCommissionType" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colCommissionValue" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colDistributionTypeName" />,
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
        title: <IntlMessages id="sidebar.affiliateManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.affiliateSchemeDetailDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listAffiliateSchemeDetail" />,
        link: '',
        index: 3
    }
];

const AffiliateSchemeStatus = ({ status }) => {
    var htmlStr = '';
    if (status === 0) {
        htmlStr = <Badge color="warning"><IntlMessages id="sidebar.inactive" /></Badge>;
    } else if (status === 1) {
        htmlStr = <Badge color="success"><IntlMessages id="sidebar.active" /></Badge>;
    } else if (status === 9) {
        htmlStr = <Badge color="danger"><IntlMessages id="sidebar.delete" /></Badge>;
    }
    return htmlStr;
}

class ListAffiliateScheme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagedata: {},
            open: false,
            componentName: '',
            affSchemeDetailList: [],
            totalCount: '',
            data: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true });
    }

    showComponent = (componentName, menuDetail, DetailId = '') => {
        if (menuDetail.HasChild) {
        if (DetailId > 0) {
            this.props.getAffiliateSchemeDetailById({ DetailId: DetailId });
        }
        var pData = { isEdit: true }

        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true,
            pagedata: pData,
            // menuDetail: menuDetail
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

    //Get Affiliate Scheme List form API...
    componentWillMount() {
        this.props.getMenuPermissionByID('BE0245A0-8F70-8E3D-10BB-8CD0BC9D60C4'); // get myaccount menu permission
    }

    AffiliateSchemeDetailList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getAffiliateSchemeDetailList(reqObj);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')&& this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.AffiliateSchemeDetailList(this.state.data.PageNo, this.state.data.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
		}
        // To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open5 === false) {
            this.setState({ open: false });
        }

        //Get Module List...
        if (nextProps.list.hasOwnProperty('Data') && nextProps.list.Data.length > 0) {
            this.setState({ affSchemeDetailList: nextProps.list.Data, totalCount: nextProps.list.TotalCount });
        }

        // Get Updated List 
        if (nextProps.chngStsData.ReturnCode === 1) {
            var errMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.AffiliateSchemeDetailList(this.state.data.PageNo + 1, this.state.data.PageSize);
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    //Change Status Method...
    changeStatus(Id, Status) {
        var reqObj = {
            DetailId: Id,
            Status: Status
        }
        this.props.changeStatusAffiliateSchemeDetail(reqObj);
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.AffiliateSchemeDetailList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.AffiliateSchemeDetailList(1, event.target.value);
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
        const { componentName, open, affSchemeDetailList, pagedata, totalCount } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { drawerClose } = this.props;
        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('0221cf1d-52b9-04d9-9cbb-cee35abf5f8b'); //63534205-58B4-A6E3-1200-7C052AC09D56
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
            serverSide: affSchemeDetailList.length !== 0 ? true : false,
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
                filename: 'Affiliate_Scheme_Detail_History_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.AffiliateSchemeDetailList(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listAffiliateSchemeDetail" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            // title={<IntlMessages id="sidebar.listAffiliateSchemeDetail" />} 
                            columns={columns}
                            options={options}
                            data={affSchemeDetailList.map((item, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize),
                                    item.SchemeMappingName,
                                    item.Level,
                                    item.MinimumValue,
                                    item.MaximumValue,
                                    item.CreditWalletTypeName,
                                    item.CommissionTypeName,
                                    item.CommissionValue,
                                    (item.DistributionType === 1 ? <IntlMessages id="sidebar.dependOnTransAmount" /> : (item.DistributionType === 2 ? <IntlMessages id="sidebar.CommissionBasedOnPreviousLevel" /> : <IntlMessages id="sidebar.CalculatedForEachTrans" />)),
                                    <AffiliateSchemeStatus status={item.Status} />,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            <Tooltip
                                                title={
                                                    <IntlMessages id="liquidityprovider.tooltip.update" />
                                                }
                                                disableFocusListener disableTouchListener
                                            ><a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditAffiliateSchemeDetail', this.checkAndGetMenuAccessDetail('0221cf1d-52b9-04d9-9cbb-cee35abf5f8b'), item.DetailId)} className="text-dark mr-10"><i className="ti-pencil" /></a></Tooltip>
                                        }
                                        {(item.Status === 0 || item.Status === 9) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.Active" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.DetailId, 1)} className="mr-10"><i className="ti-check" /></a></Tooltip>}
                                        {(item.Status === 1 || item.Status === 9) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.Inactive" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.DetailId, 0)} className="mr-10"><i className="ti-na" /></a></Tooltip>}
                                        {(item.Status === 0 || item.Status === 1) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.delete" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.DetailId, 9)} className="mr-10"><i className="ti-close" /></a></Tooltip>}
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditAffiliateSchemeDetail' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditAffiliateSchemeDetail' ? "drawer1 half_drawer" : "drawer1"}
                        level=".drawer0"
                        levelMove={100}
                        height="100%"
                    >
                        {componentName !== "" && <DynamicLoadComponent drawerClose={this.onClick} closeAll={this.closeAll} componentName={componentName} pagedata={pagedata} props={this.props} menuDetail={checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B')} />}
                    </Drawer>
                </div>
            </Fragment>
        )
    }
}

const mapToProps = ({ affiliateSchemeDetailReducer, drawerclose ,authTokenRdcer}) => {
    // To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list, chngStsData, listLoading } = affiliateSchemeDetailReducer;
    return { list, chngStsData, listLoading, drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapToProps, {
    getAffiliateSchemeDetailList,
    getAffiliateSchemeDetailById,
    changeStatusAffiliateSchemeDetail,
    getMenuPermissionByID,
})(ListAffiliateScheme);