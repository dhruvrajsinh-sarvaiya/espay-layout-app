/**
 * Create By Sanjay 
 * Created Date 20/02/2019
 * Component For Lit Referral Reward Configuration  
 */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { Badge } from 'reactstrap';
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
import { changeDateFormat } from "Helpers/helpers";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import { getReferralRewardConfigData, activeReferralRewardConfig, inactiveReferralRewardConfig, getReferralRewardConfigById } from 'Actions/MyAccount';
import { CustomFooter } from './Widgets';
import UpdateReferralRewardConfig from './UpdateReferralRewardConfig';
import AppConfig from 'Constants/AppConfig';
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
        title: <IntlMessages id="my_account.referralSystem" />,
        link: '',
        index: 1
    },
    {
        title: <IntlMessages id="my_account.rewardConfig" />,
        link: '',
        index: 2
    },
    {
        title: <IntlMessages id="my_account.ListReferralRewardConfig" />,
        link: '',
        index: 3
    }
];

//Columns Object
const columns = [
    {
        name: <IntlMessages id="sidebar.colHash" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.ReferralSlab" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.RewardsPay" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.ReferralPayTypeName" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.ReferralServiceTypeName" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.ActiveDate" />,
        options: { filter: false, sort: true }
    },
    {
        name: <IntlMessages id="sidebar.ExpireDate" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.Status" />,
        options: { filter: true, sort: true, }
    },
    {
        name: <IntlMessages id="sidebar.colAction" />,
        options: { filter: false, sort: false, }
    }
];

const components = {
    UpdateReferralRewardConfig: UpdateReferralRewardConfig
};

//dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, menuDetail) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        menuDetail
    });
};

class ListReferralRewardConfig extends Component {
    state = {
        Data: [],
        open: false,
        PageIndex: 1,
        PAGE_SIZE: AppConfig.totalRecordDisplayInList,
        totalCount: 0,
        componentName: "",
        menuDetail: {},
        menudetail: [],
        menuLoading: false,
        notificationFlag: true,
    }

    onClick = () => {
        this.setState({ open: this.state.open ? false : true })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    }

