// Component for Display Active Orders History By:Tejas Date : 13/9/2018

import React, { Component, Fragment } from "react";

// import for Tabs
import { TabPane, Card, Col, Row, Input } from "reactstrap";

// import check box and labels
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

// used for multiple classes with conditions
import classnames from "classnames";

// import Appbar for display buttons
import AppBar from "@material-ui/core/AppBar";

// Display tables as a Swipable View When Change
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// import My Orders Component
import MyOrders from "./MyOrders";

// import open order component
import OpenOrders from "./OpenOrders";

// function for connect store
import { connect } from "react-redux";

// intl messages for language
import IntlMessages from "Util/IntlMessages";

import { getOpenOrderList, getRecentOrderList } from "Actions/Trade";

import $ from 'jquery';

// const orderTypes = [
//   { "type": "LIMIT", "ID": "1" },
//   { "type": "MARKET", "ID": "2" },
//   // { "type": "SPOT", "ID": "3" },
//   { "type": "STOP_Limit", "ID": "4" },
// ]


class ActiveOrder extends Component {
  state = {
    selectedOrderType: 0,
    displayOtherPairs: false,
    cancelAll: 0,
    cancelAllValue: "",
    activeMyOpenOrder: [],
    showLoader: false,
    activeOrderBitCount: 0,
    activeOpenOrder: [],
    recentOrderBit: 0,
    socketData: [],
    recentOrderSocketData: []

  };

  // Function for change state for tabs for view By Tejas Date : 13/9/2018
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

  // Handle Checkbox for display particular currency Data
  handleChangeDisplayPair = event => {
    this.setState({ displayOtherPairs: !this.state.displayOtherPairs });
  };

  // cancel All Modal and open new dialog
  openCancelAllModal = (e) => {
    this.setState({
      cancelAll: 1,
      cancelAllValue: e.target.value
    })
  }

  // code added by devang parekh for handling active and recent order for both component (29-3-2019)
  componentWillMount() {

    this.isComponentActive = 1;
    this.processForActiveOrder(); //process for handling signalr response
    this.processForRecentOrder(); //process for handling signalr response

  }

  // active order process for handling signalr response
  processForActiveOrder() {

    // Call When Get Data From Socket/SignalR      
    this.props.hubConnection.on('RecieveActiveOrder', (openOrderDetail) => {

      //console.log("call from SignalR RecieveOpenOrder",openOrderDetail);
      if (this.isComponentActive === 1 && openOrderDetail !== null) {

        //var openorders = this.state.activeMyOpenOrder;  
        try {

          const openOrderDetailData = JSON.parse(openOrderDetail);

          if ((openOrderDetailData.EventTime && this.state.socketData.length === 0) ||
            (this.state.socketData.length !== 0 && openOrderDetailData.EventTime >= this.state.socketData.EventTime)) {

            const newData = openOrderDetailData.Data
            if (parseFloat(newData.Price) >= 0) {

              var openorders = $.extend(true, [], this.state.activeMyOpenOrder);
              //console.log("findIndexOrderId start ",(new Date()))
              var findIndexOrderId = openorders.findIndex(openorders => parseFloat(openorders.Id) === parseFloat(newData.Id));
              //console.log("findIndexOrderId end ",findIndexOrderId,(new Date()))
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

              this.setState({ activeMyOpenOrder: openorders, socketData: openOrderDetailData });

            }

          }

        } catch (error) {
          //console.log("errorRecieveActiveOrder ",error)
        }

      }

    });

    this.props.getOpenOrderList({});

  }

  // recent order process for handling signalr response
  processForRecentOrder() {

    // Invoke When Get Response From Socket/SignalR
    this.props.hubConnection.on('RecieveRecentOrder', (openOrderDetail) => {

      //console.log("Get Data from signalR RecieveRecentOrder", openOrderDetail);
      if (this.isComponentActive === 1 && openOrderDetail !== null) {

        //var recentOrders = this.state.activeOpenOrder   
        try {

          const openOrderDetailData = JSON.parse(openOrderDetail);

          if ((openOrderDetailData.EventTime && this.state.recentOrderSocketData.length === 0) ||
            (this.state.recentOrderSocketData.length !== 0 && openOrderDetailData.EventTime >= this.state.recentOrderSocketData.EventTime)) {

            const newData = openOrderDetailData.Data

            if (parseFloat(newData.TrnNo) > 0) {

              var recentOrders = $.extend(true, [], this.state.activeOpenOrder);
              //console.log("findIndexOrderId start ",(new Date()))
              var findIndexOrderId = recentOrders.findIndex(recentOrders => parseFloat(recentOrders.TrnNo) === parseFloat(newData.TrnNo));
              //console.log("findIndexOrderId end ",findIndexOrderId,(new Date()))                  
              if (findIndexOrderId === -1) {

                if (parseFloat(newData.Qty) > 0) {
                  recentOrders.unshift(newData)
                }

              } else {

                if (parseFloat(newData.Qty) > 0) {
                  recentOrders[findIndexOrderId] = newData
                }

              }

              this.setState({ activeOpenOrder: recentOrders, recentOrderSocketData: openOrderDetailData });

            }

          }

        } catch (error) {
          //console.log("errorRecieveRecentOrder ",error)
        }

      }

    });

    this.props.getRecentOrderList({});

  }

  //end

  componentWillReceiveProps(nextprops) {

    // active order process
    if (nextprops.activeMyOpenOrder && nextprops.activeMyOpenOrder.length !== 0 && this.state.activeOrderBitCount !== nextprops.activeOrderBit) {

      // set Active My Open Order list if gets from API only
      this.setState({
        activeMyOpenOrder: nextprops.activeMyOpenOrder,
        showLoader: false,
        activeOrderBitCount: nextprops.activeOrderBit
      });

    } else if (nextprops.activeMyOpenOrder && nextprops.activeMyOpenOrder.length === 0 && this.state.activeOrderBitCount !== nextprops.activeOrderBit) {

      this.setState({
        activeMyOpenOrder: [],
        showLoader: false,
        activeOrderBitCount: nextprops.activeOrderBit
      });

    }

    //console.log("nextprops", nextprops)
    //console.log("this.state.recentOrderBit !== nextprops.recentOrderBit", this.state.recentOrderBit , nextprops.recentOrderBit)
    // recent order process
    if (nextprops.activeOpenOrder && nextprops.activeOpenOrder.length !== 0 && this.state.recentOrderBit !== nextprops.recentOrderBit) {

      // set Active My Open Order list if gets from API only
      this.setState({
        activeOpenOrder: nextprops.activeOpenOrder,
        showLoader: false,
        recentOrderBit: nextprops.recentOrderBit
      });

    } else if (nextprops.activeOpenOrder && nextprops.activeOpenOrder.length === 0 && this.state.recentOrderBit !== nextprops.recentOrderBit) {

      this.setState({
        activeOpenOrder: [],
        showLoader: false,
        recentOrderBit: nextprops.recentOrderBit
      });

    }

  }

  componentWillUnmount() {
    this.isComponentActive = 0;
  }

  // render Component and view for Acive order component
  render() {

    //console.log("this.state",this.state)
    // const darkMode = this.props.darkMode;
    
    return (
      <Fragment>
        <Card>
          <Row>
            <Col sm={this.state.selectedOrderType === 0 ? 6 : 9}>
              <AppBar
                position="static"
                className="z_index_appbar"
              >

                <Tabs
                  value={this.state.selectedOrderType}
                  onChange={this.handleChange}
                  textColor="primary"
                // fullWidth            
                >
                  <Tab
                    label={<IntlMessages id="trading.activeorders.label.openorder" />}
                    className={classnames(
                      { active: this.state.selectedOrderType === 0 },
                      ""
                    )}
                  />

                  <Tab
                    label={<IntlMessages id="trading.activeorders.label.myorder" />}
                    className={classnames(
                      { active: this.state.selectedOrderType === 1 },
                      ""
                    )}
                  />

                </Tabs>
              </AppBar>
            </Col>

            <Col sm={6} md={3}>
              <div className="placeordertabmenu">
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
              </div>
            </Col>

            {this.state.selectedOrderType === 0 ?
              <Col sm={6} md={3}>
                <Input
                  type="select"
                  name="CancelAll"
                  value={this.state.cancelOrderBit}
                  onChange={(e) => this.openCancelAllModal(e)}
                >
                  <IntlMessages id="openorder.cancelall">
                    {(select) =>
                      <option value="">{select}</option>
                    }
                  </IntlMessages>

                  <IntlMessages id="openorder.cancelalltrn">
                    {(select) =>
                      <option value="0">{select}</option>
                    }
                  </IntlMessages>

                  <IntlMessages id="openorder.cancelalllimit">
                    {(select) =>
                      <option value="1">{select}</option>
                    }
                  </IntlMessages>

                  <IntlMessages id="openorder.cancelallmarket">
                    {(select) =>
                      <option value="2">{select}</option>
                    }
                  </IntlMessages>

                  {/* <IntlMessages id="openorder.cancelallspot">
          {(select) =>
            <option value="3">{select}</option>
          }
        </IntlMessages> */}

                  {/* <IntlMessages id="openorder.cancelallstop">
                  {(select) =>
                    <option value="4">{select}</option>
                  }
                </IntlMessages> */}

                  <IntlMessages id="openorder.cancelallstop-limit">
                    {(select) =>
                      <option value="4">{select}</option>
                    }
                  </IntlMessages>
                </Input>
              </Col>
              :
              <Col sm={6} md={3}>

              </Col>
            }

          </Row>
          <SwipeableViews
            index={this.state.selectedOrderType}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabPane tabId="0">
              <MyOrders
                {...this.props}
                firstCurrency={this.props.firstCurrency}
                secondCurrency={this.props.secondCurrency}
                currencyPair={this.props.currencyPair}
                hubConnection={this.props.hubConnection}
                hideOtherPairs={this.state.displayOtherPairs}
                cancelAll={this.state.cancelAll}
                cancelAllValue={this.state.cancelAll === 1 ? this.state.cancelAllValue : undefined}
                activeMyOpenOrder={this.state.activeMyOpenOrder}
              />
            </TabPane>
            <TabPane tabId="1">
              <OpenOrders
                {...this.props}
                firstCurrency={this.props.firstCurrency}
                secondCurrency={this.props.secondCurrency}
                currencyPair={this.props.currencyPair}
                hubConnection={this.props.hubConnection}
                hideOtherPairs={this.state.displayOtherPairs}
                activeOpenOrder={this.state.activeOpenOrder}
              />
            </TabPane>
          </SwipeableViews>
        </Card>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ settings, openOrder, recentOrder }) => {

  const { darkMode } = settings;
  const { activeOpenMyOrder, loading, activeOrderBit } = openOrder;  
  const { OpenOrder, recentOrderBit } = recentOrder;

  var activeMyOpenOrder = activeOpenMyOrder,activeOpenOrder=OpenOrder;

  return { darkMode, activeMyOpenOrder, loading, activeOrderBit, activeOpenOrder, recentOrderBit };

};

// connect action with store for dispatch
export default connect(mapStateToProps, {
  getOpenOrderList,
  getRecentOrderList
})(ActiveOrder);
