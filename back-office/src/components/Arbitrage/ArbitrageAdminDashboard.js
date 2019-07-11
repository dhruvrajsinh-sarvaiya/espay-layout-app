/* 
    Developer : Parth Andhariya
    Date : 06-06-2019
    File Comment : Admin Dashboard Component
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";
//wallet widgets...
import { SimpleCard } from 'Components/Wallet/DashboardWidgets';
//Action methods..
import { getMenuPermissionByID } from 'Actions/MyAccount';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import MasterArbitrageCurrencyConfiguration from 'Components/Arbitrage/ArbitrageCurrencyConfiguration/MasterArbitrageCurrencyConfiguration';
import MasterArbitrageFeeConfiguration from 'Components/Arbitrage/ArbitrageFeeConfiguration/MasterArbitrageFeeConfiguration';
import ArbitrageProviderWallet from 'Components/Arbitrage/ArbitrageWalletList/ArbitrageWalletList';
import ExchangeBalance from 'Components/Arbitrage/ArbitrageExchangeBalance/ExchangeBalance';
import ArbitrageAddress from 'Components/Arbitrage/ArbitrageProviderAddress/ArbitrageAddress';
import TopupHistory from 'Components/Arbitrage/ProviderTopupHistory/TopupHistory';
import AppConfig from 'Constants/AppConfig';
import { ArbitrageAllowOrderType } from 'Components/Arbitrage/ArbitrageConfiguration';
import ServiceProvider from 'Components/TradingWidgets/Configuration/Components/ServiceProvider';
import ServiceProviderConfiguration from 'Components/TradingWidgets/Configuration/Components/ProviderConfiguration/ProviderConfigurationList';
import { ExchangeConfiguration } from 'Components/Arbitrage/ArbitrageConfiguration';
//import actions for get user trade count
import { getUserTradeCount } from 'Actions/Trading';
// get configuration count method
import { getConfigurationCount } from 'Actions/Trading';
import ConflictHistory from 'Components/Arbitrage/ConflictHistory/ConflictHistory';
import ProviderLedger from 'Components/Arbitrage/ProviderLedger/ProviderLedger';
//added by jayshree
import ArbitrageExchangeConfiguration from './ArbitrageExchangeConfiguration';
import ArbitragPairConfiguration from './ArbitragePairConfiguration';
import TradeRoute from "../TradingWidgets/Configuration/Components/trade-route/TradeRouteList";
import UserTradeDashboard from "../TradingWidgets/UserTrade/Components/UserTradeDashboard";
import { CardType1 } from "../TradingWidgets/DashboardCard/CardType1";

const components = {
    MasterArbitrageCurrencyConfiguration: MasterArbitrageCurrencyConfiguration,
    MasterArbitrageFeeConfiguration: MasterArbitrageFeeConfiguration,
    ArbitrageProviderWallet: ArbitrageProviderWallet,
    ExchangeBalance: ExchangeBalance,
    TopupHistory: TopupHistory,
    ArbitrageAllowOrderType: ArbitrageAllowOrderType,
    ServiceProvider: ServiceProvider,
    ServiceProviderConfiguration: ServiceProviderConfiguration,
    ArbitrageAddress: ArbitrageAddress,
    ExchangeConfiguration: ExchangeConfiguration,
    ConflictHistory: ConflictHistory,
    ProviderLedger: ProviderLedger,
    ArbitrageExchangeConfiguration: ArbitrageExchangeConfiguration,
    ArbitragPairConfiguration: ArbitragPairConfiguration,
    TradeRoute: TradeRoute,
    UserTradeDashboard: UserTradeDashboard

};
// dynamic component binding...
const dynamicComponent = (TagName, props, drawerClose, closeAll, IsArbitrage) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, IsArbitrage });
};

// Component for wallet dashboard
class ArbitrageAdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componentName: '',
            open: false,
            menudetail: [],
            userTradeCounts: [],
            marginTradingBit: props.marginTradingBit,
            IsArbitrage: 1
        }

    }
    //fetch details before render
    componentWillMount() {
        this.props.getMenuPermissionByID('ED741203-0D00-08EB-A136-77D0133A0F55'); // get Arbitrage menu permission
    }
    // call action after component render
    componentDidMount() {
        if (this.state.marginTradingBit === 1) {
            this.props.getUserTradeCount({ IsMargin: 1 });
        } else {
            this.props.getUserTradeCount({ IsArbitrage: 1 });
        }
    }

    fetchRecords = (e) => {
        e.stopPropagation();
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
            this.props.getConfigurationCount({ IsMargin: 1 });
        } else {
            this.props.getConfigurationCount({});
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.userTradeCounts.TotalCount != 'undefined' && nextProps.userTradeCounts.TotalCount != "") {
            this.setState({
                userTradeCount: nextProps.userTradeCounts.TotalCount
            })
        }
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode')) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                setTimeout(() => {
                    window.location.href = AppConfig.afterLoginRedirect;
                }, 2000);
            }

        }
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({
                open: false,
                componentName: ''
            })
        }
    }
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
        });
    }
    /* drawe close */
    closeDrawer = () => {
        this.setState({
            open: false,
            componentName: ''
        });
    }
    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
            })
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }
    closeAll = () => {
        this.setState({
            open: false,
            componentName: ''
        });
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
        const { userTradeCount } = this.state;

        return (
            <React.Fragment>
                {this.props.menuLoading && <JbsSectionLoader />}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('FAD08B8B-1DE9-38AA-4EF8-73C135432B59') && //FAD08B8B-1DE9-38AA-4EF8-73C135432B59
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ArbitrageProviderWallet', (this.checkAndGetMenuAccessDetail('FAD08B8B-1DE9-38AA-4EF8-73C135432B59')).HasChild)} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="arbitrage.Providerwallets" />}
                                    icon="zmdi zmdi-balance-wallet"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* {this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381') && //3B9E778F-28E0-98F1-52FE-DAD191245381 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        {/* {this.props.walletSummary.loading ? */}
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ArbitrageAllowOrderType', true)} className="text-dark col-sm-full">
                            {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', (this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381')).HasChild)} className="text-dark col-sm-full"> */}
                            <SimpleCard
                                title={<IntlMessages id="sidebar.allowOrderType" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                            />
                        </a>
                        {/* } */}
                    </div>
                    {/* } */}
                    {/* {this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381') && //3B9E778F-28E0-98F1-52FE-DAD191245381 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        {/* {this.props.walletSummary.loading ? */}
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ServiceProvider', true)} className="text-dark col-sm-full">
                            {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', (this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381')).HasChild)} className="text-dark col-sm-full"> */}
                            <SimpleCard
                                title={<IntlMessages id="sidebar.ServiceProvider" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                            />
                        </a>
                        {/* } */}
                    </div>
                    {/* } */}
                    {/* {this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381') && //3B9E778F-28E0-98F1-52FE-DAD191245381 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        {/* {this.props.walletSummary.loading ? */}
                        <a href="javascript:void(0)" onClick={(e) => this.showComponent('ServiceProviderConfiguration', true)} className="text-dark col-sm-full">
                            {/* <a href="javascript:void(0)" onClick={(e) => this.showComponent('WalletList', (this.checkAndGetMenuAccessDetail('3B9E778F-28E0-98F1-52FE-DAD191245381')).HasChild)} className="text-dark col-sm-full"> */}
                            <SimpleCard
                                title={<IntlMessages id="liquidityprovider.list.option.label.serviceconfig" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                            />
                        </a>
                        {/* } */}
                    </div>
                    {/* } */}
                </div>
                {/* added by vishva */}
                {(this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41') || //54AD1E79-5048-2806-4217-907785089B41
                    this.checkAndGetMenuAccessDetail('17C23F1F-A5D3-8A83-4AEB-9BD13B3F7A88')) &&//17C23F1F-A5D3-8A83-4AEB-9BD13B3F7A88
                    // this.checkAndGetMenuAccessDetail('')) &&//
                    < div className="row">
                        <div className="col-sm-12">
                            <h3 className="text-uppercase"><IntlMessages id="sidebar.reports" /></h3>
                        </div>
                    </div>
                }
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41') && //54AD1E79-5048-2806-4217-907785089B41
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("ExchangeBalance", (this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="walletDashboard.exchangebalance" />}
                                    icon="zmdi zmdi-chart"
                                    bgClass="bg-dark"
                                />
                            </a>

                        </div>

                    }
                    {/* added by parth andhariya 11-06-2019 */}
                    {/* {this.checkAndGetMenuAccessDetail('') && // */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a
                            href="javascript:void(0)"
                            // onClick={e => this.showComponent("Conflict History", (this.checkAndGetMenuAccessDetail('')).HasChild)}  
                            onClick={e => this.showComponent("ConflictHistory", true)}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="lable.ConflictHistory" />}
                                icon="zmdi zmdi-chart"
                                bgClass="bg-dark"
                            />
                        </a>
                    </div>
                    {/* } */}
                    {/* added by parth andhariya 17-06-2019 */}
                    {this.checkAndGetMenuAccessDetail('17C23F1F-A5D3-8A83-4AEB-9BD13B3F7A88') && //17C23F1F-A5D3-8A83-4AEB-9BD13B3F7A88
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("ProviderLedger", (this.checkAndGetMenuAccessDetail('17C23F1F-A5D3-8A83-4AEB-9BD13B3F7A88')).HasChild)}
                                // onClick={e => this.showComponent("ProviderLedger", true)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="lable.ProviderLedger" />}
                                    icon="zmdi zmdi-chart"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                </div>
                {(
                    // this.checkAndGetMenuAccessDetail('96865BE7-6FF3-9585-30FF-4C7810883DBF') || //96865BE7-6FF3-9585-30FF-4C7810883DBF
                    // this.checkAndGetMenuAccessDetail('9954F3A7-18BF-570E-486F-33CBFAF64796') || //9954F3A7-18BF-570E-486F-33CBFAF64796
                    this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987') || //DB0F1779-16DA-41DB-9C51-746C84D47987
                    this.checkAndGetMenuAccessDetail('74055FA7-6CC8-8282-71F4-988E95340D12')) && //74055FA7-6CC8-8282-71F4-988E95340D12

                    <div className="row">
                        <div className="col-sm-12">
                            <h3 className="text-uppercase"><IntlMessages id="card.list.title.configuration" /></h3>
                        </div>
                    </div>
                }
                <div className="row">
                    {/* added by parth andhariya */}
                    {/* {this.checkAndGetMenuAccessDetail('9954F3A7-18BF-570E-486F-33CBFAF64796') && //9954F3A7-18BF-570E-486F-33CBFAF64796 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("MasterArbitrageCurrencyConfiguration", true)}
                            // onClick={e => this.showComponent("MasterArbitrageCurrencyConfiguration", (this.checkAndGetMenuAccessDetail('9954F3A7-18BF-570E-486F-33CBFAF64796')).HasChild)}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="lable.ArbitrageCurrencyConfiguration" />}
                                icon="fa fa-cogs"
                                bgClass="bg-dark"
                            />
                        </a>
                    </div>
                    {/* } */}
                    {/* {this.checkAndGetMenuAccessDetail('96865BE7-6FF3-9585-30FF-4C7810883DBF') && //96865BE7-6FF3-9585-30FF-4C7810883DBF */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a
                            href="javascript:void(0)"
                            // onClick={e => this.showComponent("MasterArbitrageFeeConfiguration", (this.checkAndGetMenuAccessDetail('96865BE7-6FF3-9585-30FF-4C7810883DBF')).HasChild)} 
                            onClick={e => this.showComponent("MasterArbitrageFeeConfiguration", true)}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="lable.ArbitrageFeeConfiguration" />}
                                icon="fa fa-cogs"
                                bgClass="bg-dark"
                            />
                        </a>
                    </div>
                    {/* } */}
                    {this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987') && //DB0F1779-16DA-41DB-9C51-746C84D47987
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("TopupHistory", (this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987')).HasChild)}
                                // onClick={e => this.showComponent("TopupHistory", true)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="lable.TopupHistory" />}
                                    icon="fa fa-cogs"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('74055FA7-6CC8-8282-71F4-988E95340D12') && //74055FA7-6CC8-8282-71F4-988E95340D12
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("ArbitrageAddress", (this.checkAndGetMenuAccessDetail('74055FA7-6CC8-8282-71F4-988E95340D12')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={<IntlMessages id="lable.ArbitrageAddress" />}
                                    icon="fa fa-cogs"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }{/* {this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987') && //DB0F1779-16DA-41DB-9C51-746C84D47987 */}
                    {/*added by jayshreeba gohil 12/06/2019 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a
                            href="javascript:void(0)"
                            // onClick={e => this.showComponent("TopupHistory", (this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987')).HasChild)} 
                            onClick={e => this.showComponent("ArbitrageExchangeConfiguration", true)}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="lable.ArbitrageExchangeConfiguration" />}
                                icon="zmdi zmdi-portable-wifi-changes"
                                bgClass="bg-dark"
                            />
                        </a>
                    </div>
                    {/* } */}
                    {/* {this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987') && //DB0F1779-16DA-41DB-9C51-746C84D47987 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a
                            href="javascript:void(0)"
                            // onClick={e => this.showComponent("TopupHistory", (this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987')).HasChild)} 
                            onClick={e => this.showComponent("ArbitragPairConfiguration", true)}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="lable.ArbitragePairConfiguration" />}
                                icon="zmdi zmdi-code-setting"
                                bgClass="bg-dark"
                            />
                        </a>
                    </div>
                    {/* } */}
                    {/* {this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987') && //DB0F1779-16DA-41DB-9C51-746C84D47987 */}
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <a
                            href="javascript:void(0)"
                            // onClick={e => this.showComponent("TopupHistory", (this.checkAndGetMenuAccessDetail('DB0F1779-16DA-41DB-9C51-746C84D47987')).HasChild)} 
                            onClick={e => this.showComponent("TradeRoute", true, { IsArbitrage: 1 })}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.tradeRoute" />}
                                icon="fa fa-map"
                                bgClass="bg-dark"
                            />
                        </a>
                    </div>
                    {/* } */}
                </div>
                <div>
                    {/* added by jayshreeba Gohil */}
                    <div className="row">
                        <div className="col-sm-12">
                            <h3 className="text-uppercase"><IntlMessages id="sidebar.ArbitragePortFolio" /></h3>
                        </div>
                    </div>
                    <div className="row">
                        {this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41') && //54AD1E79-5048-2806-4217-907785089B41
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => this.showComponent("OpenOrder", (this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41')).HasChild)}
                                    className="text-dark col-sm-full"
                                >
                                    <SimpleCard
                                        title={<IntlMessages id="sidebar.OpenOrder" />}
                                        icon="zmdi zmdi-chart"
                                        bgClass="bg-dark"
                                    />
                                </a>
                            </div>
                        }
                        {this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41') && //54AD1E79-5048-2806-4217-907785089B41
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => this.showComponent("Tradehistory", (this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41')).HasChild)}
                                    className="text-dark col-sm-full"
                                >
                                    <SimpleCard
                                        title={<IntlMessages id="sidebar.TradeHistory" />}
                                        icon="zmdi zmdi-chart"
                                        bgClass="bg-dark"
                                    />
                                </a>
                            </div>
                        }
                        {this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41') && //54AD1E79-5048-2806-4217-907785089B41
                            <div className="col-md-3 col-sm-6 col-xs-12">
                                <a
                                    href="javascript:void(0)"
                                    onClick={e => this.showComponent("UserTradeDashboard", (this.checkAndGetMenuAccessDetail('54AD1E79-5048-2806-4217-907785089B41')).HasChild)}
                                    className="text-dark col-sm-full"
                                >
                                    <CardType1
                                        title={<IntlMessages id="card.list.title.usertrade" />}
                                        count={userTradeCount}
                                        icon="fa fa-address-book"
                                    />
                                </a>
                            </div>
                        }

                    </div>
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    className="drawer1 half_drawer"
                    placement="right"
                    levelMove={100}
                    level={null}
                >
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.closeDrawer, this.closeAll, 1)}
                </Drawer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({ totalCount, drawerclose, authTokenRdcer, }) => {
    const { userTradeCounts } = totalCount;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { userTradeCounts, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    getMenuPermissionByID,
    getUserTradeCount,
    getConfigurationCount,
})(ArbitrageAdminDashboard);
