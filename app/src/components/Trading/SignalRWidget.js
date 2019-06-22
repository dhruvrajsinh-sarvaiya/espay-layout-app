import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { getData, setData } from '../../App';
import { ServiceUtilConstant, Method, Events } from '../../controllers/Constants';
import { isInternet, getColorCode } from '../../validations/CommonValidation';
import * as signalR from '@aspnet/signalr';
import { sendEvent, logger, showAlert, addListener, showTimeoutRequestDialog, parseFloatVal, getBaseUrl } from '../../controllers/CommonUtils';
import R from '../../native_theme/R';
import moment from 'moment';
import { refreshMarkets } from '../../actions/Trade/TradeActions';
import PushNotification from 'react-native-push-notification';

class SignalRWidget extends Component {

    constructor(props) {
        super(props);

        // get data from preference
        let token = getData(ServiceUtilConstant.ACCESS_TOKEN);

        if (token !== null) {
            token = token.replace('Bearer ', '');
        }

        //Define All initial State
        this.state = {
            marketList: null,
            currencyPair: getData(ServiceUtilConstant.KEY_CurrencyPair).PairName,

            hubConnectionMarket:
                new signalR.HubConnectionBuilder()
                    .withUrl(getBaseUrl()+'Market')
                    .configureLogging(signalR.LogLevel.None)
                    .build(),

            hubConnectionChat:
                new signalR.HubConnectionBuilder()
                    .withUrl(getBaseUrl()+'Chat', {
                        transport: signalR.HttpTransportType.LongPolling,
                        accessTokenFactory: () => token
                    })
                    .configureLogging(signalR.LogLevel.None)
                    .build(),

            isChatClosed: true
        }
    }

    // To set state manually
    storeState(state = {}) {

        // if component is mounted than set state.
        if (this.componentMounted) {
            this.setState(state);
        }
    }

    async componentDidMount() {

        this.componentMounted = true;

        //check for internet connection
        if (await isInternet()) {

            //To start listening inside listeners
            this.addListeners();

            //To start signalR connection for Markets
            this.startMarketHubConnection();

            //To start signalR connection for Chat
            this.startChatHubConnection();

            //To start listening signalR connections
            this.receiveHubConnections();
        }
    };

    componentWillUnmount() {
        this.state.hubConnectionChat = null;
        this.state.hubConnectionMarket = null;

        // remove all listeners
        if (this.listenerSendMessage) {
            this.listenerSendMessage.remove();
        }
        if (this.listenerGetChatHistory) {
            this.listenerGetChatHistory.remove();
        }
        if (this.listenerSessionLogout) {
            this.listenerSessionLogout.remove();
        }

        this.componentMounted = false;
    }

    startMarketHubConnection() {

        if (this.state.hubConnectionMarket !== null) {
            let startTime = moment();

            this.state.hubConnectionMarket.start().then(async () => {

                let milliseconds = moment().diff(startTime, 'milliseconds');
                logger('Market Connection Time : ' + milliseconds + ' ms')

                //Token initialization
                this.state.hubConnectionMarket.invoke(Method.OnConnected, getData(ServiceUtilConstant.REFRESH_TOKEN)).catch(err => logger('OnConnected : ' + err.message));

            }).catch(err => logger('Market Connection Error : ' + err));

            this.state.hubConnectionMarket.onclose(err => {
                logger('Market Connection Closed')
                this.startMarketHubConnection();
            })
        } else {
            logger('Market Connection is NULL')
        }
    }

    startChatHubConnection() {

        if (this.state.hubConnectionChat !== null) {
            let startTimeChat = moment();
            this.state.hubConnectionChat.start().then(() => {

                let milliseconds = moment().diff(startTimeChat, 'milliseconds');
                logger('Chat Connection Time : ' + milliseconds + ' ms');
                this.storeState({ isChatClosed: false });
            }).catch(err => {
                logger('Chat Connection ' + err);
                this.storeState({ isChatClosed: true });
            });

            this.state.hubConnectionChat.onclose(err => {
                logger('Chat Connection Closed');
                this.storeState({ isChatClosed: true });
                this.startChatHubConnection();
            })
        } else {
            logger('Chat Connection is NULL')
            this.storeState({ isChatClosed: true });
        }
    }

    addListeners() {

        //To listen SendMessage event
        this.listenerSendMessage = addListener(Method.SendMessage, (message) => {

            if (this.state.hubConnectionChat !== null && !this.state.isChatClosed) {
                this.state.hubConnectionChat.invoke(Method.SendMessage, message).catch(err => logger(err.message));
            } else {
                logger('Chat Connection is NULL')

                // to show server error message
                showTimeoutRequestDialog();
            }
        })

        //To listen chat history
        this.listenerGetChatHistory = addListener(Method.GetChatHistory, () => {
            if (this.state.hubConnectionChat !== null && !this.state.isChatClosed) {
                this.state.hubConnectionChat.invoke(Method.GetChatHistory).catch(err => null);
            } else {
                logger('Chat Connection is NULL')
            }
        })

        this.listenerSessionLogout = addListener(Events.SessionLogout, () => {
            this.state.hubConnectionChat = null;
            this.state.hubConnectionMarket = null;
        });
    }

    receiveHubConnections() {

        if (this.state.hubConnectionMarket !== null) {

            //to receive notification from signalR
            this.state.hubConnectionMarket.on(Method.RecieveNotification, (notificationDetail) => {
                try {
                    notificationDetail = JSON.parse(notificationDetail);

                    logger('Get Data from signalR RecieveNotification ' + JSON.stringify(notificationDetail));

                    if (typeof notificationDetail.Data !== 'undefined' && notificationDetail.Data !== '') {

                        let message = R.strings.formatString(R.strings[`activityNotification.message.${notificationDetail.Data.MsgCode}`], notificationDetail.Data)

                        logger('Notification : ' + message)

                        // Notification of Two Factor Authentication is Enabled
                        if (notificationDetail.Data.MsgCode == 6040) {
                            setData({ [ServiceUtilConstant.KEY_GoogleAuth]: true })
                        }

                        // Notification of Two Factor Authentication is Disabled
                        if (notificationDetail.Data.MsgCode == 6041) {
                            setData({ [ServiceUtilConstant.KEY_GoogleAuth]: false })
                        }

                        PushNotification.localNotification({
                            /* Android Only Properties */
                            largeIcon: "",
                            color: R.colors.accent, // (optional) default: system default

                            /* iOS and Android properties */
                            message: message, // (required)
                        });

                        /* FCM.presentLocalNotification({
                            channel: 'default',
                            id: new Date().valueOf().toString(), // (optional for instant notification)
                            title: AppConfig.appName,
                            body: message,
                            show_in_foreground: true,
                            priority: "high",
                        }) */

                    }
                } catch (error) {
                    logger('Notification Error: ' + error.message)
                }
            })

            this.state.hubConnectionMarket.on(Method.RecievePairData, (receivedMessage) => {
                logger('Get Data from signalR RecievePairData ' + receivedMessage);
                try {
                    let response = JSON.parse(receivedMessage);

                    // check response is available or not
                    if (response) {
                        let pairData = response.Data;

                        if (this.state.marketList) {

                            let originalRes = this.state.marketList;
                            let isRefresh = false;

                            if (this.state.marketList.ReturnCode == 0 && this.state.marketList.response) {

                                //loop thorugh all base pairs
                                this.state.marketList.response.map((basePair, basePairIndex) => {

                                    //if basePair has PairList then find index for updating record
                                    if (basePair.PairList) {

                                        //find index for signalR data in current basePair PairList
                                        let pairIndex = basePair.PairList.findIndex(pairItem => pairItem.PairId == pairData.PairId);

                                        //if pair is found in current base pair's PairList then update fields.
                                        if (pairIndex > -1) {

                                            isRefresh = true;

                                            //Get condition based color with old and new values
                                            let currentRateColor = getColorCode(originalRes.response[basePairIndex].PairList[pairIndex].CurrentRate, pairData.CurrentRate);
                                            let changePerColor = getColorCode(originalRes.response[basePairIndex].PairList[pairIndex].ChangePer, pairData.ChangePer);

                                            //Update record fields
                                            originalRes.response[basePairIndex].PairList[pairIndex] = {
                                                ...originalRes.response[basePairIndex].PairList[pairIndex],
                                                CurrentRate: parseFloatVal(pairData.CurrentRate).toFixed(8),
                                                Volume: pairData.Volume24,
                                                ChangePer: pairData.ChangePer,
                                                High24Hr: parseFloatVal(pairData.High24Hr).toFixed(8),
                                                Low24Hr: parseFloatVal(pairData.Low24Hr).toFixed(8),
                                                HighWeek: parseFloatVal(pairData.HighWeek).toFixed(8),
                                                LowWeek: parseFloatVal(pairData.LowWeek).toFixed(8),
                                                High52Week: parseFloatVal(pairData.High52Week).toFixed(8),
                                                Low52Week: parseFloatVal(pairData.Low52Week).toFixed(8),
                                                UpDownBit: pairData.UpDownBit,
                                                currentRateColor,
                                                changePerColor
                                            };
                                        }
                                    }
                                })
                            }

                            //if isRefresh bit is true then update response
                            isRefresh && this.props.refreshMarkets(originalRes);

                        }
                    }
                } catch (error) {
                    // Parsing Error
                    logger('Error Receive PairData ' + error.message)
                }
            })

            this.state.hubConnectionMarket.on(Method.RecieveWalletBal, (receivedMessage) => {
                logger('Get Data from signalR RecieveWalletBal ' + receivedMessage);
                sendEvent(Method.RecieveWalletBal, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveMarketData, (receivedMessage) => {
                logger('Get Data from signalR RecieveMarketData ' + receivedMessage);
                sendEvent(Method.RecieveMarketData, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveMarketTicker, (receivedMessage) => {
                logger('Get Data from signalR RecieveMarketTicker ' + receivedMessage);
                sendEvent(Method.RecieveMarketTicker, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveActiveOrder, (receivedMessage) => {
                logger('Get Data from signalR RecieveActiveOrder ' + receivedMessage);
                sendEvent(Method.RecieveActiveOrder, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveTradeHistory, (receivedMessage) => {
                logger('Get Data from signalR RecieveTradeHistory ' + receivedMessage);
                sendEvent(Method.RecieveTradeHistory, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveRecentOrder, (receivedMessage) => {
                logger('Get Data from signalR RecieveRecentOrder ' + receivedMessage);
                sendEvent(Method.RecieveRecentOrder, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveBuyerBook, (receivedMessage) => {
                logger('Get Data from signalR RecieveBuyerBook ' + receivedMessage);
                sendEvent(Method.RecieveBuyerBook, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveSellerBook, (receivedMessage) => {
                logger('Get Data from signalR RecieveSellerBook ' + receivedMessage);
                sendEvent(Method.RecieveSellerBook, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveOrderHistory, (receivedMessage) => {
                logger('Get Data from signalR RecieveOrderHistory ' + receivedMessage);
                sendEvent(Method.RecieveOrderHistory, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveLastPrice, (receivedMessage) => {
                logger('Get Data from signalR RecieveLastPrice ' + receivedMessage);
                sendEvent(Method.RecieveLastPrice, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveChartData, (receivedMessage) => {
                logger('Get Data from signalR RecieveChartData ' + receivedMessage);
                sendEvent(Method.RecieveChartData, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveNews, (receivedMessage) => {
                logger('Get Data from signalR RecieveNews ' + receivedMessage);
                sendEvent(Method.RecieveNews, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.SetTime, (receivedMessage) => {
                // logger('Get Data from signalR SetTime ' + receivedMessage);
                sendEvent(Method.SetTime, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveNews, (receivedMessage) => {
                logger('Get Data from signalR RecieveNews ' + receivedMessage);
                sendEvent(Method.RecieveNews, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveAnnouncement, (receivedMessage) => {
                logger('Get Data from signalR RecieveAnnouncement ' + receivedMessage);
                sendEvent(Method.RecieveAnnouncement, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveStopLimitBuyerBook, (receivedMessage) => {
                logger('Get Data from signalR RecieveStopLimitBuyerBook: ' + receivedMessage);
                sendEvent(Method.RecieveStopLimitBuyerBook, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveStopLimitSellerBook, (receivedMessage) => {
                logger('Get Data from signalR RecieveStopLimitSellerBook ' + receivedMessage);
                sendEvent(Method.RecieveStopLimitSellerBook, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.ReceiveBulkSellerBook, (receivedMessage) => {
                logger('Get Data from signalR ReceiveBulkSellerBook ' + receivedMessage);
                sendEvent(Method.ReceiveBulkSellerBook, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.RecieveWalletActivity, (receivedMessage) => {
                logger('Get Data from signalR RecieveWalletActivity ' + receivedMessage);
                sendEvent(Method.RecieveWalletActivity, receivedMessage);
            })

            this.state.hubConnectionMarket.on(Method.ReceiveSessionExpired, (receivedMessage) => {
                logger('Get Data from signalR ReceiveSessionExpired ' + receivedMessage);

                if (typeof receivedMessage.Data !== 'undefined' && receivedMessage.Data !== '') {

                    let message = R.strings.formatString(R.strings[`activityNotification.message.${receivedMessage.Data.MsgCode}`], receivedMessage.Data)

                    showAlert(R.strings.SessionError, message, 2, () => {
                        dialogShowCount = 0;
                        if (dialog.sessionExpire) {

                            setData({ [ServiceUtilConstant.ACCESS_TOKEN]: null })

                            //Need to redirect to login
                            sendEvent(Events.SessionLogout);
                        }
                    });
                }

            })

        } else {
            logger('Market Connection is NULL')
        }

        if (this.state.hubConnectionChat !== null) {
            this.state.hubConnectionChat.on(Method.RecieveChatHistory, (receivedMessage) => {
                logger('Get Data from signalR RecieveChatHistory ' + receivedMessage);
                sendEvent(Method.RecieveChatHistory, receivedMessage);
            })

            this.state.hubConnectionChat.on(Method.ReceiveMessage, (userName, receivedMessage) => {
                logger('Get Data from signalR ReceiveMessage ' + userName + ': ' + receivedMessage);
                sendEvent(Method.ReceiveMessage, userName, receivedMessage);
            })

            this.state.hubConnectionChat.on(Method.RecieveBlockUnblockUser, (receivedMessage) => {
                logger('Get Data from signalR RecieveBlockUnblockUser ' + receivedMessage);

                try {
                    let receivedMessageData = JSON.parse(receivedMessage);
                    if (receivedMessageData.Data) {

                        //to store in reducer whether user is blocked or not
                        setData({ [ServiceUtilConstant.KEY_IsBlockedUser]: receivedMessageData.Data.IsBlocked });
                    }
                } catch (error) {
                    //logger('RecieveBlockUnblockUser MainScreen: ' + error.message)
                }
                sendEvent(Method.RecieveBlockUnblockUser, receivedMessage);
            })
        } else {
            logger('Chat Connection is NULL')
        }
    }

    static getDerivedStateFromProps(props, state) {

        //Get All Updated field of Particular actions
        let { marketData: { marketList }, currencyPair } = props;

        //To check if marketList is not null then getther tabs name
        if (marketList) {

            //if local marketList state is null or its not null and also different then new response then and only then validate response.
            if (state.marketList == null || (state.marketList != null && marketList !== state.marketList)) {
                return Object.assign({}, state, {
                    marketList
                })
            }
        }

        if (currencyPair !== state.currencyPair) {
            return Object.assign({}, state, {
                currencyPair: currencyPair,
            })
        }
        return null;
    }

    componentDidUpdate(_prevProps, prevState) {

        // check for previous and current currency pair
        if (this.state.currencyPair !== prevState.currencyPair) {
            this.updateCurrency(prevState.currencyPair, this.state.currencyPair)
        }
    }

    updateCurrency(oldPair, newPair) {

        if (this.state.hubConnectionMarket !== null) {
            logger('Invoking New Pairs : ' + oldPair + ' => ' + newPair);

            //pair change
            this.state.hubConnectionMarket
                .invoke(Method.AddPairSubscription, newPair, oldPair)
                .catch(err => logger('AddPairSubscription ' + err.message));

            //market subscription (Based Currency)
            this.state.hubConnectionMarket
                .invoke(Method.AddMarketSubscription, newPair.split('_')[1], oldPair.split('_')[1])
                .catch(err => logger('AddMarketSubscription ' + err.message));
        } else {
            logger('Market Connection is NULL')
        }

    }

    render() {
        return <View />
    }
}

function mapStatToProps(state) {
    return {
        currencyPair: state.preference[ServiceUtilConstant.KEY_CurrencyPair].PairName,
        marketData: state.tradeData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refreshMarkets: (payload) => dispatch(refreshMarkets(payload)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(SignalRWidget);