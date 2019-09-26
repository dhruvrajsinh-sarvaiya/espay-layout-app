import React, { Component } from 'react';
import { View, FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import { DashboardItemType } from './MarginTradingDashboardSub';
import CardView from '../../../native_theme/components/CardView';
import R from '../../../native_theme/R';
import CustomCard from '../../widget/CustomCard';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import MarginTradingChart from '../MarginTradingChart/MarginTradingChart';
import { getUserTradeCount, getConfigurationCount, getTradeSummaryCount } from '../../../actions/Trading/TradingDashboardActions';
import MarginTopGainer from '../../trading/MarginTopGainerLoser/MarginTopGainer';
import MarginTopLoser from '../../trading/MarginTopGainerLoser/MarginTopLoser';
import SafeView from '../../../native_theme/components/SafeView';
import MarketTickerWidget from '../../trading/TradingDashboard/MarketTickerWidget';

class MarginTradingDashboardScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.slider = React.createRef();

        //Define all initial state
        this.state = {
            viewHeight: 0,
            viewScreensHeight: 0,
            response: [
                { id: 0, title: R.strings.UserTrade, icon: R.images.IC_USER, response: { TotalCount: '-' }, type: DashboardItemType.UserTrade },
                { id: 1, title: R.strings.TradeSummary, icon: R.images.ic_list_alt, response: { TotalCount: '-' }, type: DashboardItemType.TradeSummary },
                { id: 2, title: R.strings.Configuration, icon: R.images.IC_SETTING, response: { TotalCount: '-' }, type: DashboardItemType.Configuration },
            ],
            screens: [
                { id: 0, title: R.strings.leverageRequests, icon: R.images.IC_NOTIFICATION },
                { id: 1, title: R.strings.LeverageReport, icon: R.images.IC_CHART },
                { id: 2, title: R.strings.leverageConfiguration, icon: R.images.IC_SETTINGS_OUTLINE },
                { id: 3, title: R.strings.walletLedger, icon: R.images.ic_list_alt },
                { id: 4, title: R.strings.marginTradingHistory, icon: R.images.ic_list_alt },
                { id: 5, title: R.strings.marginProfitLossReport, icon: R.images.ic_list_alt },
                { id: 6, title: R.strings.openPositionReport, icon: R.images.ic_list_alt },
            ],
            isGainer: true,
            tickers: [],
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get user trade count
            this.props.getUserTradeCount({ IsMargin: 1 });

            //to get configuration count
            this.props.getConfigurationCount({ IsMargin: 1 });

            //to get trade summary count
            this.props.getTradeSummaryCount({ IsMargin: 1 });
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //Stop twice api call
        return isCurrentScreen(nextProps);
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
        if (this.oldProps !== props) {
            this.oldProps = props;
        } else {
            return null;
        }

        try {
            if (isCurrentScreen(props)) {
                let { userTradeCount, configurationCount, tradeSummaryCount } = props.data;

                //if userTradeCount response is not null then handle resposne
                if (userTradeCount) {

                    //if local userTradeCount state is null or its not null and also different then new response then and only then validate response.
                    if (state.userTradeCount == null || (state.userTradeCount != null && userTradeCount !== state.userTradeCount)) {

                        //if userTradeCount response is success then store array list else store empty list
                        if (validateResponseNew({ response: userTradeCount, isList: true })) {

                            let response = state.response;
                            response[0].response = userTradeCount.Response;

                            return Object.assign({}, state, { userTradeCount, response });
                        } else {
                            return Object.assign({}, state, { userTradeCount });
                        }
                    }
                }

                //if configurationCount response is not null then handle resposne
                if (configurationCount) {

                    //if local configurationCount state is null or its not null and also different then new response then and only then validate response.
                    if (state.configurationCount == null || (state.configurationCount != null && configurationCount !== state.configurationCount)) {

                        //if configurationCount response is success then store array list else store empty list
                        if (validateResponseNew({ response: configurationCount, isList: true })) {

                            let response = state.response;
                            response[2].response = {
                                TotalCount: configurationCount.Response.Count,
                                ...configurationCount.Response
                            };

                            return Object.assign({}, state, { configurationCount, response });
                        } else {
                            return Object.assign({}, state, { configurationCount });
                        }
                    }
                }

                //if tradeSummaryCount response is not null then handle resposne
                if (tradeSummaryCount) {

                    //if local tradeSummaryCount state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradeSummaryCount == null || (state.tradeSummaryCount != null && tradeSummaryCount !== state.tradeSummaryCount)) {

                        //if configurationCount response is success then store array list else store empty list
                        if (validateResponseNew({ response: tradeSummaryCount, isList: true })) {

                            let response = state.response;
                            response[1].response = {
                                TotalCount: tradeSummaryCount.Response.TOTALTRADE,
                                ...tradeSummaryCount.Response
                            };

                            return Object.assign({}, state, { tradeSummaryCount, response });
                        } else {
                            return Object.assign({}, state, { tradeSummaryCount });
                        }
                    }
                }
            }
        } catch (error) {
            return null;
        }
        return null;
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { isUserTradeCountLoading, isLoadingTradeUserMarketType, isConfigurationCountLoading, isTradeSummaryLoading, isLedgerCountLoading } = this.props.data;
        let isShow = isUserTradeCountLoading || isLoadingTradeUserMarketType || isConfigurationCountLoading || isTradeSummaryLoading || isLedgerCountLoading;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.marginTrading}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* for Progress Bar On Api Call */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={isShow} />

                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                    {/* Display Card Grid for UserTrade, TradeSummary, Configuration */}
                    {this.renderDashboardCardsGrid()}

                    {/* Display Graph */}
                    {this.renderGraph()}

                    {/* Display Margin Market Ticker */}
                    <MarketTickerWidget navigation={this.props.navigation} isMargin={true} />

                    {/* TopGainer and TopLoser Button */}
                    {this.renderTopGainerLoserButton()}

                    {/* TopGainer and TopLoser Data */}
                    {this.renderTopGainerData()}

                    {/* Bottom Card for Leverage Request, Reports, Configuration, Wallet Ledger etc */}
                    {this.renderDashboardBottomCards()}

                </ScrollView>

            </SafeView>
        );
    }

    renderDashboardCardsGrid() {
        return <View>
            <FlatList
                data={this.state.response}
                extraData={this.state}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                // render all item in list
                renderItem={({ item, index }) => {
                    return (
                        <CustomCard
                            icon={item.icon}
                            value={item.title}
                            title={validateValue(item.response.TotalCount)}
                            index={index}
                            size={this.state.response.length}
                            isGrid={true}
                            type={1}
                            viewHeight={this.state.viewHeight}
                            onChangeHeight={(height) => {
                                this.setState({ viewHeight: height });
                            }}
                            onPress={() => {
                                if (item.type === DashboardItemType.TradeSummary) {
                                    this.props.navigation.navigate('TradeSummaryCount', { item: item, fromUserTrade: false, isMargin: true })
                                } else {
                                    this.props.navigation.navigate('MarginTradingDashboardSub', { item: item })
                                }
                            }}
                        />)
                }}
                // assign index as key value to list item
                keyExtractor={(_item, index) => index.toString()}
            />
        </View>
    }

    renderDashboardBottomCards() {
        return <FlatList
            data={this.state.screens}
            extraData={this.state}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            // render all item in list
            renderItem={({ item, index }) => {
                return (
                    <CustomCard
                        icon={item.icon}
                        value={item.title}
                        index={index}
                        size={this.state.screens.length}
                        isGrid={true}
                        type={1}
                        viewHeight={this.state.viewScreensHeight}
                        onChangeHeight={(height) => {
                            this.setState({ viewScreensHeight: height });
                        }}
                        onPress={() => {
                            if (item.id == 0) {
                                this.props.navigation.navigate('LeverageRequestListScreen')
                            }
                            else if (item.id == 1) {
                                this.props.navigation.navigate('LevarageReportScreen')
                            }
                            else if (item.id == 2) {
                                this.props.navigation.navigate('LeverageConfigListScreen')
                            }
                            else if (item.id == 3) {
                                this.props.navigation.navigate('WalletLedgerScreen')
                            }
                            else if (item.id == 4) { //screenType: 2  for margin trading history
                                this.props.navigation.navigate('TradingLedgerScreen', { screenType: 2 })
                            }
                            else if (item.id == 5) {
                                this.props.navigation.navigate('ProfitLossReportScreen')
                            }
                            else if (item.id == 6) {
                                this.props.navigation.navigate('OpenPositionListScreen')
                            }
                        }}
                    />)
            }}
            // assign index as key value to list item
            keyExtractor={(_item, index) => index.toString()}
        />
    }

    // render graph on dashboard
    renderGraph() {
        return (<View style={{ height: R.dimens.chartHeightLarge }}>
            <CardView style={{
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
                marginBottom: R.dimens.widget_top_bottom_margin,
                height: R.dimens.chartHeightLarge,
                paddingBottom: R.dimens.widgetMargin,
            }}>
                <MarginTradingChart navigation={this.props.navigation} />
            </CardView>

        </View>)
    }

    onPressTopGainerLoser(isGainer) {
        this.setState({ isGainer: isGainer })
    }

    // render topGainerLoser button on dashboard
    renderTopGainerLoserButton() {

        return <View style={{
            flexDirection: 'row',
            marginTop: R.dimens.widget_top_bottom_margin,
            marginBottom: R.dimens.widget_top_bottom_margin,
            justifyContent: 'space-between'
        }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* Top Gainer Button */}
                <TouchableWithoutFeedback
                    onPress={() => this.onPressTopGainerLoser(true)}>
                    <View style={{ marginRight: R.dimens.widgetMargin }}>
                        <TextViewMR
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={{
                                color: this.state.isGainer ? R.colors.textPrimary : R.colors.textSecondary,
                                fontSize: R.dimens.mediumText,
                                paddingLeft: R.dimens.margin_left_right
                            }}>{R.strings.topGainer}</TextViewMR>
                    </View>
                </TouchableWithoutFeedback>

                {/* Top Loser Button */}
                <TouchableWithoutFeedback
                    onPress={() => this.onPressTopGainerLoser(false)}>
                    <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>
                        <TextViewMR
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={{
                                color: !this.state.isGainer ? R.colors.textPrimary : R.colors.textSecondary,
                                fontSize: R.dimens.mediumText,
                                paddingRight: R.dimens.margin_left_right
                            }}>{R.strings.topLoser}</TextViewMR>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            {/* Imagebutton for detail screen */}
            <ImageTextButton
                icon={R.images.RIGHT_ARROW_DOUBLE}
                onPress={() => this.props.navigation.navigate('MarginTopGainerLoser', { isMargin: true })}
                style={{ marginBottom: 0, marginTop: 0 }}
                iconStyle={{
                    width: R.dimens.dashboardMenuIcon,
                    height: R.dimens.dashboardMenuIcon,
                    tintColor: R.colors.textPrimary
                }} />
        </View>
    }

    renderTopGainerData() {
        return <View>
            {this.state.isGainer ? <MarginTopGainer navigation={this.props.navigation} isWidget={true} isMargin={true} /> : <MarginTopLoser navigation={this.props.navigation} isWidget={true} isMargin={true} />}
        </View>
    }
}

function mapStatToProps(state) {
    return {
        //Updated data trading Dashboard All Action Perform 
        data: {
            ...state.MarginTradingDashboardReducer,
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getUserTradeCount action
        getUserTradeCount: (request) => dispatch(getUserTradeCount(request)),
        //Perform getConfigurationCount action
        getConfigurationCount: (request) => dispatch(getConfigurationCount(request)),
        //Perform getTradeSummaryCount action
        getTradeSummaryCount: (request) => dispatch(getTradeSummaryCount(request)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(MarginTradingDashboardScreen);