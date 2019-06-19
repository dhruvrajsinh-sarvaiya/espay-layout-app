// Component for yearly trade data by :tejas
// import react 
import React from 'react';

//import method for connect component
import { connect } from 'react-redux';

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";
import { NotificationManager } from "react-notifications";

// import component for row and column
import { Row, Col } from 'reactstrap';

//import drawer component
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

// import card for display details
import { CardType7 } from '../../DashboardCard/CardType7'

//import action for usermarket count
import { getUserMarketCount } from 'Actions/Trading';

// import components 
import MarketType from './UserTradeReport';
import LimitType from './UserTradeReport';
import StopLimitType from './UserTradeReport';
import SpotType from './UserTradeReport';
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
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

/// create component for yearly trade
class YearlyTrade extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            defaultIndex: 0,
            userMarketCount: [],
            name: "Year",
            componentName: '',
            title: "tradesummary.title.yeartrade",
            reportTitle: "tradesummary.title.yeartradereport",
            start_date: new Date(new Date().getFullYear(), 0, 2).toISOString().slice(0, 10), //new Date().toISOString().slice(0, 10),
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
                    title: <IntlMessages id="trading.admin.cards.lable.year" />,
                    link: '',
                    index: 2
                },
                {
                    title: <IntlMessages id="tradesummary.title.yeartrade" />,
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

    fetchRecords = (e) => {
        e.stopPropagation();
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
            this.props.getUserMarketCount({ Type: "Year", IsMargin: 1 })
        } else {
            this.props.getUserMarketCount({ Type: "Year" })
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

    // get dates for yearly data
    getYear() {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 0).toISOString().slice(0, 10);
        this.setState({
            start_date: firstDay
        });
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
        this.props.getMenuPermissionByID(this.props.marginTradingBit === 1 ? '0C47E0CE-5001-5DF4-1D1B-766281BB4300' : '107859D0-1D93-9AC9-4F18-34049A6F945B'); // get Trading menu permission
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
                    this.props.getUserMarketCount({ Type: "Year", IsMargin: 1 })
                } else {
                    this.props.getUserMarketCount({ Type: "Year" })
                }
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    // componentDidMount() {
    //     //added by parth andhariya
    //     if (this.state.marginTradingBit === 1) {
    //         this.props.getUserMarketCount({ Type: "Year", IsMargin: 1 })
    //     } else {
    //         this.props.getUserMarketCount({ Type: "Year" })
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

        const { drawerClose, userMarketCount, } = this.props;
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
                index: 1
            },
            {
                title: <IntlMessages id="card.list.title.usertrade" />,
                link: '',
                index: 1
            },
            {
                title: <IntlMessages id="trading.admin.cards.lable.year" />,
                link: '',
                index: 2
            }
        ];

        return (
            <div className="drawer-data trading-dashboard-wrapper jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="trading.admin.cards.lable.year" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '47CD2D1A-3689-6EA2-7C6A-38A34768536F' : '66F94118-5748-7553-703F-2FC64C649DD6') && //66F94118-5748-7553-703F-2FC64C649DD6  && margin_GUID 47CD2D1A-3689-6EA2-7C6A-38A34768536F
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "MARKET", reportTitle: 'tradesummary.title.MARKET' }); this.showComponent('MarketType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '47CD2D1A-3689-6EA2-7C6A-38A34768536F' : '66F94118-5748-7553-703F-2FC64C649DD6')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'C58E63B3-028E-30CF-1889-FAD3930A57FF' : 'C41DDC8A-0A20-2B88-5BE9-7F8FB71C436D') && //C41DDC8A-0A20-2B88-5BE9-7F8FB71C436D  && margin_GUID C58E63B3-028E-30CF-1889-FAD3930A57FF
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "LIMIT", reportTitle: 'tradesummary.title.LIMIT' }); this.showComponent('LimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'C58E63B3-028E-30CF-1889-FAD3930A57FF' : 'C41DDC8A-0A20-2B88-5BE9-7F8FB71C436D')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '438E8DEE-2A48-8032-29B5-436B4B7DA16B' : 'AFD56FD6-2579-5AEA-2897-A583EFFD4340') && //AFD56FD6-2579-5AEA-2897-A583EFFD4340  && margin_GUID 438E8DEE-2A48-8032-29B5-436B4B7DA16B
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "STOP_Limit", reportTitle: 'tradesummary.title.STOP_Limit' }); this.showComponent('StopLimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '438E8DEE-2A48-8032-29B5-436B4B7DA16B' : 'AFD56FD6-2579-5AEA-2897-A583EFFD4340')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'F38391B2-7290-3DD7-52EF-DA176D4E9CCE' : 'EB0E240B-6033-6D0A-243B-132376F929A3') && //EB0E240B-6033-6D0A-243B-132376F929A3  && margin_GUID F38391B2-7290-3DD7-52EF-DA176D4E9CCE
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "SPOT", reportTitle: 'tradesummary.title.SPOT' }); this.showComponent('SpotType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'F38391B2-7290-3DD7-52EF-DA176D4E9CCE' : 'EB0E240B-6033-6D0A-243B-132376F929A3')) }} className="text-dark col-sm-full">
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

// export this component with action methods and props
export default connect(mapStateToProps, {
    getUserMarketCount,
    getMenuPermissionByID
})(YearlyTrade);
