/// Component for trade Summary dashboard data by :tejas
// import react 
import React from 'react';
//import method for connect component
import { connect } from 'react-redux';

//import drawer component
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";

// import card for display details
import { CardType7 } from '../../DashboardCard/CardType7'

//import action for trade summary count
import { getTradeSummaryCount } from 'Actions/Trading';

// import components 
import MarketType from './TradeSummaryReport';
import LimitType from './TradeSummaryReport';
import StopLimitType from './TradeSummaryReport';
import SpotType from './TradeSummaryReport';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
// componenet listing
const components = {
    MarketType: MarketType,
    LimitType: LimitType,
    StopLimitType: StopLimitType,
    SpotType: SpotType
};


// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, state) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, state });
};

// class for trade summary dashboard
class TradeSummaryData extends React.Component {
    state = {
        open: false,
        defaultIndex: 0,
        orderType: '',
        componentName: '',
        name: "Today",
        title: "sidebar.trade-summary",
        reportTitle: "sidebar.trade-summary",
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date().toISOString().slice(0, 10),
        //added by parth andhariya
        marginTradingBit: this.props.marginTradingBit,
        menudetail: [],
        notificationFlag: true,
        Guid: ""
    }

    //function for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: ''
        })
    }

    // used for display and set component in state
    showComponent = (componentName, menudetail) => {
        // check permission go on next page or not
        if (menudetail.HasChild) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
                Guid: menudetail.GUID
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // used for close drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    fetchRecords = (e) => {
        e.stopPropagation();
        if (this.state.marginTradingBit === 1) {
            this.props.getTradeSummaryCount({ IsMargin: 1 });
        } else {
            this.props.getTradeSummaryCount({});
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.marginTradingBit === 1 ? '2437B089-980D-914F-68EB-28A015749BC7' : '06A85CAF-0CA8-28F0-1BBE-F0923F54046C'); // get Trading menu permission
    }
    //added by parth andhariya
    componentWillReceiveProps(nextProps) {
        /* update menu details if not set */
        if (!this.state.menudetail.length && nextProps.menu_rights.hasOwnProperty('ReturnCode') && this.state.notificationFlag) {
            if (nextProps.menu_rights.ReturnCode === 0) {
                this.setState({ menudetail: nextProps.menu_rights.Result.Modules });
            } else if (nextProps.menu_rights.ReturnCode !== 0) {
                this.setState({ notificationFlag: false });
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
        }
        this.setState({
            marginTradingBit: nextProps.marginTradingBit
        })
        if (nextProps.drawerclose.bit === 1 && nextProps.drawerclose.Drawersclose.open2 === false) {
            this.setState({
                open: false,
            })
        }
    }
    /* check menu permission */
    checkAndGetMenuAccessDetail(GUID) {
        var response = false;
        var index;
        const { menudetail } = this.state;
        if (menudetail) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }
    //render component
    render() {
        const { drawerClose, tradeSummaryCounts } = this.props;
        const { marginTradingBit } = this.state;
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
                title: marginTradingBit === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="sidebar.trade-summary" />,
                link: '',
                index: 1
            }
        ];

        return (
            <div className="drawer-data trading-dashboard-wrapper jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="sidebar.trade-summary" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '2F34DE45-77E8-2ACC-6DF2-E49DB2410B40' : 'AB797B9E-18C7-2570-073D-103D1ABF7EC9') && //AB797B9E-18C7-2570-073D-103D1ABF7EC9  && margin_GUID 2F34DE45-77E8-2ACC-6DF2-E49DB2410B40
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "MARKET", reportTitle: 'tradesummary.title.MARKET' }); this.showComponent('MarketType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '2F34DE45-77E8-2ACC-6DF2-E49DB2410B40' : 'AB797B9E-18C7-2570-073D-103D1ABF7EC9')) }} className="text-dark col-sm-full">
                                <CardType7
                                    title={<IntlMessages id="trading.admin.markets.tab.market" />}
                                    count={tradeSummaryCounts.MARKET ? tradeSummaryCounts.MARKET.TotMARKET : 0}
                                    icon="fa fa-university"
                                    TotalBuy={tradeSummaryCounts.MARKET ? tradeSummaryCounts.MARKET.MARKET_BUY : 0}
                                    TotalSell={tradeSummaryCounts.MARKET ? tradeSummaryCounts.MARKET.MARKET_SELL : 0}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '42080130-138D-0F50-7672-3EBE296317BF' : '4553E2F3-6293-4D61-1D9E-F1736756588F') && //4553E2F3-6293-4D61-1D9E-F1736756588F  && margin_GUID 42080130-138D-0F50-7672-3EBE296317BF
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "LIMIT", reportTitle: 'tradesummary.title.LIMIT' }); this.showComponent('LimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '42080130-138D-0F50-7672-3EBE296317BF' : '4553E2F3-6293-4D61-1D9E-F1736756588F')) }} className="text-dark col-sm-full">
                                <CardType7
                                    title={<IntlMessages id="trading.placeorder.buttonTab.limit" />}
                                    count={tradeSummaryCounts.LIMIT ? tradeSummaryCounts.LIMIT.TotLIMIT : 0}
                                    icon="fa fa-bandcamp"
                                    TotalBuy={tradeSummaryCounts.LIMIT ? tradeSummaryCounts.LIMIT.LIMIT_BUY : 0}
                                    TotalSell={tradeSummaryCounts.LIMIT ? tradeSummaryCounts.LIMIT.LIMIT_SELL : 0}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '8123C875-2E29-2C3C-7323-C577FEB681AE' : '65C52175-4BEA-48EC-1196-FBA3DBC976A4') && //65C52175-4BEA-48EC-1196-FBA3DBC976A4  && margin_GUID 8123C875-2E29-2C3C-7323-C577FEB681AE
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "STOP_Limit", reportTitle: 'tradesummary.title.STOP_Limit' }); this.showComponent('StopLimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '8123C875-2E29-2C3C-7323-C577FEB681AE' : '65C52175-4BEA-48EC-1196-FBA3DBC976A4')) }} className="text-dark col-sm-full">
                                <CardType7
                                    title={<IntlMessages id="trading.placeorder.buttonTab.stoplimit" />}
                                    count={tradeSummaryCounts.STOP_Limit ? tradeSummaryCounts.STOP_Limit.TotSTOP_Limit : 0}
                                    icon="fa fa-linode"
                                    TotalBuy={tradeSummaryCounts.STOP_Limit ? tradeSummaryCounts.STOP_Limit.STOP_Limit_BUY : 0}
                                    TotalSell={tradeSummaryCounts.STOP_Limit ? tradeSummaryCounts.STOP_Limit.STOP_Limit_SELL : 0}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '9B8A4044-64B4-4AB7-3E77-D2BF08385165' : 'B6E7575D-7146-330F-56CF-1A3E092F873C') && //B6E7575D-7146-330F-56CF-1A3E092F873C  && margin_GUID 9B8A4044-64B4-4AB7-3E77-D2BF08385165
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "SPOT", reportTitle: 'tradesummary.title.SPOT' }); this.showComponent('SpotType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '9B8A4044-64B4-4AB7-3E77-D2BF08385165' : 'B6E7575D-7146-330F-56CF-1A3E092F873C')) }} className="text-dark col-sm-full">
                                <CardType7
                                    title={<IntlMessages id="trade.summary.option.ordertype.spot" />}
                                    count={tradeSummaryCounts.SPOT ? tradeSummaryCounts.SPOT.TotSPOT : 0}
                                    icon="fa fa-cubes"
                                    TotalBuy={tradeSummaryCounts.SPOT ? tradeSummaryCounts.SPOT.SPOT_BUY : 0}
                                    TotalSell={tradeSummaryCounts.SPOT ? tradeSummaryCounts.SPOT.SPOT_SELL : 0}
                                />
                            </a>
                        </div>
                    }
                </div>

                <Drawer
                    width="100%"
                    handler={null}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className={null}
                    level={null}
                    placement="right"
                    levelMove={100}
                    getContainer={null}
                    showMask={false}
                >
                    {this.state.componentName !== '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll, this.state)}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ totalCount, drawerclose, authTokenRdcer }) => {
    const { tradeSummaryCounts } = totalCount;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { tradeSummaryCounts, drawerclose, menuLoading, menu_rights };
}

// export this component with action methods and props
export default connect(mapStateToProps, {
    getTradeSummaryCount,
    getMenuPermissionByID
})(TradeSummaryData);
