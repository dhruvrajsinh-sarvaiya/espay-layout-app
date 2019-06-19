
/*
    Developer : Parth Andhariya
    Date : 11-06-2019
    File Comment :  Conflict History list
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import { injectIntl } from 'react-intl';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
import AppConfig from 'Constants/AppConfig';
import { NotificationManager } from 'react-notifications';
import Drawer from "rc-drawer";
import Tooltip from '@material-ui/core/Tooltip';
import { ListConflictHistory } from 'Actions/Arbitrage/ConflictHistory';
import ConflictRecon from './ConflictRecon';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
//added by parth andhariya
//component names
const components = {
    ConflictRecon: ConflictRecon
};
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, selectedRows) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll,
        selectedRows,
    });
};
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
        title: <IntlMessages id="sidebar.Arbitrage" />,
        link: '',
        index: 0
    },
    {
        title: <IntlMessages id="lable.ConflictHistory" />,
        link: '',
        index: 1
    },
];
const initState = {
    open: false,
    componentName: "",
    selectedRows: {},
    notificationFlag: true,
    menudetail: [],
    notification: true,
};

class ConflictHistory extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };;
    drawerClose = () => {
        this.setState({
            open: false
        });
    }
    componentWillMount() {
        this.props.ListConflictHistory({})
        // this.props.getMenuPermissionByID('1944654E-05F0-6249-27D8-91EB98F611CA'); // get wallet menu permission
    }
    componentWillReceiveProps(nextProps) {
        const intl = this.props.intl;
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notification) {
            if (nextProps.menu_rights.ReturnCode === 0) {

                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notification: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        // if (this.state.TotalCount !== nextProps.TotalCount) {
        //     this.setState({ TotalCount: nextProps.TotalCount })
        // }
        // if (nextProps.withdrawalResponce.ReturnCode === 1 && this.state.notificationFlag && this.props.loading) {
        //     this.setState({ notificationFlag: false });
        //     NotificationManager.error(intl.formatMessage({ id: "error.trading.transaction." + nextProps.withdrawalResponce.ErrorCode }));
        // }
        // if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
        //     this.setState({
        //         open: false,
        //     })
        // }
    }
    /* show component */
    showComponent = (componentName, selectedRows, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
                selectedRows: selectedRows
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
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
        /* check menu permission */
        // var menuPermissionDetail = this.checkAndGetMenuAccessDetail(''); //
        // if (!menuPermissionDetail) {
        //     menuPermissionDetail = { Utility: [], CrudOption: [] }
        // }
        const intl = this.props.intl;
        const { drawerClose } = this.props;
        const columns = [
            {
                name: intl.formatMessage({ id: "table.currency" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.LocalBalance" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.ProviderBalance" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.Difference" }),
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: intl.formatMessage({ id: "table.RefNo" }),
                options: {
                    filter: false,
                    sort: false
                }
            },


            {
                name: intl.formatMessage({ id: "sidebar.colAction" }),
                options: { sort: true, filter: true }
            }
        ];
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            download: false,
            viewColumns: false,
            rowsPerPage: AppConfig.totalRecordDisplayInList,
            search: false,// menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            textLabels: {
                body: {
                    noMatch: <IntlMessages id="wallet.emptyTable" />,
                    toolTip: <IntlMessages id="wallet.sort" />,
                }
            },
        };
        return (
            <div className="jbs-page-content">
                {(this.props.menuLoading || this.props.loading) && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id={"lable.ConflictHistory"} />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />

                <div className="StackingHistory">
                    <MUIDataTable
                        data={this.props.ConflictList.map((item, key) => {
                            return [
                                item.CoinName,
                                item.LocalBalance.toFixed(8),
                                item.ProviderBalance.toFixed(8),
                                item.Difference.toFixed(8),
                                item.RefNo,
                                <div className="list-action">
                                    {/* {menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 && */}
                                    <Tooltip title={<IntlMessages id="wallet.ReconTooltip" />} placement="bottom">
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.showComponent("ConflictRecon", item, true)} // 
                                        // onClick={() => this.showComponent("WithdrawalRecon", [item], this.checkAndGetMenuAccessDetail('724FE907-A05F-4B97-2F34-174E92073563').HasChild)} // 
                                        >
                                            <i className="zmdi zmdi-open-in-new" />
                                        </a>
                                    </Tooltip>
                                    {/* } */}
                                </div>
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Drawer
                    width="50%"
                    handler={false}
                    open={this.state.open}
                    className="drawer2 half_drawer"
                    level=".drawer0"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.drawerClose,
                            this.closeAll,
                            this.state.selectedRows
                        )}
                </Drawer>
            </div>
        );
    }
}

const mapDispatchToProps = ({ drawerclose, authTokenRdcer, ConflictHistory }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const { ConflictList, loading } = ConflictHistory;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose, menuLoading, menu_rights, ConflictList, loading };
};

export default connect(mapDispatchToProps, {
    getMenuPermissionByID,
    ListConflictHistory
})(injectIntl(ConflictHistory));