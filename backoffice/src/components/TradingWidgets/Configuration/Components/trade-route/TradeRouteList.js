import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { NotificationManager } from "react-notifications";
import MatButton from "@material-ui/core/Button";

import {
    getTradeRouteList
} from "Actions/TradeRoute";

import MUIDataTable from "mui-datatables";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// Import component for internationalization
import IntlMessages from "Util/IntlMessages";

import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import Tooltip from "@material-ui/core/Tooltip";

import AddTradeRoute from './AddTradeRoute';
import UpdateTradeRoute from './UpdateTradeRoute';

import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

import AppConfig from 'Constants/AppConfig';

// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import { Col } from 'reactstrap';
import classnames from "classnames";
import { injectIntl } from 'react-intl';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';


class TradeRouteList extends Component {

    constructor() {
        super();
        this.state = {
            tradeRouteList: [],
            open: false,
            addData: false,
            editDetails: [],
            editData: false,
            componentName: '',
            Page_Size: AppConfig.totalRecordDisplayInList,
            menudetail: [],
            notificationFlag: true,
        };
    }
    componentWillMount() {
        this.props.getMenuPermissionByID('ACA5B4D7-13C6-42D8-A57B-00F53A092162'); // get wallet menu permission
    }
    componentWillReceiveProps(nextprops) {

        if (nextprops.tradeRouteList.length !== 0 && nextprops.error.length == 0) {
            this.setState({
                tradeRouteList: nextprops.tradeRouteList,
            })
        } else if (nextprops.error.length !== 0 && nextprops.error.ReturnCode !== 0) {
            // NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
            this.setState({
                tradeRouteList: [],
            })
        }
        if (nextprops.drawerclose.bit === 1 && nextprops.drawerclose.Drawersclose.open3 === false) {
            this.setState({
                open: false,
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextprops.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextprops.menu_rights.ReturnCode === 0) {
                
                //code change by devang parekh (12-6-2019) for handle arbitrage configuration detail
                var reqObject = {};
                if(this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.getTradeRouteList(reqObject);
                //end 
                this.props.getTradeRouteList({});
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
    }

    showComponent = (componentName, menuDetail) => {

        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        }

    }

    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: '',
            addData: false,
            editData: false,
        })
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
            addData: false,
            editData: false,
            componentName: ''
        });
    }

    // componentDidMount() {
    //     this.props.getTradeRouteList({});
    //     //this.props.getTradePairs({});
    // }

    onAddData = (menuDetail) => {

        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                addData: true,
                editData: false,
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    onEditData = (selectedData, menuDetail) => {

        // check permission go on next page or not
        if (menuDetail) {
            this.setState({
                editData: true,
                editDetails: selectedData,
                addData: false,
            })
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

        const { drawerClose } = this.props;

        var menuPermissionDetail = this.checkAndGetMenuAccessDetail('31CEA41F-846F-7992-50B3-628C51EA8D0E'); //31CEA41F-846F-7992-50B3-628C51EA8D0E
        if (!menuPermissionDetail) {
            menuPermissionDetail = { Utility: [], CrudOption: [] }
        }

        //added by jayshreeba Gohil for Arbitrage Breadcrumns (14/06/2019)
        const data = this.props;
        // console.log("newdata", data);
 
         if (data.IsArbitrage != undefined && data.IsArbitrage == "1") {
 
             var BreadCrumbData = [
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
                    title: <IntlMessages id="sidebar.tradeRoute" />,
                    link: '',
                    index: 0
                }
                //  {
                //      title: <IntlMessages id="sidebar.providerConfiguration" />,
                //      link: '',
                //      index: 1
                //  }
             ];
         }
         else {
 
             var BreadCrumbData = [
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
                    title: <IntlMessages id="sidebar.trading" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id="card.list.title.configuration" />,
                    link: '',
                    index: 1
                },
                {
                    title: <IntlMessages id="sidebar.tradeRoute" />,
                    link: '',
                    index: 2
                }
             ];
         }
 

        const columns = [
            {
                name: <IntlMessages id="myaccount.patternsColumn.id" />,
                options: { sort: false, filter: false }
            },
            {
                name: <IntlMessages id="exchangefeedConfig.list.column.label.pair" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="sidebar.tradeRoute" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="exchangefeedConfig.list.column.label.ordertype" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="wallet.trnType" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="card.list.title.assetsname" />,
                options: { sort: true, filter: true }
            },
            {
                name: <IntlMessages id="manageMarkets.list.form.label.status" />,
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <span
                                className={classnames({
                                    "badge badge-danger": value === 0,
                                    "badge badge-success": value === 1,
                                })}
                            >
                                {this.props.intl.formatMessage({
                                    id: "wallet.historyStatus." + value,
                                })}
                            </span>
                        );
                    },
                },
            },
            {
                name: <IntlMessages id="manageMarkets.list.form.label.action" />,
                options: { sort: true, filter: true }
            }
        ];
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            print: false,
            search: menuPermissionDetail.Utility.indexOf('8E6956F5') !== -1, //for check search permission
            download: false,
            viewColumns: false,
            filter: false,
            rowsPerPage: this.state.Page_Size,
            rowsPerPageOptions: AppConfig.rowsPerPageOptions,
            customToolbar: () => {

                if (menuPermissionDetail.CrudOption.indexOf('04F44CE0') !== -1) { // check add curd operation
                    return (
                        <MatButton
                            variant="raised"
                            className="btn-primary text-white"
                            onClick={() => {
                                this.onAddData(this.checkAndGetMenuAccessDetail('31CEA41F-846F-7992-50B3-628C51EA8D0E').HasChild); // 8B99FC8F-0473-9E75-83FD-9D24FA417444
                                this.showComponent('AddTradeRoute', this.checkAndGetMenuAccessDetail('31CEA41F-846F-7992-50B3-628C51EA8D0E').HasChild); // 8B99FC8F-0473-9E75-83FD-9D24FA417444
                            }}
                        >
                            <IntlMessages id="exchangefeedConfig.pairConfiguration.button.add" />
                        </MatButton>
                    );
                } else {
                    return false;
                }

            }
        };

        return (
            <div className="mb-10 jbs-page-content">
                {(this.props.loading || this.props.menuLoading) && <JbsSectionLoader />}
                {/* {added by jayshreeba gohil for Aritrage breadcrumns (14/06/2019)} */}
                {data.IsArbitrage != undefined && data.IsArbitrage==1 ?<WalletPageTitle  title={<IntlMessages id="sidebar.ArbitragetradeRoute"/>} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />:<WalletPageTitle  title={<IntlMessages id="sidebar.tradeRoute"  />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}

                {/* <WalletPageTitle title={<IntlMessages id="sidebar.tradeRoute" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> */}

                <div className="StackingHistory"></div>

                <Col md={12}>

                    <MUIDataTable
                        title={this.props.title}
                        data={this.state.tradeRouteList.length !== 0 && this.state.tradeRouteList.map((item, key) => {
                            return [
                                key + 1,
                                item.PairName,
                                item.TradeRouteName,
                                item.OrderTypeText,
                                item.TrnTypeText,
                                item.AssetName,
                                item.Status === 9 ? 0 : item.Status,
                                menuPermissionDetail.CrudOption.indexOf('0BB7ACAC') !== -1 ? // check edit curd operation ?
                                    <Fragment>
                                        <div className="list-action">
                                            <Tooltip
                                                title={<IntlMessages id="manageMarkets.tooltip.update" />}
                                                disableFocusListener disableTouchListener
                                            >
                                                <a
                                                    href="javascript:void(0)"
                                                    className="mr-10"
                                                    onClick={(event) => {
                                                        this.onEditData(item, this.checkAndGetMenuAccessDetail('31CEA41F-846F-7992-50B3-628C51EA8D0E').HasChild) // D5A6C476-5594-5CAF-8D89-495D7BC31F31
                                                        this.showComponent('UpdateTradeRoute', this.checkAndGetMenuAccessDetail('31CEA41F-846F-7992-50B3-628C51EA8D0E').HasChild); // D5A6C476-5594-5CAF-8D89-495D7BC31F31
                                                    }}
                                                >
                                                    <i className="ti-pencil" />
                                                </a>
                                            </Tooltip>
                                        </div>
                                    </Fragment>
                                    : '-'
                            ];
                        })}
                        columns={columns}
                        options={options}
                    />
                </Col>
                <Drawer
                    width="50%"
                    handler={false}
                    open={this.state.open}
                    // onMaskClick={this.toggleDrawer}
                    className="drawer2 drawer1 half_drawer"
                    level=".drawer1"
                    placement="right"
                    levelMove={100}
                >
                    {this.state.addData &&
                        <AddTradeRoute {...this.props} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }

                    {this.state.editData && this.state.editDetails &&
                        <UpdateTradeRoute {...this.props} selectedData={this.state.editDetails} drawerClose={this.toggleDrawer} closeAll={this.closeAll} />
                    }
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ tradeRoute, drawerclose, authTokenRdcer }) => {
    const { tradeRouteList, error, loading } = tradeRoute;
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { tradeRouteList, loading, error, drawerclose, menuLoading, menu_rights };
};

export default connect(
    mapStateToProps,
    {
        getTradeRouteList,
        getMenuPermissionByID
    }
)(injectIntl(TradeRouteList));
