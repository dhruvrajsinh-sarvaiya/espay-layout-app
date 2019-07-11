// Component for Display Active/recent Orders History By:devang parekh Date : 20-3-2019
// margin trading
import React, { Component, Fragment } from "react";

// function for connect store
import { connect } from "react-redux";

// code added by devang parekh for handle tab wise history of active, recent and trade for margin trading process (25-2-2019)
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import classnames from "classnames";
// import for internationalization
import IntlMessages from "Util/IntlMessages";

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// import Action, Get Open Order Records
import { getRecentOrderList, getOpenOrderList } from "Actions/Trade";

import $ from 'jquery';

import { Row, TabPane, Col } from "reactstrap";

// import My Orders Component
import MyOrders from "./MyOrders";

// import open order component
import OpenOrders from "./OpenOrders";


class MarginActiveOrders extends Component {

  state = {
    selectedOrderType: 0,
    value: 0,
    displayOtherPairs: false,
    currentActiveOrders: [],
    currentRecentOrders: [],
    isComponentActive: 1,
    recentOrderBit: 0,
    activeOrderBitCount: 0,
    openOrderSocketData: [],
    recentOrderSocketData: [],
  };

  // Function for change state for tabs for view By devang parekh Date : 20-3-2019
  changeOrderType = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        selectedOrderType: tab
      });
    }
  };

  // Handle Change Tables
  handleChange = (event, value) => {
    this.setState({
      selectedOrderType: value
    });
  };

  // change tab selection
  handleChangeIndex = index => {
    //set tab index value
    this.setState({ selectedOrderType: index });
  };

  // code added by devang parekh (25-2-2019)
  // for handling tab wise active and recent trade history
  changeTab = (event, value) => {
    this.setState({
      value: value,
    });
  };

  handleChangeDisplayPair = event => {
    this.setState({ displayOtherPairs: !this.state.displayOtherPairs });
  };
  // end code

  componentWillMount() {

    this.isComponentActive = 1;
    this.props.getRecentOrderList({ IsMargin: 1 });
    this.props.getOpenOrderList({ IsMargin: 1 });

    // start process for handle singlar response
    this.processForAcitveOrder();
    this.processForRecentOrder();
    //end

  }

  componentWillReceiveProps(nextprops) {

    // process for handle response of recent orders
    if (nextprops.activeOpenOrder.length !== 0 && this.state.recentOrderBit !== nextprops.recentOrderBit) {

      // set Active My Open Order list if gets from API only
      this.setState({
        currentRecentOrders: nextprops.activeOpenOrder,
        showLoader: false,
        recentOrderBit: nextprops.recentOrderBit
      });

    } else if (nextprops.activeOpenOrder.length === 0 && this.state.recentOrderBit !== nextprops.recentOrderBit) {

      this.setState({
        currentRecentOrders: [],
        showLoader: false,
        recentOrderBit: nextprops.recentOrderBit
      });

    }
    //end

    // code for active order process when response comes
    if (nextprops.activeMyOpenOrder.length !== 0 && this.state.activeOrderBitCount !== nextprops.activeOrderBit) {

      // set Active My Open Order list if gets from API only
      this.setState({
        currentActiveOrders: nextprops.activeMyOpenOrder,
        showLoader: false,
        activeOrderBitCount: nextprops.activeOrderBit
      });

    } else if (nextprops.activeMyOpenOrder.length === 0 && this.state.activeOrderBitCount !== nextprops.activeOrderBit) {

      this.setState({
        currentActiveOrders: [],
        showLoader: false,
        activeOrderBitCount: nextprops.activeOrderBit
      });

    }
    // end

  }

  componentWillUnmount() {
    this.isComponentActive = 0;
  }

  // process for handle response from signalr active order udpation
  processForAcitveOrder = () => {

    // Call When Get Data From Socket/SignalR      
    this.props.hubConnection.on('RecieveActiveOrder', (openOrderDetail) => {

      if (this.isComponentActive === 1 && openOrderDetail !== null) {

        try {

          const openOrderDetailData = JSON.parse(openOrderDetail);

          if ((openOrderDetailData.EventTime && this.state.openOrderSocketData.length === 0) ||
            (this.state.openOrderSocketData.length !== 0 && openOrderDetailData.EventTime >= this.state.openOrderSocketData.EventTime)) {

            if (typeof openOrderDetailData.IsMargin !== 'undefined' && openOrderDetailData.IsMargin === 1) {

              const newData = openOrderDetailData.Data
              if (parseFloat(newData.Price) >= 0) {

                var openorders = $.extend(true, [], this.state.currentActiveOrders);
                var findIndexOrderId = openorders.findIndex(openorder => parseFloat(openorder.Id) === parseFloat(newData.Id));
                if (findIndexOrderId === -1) {

                  if (parseFloat(newData.Amount) > 0) {
                    openorders.unshift(newData)
                  }

                } else {

                  if (parseFloat(newData.Amount) > 0) {
                    openorders[findIndexOrderId] = newData
                  } else {
                    openorders.splice(findIndexOrderId, 1)
                  }

                }

                this.setState({ currentActiveOrders: openorders, openOrderSocketData: openOrderDetailData });

              }

            }

          }

        } catch (error) {

        }

      }

    });

  }

  // process for handle response from signalr active order udpation
  processForRecentOrder = () => {

    // Invoke When Get Response From Socket/SignalR
    this.props.hubConnection.on('RecieveRecentOrder', (openOrderDetail) => {

      if (this.state.isComponentActive === 1 && openOrderDetail !== null) {

        try {

          const openOrderDetailData = JSON.parse(openOrderDetail);

          if ((openOrderDetailData.EventTime && this.state.recentOrderSocketData.length === 0) ||
            (this.state.recentOrderSocketData.length !== 0 && openOrderDetailData.EventTime >= this.state.recentOrderSocketData.EventTime)) {

            if (typeof openOrderDetailData.IsMargin !== 'undefined' && openOrderDetailData.IsMargin === 1) {

              const newData = openOrderDetailData.Data

              if (parseFloat(newData.TrnNo) > 0) {

                var recentOrders = $.extend(true, [], this.state.currentRecentOrders);
                var findIndexOrderId = recentOrders.findIndex(recentOrder => parseFloat(recentOrder.TrnNo) === parseFloat(newData.TrnNo));
                if (findIndexOrderId === -1) {

                  if (parseFloat(newData.Qty) > 0) {
                    recentOrders.unshift(newData)
                  }

                } else {

                  if (parseFloat(newData.Qty) > 0) {
                    recentOrders[findIndexOrderId] = newData
                  }

                }

                this.setState({ currentRecentOrders: recentOrders, recentOrderSocketData: openOrderDetailData });

              }

            }

          }

        } catch (error) {

        }

      }

    });

  }

  render() {

    return (

      <Fragment>
        <Row className="cooldexmargintradeHeader">

          <Col md={10} className="cooldexplsheader pr-0">
            <AppBar
              position="static"
              className={classnames(
                this.props.darkMode && "darkordertabmenu p-0",
                "cooldexplstebmenu p-0"
              )}
            >
              <Tabs
                value={this.state.value}
                onChange={this.changeTab}
                textColor="primary"
                fullWidth
              >
                {<Tab
                  label={<IntlMessages id="trading.newTrading.openorder.text" />}
                  className={classnames(
                    { active: this.state.value === 0 },
                    ""
                  )}
                />}

                {<Tab
                  label={
                    <IntlMessages id="trading.newTrading.openhistory.text" />
                  }
                  className={classnames(
                    { active: this.state.value === 1 },
                    ""
                  )}
                />}


              </Tabs>
            </AppBar>
          </Col>
          <Col md={2} xs={5} className="p-0">
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.displayOtherPairs}
                  onChange={this.handleChangeDisplayPair}
                  icon={<CheckBoxOutlineBlankIcon />}
                  checkedIcon={<CheckBoxIcon />}
                />
              }
              label={<IntlMessages id="trading.activeorders.hidepairs" />}
            />
          </Col>
        </Row>
        {this.state.value === 0 && (
          <TabPane tabId={this.state.value}>
            <OpenOrders
              {...this.props}
              firstCurrency={this.props.firstCurrency}
              secondCurrency={this.props.secondCurrency}
              currencyPair={this.props.currencyPair}
              hubConnection={this.props.hubConnection}
              marginTrading={this.props.marginTrading}
              displayOtherPairs={this.state.displayOtherPairs}
              currentActiveOrders={this.state.currentActiveOrders}

            />
          </TabPane>
        )}

        {this.state.value === 1 && (
          <TabPane tabId={this.state.value}>
            <MyOrders
              {...this.props}
              firstCurrency={this.props.firstCurrency}
              secondCurrency={this.props.secondCurrency}
              currencyPair={this.props.currencyPair}
              hubConnection={this.props.hubConnection}
              marginTrading={this.props.marginTrading}
              displayOtherPairs={this.state.displayOtherPairs}
              currentRecentOrders={this.state.currentRecentOrders}
            />
          </TabPane>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ settings, recentOrder, openOrder }) => {
  const { darkMode } = settings;
  const { loading, recentOrderBit, OpenOrder } = recentOrder;
  const { activeOpenMyOrder, activeOrderBit } = openOrder;
  var activeOpenOrder = OpenOrder, activeMyOpenOrder = activeOpenMyOrder;

  return { darkMode, loading, recentOrderBit, activeOpenOrder, activeMyOpenOrder, activeOrderBit };
};

// connect action with store for dispatch
export default connect(mapStateToProps, {
  getOpenOrderList,
  getRecentOrderList
})(MarginActiveOrders);