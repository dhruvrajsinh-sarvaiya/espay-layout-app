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

//import { getCurrentPrice,getChargeList } from "Actions/Trade";

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

//import { getWallets } from "Actions/Withdraw";

//import Popover from '@material-ui/core/Popover';
//import Typography from '@material-ui/core/Typography';
import { findDOMNode } from 'react-dom';
//import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";
//import Button from '@material-ui/core/Button';
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
    // code changed by devang parekh for handling margin trading process
    /* if(this.props.hasOwnProperty('marginTrading') && this.props.marginTrading === 1) {
    
      this.props.getChargeList({marginTrading:1})
      //load Currency List
      //this.props.getCurrentPrice({ Pair: this.props.currencyPair,marginTrading:1 });    
    
    } else {

      this.props.getChargeList({})
      //load Currency List
      //this.props.getCurrentPrice({ Pair: this.props.currencyPair });    
      
    } */
    
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

    /* if(nextprops.chargesList && nextprops.chargesList.length > 0){
      nextprops.chargesList.map((value,key) =>{
        
        if(this.props.secondCurrency == value.WalletTypeName){
          if(value.Charges.length > 0){
            value.Charges.map((item,key1) =>{
              if(item.TrnTypeId == 3){
                this.setState({
                  Takers:item.TakerCharge,
                  Makers:item.MakerCharge,
                  chargeCurrency:item.DeductWalletTypeName
                })
              }
            })
          }
        }

        if(this.props.firstCurrency == value.WalletTypeName){
          if(value.Charges.length > 0){
            value.Charges.map((item,key1) =>{
              if(item.TrnTypeId == 3){
                this.setState({
                  firstCurrencyTakers:item.TakerCharge,
                  firstCurrencyMakers:item.MakerCharge,
                  firstCurrencyChargeCurrency:item.DeductWalletTypeName
                })
              }
            })
          }
        }
        
      })
      this.setState({
        chargesList:nextprops.chargesList
      })
    } */
    
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
        {/* {this.props.loading && <JbsSectionLoader />} */}
        <div>
          <Row className="pt-0. pl-0 pr-15">
            <Col md={7} className="cooldexplsheader pr-0">
              {/* <h4>{<IntlMessages id="trading.placeorder.label.title" />}</h4> */}
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
                  //indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                  // scrollable
                  // scrollButtons="off"
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
              
              {/* <IntlMessages id="trading.placeorder.label.fee" /> (%) : 
              <IntlMessages id="trading.placeorder.label.takers" /> {" " + this.state.Takers} {" "}
              <IntlMessages id="trading.placeorder.label.makers" /> {" " + this.state.Makers} 
             
              <a href="javascript:void(0)" className="ml-10 mp-10" ref={node => { this.button = node; }} onClick={this.handleClickButton} >
                <i className="material-icons">info</i>
              </a>
              <Popover open={this.state.open} anchorEl={this.state.anchorEl} anchorReference={"anchorEl"} anchorPosition={{ top: 300, left: 800 }}
                onClose={this.handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center", }}
                transformOrigin={{ vertical: "top", horizontal: "center", }} >
                <Typography className="p-15">
                  <div className="row">
                      <div className="col-sm-12 font-weight-bold text-center">
                        <IntlMessages id="trading.placeorder.label.fee" />
                      </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4 font-weight-bold">
                    </div>
                    <div className="col-sm-4 font-weight-bold">
                      <IntlMessages id="trading.placeorder.label.takers" />
                    </div>
                    <div className="col-sm-4 font-weight-bold">
                      <IntlMessages id="trading.placeorder.label.makers" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4 font-weight-bold">
                      {this.props.firstCurrency}
                    </div>
                    <div className="col-sm-4">
                      {this.state.firstCurrencyTakers} 
                    </div>
                    <div className="col-sm-4">
                      {this.state.firstCurrencyMakers} 
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4 font-weight-bold">
                      {this.props.secondCurrency}
                    </div>
                    <div className="col-sm-4">
                      {this.state.Takers} 
                    </div>
                    <div className="col-sm-4">
                      {this.state.Makers} 
                    </div>
                  </div>
                </Typography>
              </Popover> */}

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
  //const {chargesList} = chargeList;
  
  return { darkMode, currentPrice, loading, buyOrderLoading, sellOrderLoading,lastPriceBit /* ,chargesList */ };
};
// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    //getCurrentPrice,
    //getWallets,
    //getChargeList
  }
)(PlaceOrder);
