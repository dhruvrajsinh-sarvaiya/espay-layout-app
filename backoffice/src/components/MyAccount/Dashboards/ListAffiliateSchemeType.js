/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    File Comment : My Account List Affiliate Scheme Type Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from './Widgets';
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { getAffiliateSchemeTypeList, getAffiliateSchemeTypeById, changeStatusAffiliateSchemeType } from 'Actions/MyAccount';
import AppConfig from 'Constants/AppConfig';
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import Tooltip from "@material-ui/core/Tooltip";

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
        title: <IntlMessages id="sidebar.affiliateSchemeTypeDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listAffiliateSchemeType" />,
        link: '',
        index: 3
    }
];

class ListAffiliateSchemeType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PageNo: 1,
                PageSize: AppConfig.totalRecordDisplayInList,
            },
            pagedata: {},
            open: false,
            componentName: '',
            affSchemeTypeList: [],
            totalCount: 0,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
    }

    onClick = () => {
        this.setState({ open: !this.state.open });
    }

    showComponent = (componentName, menuDetail, SchemeTypeId = '') => {
        if (menuDetail.HasChild) {
        if (SchemeTypeId > 0) {
            this.props.getAffiliateSchemeTypeById({ ID: SchemeTypeId });
        }
        var pData = { isEdit: true }
        
        this.setState({
            componentName: componentName,
            open: !this.state.open,
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

    //Get Affiliate Scheme Type List form API...
    componentWillMount() {
        this.props.getMenuPermissionByID('574F7483-7FA2-4A8F-6E6D-83F487C16AF3'); // get myaccount menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
		/* update menu details if not set */
		if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')&& this.state.notificationFlag) {
			if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getAffiliateSchemeTypeList(this.state.data.PageNo, this.state.data.PageSize);
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

        //Get Affiliate SchemeType List...
        if (nextProps.list.hasOwnProperty('Data') && nextProps.list.Data.length > 0) {
            this.setState({ affSchemeTypeList: nextProps.list.Data, totalCount: nextProps.list.TotalCount });
        }

        //Get Updated List 
        if (nextProps.chngStsData.ReturnCode === 1 || nextProps.chngStsData.ReturnCode === 9) {
            var errMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.getAffiliateSchemeTypeList(1, this.state.data.PageSize);
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    //Change Status Method...
    changeStatus(Id, Status) {
        var reqObj = {
            SchemeTypeId: Id,
            Status: Status
        }
        this.props.changeStatusAffiliateSchemeType(reqObj);
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getAffiliateSchemeTypeList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = (event) => {
        this.getAffiliateSchemeTypeList(1, event.target.value);
    };

    //Get Click On Affiliate Data form API...
    getAffiliateSchemeTypeList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        if (PageSize > 0) {
            newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        }
        this.setState({ data: newObj });
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getAffiliateSchemeTypeList(reqObj);
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
        const intl = this.props.intl;
        const { componentName, open, affSchemeTypeList, pagedata, totalCount, menuDetail } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('A9658239-7A08-6CBE-058A-F8D8F8B02946'); //A9658239-7A08-6CBE-058A-F8D8F8B02946
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        //Table Object...
        const columns = [
            {
                name: intl.formatMessage({ id: "sidebar.colHash" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colSchemeTypeName" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colDescription" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colStatus" }),
                options: {
                    filter: true, sort: true,
                    customBodyRender: (value) => {
                        return (
                            <span className={classnames({
                                "badge badge-danger": (value === 'Inactive'),
                                "badge badge-success": (value === 'Active'),
                            })} >
                                {value}
                            </span>
                        );
                    }
                }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colActions" }),
                options: { filter: false, sort: false }
            }
        ];

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
            serverSide: affSchemeTypeList.length !== 0 ? true : false,
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
                filename: 'List_Affiliate_SchemeType_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getAffiliateSchemeTypeList(tableState.page, tableState.rowsPerPage);
                }
            }
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listAffiliateSchemeType" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            // title={<IntlMessages id="sidebar.listAffiliateSchemeType" />} 
                            columns={columns}
                            options={options}
                            data={affSchemeTypeList.map((item, key) => {
                                return [
                                    key + 1,
                                    item.SchemeTypeName,
                                    item.Description,
                                    item.Status ? intl.formatMessage({ id: "sidebar.active" }) : intl.formatMessage({ id: "sidebar.inactive" }),
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            <Tooltip
                                                title={
                                                    <IntlMessages id="liquidityprovider.tooltip.update" />
                                                }
                                                disableFocusListener disableTouchListener
                                            ><a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditAffiliateSchemeType', (this.checkAndGetMenuAccessDetail('A9658239-7A08-6CBE-058A-F8D8F8B02946')), item.SchemeTypeId)} className="text-dark mr-10"><i className="ti-pencil" /></a></Tooltip>
                                        }
                                        {(item.Status !== 1) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.Active" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeTypeId, 1)} className="mr-10"><i className="ti-check" /></a></Tooltip>}
                                       {(item.Status === 1) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.Inactive" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeTypeId, 0)} className="mr-10"><i className="ti-na" /></a></Tooltip>}
                                        {(item.Status !== 9) && <Tooltip
                                                    title={
                                                        <IntlMessages id="liquidityprovider.tooltip.delete" />
                                                    }
                                                    disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeTypeId, 9)} className="mr-10"><i className="ti-close" /></a></Tooltip>}
                                        {/* {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditAffiliateSchemeType', item.SchemeTypeId)} className="text-dark ml-3"><i className="zmdi zmdi-edit zmdi-hc-2x" /></a>}
                                        {(menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && item.Status !== 1) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeTypeId, 1)} className="text-dark ml-3"><i className="zmdi zmdi-check zmdi-hc-2x" /></a>}
                                        {(menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && item.Status === 1) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeTypeId, 0)} className="text-dark ml-3"><i className="zmdi zmdi-close zmdi-hc-2x" /></a>}
                                        {(menuPermissionDetail.CrudOption.indexOf('B873B896') !== -1 && item.Status !== 9) && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeTypeId, 9)} className="text-dark ml-3"><i className="zmdi zmdi-delete zmdi-hc-2x" /></a>} */}
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditAffiliateSchemeType' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditAffiliateSchemeType' ? "drawer1 half_drawer" : "drawer1"}
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

const mapStateToProps = ({ affiliateSchemeTypeRdcer, drawerclose,authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list, chngStsData, listLoading } = affiliateSchemeTypeRdcer;
    return { list, chngStsData, listLoading, drawerclose ,        menuLoading,
        menu_rights};
}

export default connect(mapStateToProps, {
    getAffiliateSchemeTypeList,
    getAffiliateSchemeTypeById,
    changeStatusAffiliateSchemeType,
    getMenuPermissionByID,
})(injectIntl(ListAffiliateSchemeType));