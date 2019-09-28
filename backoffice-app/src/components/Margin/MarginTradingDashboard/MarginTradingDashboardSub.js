import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import CardView from '../../../native_theme/components/CardView';
import Separator from '../../../native_theme/components/Separator';
import { validateValue } from '../../../validations/CommonValidation';
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
import { TradeSummaryCountType } from '../../trading/TradingDashboard/TradeSummaryCountScreen';

export const DashboardItemType = {
    UserTrade: 'UserTrade',
    TradeSummary: 'TradeSummary',
    Configuration: 'Configuration',
}

class MarginTradingDashboardSub extends Component {
    constructor(props) {
        super(props);
        // Getting data from previous screen
        let title = props.navigation.state.params.item.title;
        let type = props.navigation.state.params.item.type;

        // Define all initial state
        this.state = {
            isGrid: (type === DashboardItemType.UserTrade || type === DashboardItemType.TradeSummary) ? false : true,
            viewHeight: 0,
            viewListHeight: 0,
            title,
            type,
            [type]: this.getArray(type, props)
        }
    }

    getArray = (type, props) => {
        let array = [];
        // Getting data from previous screen
        let icon = props.navigation.state.params.item.icon; let item = props.navigation.state.params.item.response;

        // To set value as like dashboard item type's behaviour from previous screen
        switch (type) {
            case DashboardItemType.UserTrade:
                array = [
                    {  count: item.Today.Total, ...item.Today, icon: R.images.ic_calendar_check, type: TradeSummaryCountType.Today,title: R.strings.Today, },
                    {  count: item.Week.Total, ...item.Week, icon: R.images.ic_calendar_plus, type: TradeSummaryCountType.Week, title: R.strings.This_Week, },
                    {  count: item.Month.Total, ...item.Month, icon: R.images.ic_calendar, type: TradeSummaryCountType.Month, title: R.strings.This_Month, },
                    {  count: item.Year.Total, ...item.Year, icon: R.images.ic_calendar_blank, type: TradeSummaryCountType.Year, title: R.strings.This_Year, },
                ];
                break;
            case DashboardItemType.TradeSummary:
                array = [
                    {
                        count: item.LIMIT.TotLIMIT,
                        buy: item.LIMIT.LIMIT_BUY,
                        title: R.strings.Limit,
                        sell: item.LIMIT.LIMIT_SELL,
                        icon,
                    },
                    {
                        count: item.MARKET.TotMARKET,
                        buy: item.MARKET.MARKET_BUY,
                        sell: item.MARKET.MARKET_SELL,
                        title: R.strings.market,
                        icon,
                    },
                    {
                        buy: item.SPOT.SPOT_BUY,
                        title: R.strings.spot,
                        count: item.SPOT.TotSPOT,
                        sell: item.SPOT.SPOT_SELL,
                        icon,
                    },
                    {
                        title: R.strings.stopLimit,
                        sell: item.STOP_Limit.STOP_Limit_SELL,
                        count: item.STOP_Limit.TotSTOP_Limit,
                        buy: item.STOP_Limit.STOP_Limit_BUY,
                        icon
                    },
                    {
                        count: item.STOP.TotSTOP,
                        title: R.strings.stop,
                        sell: item.STOP.STOP_SELL,
                        buy: item.STOP.STOP_BUY,
                        icon
                    },
                ]
                break;
            case DashboardItemType.Configuration:

                array = [
                    {  count: item.CoinCount, icon: R.images.ic_life_ring,title: R.strings.CoinConfiguration, },
                    {  count: item.PairCount, icon: R.images.ic_code_settings,title: R.strings.PairConfiguration, },
                    { count: item.MarketCount, icon: R.images.ic_widgets,  title: R.strings.manageMarkets, },
                    {  count: item.MarketCapTickerCount, icon: R.images.ic_line_chart,title: R.strings.marketCapTicker, },
                    {  count: item.SiteToken, icon: R.images.IC_KEY,title: R.strings.siteToken, },
                    /* { title: R.strings.third_party_api_request, count: item.APICount, icon: R.images.ic_settings_input_composite },
                    { title: R.strings.thirdPartyAPIResponse, count: item.APIResponseCount, icon: R.images.ic_graphic_eq },
                    { title: R.strings.daemonConfiguration, count: item.DaemonCount, icon: R.images.ic_recycle },
                    { title: R.strings.providerConfiguration, count: item.ProviderCount, icon: R.images.ic_daydream_settings }, 
                    { title: R.strings.liquidityAPIManager, count: item.LiquidityCount, icon: R.images.ic_store },
                    { title: R.strings.tradeRoute, count: item.TradeRouteCount, icon: R.images.ic_map },
                    { title: R.strings.exchangeFeedConfiguration, count: item.MarketCapTickerCount, icon: R.images.ic_radar },
                    { title: R.strings.exchangeFeedLimit, count: item.MarketCapTickerCount, icon: R.images.ic_settings_box }, */
                ]
                break;
            case DashboardItemType.Reports:
                array = [
                    { title: R.strings.tradeRecon, count: item.LedgerCount, icon: R.images.ic_briefcase },
                    { title: R.strings.organizationLedger, count: item.LedgerCount, icon: R.images.ic_braille },
                    { title: R.strings.siteTokenConversionReport, count: item.LedgerCount, icon: R.images.ic_rss },
                    { title: R.strings.tradeRouting, count: item.LedgerCount, icon: R.images.IC_TRADEUP },
                ]
                break;

            default: array = [];
        }
        return array;
    }

    componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    // Call when user press on flat list item
    itemPress = (item) => {
        switch (this.state.type) {
            case DashboardItemType.UserTrade: {
                this.props.navigation.navigate('TradeSummaryCount', { item: item, fromUserTrade: true, isMargin: true });
                break;
            }
            case DashboardItemType.Configuration: {
                switch (item.title) {
                    case R.strings.CoinConfiguration: { this.props.navigation.navigate('CoinConfiguration', { isMargin: true }); break; }
                    case R.strings.PairConfiguration: { this.props.navigation.navigate('PairConfiguration', { isMargin: true }); break; }
                    case R.strings.third_party_api_request: { this.props.navigation.navigate('ThirdPartyApiRequest'); break; }
                    case R.strings.thirdPartyAPIResponse: { this.props.navigation.navigate('ThirdPartyAPIResponse'); break; }
                    case R.strings.daemonConfiguration: { this.props.navigation.navigate('DaemonConfiguration'); break; }
                    case R.strings.providerConfiguration: { this.props.navigation.navigate('ProviderConfiguration'); break; }
                    case R.strings.manageMarkets: { this.props.navigation.navigate('MarginManageMarket'); break; }
                    case R.strings.liquidityAPIManager: { this.props.navigation.navigate('LiquidityAPIManager'); break; }
                    case R.strings.tradeRoute: { this.props.navigation.navigate('TradeRoutes'); break; }
                    case R.strings.marketCapTicker: { this.props.navigation.navigate('MarginTradingMarketTickersScreen'); break; }
                    case R.strings.exchangeFeedConfiguration: { this.props.navigation.navigate('ExchangeFeedConfig'); break; }
                    case R.strings.exchangeFeedLimit: { this.props.navigation.navigate('FeedLimitConfig'); break; }
                    case R.strings.siteToken: { this.props.navigation.navigate('SiteTokenScreen'); break; }
                }
                break;
            }
        }
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    nav={this.props.navigation}
                    isBack={true}
                    rightMenuRenderChilds={<ThemeToolbarWidget />} />

                {/* for header name and icon */}
                <DashboardHeader
                    isGrid={this.state.isGrid}
                    navigation={this.props.navigation}
                    header={this.state.title}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <View style={{ flex: 1 }}>
                    <FlatList
                        extraData={this.state}
                        key={this.state.isGrid ? 'Grid' : 'List'}
                        data={this.state[this.state.type]}
                        showsVerticalScrollIndicator={false}
                        numColumns={this.state.isGrid ? 2 : 1}
                        // render all item in list
                        renderItem={({ item, index }) => {
                            return <SubDashboardItem
                            size={this.state[this.state.type].length}
                                index={index}
                                item={item}
                                isGrid={this.state.isGrid}
                                type={this.state.type}
                                onPress={() => this.itemPress(item)}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                viewHeight={this.state.viewHeight}
                            />
                        }}
                        // assign index as key valye to Margin Trading Dashboard item
                        keyExtractor=
                        {(_item, index) => index.toString()}
                    />
                </View>

                {/* Back button */}
                <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <ImageButton
                        style={{ 
                            margin: 0, width: '20%', 
                            height: R.dimens.SignUpButtonHeight, 
                            backgroundColor: R.colors.white, 
                            elevation: R.dimens.CardViewElivation, 
                            borderRadius: R.dimens.roundButtonRedius, 
                            justifyContent: 'center', alignItems: 'center' }}
                            iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, 
                                width: R.dimens.LARGE_MENU_ICON_SIZE, 
                                tintColor: R.colors.accent }]}
                            icon={R.images.BACK_ARROW}
                        onPress={() => this.props.navigation.goBack()} />
                </View>
            </SafeView>
        );
    }
}