    componentWillMount() {
        this.props.getMenuPermissionByID('8A159479-39BB-8728-0D98-98D4E3769D24'); // get myaccount menu permission
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ menuLoading: nextProps.menuLoading })
        const reqObj = {
            PageIndex: this.state.PageIndex,
            PAGE_SIZE: this.state.PAGE_SIZE
        }
        //Added by Saloni Rathod
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
                this.props.getReferralRewardConfigData(reqObj);
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }
        }
        let errMsg;

        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open4 === false) {
            this.setState({ open: false })
        }
        if (nextProps.listReferrlaRewardConfigData.ReturnCode === 0) {
            this.setState({
                Data: nextProps.listReferrlaRewardConfigData.ReferralServiceList,
                totalCount: nextProps.listReferrlaRewardConfigData.TotalCount
            })
        }
        if (nextProps.enableReferralRewardConfigData.ReturnCode === 0) {
            NotificationManager.success(nextProps.enableReferralRewardConfigData.ReturnMsg);
            this.props.getReferralRewardConfigData(reqObj);
        } else if (nextProps.enableReferralRewardConfigData.ReturnCode === 1) {
            errMsg = nextProps.enableReferralRewardConfigData.ErrorCode === 1 ? nextProps.enableReferralRewardConfigData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.enableReferralRewardConfigData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
        if (nextProps.disableReferralRewardConfigData.ReturnCode === 0) {
            NotificationManager.success(nextProps.disableReferralRewardConfigData.ReturnMsg);
            this.props.getReferralRewardConfigData(reqObj);
        } else if (nextProps.disableReferralRewardConfigData.ReturnCode === 1) {
            errMsg = nextProps.disableReferralRewardConfigData.ErrorCode === 1 ? nextProps.disableReferralRewardConfigData.ReturnMsg : <IntlMessages id={`apiErrCode.${nextProps.disableReferralRewardConfigData.ErrorCode}`} />;
            NotificationManager.error(errMsg);
        }
    }

    close2Level = () => {
        this.props.close2Level();
        this.setState({ open: false });
    }

    showComponent = (componentName, menuDetail, viewData) => {
        if (menuDetail.HasChild) {
            this.props.getReferralRewardConfigById({ Id: viewData });
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                menuDetail: menuDetail
            });
        }
        else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />)
        }
    }

    onEnableRewardConfig(Id) {
        this.props.activeReferralRewardConfig({ Id: Id });
    }

    onDisableRewardConfig(Id) {
        this.props.inactiveReferralRewardConfig({ Id: Id });
    }

    handlePageChange = (pageNumber) => {
        this.setState({ PageIndex: pageNumber });
        this.props.getReferralRewardConfigData({
            PageIndex: pageNumber,
            PAGE_SIZE: this.state.PAGE_SIZE
        });
    }

    onChangeRowsPerPage = event => {
        this.setState({ PAGE_SIZE: event.target.value, PageIndex: 1 });
        this.props.getReferralRewardConfigData({
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
        const { Data, componentName, open, totalCount, PageIndex, PAGE_SIZE, menuDetail } = this.state;
        const { drawerClose, list_loading } = this.props;

        //Check list permission....
        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('AB9033B6-656B-2E8D-2414-9FE86EEA9670'); //4DF10E06-6CDB-42A8-140E-D5F1D709A5CA
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
            serverSide: Data.length !== 0 ? true : false,
            page: PageIndex,
            count: totalCount,
            rowsPerPage: PAGE_SIZE,
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
            customFooter: (count, page, rowsPerPage) => {
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
                    this.getReferralRewardConfigData({
                        PageIndex: tableState.page,
                        PAGE_SIZE: tableState.rowsPerPage
                    });
                }
            }
        };

        return (
            <div className="jbs-page-content">
                <WalletPageTitle title={<IntlMessages id="my_account.ListReferralRewardConfig" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                {(this.state.menuLoading || list_loading) && <JbsSectionLoader />}
                <div className="StackingHistory statusbtn-comm">
                    <MUIDataTable
                        columns={columns}
                        options={options}
                        data={
                            Data.map((lst, key) => {
                                return [
                                    key + 1,
                                    lst.ReferMinCount + " To " + lst.ReferMaxCount,
                                    lst.RewardsPay + " " + lst.CurrencyName,
                                    lst.ReferralPayTypeName,
                                    lst.ReferralServiceTypeName,
                                    <span className="date">{changeDateFormat(lst.ActiveDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                    <span className="date">{changeDateFormat(lst.ExpireDate, 'YYYY-MM-DD HH:mm:ss')}</span>,
                                    <Fragment>
                                        <Badge color={lst.Status ? "success" : "danger"}>{lst.Status ? <IntlMessages id="sidebar.active" /> : <IntlMessages id="sidebar.inactive" />}</Badge>
                                    </Fragment>,
                                    <div>
                                        {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && //check edit curd operation */}
                                            <a
                                                href="javascript:void(0)"
                                                className="text-dark ml-10"
                                                onClick={(e) => this.showComponent('UpdateReferralRewardConfig', this.checkAndGetMenuAccessDetail('599E46F4-134F-6A4E-7EB0-9602D27FA72B'), lst.Id)}
                                            >
                                                <i className="ti-pencil" />
                                            </a>
                                        }
                                    </div>
                                ]
                            })
                        }
                    />
                </div>
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
                            this.onClick,
                            this.closeAll,
                            menuDetail
                        )}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ ReferralRewardConfig, drawerclose, authTokenRdcer }) => {
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { menuLoading, menu_rights } = authTokenRdcer;
    const { listReferrlaRewardConfigData, enableReferralRewardConfigData, disableReferralRewardConfigData, list_loading } = ReferralRewardConfig;
    return { listReferrlaRewardConfigData, enableReferralRewardConfigData, disableReferralRewardConfigData, list_loading, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    getReferralRewardConfigData,
    activeReferralRewardConfig,
    inactiveReferralRewardConfig,
    getReferralRewardConfigById,
    getMenuPermissionByID,
})(ListReferralRewardConfig);