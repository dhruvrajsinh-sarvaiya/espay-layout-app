import React, { Component } from 'react';
import { View, FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import { getUserTradeCount, getConfigurationCount, getTradeSummaryCount, getReportCount } from '../../../actions/Trading/TradingDashboardActions';
import { DashboardItemType } from './TradingDashboardSubScreen';
import CardView from '../../../native_theme/components/CardView';
import TradingChart from '../TradingChart/TradingChart';
import R from '../../../native_theme/R';
import CustomCard from '../../widget/CustomCard';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import MarketTickerWidget from './MarketTickerWidget';
import SafeView from '../../../native_theme/components/SafeView';
import MarginTopLoser from '../MarginTopGainerLoser/MarginTopLoser';
import MarginTopGainer from '../MarginTopGainerLoser/MarginTopGainer';

class TradingDashboardScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.slider = React.createRef();

        //Define initial state
        this.state = {
            viewHeight: 0,
            viewListHeight: 0,
            response: [
                { id: 0, title: R.strings.UserTrade, icon: R.images.IC_USER, response: { TotalCount: '-' }, type: DashboardItemType.UserTrade },
                { id: 1, title: R.strings.TradeSummary, icon: R.images.ic_list_alt, response: { TotalCount: '-' }, type: DashboardItemType.TradeSummary },
                { id: 2, title: R.strings.Configuration, icon: R.images.IC_SETTING, response: { TotalCount: '-' }, type: DashboardItemType.Configuration },
                { id: 3, title: R.strings.Reports, icon: R.images.ic_flag_variant, response: { TotalCount: '-' }, type: DashboardItemType.Reports }
            ],
            isGainer: true,
            tickers: [],
            activeSlide: 0,
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get user trade count
            this.props.getUserTradeCount({});

            //to get configuration count
            this.props.getConfigurationCount({});

            //to get trade summary count
            this.props.getTradeSummaryCount({});

            //to get report count
            this.props.getReportCount();
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
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
        if (TradingDashboardScreen.oldProps !== props) {
            TradingDashboardScreen.oldProps = props;
        } else {
            return null;
        }

        try {
            if (isCurrentScreen(props)) {
                let { userTradeCount, configurationCount, tradeSummaryCount, reportCount } = props.data;

                //if userTradeCount response is not null then handle resposne
                if (userTradeCount) 
                {

                    //if local userTradeCount state is null or its not null and also different then new response then and only then validate response.
                    if (state.userTradeCount == null 
                        || (state.userTradeCount != null 
                            && userTradeCount !== state.userTradeCount)) 
                            {

                        //if userTradeCount response is success then store array list else store empty list
                        if (validateResponseNew({ response: userTradeCount, isList: true })) 
                        {

                            let response = state.response;  response[0].response = userTradeCount.Response;

                            return Object.assign({}, 
                                state, 
                                { userTradeCount, response });
                        } 
                        else 
                        {
                            return Object.assign({}, state, { userTradeCount });
                        }
                    }
                }


                //if configurationCount response is not null then handle resposne
                if (configurationCount) 
                {

                    //if local configurationCount state is null or its not null and also different then new response then and only then validate response.
                    if (state.configurationCount == null 
                        || (state.configurationCount != null 
                            && configurationCount !== state.configurationCount)) {

                        //if configurationCount response is success then store array list else store empty list
                        if (validateResponseNew({ response: configurationCount, isList: true })) {

                            let response = state.response;
                            response[2].response = { TotalCount: configurationCount.Response.Count,
                                ...configurationCount.Response
                            };

                            return Object.assign({}, state, 
                                { configurationCount, response });
                        } else {
                            return Object.assign({}, state, 
                                { configurationCount });
                        }
                    }
                }

                //if tradeSummaryCount response is not null then handle resposne
                if (tradeSummaryCount) {

                    //if local tradeSummaryCount state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradeSummaryCount == null || 
                        (state.tradeSummaryCount != null && 
                            tradeSummaryCount !== state.tradeSummaryCount)) 
                            {

                        //if configurationCount response is success then store array list else store empty list
                        if (validateResponseNew({ 
                            response: tradeSummaryCount, 
                            isList: true })) {

                            let response = state.response;
                            response[1].response = { TotalCount: tradeSummaryCount.Response.TOTALTRADE,
                                ...tradeSummaryCount.Response
                            };

                            return Object.assign({}, state, 
                                { tradeSummaryCount, 
                                    response });
                        } else {
                            return Object.assign({}, state, { tradeSummaryCount });
                        }
                    }
                }

                //if ledgerCount response is not null then handle resposne
                /* if (ledgerCount) {

                    //if local ledgerCount state is null or its not null and also different then new response then and only then validate response.
                    if (state.ledgerCount == null || (state.ledgerCount != null && ledgerCount !== state.ledgerCount)) {

                        //if ledgerCount response is success then store array list else store empty list
                        if (validateResponseNew({ response: ledgerCount, isList: true })) {

                            let response = state.response;
                            response[3].response = {
                                TotalCount: ledgerCount.Response.LedgerCount,
                                ...ledgerCount.Response
                            };

                            return Object.assign({}, state, { ledgerCount, response });
                        } else {
                            return Object.assign({}, state, { ledgerCount });
                        }
                    }
                } */

                //if reportCount response is not null then handle resposne
                if (reportCount) {

                    //if local reportCount state is null or its not null and also different then new response then and only then validate response.
                    if (state.reportCount == null || (state.reportCount != null && reportCount !== state.reportCount)) {

                        //if reportCount response is success then store array list else store empty list
                        if (validateResponseNew({ response: reportCount, isList: true })) {

                            let response = state.response;
                            response[3].response = {
                                TotalCount: reportCount.Response.TotalCount,
                                ...reportCount.Response
                            };
                            return Object.assign({}, state, { reportCount, response });
                        } else {
                            return Object.assign({}, state, { reportCount });
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

        let { isReportCountLoading, isUserTradeCountLoading, isLoadingTradeUserMarketType, isConfigurationCountLoading, isTradeSummaryLoading, isLedgerCountLoading } = this.props.data;
        let isShow = isReportCountLoading || isUserTradeCountLoading || isLoadingTradeUserMarketType || isConfigurationCountLoading || isTradeSummaryLoading || isLedgerCountLoading;

        return (
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background,
            }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={isShow} />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.trading}
                    isBack={true}
                    nav={this.props.navigation}
                />

                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

                    {this.renderDashboardCardsGrid()}

                    {this.renderGraph()}

                    <MarketTickerWidget navigation={this.props.navigation} isMargin={false} />

                    {this.renderTopGainerLoserButton()}

                    {this.renderTopGainerData()}

                </ScrollView>

            </SafeView>
        );
    }

    renderDashboardCardsGrid() {
        return <View>
            {/* Progress */}
            <FlatList
                numColumns={2}  showsVerticalScrollIndicator={false}
                data={this.state.response} extraData={this.state}
                renderItem={({ item, index }) => {
                    return (
                        <CustomCard
                        size={this.state.response.length}
                            icon={item.icon}
                            value={item.title}
                            viewHeight={this.state.viewHeight}
                            title={validateValue(item.response.TotalCount)}
                            index={index}
                            type={1}
                            isGrid={true}
                            onChangeHeight={(height) => {
                                this.setState({ viewHeight: height });
                            }}
                            onPress={() => {
                                if (item.type) {
                                    if (item.type === DashboardItemType.TradeSummary) {
                                        this.props.navigation.navigate('TradeSummaryCount', { item: item, fromUserTrade: false, isMargin: false })
                                    } else {
                                        this.props.navigation.navigate('TradingDashboardSub', { item: item })
                                    }
                                }
                            }}
                        />)
                }}
                keyExtractor={(_item, index) => index.toString()}
            />
        </View>
    }

    renderGraph() {
        return (<View style={{ height: R.dimens.chartHeightLarge }}>
            <CardView style={{
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
                marginBottom: R.dimens.widget_top_bottom_margin,
                height: R.dimens.chartHeightLarge,
                paddingBottom: R.dimens.widgetMargin,
            }}>
                <TradingChart navigation={this.props.navigation} />
            </CardView>

        </View>)
    }

    onPressTopGainerLoser(isGainer) {
        this.setState({ isGainer: isGainer })
    }

    renderTopGainerLoserButton() {

        return <View style={{
            flexDirection: 'row',
            marginTop: R.dimens.widget_top_bottom_margin,
            marginBottom: R.dimens.widget_top_bottom_margin,
            justifyContent: 'space-between'
        }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableWithoutFeedback
                    onPress={() => this.onPressTopGainerLoser(true)}>
                    <View style={{ marginRight: R.dimens.widgetMargin }}>
                        <TextViewMR
                            ellipsizeMode={'tail'}
                            numberOfLines={1}
                            style={{
                                color: this.state.isGainer ? R.colors.textPrimary : R.colors.textSecondary,
                                paddingLeft: R.dimens.margin_left_right,
                                fontSize: R.dimens.mediumText,
                            }}>{R.strings.topGainer}</TextViewMR>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => this.onPressTopGainerLoser(false)}>
                    <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>
                        <TextViewMR
                            numberOfLines={1} ellipsizeMode={'tail'}
                            style={{
                                color: !this.state.isGainer ? R.colors.textPrimary : R.colors.textSecondary,
                                fontSize: R.dimens.mediumText, paddingRight: R.dimens.margin_left_right,
                            }}>{R.strings.topLoser}</TextViewMR>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <ImageTextButton
                icon={R.images.RIGHT_ARROW_DOUBLE}
                onPress={() => this.props.navigation.navigate('MarginTopGainerLoser', { isMargin: false })}
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
            {this.state.isGainer ? <MarginTopGainer navigation={this.props.navigation} isWidget={true} isMargin={false} /> : <MarginTopLoser navigation={this.props.navigation} isWidget={true} isMargin={false} />}
        </View>
    }
}

function mapStatToProps(state) {
    //Updated Data For TradingDashboardReducer,marketTickerReducer Data 
    return {
        data: {
            ...state.TradingDashboardReducer,
            ...state.marketTickerReducer
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getUserTradeCount Action 
        getUserTradeCount: (request) => dispatch(getUserTradeCount(request)),
        //Perform getConfigurationCount Action 
        getConfigurationCount: (request) => dispatch(getConfigurationCount(request)),
        //Perform getTradeSummaryCount Action 
        getTradeSummaryCount: (request) => dispatch(getTradeSummaryCount(request)),
        //Perform getReportCount Action 
        getReportCount: () => dispatch(getReportCount()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradingDashboardScreen);