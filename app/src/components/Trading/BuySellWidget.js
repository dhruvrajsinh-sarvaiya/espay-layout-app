import React, { Component } from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import { isCurrentScreen } from '../Navigation';
import { validateResponseNew, isInternet, isEmpty } from '../../validations/CommonValidation';
import { changeTheme, addListener, getCurrentDate, getCurrentTime, parseIntVal, parseFloatVal } from '../../controllers/CommonUtils';
import { onBuySellTrade } from '../../actions/Trade/BuySellTradeActions';
import { connect } from 'react-redux';
import { CheckAmountValidation } from '../../validations/AmountValidation';
import ImageButton from '../../native_theme/components/ImageTextButton';
import { Method, Constants, Fonts, Events, ServiceUtilConstant } from '../../controllers/Constants';
import Button from '../../native_theme/components/Button';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import { getData } from '../../App';

class BuySellWidget extends Component {

    constructor(props) {
        super(props);

        // initial orderposition set to 0
        let orderPosition = 0;

        if (props.orderType !== undefined) {
            orderPosition = props.orderType;
        }

        // Bind All Method
        this.onIncDec = this.onIncDec.bind(this);
        this.isValidInput = this.isValidInput.bind(this);
        this.onSelectPercentage = this.onSelectPercentage.bind(this);
        this.onBuySell = this.onBuySell.bind(this);
        this.focusNextField = this.focusNextField.bind(this);

        //for focus on next field
        this.inputs = {};

        this.isMargin = getData(ServiceUtilConstant.KEY_IsMargin);

        //Define All initial State
        this.state = {
            type: orderPosition,
            module: props.module,
            percentages: ['25%', '50%', '75%', '100%'],
            selectedPer: '',
            amount: '',
            stop: '',
            total: '',
            equivalentUSD: '0.00',
            equivalent: '',
            firstBalance: '0',
            secondBalance: '0',
            fees: '0',
            feesApply: false,
            debitWalletId: '0',
            creditWalletId: '0',
            buyPrice: '0',
            sellPrice: '0',
            buyPriceOriginal: '0',
            sellPriceOriginal: '0',
            buyMinPrice: '0',
            buyMaxPrice: '0',
            socketBuyData: []
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //To listen for buy / sell type and its result from Trade Detail Screen
        this.listenerBuySellPairData = addListener(Events[this.isMargin ? 'BuySellPairDataMargin' : 'BuySellPairData'], async (result) => {

            let lastPrice = this.state.module == 4 ? 'buyPrice' : 'sellPrice';

            this.setState({
                result: result,
                amount: '',
                total: '',
                fees: this.state.module == 4 ? result.BuyFees.toString() : result.SellFees.toString(),
                [lastPrice]: result.CurrentRate.toString(),
                equivalentUSD: result.CurrentRate.toString(),
                ...findBalance(this.props, this.state.result, this.state.module)
            });

        });

        // Handle Signal-R response for WalletBalance
        this.listenerRecieveWalletBal = addListener(Method.RecieveWalletBal, (receivedMessage) => {

            // check for current screen
            if (isCurrentScreen(this.props)) {
                try {
                    let response = JSON.parse(receivedMessage);

                    if (response && response.Data) {

                        if ((response.EventTime && this.state.socketBuyData.length == 0) ||
                            (this.state.socketBuyData.length !== 0 && response.EventTime >= this.state.socketBuyData.EventTime)) {

                            if (response.Data.CoinName !== '') {
                                let pairName = this.state.result ? this.state.result.PairName : AppConfig.initialPair;
                                let firstCurrency = pairName.split('_')[0];
                                let secondCurrency = pairName.split('_')[1];

                                let state = {}
                                if (this.state.module == 4 && response.Data.CoinName === secondCurrency) {
                                    state = { secondBalance: response.Data.Balance };
                                }

                                if (this.state.module == 5 && response.Data.CoinName === firstCurrency) {
                                    state = { firstBalance: response.Data.Balance };
                                }

                                this.setState({ ...state, socketBuyData: response })
                            }

                        }
                    }
                } catch (error) {
                    //parsing error
                }
            }
        })

        // Handle Signal-R response for Buy-Sell input
        this.listenerBuySellInput = addListener(Events[this.isMargin ? 'BuySellInputMargin' : 'BuySellInput'], (item) => {

            //if buy sell trade widget is open than set data from BuyerSeller Book
            if (isCurrentScreen(this.props)) {
                try {
                    let { Price, Amount, module } = item;

                    //If receiving module is same as sender module than set data
                    if (this.state.module == module) {
                        let lastPrice = module == 4 ? 'buyPrice' : 'sellPrice';
                        this.setState({
                            [lastPrice]: parseFloatVal(Price).toFixed(8),
                            amount: parseFloatVal(Amount).toFixed(8),
                            total: parseFloatVal(Price * Amount).toFixed(8)
                        });
                    }
                } catch (error) {

                }
            }
        })
    };

    componentWillUnmount() {
        // Remove Listener
        if (this.listenerBuySellPairData) {
            this.listenerBuySellPairData.remove();
        }
        if (this.listenerRecieveWalletBal) {
            this.listenerRecieveWalletBal.remove();
        }
        if (this.listenerBuySellInput) {
            this.listenerBuySellInput.remove();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.state.module != nextState.module) {
            return true;
        } else {
            if (this.props.shouldDisplay) {
                // stop twice api call 
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    static getDerivedStateFromProps(props, state) {

        // if previous currency pair and new currency pair is differnt than set new currency pair in result,
        // also set wallets to null so it can be updated again.
        if (JSON.stringify(props.preference[ServiceUtilConstant.KEY_CurrencyPair]) !== JSON.stringify(state.result)) {
            return Object.assign({}, state, {
                result: props.preference[ServiceUtilConstant.KEY_CurrencyPair],
                wallets: null,
            });
        }

        if (props.shouldDisplay && isCurrentScreen(props)) {

            try {

                // if orderType and type is not match than set type=orderType
                if (state.type != props.orderType) {
                    return Object.assign({}, state, {
                        type: props.orderType,
                        amount: ''
                    })
                }

                //Get All Updated field of Particular actions
                const { buySellTradeData: { buySellTrade }, pairRatesData: { pairRates }, wallets: { wallets, marginWallets }, pairRecord, marketCapData: { marketCap } } = props;

                let buySellWallets = getData(ServiceUtilConstant.KEY_IsMargin) ? marginWallets : wallets;

                if (state.result !== pairRecord) {
                    if (pairRecord) {
                        //Store list
                        let lastPriceKey = state.module == 4 ? 'buyPrice' : 'sellPrice';
                        return Object.assign({}, state, {
                            equivalentUSD: pairRecord.CurrentRate.toString(),
                            result: pairRecord,
                            fees: state.module == 4 ? pairRecord.BuyFees.toString() : pairRecord.SellFees.toString(),
                            [lastPriceKey]: pairRecord.CurrentRate
                        })
                    }
                }

                //if pairRates response is success then handle resposne
                if (pairRates) {

                    //if local pairRates state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairRates == null || (state.pairRates != null && pairRates !== state.pairRates)) {

                        if (validateResponseNew({ response: pairRates, isList: true })) {

                            return Object.assign({}, state, {
                                pairRates,
                                buyMinPrice: pairRates.response.BuyMinPrice.toFixed(8),
                                buyMaxPrice: pairRates.response.BuyMaxPrice.toFixed(8),
                            })
                        } else {
                            return Object.assign({}, state, {
                                pairRates
                            })
                        }
                    }
                }

                // To check marketCap is null or not
                if (marketCap) {
                    //if marketCap is null or old and new data of tradeHistory  and response is different then validate it
                    if (state.marketCap == null || (state.marketCap != null && marketCap !== state.marketCap)) {

                        validateResponseNew({ response: marketCap, isList: true })

                        if (marketCap.response != null) {
                            return Object.assign({}, state, {
                                marketCap,
                                buyPriceOriginal: parseFloatVal(marketCap.response.LastPrice).toFixed(8),
                                sellPriceOriginal: parseFloatVal(marketCap.response.LastPrice).toFixed(8),
                                buyPrice: parseFloatVal(marketCap.response.LastPrice).toFixed(8),
                                sellPrice: parseFloatVal(marketCap.response.LastPrice).toFixed(8),
                            });
                        } else {
                            return Object.assign({}, state, {
                                marketCap
                            })
                        }
                    }
                }

                //If ListCoin data is available then handle the response
                if (buySellWallets) {

                    if (state.wallets == null || (state.wallets != null && buySellWallets !== state.wallets)) {

                        //Validate Response and Check balance if Pair is available in response
                        if (validateResponseNew({ response: getData(ServiceUtilConstant.KEY_IsMargin) ? buySellWallets : buySellWallets.Wallets, isList: true })) {

                            return Object.assign({}, state, {
                                wallets: buySellWallets,
                                ...findBalance(props, state.result, state.module)
                            });
                        } else {
                            return Object.assign({}, state, {
                                wallets: buySellWallets,
                            });
                        }
                    }
                }

                //if buy sell response is success then handle resposne
                if (buySellTrade) {

                    return Object.assign({}, state, {
                        amount: '',
                        total: '',
                        stop: '',
                    })
                }
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    //On increment or decrement button
    onIncDec(item, isIncrement) {
        //Getthering all common data that can use for everyone in this method.

        //If Order type is market order then return original market price in last price otherwise return displayed price in text box
        let buyPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.buyPriceOriginal : this.state.buyPrice;
        let sellPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.sellPriceOriginal : this.state.sellPrice;
        let lastPrice = parseFloatVal(this.state.module == 4 ? buyPrice : sellPrice);

        let amount = parseFloatVal(this.state.amount === '' ? '0' : this.state.amount);
        let stop = parseFloatVal(this.state.stop === '' ? '0' : this.state.stop);
        let equUSD = this.state.equivalentUSD;
        let equivalent = null;
        let total = 0;

        switch (item) {
            case R.strings.price:

                //increment or decrement last price
                lastPrice = isIncrement ? lastPrice + 0.00000001 : lastPrice - 0.00000001;

                //calculate new total based on new last price.
                total = amount * lastPrice;

                //If fees applies then total changes
                if (this.state.feesApply) {

                    //grandtotal with fees logic 
                    //total = (amt*price) + (((amt*price) * fees) / 100);
                    total = total + (total * parseFloatVal(this.state.fees) / 100);
                }

                //calculate equivalent value
                equivalent = (lastPrice * equUSD).toFixed(2);

                //if value is satisfied with 0 or greather than 0 condition than store last price and total
                let lastPriceKey = this.state.module == 4 ? 'buyPrice' : 'sellPrice';
                lastPrice >= 0 && this.setState({ [lastPriceKey]: lastPrice.toFixed(8), total: total.toFixed(8), equivalent: equivalent, selectedPer: '' })

                break;
            case R.strings.Amount:

                //increment or decrement amount
                amount = isIncrement ? amount + 1 : amount - 1;

                //if type is Limit order or Stop Limit then calculate total based on last price
                if (this.state.type == Constants.OrderTypes.LIMIT_ORDER || this.state.type == Constants.OrderTypes.STOP_LIMIT_ORDER) {
                    total = amount * lastPrice;
                }

                //If fees applies then total changes
                if (this.state.feesApply) {

                    //grandtotal with fees logic 
                    //total = (amt*price) + (((amt*price) * fees) / 100);
                    total = total + (total * parseFloatVal(this.state.fees) / 100);
                }

                //if value is satisfied with 0 or greather than 0 condition than store amount and total
                amount >= 0 && this.setState({ amount: amount.toFixed(8), total: total.toFixed(8), selectedPer: '' })

                break;
            case R.strings.stop:

                //increment or decrement stop value
                stop = isIncrement ? stop + 0.00000001 : stop - 0.000000001;

                //if value is satisfied with 0 or greather than 0 condition than store stop value
                stop >= 0 && this.setState({ stop: stop.toFixed(8), selectedPer: '' })

                break;
        }
    }

    //method to call whenever any input field will change runtime.
    isValidInput(value, type) {
        //Getthering all common data that can use for everyone in this method.

        //If Order type is market order then return original market price in last price otherwise return displayed price in text box
        let buyPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.buyPriceOriginal : this.state.buyPrice;
        let sellPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.sellPriceOriginal : this.state.sellPrice;
        let lastPrice = parseFloatVal(this.state.module == 4 ? buyPrice : sellPrice);

        let amount = parseFloatVal(this.state.amount === '' ? '0' : this.state.amount);
        let total = parseFloatVal(this.state.total === '' ? '0' : this.state.total);
        let equUSD = this.state.equivalentUSD;
        let equivalent = null;

        //if value is not empty then check amount validation
        if (value !== '') {
            if (CheckAmountValidation(value)) {
                switch (type) {
                    case R.strings.price:
                        //parsing last price so can calculate new total based on last price.
                        lastPrice = parseFloatVal(value);
                        total = amount * lastPrice;

                        //If fees applies then total changes
                        if (this.state.feesApply) {

                            //grandtotal with fees logic 
                            //total = (amt*price) + (((amt*price) * fees) / 100);
                            total = total + (total * parseFloatVal(this.state.fees) / 100);
                        }

                        //calculate equivalent value
                        equivalent = (lastPrice * equUSD).toFixed(2);

                        //if value is satisfied with 0 or greather than 0 condition than store last price and total value
                        let lastPriceKey = this.state.module == 4 ? 'buyPrice' : 'sellPrice';
                        lastPrice >= 0 && this.setState({ [lastPriceKey]: value, total: total.toFixed(8), equivalent: equivalent, selectedPer: '' })

                        break;
                    case R.strings.Amount:

                        //parsing amount so can calculate new total based on last price.
                        amount = parseFloatVal(value);

                        //if type is Limit order or Stop Limit then calculate total based on last price
                        if (this.state.type == Constants.OrderTypes.LIMIT_ORDER || this.state.type == Constants.OrderTypes.STOP_LIMIT_ORDER) {
                            total = amount * lastPrice;
                        }

                        //If fees applies then total changes.
                        if (this.state.feesApply) {

                            //grandtotal with fees logic 
                            //total = (amt*price) + (((amt*price) * fees) / 100);
                            total = total + (total * parseFloatVal(this.state.fees) / 100);
                        }

                        //if value is satisfied with 0 or greather than 0 condition than store amount and total value
                        amount >= 0 && this.setState({ amount: value, total: total.toFixed(8), selectedPer: '' })

                        break;
                    case R.strings.stop:

                        //store new stop value
                        this.setState({ stop: value, selectedPer: '' })

                        break;
                    case R.strings.total:

                        total = parseFloatVal(value);

                        //if type is Limit order or Stop Limit then calculate amount based on last price
                        if (this.state.type == Constants.OrderTypes.LIMIT_ORDER || this.state.type == Constants.OrderTypes.STOP_LIMIT_ORDER) {
                            amount = (total / lastPrice);

                            //if fess applies then total changes
                            if (this.state.feesApply) {
                                amount = total / (lastPrice + (lastPrice * (parseFloatVal(this.state.fees) / 100)));
                            }
                        }

                        //store new stop value
                        this.setState({ total: value, amount: amount.toFixed(8), selectedPer: '' })

                        break;
                }
            }
        } else {
            switch (type) {
                case R.strings.price:

                    //store empty lastprice and new total
                    let lastPriceKey = this.state.module == 4 ? 'buyPrice' : 'sellPrice';
                    this.setState({ [lastPriceKey]: value, total: '', equivalent: '0.00', selectedPer: '' });

                    break;
                case R.strings.Amount:

                    //store empty amount and new total
                    this.setState({ amount: value, total: '', selectedPer: '' })

                    break;
                case R.strings.stop:

                    //store stop empty value
                    this.setState({ stop: value, selectedPer: '' })

                    break;
                case R.strings.total:

                    //store stop empty value
                    this.setState({ total: value, amount: '', selectedPer: '' })

                    break;
            }
        }
    }

    onSelectPercentage(item) {
        let total = 0, amount = 0;

        //If Order type is market order then return original market price in last price otherwise return displayed price in text box
        let buyPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.buyPriceOriginal : this.state.buyPrice;
        let sellPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.sellPriceOriginal : this.state.sellPrice;
        let lastPrice = parseFloatVal(this.state.module == 4 ? buyPrice : sellPrice);

        let balance = this.state.module == 4 ? this.state.secondBalance : this.state.firstBalance;

        //remove percentage by finding its index
        let pos = item.indexOf('%');
        let per = parseIntVal(item.substring(0, pos));

        if (lastPrice > 0) {
            if (this.state.module == 4) {

                //calculate new total based on percentage
                total = (parseFloatVal(balance) * per) / 100;

                //calculate new amount value based on total
                amount = total / (parseFloatVal(lastPrice));

                //if fees applies then amount changes
                if (this.state.feesApply) {

                    //amount = total / (price + ((price * fees) /100))
                    amount = total / (parseFloatVal(lastPrice) + (parseFloatVal(lastPrice) * (parseFloatVal(this.state.fees) / 100)));
                }

                //store current selected percentage, amount and total.
                this.setState({ selectedPer: item, amount: amount.toFixed(8), total: total.toFixed(8) })
            }

            if (this.state.module == 5) {
                amount = (parseFloatVal(balance) * per) / 100;

                //calculate total based on amount
                total = amount * parseFloatVal(lastPrice);

                //if fees applies then total changes
                if (this.state.feesApply) {

                    //total = (amt*prc) + ((amt*price * fees)/100)
                    total = total + (total * parseFloatVal(this.state.fees) / 100);
                }

                //store current selected percentage, amount and total.
                this.setState({ selectedPer: item, amount: amount.toFixed(8), total: total.toFixed(8) })
            }
        } else {
            this.setState({ selectedPer: item, amount: 0, total: 0 })
        }

    }

    async onBuySell() {

        //If Order type is market order then return original market price in last price otherwise return displayed price in text box
        let buyPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.buyPriceOriginal : this.state.buyPrice;
        let sellPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.sellPriceOriginal : this.state.sellPrice;
        let lastPrice = this.state.module == 4 ? buyPrice : sellPrice;

        let amount = parseFloatVal(this.state.amount);
        let balance = parseFloatVal(this.state.module == 4 ? this.state.secondBalance : this.state.firstBalance);
        let total = parseFloatVal(this.state.total);
        let stop = 0;

        if (this.state.type == Constants.OrderTypes.STOP_LIMIT_ORDER) {
            //If stop value is empty then show msg
            if (isEmpty(this.state.stop)) {
                this.props.Toast(R.strings.StopNotEmpty)
                return;
            }

            //If stop value is less then or equal to 0 then show msg
            if (parseFloatVal(this.state.stop) <= 0) {
                this.props.Toast(R.strings.StopGreaterThanZero)
                return;
            }

            stop = parseFloatVal(this.state.stop);
        }

        //If price is empty, and Order Type is not Market Order then show msg
        if (isEmpty(lastPrice) && this.state.type != Constants.OrderTypes.MARKET_ORDER) {

            let toastMsg = this.state.type == Constants.OrderTypes.STOP_LIMIT_ORDER ? R.strings.LimitNotEmpty : R.strings.PriceNotEmpty;
            this.props.Toast(toastMsg)
            return;
        }

        lastPrice = parseFloatVal(lastPrice);

        //If price is less than or equal to 0, and Order Type is not Market Order then show msg
        if (parseFloatVal(lastPrice) <= 0 && this.state.type != Constants.OrderTypes.MARKET_ORDER) {
            let toastMsg = this.state.type == Constants.OrderTypes.STOP_LIMIT_ORDER ? R.strings.LimitGreaterThanZero : R.strings.PriceGreaterThanZero;
            this.props.Toast(toastMsg)
            return;
        }

        //If amount is empty then show msg
        if (isEmpty(this.state.amount)) {
            this.props.Toast(R.strings.AmountNotEmpty)
            //showAlert(R.strings.status, R.strings.AmountNotEmpty)
            return;
        }

        //if amount is less then or equal to 0 then show msg
        if (amount <= 0) {
            this.props.Toast(R.strings.AmountGreaterThanZero)
            return;
        }

        //if user balance is less then or equal to 0 then show msg 
        if (balance <= 0) {
            this.props.Toast(R.strings.InsufficientBalance)
            return;
        }

        // if creditWaleltId is 0 then show message
        if (this.state.creditWalletId === '0') {
            this.props.Toast(R.strings.creditWalletMessage)
            return;
        }

        // if debitWalletId is 0 then show message
        if (this.state.debitWalletId === '0') {
            this.props.Toast(R.strings.debitWalletMessage)
            return;
        }

        //if total is greater than balance then show msg
        if (total > balance) {
            this.props.Toast(R.strings.AmountLessBalance)
            return;
        }

        let finalTotal = amount * lastPrice;
        let feePer = parseFloatVal(this.state.fees);

        //setting default params
        let params = {
            FeePer: this.state.fees,
            Fee: (finalTotal * feePer) / 100,
            CurrencyPairID: this.state.result.PairId,
            DebitWalletID: this.state.debitWalletId,
            CreditWalletID: this.state.creditWalletId,
            OrderSide: this.state.module,
            StopPrice: stop,
            Price: lastPrice,
            Amount: this.state.amount,
            Total: this.state.total,
            OrderType: this.state.type,
            childCurrency: this.state.result.ChildCurrency,
            dateTime: getCurrentDate() + ' ' + getCurrentTime(),
            pair: this.state.result.PairName,
            isMargin: this.isMargin ? 1 : 0
        };

        //if internet is available then call buy sell method.
        if (await isInternet()) {
            if (this.state.module == 4) {
                this.props.updateBuyParams(params);
            }
            if (this.state.module == 5) {
                this.props.updateSellParams(params);
            }
            this.props.onBuySellTrade(params)
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {

        let isLimitOrSpotOrder = this.state.type == Constants.OrderTypes.LIMIT_ORDER || this.state.type == Constants.OrderTypes.SPOT_ORDER;
        let isMarketOrder = this.state.type == Constants.OrderTypes.MARKET_ORDER;
        let isStopLimitOrder = this.state.type == Constants.OrderTypes.STOP_LIMIT_ORDER;

        let pairName = this.state.result ? this.state.result.PairName : AppConfig.initialPair;
        let buySellFirstCurrency = pairName.split('_')[0];
        let buySellSecondCurrency = pairName.split('_')[1];

        //If Order type is market order then return original market price in last price otherwise return displayed price in text box
        let buyPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.buyPriceOriginal : this.state.buyPrice;
        let sellPrice = (this.state.type == Constants.OrderTypes.MARKET_ORDER) ? this.state.sellPriceOriginal : this.state.sellPrice;
        let lastPrice = parseFloatVal(this.state.module == 4 ? buyPrice : sellPrice);
        let amount = parseFloatVal(this.state.amount === '' ? '0' : this.state.amount);
        let finalTotal = amount * lastPrice;

        return (
            <SafeView style={{ flex: 1 }}>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ flex: 1, flexDirection: 'column' }} >

                        <View style={{ flexDirection: 'column', paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding }}>

                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{this.state.module == 4 ? R.strings.buy : R.strings.sell}</TextViewMR>

                            <View style={{ paddingTop: R.dimens.WidgetPadding, paddingBottom: isMarketOrder ? R.dimens.widgetMargin : R.dimens.WidgetPadding }}>

                                {/* Price Edit Text */}
                                {
                                    isLimitOrSpotOrder && !isMarketOrder && !isStopLimitOrder &&
                                    <View>
                                        <TradeTextInput
                                            reference={input => { this.inputs['etLimitPrice'] = input; }}
                                            returnKeyType={"next"}
                                            onSubmitEditing={() => { this.focusNextField('etAmount') }}
                                            blurOnSubmit={false}
                                            value={this.state.module == 4 ? this.state.buyPrice : this.state.sellPrice}
                                            style={{ marginBottom: 0 }}
                                            onChangeText={(text) => this.isValidInput(text, R.strings.price)}
                                            placeholder={R.strings.price}
                                            onIncrement={() => this.onIncDec(R.strings.price, true)}
                                            onDecrement={() => this.onIncDec(R.strings.price, false)}
                                            currency={buySellSecondCurrency} />
                                    </View>
                                }

                                {/* Market Price */}
                                {
                                    isMarketOrder &&
                                    <CardView cardBackground={R.colors.bottomMenuBackground} cardElevation={0} style={{ marginBottom: R.dimens.widget_top_bottom_margin }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}>{R.strings.optimalMarketPrice}</TextViewHML>
                                    </CardView>
                                }

                                {/* Stop and Limit Edit Text */}
                                {
                                    isStopLimitOrder &&
                                    <View>
                                        <TradeTextInput
                                            reference={input => { this.inputs['etStopPrice'] = input; }}
                                            returnKeyType={"next"}
                                            onSubmitEditing={() => { this.focusNextField('etStopLimitPrice') }}
                                            blurOnSubmit={false}
                                            value={this.state.stop}
                                            style={{ marginBottom: R.dimens.widget_top_bottom_margin }}
                                            onChangeText={(text) => this.isValidInput(text, R.strings.stop)}
                                            placeholder={R.strings.stop}
                                            onIncrement={() => this.onIncDec(R.strings.stop, true)}
                                            onDecrement={() => this.onIncDec(R.strings.stop, false)} />
                                        <TradeTextInput
                                            reference={input => { this.inputs['etStopLimitPrice'] = input; }}
                                            returnKeyType={"next"}
                                            onSubmitEditing={() => { this.focusNextField('etAmount') }}
                                            blurOnSubmit={false}
                                            value={this.state.module == 4 ? this.state.buyPrice : this.state.sellPrice}
                                            style={{ marginBottom: 0 }}
                                            onChangeText={(text) => this.isValidInput(text, R.strings.price)}
                                            placeholder={R.strings.limit}
                                            onIncrement={() => this.onIncDec(R.strings.price, true)}
                                            onDecrement={() => this.onIncDec(R.strings.price, false)} />

                                    </View>
                                }
                            </View>

                            <View>
                                {/* Amount Edit Text */}
                                <TradeTextInput
                                    reference={input => { this.inputs['etAmount'] = input; }}
                                    returnKeyType={"done"}
                                    value={this.state.amount}
                                    onChangeText={(text) => this.isValidInput(text, R.strings.Amount)}
                                    placeholder={R.strings.Amount}
                                    currency={buySellFirstCurrency} />
                            </View>

                            {/* 25%, 50%, 75%, 100% buttons */}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.blockchain_textbox_border, marginRight: R.dimens.blockchain_textbox_border }}>
                                {this.state.percentages.map((item, index) =>
                                    <View key={item} style={{
                                        flex: 1
                                    }}>
                                        <ImageButton
                                            name={item}
                                            onPress={() => this.onSelectPercentage(item)}
                                            isHML
                                            style={{
                                                margin: 0,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth: R.dimens.pickerBorderWidth,
                                                borderColor: this.state.selectedPer == item ? R.colors.accent : R.colors.tradeInput,
                                            }}
                                            textStyle={{
                                                fontSize: R.dimens.dashboardSelectedTabText,
                                                paddingTop: R.dimens.widgetMargin,
                                                paddingBottom: R.dimens.widgetMargin,
                                                textAlignVertical: 'center',
                                                textAlign: 'center',
                                                color: this.state.selectedPer == item ? R.colors.accent : R.colors.textPrimary
                                            }}
                                        />
                                    </View>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.padding_left_right_margin, marginRight: R.dimens.LoginScreenTopMargin }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.available} : </TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{this.state.module == 4 ? this.state.secondBalance + " " + buySellSecondCurrency : this.state.firstBalance + " " + buySellFirstCurrency}</TextViewHML>
                            </View>

                            {/* Total */}
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginRight: R.dimens.widgetMargin }}>{R.strings.total}</TextViewHML>
                                <TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.widgetMargin }}>{finalTotal ? parseFloatVal(finalTotal).toFixed(8) : parseFloatVal('0.0').toFixed(8)}</TextViewHML>
                            </View>

                        </View>
                    </View>
                </ScrollView>

                {/* buy & Sell button */}
                <View style={{ paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding, marginTop: R.dimens.widget_top_bottom_margin }}>
                    <Button
                        title={this.state.module == 4 ? R.strings.buy : R.strings.sell}
                        textStyle={{ fontSize: R.dimens.smallText }}
                        style={{ padding: 0, backgroundColor: this.state.module == 4 ? R.colors.buyerGreen : R.colors.sellerPink }}
                        onPress={this.onBuySell} />
                </View>
            </SafeView>
        );
    }
}

