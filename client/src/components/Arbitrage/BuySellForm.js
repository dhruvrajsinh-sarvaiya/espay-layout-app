
/**
 * Author : Tejas
 * Created : 4/06/2019
 *  Arbitrage Buy/Sell Form component..
*/

// import For Component
import React, { Component } from "react";

// used for connect store
import { connect } from "react-redux";

// used for design
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

// used for convert messages in different langauages
import IntlMessages from "Util/IntlMessages";

// used for display notifications
import { NotificationManager } from "react-notifications";

// used for validation
import {
  validateQty,
  validatePrice,
  validateTotal,
  validateData,
  validateOnlyNumeric,

} from 'Validations/Arbitrage/buy_sell_form';

// import actions
import {
  getMarketCapList
} from 'Actions/Trade';

// import actions
import {
  arbitragePlaceOrder,
  arbitragePlaceBulkOrder
} from "Actions/Arbitrage";

// Used To Display Progressbar on Buy/Sell Button
import CircularProgress from '@material-ui/core/CircularProgress';

//class for buy sell form
class BuySellForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formType: 1,
      errors: {},
      isQuantityValid: true,
      isRateValid: true,
      isTotalValid: true,
      quantityError: "",
      rateError: "",
      totalError: "",
      rate: (this.props.currentPrice.LastPrice) ? parseFloat(this.props.currentPrice.LastPrice).toFixed(8) : parseFloat(0).toFixed(8),
      quantity: "",
      total: "",
      orderType: 1,
      bulkOrders: [],
      lastPriceBit: 0,
      placeOrderBit: 0,
      currentRate: "",

      orderTypes: [
        { Value: 1, Type: "Limit" },
        { Value: 2, Type: "Market" },
        { Value: 3, Type: "Stop-Limit" },
        { Value: 4, Type: "Spot" }
      ],

      bulkOrderData: [],
      isBulkOrder: false,

      lpType: 0
    };
  }

  componentDidMount() {

    this.props.getMarketCapList({ Pair: this.props.currencyPair });
  }

  // handle change of formtype
  changeFormType = (formType) => {
    this.setState({ formType: formType });
  }

  // involke when component is about to get new props
  componentWillReceiveProps(nextprops) {

    // set lastprice 
    if (nextprops.currentPrice && nextprops.currentPrice.LastPrice && this.state.lastPriceBit !== nextprops.lastPriceBit) {

      this.setState({
        rate: parseFloat(nextprops.currentPrice.LastPrice).toFixed(8),
        currentRate: parseFloat(nextprops.currentPrice.LastPrice).toFixed(8),
        lastPriceBit: nextprops.lastPriceBit,
        quantity: "",
      })

    }

    // set bulkbuy order data when set multiple daat   
    if (nextprops.isBulkBuyOrder && nextprops.bulkBuyOrder && nextprops.bulkBuyOrder.length) {

      var averageRate = 0, averageTotal = 0, total = 0, amount = 0, lpType = 0


      if (nextprops.bulkBuyOrder.bulkPercentage === true) {
        nextprops.bulkBuyOrder.map((order, item) => {

          averageTotal = averageTotal + order.rate;
          total = total + parseFloat(order.total);
          amount = amount + parseFloat(order.quantity);
          //return null
        })
        
        averageRate = (averageTotal / nextprops.bulkBuyOrder.length)
        this.setState({
          rate: parseFloat(averageRate).toFixed(8),
          formType: nextprops.bulkBuyOrder.formType,
          isBulkOrder: true,//nextprops.isBulkBuyOrder,
          bulkOrderData: nextprops.bulkBuyOrder,
          total: parseFloat(total).toFixed(8),
          quantity: parseFloat(amount).toFixed(8),
          lpType: nextprops.bulkBuyOrder.LpType
        })

      } else {
        nextprops.bulkBuyOrder.map((order, item) => {

          averageTotal = averageTotal + order.rate
          total = total + parseFloat(order.total);
          amount = amount + parseFloat(order.quantity);
          lpType = order.LpType
         // return null
        })

        averageRate = (averageTotal / nextprops.bulkBuyOrder.length)

        this.setState({
          rate: parseFloat(averageRate).toFixed(8),
          formType: nextprops.bulkBuyOrder.formType,
          isBulkOrder: true,// nextprops.isBulkBuyOrder,
          bulkOrderData: nextprops.bulkBuyOrder,
          total: parseFloat(total).toFixed(8),
          quantity: parseFloat(amount).toFixed(8),
          lpType: lpType
        })
      }

    } else if (nextprops.bulkBuyOrder && nextprops.bulkBuyOrder.rate !== '-' &&
      nextprops.bulkBuyOrder.rate) {

      // set bulkbuy order data when set single daat    
      if (nextprops.bulkBuyOrder.rate !== this.props.bulkBuyOrder.rate

      ) {

        this.setState({
          rate: parseFloat(nextprops.bulkBuyOrder.rate).toFixed(8),
          quantity: "",//parseFloat(nextprops.bulkBuyOrder.quantity).toFixed(8),
          total: "",//nextprops.bulkBuyOrder.total,
          formType: nextprops.bulkBuyOrder.formType,
          isBulkOrder: false,
          bulkOrderData: [],
          lpType: nextprops.bulkBuyOrder.LpType
        })
      }
    }


    // set bulksell order data when set multiple daat    
    if (nextprops.isBulkSellOrder && nextprops.bulkSellOrder && nextprops.bulkSellOrder.length) {

      var averageRate = 0, averageTotal = 0, total = 0, amount = 0, lpType = 0
      
      if (nextprops.bulkSellOrder.bulkPercentage === true) {
        nextprops.bulkSellOrder.map((order, item) => {

          averageTotal = averageTotal + order.rate;
          total = total + parseFloat(order.total);
          amount = amount + parseFloat(order.quantity);
          //return null
        })

      

        averageRate = (averageTotal / nextprops.bulkSellOrder.length)

        this.setState({
          rate: parseFloat(averageRate).toFixed(8),
          formType: nextprops.bulkSellOrder.formType,
          isBulkOrder: true,//nextprops.isBulkSellOrder,
          bulkOrderData: nextprops.bulkSellOrder,
          total: parseFloat(amount * averageRate).toFixed(8),
          quantity: parseFloat(amount).toFixed(8),
          lpType: nextprops.bulkSellOrder.LpType
        })

      } else {

        nextprops.bulkSellOrder.map((order, item) => {

          averageTotal = averageTotal + order.rate;
          total = total + parseFloat(order.total);
          amount = amount + parseFloat(order.quantity);
          lpType = order.LpType
          //return null
        })

        averageRate = (averageTotal / nextprops.bulkSellOrder.length)
        this.setState({
          rate: parseFloat(averageRate).toFixed(8),
          formType: nextprops.bulkSellOrder.formType,
          isBulkOrder: true,//nextprops.isBulkSellOrder,
          bulkOrderData: nextprops.bulkSellOrder,
          total: parseFloat(amount * averageRate).toFixed(8),
          quantity: parseFloat(amount).toFixed(8),
          lpType: lpType
        })
      }


    } else if (nextprops.bulkSellOrder && nextprops.bulkSellOrder.rate !== '-' &&
      nextprops.bulkSellOrder.rate) {

      // set bulksell order data when set single data    
      if (nextprops.bulkSellOrder.rate !== this.props.bulkSellOrder.rate
      ) {
        this.setState({
          rate: parseFloat(nextprops.bulkSellOrder.rate).toFixed(8),
          quantity: "",//parseFloat(nextprops.bulkSellOrder.quantity).toFixed(8),
          total: "",//nextprops.bulkSellOrder.total,
          formType: nextprops.bulkSellOrder.formType,
          isBulkOrder: false,
          bulkOrderData: [],
          lpType: nextprops.bulkSellOrder.LpType
        })
      }
    }


    if (nextprops.isBothOrder) {
      this.setState({
        rate: this.state.currentRate,
        quantity: "",
        total: "",
        formType: this.state.formType,
        lpType: "",
        bulkOrderData: [],
        isBulkOrder: false,
      })
    }
    // set response for buyer data
    if (nextprops.buyOrder && nextprops.error.length === 0) {

      if (this.state.placeOrderBit) {

        if (nextprops.buyOrder.statusCode === 200 && nextprops.buyOrder.ErrorCode === 4566) {
          NotificationManager.success(<IntlMessages id={`trading.orders.orders.trnid`} values={nextprops.buyOrder.response} />);

        } else if (nextprops.buyOrder.statusCode === 200 && nextprops.buyOrder.ErrorCode === 4568) {

          NotificationManager.error(<IntlMessages id="error.trading.transaction.4568" />)
        }
        this.setState({
          buyOrderResponse: nextprops.buyOrder.response,
          sellOrderResponse: [],
          lpType: 0,
          quantity: "",
          total: "",
          modalBuy: true,
          modalSell: false,
          errorLimit: "",
          placeOrderBit: 0,
          isBulkOrder: false,
          bulkOrderData: []
        });

        this.props.ClearAllFields();
      } else {
        this.setState({
          buyOrderResponse: [],
        })
      }
    } else if (nextprops.error.ReturnCode !== 0 && this.state.placeOrderBit) {

      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      if (nextprops.error.ReturnCode === 9) {

        NotificationManager.error(<IntlMessages id="placeorder.buysell.error.internalerror" />)
      }


      this.setState({
        errorLimit: nextprops.error.ReturnMsg,
        buyOrderResponse: [],
        placeOrderBit: 0,
        isBulkOrder: false,
        bulkOrderData: [],
        lpType: 0,
        quantity: "",
        total: "",
      })
    }
  }

  // validate rate with onchange and provide validations
  validateRate = event => {

    if (validateOnlyNumeric(event.target.value)) {
      this.setState({ rate: event.target.value });
      const { isValid, errors } = validatePrice(event.target.value);
      if (isValid) {
        this.setState({ isRateValid: true });

        if (this.state.quantity !== "" && this.state.isQuantityValid) {
          this.setState({
            total: parseFloat(
              parseFloat(this.state.quantity) * parseFloat(event.target.value)
            ).toFixed(8),
            isTotalValid: true
          });
        } else {
          this.setState({ total: "", isTotalValid: true });
        }
      } else {
        this.setState({
          isRateValid: false,
          rateError: errors.rate,
          total: ""
        });
      }
    } else if (event.target.value === "") {
      // process for blank message
      this.setState({ rate: event.target.value, total: "" });
    }
  };

  // validate Quantity  with onchange and provide validations
  validateQuantity = event => {

    if (validateOnlyNumeric(event.target.value)) {
      const { isValid, errors } = validateQty(event.target.value);

      this.setState({ quantity: event.target.value });

      if (isValid) {
        this.setState({ isQuantityValid: true });

        if (this.state.rate !== "" && this.state.isRateValid) {
          this.setState({
            total: parseFloat(
              parseFloat(event.target.value) * parseFloat(this.state.rate)
            ).toFixed(8),

            isTotalValid: true
          });

          if (this.state.isBulkOrder === true) {
            if (this.state.bulkOrderData && this.state.bulkOrderData.length) {
              var data = this.state.bulkOrderData;
              this.state.bulkOrderData.map((order, item) => {
                data[item].quantity = event.target.value
                data[item].total = parseFloat(
                  parseFloat(event.target.value) * parseFloat(this.state.rate)
                ).toFixed(8)
                //return null
              })
              this.setState({ bulkOrderData: data })
            }
          }
        } else {
          this.setState({ total: "", isTotalValid: true });
        }
      } else {
        this.setState({
          isQuantityValid: false,
          quantityError: errors.quantity,
          total: ""
        });
      }
    } else if (event.target.value === "") {
      // process for blank message
      this.setState({
        quantity: event.target.value,
        total: "",
      });
    }
  };

  // validate Total with onchange and provide validations
  validateTotal = event => {

    if (validateOnlyNumeric(event.target.value)) {
      this.setState({ total: event.target.value });

      const { isValid, errors } = validateTotal(event.target.value);
      if (isValid) {
        this.setState({ isTotalValid: true });

        // calculation process of Amount
        if (
          this.state.rate != "" &&
          this.state.isRateValid &&
          this.state.total !== 0
        ) {
          this.setState({
            quantity: parseFloat(
              parseFloat(event.target.value) / parseFloat(this.state.rate)
            ).toFixed(8),
            isQuantityValid: true
          });
        } else {
          this.setState({ quantity: "", isQuantityValid: true });
        }
      } else {
        this.setState({
          isTotalValid: false,
          totalError: errors.total
        });
      }
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({ total: event.target.value, quantity: "" });
    }
  };

  onChangeOrderType = (event) => {
    event.preventDefault();

    this.setState({
      orderType: event.target.value
    })
  }

  // place order 
  placeOrder = (e) => {
    e.preventDefault();
    const info = this.props.info;

    if (this.state.isBulkOrder === true && this.state.bulkOrderData && this.state.bulkOrderData.length) {

      var Total = 0,Amount=0

      this.state.bulkOrderData.map((order, index) => {

        Total = Total + parseFloat(parseFloat(parseFloat(this.state.rate) * parseFloat(order.quantity)).toFixed(8));
        Amount = Amount + parseFloat(order.quantity);
       // return null
      })

        var MultipleOrderList = [],checked=0;

        this.state.bulkOrderData.map((order, index) => {

          if ((checked === 0) && (order.rate === '' || typeof order.rate === undefined || order.rate === 0 || parseFloat(order.rate) === 0.0)) {

            checked = 1
            this.setState({ placeOrderBit: 0 });            
            NotificationManager.error(<IntlMessages id="error.trading.transaction.4607" />);

          } else if ( (checked === 0) && (order.quantity === '' || typeof order.quantity === undefined || order.quantity === 0 || parseFloat(order.quantity) === 0.0)) {

            checked = 1
            this.setState({ placeOrderBit: 0 });            
            NotificationManager.error(<IntlMessages id="error.trading.transaction.4608" />);

            return true;
          } else if ( (checked === 0) && (order.total === '' || typeof order.total === undefined || order.total === 0 || parseFloat(order.total) === 0.0)) {

            checked = 1
            this.setState({ placeOrderBit: 0 });
            NotificationManager.error(<IntlMessages id="error.trading.transaction.4609" />);

          } else if ( (checked === 0) && (order.LpType === "" || typeof order.LpType === undefined || order.LpType === 0)) {

            checked = 1
            this.setState({ placeOrderBit: 0 });
            NotificationManager.error(<IntlMessages id="sidebar.arbitrageLpType" />);

          } else if ((checked === 0) && (info.currencyPairID === '' || typeof info.currencyPairID === undefined || info.currencyPairID === 0)) {

            checked = 1
            this.setState({ placeOrderBit: 0 });
            NotificationManager.error(<IntlMessages id="error.trading.transaction.4601" />);

          } else if ((checked === 0) && (this.props.secondCurrencyWalletId === '' || typeof this.props.secondCurrencyWalletId === undefined || this.props.secondCurrencyWalletId === 0)) {

            checked = 1
            this.setState({ placeOrderBit: 0 });
            NotificationManager.error(<IntlMessages id="error.trading.creditwallet" />);

          } else if ((checked === 0) && (this.props.firstCurrencyWalletId === '' || typeof this.props.firstCurrencyWalletId === undefined || this.props.firstCurrencyWalletId === 0)) {

            checked = 1
            this.setState({ placeOrderBit: 0 });
            NotificationManager.error(<IntlMessages id="error.trading.debitwallet" />);

          } else {
            if(checked === 0 ){
            const data = {
              currencyPairID: info.currencyPairID,
              debitWalletID: this.state.formType === 1 ?
                this.props.secondCurrencyWalletId :
                this.state.formType === 2 &&
                this.props.firstCurrencyWalletId,

              creditWalletID: this.state.formType === 1 ?
                this.props.firstCurrencyWalletId :
                this.state.formType === 2 &&
                this.props.secondCurrencyWalletId,

              feePer: 0,
              fee: 0,
              trnMode: 11,
              price: order.rate,
              amount: order.quantity,
              total: order.total,
              ordertype: 1,
              orderSide: this.state.formType === 1 ? 4 :
                this.state.formType === 2 && 5,
              StopPrice: 0,
              nonce: "55445454",
              Pair: this.props.firstCurrency + '_' + this.props.secondCurrency,
              marginOrder: this.props.marginTrading,
              RouteID: 1,
              LPType: order.LpType
            }

            MultipleOrderList.push(data)
          }
        }
          //return null
        })

        if(this.state.formType === 1){

          if(Total <= this.props.secondCurrencyBalance){
            if (MultipleOrderList && MultipleOrderList.length) {

              const payload = {
                MultipleOrderList: MultipleOrderList,
                Pair: this.props.firstCurrency + '_' + this.props.secondCurrency
              }
    
              this.setState({
                placeOrderBit: 1,
              })
    
              this.props.arbitragePlaceBulkOrder(payload);
            }
          } else{
            this.setState({ placeOrderBit: 0 });
            NotificationManager.error(
              <IntlMessages id="trading.placeorder.error.minBalance" />
            );
          }
        } else if(this.state.formType === 2){

          if(Amount <= this.props.firstCurrencyBalance){
            if (MultipleOrderList && MultipleOrderList.length) {

              const payload = {
                MultipleOrderList: MultipleOrderList,
                Pair: this.props.firstCurrency + '_' + this.props.secondCurrency
              }
    
              this.setState({
                placeOrderBit: 1,
              })
    
              this.props.arbitragePlaceBulkOrder(payload);
            }
          } else{
            this.setState({ placeOrderBit: 0 });
            NotificationManager.error(
              <IntlMessages id="trading.placeorder.error.minBalance" />
            );
          }
        }      
            

    } else {
      if (this.state.rate === '' || typeof this.state.rate === undefined || this.state.rate === 0 || parseFloat(this.state.rate) === 0.0 ) {

        this.setState({ placeOrderBit: 0 });
        NotificationManager.error(<IntlMessages id="error.trading.transaction.4607" />);

      } else if (this.state.quantity === '' || typeof this.state.quantity === undefined || this.state.quantity === 0 || parseFloat(this.state.quantity) === 0.0 ) {

        this.setState({ placeOrderBit: 0 });
        NotificationManager.error(<IntlMessages id="error.trading.transaction.4608" />);

      } else if (this.state.total === '' || typeof this.state.total === undefined || this.state.total === 0 || parseFloat(this.state.total) === 0.0 ) {

        this.setState({ placeOrderBit: 0 });
        NotificationManager.error(<IntlMessages id="error.trading.transaction.4609" />);

      } else if (this.state.lpType === '' || typeof this.state.lpType === undefined || this.state.lpType === 0) {

        this.setState({ placeOrderBit: 0 });
        NotificationManager.error(<IntlMessages id="sidebar.arbitrageLpType" />);

      } else if (info.currencyPairID === '' || typeof info.currencyPairID === undefined || info.currencyPairID === 0) {

        this.setState({ placeOrderBit: 0 });
        NotificationManager.error(<IntlMessages id="error.trading.transaction.4601" />);

      } else if (this.props.secondCurrencyWalletId === '' || typeof this.props.secondCurrencyWalletId === undefined || this.props.secondCurrencyWalletId === 0) {

        this.setState({ placeOrderBit: 0 });
        NotificationManager.error(<IntlMessages id="error.trading.creditwallet" />);

      } else if (this.props.firstCurrencyWalletId === '' || typeof this.props.firstCurrencyWalletId === undefined || this.props.firstCurrencyWalletId === 0) {

        this.setState({ placeOrderBit: 0 });
        NotificationManager.error(<IntlMessages id="error.trading.debitwallet" />);

      } else {

        const data = {
          currencyPairID: info.currencyPairID,
          debitWalletID: this.state.formType === 1 ?
            this.props.secondCurrencyWalletId :
            this.state.formType === 2 &&
            this.props.firstCurrencyWalletId,

          creditWalletID: this.state.formType === 1 ?
            this.props.firstCurrencyWalletId :
            this.state.formType === 2 &&
            this.props.secondCurrencyWalletId,

          feePer: 0,
          fee: 0,
          trnMode: 21,
          price: this.state.rate,
          amount: this.state.quantity,
          total: this.state.total,
          ordertype: 1,
          orderSide: this.state.formType === 1 ? 4 :
            this.state.formType === 2 && 5,
          StopPrice: 0,
          nonce: "55445454",
          Pair: this.props.firstCurrency + '_' + this.props.secondCurrency,
          marginOrder: this.props.marginTrading,
          RouteID: 1,
          LPType: this.state.lpType
        };



        const { isValid, errors } = validateData(data);

        if (!isValid) {

          if (errors.rate) {
            this.setState({
              isPriceBuyValid: false,
              priceBuyError: errors.rate,
              total: ""
            });
          }

          if (errors.quantity) {
            this.setState({
              isAmountBuyValid: false,
              amountBuyError: errors.quantity,
              totalBuy: ""
            });
          }

          if (errors.total) {
            this.setState({
              isTotalBuyValid: false,
              totalBuyError: errors.total
            });
          }

        } else {

          if (
            this.state.isQuantityValid &&
            this.state.isRateValid &&
            this.state.isTotalValid
          ) {

            this.setState({
              placeOrderBit: 1,
            })

            if(this.state.formType === 1){

                if (this.state.total <= this.props.secondCurrencyBalance) {

                  this.props.arbitragePlaceOrder(data);
                } else {
    
                  this.setState({ placeOrderBit: 0 });
                  NotificationManager.error(
                    <IntlMessages id="trading.placeorder.error.minBalance" />
                  );
                }
            }else if(this.state.formType === 2){

                if (this.state.quantity <= this.props.firstCurrencyBalance) {

                  this.props.arbitragePlaceOrder(data);
                } else {
    
                  this.setState({ placeOrderBit: 0 });
                  NotificationManager.error(
                    <IntlMessages id="trading.placeorder.error.minBalance" />
                  );
                }
            }
            

          } else {

            this.setState({ placeOrderBit: 0 });
            NotificationManager.error(
              <IntlMessages id="trading.placeorder.error.properdata" />
            );
          }
        }

      }
    }
  }

  // Render Component for Buyer Order
  render() {

    const { formType } = this.state;
    return (
      <div className="arb_buy_sell_frm">
        <div className="row m-0 mb-10 tblst">
          <div className={`col-6 buy${formType === 1 ? ' active' : ''}`}>
            <IntlMessages id="trading.placeorder.label.buy" />
          </div>
          <div className={`col-6 sell${formType === 2 ? ' active' : ''}`}>
            <IntlMessages id="trading.placeorder.label.sell" />
          </div>
        </div>
        <Form className="tradefrm">
          <FormGroup>
            <Label for="orderType">
              {<IntlMessages id="tradesummary.tradeSummaryColumn.orderType" />}
            </Label>
            <Input disabled={true} type="select" name="orderType" value={this.state.orderType} id="orderType"
              onChange={this.onChangeOrderType}>
              {this.state.orderTypes.map((order, key) =>
                <option key={key} value={order.Value}>{order.Type}</option>
              )}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="quantity">
              {<IntlMessages id="wallet.Qty" />} {" "}
              ({this.props.firstCurrency})
                            </Label>
            <Input
              type="text"
              tabIndex="2"
              name="quantity"
              value={this.state.quantity}
              id="quantity"
              onChange={this.validateQuantity}
              className={!this.state.isQuantityValid ? "error text-buybook" : "text-buybook"}
            />
            {!this.state.isQuantityValid && (
              <div>
                <span className="text-danger">
                  <IntlMessages id={this.state.quantityError} />
                </span>
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="rate">
              {formType === 1 ?
                <IntlMessages id="myaccount.tradeSummaryColumn.buyRate" /> :
                <IntlMessages id="myaccount.tradeSummaryColumn.sellRate" />
              }
            </Label>
            <Input type="text" tabIndex="3" name="rate"
              value={this.state.rate}
              id="rate" onChange={this.validateRate}
              disabled={true}
              className={!this.state.isRateValid ? "error text-buybook" : "text-buybook"}
            />
            {!this.state.isRateValid && (
              <div>
                <span className="text-danger">
                  <IntlMessages id={this.state.rateError} />
                </span>
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="total">
              {<IntlMessages id="trading.orders.label.total" />}
            </Label>
            <Input
              type="text"
              tabIndex="5"
              name="total"
              value={this.state.total}
              disabled={true}
              id="total"
              onChange={this.validateTotal}
              className={!this.state.isTotalValid ? "error text-buybook" : "text-buybook"}
            />

            {!this.state.isRateValid && (
              <div>
                <span className="text-danger">
                  <IntlMessages id={this.state.rateError} />
                </span>
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Button
              tabIndex="6"
              name={formType === 1 ?
                <IntlMessages id="trading.placeorder.button.buy" />
                :
                <IntlMessages id="trading.placeorder.button.sell" />
              }
              className={formType === 1 ? "btn btn-buy arbitrage-btnbuysell" : "btn btn-sell arbitrage-btnbuysell"}
              type="submit"
              onClick={(e) => {
                e.preventDefault(); this.state.lpType === 0 ?
                  NotificationManager.error(<IntlMessages id="sidebar.arbitrageSelectOrder" />) :
                  this.placeOrder(e)
              }
              }>
              {formType === 1 ? <IntlMessages id="trading.placeorder.button.buy" />
                :
                <IntlMessages id="trading.placeorder.button.sell" />
              }

              {" "}
              {this.props.firstCurrency}
              {this.props.loading
                && <CircularProgress size={18}
                  style={{
                    top: '30px',
                    position: 'absolute',
                    right: '20px',
                    color: "white"
                  }}
                />}

            </Button>
          </FormGroup>
        </Form>

        <div className="text-center mt-5">                 
                  <IntlMessages id={`sidebar.arbitrageAverage`} values={{ Param1: this.state.rate }} />
        </div>
      </div>
    );
  }
}

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  buyOrder: state.arbitragePlaceOrder.arbitragePlaceOrder,
  loading: state.arbitragePlaceOrder.placeOrderLoader,
  buyOrderLoading: state.placeOrder.buyOrderLoading,
  sellOrderLoading: state.placeOrder.sellOrderLoading,
  error: state.arbitragePlaceOrder.arbitragePlaceOrderError,
  currentPrice: state.currentMarketCap.currentMarketCap,
  lastPriceBit: state.currentMarketCap.lastPriceBit,
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    arbitragePlaceOrder,
    getMarketCapList,
    arbitragePlaceBulkOrder
  }
)(BuySellForm);