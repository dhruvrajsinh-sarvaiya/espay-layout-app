import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { isInternet, getColorCode, validateResponseNew } from '../../../validations/CommonValidation';
import { addListener, changeTheme, windowPercentage, parseFloatVal } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import { getMarketTickerList } from '../../../actions/Trade/MarketTickerActions';
import CardView from '../../../native_theme/components/CardView';
import { Method } from '../../../controllers/Constants';
import { isCurrentScreen, addComponentDidResume } from '../../Navigation';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Cache } from '../../../App';

const CacheName = 'MarketTickerWidget';

class MarketTickerWidget extends Component {

    constructor(props) {
        super(props)

        // To handle resume screen event
        addComponentDidResume({ props, componentDidResume: this.componentDidResume, widgetName: CacheName });

        let { width, height } = Dimensions.get('window');
        let contentPercentage = width * 65 / 100;

        //Define All initial State
        this.state = {
            tickers: null,
            itemWidth: windowPercentage(30, width < height ? width : contentPercentage),
        };
    };

    componentDidResume = () => {

        // check cache data is exist then store into state and clear cache
        if (Cache.getCache(CacheName) !== undefined) {

            this.setState(Cache.getCache([CacheName]));
            Cache.setCache({ [CacheName]: undefined });
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // If data is not found & Check internet connection is available or not
        if (!this.props.marketData.marketTickers && await isInternet()) {

            // To get market ticker list
            this.props.getMarketTickers();
        }

        this.listenerRecieveMarketTicker = addListener(Method.RecieveMarketTicker, (receivedMessage) => {
            try {
                let newData = JSON.parse(receivedMessage);
                if (newData.Data) {
                    let originalResponse = newData.Data;

                    //if received data has more than 1 record than replace existing array
                    if (originalResponse.length > 1) {

                        //Loop through each pairs
                        originalResponse.map((pairItem, pairIndex) => {

                            //Get condition based color with old and new values
                            let currentRateColor = getColorCode(originalResponse[pairIndex].CurrentRate);
                            let changePerColorORF = getColorCode(originalResponse[pairIndex].ChangePer);

                            //Add Colors object and change float value with 8 digit decimal format
                            originalResponse[pairIndex].currentRateColor = currentRateColor;
                            originalResponse[pairIndex].changePerColor = changePerColorORF;
                            originalResponse[pairIndex].CurrentRate = parseFloatVal(pairItem.CurrentRate).toFixed(8);
                            originalResponse[pairIndex].Low24Hr = parseFloatVal(pairItem.Low24Hr).toFixed(8);
                            originalResponse[pairIndex].High24Hr = parseFloatVal(pairItem.High24Hr).toFixed(8);
                            originalResponse[pairIndex].LowWeek = parseFloatVal(pairItem.LowWeek).toFixed(8);
                            originalResponse[pairIndex].Low52Week = parseFloatVal(pairItem.Low52Week).toFixed(8);
                        })

                        //check for current screen
                        if (isCurrentScreen(this.props)) {

                            //Update State array
                            this.setState({ tickers: originalResponse })
                        } else {
                            Cache.setCache({ [CacheName]: { tickers: originalResponse } })
                        }
                    } else {

                        //If received response has only single array than find item in existing ticker and update it.

                        let tickerItem = originalResponse[0];

                        //Get condition based color with old and new values
                        let currentRateColor = getColorCode(tickerItem.CurrentRate);
                        let changePerColorTI = getColorCode(tickerItem.ChangePer);

                        //Add Colors object and change float value with 8 digit decimal format
                        tickerItem.currentRateColor = currentRateColor;
                        tickerItem.changePerColor = changePerColorTI;
                        tickerItem.CurrentRate = parseFloatVal(tickerItem.CurrentRate).toFixed(8);
                        tickerItem.Low24Hr = parseFloatVal(tickerItem.Low24Hr).toFixed(8);
                        tickerItem.High24Hr = parseFloatVal(tickerItem.High24Hr).toFixed(8);
                        tickerItem.LowWeek = parseFloatVal(tickerItem.LowWeek).toFixed(8);
                        tickerItem.Low52Week = parseFloatVal(tickerItem.Low52Week).toFixed(8);

                        //get local array of existing tickers
                        let updatedTickers = this.state.tickers;

                        //Find index of received record from array
                        let indexInTickers = updatedTickers.findIndex(el => el.PairId == tickerItem.PairId);

                        //If record is found than it will return value greater than -1 than update existing record with new data.
                        if (indexInTickers > -1) {
                            updatedTickers[indexInTickers] = tickerItem;

                            //check for current screen
                            if (isCurrentScreen(this.props)) {

                                //Update State array
                                this.setState({ tickers: updatedTickers })
                            } else {
                                Cache.setCache({ [CacheName]: { tickers: updatedTickers } })
                            }
                        }
                    }
                }
            } catch (error) {
                // logger('RecieveMarketTicker Error: ' + error.message);
            }
        })
    }

    componentWillUnmount() {
        //remove listener
        if (this.listenerRecieveMarketTicker) {
            this.listenerRecieveMarketTicker.remove();
        }
    }

    static getDerivedStateFromProps(props, state) {

        try {
            //Get All Updated field of Particular actions 
            var { marketData: { marketTickers } } = props;

            //check market tickers data is available or not
            if (marketTickers) {

                //if local marketTickers state is null or its not null and also different then new response then and only then validate response.
                if (state.marketTickers == null || (state.marketTickers != null && marketTickers !== state.marketTickers)) {
                    let newState = { marketTickers };

                    if (validateResponseNew({ response: marketTickers, isList: true })) {
                        let originalResponse = marketTickers.Response;

                        //Loop through each pairs
                        originalResponse.map((pairItem, pairIndex) => {

                            //Get condition based color with old and new values
                            let currentRateColor = getColorCode(originalResponse[pairIndex].CurrentRate);
                            let changePerColorOR = getColorCode(originalResponse[pairIndex].ChangePer);

                            originalResponse[pairIndex].currentRateColor = currentRateColor;
                            originalResponse[pairIndex].changePerColor = changePerColorOR;

                            originalResponse[pairIndex].CurrentRate = parseFloatVal(pairItem.CurrentRate).toFixed(8);
                            originalResponse[pairIndex].Low24Hr = parseFloatVal(pairItem.Low24Hr).toFixed(8);
                            originalResponse[pairIndex].High24Hr = parseFloatVal(pairItem.High24Hr).toFixed(8);
                            originalResponse[pairIndex].LowWeek = parseFloatVal(pairItem.LowWeek).toFixed(8);
                            originalResponse[pairIndex].Low52Week = parseFloatVal(pairItem.Low52Week).toFixed(8);
                        })

                        newState = Object.assign({}, newState, {
                            tickers: originalResponse
                        });
                    }

                    if (isCurrentScreen(props)) {
                        return Object.assign({}, state, newState);
                    } else {
                        Cache.setCache({ [CacheName]: newState });
                    }
                }
            }
        } catch (error) {
            return Object.assign({}, state, { tickers: [] });
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
            return true;
        } else {
            if (this.props.marketData.marketTickers !== nextProps.marketData.marketTickers ||
                this.state.tickers !== nextState.tickers) {
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    }

    render() {

        // check tickers are available then display item otherwise display empty view
        if (this.state.tickers && this.state.tickers.length > 0) {
            return <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{
                    marginTop: R.dimens.widget_left_right_margin,
                    marginBottom: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                {
                    this.state.tickers.map((item) => <MarketTickerItem key={item.PairId.toString()} width={this.state.itemWidth} item={item} preference={this.props.preference} />)
                }
            </ScrollView>;
        } else {
            return <View></View>;
        }
    }
}

class MarketTickerItem extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.props.item !== nextProps.item) {
            return true;
        }
        return false;
    }

    render() {

        // Get required field from props
        let { item } = this.props;

        //if colors are available in item then use it otherwise display default colors.
        let currentRateColor = item.currentRateColor ? item.currentRateColor : R.colors.white;
        currentRateColor = currentRateColor === R.colors.textPrimary ? R.colors.white : currentRateColor;
        let changePerColor;

        let sign = item.ChangePer != 0 ? (item.ChangePer > 0 ? '+' : '') : '';

        // apply changePer color based on sign
        if (sign === '' && item.ChangePer == 0) {
            changePerColor = R.colors.textSecondary;
        } else if (sign === '+') {
            changePerColor = R.colors.successGreen;
        } else {
            changePerColor = R.colors.failRed;
        }

        // check current rate value having ".00000000" then update with ".00"
        let currentRate = parseFloatVal(item.CurrentRate).toFixed(8);
        if (currentRate.includes('.00000000')) {
            currentRate = parseFloatVal(currentRate).toFixed(2);
        }

        return (
            <CardView
                style={{
                    width: this.props.itemWidth,
                    margin: R.dimens.margin,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: R.dimens.LoginButtonBorderRadius,
                    borderBottomLeftRadius: R.dimens.LoginButtonBorderRadius,
                    borderBottomRightRadius: 0,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, marginTop: R.dimens.widgetMargin }}>{item.PairName.replace('_', '/')}</TextViewMR>
                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: currentRateColor, marginTop: R.dimens.widgetMargin }}>{currentRate}</TextViewHML>
                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: changePerColor, marginBottom: R.dimens.widgetMargin }}>{sign}{parseFloatVal(item.ChangePer).toFixed(2) !== 'NaN' ? parseFloatVal(item.ChangePer).toFixed(2) : '0.00'}%</TextViewHML>
                </View>
            </CardView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get updated state from reducer
        marketData: state.MarketTickersReducer,
        preference: state.preference,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform MarketTicker Action
    getMarketTickers: () => dispatch(getMarketTickerList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketTickerWidget);