import React, { Component } from 'react'
import { View, Image, Text, FlatList } from 'react-native'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, } from '../../../controllers/CommonUtils';
import SafeView from '../../../native_theme/components/SafeView';
import { getUserMarketCount } from '../../../actions/Arbitrage/ArbitrageUserTradeAction';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import Separator from '../../../native_theme/components/Separator';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import DashboardHeader from '../../widget/DashboardHeader';
import CustomCard from '../../widget/CustomCard';

export class UserTradeListDetailScreen extends Component {
    constructor(props) {
        super(props);

        //fill all the data from previous screen
        this.state = {
            Id: props.navigation.state.params && props.navigation.state.params.Id,
            ArbitrageMarketTypeUserCountState: null,
            isGrid: false,
            viewHeight: 0,
            data: [
                { title: R.strings.market, icon: R.images.ic_bank, id: 1, buy: 0, sell: 0, count: 0, type: 1 },
                { title: R.strings.Limit, icon: R.images.ic_bandcamp, id: 2, buy: 0, sell: 0, count: 0, type: 1 },
                { title: R.strings.stopLimit, icon: R.images.ic_linode, id: 3, buy: 0, sell: 0, count: 0, type: 1 },
                { title: R.strings.spot, icon: R.images.ic_cubes, id: 3, buy: 0, sell: 0, count: 0, type: 1 },
            ]
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        let Type;
        //Pass Type Parameter Based on previous Screen Type Selection
        if (this.state.Id == 1) {
            Type = 'Today';
        } else if (this.state.Id == 2) {
            Type = 'Week';
        } else if (this.state.Id == 3) {
            Type = 'Month';
        } else {
            Type = 'Year';
        }
        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call Get Arbitrage Market Type User Count Api
            this.props.getUserMarketCount({ Type })
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

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
        if (UserTradeListDetailScreen.oldProps !== props) {
            UserTradeListDetailScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ArbitrageMarketTypeUserCountdata } = props.ArbitrageMarketTypeUserTradeResult;

            //To Check Arbitrage Market Type user Count Fetch Or Not
            if (ArbitrageMarketTypeUserCountdata) {
                try {
                    //if local ArbitrageMarketTypeUserCountState state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageMarketTypeUserCountState == null || (state.ArbitrageMarketTypeUserCountState !== null && ArbitrageMarketTypeUserCountdata !== state.ArbitrageMarketTypeUserCountState)) {

                        if (validateResponseNew({ response: ArbitrageMarketTypeUserCountdata, isList: true })) {
                            let res = ArbitrageMarketTypeUserCountdata.Response

                            let oldData = state.data

                            oldData[0].count = validateValue(res.MARKET.TotMARKET)
                            oldData[1].count = validateValue(res.LIMIT.TotLIMIT)
                            oldData[2].count = validateValue(res.STOP_Limit.TotSTOP_Limit)
                            oldData[3].count = validateValue(res.SPOT.TotSPOT)

                            oldData[0].buy = validateValue(res.MARKET.MARKET_BUY)
                            oldData[1].buy = validateValue(res.LIMIT.LIMIT_BUY)
                            oldData[2].buy = validateValue(res.STOP_Limit.STOP_Limit_BUY)
                            oldData[3].buy = validateValue(res.SPOT.SPOT_BUY)

                            oldData[0].sell = validateValue(res.MARKET.MARKET_SELL)
                            oldData[1].sell = validateValue(res.LIMIT.LIMIT_SELL)
                            oldData[2].sell = validateValue(res.STOP_Limit.STOP_Limit_SELL)
                            oldData[3].sell = validateValue(res.SPOT.SPOT_SELL)

                            return Object.assign({}, state, {
                                ArbitrageMarketTypeUserCountState: ArbitrageMarketTypeUserCountdata,
                                data: oldData,
                            })
                        }
                        else {
                            return Object.assign({}, state, {
                                ArbitrageMarketTypeUserCountState: null,
                                data: null
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ArbitrageMarketTypeUserCountState: null,
                        data: null
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

        }
        return null;
    }

    onListScreen = (Id, index) => {
        let range = '', marketType = '';
        if (Id == 1) {
            range = 'Today';
        } else if (Id == 2) {
            range = 'Week';
        } else if (Id == 3) {
            range = 'Month';
        } else {
            range = 'Year';
        }

        if (index == 0)
            marketType = 'MARKET'
        else if (index == 1)
            marketType = 'LIMIT'
        else if (index == 2)
            marketType = 'STOP_LIMIT'
        else if (index == 3)
            marketType = 'SPOT'
        this.props.navigation.navigate('UserTradeListDetailsDisplayScreen', { range: range, marketType: marketType })
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { ArbitrageMarketTypeUserCountIsFetching } = this.props.ArbitrageMarketTypeUserTradeResult;

        // set ToolBar Title Based on Type
        let Title;
        let currentId = this.state.Id;

        // For show title
        if (this.state.Id == 1) {
            Title = R.strings.arbitrage + ' ' + R.strings.Today;
        } else if (this.state.Id == 2) {
            Title = R.strings.arbitrage + ' ' + R.strings.This_Week;
        } else if (this.state.Id == 3) {
            Title = R.strings.arbitrage + ' ' + R.strings.This_Month;
        } else {
            Title = R.strings.arbitrage + ' ' + R.strings.This_Year;
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    isBack={true}
                    nav={this.props.navigation}
                    rightMenuRenderChilds={<ThemeToolbarWidget />} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={Title}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={ArbitrageMarketTypeUserCountIsFetching} />

                <View style={{ flex: 1 }}>
                    <FlatList
                        key={this.state.isGrid ? 'List' : 'Grid'}
                        data={this.state.data}
                        extraData={this.state}
                        numColumns={this.state.isGrid ? 2 : 1}
                        showsVerticalScrollIndicator={false}
                        // render all item in list
                        renderItem={({ item, index }) => {
                            return <SubDashboardItem
                                index={index}
                                item={item}
                                onPress={() => this.onListScreen(currentId, index)}
                                isGrid={this.state.isGrid}
                                type={item.type}
                                size={this.state.data.length}
                                onChangeHeight={(height) => {
                                    this.setState({ viewHeight: height });
                                }}
                                viewHeight={this.state.viewHeight}
                            />
                        }}
                        // assign index as key value item
                        keyExtractor={(_item, index) => index.toString()}
                    />
                </View>
            </SafeView>
        )
    }
}

export class SubDashboardItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { index, item, size, isGrid, onChangeHeight, viewHeight, onPress, type } = this.props;
        if (isGrid) {
            return <CustomCard
                icon={item.icon}
                value={item.title}
                title={item.count}
                index={index}
                size={size}
                isGrid={true}
                type={type}
                viewHeight={viewHeight}
                onChangeHeight={onChangeHeight}
                onPress={onPress}
            />
        } else {
            return <CardListView
                index={index}
                item={item}
                size={size}
                onPress={onPress}
            />
        }
    }
}

class CardListView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { item, index, size, onPress } = this.props

        return (
            <CardView style={{
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
                marginTop: index == 0 ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                marginBottom: index == size - 1 ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
            }} onPress={onPress} >

                {/* for show icon, title and count */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: R.colors.accent, padding: R.dimens.margin, borderRadius: R.dimens.QRCodeIconWidthHeight }}>
                            <Image
                                style={{
                                    alignSelf: 'flex-end',
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: R.colors.white
                                }}
                                source={item.icon}
                            />
                        </View>
                        <Text style={{
                            marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.mediumText,
                            color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold
                        }}>{item.title}</Text>
                    </View>
                    <Text style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold }}>{validateValue(item.count)}</Text>
                </View>

                {/* for show Separator */}
                <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }} />

                {/* for show buy and sell */}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.buy}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, }}>{validateValue(item.buy)}</TextViewHML>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextViewHML style={{ marginLeft: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.sell}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, }}>{validateValue(item.sell)}</TextViewHML>
                </View>
            </CardView >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage User Count Data from reducer
        ArbitrageMarketTypeUserTradeResult: state.ArbitrageUserTradeReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({

    // Get Updated Arbitrage Market Type Trade User Count
    getUserMarketCount: (request) => dispatch(getUserMarketCount(request)),

})

export default connect(mapStateToProps, mapDispatchToProps)(UserTradeListDetailScreen)
