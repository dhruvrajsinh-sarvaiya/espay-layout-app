// component for display configuration dashboard By Tejas 
import React from 'react';
// used for connect component to store
import { connect } from 'react-redux';
// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";
import { Row, Col } from 'reactstrap';
// import drawer 
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { NotificationManager } from "react-notifications";

// import card for dashbaord 
import { CardType1 } from '../../DashboardCard/CardType1'
// get configuration count method
import { getConfigurationCount } from 'Actions/Trading';
// import components
import ApiConfiguration from './ApiConfiguration'
import CoinConfiguration from './CoinConfiguration';
import PairConfiguration from "./pair-configuration";
import ExchangeFeedLimitConfig from './FeedLimitConfiguration/FeedLimitList';
import ExchangeFeesConfig from './Exchange-Feed-Configuration';
import DaemonConfig from "./Daemon-Configure";
import ProviderConfig from "./ProviderConfiguration/ProviderConfigurationList";
import ManageMarket from "./ManageMarkets/ManageMarketList";
import LiquidityApiManager from "./Liquidity-API-Manager/components/LiquidityApiManagerList"
import TradeRoute from "./trade-route/TradeRouteList";
import MarketCap from "./MarketCap";
import ThirdPartyAPIRequest from "./ApiRequest/ApiRequestList";
import ThirdPartyAPIResponse from "./ApiResponse/ApiResponseList";
import SiteToken from "./SiteToken";
import ServiceProvider from "./ServiceProvider";
import WalletPageTitle from 'Components/PageTitleBar/WalletPageTitle';
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
import MarketMakingList from "../../MarketMakingList"; //Added by Palak Gajjar 04.06.2019 for MarketMakingList
import { SimpleCard } from 'Components/Wallet/DashboardWidgets'; //Added by Palak Gajjar 04.06.2019 for MarketMakingList

//Action methods..
import {
    getMenuPermissionByID
} from 'Actions/MyAccount';
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

// componenet listing
const components = {
    ApiConfiguration: ApiConfiguration,
    CoinConfiguration: CoinConfiguration,
    PairConfiguration: PairConfiguration,
    ExchangeFeesConfig: ExchangeFeesConfig,
    DaemonConfig: DaemonConfig,
    ProviderConfig: ProviderConfig,
    ManageMarket: ManageMarket,
    LiquidityApiManager: LiquidityApiManager,
    TradeRoute: TradeRoute,
    MarketCap: MarketCap,
    ThirdPartyAPIRequest: ThirdPartyAPIRequest,
    ThirdPartyAPIResponse: ThirdPartyAPIResponse,
    SiteToken: SiteToken,
    ExchangeFeedLimitConfig: ExchangeFeedLimitConfig,
    ServiceProvider: ServiceProvider,
    MarketMakingList: MarketMakingList,//palak 04.06.2019
};

//added by parth andhariya
// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll, ConfigurationShowCard) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll, ConfigurationShowCard });
};

// class for configuration dashboard
class ConfigurationData extends React.Component {
    //define state
    state = {
        open: false,
        defaultIndex: 0,
        componentName: '',
        //added by parth andhariya
        ConfigurationShowCard: this.props.ConfigurationShowCard,
        marginTradingBit: this.props.marginTradingBit,
        menudetail: [],
        notificationFlag: true
    }

