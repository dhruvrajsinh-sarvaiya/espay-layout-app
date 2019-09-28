import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { isInternet, getColorCode, validateResponseNew } from '../../../validations/CommonValidation';
import { addListener, changeTheme, windowPercentage, parseFloatVal, } from '../../../controllers/CommonUtils';
import R from '../../../native_theme/R';
import { getMarketTickersBO, clearMarketTickersBOData } from '../../../actions/Trading/TradingMarketTickersActions';
import CardView from '../../../native_theme/components/CardView';
import { Method } from '../../../controllers/Constants';
import { isCurrentScreen, addComponentDidResume } from '../../Navigation';
import { Cache } from '../../../App';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = R.screen();
const slideWidth = windowPercentage(85, viewportWidth);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth;

const CacheName = 'MarketTickerWidget';

class MarketTickerWidget extends Component {

    constructor(props) {
        super(props)

        addComponentDidResume({ props, componentDidResume: this.componentDidResume, widgetName: CacheName });

        this.state = {
            ticker: null,
            isMargin: props.isMargin
        };
    };

    componentDidResume = () => {

        if (Cache.getCache(CacheName) !== undefined) {

            this.setState(Cache.getCache([CacheName]));
            Cache.setCache({ [CacheName]: undefined });
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check internet connection is available or not
        if (await isInternet()) {
            if (this.state.isMargin) {
                // To get market ticker list
                this.props.getMarketTickers({ IsMargin: 1 });
            } else {

                // To get market ticker list
                this.props.getMarketTickers({});
            }
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
                            let changePerColor = getColorCode(originalResponse[pairIndex].ChangePer);

                            //Add Colors object and change float value with 8 digit decimal format
                            originalResponse[pairIndex].currentRateColor = currentRateColor;
                            originalResponse[pairIndex].changePerColor = changePerColor;
                            originalResponse[pairIndex].CurrentRate = parseFloatVal(pairItem.CurrentRate).toFixed(8);
                            originalResponse[pairIndex].Low24Hr = parseFloatVal(pairItem.Low24Hr).toFixed(8);
                            originalResponse[pairIndex].High24Hr = parseFloatVal(pairItem.High24Hr).toFixed(8);
                            originalResponse[pairIndex].LowWeek = parseFloatVal(pairItem.LowWeek).toFixed(8);
                            originalResponse[pairIndex].Low52Week = parseFloatVal(pairItem.Low52Week).toFixed(8);
                        })

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
                        let changePerColor = getColorCode(tickerItem.ChangePer);

                        //Add Colors object and change float value with 8 digit decimal format
                        tickerItem.currentRateColor = currentRateColor;
                        tickerItem.changePerColor = changePerColor;
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
        // remove listener g
        if (this.listenerRecieveMarketTicker) {
            this.listenerRecieveMarketTicker.remove();
        }
        // clear data
        this.props.clearMarketTickers();
    }

    static getDerivedStateFromProps(props, state) {

        try {
            var { marketData: { marketTickers } } = props;

            if (marketTickers !== state.marketTickers) {

                let newState = { marketTickers, tickers: [] };

                if (validateResponseNew({ response: marketTickers, isList: true })) {
                    let originalResponse = marketTickers.Response;

                    //Loop through each pairs
                    originalResponse.map((pairItem, pairIndex) => {


                        //Get condition based color with old and new values
                        let currentRateColor = getColorCode(originalResponse[pairIndex].CurrentRate);
                        let changePerColor = getColorCode(originalResponse[pairIndex].ChangePer);

                        originalResponse[pairIndex].currentRateColor = currentRateColor;
                        originalResponse[pairIndex].changePerColor = changePerColor;
                        originalResponse[pairIndex].PairName = pairItem.PairName.replace('_', '/');

                        originalResponse[pairIndex].ChangePer = parseFloat(pairItem.ChangePer).toFixed(8);
                        originalResponse[pairIndex].Volume24 = parseFloat(pairItem.Volume24).toFixed(8);
                        originalResponse[pairIndex].CurrentRate = parseFloat(pairItem.CurrentRate).toFixed(8);
                        originalResponse[pairIndex].Low24Hr = parseFloat(pairItem.Low24Hr).toFixed(8);
                        originalResponse[pairIndex].High24Hr = parseFloat(pairItem.High24Hr).toFixed(8);
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
        } catch (error) {
            return Object.assign({}, state, { tickers: [] });
        }

        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    render() {
        
        if (this.state.tickers && this.state.tickers.length > 0) {
            return <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>

                <Carousel
                    ref={component => this.slider = component}
                    data={this.state.tickers}
                    renderItem={({ item }) => <FlatlistItem item={item} />}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    inactiveSlideScale={0.95}
                    inactiveSlideOpacity={1}
                    hasParallaxImages={true}
                    firstItem={0}
                    activeSlideAlignment={'center'}
                    activeAnimationType={'spring'}
                    loop={true}
                    activeAnimationOptions={{
                        friction: 4,
                        tension: 40
                    }}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                />

            </View>;
        } else {
            return <View></View>;
        }
    }
}

class FlatlistItem extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        //Chek Old list item and New list item are diffrent than only render component  
        if (this.props.item !== nextProps.item) {
            return true;
        }
        return false;
    }

    render() {

        let { PairName, Volume24, CurrentRate, ChangePer, High24Hr, Low24Hr } = this.props.item;

        return (
            <CardView style={{
                marginRight: R.dimens.widgetMargin,
                marginLeft: R.dimens.widgetMargin,
                marginTop: R.dimens.widget_top_bottom_margin,
                marginBottom: R.dimens.widget_top_bottom_margin,
                paddingBottom: R.dimens.widgetMargin
            }}>
                {/* Display PairName and Volume */}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: R.colors.cardValue, fontSize: R.dimens.smallText }}>{PairName}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{R.strings.volume}: </Text>
                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontWeight: 'bold' }}>{Volume24}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
                    {/* Display Price, High24, Low24 and Change */}
                    <View style={{ flex: 1, paddingLeft: R.dimens.widget_left_right_margin }}>

                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{R.strings.price}</Text>
                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontWeight: 'bold' }}>{CurrentRate}</Text>

                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin }}>{R.strings.high}</Text>
                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontWeight: 'bold' }}>{High24Hr}</Text>

                    </View>
                    <View style={{ backgroundColor: R.colors.textSecondary, height: '100%', width: R.dimens.separatorHeight, marginRight: R.dimens.widget_left_right_margin, marginLeft: R.dimens.widget_left_right_margin }} />
                    <View style={{ flex: 1 }}>

                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{R.strings.change}</Text>
                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontWeight: 'bold' }}>{ChangePer}</Text>

                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin }}>{R.strings.low}</Text>
                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontWeight: 'bold' }}>{Low24Hr}</Text>
                    </View>
                </View>
            </CardView>)
    }
}

const mapStateToProps = (state) => {
    return {
        marketData: state.marketTickerReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    getMarketTickers: (payload) => dispatch(getMarketTickersBO(payload)),
    //clear data
    clearMarketTickers: () => dispatch(clearMarketTickersBOData())
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketTickerWidget);