/**
 * Author : Salim Deraiya
 * Created : 27/05/2019
 * change by : akshansha gohil 
 * change date : 04/05/2019
 * Arbitrage Trade History
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import { Scrollbars } from "react-custom-scrollbars";
import { Tabs, Tab, TabList } from "react-web-tabs";

import { injectIntl } from 'react-intl';

// import loader for section
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

import { withRouter } from 'react-router-dom';

class MyTradeHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            exchangeName: 'all'
        };

    }

    tabClick(exchangeName) {
        this.setState({ exchangeName: exchangeName })
    }

    render() {

        // for dynamic tabs
        const uniqueTags = [];
        // for count no. of records in tab
        const countTags = [];
        var k;
        this.props.MyTradeHistory.map((item) => {
            if (uniqueTags.indexOf(item.ExchangeName) === -1) {
                uniqueTags.push(item.ExchangeName)
            }
        });

        uniqueTags.map((item, i) => {
            k = 1;
            this.props.MyTradeHistory.map((item) => {
                if (uniqueTags[i] === item.ExchangeName) {
                    countTags[i] = k++;
                }
            });
        });
        const intl = this.props.intl;

        return (
            <Fragment>
                {/* this.props.loading && <JbsSectionLoader /> */}
                {this.props.isShowTitle && <h2>
                    {/* Trade History */}
                    <IntlMessages id="trading.newTrading.markettrade.text"/>
                    </h2>}

                <div className="row">
                    <div className="col-md-10">
                        {<Tabs className="arbitrage_tabs_try">
                            <TabList className="tab_list_try clearfix">
                                <Tab tabFor="all" onClick={() => this.tabClick("all")} className="d-flex">
                                    {/* ALL  */}
                                    <IntlMessages id="sidebar.arbitrageAll" />
                                    &nbsp;
                                    ({this.props.MyTradeHistory.length})</Tab>
                                {
                                    uniqueTags.map((item, key) =>
                                        <Tab className="d-flex" key={key} tabFor={item} onClick={() => this.tabClick(item)}>{item} ({countTags[key]})</Tab>
                                    )
                                }
                            </TabList>
                        </Tabs>}
                    </div>

                    <div className="col-md-2 text-right arbitrage-btnmore">
                        <a href="javascript:void(0)"
                        onClick={() => {this.props.history.push('/app/arbitrage/transaction-history')}}
                        >
                            <IntlMessages id="sidebar.apiplan.button.viewmore" />
                        </a>
                    </div>
                </div>

                <Scrollbars
                    className="jbs-scroll"
                    autoHeight
                    // autoHeightMin={this.props.autoHeightMin}
                    // autoHeightMax={this.props.autoHeightMax}
                    autoHeightMin={220}
                    autoHeightMax={220}
                    autoHide
                >
                    <table className="trd_hst_list striped highlight trade_history_table">
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
                                {/* <th><IntlMessages id={"trading.holdingorder.label.profitloss"} /></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {/* tradeHistory-table data fetch from API  */}
                            {
                                this.props.MyTradeHistory && this.props.MyTradeHistory.length > 0 ?

                                    this.props.MyTradeHistory.map((list, index) => {
                                        { var status = list.IsCancel == 1 ? intl.formatMessage({ id: 'myorders.response.status.2' }) : intl.formatMessage({ id: `myorders.response.status.${list.Status}` }) }
                                        if (this.state.exchangeName === 'all' || this.state.exchangeName === list.ExchangeName) {

                                            return (
                                                <tr key={index}>
                                                    <td>{list.PairName.split("_")[0] + " / " + list.PairName.split("_")[1]}</td>
                                                    <td
                                                        className={list.Type === "BUY" ? "text-success" : list.Type === "SELL" && "text-danger"}>
                                                        {list.Type}</td>
                                                    <td>{list.OrderType}</td>
                                                    <td>{list.ExchangeName}</td>
                                                    <td>{list.Amount.toFixed(8)}</td>
                                                    <td>{list.Price.toFixed(8)}</td>
                                                    <td>{list.DateTime.replace('T', ' ').split('.')[0]}</td>
                                                    <td>{status}</td>
                                                    {/* <td>{"      "}</td> */}
                                                </tr>
                                            )
                                        }
                                    })
                                    :
                                    <tr><td colSpan="9"><IntlMessages id="trading.activeorders.label.nodata" /></td></tr>
                            }

                        </tbody>
                    </table>
                </Scrollbars>
            </Fragment>
        );
    }
}

MyTradeHistory.defaultProps = {
    isShowTitle: true
}

const mapStateToProps = ({ arbitrageReports }) => {
    const response = {
        loading: arbitrageReports.loading
    }
    return response;
};

export default connect(mapStateToProps, {
})(withRouter(injectIntl(MyTradeHistory)));

//export default connect(mapStateToProps, { })(withRouter(FundBalances));