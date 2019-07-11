// Component for Display Market Trade History By:Tejas Date : 13/9/2018
// coponent change by devang parekh for handling margin trading process (21-2-2019)

import React from "react";
import { Table, Row, Col } from "reactstrap";
//import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";
// intl messages
import IntlMessages from "Util/IntlMessages";
//import scroll bar
import { Scrollbars } from "react-custom-scrollbars";
// import Action 
import { getMarketTradeHistory } from 'Actions/Trade';
// import connect function for store
import { connect } from "react-redux";
import $ from 'jquery';

class MarketTradeRow extends React.Component {
  render() {
    var lastClass = "";

    if (this.props.Type === "BUY") {
      lastClass = "text-success";
    } else if (this.props.Type === "SELL") {
      lastClass = "text-danger";
    }

    return (
      <tr
        className={this.props.index == 0 ? 'blink_me' : ''}
        style={{ cursor: "pointer" }}
        key={this.props.index}
      >
        <td>{this.props.tradetime.split('T')[1].split('.')[0]}</td>
        <td>{this.props.price === 0 ? parseFloat(this.props.lastPrice).toFixed(8) : parseFloat(this.props.price).toFixed(8)}</td>
        <td className={lastClass}>
          {parseFloat(this.props.SettledQty).toFixed(8)}
        </td>
        <td>{parseFloat(this.props.SettledQty * this.props.price).toFixed(8)}</td>
      </tr>
    );
  }
}

class MarketTrade extends React.Component {
  constructor() {
    super();
    this.state = {
      marketTradeHistory: [],
      showLoader: true,
      oldMarketTradeHistory: [],
      NewMarketData: [],
      socketData: [],
      lastPrice: 0,
      socketLastPriceData: []
    };
  }

  // This will invoke After component render
  componentWillMount() {
    this.isComponentActive = 1;
    // code changed by devang parekh for handling margin trading process
    if (this.props.hasOwnProperty('marginTrading') && this.props.marginTrading === 1) {
      // Call Actions For Get Market history List
      this.props.getMarketTradeHistory({ Pair: this.props.currencyPair, marginTrading: 1 });
      this.processForMarginTrading(); // call for intialize socket listners for margin trading
    } else {
      // Call Actions For Get Market history List
      this.props.getMarketTradeHistory({ Pair: this.props.currencyPair });
      this.processForNormalTrading();// call for intialize socket listners for normal trading
    }
    // code end (21-2-2019)
  }

  // code for handle signalr listners for normal trading
  processForNormalTrading() {
    this.props.hubConnection.on('RecieveLastPrice', (receivedMessage) => {
      if (this.isComponentActive === 1 && receivedMessage !== null) {
        try {
          const marketCap = JSON.parse(receivedMessage);
          if ((marketCap.EventTime && this.state.socketLastPriceData.length === 0) ||
            (this.state.socketLastPriceData.length !== 0 && marketCap.EventTime > this.state.socketLastPriceData.EventTime)) {
            if (this.props.currencyPair === marketCap.Parameter && typeof marketCap.IsMargin !== 'undefined' && marketCap.IsMargin === 0) {
              this.setState({
                lastPrice: marketCap.Data.LastPrice,
                socketLastPriceData: marketCap
              })
            }
          }
        } catch (error) {}
      }
    });

    this.props.hubConnection.on('RecieveOrderHistory', (receivedMessage) => {
      if (this.isComponentActive === 1 && receivedMessage !== null) {
        try {
          const receivedMessageData = JSON.parse(receivedMessage);
          if ((receivedMessageData.EventTime && this.state.socketData.length === 0) ||
            (this.state.socketData.length !== 0 && receivedMessageData.EventTime > this.state.socketData.EventTime)) {
            if (this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 0) {
              var orderHistory = $.extend(true, [], this.state.marketTradeHistory);
              orderHistory.unshift(receivedMessageData.Data)
              this.setState({ marketTradeHistory: orderHistory, socketData: receivedMessageData });
            }
          }
        } catch (error) {}
      }
    });
  }

