/* 
    Developer : Bharat Jograna
    Date : 27 March 2019
    File Comment : My Account List Affiliate Scheme Type Mapping Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { NotificationManager } from "react-notifications";
import MUIDataTable from "mui-datatables";
import { Badge } from 'reactstrap';
import { injectIntl } from 'react-intl';
import classnames from "classnames";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { DynamicLoadComponent } from 'Components/MyAccount/Dashboards';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { CustomFooter } from './Widgets';
import { changeDateFormat, checkAndGetMenuAccessDetail } from "Helpers/helpers";
import { getAffiliateSchemeTypeMappingList, getAffiliateSchemeTypeMappingById, changeStatusAffiliateSchemeTypeMapping } from 'Actions/MyAccount';
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
        title: <IntlMessages id="sidebar.affiliateManagement" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="sidebar.affiliateSchemeTypeMapping" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listAffiliateSchemeTypeMapping" />,
        link: '',
        index: 3
    }
];

const AffiliateSchemeStatus = ({ status }) => {
    var htmlStr = '';
    if (status === 0) {
        htmlStr = <Badge color="warning">Inactive</Badge>;
    } else if (status === 1) {
        htmlStr = <Badge color="success">Active</Badge>;
    } else if (status === 9) {
        htmlStr = <Badge color="danger">Delete</Badge>;
    }
    return htmlStr;
}

class ListAffiliateSchemeTypeMapping extends Component {
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
            affSchemeTypeMappingList: [],
            totalCount: 0,
            menudetail: [],
            menuLoading: false,
            notificationFlag: true,
        };
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true });
    }

    showComponent = (componentName, menuDetail, Id) => {
        if (menuDetail.HasChild) {
            if (Id > 0) {
                this.props.getAffiliateSchemeTypeMappingById({ MappingId: Id });
            }
            var pData = { isEdit: true }
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
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

    //Get Affiliate Scheme Type Mapping List form API...
    componentWillMount() {
        this.props.getMenuPermissionByID('3497E52A-023C-5AE2-9ACF-ACD7A07E9FF6'); // get myaccount menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.getAffiliateSchemeTypeMappingList(this.state.data.PageNo, this.state.data.PageSize);
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

        //Get Affiliate SchemeType Mapping List...
        if (nextProps.list.hasOwnProperty('AffiliateSchemeTypeMappingList') && nextProps.list.AffiliateSchemeTypeMappingList.length > 0) {
            this.setState({ affSchemeTypeMappingList: nextProps.list.AffiliateSchemeTypeMappingList, totalCount: nextProps.list.TotalCount });
        }

        //Get Updated List 
        if (nextProps.chngStsData.ReturnCode === 1 || nextProps.chngStsData.ReturnCode === 9) {
            var errMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.getAffiliateSchemeTypeMappingList(1, this.state.data.PageSize);
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    //Change Status Method...
    changeStatus(Id, Status) {
        var reqObj = {
            MappingId: Id,
            Status: Status
        }
        this.props.changeStatusAffiliateSchemeTypeMapping(reqObj);
    }

    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.getAffiliateSchemeTypeMappingList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = (event) => {
        this.getAffiliateSchemeTypeMappingList(1, event.target.value);
    };

    //Get Click On Affiliate Data form API...
    getAffiliateSchemeTypeMappingList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;
        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        this.setState({ data: newObj });
        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getAffiliateSchemeTypeMappingList(reqObj);
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
        const { componentName, open, affSchemeTypeMappingList, pagedata, totalCount } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { drawerClose } = this.props;
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('00440f64-4e55-a329-3533-0bfb519528c8'); //63534205-58B4-A6E3-1200-7C052AC09D56
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
                name: intl.formatMessage({ id: "sidebar.colSchemeName" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colSchemeType" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colMinimumDepositionRequired" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colCommissionTypeInterval" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colDescription" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "sidebar.colCommissionHour" }),
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
            viewColumns: false,
            filter: false,
            download: false,
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
                var pages = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={pages} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.getAffiliateSchemeTypeMappingList(tableState.page, tableState.rowsPerPage);
                }
            }
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listAffiliateSchemeTypeMapping" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            columns={columns}
                            options={options}
                            data={affSchemeTypeMappingList.map((item, key) => {
                                return [
                                    key + 1,
                                    item.SchemeName,
                                    item.SchemeTypeName,
                                    item.MinimumDepositionRequired,
                                    item.CommissionTypeInterval,
                                    item.Description,
                                    item.CommissionHour,
                                    <AffiliateSchemeStatus status={item.Status} />,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && // check for edit permission
                                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('AddEditAffiliateSchemeTypeMapping', this.checkAndGetMenuAccessDetail('00440f64-4e55-a329-3533-0bfb519528c8'), item.MappingId)} className="mr-10"><i className="ti-pencil" /></a>

                                        }  {item.Status !== 1 && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.MappingId, 1)} className="mr-10"><i className="ti-check" /></a>}
                                        {item.Status === 1 && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.MappingId, 0)} className="mr-10"><i className="ti-na" /></a>}
                                        {item.Status !== 9 && <a href="javascript:void(0)" onClick={() => this.changeStatus(item.MappingId, 9)} className="mr-10"><i className="ti-close" /></a>}
                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditAffiliateSchemeTypeMapping' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditAffiliateSchemeTypeMapping' ? "drawer1 half_drawer" : "drawer1"}
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

const mapToProps = ({ AffiliateSchemeTypeMapping, drawerclose, authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list, chngStsData, listLoading } = AffiliateSchemeTypeMapping;
    return {
        list, chngStsData, listLoading, drawerclose, menuLoading,
        menu_rights
    };
}

export default connect(mapToProps, {
    getAffiliateSchemeTypeMappingList,
    getAffiliateSchemeTypeMappingById,
    changeStatusAffiliateSchemeTypeMapping,
    getMenuPermissionByID,
})(injectIntl(ListAffiliateSchemeTypeMapping));