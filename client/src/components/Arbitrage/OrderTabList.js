/**
 * Author : Salim Deraiya
 * Created : 27/05/2019
 *  Arbitrage Open Order
 * changed by Tejas 12/6/2019
 * updated by : devang parekh (11-6-2019)
 *  for handle open order response and signalr in this and pass into child component
*/

import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import OpenOrder from './OpenOrder';
import MyTradeHistory from './MyTradeHistory';
import { arbitrageOpenOrder, arbitrageTradeHistory, arbitrageMarketTradeHistory } from 'Actions/Arbitrage';
import $ from 'jquery';


// import components 
import MarketTradeHistory from "./MarketTradeHistory";

import Balance from "./BalanceComponent";

class OrderTabList extends Component {
    constructor(props) {
        super(props);

        var date = new Date();
        var diff = new Date().getDate() - 7
        var start_date = new Date(date.setDate(diff)).toISOString().slice(0, 10)

        this.state = {};
        this.state = {
            activeOrderRequestData: {
                Pair: "",
                OrderType: "",
                FromDate: "",
                ToDate: "",
                Page: 0,
                IsMargin: 0,
            },
            myTradeHistoryRequestData: {
                pair: "",
                trade: "",
                fromDate: start_date,
                toDate: new Date().toISOString().slice(0, 10),
                status: 0,
                page: 0,
                marketType: "",
                exchangeName: ""
            },
            OpenOrderList: [],
            activeOrderSignalRData: [],
            myTradeHistory: [],
            myTradeHistorySignalRData: [],
            marketTradeList: [],
            marketTradeSignalRData: [],
        };
    }

    componentWillMount() {

        this.isComponentActive = 1;
        this.processForActiveOrder();
        this.processForMyTradeHsitory();
        this.processForMarketTradeHistory();

    }

    componentWillReceiveProps(nextProps) {

        // process for store open order from api
        if (nextProps.openOrderList !== undefined && nextProps.openOrderList.length) {
            // set Active My Open Order list if gets from API only
            this.setState({
                OpenOrderList: nextProps.openOrderList,
            });
        } else if (nextProps.openOrderList !== undefined && nextProps.openOrderList && !nextProps.openOrderList.length) {
            this.setState({
                OpenOrderList: [],
            });
        }

        // process for store trade history from api
        if (nextProps.tradeHistoryList !== undefined && nextProps.tradeHistoryList.response !== undefined && nextProps.tradeHistoryList.response && nextProps.tradeHistoryList.response.length) {

            this.setState({
                myTradeHistory: nextProps.tradeHistoryList.response,
            });

        } else if (nextProps.tradeHistoryList !== undefined && nextProps.tradeHistoryList.response !== undefined && !nextProps.tradeHistoryList.response) {
            this.setState({
                myTradeHistory: [],
            });
        }

        //process for market trade history
        if ((nextProps.marketTradeList && nextProps.marketTradeList.length) || (nextProps.marketTradeList && !nextProps.marketTradeList.length)) {
            this.setState({
                marketTradeList: nextProps.marketTradeList
            })
        }

    }

    processForActiveOrder() {

        this.props.arbitrageOpenOrder(this.state.activeOrderRequestData);

        // Call When Get Data From Socket/SignalR      
        this.props.hubConnection.on('RecieveActiveOrderArbitrage', (openOrderDetail) => {

            if (this.isComponentActive === 1 && openOrderDetail !== null) {

                try {

                    const openOrderDetailData = JSON.parse(openOrderDetail);

                    if ((openOrderDetailData.EventTime && this.state.activeOrderSignalRData.length === 0) ||
                        (this.state.activeOrderSignalRData.length !== 0 && openOrderDetailData.EventTime >= this.state.activeOrderSignalRData.EventTime)) {

                        const newData = openOrderDetailData.Data
                        if (parseFloat(newData.Price) >= 0) {
                            var openorders = $.extend(true, [], this.state.OpenOrderList);
                            var findIndexOrderId = openorders.findIndex(openorder => parseFloat(openorder.Id) === parseFloat(newData.Id));
                            if (findIndexOrderId === -1) {

                                if (parseFloat(newData.Amount) > 0) {
                                    openorders.unshift(newData);
                                }

                            } else {

                                if (parseFloat(newData.Amount) > 0) {
                                    openorders[findIndexOrderId] = newData
                                } else {
                                    openorders.splice(findIndexOrderId, 1)
                                }

                            }
                            this.setState({ OpenOrderList: openorders, activeOrderSignalRData: openOrderDetailData });

                        }

                    }

                } catch (error) {
                }

            }

        });

    }