class TradeTextInput extends Component {

    render() {
        let props = this.props;

        let value = (props.value !== undefined && props.value !== '') ? props.value.toString() : '';

        return (
            <CardView style={{ padding: 0, ...props.style }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: R.dimens.margin,
                    paddingRight: R.dimens.margin,
                }}>

                    <TextInput
                        ref={props.reference}
                        numberOfLines={1}
                        placeholder={props.placeholder}
                        placeholderTextColor={R.colors.textSecondary}
                        underlineColorAndroid='transparent'
                        returnKeyType={props.returnKeyType}
                        returnKeyLabel={props.returnKeyLabel}
                        onSubmitEditing={props.onSubmitEditing}
                        blurOnSubmit={props.blurOnSubmit}
                        keyboardType='numeric'
                        value={value}
                        onChangeText={props.onChangeText}
                        style={{
                            flex: 1,
                            margin: 0,
                            fontSize: R.dimens.smallText,
                            color: R.colors.textSecondary,
                            height: R.dimens.dashboardMenuIcon * 2,
                            fontFamily: Fonts.HindmaduraiLight
                        }} />

                    {/* for show Up-Down Arrow */}
                    {
                        props.onIncrement !== undefined && props.onDecrement !== undefined &&
                        <View style={{ flexDirection: 'column' }}>
                            <ImageButton
                                icon={R.images.IC_FILL_SMALL_UP_ARROW}
                                iconStyle={{ tintColor: R.colors.accent, height: R.dimens.dashboardMenuIcon, width: R.dimens.dashboardMenuIcon }}
                                style={{ margin: 0 }}
                                resizeMode={'contain'}
                                onPress={props.onIncrement} />

                            <ImageButton
                                icon={R.images.IC_FILL_SMALL_DOWN_ARROW}
                                iconStyle={{ tintColor: R.colors.accent, height: R.dimens.dashboardMenuIcon, width: R.dimens.dashboardMenuIcon }}
                                style={{ margin: 0 }}
                                resizeMode={'stretch'}
                                onPress={props.onDecrement} />
                        </View>
                    }
                </View>
            </CardView>
        )
    }
}

