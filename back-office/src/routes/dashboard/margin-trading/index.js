/* 
    Developer : Nishant Vadgama
    File Comment : Margin Trading main index
    Date : 12-09-2019
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import LeverageRequests from "Components/MarginTrading/LeverageRequests/LeverageRequests";
import LeverageReport from "Components/MarginTrading/LeverageReport/LeverageReport";
import ListLeverage from "Components/MarginTrading/LeverageConfiguration/ListLeverage";
import WalletLedgerReport from 'Components/MarginTrading/WalletLedgerReport/WalletLedgerReport';
import MarginTradingReport from 'Components/MarginTrading/MarginTradingReport/MarginTradingReport';
import ProfitLossReport from 'Components/MarginTrading/ProfitLossReport/ProfitLossReport';
import { injectIntl } from 'react-intl';
import { SimpleCard } from 'Components/Wallet/DashboardWidgets';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import IntlMessages from "Util/IntlMessages";
//added by parth andhariya
import { NotificationManager } from "react-notifications";
import AppConfig from 'Constants/AppConfig';
// import dashboard
import {
    UserTrade,
    TradeSummary,
    TradingChart,
    Markets,
    ActiveUserTrade,
    TradeSummaryData,
    Configuration,
    ReportsData,
    ConfiguratioData,
    GainersList,
    LoserList
} from 'Components/TradingWidgets';
import { Row } from 'reactstrap';
import OpenPositionReport from 'Components/MarginTrading/OpenPositionReport/OpenPositionReport';  //added by parth andhariya 23-04-2019
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// componenet listing...
const components = {
    LeverageRequests: LeverageRequests,
    LeverageReport: LeverageReport,
    ListLeverage: ListLeverage,
    WalletLedgerReport: WalletLedgerReport,
    MarginTradingReport: MarginTradingReport,
    //added by parth andhariya
    userTradeData: ActiveUserTrade,
    TradeSummaryData: TradeSummaryData,
    ReportsData: ReportsData,
    ConfiguratioData: ConfiguratioData,
    GainersList: GainersList,
    LoserList: LoserList,
    ProfitLossReport: ProfitLossReport,
    OpenPositionReport: OpenPositionReport  //added by parth andhariya 23-04-2019

};
// dynamic component binding...
const dynamicComponent = (TagName, props, drawerClose, closeAll, marginTradingBit, ConfigurationShowCard) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, marginTradingBit, ConfigurationShowCard });
};
const initState = {
    open: false,
    componentName: '',
    tradeSummaryCounts: [],
    configurationsCounts: [],
    userTradeCounts: [],
    //added by parth andhariya
    marginTradingBit: 1,
    ConfigurationShowCard: 1,
    menudetail: []
}
// Component for wallet dashboard
class MarginTrading extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    //fetch details before render
    componentWillMount() {
        this.props.getMenuPermissionByID('1B6C71F0-9D76-396D-25E6-6187D0F30F0A'); // get Trading menu permission
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open1 === false) {
            this.setState({
                open: false,
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
    }
    // toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: ''
        });
    }
    // close all drawers
    closeAll = () => {
        this.setState({
            open: false,
        });
    }
    // show dynamic component name 
    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
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
        const intl = this.props.intl;
        const { match } = this.props;
        return (
            <div className="wallet-dashboard-wrapper">
                {this.props.menuLoading && <JbsSectionLoader />}
                <PageTitleBar
                    title={intl.formatMessage({ id: "sidebar.marginTrading" })}
                    match={match}
                />
                {/* added by parth andhariya */}
                <Row>
                    {this.checkAndGetMenuAccessDetail('E341B106-6F7E-0FF3-50E5-B277EF9E79DB') && //margin E341B106-6F7E-0FF3-50E5-B277EF9E79DB
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('userTradeData', (this.checkAndGetMenuAccessDetail('E341B106-6F7E-0FF3-50E5-B277EF9E79DB')).HasChild)} className="text-dark col-sm-full">
                                <UserTrade clickEvent={this.toggleDrawer} marginTradingBit={this.state.marginTradingBit} />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('2437B089-980D-914F-68EB-28A015749BC7') && //margin 2437B089-980D-914F-68EB-28A015749BC7
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('TradeSummaryData', (this.checkAndGetMenuAccessDetail('2437B089-980D-914F-68EB-28A015749BC7')).HasChild)} className="text-dark col-sm-full">
                                <TradeSummary clickEvent={this.toggleDrawer} marginTradingBit={this.state.marginTradingBit} />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('D9FC3AB9-50DB-2CF6-26DA-1BAC6E3F8F2B') && //margin D9FC3AB9-50DB-2CF6-26DA-1BAC6E3F8F2B
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ConfiguratioData', (this.checkAndGetMenuAccessDetail('D9FC3AB9-50DB-2CF6-26DA-1BAC6E3F8F2B')).HasChild)} className="text-dark col-sm-full">
                                <Configuration clickEvent={this.toggleDrawer} marginTradingBit={this.state.marginTradingBit} />
                            </a>
                        </div>
                    }
                </Row>
                {this.checkAndGetMenuAccessDetail('6F0727F0-018B-4538-5A23-75233161814C') && //margin 6F0727F0-018B-4538-5A23-75233161814C
                    <div className="mb-30">
                        <TradingChart marginTradingBit={this.state.marginTradingBit} />
                    </div>
                }
                {this.checkAndGetMenuAccessDetail('96DC751A-2C99-8709-0191-1DAC017264B8') && //margin 96DC751A-2C99-8709-0191-1DAC017264B8
                    <div className="row">
                        <div className="mb-30 col-md-12">
                            <Markets marginTradingBit={this.state.marginTradingBit} />
                        </div>
                    </div>
                }
                <div className="row">
                    {this.checkAndGetMenuAccessDetail('2A6715B8-6FB9-1FDF-9822-60BD999B2244') && //margin 2A6715B8-6FB9-1FDF-9822-60BD999B2244
                        <div className="col-md-6 col-sm-12 col-xs-12">
                            <GainersList marginTradingBit={this.state.marginTradingBit} topGainerLoser={true} />
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('C3BE46EF-05DC-4B51-6CC5-5CEC9CB23EE1') && //margin C3BE46EF-05DC-4B51-6CC5-5CEC9CB23EE1
                        <div className="col-md-6 col-sm-12 col-xs-12">
                            <LoserList marginTradingBit={this.state.marginTradingBit} topGainerLoser={false} />
                        </div>
                    }
                </div>

                <div className="row">
                    {this.checkAndGetMenuAccessDetail('F3066628-955E-5D83-1CE7-0300152C5817') && //margin F3066628-955E-5D83-1CE7-0300152C5817
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("LeverageRequests", (this.checkAndGetMenuAccessDetail('F3066628-955E-5D83-1CE7-0300152C5817')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={intl.formatMessage({ id: "margintrading.leverageRequests" })}
                                    icon="zmdi zmdi-notifications-add"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('741CB0F3-8504-6C9B-0C3D-B7DF28070312') && //margin 741CB0F3-8504-6C9B-0C3D-B7DF28070312
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("LeverageReport", (this.checkAndGetMenuAccessDetail('741CB0F3-8504-6C9B-0C3D-B7DF28070312')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={intl.formatMessage({ id: "wallet.LeverageReport" })}
                                    icon="zmdi zmdi-chart"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('3A1F18E1-8613-647C-3BE2-F24DC9870A27') && //margin 3A1F18E1-8613-647C-3BE2-F24DC9870A27
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("ListLeverage", (this.checkAndGetMenuAccessDetail('3A1F18E1-8613-647C-3BE2-F24DC9870A27')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={intl.formatMessage({ id: "wallet.LeverageConfiguration" })}
                                    icon="zmdi zmdi-settings-square"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* added by parth andhariya */}
                    {this.checkAndGetMenuAccessDetail('F71A7A53-1BD2-155A-8B4C-5CB70F916931') && //margin F71A7A53-1BD2-155A-8B4C-5CB70F916931
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("WalletLedgerReport", (this.checkAndGetMenuAccessDetail('F71A7A53-1BD2-155A-8B4C-5CB70F916931')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={intl.formatMessage({ id: "wallet.WalletLedgerReport" })}
                                    icon="zmdi zmdi-assignment"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail('DCB2260C-2612-0D3D-987A-5BFEFEFC2958') && //margin DCB2260C-2612-0D3D-987A-5BFEFEFC2958
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("MarginTradingReport", (this.checkAndGetMenuAccessDetail('DCB2260C-2612-0D3D-987A-5BFEFEFC2958')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={intl.formatMessage({ id: "wallet.MarginTradingReport" })}
                                    icon="zmdi zmdi-assignment"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* added by vishva */}
                    {this.checkAndGetMenuAccessDetail('A76CD0BE-07F0-1B14-7381-679DB33253A3') && //margin A76CD0BE-07F0-1B14-7381-679DB33253A3
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("ProfitLossReport", (this.checkAndGetMenuAccessDetail('A76CD0BE-07F0-1B14-7381-679DB33253A3')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={intl.formatMessage({ id: "wallet.ProfitLossReport" })}
                                    icon="zmdi zmdi-assignment"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                    {/* added by parth andhariya  23-04-2019 */}
                    {this.checkAndGetMenuAccessDetail('4BF9E8B0-7537-1A4A-05AC-7DD2FB8D695D') && //margin 4BF9E8B0-7537-1A4A-05AC-7DD2FB8D695D
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a
                                href="javascript:void(0)"
                                onClick={e => this.showComponent("OpenPositionReport", (this.checkAndGetMenuAccessDetail('4BF9E8B0-7537-1A4A-05AC-7DD2FB8D695D')).HasChild)}
                                className="text-dark col-sm-full"
                            >
                                <SimpleCard
                                    title={intl.formatMessage({ id: "wallet.OpenPositionReport" })}
                                    icon="zmdi zmdi-assignment"
                                    bgClass="bg-dark"
                                />
                            </a>
                        </div>
                    }
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer1"
                    placement="right"
                    level={null}
                >
                    {/* added by parth andhariya */}
                    {this.state.componentName != '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll, this.state.marginTradingBit, this.state.ConfigurationShowCard)}
                </Drawer>
            </div>
        );
    }
}

const mapDispatchToProps = ({ drawerclose, authTokenRdcer }) => {
    // breadcrumb 
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    return { drawerclose, menuLoading, menu_rights };
};

export default connect(mapDispatchToProps, { getMenuPermissionByID })(injectIntl(MarginTrading));