    processForMyTradeHsitory() {

        this.props.arbitrageTradeHistory(this.state.myTradeHistoryRequestData);

        this.props.hubConnection.on("RecieveTradeHistoryArbitrage", (receivedMessage) => {

            if (this.isComponentActive === 1 && receivedMessage !== null) {

                try {

                    const receivedMessageData = JSON.parse(receivedMessage);
                    if ((receivedMessageData.EventTime && this.state.myTradeHistorySignalRData.length === 0) ||
                        (this.state.myTradeHistorySignalRData.length !== 0 && receivedMessageData.EventTime > this.state.myTradeHistorySignalRData.EventTime)) {

                        var myTradeHistory = $.extend(true, [], this.state.myTradeHistory);
                        myTradeHistory.unshift(receivedMessageData.Data);

                        this.setState({
                            myTradeHistory: myTradeHistory,
                            myTradeHistorySignalRData: receivedMessageData,
                        });

                    }

                } catch (error) {
                }

            }

        });

    }

    processForMarketTradeHistory() {

        this.props.arbitrageMarketTradeHistory({ Pair: this.props.currencyPair });

        this.props.hubConnection.on("RecieveOrderHistory", (receivedMessage) => {

            if (this.isComponentActive === 1 && receivedMessage !== null) {

                try {

                    const receivedMessageData = JSON.parse(receivedMessage);

                    if ((receivedMessageData.EventTime && this.state.marketTradeSignalRData.length === 0) || (this.state.marketTradeSignalRData.length !== 0 &&
                        receivedMessageData.EventTime > this.state.marketTradeSignalRData.EventTime)) {

                        var orderHistory = $.extend(true, [], this.state.marketTradeList);

                        orderHistory.unshift(receivedMessageData.Data);

                        this.setState({
                            marketTradeList: orderHistory,
                            marketTradeSignalRData: receivedMessageData,
                        });


                    }

                } catch (error) {
                }
            }
        });

    }

    render() {

        const { defaultTab } = this.props;

        return (
            <Tabs defaultTab={defaultTab} className="arbitrage_tabs">
                <TabList className="tab_list clearfix">
                    <Tab tabFor="open_order" className="d-flex">
                        <IntlMessages id="sidebar.arbitrageOpenOrder" />
                        &nbsp;
                        ({this.state.OpenOrderList.length})</Tab>
                    <Tab tabFor="my_trade_history" className="d-flex">
                        <IntlMessages id="sidebar.arbitrageMyTradeHistory" />
                        &nbsp;
                        ({this.state.myTradeHistory.length})</Tab>
                    <Tab tabFor="balance" className="d-flex">
                        <IntlMessages id="trading.holdingorder.label.balance" />

                    </Tab>
                    <Tab tabFor="trade_history" className="d-flex">
                        <IntlMessages id="trading.newTrading.markettrade.text" />

                    </Tab>

                </TabList>
                <div className="tab_cnt_area">
                    <TabPanel tabId="open_order">
                        <OpenOrder isShowTitle={false} {...this.props}
                            OpenOrderList={this.state.OpenOrderList} />
                    </TabPanel>
                    <TabPanel tabId="my_trade_history">
                        <MyTradeHistory
                            isShowTitle={false}
                            {...this.props}
                            MyTradeHistory={this.state.myTradeHistory}
                        />
                    </TabPanel>
                    <TabPanel tabId="balance">
                        <Balance Wallet={this.props.Wallet} />
                    </TabPanel>
                    <TabPanel tabId="trade_history">
                        <MarketTradeHistory
                            currencyPair={this.props.currencyPair}
                            isShowTitle={false} {...this.props}
                            marketTradeList={this.state.marketTradeList} />
                    </TabPanel>
                </div>
            </Tabs>
        );
    }
}

OrderTabList.defaultProps = {
    defaultTab: 'open_order'
}

//export default OrderTabList;
const mapStateToProps = ({ arbitrageReports }) => {

    const marketTradeList = arbitrageReports.marketTradeHistoryList;
    const { openOrderList, tradeHistoryList } = arbitrageReports;

    return { openOrderList, tradeHistoryList, marketTradeList };

}

export default connect(mapStateToProps, {
    arbitrageOpenOrder,
    arbitrageTradeHistory,
    arbitrageMarketTradeHistory
})(OrderTabList);
