// component for display weekly trade 
// import react
import React from 'react';

//import method for connect component
import { connect } from 'react-redux';
import { NotificationManager } from "react-notifications";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

//import drawer component
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

//card for display details of wekly trade
import { CardType7 } from '../../DashboardCard/CardType7'
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';

//import action for usermarket count
import { getUserMarketCount } from 'Actions/Trading';

// import components 
import MarketType from './UserTradeReport';
import LimitType from './UserTradeReport';
import StopLimitType from './UserTradeReport';
import SpotType from './UserTradeReport';
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

/// create component for WeeklyTrade
class WeeklyTrade extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            defaultIndex: 0,
            userMarketCount: [],
            componentName: '',
            name: "Week",
            title: "tradesummary.title.weektrade",
            reportTitle: "tradesummary.title.weektradereport",
            start_date: null, //new Date(),
            end_date: new Date().toISOString().slice(0, 10),
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
                    title: <IntlMessages id="widgets.thisWeek" />,
                    link: '',
                    index: 2
                },
                {
                    title: <IntlMessages id="tradesummary.title.weektrade" />,
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
    // get dates for weekly data
    getDate() {
        var date = new Date();
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        var start_date = new Date(date.setDate(diff)).toISOString().slice(0, 10)
        this.setState({
            start_date: start_date
        });
    }

    //function for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: this.state.open ? false : true,
            componentName: ''
        })
    }

    // used for display and set component in state
    showComponent = (componentName, menuDetail) => {
        // check permission go on next page or not
        if (menuDetail.HasChild) {
            this.setState({
                componentName: componentName,
                open: this.state.open ? false : true,
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
        this.props.getMenuPermissionByID(this.props.marginTradingBit === 1 ? 'E96B8FAC-2BCB-1539-7B61-C37B6AB08E52' : 'E90A0C4E-A4EA-8EA4-6846-622DE87C0B42'); // get Trading menu permission
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
                this.getDate();
                //added by parth andhariya
                if (this.state.marginTradingBit === 1) {
                    this.props.getUserMarketCount({ Type: "Week", IsMargin: 1 })
                } else {
                    this.props.getUserMarketCount({ Type: "Week" })
                }
                // //code change by jayshreeba gohil (18-6-2019) for handle Coin arbitrage configuration detail
                var reqObject = {};
                if (this.props.IsArbitrage !== undefined && this.props.IsArbitrage) {
                    reqObject.IsArbitrage = this.props.IsArbitrage;
                }
                this.props.getUserMarketCount(reqObject);
                // //end
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
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
            this.props.getUserMarketCount({ Type: "Week", IsMargin: 1 })
        } else {
            this.props.getUserMarketCount({ Type: "Week" })
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
        const { drawerClose, userMarketCount } = this.props;
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
                title: <IntlMessages id="card.list.title.usertrade" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="widgets.thisWeek" />,
                link: '',
                index: 2
            }
        ];

        return (
            <div className="drawer-data trading-dashboard-wrapper jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="widgets.thisWeek" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '6FD8F734-9A58-7320-09D2-F9D95E439505' : '5CA221B0-9531-2DA3-95E3-02D08B024906') && //5CA221B0-9531-2DA3-95E3-02D08B024906  && margin_GUID 6FD8F734-9A58-7320-09D2-F9D95E439505
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "MARKET", reportTitle: 'tradesummary.title.MARKET' }); this.showComponent('MarketType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '6FD8F734-9A58-7320-09D2-F9D95E439505' : '5CA221B0-9531-2DA3-95E3-02D08B024906')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '9C773DD6-2880-8736-4249-236937D67B6A' : 'EC35ED60-9495-8228-1697-512F204D7643') && //EC35ED60-9495-8228-1697-512F204D7643  && margin_GUID 9C773DD6-2880-8736-4249-236937D67B6A
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "LIMIT", reportTitle: 'tradesummary.title.LIMIT' }); this.showComponent('LimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '9C773DD6-2880-8736-4249-236937D67B6A' : 'EC35ED60-9495-8228-1697-512F204D7643')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'B00B9D95-777B-1DC7-495C-B492AC3285AF' : '437A7069-80F6-6CEB-3287-F89912BC1C30') && //437A7069-80F6-6CEB-3287-F89912BC1C30  && margin_GUID B00B9D95-777B-1DC7-495C-B492AC3285AF
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "STOP_Limit", reportTitle: 'tradesummary.title.STOP_Limit' }); this.showComponent('StopLimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'B00B9D95-777B-1DC7-495C-B492AC3285AF' : '437A7069-80F6-6CEB-3287-F89912BC1C30')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'A18142DB-9CA3-7CB3-7F05-C4CCB5B535B8' : '7E67C7BC-A584-25FC-9378-EDC84CB76386') && //7E67C7BC-A584-25FC-9378-EDC84CB76386  && margin_GUID A18142DB-9CA3-7CB3-7F05-C4CCB5B535B8
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "SPOT", reportTitle: 'tradesummary.title.SPOT' }); this.showComponent('SpotType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'A18142DB-9CA3-7CB3-7F05-C4CCB5B535B8' : '7E67C7BC-A584-25FC-9378-EDC84CB76386')) }} className="text-dark col-sm-full">
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
    const { menuLoading, menu_rights } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { userMarketCount, drawerclose, menuLoading, menu_rights };
}

export default connect(mapStateToProps, {
    getUserMarketCount,
    getMenuPermissionByID
})(WeeklyTrade);
