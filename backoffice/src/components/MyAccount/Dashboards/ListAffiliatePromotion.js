/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    Updated By:Saloni Rathod(26-03-2019)
    File Comment : My Account List Affiliate Promotion Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import { Badge } from 'reactstrap';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from './Widgets';
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { getAffiliatePromotionList, getAffiliatePromotionById, changeStatusAffiliatePromotion } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import Tooltip from "@material-ui/core/Tooltip";
//Table Object...
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colPromotionType" />,
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
        title: <IntlMessages id="sidebar.affiliatePromotionDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listAffiliatePromotion" />,
        link: '',
        index: 3
    }
];

const AffiliatePromotionStatus = ({ status }) => {
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

class ListAffiliatePromotion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagedata: {},
            open: false,
            componentName: '',
            affPromotionList: [],
            totalCount: 0,
            pageData: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList
            },
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    showComponent = (componentName, menuDetail, PromotionId = '') => {
        if (menuDetail.HasChild) {
        if (PromotionId > 0) {
            this.props.getAffiliatePromotionById({ ID: PromotionId });
        }
        var pData = { isEdit: true }

        this.setState({
            componentName: componentName,
            open: !this.state.open,
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

    //Get Affiliate Promotion List form API...
    componentWillMount() {
        this.props.getMenuPermissionByID('1CEE9069-71A1-6C63-3C11-6E33D053A186'); // get myaccount menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')&& this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.AffiliatePromotionList(this.state.pageData.PageNo, this.state.pageData.PageSize);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
				NotificationManager.error(<IntlMessages id={"error.permission"} />);
				setTimeout(() => {
					window.location.href = AppConfig.afterLoginRedirect;
				}, 2000);
			}
        }
        //To Close the drawer using breadcrumb data 
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false });
        }

        //Get Module List...
        if (nextProps.list.hasOwnProperty('Data') && nextProps.list.Data.length > 0) {
            this.setState({ affPromotionList: nextProps.list.Data, totalCount: nextProps.list.TotalCount });
        }

        //Get Updated List 
        if (nextProps.chngStsData.ReturnCode === 1 || nextProps.chngStsData.ReturnCode === 9) {
            var errMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.props.getAffiliatePromotionList(this.state.pageData);
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    //Change Status Method...
    changeStatus(Id, Status) {
        var reqObj = {
            PromotionId: Id,
            Status: Status
        }
        this.props.changeStatusAffiliatePromotion(reqObj);
    }

    AffiliatePromotionList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.pageData);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.pageData.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.pageData.PageSize;
        }
        this.setState({ pageData: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getAffiliatePromotionList(reqObj);
    }
    //Pagination Change Method...
    handlePageChange(pageNumber) {
        this.AffiliatePromotionList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.AffiliatePromotionList(1, event.target.value);
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
        const { componentName, open, affPromotionList, totalCount, pagedata, menuDetail } = this.state;
        const { PageNo, PageSize } = this.state.pageData;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('63534205-58B4-A6E3-1200-7C052AC09D56'); //63534205-58B4-A6E3-1200-7C052AC09D56
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
            serverSide: affPromotionList.length !== 0 ? true : false,
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
                filename: 'Login_History_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.AffiliatePromotionList(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listAffiliatePromotion" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            // title={<IntlMessages id="sidebar.listAffiliatePromotion" />} 
                            columns={columns}
                            options={options}
                            data={affPromotionList.map((item, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize),
                                    item.PromotionType,
                                    <AffiliatePromotionStatus status={item.Status} />,
                                    <div className="list-action">
                                        {/* {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditAffiliatePromotion', item.PromotionId)} className="text-dark ml-3"><i className="zmdi zmdi-edit zmdi-hc-2x" /></a>}
                                        {(menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && (item.Status === 0 || item.Status === 9)) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.PromotionId, 1)} className="text-dark ml-2"><i className="zmdi zmdi-check zmdi-hc-2x" /></a>}
                                        {(menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && (item.Status === 1 || item.Status === 9)) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.PromotionId, 0)} className="text-dark ml-2"><i className="zmdi zmdi-close zmdi-hc-2x" /></a>}
                                        {(menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && (item.Status === 0 || item.Status === 1)) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.PromotionId, 9)} className="text-dark ml-2"><i className="zmdi zmdi-delete zmdi-hc-2x" /></a>} */}
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            <Tooltip
                                                title={
                                                    <IntlMessages id="liquidityprovider.tooltip.update" />
                                                }
                                                disableFocusListener disableTouchListener
                                            >
                                                <a href="javascript:void(0)" className="mr-10" onClick={(e) => this.showComponent('AddEditAffiliatePromotion', this.checkAndGetMenuAccessDetail('63534205-58B4-A6E3-1200-7C052AC09D56'), item.PromotionId)}><i className="ti-pencil" /></a></Tooltip>
                                        } {((item.Status === 0 || item.Status === 9)) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.Active" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.PromotionId, 1)} className="mr-10"><i className="ti-check" /></a></Tooltip>}
                                        {((item.Status === 1 || item.Status === 9)) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.Inactive" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.PromotionId, 0)} className="mr-10"><i className="ti-na" /></a></Tooltip>}
                                        {((item.Status === 0 || item.Status === 1)) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.delete" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.PromotionId, 9)} className="mr-10"><i className="ti-close" /></a></Tooltip>}
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditAffiliatePromotion' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditAffiliatePromotion' ? "drawer1 half_drawer" : "drawer1"}
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

const mapStateToProps = ({ affiliatePromotionRdcer, drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list, chngStsData, listLoading } = affiliatePromotionRdcer;
    return { list, chngStsData, listLoading, drawerclose,        menuLoading,
        menu_rights };
}

export default connect(mapStateToProps, {
    getAffiliatePromotionList,
    getAffiliatePromotionById,
    changeStatusAffiliatePromotion,
    getMenuPermissionByID,
})(ListAffiliatePromotion);