    // used for toggle drawer
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
            componentName: ''
        })
    }

    // used for set component name dynamically
    showComponent = (componentName, permission) => {
        // check permission go on next page or not
        if (permission) {
            this.setState({
                componentName: componentName,
                open: !this.state.open,
            });
        } else {
            NotificationManager.error(<IntlMessages id={"error.permission"} />);
        }
    }

    // close all drawer
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false,
        });
    }

    // on click of refresh call method of count
    fetchRecords = (e) => {
        e.stopPropagation();
        //added by parth andhariya
        if (this.state.marginTradingBit === 1) {
            this.props.getConfigurationCount({ IsMargin: 1 });
        } else {
            this.props.getConfigurationCount({});
        }
    }
    componentWillMount() {
        this.props.getMenuPermissionByID(this.props.marginTradingBit === 1 ? 'D9FC3AB9-50DB-2CF6-26DA-1BAC6E3F8F2B' : '6D940304-6563-858F-9C6F-0974F07D374B'); // get Trading menu permission
    }
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
        if (menudetail.length) {
            for (index in menudetail) {
                if (menudetail[index].hasOwnProperty('GUID') && menudetail[index].GUID.toLowerCase() === GUID.toLowerCase())
                    response = menudetail[index];
            }
        }
        return response;
    }
    // renders the component
    render() {
        const { drawerClose, configurationsCounts } = this.props;
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
                title: <IntlMessages id="card.list.title.configuration" />,
                link: '',
                index: 1
            }
        ];
        // return the component
        return (
            <div className="drawer-data trading-dashboard-wrapper jbs-page-content">
                {this.props.menuLoading && <JbsSectionLoader />}
                <WalletPageTitle title={<IntlMessages id="card.list.title.configuration" />} breadCrumbData={BreadCrumbData} drawerClose={drawerClose} closeAll={this.closeAll} />
                <div className="row">
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '1D9C27EE-800D-92A2-9AFB-59AAA813841C' : '00872623-88E1-A6FA-2B0A-C25A47181860') && //00872623-88E1-A6FA-2B0A-C25A47181860  && margin_GUID 1D9C27EE-800D-92A2-9AFB-59AAA813841C
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('CoinConfiguration', (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '1D9C27EE-800D-92A2-9AFB-59AAA813841C' : '00872623-88E1-A6FA-2B0A-C25A47181860')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.CoinConfiguration" />}
                                    count={configurationsCounts.CoinCount ? configurationsCounts.CoinCount : 0}
                                    icon="fa fa-life-ring"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '90A8B59F-801C-1A41-04C8-E3547F5C6959' : '76ED8B0A-34E5-6E7D-4D52-C9F590A76255') && //76ED8B0A-34E5-6E7D-4D52-C9F590A76255  && margin_GUID 90A8B59F-801C-1A41-04C8-E3547F5C6959
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('PairConfiguration', (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '90A8B59F-801C-1A41-04C8-E3547F5C6959' : '76ED8B0A-34E5-6E7D-4D52-C9F590A76255')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.pairConfiguration" />}
                                    count={configurationsCounts.PairCount ? configurationsCounts.PairCount : 0}
                                    icon="zmdi zmdi-code-setting"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '8549613C-6D6B-0279-24B4-3203DA8945A8' : 'B75E9652-68DE-822E-1C4E-9E9356E4725C') && //B75E9652-68DE-822E-1C4E-9E9356E4725C  && margin_GUID 8549613C-6D6B-0279-24B4-3203DA8945A8
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ManageMarket', (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '8549613C-6D6B-0279-24B4-3203DA8945A8' : 'B75E9652-68DE-822E-1C4E-9E9356E4725C')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.manageMarkets" />}
                                    count={configurationsCounts.MarketCount ? configurationsCounts.MarketCount : 0}
                                    icon="zmdi zmdi-widgets"
                                />
                            </a>
                        </div>
                    }
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '47456F94-412A-A683-4882-E045DE4946AF' : '7F2B5457-6EC4-116E-7561-9F8CC3A8A277') && //7F2B5457-6EC4-116E-7561-9F8CC3A8A277  && margin_GUID 47456F94-412A-A683-4882-E045DE4946AF
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('MarketCap', (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '47456F94-412A-A683-4882-E045DE4946AF' : '7F2B5457-6EC4-116E-7561-9F8CC3A8A277')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.marketCap.title" />}
                                    count={configurationsCounts.MarketCapTickerCount ? configurationsCounts.MarketCapTickerCount : 0}
                                    icon="fa fa-line-chart"
                                />
                            </a>
                        </div>
                    }
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('B63419C9-65B1-8AB8-6D06-EB4B0CC947AA')) && ( // B63419C9-65B1-8AB8-6D06-EB4B0CC947AA
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('DaemonConfig', (this.checkAndGetMenuAccessDetail('B63419C9-65B1-8AB8-6D06-EB4B0CC947AA')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="liquidityprovider.list.option.label.daemonconfig" />}
                                    count={configurationsCounts.DaemonCount ? configurationsCounts.DaemonCount : 0}
                                    icon="fa fa-recycle"
                                />
                            </a>
                        </div>
                    )}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('37C0746C-0CCA-98F1-004D-AB2D38DC57AC')) && ( // 37C0746C-0CCA-98F1-004D-AB2D38DC57AC
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ProviderConfig', (this.checkAndGetMenuAccessDetail('37C0746C-0CCA-98F1-004D-AB2D38DC57AC')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.providerConfiguration" />}
                                    count={configurationsCounts.ProviderCount ? configurationsCounts.ProviderCount : 0}
                                    icon="zmdi zmdi-daydream-setting"
                                />
                            </a>
                        </div>
                    )}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('DCA0F116-3954-9A72-0320-4945AA9E8FCD')) && ( // DCA0F116-3954-9A72-0320-4945AA9E8FCD
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('LiquidityApiManager', (this.checkAndGetMenuAccessDetail('DCA0F116-3954-9A72-0320-4945AA9E8FCD')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.LiquidityAPI" />}
                                    count={configurationsCounts.LiquidityCount ? configurationsCounts.LiquidityCount : 0}
                                    icon="zmdi zmdi-local-store"
                                />
                            </a>
                        </div>
                    )}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('41D5DD8F-49AC-5F30-847A-1DAB69717C61')) && ( // 41D5DD8F-49AC-5F30-847A-1DAB69717C61
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ThirdPartyAPIRequest', (this.checkAndGetMenuAccessDetail('41D5DD8F-49AC-5F30-847A-1DAB69717C61')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.apiRequest" />}
                                    count={configurationsCounts.APICount ? configurationsCounts.APICount : 0}
                                    icon="zmdi zmdi-input-composite"
                                />
                            </a>
                        </div>
                    )}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('D8FC2B5E-3ABB-74A8-5D61-2F792D402816')) && ( // D8FC2B5E-3ABB-74A8-5D61-2F792D402816
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ThirdPartyAPIResponse', (this.checkAndGetMenuAccessDetail('D8FC2B5E-3ABB-74A8-5D61-2F792D402816')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.apiResponse" />}
                                    count={configurationsCounts.APIResponseCount ? configurationsCounts.APIResponseCount : 0}
                                    icon="zmdi zmdi-graphic-eq"
                                />
                            </a>
                        </div>
                    )}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('ACA5B4D7-13C6-42D8-A57B-00F53A092162')) && ( // ACA5B4D7-13C6-42D8-A57B-00F53A092162
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('TradeRoute', (this.checkAndGetMenuAccessDetail('ACA5B4D7-13C6-42D8-A57B-00F53A092162')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.tradeRoute" />}
                                    count={configurationsCounts.TradeRouteCount ? configurationsCounts.TradeRouteCount : 0}
                                    icon="fa fa-map"
                                />
                            </a>
                        </div>
                    )}
                    {/* added by parth andhariya  24-04-2019 */}
                    {/* change karva avanu guid */}
                    {this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '40D532A4-24F8-3E69-034D-D257C1EC8460' : '6D5C7BF2-8D83-7074-0BA0-04A7818F791C') && ( // 6D5C7BF2-8D83-7074-0BA0-04A7818F791C  && margin_GUID  40D532A4-24F8-3E69-034D-D257C1EC8460
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('SiteToken', (this.checkAndGetMenuAccessDetail(marginTradingBit === 1 ? '40D532A4-24F8-3E69-034D-D257C1EC8460' : '6D5C7BF2-8D83-7074-0BA0-04A7818F791C')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.siteToken" />}
                                    count={configurationsCounts.SiteToken ? configurationsCounts.SiteToken : 0}
                                    icon="zmdi zmdi-key"
                                />
                            </a>
                        </div>
                    )}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('B93AD266-9399-38C4-7EFD-DC4DC11105E1')) && ( // B93AD266-9399-38C4-7EFD-DC4DC11105E1
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ExchangeFeesConfig', (this.checkAndGetMenuAccessDetail('B93AD266-9399-38C4-7EFD-DC4DC11105E1')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.ExchangeFeed" />}
                                    count={configurationsCounts.ExchangeFeedConfigCount ? configurationsCounts.ExchangeFeedConfigCount : 0}
                                    icon="zmdi zmdi-portable-wifi-changes"
                                />
                            </a>
                        </div>
                    )}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('0AB42C85-42ED-24B6-9C80-7247CB0F6E38')) && ( // 0AB42C85-42ED-24B6-9C80-7247CB0F6E38
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ExchangeFeedLimitConfig', (this.checkAndGetMenuAccessDetail('0AB42C85-42ED-24B6-9C80-7247CB0F6E38')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.ExchangeFeedLimit" />}
                                    count={configurationsCounts.ExchangeFeedLimitsCount ? configurationsCounts.ExchangeFeedLimitsCount : 0}
                                    icon="zmdi zmdi-settings-square"
                                />
                            </a>
                        </div>
                    )}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('F4E1D801-8914-2FE3-0439-E084C8F33D51')) && ( // F4E1D801-8914-2FE3-0439-E084C8F33D51
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('ServiceProvider', (this.checkAndGetMenuAccessDetail('F4E1D801-8914-2FE3-0439-E084C8F33D51')).HasChild)} className="text-dark col-sm-full">
                                <CardType1
                                    title={<IntlMessages id="sidebar.ServiceProvider" />}
                                    count={configurationsCounts.ServiceProviderCount ? configurationsCounts.ServiceProviderCount : 0}
                                    icon="fa fa-bolt"
                                />
                            </a>
                        </div>
                    )}
                    {/* Added by Palak Gajjar 04.05.2019 For MarketMakingList */}
                    {(this.state.ConfigurationShowCard !== 1 && this.checkAndGetMenuAccessDetail('F4E1D801-8914-2FE3-0439-E084C8F33D51')) && ( // F4E1D801-8914-2FE3-0439-E084C8F33D51
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <a href="javascript:void(0)" onClick={(e) => this.showComponent('MarketMakingList', (this.checkAndGetMenuAccessDetail('F4E1D801-8914-2FE3-0439-E084C8F33D51')).HasChild)} className="text-dark col-sm-full">
                                <SimpleCard
                                    title={<IntlMessages id="sidebar.MarketMakingList" />}
                                    icon="fa fa-bolt"                                   
                                />

                            </a>
                        </div>
                    )}
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
                    {/* added by parth andhariya */}
                    {this.state.componentName !== '' && dynamicComponent(this.state.componentName, this.props, this.toggleDrawer, this.closeAll, this.state.ConfigurationShowCard)}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = ({ totalCount, drawerclose, authTokenRdcer }) => {
    const { configurationsCounts } = totalCount;
    const {
        menuLoading,
        menu_rights
    } = authTokenRdcer;
    if (drawerclose.bit === 1) {
        setTimeout(function () {
            drawerclose.bit = 2
        }, 1000);
    }
    return { configurationsCounts, drawerclose, menuLoading, menu_rights };
}

// export this component with action methods and props
export default connect(mapStateToProps, {
    getConfigurationCount,
    getMenuPermissionByID
})(ConfigurationData);