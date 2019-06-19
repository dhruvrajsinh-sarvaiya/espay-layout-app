// Component for Display Market Trade History By:Tejas Date : 13/9/2018

import React from "react";
import { Table } from "reactstrap";

//import sectionloader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import card
import { Card, CardBody } from "reactstrap";

//import navigations menu
import { Nav, NavItem, NavLink } from "reactstrap";

// import class names for use multiple classes in component
import classnames from "classnames";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import scroll bar
import { Scrollbars } from "react-custom-scrollbars";

// import Action
import {
  getMarketTradeHistory,
  closeMarketHistorySocketConnection
} from "Actions/Trade";

// import connect function for store
import { connect } from "react-redux";

class MarketTradeRow extends React.Component {
  render() {
    var lastClass = "",
      changeClass = "";

    if (this.props.indexValue === -1) {
      changeClass = "blink_me";
    }

    if (this.props.Type === "Buy") {
      lastClass = "text-success";
    } else if (this.props.Type === "Sell") {
      lastClass = "text-danger";
    } else {
      lastClass = "";
      changeClass = "";
    }

    return (
      <tr
        className={changeClass}
        style={{ cursor: "pointer" }}
        key={this.props.index}
      >
        <td>{parseFloat(this.props.price).toFixed(8)}</td>
        <td className={lastClass}>
          {parseFloat(this.props.Amount).toFixed(8)}
        </td>
        <td>{parseFloat(this.props.Amount * this.props.price).toFixed(8)}</td>
      </tr>
    );
  }
}

class MarketTradeHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      marketTradeHistory: [],
      showLoader: true
    };
  }

  // This will invoke After component render
  componentWillMount() {
    // Call Actions For Get Market Trade History
    //  const pair = this.props.firstCurrency + '_' + this.props.secondCurrency;
    const pair = this.props.currencyPair

    this.props.getMarketTradeHistory({ Pair: pair });
  }

  componentWillUnmount() {
    //const pair = this.props.firstCurrency + '_' + this.props.secondCurrency;
    const pair = this.props.currencyPair

    this.props.closeMarketHistorySocketConnection({ Pair: pair });
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.marketTradeHistory && nextprops.marketTradeHistory !== null) {
      // set Market Trade History list if gets from API only
      this.setState({
        marketTradeHistory: nextprops.marketTradeHistory,
        showLoader: false
      });
    }
  }

  // Render Component for Market Trade History Order
  render() {
    // Iterate object and push into array
    const MarketTradeData = this.state.marketTradeHistory;
    const oldMarketTradeHistory = this.state.oldMarketTradeHistory;

    var marketTradeHistoryList = [];
    MarketTradeData.map((newBuyOrder, key) => {
      var findIndexValue = oldMarketTradeHistory.findIndex(
        oldOrder => oldOrder.Price === newBuyOrder.Price
      );
      marketTradeHistoryList.push(
        <MarketTradeRow
          price={newBuyOrder.Price}
          Amount={newBuyOrder.Amount}
          tradetime={newBuyOrder.tradetime.split(" ")[1]}
          indexValue={findIndexValue}
          Type={newBuyOrder.Type}    
          index={key}
        />
      );
    });

    return (
      <Card className="jbs-block col-sm-12 col-md-12 col-lg-12 d-sm-half p-5">
        <CardBody
          className="pb-0 d-flex justify-content-between"
          style={{ display: "flex" }}
        >
          <h1>{<IntlMessages id="trading.orders.label.tradehistory" />}</h1>

          <Nav tabs className="nav-pills p-5">
            <NavItem>
              <NavLink
                value=""
                className={classnames(
                  { active: this.props.state.displayFavourite },
                  "btn btn-outline-warning btn-xs m-2"
                )}
              >
                <IntlMessages id="trading.markethistory.button.market" />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                value=""
                className={classnames(
                  { active: this.props.state.displayFavourite },
                  "btn btn-outline-warning btn-xs m-2"
                )}
              >
                <IntlMessages id="trading.markethistory.button.yours" />
              </NavLink>
            </NavItem>
          </Nav>
        </CardBody>

        <Scrollbars
          className="jbs-scroll"
          autoHeight
          autoHeightMin={180}
          autoHeightMax={180}
          autoHide
        >
          <div
            className="table-responsive-design p-10"
            style={{ width: "100%" }}
          >
            {this.props.loading && <JbsSectionLoader />}
            <Table className="table m-0 p-0">
              <thead>
                <tr className="bg-light">
                  <th>{<IntlMessages id="trading.orders.label.price" />}</th>
                  <th className="numeric">
                    {<IntlMessages id="trading.orders.label.amount" />}
                  </th>
                  <th className="numeric">
                    {<IntlMessages id="trading.orders.label.time" />}
                  </th>
                </tr>
              </thead>
              <tbody>{marketTradeHistoryList}</tbody>
            </Table>
          </div>
        </Scrollbars>
      </Card>
    );
  }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  marketTradeHistory: state.marketTradeHistory.marketHistory,
  loading:state.MarketTradeHistory.loading
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    getMarketTradeHistory,
    closeMarketHistorySocketConnection
  }
)(MarketTradeHistory);