function SubDashboardItem(props) {

    let { index, onPress, item, isGrid, onChangeHeight, viewHeight,size, type } = props;

    if (isGrid) {
        return <CustomCard
        isGrid={true}
            icon={item.icon}
            title={validateValue(item.count)}
            index={index}
            size={size}
            type={1}
            viewHeight={viewHeight}
            onChangeHeight={onChangeHeight}
            value={item.title}
            onPress={onPress}
        />
    } else {
        return <CardListType
        size={size}
        item={item}
        index={index}
            viewHeight={viewHeight}
            onChangeHeight={onChangeHeight}
            type={type}
            onPress={onPress} />
    }
}

function CardListType({ index, size, onPress, viewHeight, onChangeHeight, item, type }) {
    if (type === DashboardItemType.UserTrade) {
        return (
            <CardView style={{  flex: 1,  marginLeft: R.dimens.widget_left_right_margin,
                marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                marginRight: R.dimens.widget_left_right_margin,
                marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
            }} onPress={onPress}>

                {/* Display title, total, icon */}
                <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ 
                            padding: R.dimens.margin, 
                            backgroundColor: R.colors.accent, 
                            borderRadius: R.dimens.QRCodeIconWidthHeight }}>
                            <Image
                                source={item.icon}
                                style={{ alignSelf: 'flex-end', width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />
                        </View>
                        <Text style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.mediumText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold }}>{item.title}</Text>
                    </View>
                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.Total)}</Text>
                </View>

                {/* Separator */}
                <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }} />

                {/* Display open, settled, cancel, failed status */}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.open}</TextViewHML>
                    <TextViewHML style={{ color: R.colors.listSeprator,fontSize: R.dimens.mediumText,  }}>{validateValue(item.Active)}</TextViewHML>
                </View>
                <View style={{flexDirection: 'row', flex: 1,  justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.Settled}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.Settled)}</TextViewHML>
                </View>
                <View style={{  flexDirection: 'row', justifyContent: 'space-between', flex: 1,}}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin,color: R.colors.listSeprator, fontSize: R.dimens.smallText,  }}>{R.strings.cancel}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.Cancel)}</TextViewHML>
                </View>
                <View style={{  flexDirection: 'row',flex: 1, justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin,  fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.partiallyCancel}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.PartialCancel)}</TextViewHML>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{  marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.Failed}</TextViewHML>
                    <TextViewHML style={{  color: R.colors.listSeprator, fontSize: R.dimens.mediumText,}}>{validateValue(item.SystemFail)}</TextViewHML>
                </View>
            </CardView >
        )
    } else {
        return (
            <CustomCard
                icon={item.icon}
                value={item.title}
                title={validateValue(item.count)}
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

export default MarginTradingDashboardSub;
