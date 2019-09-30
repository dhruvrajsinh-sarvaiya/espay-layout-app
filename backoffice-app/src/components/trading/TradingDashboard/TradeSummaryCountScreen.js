import React, { Component } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CardView from '../../../native_theme/components/CardView';
import Separator from '../../../native_theme/components/Separator';
import { validateValue, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { DashboardItemType } from './TradingDashboardSubScreen';
import { changeTheme, } from '../../../controllers/CommonUtils';
import { getTradeUserMarketTypeCount, clearTradeMarketCount } from '../../../actions/Trading/TradingDashboardActions';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../../Navigation';
import R from '../../../native_theme/R';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import CustomCard from '../../widget/CustomCard';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import DashboardHeader from '../../widget/DashboardHeader';
import SafeView from '../../../native_theme/components/SafeView';

export const TradeSummaryCountType = {
    Today: 'Today',
    Week: 'Week',
    Month: 'Month',
    Year: 'Year',
}

class TradeSummaryCountScreen extends Component {
    constructor(props) {
        super(props);

        // getting isMargin params from previous screen
        let isMargin = props.navigation.state.params && props.navigation.state.params.isMargin

        //Define all in initial state
        this.state = {
            isGrid: false,
            viewHeight: 0,
            viewListHeight: 0,
            title: props.navigation.state.params.item.title,
            [DashboardItemType.TradeSummary]: this.getArray(props),
            isFirstTime: true,
            isMargin: isMargin
        }
    }

    getArray = (props) => {
        let array = [];
        let item = props.navigation.state.params.item.response;

        array = [
            {
                title: R.strings.market,
                count: item && item.MARKET.TotMARKET,
                buy: item && item.MARKET.MARKET_BUY,
                sell: item && item.MARKET.MARKET_SELL,
                type: 'MARKET',
                icon: R.images.ic_bank
            },
            {
                title: R.strings.Limit,
                count: item && item.LIMIT.TotLIMIT,
                buy: item && item.LIMIT.LIMIT_BUY,
                sell: item && item.LIMIT.LIMIT_SELL,
                type: 'LIMIT',
                icon: R.images.ic_bandcamp
            },
            {
                title: R.strings.stopLimit,
                count: item && item.STOP_Limit.TotSTOP_Limit,
                buy: item && item.STOP_Limit.STOP_Limit_BUY,
                sell: item && item.STOP_Limit.STOP_Limit_SELL,
                type: 'STOP_Limit',
                icon: R.images.ic_linode
            },
            {
                title: R.strings.spot,
                count: item && item.SPOT.TotSPOT,
                buy: item && item.SPOT.SPOT_BUY,
                sell: item && item.SPOT.SPOT_SELL,
                type: 'SPOT',
                icon: R.images.ic_cubes
            },
        ]
        return array;
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearTradeMarketCount()
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (this.props.navigation.state.params.fromUserTrade && await isInternet()) {

            if (this.state.isMargin) {

                //to get trade user market type count
                this.props.getTradeUserMarketTypeCount({ type: this.props.navigation.state.params.item.type, IsMargin: 1 });
            } else {

                //to get trade user market type count
                this.props.getTradeUserMarketTypeCount({ type: this.props.navigation.state.params.item.type });
            }
        }
    };

    shouldComponentUpdate = (_nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(_nextProps);
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (TradeSummaryCountScreen.oldProps !== props) {
            TradeSummaryCountScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { tradeUserMarketTypeCount } = props.data;

            if (tradeUserMarketTypeCount) {
                try {
                    //if local tradeSettledData state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradeUserMarketTypeCount == null || (state.tradeUserMarketTypeCount != null && tradeUserMarketTypeCount !== state.tradeUserMarketTypeCount)) {

                        //if tradeUserMarketTypeCount response is success then store array list else store empty list
                        if (validateResponseNew({ response: tradeUserMarketTypeCount, isList: true })) {
                            let response = state[DashboardItemType.TradeSummary];
                            response.map((el, index) => {
                                response[index].count = tradeUserMarketTypeCount.Response[el.type]['Tot' + el.type];
                                response[index].buy = tradeUserMarketTypeCount.Response[el.type][el.type + '_BUY'];
                                response[index].sell = tradeUserMarketTypeCount.Response[el.type][el.type + '_SELL'];
                            })
                            return { ...state, tradeUserMarketTypeCount, [DashboardItemType.TradeSummary]: response };
                        } else {
                            return { ...state, tradeUserMarketTypeCount };
                        }
                    }
                } catch (e) {
                    return { ...state, };
                }
            }
        }
        return null;
    }


    itemPress = (item) => {

        let fromUserTrade = this.props.navigation.state.params.fromUserTrade;
        let orderType = item.type;
        if (fromUserTrade) {
            let range =  this.props.navigation.state.params.item.type;
            this.props.navigation.navigate('UserTradingSummary', { range, orderType, isMargin: this.state.isMargin });
        } else {
            this.props.navigation.navigate('TradingSummaryScreen', { orderType, isMargin: this.state.isMargin });
        }
    }

    render() {

        let { isLoadingTradeUserMarketType } = this.props.data;
        let isShow = isLoadingTradeUserMarketType;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />} />

                {/* To set ProgressDialog as per our theme */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={isShow} />

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
                        data={this.state[DashboardItemType.TradeSummary]}
                        extraData={this.state}
                        numColumns={this.state.isGrid ? 2 : 1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return <SubDashboardItem
                                index={index}
                                item={item}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                viewHeight={this.state.viewHeight}
                                onPress={() => this.itemPress(item)}
                                size={this.state[DashboardItemType.TradeSummary].length}
                                isGrid={this.state.isGrid}
                            />
                        }}
                        keyExtractor={(_item, index) => index.toString()}
                    />
                </View>

                <View style={{
                    marginBottom: R.dimens.widget_top_bottom_margin, marginTop: R.dimens.widget_top_bottom_margin ,
                     marginLeft: R.dimens.padding_left_right_margin, }}>
                    <ImageButton
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        icon={R.images.BACK_ARROW}
                        onPress={() => this.props.navigation.goBack()} />
                </View>
                
            </SafeView>
        );
    }
}

