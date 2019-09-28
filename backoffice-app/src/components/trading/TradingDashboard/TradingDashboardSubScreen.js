import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import CardView from '../../../native_theme/components/CardView';
import Separator from '../../../native_theme/components/Separator';
import { validateValue } from '../../../validations/CommonValidation';
import { TradeSummaryCountType } from './TradeSummaryCountScreen';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import CustomCard from '../../widget/CustomCard';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';

export const DashboardItemType = {
    UserTrade: 'UserTrade',
    TradeSummary: 'TradeSummary',
    Configuration: 'Configuration',
    Reports: 'Reports',
}

class TradingDashboardSubScreen extends Component {
    constructor(props) {
        super(props);

        let title = props.navigation.state.params.item.title;
        let type = props.navigation.state.params.item.type;
        this.state = {
            isGrid: (type === DashboardItemType.UserTrade || type === DashboardItemType.TradeSummary) ? false : true,
            viewHeight: 0,
            viewListHeight: 0,
            title,
            type,
            [type]: this.getArray(type, props)
        };
    }

    getArray = (type, props) => {
        let array = [];
        let icon = props.navigation.state.params.item.icon;
        let item = props.navigation.state.params.item.response;

        switch (type) {
            case DashboardItemType.UserTrade:
                array = [
                    { title: R.strings.Today, count: item.Today.Total, ...item.Today, icon: R.images.ic_calendar_check, type: TradeSummaryCountType.Today },
                    { title: R.strings.This_Week, count: item.Week.Total, ...item.Week, icon: R.images.ic_calendar_plus, type: TradeSummaryCountType.Week },
                    { title: R.strings.This_Month, count: item.Month.Total, ...item.Month, icon: R.images.ic_calendar, type: TradeSummaryCountType.Month },
                    { title: R.strings.This_Year, count: item.Year.Total, ...item.Year, icon: R.images.ic_calendar_blank, type: TradeSummaryCountType.Year },
                ];
                break;
            case DashboardItemType.TradeSummary:
                array = [
                    {
                        title: R.strings.Limit,
                        count: item.LIMIT.TotLIMIT,
                        buy: item.LIMIT.LIMIT_BUY,
                        sell: item.LIMIT.LIMIT_SELL,
                        icon
                    },
                    {
                        title: R.strings.market,
                        count: item.MARKET.TotMARKET,
                        buy: item.MARKET.MARKET_BUY,
                        sell: item.MARKET.MARKET_SELL,
                        icon
                    },
                    {
                        title: R.strings.spot,
                        count: item.SPOT.TotSPOT,
                        buy: item.SPOT.SPOT_BUY,
                        sell: item.SPOT.SPOT_SELL,
                        icon
                    },
                    {
                        title: R.strings.stopLimit,
                        count: item.STOP_Limit.TotSTOP_Limit,
                        buy: item.STOP_Limit.STOP_Limit_BUY,
                        sell: item.STOP_Limit.STOP_Limit_SELL,
                        icon
                    },
                    {
                        title: R.strings.stop,
                        count: item.STOP.TotSTOP,
                        buy: item.STOP.STOP_BUY,
                        sell: item.STOP.STOP_SELL,
                        icon
                    },
                ]
                break;
            case DashboardItemType.Configuration:
                array = [
                    { title: R.strings.CoinConfiguration, count: item.CoinCount, icon: R.images.ic_life_ring },
                    { title: R.strings.PairConfiguration, count: item.PairCount, icon: R.images.ic_code_settings },
                    { title: R.strings.manageMarkets, count: item.MarketCount, icon: R.images.ic_widgets },
                    { title: R.strings.marketCapTicker, count: item.MarketCapTickerCount, icon: R.images.ic_line_chart },
                    { title: R.strings.daemonConfiguration, count: item.DaemonCount, icon: R.images.ic_recycle },
                    { title: R.strings.providerConfiguration, count: item.ProviderCount, icon: R.images.ic_daydream_settings },
                    { title: R.strings.liquidityAPIManager, count: item.LiquidityCount, icon: R.images.ic_store },
                    { title: R.strings.third_party_api_request, count: item.APICount, icon: R.images.ic_settings_input_composite },
                    { title: R.strings.thirdPartyAPIResponse, count: item.APIResponseCount, icon: R.images.ic_graphic_eq },
                    { title: R.strings.tradeRoute, count: item.TradeRouteCount, icon: R.images.ic_map },
                    { title: R.strings.siteToken, count: item.SiteToken, icon: R.images.IC_KEY },
                    { title: R.strings.exchangeFeedConfiguration, count: item.MarketCapTickerCount, icon: R.images.ic_radar },
                    { title: R.strings.exchangeFeedLimit, count: item.MarketCapTickerCount, icon: R.images.ic_settings_box },
                    { title: R.strings.Service_Provider, count: item.ServiceProviderCount, icon: R.images.IC_PROVIDER },
                    { title: R.strings.marketMakingList, count: null, icon: R.images.IC_PROVIDER },
                ]
                break;
            case DashboardItemType.Reports:
                array = [
                    { title: R.strings.tradeRecon, count: item.TradeReconCount, icon: R.images.ic_briefcase },
                    // { title: R.strings.organizationLedger, count: item.LedgerCount, icon: R.images.ic_braille },
                    { title: R.strings.siteTokenConversionReport, count: item.SiteTokenConversionCount, icon: R.images.ic_rss },
                    { title: R.strings.tradeRouting, count: item.TradeRoutingCount, icon: R.images.IC_TRADEUP },
                ]
                break;

            default: array = [];
        }
        return array;
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    itemPress = (item) => {
        switch (this.state.type) {
            case DashboardItemType.UserTrade: {
                this.props.navigation.navigate('TradeSummaryCount', { item: item, fromUserTrade: true, isMargin: false });
                break;
            }
            case DashboardItemType.Configuration: {
                switch (item.title) {
                    case R.strings.CoinConfiguration: { this.props.navigation.navigate('CoinConfiguration', { isMargin: false }); break; }
                    case R.strings.PairConfiguration: { this.props.navigation.navigate('PairConfiguration', { isMargin: false }); break; }
                    case R.strings.manageMarkets: { this.props.navigation.navigate('ManageMarket'); break; }
                    case R.strings.marketCapTicker: { this.props.navigation.navigate('TradingMarketTickers'); break; }
                    case R.strings.daemonConfiguration: { this.props.navigation.navigate('DaemonConfiguration'); break; }
                    case R.strings.providerConfiguration: { this.props.navigation.navigate('ProviderConfiguration'); break; }
                    case R.strings.liquidityAPIManager: { this.props.navigation.navigate('LiquidityAPIManager'); break; }
                    case R.strings.tradeRoute: { this.props.navigation.navigate('TradeRoutes'); break; }
                    case R.strings.third_party_api_request: { this.props.navigation.navigate('ThirdPartyApiRequest'); break; }
                    case R.strings.thirdPartyAPIResponse: { this.props.navigation.navigate('ThirdPartyAPIResponse'); break; }
                    case R.strings.exchangeFeedConfiguration: { this.props.navigation.navigate('ExchangeFeedConfig'); break; }
                    case R.strings.exchangeFeedLimit: { this.props.navigation.navigate('FeedLimitConfig'); break; }
                    case R.strings.siteToken: { this.props.navigation.navigate('SiteTokenScreen'); break; }
                    case R.strings.Service_Provider: { this.props.navigation.navigate('ServiceProviderScreen'); break; }
                    case R.strings.marketMakingList: { this.props.navigation.navigate('MarketMakingListScreen'); break; }
                }
                break;
            }
            case DashboardItemType.Reports: {
                switch (item.title) {
                    case R.strings.tradeRecon: {
                        //screentype 2 for trading recon
                        this.props.navigation.navigate('ArbiTradeReconListScreen', { screenType: 2 });
                        break;
                    }
                    case R.strings.tradeRouting: { this.props.navigation.navigate('TradeRoutingListScreen'); break; }
                    // case R.strings.organizationLedger: { this.props.navigation.navigate('OrganizationLedger'); break; }
                    case R.strings.siteTokenConversionReport: { this.props.navigation.navigate('SiteTokenConversionReport'); break; }
                }
                break;
            }
        }
    }

    render() {

        return (
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background,
            }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={this.state.title}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <View style={{ flex: 1 }}>
                    <FlatList
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        data={this.state[this.state.type]}
                        extraData={this.state}
                        numColumns={this.state.isGrid ? 2 : 1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return <SubDashboardItem
                                index={index}
                                item={item}
                                onPress={() => this.itemPress(item)}
                                isGrid={this.state.isGrid}
                                type={this.state.type}
                                size={this.state[this.state.type].length}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                viewHeight={this.state.viewHeight}
                            />
                        }}
                        keyExtractor={(_item, index) => index.toString()}
                    />
                </View>

                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        icon={R.images.BACK_ARROW}
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        onPress={() => this.props.navigation.goBack()} />
                </View>
            </SafeView>
        );
    }
}

