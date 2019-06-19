// Component for yearly trade data by :tejas
// import react 
import React from 'react';

//import method for connect component
import { connect } from 'react-redux';

// import component for row and column
import { Row, Col } from 'reactstrap';

//import drawer component
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

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

/// create component for Monthly trade
class MonthlyTrade extends React.Component {
    constructor(props) {
        super(props)
        // define default state
        this.state = {
            open: false,
            defaultIndex: 0,
            userMarketCount: [],
            name: "Month",
            title: "tradesummary.title.monthtrade",
            reportTitle: "tradesummary.title.monthtradereport",
            start_date: null, //,new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            componentName: '',
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
                    title: <IntlMessages id="trading.admin.cards.lable.month" />,
                    link: '',
                    index: 2
                },
                {
                    title: <IntlMessages id="tradesummary.title.monthtrade" />,
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

    // get dates for Monthly data
    getMonth() {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2).toISOString().slice(0, 10);

        this.setState({
            start_date: firstDay
        });
    }

    // on click of refresh call api for get count
    fetchRecords = (e) => {
        e.stopPropagation();
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
            this.props.getUserMarketCount({ Type: "Month", IsMargin: 1 })
        } else {
            this.props.getUserMarketCount({ Type: "Month" })
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
                // menudetail: menuDetail.ChildNodes[0],
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
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.marginTradingBit === 1 ? '799C3D99-A644-0923-6E83-E8933C8A835A' : '10ABD8AD-6045-24F0-8786-3ACF31E151F3'); // get Trading menu permission
    }
    // invoke when component is about to get props
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
                this.getMonth()
                //added by parth andhariya
                if (this.state.marginTradingBit === 1) {
                    this.props.getUserMarketCount({ Type: "Month", IsMargin: 1 })
                } else {
                    this.props.getUserMarketCount({ Type: "Month" })
                }
                this.setState({ menudetail: nextprops.menu_rights.Result.Modules });
            } else if (nextprops.menu_rights.ReturnCode !== 0) {
                NotificationManager.error(<IntlMessages id={"error.permission"} />);
                this.props.drawerClose();
            }
            this.setState({ notificationFlag: false });
        }
    }

    // // invoke after render
    // componentDidMount() {
    //     this.getMonth()
    //     //added by parth andhariya
    //     if (this.state.marginTradingBit === 1) {
    //         this.props.getUserMarketCount({ Type: "Month", IsMargin: 1 })
    //     } else {
    //         this.props.getUserMarketCount({ Type: "Month" })
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
    // render the component
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
                title: <IntlMessages id="trading.admin.cards.lable.month" />,
                link: '',
                index: 2
            }
        ];

        // return the component
        return (
            <div className="drawer-data trading-dashboard-wrapper jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="trading.admin.cards.lable.month" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'A73A5E71-5A00-8213-1D26-DC2118F50F84' : 'E2FB80F1-0D6C-61DC-8182-9E9A1234629D') && //E2FB80F1-0D6C-61DC-8182-9E9A1234629D  && margin_GUID A73A5E71-5A00-8213-1D26-DC2118F50F84
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "MARKET", reportTitle: 'tradesummary.title.MARKET' }); this.showComponent('MarketType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'A73A5E71-5A00-8213-1D26-DC2118F50F84' : 'E2FB80F1-0D6C-61DC-8182-9E9A1234629D')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'BD7C7694-7B6F-A3AD-2A81-8DCA4FF02AED' : '85754218-025D-8ABB-0B93-2C7AFE7D8B99') && //85754218-025D-8ABB-0B93-2C7AFE7D8B99  && margin_GUID BD7C7694-7B6F-A3AD-2A81-8DCA4FF02AED
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "LIMIT", reportTitle: 'tradesummary.title.LIMIT' }); this.showComponent('LimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'BD7C7694-7B6F-A3AD-2A81-8DCA4FF02AED' : '85754218-025D-8ABB-0B93-2C7AFE7D8B99')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'D10C73E2-4307-81A8-6FBB-BEF57F900E47' : '98D05763-313F-87A3-8737-EA73F0511012') && //98D05763-313F-87A3-8737-EA73F0511012  && margin_GUID D10C73E2-4307-81A8-6FBB-BEF57F900E47
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "STOP_Limit", reportTitle: 'tradesummary.title.STOP_Limit' }); this.showComponent('StopLimitType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'D10C73E2-4307-81A8-6FBB-BEF57F900E47' : '98D05763-313F-87A3-8737-EA73F0511012')) }} className="text-dark col-sm-full">
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
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'F22E1B7B-701C-6483-1481-CEF239950A03' : '06A15A00-558F-3A26-16B9-F2FCDF1E3CB0') && //06A15A00-558F-3A26-16B9-F2FCDF1E3CB0  && margin_GUID F22E1B7B-701C-6483-1481-CEF239950A03
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => { this.setState({ orderType: "SPOT", reportTitle: 'tradesummary.title.SPOT' }); this.showComponent('SpotType', this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? 'F22E1B7B-701C-6483-1481-CEF239950A03' : '06A15A00-558F-3A26-16B9-F2FCDF1E3CB0')) }} className="text-dark col-sm-full">
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
})(MonthlyTrade);

