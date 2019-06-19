// Component for Display Active Orders History By:Tejas Date : 13/9/2018

import React, { Component, Fragment } from "react";

// import for Tabs
import {Col,Row } from "reactstrap";


// import My Orders Component
import MyOrders from "./MyOrders";

// import open order component
import OpenOrders from "./OpenOrders";

// function for connect store
import { connect } from "react-redux";

class ActiveOrder extends Component {
  state = {
    selectedOrderType: 0,    
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

  // render Component and view for Acive order component
  render() {
    
    return (
      <Fragment>
          <Row>
              <Col md={12}>
                  <MyOrders
                  {...this.props} 
                    firstCurrency={this.props.firstCurrency}
                    secondCurrency={this.props.secondCurrency}
                    currencyPair={this.props.currencyPair}
                    hubConnection={this.props.hubConnection}                    
                  />
              </Col>
            </Row>    
        
            <Row>
              <Col md={12}>
                  <OpenOrders
                  {...this.props} 
                    firstCurrency={this.props.firstCurrency}
                    secondCurrency={this.props.secondCurrency}
                    currencyPair={this.props.currencyPair}
                    hubConnection={this.props.hubConnection}                    
                  />
              </Col>
            </Row>  
      </Fragment>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { darkMode } = settings;
  return { darkMode };
};

// connect action with store for dispatch
export default connect(mapStateToProps)(ActiveOrder);