function SubDashboardItem(props) {

    let { index, item, size, isGrid, onChangeHeight, viewHeight, onPress, type } = props;

    if (isGrid) {
        return <CustomCard
            icon={item.icon}
            value={item.title}
            title={item.count}
            index={index}
            size={size}
            isGrid={true}
            type={1}
            viewHeight={viewHeight}
            onChangeHeight={onChangeHeight}
            onPress={onPress}
        />
    } else {
        return <CardListType
            index={index}
            item={item}
            viewHeight={viewHeight}
            onChangeHeight={onChangeHeight}
            size={size}
            type={type}
            onPress={onPress} />
    }
}

function CardListType({ index, size, onPress, viewHeight, onChangeHeight, item, type }) {
    if (type === DashboardItemType.UserTrade) {
        return (
            <CardView style={{
                flex: 1,
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
                marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
            }} onPress={onPress}>

                {/* for show icon , title , Total  */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ padding: R.dimens.margin, backgroundColor: R.colors.accent, borderRadius: R.dimens.QRCodeIconWidthHeight }}>
                            <Image
                                source={item.icon}
                                style={{ alignSelf: 'flex-end', width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />
                        </View>
                        <Text style={{
                            marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.mediumText,
                            color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold
                        }}>{item.title}</Text>
                    </View>
                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold }}>
                        {validateValue(item.Total)}</Text>
                </View>

                <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }} />

                {/* for show Active , Settled , Cancel , PartialCancel */}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{
                        marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText,
                        color: R.colors.listSeprator
                    }}>{R.strings.open}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.Active)}</TextViewHML>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.Settled}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.Settled)}</TextViewHML>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.cancel}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.Cancel)}</TextViewHML>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.partiallyCancel}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.PartialCancel)}</TextViewHML>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.Failed}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.SystemFail)}</TextViewHML>
                </View>
            </CardView >
        )
    } else {
        return (
            <CustomCard
                icon={item.icon}
                value={item.title}
                title={item.count}
                index={index}
                size={size}
                isGrid={false}
                type={1}
                viewHeight={viewHeight}
                onChangeHeight={(height) => { onChangeHeight(height); }}
                onPress={onPress}
            />
        )
    }
}

export default TradingDashboardSubScreen;
