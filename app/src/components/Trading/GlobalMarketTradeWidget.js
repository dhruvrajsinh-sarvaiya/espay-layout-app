import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { changeTheme, parseArray, convertTime, addListener, parseFloatVal } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { validateResponseNew, isInternet } from '../../validations/CommonValidation';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import arraySort from 'array-sort';
import { Method, ServiceUtilConstant } from '../../controllers/Constants';
import R from '../../native_theme/R';
import { fetchMarketTradeList } from '../../actions/Trade/GlobalMarketTradeAction';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';
import { getData } from '../../App';

class GlobalMarketTradeWidget extends Component {

    constructor(props) {
        super(props);

        // get data from previous screen
        let { routeName } = props.navigation.state

        this.isMargin = getData(ServiceUtilConstant.KEY_IsMargin);

        //Define All initial State
        this.state = {
            marketTradeResponse: [],
            markettradedata: null,
            routeName: routeName,
            socketData: []
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            if (this.state.marketTradeResponse !== nextState.marketTradeResponse ||
                this.props.result.markettradedata !== nextProps.result.markettradedata ||
                this.props.result.isFetchingMarketTrade !== nextProps.result.isFetchingMarketTrade) {
                // stop twice api call 
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check Internet Connection or not
        if (this.props.result.markettradedata === null && await isInternet()) {

            if (this.isMargin) {
                // Call MarketTradeList api 
                this.props.fetchMarketTradeList({ Pair: this.props.PairName, IsMargin: 1 });
            } else {
                // Call MarketTradeList api 
                this.props.fetchMarketTradeList({ Pair: this.props.PairName });
            }
        }

        // Handle Signal-R response for Recieve OrderHistory
        this.listenerRecieveOrderHistory = addListener(Method.RecieveOrderHistory, (receivedMessage) => {

            // check for current screen
            if (isCurrentScreen(this.props)) {
                try {
                    let response = JSON.parse(receivedMessage);

                    if ((response.EventTime && this.state.socketData.length === 0) ||
                        (this.state.socketData.length !== 0 && response.EventTime > this.state.socketData.EventTime)) {

                        if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === (this.isMargin ? 1 : 0)) {
                            //if connection has data
                            if (response.Data) {
                                let list = this.state.marketTradeResponse;

                                list.push(response.Data);

                                //Sort array based on Price in decending
                                let sortedArray = arraySort(list, 'DateTime', { reverse: true });
                                this.setState({ marketTradeResponse: sortedArray, socketData: response });
                            } else {
                                this.setState({ marketTradeResponse: [], socketData: response });
                            }
                        }
                    }
                } catch (_error) {
                    //parsing error
                }
            }
        })
    };

    componentWillUnmount() {
        // Remove Listener
        if (this.listenerRecieveOrderHistory) {
            this.listenerRecieveOrderHistory.remove();
        }
    }

    static getDerivedStateFromProps(props, state) {

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated field of Particular actions
            const { markettradedata } = props.result

            // To check markettradedata is null or not
            if (markettradedata) {

                //if local markettradedata state is null or its not null and also different then new response then and only then validate response.
                if (state.markettradedata == null || (state.markettradedata != null && markettradedata !== state.markettradedata)) {

                    try {
                        if (validateResponseNew({ response: markettradedata, isList: true })) {

                            let res = markettradedata.response;
                            let finalRes = arraySort(parseArray(res), 'DateTime', { reverse: true });

                            finalRes.map((item, index) => {
                                finalRes[index].color = finalRes[index].Type === R.strings.buy.toUpperCase() ? R.colors.buyerGreen : R.colors.orange;
                            })

                            return Object.assign({}, state, {
                                markettradedata,
                                marketTradeResponse: finalRes
                            })
                        } else {
                            return Object.assign({}, state, {
                                markettradedata
                            })
                        }
                    } catch (error) {
                        return Object({}, state, {
                            marketTradeResponse: []
                        })
                    }
                }
            }
        }
        return null;
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in Activity
        var { isFetchingMarketTrade } = this.props.result;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* to show title */}
                <View style={this.styles().markettradeflatlisttitle}>
                    <View style={{ width: '27%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{R.strings.time}</TextViewHML>
                    </View>
                    <View style={{ width: '25%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{R.strings.price}</TextViewHML>
                    </View>
                    <View style={{ width: '26%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.Amount}</TextViewHML>
                    </View>
                    <View style={{ width: '22%', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{R.strings.Total}</TextViewHML>
                    </View>
                </View>

                {/* to show Detail value item in a row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                    {/* To Check Response fetch or not if isFetchingMarketTrade = true then display progress bar else display List*/}
                    {
                        isFetchingMarketTrade ?
                            <View style={{ width: '100%', height: R.dimens.emptyListWidgetHeight, alignItems: 'center' }}><ListLoader /></View>
                            :
                            <FlatList
                                data={this.state.marketTradeResponse.filter(el => el.IsCancel === 0)}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ index, item }) => {
                                    if (this.state.routeName === 'MarketPairDetail') {
                                        if (index > 9) {
                                            return null
                                        }
                                    }
                                    return <GlobalMarketTradeItem item={item} />
                                }}
                                keyExtractor={(item) => item.TrnNo.toString()}
                                contentContainerStyle={contentContainerStyle(this.state.marketTradeResponse)}
                                ListEmptyComponent={<ListEmptyComponent />}
                            />
                    }
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            markettradeflatlisttitle: {
                flexDirection: "row",
                paddingTop: R.dimens.CardViewElivation,
                paddingBottom: R.dimens.CardViewElivation,
                paddingLeft: R.dimens.widget_left_right_margin,
                paddingRight: R.dimens.widget_left_right_margin,
            },
        }
    }
}

class GlobalMarketTradeItem extends Component {

    shouldComponentUpdate = (nextProps) => {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item) {
            return true;
        }
        return false;
    }

    render() {
        // Get required fields from props
        let { item } = this.props;
        
        let color = item.color ? item.color : R.colors.textPrimary;

        let totalAmt = parseFloatVal(item.Total).toFixed(8);
        if (totalAmt.includes('.00000000')) {
            totalAmt = parseFloatVal(totalAmt).toFixed(2);
        }

        let amountValue = parseFloatVal(item.SettledQty).toFixed(8);
        if (amountValue.includes('.00000000')) {
            amountValue = parseFloatVal(amountValue).toFixed(2);
        }

        let priceValue = parseFloatVal(item.Price).toFixed(8);
        if (priceValue.includes('.00000000')) {
            priceValue = parseFloatVal(priceValue).toFixed(2);
        }
        return (
            <AnimatableItem>
                <View style={{
                    flexDirection: "row",
                    paddingTop: R.dimens.CardViewElivation,
                    paddingBottom: R.dimens.CardViewElivation,
                    paddingLeft: R.dimens.widget_left_right_margin,
                    paddingRight: R.dimens.widget_left_right_margin,
                }}>

                    {/* for show Time */}
                    <View style={{ width: '27%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <TextViewHML style={{ marginRight: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{convertTime(item.DateTime)} </TextViewHML>
                    </View>

                    {/* for show price */}
                    <View style={{ width: '25%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <TextViewHML style={{ marginRight: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{priceValue}</TextViewHML>
                    </View>

                    {/* for show settle Qty. */}
                    <View style={{ width: '26%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <TextViewHML style={{ marginRight: R.dimens.widgetMargin, color: color, fontSize: R.dimens.smallestText }}>{amountValue}</TextViewHML>
                    </View>

                    {/* for show Amount */}
                    <View style={{ width: '22%', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{totalAmt}</TextViewHML>
                    </View>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    // Updated Data of market trade and Preference
    return {
        result: state.globalMarketTradeReducer,
        preference: state.preference
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform MarketTrade Action
        fetchMarketTradeList: (Pair) => dispatch(fetchMarketTradeList(Pair)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(GlobalMarketTradeWidget);