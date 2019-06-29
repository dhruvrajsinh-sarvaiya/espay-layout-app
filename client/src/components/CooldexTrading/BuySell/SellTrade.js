// Component for display Seller Order Data By:Tejas Date : 13/9/2018

import React, { Fragment, Component } from "react";
import $ from 'jquery';
// import scrollbar
import { Scrollbars } from "react-custom-scrollbars";
// components for modal/ dialog box
import { Table } from "reactstrap";
// Import For Loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";
// intl messages
import IntlMessages from "Util/IntlMessages";
// function for connect store
import { connect } from "react-redux";
import AppConfig from 'Constants/AppConfig';
var sellorDepth = AppConfig.totalOrders;
const buySellRecordCount = AppConfig.buySellRecordCount;

class SellOrderRow extends Component {
  // Function for Open Dislog box For Bulk Order
  bulkOrderProcess(key) {
    if (key < 999)
      this.props.placeOrder(key);
  }

  render() {
    var lastClass = "text-danger",
      changeClass = "";

    if (this.props.UpDownBit === 1) {
      changeClass = "blink_me";
    }

    const highDepth = this.props.Price !== '-' ? parseFloat(this.props.Amount * 100 / sellorDepth).toFixed(2) : 0;

    return (
      <tr
        key={this.props.indexValue.toString()}
        onClick={() => this.bulkOrderProcess(this.props.indexValue)}
        style={{
          cursor: "pointer", background: "linear-gradient(rgba(250,82,82,.15),rgba(250,82,82,.15)) 100% 0%",
          backgroundRepeat: "no-repeat",
          backgroundSize: (highDepth >= 100 ? '100%' : highDepth + "%")
        }}
        className={(this.props.UpDownBit === 1) ? changeClass + " sellOrderClass" : ''}
      >
        <td>{this.props.Price !== '-' ? parseFloat(this.props.Price).toFixed(8) : '-'}</td>
        <td className={lastClass}>{this.props.Amount !== '-' ? parseFloat(this.props.Amount).toFixed(8) : '-'}</td>
        <td>{this.props.Price !== '-' ? parseFloat(this.props.Amount * this.props.Price).toFixed(8) : '-'}</td>
      </tr>
    );
  }
}

class SellTrade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sellerOrderList: this.props.sellerOrderList.length ? this.props.sellerOrderList : [],
      sectionReload: false,
      showLoader: true,
      oldState: [],
      grandTotal: 0,
      bulkOrders: [],
      socketData: [],
      socketSellData: [],
      sellOrderBit: 0,
      lastPrice: 0,
      lastPriceRecord: {},
      socketLastPriceData: []
    };
    this.isComponentActive = 1;
  }

  setOrders = (index) => {

    var amount = 0;
    var price = 0

    if (this.props.sellerOrderList.length !== 0) {

      const indexValue = (this.props.sellerOrderList.length - (index + 1))
      var sellOrderDetail = $.extend(true, [], this.props.sellerOrderList);

      sellOrderDetail.map((value, key) => {
        if (this.props.displayTable === false) {
          if (indexValue <= key) {
            amount = amount + value.Amount;
          }
        } else {
          if (indexValue >= key) {
            amount = amount + value.Amount;
          }
        }

        if (indexValue === key) {
          price = value.Price
        }
      });
    }
    this.props.setData(price, amount)
  }

  componentWillUnmount() {
    this.isComponentActive = 0;
  }

  // Render Component for Seller Order
  render() {
    if (this.props.displayTable === false) {
      this.props.sellerOrderList.sort(function (a, b) {
        return parseFloat(b.Price) - parseFloat(a.Price)
      })
    } else {
      this.props.sellerOrderList.sort(function (a, b) {
        return parseFloat(a.Price) - parseFloat(b.Price)
      })
    }

    sellorDepth = Math.max.apply(Math, this.props.sellerOrderList.map(function (o) { return o.Amount; }))
    var sellOrderListRow = [];
    $(".sellOrderClass").removeClass('blink_me');

    const diffLimit = buySellRecordCount - this.props.sellerOrderList.length;
    var countSell = (this.props.sellerOrderList.length - 1);
    var lastIndex = 0
    if (this.props.displayTable === false && diffLimit > 0) {

      countSell = buySellRecordCount - 1;
      for (; lastIndex < diffLimit; lastIndex++) {

        sellOrderListRow.push(
          <SellOrderRow
            key={lastIndex}
            Price={"-"}
            Amount={"-"}
            indexValue={countSell--}
            placeOrder={this.setOrders}
            UpDownBit={0}
            length={this.props.sellerOrderList.length}
          />
        );
      }
    } else if (this.props.displayTable === false && diffLimit <= 0) {
      countSell = buySellRecordCount - 1;
    }

    this.props.sellerOrderList.map((newSellOrder, indexValue) => {

      if (this.props.displayTable === false) {
        if ((this.props.sellerOrderList.length - buySellRecordCount) <= indexValue) {

          sellOrderListRow.push(
            <SellOrderRow
              key={lastIndex}
              Price={newSellOrder.Price}
              Amount={newSellOrder.Amount}
              indexValue={countSell--}
              placeOrder={this.setOrders}
              UpDownBit={newSellOrder.UpDownBit}
              length={this.props.sellerOrderList.length}
            />
          );
        }
        lastIndex++;
      } else {

        sellOrderListRow.push(
          <SellOrderRow
            key={indexValue}
            Price={newSellOrder.Price}
            Amount={newSellOrder.Amount}
            indexValue={countSell--}
            placeOrder={this.setOrders}
            UpDownBit={newSellOrder.UpDownBit}
            length={this.props.sellerOrderList.length}
          />
        );
      }
    });

    return (
      <Fragment>
        {this.props.loading && <JbsSectionLoader />}
        {this.props.displayTable === false ?
          <Table className="table m-0 p-0">
            <thead>
              <tr className="text-dark">
                <th>{<IntlMessages id="trading.orders.label.price" />} ({this.props.secondCurrency})</th>
                <th className="numeric">
                  {<IntlMessages id="trading.orders.label.amount" />} ({this.props.firstCurrency})
            </th>
                <th className="numeric">
                  {<IntlMessages id="trading.orders.label.total" />} ({this.props.secondCurrency})
            </th>
              </tr>
            </thead>
            <tbody>{sellOrderListRow}</tbody>
          </Table> :
          <Scrollbars
            className="jbs-scroll"
            autoHeight
            autoHeightMin={this.props.autoHeightMin}
            autoHeightMax={this.props.autoHeightMax}
            autoHide
          >
            <Table className="table m-0 p-0">
              <thead>
                <tr className="text-dark">
                  <th>{<IntlMessages id="trading.orders.label.price" />} ({this.props.secondCurrency})</th>
                  <th className="numeric">
                    {<IntlMessages id="trading.orders.label.amount" />} ({this.props.firstCurrency})
            </th>
                  <th className="numeric">
                    {<IntlMessages id="trading.orders.label.total" />} ({this.props.secondCurrency})
            </th>
                </tr>
              </thead>
              <tbody>{sellOrderListRow}</tbody>
            </Table>
          </Scrollbars>
        }
      </Fragment>
    );
  }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  loading: state.sellerOrder.loading,
  darkMode: state.settings.darkMode,
});

// connect action with store for dispatch
export default connect(mapStateToProps, {})(SellTrade);
