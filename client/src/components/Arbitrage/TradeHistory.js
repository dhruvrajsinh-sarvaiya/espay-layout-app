/**
 * Author : Salim Deraiya
 * Created : 27/05/2019
 * change by : akshansha gohil 
 * change date : 04/05/2019
 * Arbitrage Trade History
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { arbitrageTradeHistory } from 'Actions/Arbitrage';
import IntlMessages from "Util/IntlMessages";
import { Scrollbars } from "react-custom-scrollbars";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
// static array for tab 
const openOrdDt = [
    { id: 1, pair: 'ATCC_BTC', side: 'Buy', order_type: 'Limit', exchange: 'Binance', amount: 10, price: 1, date: '29-05-2019 10:35' },
    { id: 2, pair: 'BTH_BTC', side: 'Sell', order_type: 'Limit', exchange: 'Biterx', amount: 10, price: 1, date: '29-05-2019 10:35' },
    { id: 3, pair: 'LTC_BTC', side: 'Buy', order_type: 'Limit', exchange: 'Binance', amount: 10, price: 1, date: '29-05-2019 10:35' },
    { id: 4, pair: 'XRP_BTC', side: 'Sell', order_type: 'Limit', exchange: 'Biterx', amount: 10, price: 1, date: '29-05-2019 10:35' },
    { id: 5, pair: 'LMX_BTC', side: 'Buy', order_type: 'Limit', exchange: 'Binance', amount: 10, price: 1, date: '29-05-2019 10:35' },
    { id: 6, pair: 'BTG_BTC', side: 'Sell', order_type: 'Limit', exchange: 'Biterx', amount: 10, price: 1, date: '29-05-2019 10:35' },
    { id: 7, pair: 'BIC_BTC', side: 'Sell', order_type: 'Limit', exchange: 'Paro', amount: 10, price: 1, date: '29-05-2019 10:35' }
]

class TradeHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openOrderList: openOrdDt,
            data: {
                pair: "",
                trade: "",
                fromDate: "",
                toDate: "",
                status: 0,
                page: 0,
                marketType: "",
                exchangeName: ""
                // isMargin:0  use in treadArbitrage API as parameter
            },
            tradeHistoryList: []
        };
    }
    componentWillMount() {
        let payload = Object.assign({}, this.state.data);
        this.props.arbitrageTradeHistory(payload);
    }
    componentWillReceiveProps(nextprops) {
        this.setState({ tradeHistoryList: nextprops.tradeHistoryList.response })
    }
    tabClick(itemName) {
        this.setState({ exchangeName: itemName })
        const filterData = [];
        if (itemName === 'all') {
            this.setState({ openOrderList: openOrdDt })
        }
        else {
            openOrdDt.map(item => {
                if (item.exchange === itemName) {
                    filterData.push(item)
                }
            });
            this.setState({ openOrderList: filterData })
        }
    }
    render() {
        const { tradeHistoryList, openOrderList } = this.state;
        const { defaultTab } = this.props;
        // for dynamic tabs
        const uniqueTags = [];
        // for count no. of records in tab
        const countTags = [];
        var i, k;
        openOrdDt.map((item) => {
            if (uniqueTags.indexOf(item.exchange) === -1) {
                uniqueTags.push(item.exchange)
            }
        });
        for (i = 0; i <= uniqueTags.length; i++) {
            k = 1;
            openOrdDt.map((item) => {
                if (uniqueTags[i] === item.exchange) {
                    countTags[i] = k++;
                }
            });
        }
        return (
            <Fragment>
                {this.props.isShowTitle && <h2>
                    {/* Trade History */}
                <IntlMessages id="sidebar.tradehistory" />
                </h2>}
                {<Tabs className="arbitrage_tabs_try">
                    <TabList className="tab_list_try clearfix">
                        <Tab tabFor="all" onClick={() => this.tabClick("all")} className="d-flex">
                            {/* ALL */}
                            <IntlMessages id="sidebar.arbitrageAll" />
                        ({openOrdDt.length})</Tab>
                        {
                            uniqueTags.map((item, key) =>
                                <Tab className="d-flex" key={key} tabFor={item} onClick={() => this.tabClick(item)}>{item} ({countTags[key]})</Tab>
                            )
                        }
                    </TabList>
                </Tabs>}
                <Scrollbars
                    className="jbs-scroll"
                    autoHeight
                    autoHeightMin={this.props.autoHeightMin}
                    autoHeightMax={this.props.autoHeightMax}
                    autoHide
                >
                    <table className="trd_hst_list striped highlight ">
                        <thead>
                            <tr>
                                <th><IntlMessages id={"trading.currencypair.label.pair"} /></th>
                                <th><IntlMessages id={"trading.history.label.Side"} /></th>
                                <th><IntlMessages id={"trading.activeorders.label.orderType"} /></th>
                                <th><IntlMessages id={"myaccount.tradeSummaryColumn.exchange"} /></th>
                                <th><IntlMessages id={"trading.orders.label.amount"} /></th>
                                <th><IntlMessages id={"widgets.price"} /></th>
                                <th><IntlMessages id={"widgets.date"} /></th>
                                <th><IntlMessages id={"sidebar.colStatus"} /></th>
                                <th><IntlMessages id={"trading.holdingorder.label.profitloss"} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* tradeHistory-table data fetch from API  */}
                            {
                                tradeHistoryList && tradeHistoryList.length > 0
                                    ?
                                    tradeHistoryList.map((list, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{list.PairName.split("_")[0] + " / " + list.PairName.split("_")[1]}</td>
                                                <td>{list.Type}</td>
                                                <td>{list.OrderType}</td>
                                                <td>{"      "}</td>
                                                <td>{list.Amount}</td>
                                                <td>{list.Price}</td>
                                                <td>{list.DateTime.replace('T', ' ').split('.')[0]}</td>
                                                <td>{list.Status}</td>
                                                <td>{"      "}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr><td colSpan="9"><IntlMessages id="trading.activeorders.label.nodata" /></td></tr>
                            }
                            {/* disaply data acoording to tab static data */}
                            {/*    {
                                openOrderList && openOrderList.length > 0
                                    ?
                                    openOrderList.map((list, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{list.pair}</td>
                                                <td>{list.side}</td>
                                                <td>{list.order_type}</td>
                                                <td>{list.exchange}</td>
                                                <td>{list.amount}</td>
                                                <td>{list.price}</td>
                                                <td>{list.date}</td>
                                                <td>{list.DateTime.replace('T', ' ').split('.')[0]}</td>
                                                <td>{"      "}</td>
                                                <td>{"      "}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr><td colSpan="9">No date found.</td></tr>
                            } */}
                        </tbody>
                    </table>
                </Scrollbars>
            </Fragment>
        );
    }
}

TradeHistory.defaultProps = {
    isShowTitle: true
}

const mapStateToProps = ({ arbitrageReports }) => {
    const response = {
        tradeHistoryList: arbitrageReports.tradeHistoryList,
        loading: arbitrageReports.loading
    }
    return response;
};

export default connect(mapStateToProps, {
    arbitrageTradeHistory
})(TradeHistory);