function mapStatToProps(state) {
    // Updated Data of BuySellTrade, PairRates, Wallets, Preference and MarketCap
    return {
        buySellTradeData: state.buySellTradeReducer,
        pairRatesData: state.pairRatesReducer,
        wallets: state.tradeWalletReducer,
        preference: state.preference,
        marketCapData: state.marketCapReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform Buy Sell trade Action
        onBuySellTrade: (params) => dispatch(onBuySellTrade(params)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(BuySellWidget);

/**
 * To find balance from Response for selected Currency Pair
 */
function findBalance(props, pair, moduleName) {

    try {

        // extract margin wallets response
        let { wallets: { wallets, marginWallets } } = props;

        // if pair is not null or undefined than get balance
        if (pair) {

            let buySellWallets = getData(ServiceUtilConstant.KEY_IsMargin) ? marginWallets : wallets;
            let bsSubWallets = getData(ServiceUtilConstant.KEY_IsMargin) ? buySellWallets.Data : buySellWallets.Wallets;

            //Check if listCoin has Wallets
            if (buySellWallets && bsSubWallets && bsSubWallets.length > 0) {

                // extract first and second currency
                let firstCoin = pair.PairName.split('_')[0];
                let secondCoin = pair.PairName.split('_')[1];

                // get index of first and second currency
                let firstCoinIndex = bsSubWallets.findIndex(item => (item.CoinName === firstCoin && item.IsDefaultWallet == 1));
                let secondCoinIndex = bsSubWallets.findIndex(item => (item.CoinName === secondCoin && item.IsDefaultWallet == 1));

                // get balances for both currency
                let firstCoinBalance = firstCoinIndex > -1 ? bsSubWallets[firstCoinIndex].Balance : 0;
                let secondCoinBalance = secondCoinIndex > -1 ? bsSubWallets[secondCoinIndex].Balance : 0;

                // set walletId to 0 initially
                let debitWalletId = 0, creditWalletId = 0;

                // if first coin index is found then get wallet id for it
                if (firstCoinIndex > -1) {
                    if (moduleName == 4) {
                        creditWalletId = bsSubWallets[firstCoinIndex].AccWalletID;
                    } else {
                        debitWalletId = bsSubWallets[firstCoinIndex].AccWalletID;
                    }
                }

                // if second coin index is found then get wallet id for it
                if (secondCoinIndex > -1) {
                    if (moduleName == 4) {
                        debitWalletId = bsSubWallets[secondCoinIndex].AccWalletID;
                    } else {
                        creditWalletId = bsSubWallets[secondCoinIndex].AccWalletID;
                    }
                }

                return {
                    firstBalance: firstCoinBalance.toString(),
                    secondBalance: secondCoinBalance.toString(),
                    debitWalletId: debitWalletId.toString(),
                    creditWalletId: creditWalletId.toString()
                }
            }
        }
    } catch (error) {
        return {};
    }
}