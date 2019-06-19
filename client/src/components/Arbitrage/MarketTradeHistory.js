// component for Market Trade History By Tejas 12/6/2019

import React, { Component, Fragment } from 'react';

//used for connect to store
import { connect } from "react-redux";

//used for convert to different langauages,
import IntlMessages from "Util/IntlMessages";

//import for design
import { Table, Alert } from 'reactstrap';

//used for scrolbar
import { Scrollbars } from "react-custom-scrollbars";

//import actions
//import {arbitrageMarketTradeHistory} from "Actions/Arbitrage";

//class for Market Trade history
class MarketTradeHistory extends Component {

    //constructor 
    constructor(props) {
        super(props);
        this.state = {
            marketTradeList: []
        };
    }

    componentWillMount() {
        //this.props.arbitrageMarketTradeHistory({Pair:this.props.currencyPair});
    }

    componentWillReceiveProps(nextprops) {
        /* if(nextprops.marketTradeList && nextprops.marketTradeList.length){

            this.setState({
                marketTradeList:nextprops.marketTradeList
            })
        }  */

        //this.setState({ tradeHistoryList: nextprops.tradeHistoryList.response })
    }

    //renders the component
    render() {

        //const { marketTradeList } = this.state;
        const { marketTradeList } = this.props;

        //returns the component
        return (
            <Fragment>
                <div className="arbitrage_marketTrade">
                    <Scrollbars
                        className="jbs-scroll"
                        autoHeight
                        // autoHeightMin={this.props.autoHeightMin}
                        // autoHeightMax={this.props.autoHeightMax}
                        autoHeightMin={260}
                        autoHeightMax={260}
                        autoHide
                    >
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        <IntlMessages id="sidebar.arbitrageTrnNo" />
                                    </th>
                                    <th>
                                        <IntlMessages id="sidebar.colCreatedDt" />
                                    </th>
                                    <th>
                                        <IntlMessages id="sidebar.type" />
                                    </th>
                                    <th>
                                        <IntlMessages id="trading.activeorders.label.settleqty" />
                                    </th>
                                    <th>
                                        <IntlMessages id="trading.currencypair.label.price" />
                                    </th>
                                    <th>
                                        <IntlMessages id="trading.orders.label.amount" />
                                    </th>
                                    <th>
                                        <IntlMessages id="trading.orders.label.total" />
                                    </th>
                                    <th>
                                        <IntlMessages id="sidebar.transactionHistory.tableHeading.settledate" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {marketTradeList && marketTradeList.length ?
                                    marketTradeList.map((tradehistory, index) => {
                                        return <tr key={index}>
                                            <td>{tradehistory.TrnNo}</td>
                                            <td>{tradehistory.DateTime.replace("T", " ").split(".")[0]}</td>
                                            <td className={tradehistory.Type === "BUY" ? "text-success" : tradehistory.Type === "SELL" && "text-danger" }>
                                            {tradehistory.Type}</td>
                                            <td>{tradehistory.SettledQty.toFixed(8)}</td>
                                            <td>{tradehistory.Price.toFixed(8)}</td>
                                            <td>{tradehistory.Amount.toFixed(8)}</td>
                                            <td>{tradehistory.Total.toFixed(8)}</td>
                                            <td>{tradehistory.SettledDate.replace("T", " ").split(".")[0]}</td>
                                        </tr>
                                    })
                                    :
                                    <tr><td colSpan="7"><IntlMessages id="trading.activeorders.label.nodata" /></td></tr>
                                }
                            </tbody>
                        </Table>
                    </Scrollbars>
                </div>
            </Fragment>
        )
    }
}

// Get Data from Store/reducer
const mapStateToProps = ({ arbitrageReports }) => {
    const response = {
        //marketTradeList: arbitrageReports.marketTradeHistoryList,
        loading: arbitrageReports.marketTradeHistoryLoading
    }
    return response;
};

export default connect(mapStateToProps, {
    //arbitrageMarketTradeHistory
})(MarketTradeHistory);
