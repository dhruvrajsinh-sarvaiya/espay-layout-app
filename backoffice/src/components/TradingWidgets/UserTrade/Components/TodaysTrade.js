// Component for Todays trade data by :tejas
// import react 
import React from 'react';

// import component for row and column
import { Row, Col } from 'reactstrap';

//import drawer component
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

//import method for connect component
import { connect } from 'react-redux';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";

// import card for display details
import { CardType7 } from '../../DashboardCard/CardType7'
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

//import action for usermarket count
import { getUserMarketCount } from 'Actions/Trading';

// import components 
import MarketType from './UserTradeReport';
import LimitType from './UserTradeReport';
import StopLimitType from './UserTradeReport';
import SpotType from './UserTradeReport';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";
//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
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

/// create component for Todays trade
class TodaysTrade extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            defaultIndex: 0,
            userMarketCount: [],
            componentName: '',
            name: "Today",
            title: "tradesummary.title.todaytrade",
            reportTitle: "",
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            orderType: '',
            //BreadCrumbData
            BreadCrumbData: [
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
                    title: props.marginTradingBit === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
                    link: '',
                    index: 0
                },
                {
                    title: <IntlMessages id="card.list.title.usertrade" />,
                    link: '',
                    index: 1
                },
                {
                    title: <IntlMessages id="widgets.today" />,
                    link: '',
                    index: 2
                },
                {
                    title: <IntlMessages id="tradesummary.title.todaytrade" />,
                    link: '',
                    index: 3
                }
            ],
            //added by parth andhariya
            marginTradingBit: props.marginTradingBit,
            menudetail: [],
            notificationFlag: true,
            Guid: ""
        }
    }

    //function for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: ''
        })
    }

    // used for display and set component in state
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail.HasChild) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
                // menuDetail: menuDetail.ChildNodes[0],
                Guid: menuDetail.GUID
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

    changeDefault = (index) => {
        this.setState({
            defaultIndex: index
        });
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.marginTradingBit === 1 ? '7A549A53-9590-55EE-728A-1643A0F6972C' : '93251177-057B-3B8E-371C-BB9F3A075116'); // get Trading menu permission
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.userMarketCount) {
            this.setState({
                userMarketCount: nextprops.userMarketCount
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
                //added by parth andhariya
                if (this.state.marginTradingBit === 1) {
                    this.props.getUserMarketCount({ Type: "Today",IsMargin: 1 })
                }//added by jayshreeba Gohil (19/06/2019)
                else if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    this.props.getUserMarketCount({ Type: "Today", IsArbitrage:1})
                    } 
                else {
                    this.props.getUserMarketCount({ Type: "Today" })
                }
                 this.setState({ menudetail: nextprops.menu_rights.Result.Modules, notificationFlag: false });
             } else if (nextprops.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();

            }
            this.setState({ notificationFlag: false });
        }
    }

    fetchRecords = (e) => {
        e.stopPropagation();
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
            this.props.getUserMarketCount({ Type: "Today", IsMargin: 1 })
        } else {
            this.props.getUserMarketCount({ Type: "Today" })
        }
    }

    // componentDidMount() {
    //     //added by parth andhariya
    //     if (this.state.marginTradingBit === 1) {
    //         this.props.getUserMarketCount({ Type: "Today", IsMargin: 1 })
    //     } else {
    //         this.props.getUserMarketCount({ Type: "Today" })
    //     }
    // }
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
        const { drawerClose, userMarketCount } = this.props;
        const { marginTradingBit } = this.state;
        //added by jayshrreeba gohil for Arbitrage UserTrade BreadCrumbdata (19/06/2019)
        const data = this.props;
         if (data.IsArbitrage != undefined && data.IsArbitrage == 1) {

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
                title: <IntlMessages id="sidebar.ArbitragePortFolio"/>,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="widgets.today" />,
                link: '',
                index: 2
            }
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
                title: marginTradingBit === 1 ? <IntlMessages id="sidebar.marginTrading" /> : <IntlMessages id="sidebar.trading" />,
                link: '',
                index: 0
            },
            {
                title: <IntlMessages id="card.list.title.usertrade" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="widgets.today" />,
                link: '',
                index: 2
            }
    ]
     }

        
        return (
            <div className="drawer-data trading-dashboard-wrapper jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                
                {/* {added by jayshreeba gohil (19/06/2019)} */}
                {data.IsArbitrage != undefined && data.IsArbitrage==1 ?<WalletPageTitle  title={<IntlMessages id="sidebar.CoinConfigurationTitle"/>} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />:<WalletPageTitle  title={<IntlMessages id="widgets.today" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />}

                {/* <WalletPageTitle title={<IntlMessages id="widgets.today" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} /> */}
                <div className="row">
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'ADC3FE10-7BE0-3B3E-1721-F4A8E3F64C65' : '0307DE59-9541-9B20-7C38-496D255518D5') && //0307DE59-9541-9B20-7C38-496D255518D5  && margin_GUID ADC3FE10-7BE0-3B3E-1721-F4A8E3F64C65
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "MARKET", reportTitle: 'tradesummary.title.MARKET' }); this.showComponent('MarketType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'ADC3FE10-7BE0-3B3E-1721-F4A8E3F64C65' : '0307DE59-9541-9B20-7C38-496D255518D5')) }} className="text-dark col-sm-full">
                                <CardType7
                                    title={<IntlMessages id="trading.admin.markets.tab.market" />}
                                    count={userMarketCount.MARKET ? userMarketCount.MARKET.TotMARKET : 0}
                                    icon="fa fa-university"
                                    TotalBuy={userMarketCount.MARKET ? userMarketCount.MARKET.MARKET_BUY : 0}
                                    TotalSell={userMarketCount.MARKET ? userMarketCount.MARKET.MARKET_SELL : 0}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '4AAC6558-A715-3E2C-5013-E807262A37E2' : 'B86159E1-3FAB-048C-7546-67D208D76B57') && //B86159E1-3FAB-048C-7546-67D208D76B57  && margin_GUID 4AAC6558-A715-3E2C-5013-E807262A37E2
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "LIMIT", reportTitle: 'tradesummary.title.LIMIT' }); this.showComponent('LimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '4AAC6558-A715-3E2C-5013-E807262A37E2' : 'B86159E1-3FAB-048C-7546-67D208D76B57')) }} className="text-dark col-sm-full">
                                <CardType7
                                    title={<IntlMessages id="trading.placeorder.buttonTab.limit" />}
                                    count={userMarketCount.LIMIT ? userMarketCount.LIMIT.TotLIMIT : 0}
                                    icon="fa fa-bandcamp"
                                    TotalBuy={userMarketCount.LIMIT ? userMarketCount.LIMIT.LIMIT_BUY : 0}
                                    TotalSell={userMarketCount.LIMIT ? userMarketCount.LIMIT.LIMIT_SELL : 0}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '94BFA5CF-3636-4DAD-140D-FE1244B08627' : '1BDA8B61-5CC0-1350-A4E9-6A05685101B3') && //1BDA8B61-5CC0-1350-A4E9-6A05685101B3  && margin_GUID 94BFA5CF-3636-4DAD-140D-FE1244B08627
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "STOP_Limit", reportTitle: 'tradesummary.title.STOP_Limit' }); this.showComponent('StopLimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '94BFA5CF-3636-4DAD-140D-FE1244B08627' : '1BDA8B61-5CC0-1350-A4E9-6A05685101B3')) }} className="text-dark col-sm-full">
                                <CardType7
                                    title={<IntlMessages id="trading.placeorder.buttonTab.stoplimit" />}
                                    count={userMarketCount.STOP_Limit ? userMarketCount.STOP_Limit.TotSTOP_Limit : 0}
                                    icon="fa fa-linode"
                                    TotalBuy={userMarketCount.STOP_Limit ? userMarketCount.STOP_Limit.STOP_Limit_BUY : 0}
                                    TotalSell={userMarketCount.STOP_Limit ? userMarketCount.STOP_Limit.STOP_Limit_SELL : 0}
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '21131BC1-39E1-11A7-2E79-552FEEDE8B36' : '06AB8080-78B9-9E0E-1F66-FC4B459A02A3') && //06AB8080-78B9-9E0E-1F66-FC4B459A02A3  && margin_GUID 21131BC1-39E1-11A7-2E79-552FEEDE8B36
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "SPOT", reportTitle: 'tradesummary.title.SPOT' }); this.showComponent('SpotType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '21131BC1-39E1-11A7-2E79-552FEEDE8B36' : '06AB8080-78B9-9E0E-1F66-FC4B459A02A3')) }} className="text-dark col-sm-full">
                                <CardType7
                                    title={<IntlMessages id="trade.summary.option.ordertype.spot" />}
                                    count={userMarketCount.SPOT ? userMarketCount.SPOT.TotSPOT : 0}
                                    icon="fa fa-cubes"
                                    TotalBuy={userMarketCount.SPOT ? userMarketCount.SPOT.SPOT_BUY : 0}
                                    TotalSell={userMarketCount.SPOT ? userMarketCount.SPOT.SPOT_SELL : 0}
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
    const { userMarketCount } = totalCount;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { userMarketCount, drawerclose, menuLoading, menu_rights };
}

// export this component with action methods and props
export default connect(mapStateToProps, {
    getUserMarketCount,
    getMenuPermissionByID
})(TodaysTrade);
