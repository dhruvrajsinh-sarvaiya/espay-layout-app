// Component for Place Order Detail And Displaying Components  By:Tejas Date : 13/9/2018

// Coponent changed by devang parekh for handling margintrading process (20-2-2019)

import React, { Component, Fragment } from "react";
import { TabPane, Row, Col } from "reactstrap";
import classnames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// function for connect store
import { connect } from "react-redux";



//import  Limit Order type Component
import LimitOrder from "./LimitOrders";

//import Market Order type Component
import MarketOrder from "./MarketOrder";

//import Stop Limit Order type Component
import StopLimitOrder from "./StopLimitOrder";

// import spot Limit Order
import SpotOrder from "./SpotOrder";

// import for internationalization
import IntlMessages from "Util/IntlMessages";

import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';

class PlaceOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      currentPrice: [],
      firstCurrencyBalance: 0,
      secondCurrencyBalance: 0,
      Wallet: [],
      chargesList:[],
      Takers:0,
      Makers:0,
      firstCurrencyTakers:0,
      firstCurrencyMakers:0,
      chargeCurrency:'',
      firstCurrencyChargeCurrency:'',
      open: false,
      anchorEl : null
    };
  }

  // invoke before Compoent render
  componentDidMount() {
    
  }

  componentWillMount() {
    
    this.setState({
      firstCurrencyBalance: this.props.firstCurrencyBalance,
      secondCurrencyBalance: this.props.secondCurrencyBalance
    });   
  }

  handleChange = (event, value) => {
    this.setState({
      value: value
    });
  };
  componentWillReceiveProps(nextprops) {

    
    
    if(nextprops.currencyPair !== this.props.currencyPair){
      this.setState({
        value:0
      })
    }
  }

  // change tab selection
  handleChangeIndex = index => {
    //set tab index value
    this.setState({ value: index });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClickButton = () => {
    this.setState({
      open: true,
      anchorEl: findDOMNode(this.button),
    });
  };

  render() {
    const darkMode = this.props.darkMode;
    if (this.state.firstCurrencyBalance === 0 && this.state.secondCurrencyBalance === 0 ) {
      this.state.firstCurrencyBalance = this.props.firstCurrencyBalance;
      this.state.secondCurrencyBalance = this.props.secondCurrencyBalance;
    }

    return (
      <Fragment>
       
        <div>
          <Row className="pt-0. pl-0 pr-15">
            <Col md={7} className="cooldexplsheader pr-0">
             
              <AppBar
                position="static"
                className={classnames(
                  darkMode && "darkordertabmenu p-0",
                  "cooldexplstebmenu p-0"
                )}
              >
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                
                  textColor="primary"
                  fullWidth
                >
                  {<Tab
                    label={<IntlMessages id="trading.placeorder.label.limit" />}
                    className={classnames(
                      { active: this.state.value === 0 },
                      ""
                    )}
                  />}

                  { <Tab
                    label={
                      <IntlMessages id="trading.placeorder.label.market" />
                    }
                    className={classnames(
                      { active: this.state.value === 1 },
                      ""
                    )}
                  />}

                  { <Tab
                    label={
                      <IntlMessages id="trading.placeorder.label.spot" />
                    }
                    className={classnames(
                      { active: this.state.value === 2 },
                      ""
                    )}
                  />}

                  {<Tab
                    label={
                      <IntlMessages id="trading.placeorder.label.stoplimit" />
                    }
                    className={classnames(
                      { active: this.state.value === 3 },
                      ""
                    )}
                  />}

                </Tabs>
              </AppBar>
            </Col>
            <Col md={{size:5}} className="text-right">
              {" "}
              <div  className="mt-10 mr-10">
              <Link to="/app/pages/fees" className="float-right"><IntlMessages id="sidebar.fees" /></Link>
              
              }

              </div>         
            </Col>
          </Row> 
        </div>

        {this.state.value === 0 && (
          <TabPane tabId={this.state.value}>
            <LimitOrder
              {...this.props}
              info={this.props}
              state={this.state}             
              firstCurrencyBalance={this.props.firstCurrencyBalance}
              secondCurrencyBalance={this.props.secondCurrencyBalance}
              bulkBuyOrder={this.props.bulkBuyOrder}
              bulkSellOrder={this.props.bulkSellOrder}
              firstCurrencyWalletId={this.props.firstCurrencyWalletId}
              secondCurrencyWalletId={this.props.secondCurrencyWalletId}
              takers={this.props.takersValue}
              makers={this.props.makersValue}
              handleChange={this.state.value}              
            /> 
          </TabPane>
        )}
        {(this.state.value === 1) && (
          <TabPane tabId={this.state.value}>
            <MarketOrder
                {...this.props}
                info={this.props}
                state={this.state}             
                firstCurrencyBalance={this.props.firstCurrencyBalance}
                secondCurrencyBalance={this.props.secondCurrencyBalance}
                bulkBuyOrder={this.props.bulkBuyOrder}
                bulkSellOrder={this.props.bulkSellOrder}
                firstCurrencyWalletId={this.props.firstCurrencyWalletId}
                secondCurrencyWalletId={this.props.secondCurrencyWalletId}
                takers={this.props.takersValue}
                makers={this.props.makersValue}
                handleChange={this.state.value} 
            />
          </TabPane>
        )}
        {(this.state.value === 2) && (
          <TabPane tabId={this.state.value}>
            <SpotOrder
              {...this.props}
              info={this.props}
              state={this.state}             
              firstCurrencyBalance={this.props.firstCurrencyBalance}
              secondCurrencyBalance={this.props.secondCurrencyBalance}
              bulkBuyOrder={this.props.bulkBuyOrder}
              bulkSellOrder={this.props.bulkSellOrder}
              firstCurrencyWalletId={this.props.firstCurrencyWalletId}
              secondCurrencyWalletId={this.props.secondCurrencyWalletId}
              takers={this.props.takersValue}
              makers={this.props.makersValue}
              handleChange={this.state.value} 
            />
          </TabPane>
        )}

        {this.state.value === 3 && (
          <TabPane tabId={this.state.value}>
            <StopLimitOrder
              {...this.props}
              info={this.props}
              state={this.state}             
              firstCurrencyBalance={this.props.firstCurrencyBalance}
              secondCurrencyBalance={this.props.secondCurrencyBalance}
              bulkBuyOrder={this.props.bulkBuyOrder}
              bulkSellOrder={this.props.bulkSellOrder}
              firstCurrencyWalletId={this.props.firstCurrencyWalletId}
              secondCurrencyWalletId={this.props.secondCurrencyWalletId}
              takers={this.props.takersValue}
              makers={this.props.makersValue}
              handleChange={this.state.value} 
            />
          </TabPane>
        )}

      </Fragment>
    );
  }
}

const mapStateToProps = ({ settings, currency, currentMarketCap/* ,chargeList */ }) => {
  
  const { darkMode } = settings;
  const { loading, buyOrderLoading, sellOrderLoading } = currency;
  const currentPrice = currentMarketCap.currentMarketCap;
  const lastPriceBit = currentMarketCap.lastPriceBit;
  
  
  return { darkMode, currentPrice, loading, buyOrderLoading, sellOrderLoading,lastPriceBit /* ,chargesList */ };
};
// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    
  }
)(PlaceOrder);
