// Component for display Buyer Order Data By:Tejas Date : 13/9/2018

// import scrollbar
import { Scrollbars } from "react-custom-scrollbars";

import React, { Fragment, Component } from "react";
import { Table } from "reactstrap";

import $ from 'jquery';

import Divider from "@material-ui/core/Divider";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import for display Loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import Action 
import {
  getBuyerOrderList,
  doBulkSellOrder,  
} from 'Actions/Trade';

// function for connect store
import { connect } from "react-redux";

import AppConfig from 'Constants/AppConfig';
var buyOrderDepth = AppConfig.totalOrders;
const buySellRecordCount = AppConfig.buySellRecordCount;

class BuyOrderRow extends Component {
  // User For Open Dislog box For Bulk Order
  bulkOrderProcess(key) {

    if(key < 999) 
      this.props.openModal(key);
  }

  render() {
    var lastClass = "text-success",
      changeClass = "";

      if (this.props.UpDownBit === 1 ) {      
        changeClass = "blink_me";
      }

      const highDepth = this.props.Price !== '-' ? parseFloat(this.props.Amount * 100 / buyOrderDepth).toFixed(2) : 0;

    return (
      <tr
        key={this.props.indexValue.toString()}   
        onClick={() => this.bulkOrderProcess(this.props.indexValue)}
        style={{cursor:"pointer",background: "linear-gradient(rgba(18,184,134,.15),rgba(18,184,134,.15)) 100% 0%",
        backgroundRepeat: "no-repeat",
        backgroundSize: (highDepth >= 100 && highDepth ? '100%' : highDepth+"%") }}    
        className={(this.props.UpDownBit === 1)? changeClass + " buyOrderClass" : ''}     
      >
      {/* <td className="text-success">{<IntlMessages id="trading.placeorder.label.buy" />} {this.props.indexValue + 1}</td> */}
        <td>{this.props.Price !== '-' ? parseFloat(this.props.Price).toFixed(8) : '-'}</td>
        <td className={lastClass}>{this.props.Amount !== '-' ? parseFloat(this.props.Amount).toFixed(8) : '-'}</td>
        <td>{this.props.Price !== '-' ? parseFloat(this.props.Amount * this.props.Price).toFixed(8) : '-'}</td>
      </tr>
    );
  }
}

