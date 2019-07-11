/* 
    Developer : Salim Deraiya
    Date : 20-03-2019
    Updated by:Saloni Rathod(27/03/2019)
    File Comment : My Account List Affiliate Scheme Component
*/
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import IntlMessages from "Util/IntlMessages";
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
import { getAffiliateSchemeList, getAffiliateSchemeById, changeStatusAffiliateScheme } from 'Actions/MyAccount';
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
        name: <IntlMessages id="sidebar.colSchemeName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.colSchemeType" />,
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
        title: <IntlMessages id="sidebar.affiliateSchemeDashboard" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="sidebar.listAffiliateScheme" />,
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

class ListAffiliateScheme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagedata: {},
            open: false,
            componentName: '',
            affSchemeList: [],
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

    showComponent = (componentName, menuDetail, SchemeMasterId = '') => {
        if (menuDetail.HasChild) {
            if (SchemeMasterId > 0) {
                this.props.getAffiliateSchemeById({ SchemeMasterId: SchemeMasterId });
            }
            var pData = { isEdit: true }

            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                pagedata: pData,
                // menuDetail: menuDetail
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    //Get Affiliate Scheme List form API...
    componentWillMount() {
        this.props.getMenuPermissionByID('2c5a925d-8417-7f63-499f-a9eece560633'); // get myaccount menu permission
    }

    AffiliateSchemeList = (PageNo, PageSize) => {
        var newObj = Object.assign({}, this.state.data);
        newObj['PageNo'] = PageNo > 0 ? PageNo : this.state.data.PageNo;

        newObj['PageSize'] = PageSize > 0 ? PageSize : this.state.data.PageSize;
        this.setState({ data: newObj });

        //For Action API...
        var reqObj = newObj;
        reqObj.PageNo = PageNo > 0 ? PageNo - 1 : 1;
        this.props.getAffiliateSchemeList(reqObj);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.AffiliateSchemeList(this.state.data.PageNo, this.state.data.PageSize);
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
            this.setState({ affSchemeList: nextProps.list.Data, totalCount: nextProps.list.TotalCount });
        }

        //Get Updated List 
        if (nextProps.chngStsData.ReturnCode === 1 || nextProps.chngStsData.ReturnCode === 9) {
            var errMsg = nextProps.chngStsData.ErrorCode === 1 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        } else if (nextProps.chngStsData.ReturnCode === 0) {
            this.AffiliateSchemeList(this.state.data.PageNo + 1, this.state.data.PageSize);
            var sucMsg = nextProps.chngStsData.ErrorCode === 0 ? nextProps.chngStsData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.chngStsData.ErrorCode}`} />;
            NotificationManager.success(sucMsg);
        }
    }

    //Change Status Method...
    changeStatus(Id, Status) {
        var reqObj = {
            SchemeMasterId: Id,
            Status: Status
        }
        this.props.changeStatusAffiliateScheme(reqObj);
    }
    //Pagination Change Method...
    handlePageChange = (pageNumber) => {
        this.AffiliateSchemeList(pageNumber);
    }

    //Row Per Page Change Method...
    onChangeRowsPerPage = event => {
        this.AffiliateSchemeList(1, event.target.value);
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
        const { componentName, open, affSchemeList, pagedata, totalCount } = this.state;
        const { PageNo, PageSize } = this.state.data;
        const { drawerClose } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('D0ED6F41-42C9-1A08-8844-BFABEE072FE2'); //18FCC217-A78E-9CF9-6904-F17706051384
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
            serverSide: affSchemeList.length !== 0 ? true : false,
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
                filename: 'Affiliate_Scheme_History_' + changeDateFormat(new Date(), 'YYYY-MM-DD') + '.csv'
            },
            customFooter: (count, page, rowsPerPage) => {
                var page1 = page > 0 ? page + 1 : 1;
                return (
                    <CustomFooter count={count} page={page1} rowsPerPage={rowsPerPage} handlePageChange={this.handlePageChange} onChangeRowsPerPage={this.onChangeRowsPerPage} />
                );
            },
            onTableChange: (action, tableState) => {
                if (action === 'changeRowsPerPage' || action === 'changePage') {
                    this.AffiliateSchemeList(tableState.page, tableState.rowsPerPage);
                }
            },
        };

        return (
            <Fragment>
                {(this.state.menuLoading || this.props.listLoading) && <JbsSectionLoader />}
                <div className="jbs-page-content">
                    <WalletPageTitle title={<IntlMessages id="sidebar.listAffiliateScheme" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                    <div className="StackingHistory">
                        <MUIDataTable
                            // title={<IntlMessages id="sidebar.listAffiliateScheme" />} 
                            columns={columns}
                            options={options}
                            data={affSchemeList.map((item, key) => {
                                return [
                                    key + 1 + (PageNo * PageSize),
                                    item.SchemeName,
                                    item.SchemeType,
                                    <AffiliateSchemeStatus status={item.Status} />,
                                    <div className="list-action">
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 &&
                                            <Tooltip
                                                title={
                                                    <IntlMessages id="liquidityprovider.tooltip.update" />
                                                }
                                                disableFocusListener disableTouchListener
                                            >

                                                <a href="javascript:void(0)" className="mr-10" onClick={(e) => this.showComponent('AddEditAffiliateScheme', this.checkAndGetMenuAccessDetail('D0ED6F41-42C9-1A08-8844-BFABEE072FE2'), item.SchemeMasterId)}><i className="ti-pencil" /></a></Tooltip>
                                        }   {(item.Status === 0 || item.Status === 9) && <Tooltip
                                            title={
                                                <IntlMessages id="liquidityprovider.tooltip.Active" />
                                            }
                                            disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeMasterId, 1)} className="mr-10"><i className="ti-check" /></a></Tooltip>}
                                        {(item.Status === 1 || item.Status === 9) && <Tooltip
                                            title={
                                                <IntlMessages id="liquidityprovider.tooltip.Inactive" />
                                            }
                                            disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeMasterId, 0)} className="mr-10"><i className="ti-na" /></a></Tooltip>}
                                        {(item.Status === 0 || item.Status === 1) && <Tooltip
                                            title={
                                                <IntlMessages id="liquidityprovider.tooltip.delete" />
                                            }
                                            disableFocusListener disableTouchListener><a href="javascript:void(0)" onClick={() => this.changeStatus(item.SchemeMasterId, 9)} className="mr-10"><i className="ti-close" /></a></Tooltip>}

                                    </div>
                                ];
                            })}
                        />
                    </div>
                    <Drawer
                        width={componentName === 'AddEditAffiliateScheme' ? "50%" : "100%"}
                        handler={false}
                        open={open}
                        placement="right"
                        className={componentName === 'AddEditAffiliateScheme' ? "drawer1 half_drawer" : "drawer1"}
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

const mapStateToProps = ({ affiliateSchemeRdcer, drawerclose, authTokenRdcer }) => {
    //To Close the drawer using breadcrumb data 
    if (drawerclose.bit === 1) {
        setTimeout(function () { drawerclose.bit = 2 }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    const { list, chngStsData, listLoading } = affiliateSchemeRdcer;
    return {
        list, chngStsData, listLoading, drawerclose, menuLoading,
        menu_rights
    };
}

export default connect(mapStateToProps, {
    getAffiliateSchemeList,
    getAffiliateSchemeById,
    getMenuPermissionByID,
    changeStatusAffiliateScheme
})(ListAffiliateScheme);