  // code for handle signalr listners for margin trading
  processForMarginTrading() {
    this.props.hubConnection.on('RecieveLastPrice', (receivedMessage) => {
      if (this.isComponentActive === 1 && receivedMessage !== null) {
        try {
          const marketCap = JSON.parse(receivedMessage);
          if ((marketCap.EventTime && this.state.socketLastPriceData.length === 0) ||
            (this.state.socketLastPriceData.length !== 0 && marketCap.EventTime > this.state.socketLastPriceData.EventTime)) {
            if (this.props.currencyPair === marketCap.Parameter && typeof marketCap.IsMargin !== 'undefined' && marketCap.IsMargin === 1) {
              this.setState({
                lastPrice: marketCap.Data.LastPrice,
                socketLastPriceData: marketCap
              })
            }
          }
        } catch (error) {}
      }
    });

    this.props.hubConnection.on('RecieveOrderHistory', (receivedMessage) => {
      if (this.isComponentActive === 1 && receivedMessage !== null) {
        try {
          const receivedMessageData = JSON.parse(receivedMessage);
          if ((receivedMessageData.EventTime && this.state.socketData.length === 0) ||
            (this.state.socketData.length !== 0 && receivedMessageData.EventTime > this.state.socketData.EventTime)) {
            if (this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 1) {
              var orderHistory = $.extend(true, [], this.state.marketTradeHistory);
              orderHistory.unshift(receivedMessageData.Data)
              this.setState({ marketTradeHistory: orderHistory, socketData: receivedMessageData });
            }
          }
        } catch (error) {}
      }
    });
  }

  componentWillUnmount() {
    this.isComponentActive = 0;
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.marketTradeHistory.length > 0) {
      // set Market Trade History list if gets from API only
      this.setState({
        marketTradeHistory: nextprops.marketTradeHistory,
        showLoader: false
      });
    }

    if (nextprops.currentMarketCap && nextprops.currentMarketCap.LastPrice && nextprops.currentMarketCap.LastPrice > 0) {
      this.setState({ lastPrice: nextprops.currentMarketCap.LastPrice })
    }
  }

  // Render Component for Market Trade History Order
  render() {
    const MarketTradeData = this.state.marketTradeHistory;
    var indexValue = 0;
    var marketTradeHistoryList = [];
    if (this.state.marketTradeHistory.length !== 0) {

      MarketTradeData.map((newBuyOrder, key) => {
        if (newBuyOrder.IsCancel === 0) { // code add by devang parekh (8-4-2019), as per discuss with ritaben for handle partial cancel order settle date issue (because of this issue order comes with first which is already settled priviously another day)
          marketTradeHistoryList.push(
            <MarketTradeRow
              price={newBuyOrder.Price}
              Amount={newBuyOrder.Amount}
              tradetime={newBuyOrder.DateTime}
              Type={newBuyOrder.Type}
              indexValue={indexValue}
              index={indexValue}
              key={indexValue}
              lastPrice={this.state.lastPrice}
              SettledQty={newBuyOrder.SettledQty}
            />
          );
          indexValue++;
        }
      });
    }

    // code added by devang parekh (26-2-2019)
    var isShowHeader = 1; // default set to 1 because default show header
    if (this.props.hasOwnProperty('isShowHeader') && this.props.isShowHeader === 0) {
      isShowHeader = 0; // set 0 for hide header
    }
    // code end

    return (
      <div className="table-responsive-design m-0">
        {this.props.loading && <JbsSectionLoader />}
        {isShowHeader === 1 && // code added by devang parekh for hide show header based on bit (26-2-2019)
          <div className="tradingheader">
            <div className="coinbasetitle">{<IntlMessages id="trading.newTrading.markettrade.text" />}</div>
          </div>
        }

        <div className="markettradehis mt-10">
          {isShowHeader === 1 && // code added by devang parekh for hide show header based on bit (26-2-2019)
            <Table className="m-0 p-0">
              <thead>
                <tr>
                  <th>{<IntlMessages id="widgets.time" />}</th>
                  <th>{<IntlMessages id="trading.orders.label.price" />} ({this.props.secondCurrency})</th>
                  <th className="numeric">
                    {<IntlMessages id="trading.orders.label.amount" />} ({this.props.firstCurrency})
                    </th>
                  <th className="numeric">
                    {<IntlMessages id="trading.orders.label.total" />} ({this.props.secondCurrency})
                    </th>
                </tr>
              </thead>
            </Table>
          }
          <Scrollbars
            className="jbs-scroll"
            autoHeight
            autoHeightMin={this.props.autoHeightMin}
            autoHeightMax={this.props.autoHeightMax}
            autoHide
          >
            <Table className="table m-0 p-0">
              <tbody>{marketTradeHistoryList}</tbody>
            </Table>
            {this.state.marketTradeHistory.length === 0 &&
              <Row className="justify-content-center m-0">
                <Col className="text-center text-danger m-0 fs-32 mt-15" sm={12} style={{ fontSize: "18px" }} >
                  <IntlMessages id="trading.orders.label.nodata" />
                </Col>
              </Row>
            }
          </Scrollbars>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ marketTradeHistory, currentMarketCap, settings }) => {
  return {
    marketTradeHistory: marketTradeHistory.marketHistory,
    loading: marketTradeHistory.loading,
    currentMarketCap: currentMarketCap.currentMarketCap,
    darkMode: settings.darkMode
  };
}

// connect action with store for dispatch
export default connect(mapStateToProps,{
  getMarketTradeHistory
})(MarketTrade);