class BuyTrade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buyerOrderList: this.props.buyerOrderList.length ? this.props.buyerOrderList : [],
      modal: false,
      modalInfo: 0,
      sectionReload: false,
      showLoader: true,
      oldState: [],
      grandTotal: 0,
      bulkOrders: [],
      modalBuy: false,
      bulkOrderBit: 0,
      bulkOrderResponse: [],
      socketData:[],
      socketLastPriceData:[],
      lastPrice:0,
      UpDown:1,
      isComponentActive:1,
      socketBuyData:[],
      buyOrderBit:0,
      lastPriceRecord:{}
    };  

    this.isComponentActive = 1;
  }

  //Open Modal add new Schedule dailog
  setOrders = (index) =>{
    
    var amount = 0;
    var price = 0
    
    if (this.props.buyerOrderList.length !==0 ) {
      this.props.buyerOrderList.map((value, key) => {

          if (index >= key) {            
            amount = amount + value.Amount;            
          }

          if(index === key ){
            price=value.Price
          }

        });
      }
      
      this.props.setData(price,amount) 

    }
    
  componentDidMount(){

  }

  componentWillUnmount() {
    this.isComponentActive = 0;
  }
   // This will Invoke when component will recieve Props or when props changed
  componentWillReceiveProps(nextprops) {    
    
  }

  // Render Component for Buyer Order
  render() {

    this.props.buyerOrderList.sort(function(a, b) {
      return parseFloat(b.Price) - parseFloat(a.Price)
    })

    //console.log("buy trade",this.state.buyerOrderList);
    buyOrderDepth = Math.max.apply(Math, this.props.buyerOrderList.map(function(o) { return o.Amount; }))
    
    //console.log("this.props.buyerOrderList",this.props.buyerOrderList,this.props.buyerOrderList.length);
    $(".buyOrderClass").removeClass('blink_me');
    var firstPrice = 0;

    const diffLimit = buySellRecordCount - this.props.buyerOrderList.length;
    // console.log("this.props.buyerOrderList",this.props.buyerOrderList);
    var buyOrderList = [];

    this.props.buyerOrderList.map((newBuyOrder, indexValue) => {

      if(this.props.displayTable === false) { 

        if(indexValue < buySellRecordCount){

          buyOrderList.push(<BuyOrderRow
            key={indexValue}        
            Price={newBuyOrder.Price}
            Amount={newBuyOrder.Amount}        
            openModal={this.setOrders}
            indexValue={indexValue}
            UpDownBit={newBuyOrder.UpDownBit}
          />);

        }

      } else {

        buyOrderList.push(<BuyOrderRow
          key={indexValue}        
          Price={newBuyOrder.Price}
          Amount={newBuyOrder.Amount}        
          openModal={this.setOrders}
          indexValue={indexValue}
          UpDownBit={newBuyOrder.UpDownBit}
        />);

      }     

    });
    
    if(this.props.displayTable === false && diffLimit <= buySellRecordCount) {

      for(var lastIndex = this.props.buyerOrderList.length;lastIndex < buySellRecordCount;lastIndex++) {
        buyOrderList.push(<BuyOrderRow
          key={lastIndex}        
          Price={"-"}
          Amount={"-"}        
          openModal={this.setOrders}
          indexValue={lastIndex}
          UpDownBit={0}
        />);
      }

    }

    /* if(this.props.buyerOrderList.length !==0 && (lastPrice === 0 || lastPrice === 'undefined')) {
      var firstPrice = this.props.buyerOrderList[0].Price
    } else {
     var firstPrice = lastPrice
    }

    if(typeof firstPrice === 'undefined' || firstPrice === '' || firstPrice === null || firstPrice === '-') {
      firstPrice = 0;
    } */
    
    return (
      <Fragment >      
        {this.props.loading &&
          <JbsSectionLoader />
        }

        {this.props.displayTable === true &&         
          <Table className="m-0 p-0">
            <thead>
              <tr className="text-dark">
              {/* <th></th> */}
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

        {/* {firstPrice !== 0  &&
        <div className="updownmarket">
          <div className={classnames((this.props.UpDownBit === 1) ? "text-success" : "text-danger"
            , "text-center fs-24")}>
            {this.props.UpDownBit === 1 ? <i className="ti-arrow-up text-success"></i> :
              <i className="ti-arrow-down text-danger"></i>} &nbsp;
                 {(firstPrice != 0) && parseFloat(firstPrice).toFixed(8)}

            {(this.props.UpDownBit === 1) ? <i className="material-icons text-success float-right">network_cell</i> :
              <i className="material-icons text-danger float-right">network_cell</i>}
          </div> 
          </div>
        }        */}

        {this.props.displayTable === true &&
        <Scrollbars
        className="jbs-scroll"
        autoHeight
        autoHeightMin={this.props.autoHeightMin}
        autoHeightMax={this.props.autoHeightMax}
        autoHide
      >
         <Table className="table m-0 p-0">               
          <tbody>
            {buyOrderList}
          </tbody>   
          </Table>
          </Scrollbars>  
      }
      {this.props.displayTable === false &&  
        <Divider className="dividerbuyselltrade"/>
      }
      {this.props.displayTable === false &&         
        <Table className="table m-0 p-0">
        
          <tbody>
            {buyOrderList}
          </tbody>
        </Table>       
      }  
      </Fragment>
    );
  }
}

const mapStateToProps = ({ buyerOrder,currentMarketCap,settings }) => {

  return {
    loading: buyerOrder.loading, 
    currentMarketCap: currentMarketCap.currentMarketCap,
    darkMode:settings.darkMode
  };
  
}

/* // Set Props when actions are dispatch
const mapStateToProps = state => ({
   //buyerOrder: state.buyerOrder.buyerOrder,  
  loading:state.buyerOrder.loading,
  darkMode:state.settings.darkMode,
  currentMarketCap: state.currentMarketCap.currentMarketCap
}); */

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    
  }
)(BuyTrade);