function SubDashboardItem(props) {

    let { index, item, size, isGrid, onChangeHeight, viewHeight, onPress } = props;

    if (isGrid) {
        return <CustomCard
            icon={item.icon}
            value={item.title}
            title={validateValue(item.count)}
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
            size={size}
            onPress={onPress} />
    }
}

function CardListType({ index, size, onPress, item }) {
    return (
        <CardView style={{
            flex: 1,
            marginLeft: R.dimens.widget_left_right_margin,
            marginRight: R.dimens.widget_left_right_margin,
            marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
            marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
        }} onPress={onPress}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ padding: R.dimens.margin, backgroundColor: R.colors.accent, borderRadius: R.dimens.QRCodeIconWidthHeight }}>
                        {/* icon */}
                        <Image
                            source={item.icon}
                            style={{ alignSelf: 'flex-end', width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                        />
                    </View>
                    <Text style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.mediumText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold, }}>{item.title}</Text>
                </View>
                {/*To show count */}
                <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold, }}>
                    {validateValue(item.count)}</Text>
            </View>

            <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }} />

            {/* To show buy */}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.buy}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.buy)}</TextViewHML>
            </View>
            {/* To show sell */}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.listSeprator }}>{R.strings.sell}</TextViewHML>
                <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator, }}>{validateValue(item.sell)}</TextViewHML>
            </View>
        </CardView >
    )
}

function mapStatToProps(state) {
    //Updated TradingDashboardReducer Data 
    return { data: state.TradingDashboardReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getTradeUserMarketTypeCount action
        getTradeUserMarketTypeCount: (payload) => dispatch(getTradeUserMarketTypeCount(payload)),
        // Clear Trade User Market Type Count
        clearTradeMarketCount: () => dispatch(clearTradeMarketCount()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradeSummaryCountScreen);