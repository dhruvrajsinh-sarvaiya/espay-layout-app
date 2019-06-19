// Component for Stop Limit Place Order Detail By:Tejas Date : 13/9/2018

import React from "react";

import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import { AddMarginBalance } from 'Components/MarginTrading';
import {
  validateBuyStop,
  validateBuyLimit,
  validateBuyAmount,
  validateBuyTotal,
  validateSellStop,
  validateSellLimit,
  validateSellAmount,
  validateSellTotal,
  validateOnlyNumeric,
  validateBuyData,
  validateSellData
} from "../../../validation/vaildateBuySellRequest";

// intl messages
import IntlMessages from "Util/IntlMessages";

// function for connect store
import { connect } from "react-redux";

import { doBuyOrder, doSellOrder } from "Actions/Trade";

import classnames from "classnames";
import { NotificationManager } from "react-notifications";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

// Used To Display Progressbar on Buy/Sell Button
import CircularProgress from '@material-ui/core/CircularProgress';

class StopLimitOrder extends React.Component {
  state = {
    modalStopSell: false,
    modalStopBuy: false,
    modalInfo: 0,

    selectedSellValue: 0,
    selectedBuyValue: 0,

    isStopBuyValid: true,
    isLimitBuyValid: true,
    isAmountBuyValid: true,
    isTotalBuyValid: true,

    isStopSellValid: true,
    isLimitSellValid: true,
    isAmountSellValid: true,
    isTotalSellValid: true,

    stopBuyError: "",
    limitBuyError: "",
    amountBuyError: "",
    totalBuyError: "",

    stopSellError: "",
    limitSellError: "",
    amountSellError: "",
    totalSellError: "",

    formErrors: {},

    stopBuy: "",
    limitBuy: (this.props.currentPrice.LastPrice) ? parseFloat(this.props.currentPrice.LastPrice).toFixed(8) : parseFloat(0).toFixed(8),
    amountBuy: "",
    totalBuy: "",

    stopSell: "",
    limitSell: (this.props.currentPrice.LastPrice) ? parseFloat(this.props.currentPrice.LastPrice).toFixed(8) : parseFloat(0).toFixed(8),
    amountSell: "",
    totalSell: "",
    showLoader: false,
    buyOrderResponse: [],
    sellOrderResponse: [],
    buyStopOrderBit: 0,
    sellStopOrderBit: 0,

    errorSpotLimit: '',
    lastPriceBit: 0
  };
  // handle close add new Schedule dailog
  handleClose() {
    this.setState({
      modalStopBuy: false,
      modalStopSell: false,
      buyOrderResponse: [],
      sellOrderResponse: [],
      buyStopOrderBit: 0,
      sellStopOrderBit: 0
    });
  }

  componentWillReceiveProps(nextprops) {

    if (nextprops.currentPrice && nextprops.currentPrice.LastPrice && this.state.lastPriceBit !== nextprops.lastPriceBit) {

      this.setState({
        limitBuy: parseFloat(nextprops.currentPrice.LastPrice).toFixed(8),
        limitSell: parseFloat(nextprops.currentPrice.LastPrice).toFixed(8),
        lastPriceBit: nextprops.lastPriceBit,
        amountBuy: "",
        //totalBuy:"",
        amountSell: "",
        //totalSell:""
      })

    }

    if (nextprops.bulkBuyOrder && nextprops.bulkBuyOrder.Price && nextprops.bulkBuyOrder.Amount && nextprops.bulkBuyOrder.Total) {
      this.setState({
        priceBuy: parseFloat(nextprops.bulkBuyOrder.Price).toFixed(8),
        amountBuy: parseFloat(nextprops.bulkBuyOrder.Amount).toFixed(8),
        totalBuy: nextprops.bulkBuyOrder.Total
      })
      // this.state.priceBuy = parseFloat(nextprops.bulkBuyOrder.Price).toFixed(8)
      // this.state.amountBuy = parseFloat(nextprops.bulkBuyOrder.Amount).toFixed(8)
      // this.state.totalBuy = nextprops.bulkBuyOrder.Total

    }

    if (nextprops.bulkSellOrder && nextprops.bulkSellOrder.Price && nextprops.bulkSellOrder.Amount && nextprops.bulkSellOrder.Total) {
      this.setState({
        priceSell: parseFloat(nextprops.bulkSellOrder.Price).toFixed(8),
        amountSell: parseFloat(nextprops.bulkSellOrder.Amount).toFixed(8),
        totalSell: nextprops.bulkSellOrder.Total
      })

      // this.state.priceSell = parseFloat(nextprops.bulkSellOrder.Price).toFixed(8)
      // this.state.amountSell = parseFloat(nextprops.bulkSellOrder.Amount).toFixed(8)
      // this.state.totalSell = nextprops.bulkSellOrder.Total
    }

    if (nextprops.buyOrder && nextprops.error.length == 0) {

      if (this.state.buyStopOrderBit) {

        if (nextprops.buyOrder.statusCode == 200 && nextprops.buyOrder.ErrorCode == 4566) {

          NotificationManager.success(<IntlMessages id={`trading.orders.orders.trnid`} values={nextprops.buyOrder.response} />);

        } else if (nextprops.buyOrder.statusCode == 200 && nextprops.buyOrder.ErrorCode == 4568) {

          NotificationManager.error(<IntlMessages id="error.trading.transaction.4568" />)
        }

        this.setState({
          buyOrderResponse: nextprops.buyOrder.response,
          sellOrderResponse: [],
          showLoader: false,
          modalBuy: true,
          modalSell: false,
          errorSpotLimit: "",
          buyStopOrderBit: 0
        });

      } else {
        this.setState({
          buyOrderResponse: []
        })
      }
    } else if (nextprops.error.ReturnCode !== 0 && this.state.buyStopOrderBit) {

      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);
      if (nextprops.error.ReturnCode === 9) {

        NotificationManager.error(<IntlMessages id="placeorder.buysell.error.internalerror" />)
      }


      this.setState({
        errorSpotLimit: nextprops.error.ReturnMsg,
        buyOrderResponse: [],
        buyStopOrderBit: 0,
      })
    }

    if (nextprops.sellOrder && nextprops.error.length == 0) {

      if (this.state.sellStopOrderBit) {

        if (nextprops.sellOrder.statusCode == 200 && nextprops.sellOrder.ErrorCode == 4566) {

          NotificationManager.success(<IntlMessages id={`trading.orders.orders.trnid`} values={nextprops.sellOrder.response} />);
        } else if (nextprops.sellOrder.statusCode == 200 && nextprops.sellOrder.ErrorCode == 4568) {

          NotificationManager.error(<IntlMessages id="error.trading.transaction.4568" />)
        }

        this.setState({
          sellOrderResponse: nextprops.sellOrder.response,
          buyOrderResponse: [],
          showLoader: false,
          modalSell: true,
          errorLimit: "",
          sellStopOrderBit: 0
        });

      } else {
        this.setState({
          sellOrderResponse: []
        })
      }
    } else if (nextprops.error.ReturnCode !== 0 && this.state.sellStopOrderBit) {

      NotificationManager.error(<IntlMessages id={`error.trading.transaction.${nextprops.error.ErrorCode}`} />);

      if (nextprops.error.ReturnCode === 9) {

        NotificationManager.error(<IntlMessages id="placeorder.buysell.error.internalerror" />)
      }


      this.setState({
        errorLimit: nextprops.error.ReturnMsg,
        sellOrderResponse: [],
        sellStopOrderBit: 0,
      })
    }

    if (nextprops.currentBuyPrice && nextprops.currentSellPrice) {
      if (
        nextprops.currentBuyPrice !== this.state.currentBuyPrice &&
        nextprops.currentSellPrice !== this.state.currentSellPrice
      ) {
        this.setState({
          limitBuy: parseFloat(nextprops.currentBuyPrice).toFixed(8),
          limitSell: parseFloat(nextprops.currentSellPrice).toFixed(8)
        });
      }
    }
  }
  validateBuyStop = event => {
    //    console.log(event.target.value);
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({ stopBuy: event.target.value });

      const { isValid, errors } = validateBuyStop(event.target.value);

      if (isValid) {
        this.setState({ isStopBuyValid: true });

      } else {
        this.setState({
          isStopBuyValid: false,
          stopBuyError: errors.buyStop,
          total: ""
        });
      }
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({ stopBuy: event.target.value, totalBuy: "" });
    }
  };

  validateSellLimit = event => {
    //  console.log(event.target.value);
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({ limitSell: event.target.value });

      const { isValid, errors } = validateSellLimit(event.target.value);

      if (isValid) {
        this.setState({ isLimitSellValid: true });

        if (this.state.amountSell != "" && this.state.isAmountSellValid) {
          this.setState({
            totalSell: parseFloat(
              parseFloat(this.state.amountSell) * parseFloat(event.target.value)
            ).toFixed(8),
            isTotalSellValid: true
          });
        } else {
          this.setState({ totalSell: "", isTotalSellValid: true });
        }
      } else {
        this.setState({
          isLimitSellValid: false,
          limitSellError: errors.sellLimit,
          total: ""
        });
      }
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({ limitSell: event.target.value, totalSell: "" });
    }
  };

  validateSellStop = event => {
    //  console.log(event.target.value);
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({ stopSell: event.target.value });

      const { isValid, errors } = validateSellStop(event.target.value);

      if (isValid) {
        this.setState({ isStopSellValid: true });

      } else {
        this.setState({
          isStopSellValid: false,
          stopSellError: errors.sellStop,
          total: ""
        });
      }
    } else if (event.target.value == "") {
      // process for blank message
      this.setState({ stopSell: event.target.value, totalSell: "" });
    }
  };

  validateBuyLimit = event => {
    //  console.log(event.target.value);
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({ limitBuy: event.target.value });

      const { isValid, errors } = validateBuyLimit(event.target.value);

      if (isValid) {
        this.setState({ isLimitBuyValid: true });

        if (this.state.amountBuy !== "" && this.state.isAmountBuyValid) {
          this.setState({
            totalBuy: parseFloat(
              parseFloat(this.state.amountBuy) * parseFloat(event.target.value)
            ).toFixed(8),
            isTotalBuyValid: true
          });
        } else {
          this.setState({ totalBuy: "", isTotalBuyValid: true });
        }
      } else {
        this.setState({
          isLimitBuyValid: false,
          limitBuyError: errors.buyLimit,
          total: ""
        });
      }
    } else if (event.target.value === "") {
      // process for blank message
      this.setState({ limitBuy: event.target.value, totalBuy: "" });
    }
  };

  validateBuyAmount = event => {
    //  console.log(event.target.value);
    if (validateOnlyNumeric(event.target.value)) {
      const { isValid, errors } = validateBuyAmount(event.target.value);

      this.setState({ amountBuy: event.target.value });

      if (isValid) {
        this.setState({ isAmountBuyValid: true });

        if (this.state.limitBuy !== "" && this.state.isLimitBuyValid) {
          this.setState({
            totalBuy: parseFloat(
              parseFloat(event.target.value) * parseFloat(this.state.limitBuy)
            ).toFixed(8),
            isTotalBuyValid: true
          });
        } else {
          this.setState({ totalBuy: "", isTotalBuyValid: true });
        }
      } else {
        this.setState({
          isAmountBuyValid: false,
          amountBuyError: errors.buyAmount,
          totalBuy: ""
        });
      }
    } else if (event.target.value === "") {
      // process for blank message
      this.setState({ amountBuy: event.target.value, total: "" });
    }
  };

  validateBuyTotal = event => {
    //   console.log(event.target.value);
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({ totalBuy: event.target.value });

      const { isValid, errors } = validateBuyTotal(event.target.value);
      if (isValid) {
        this.setState({ isTotalBuyValid: true });

        // calculation process of Amount
        if (
          this.state.limitBuy !== "" &&
          this.state.isLimitBuyValid &&
          this.state.totalBuy !== 0
        ) {
          this.setState({
            amountBuy: parseFloat(
              parseFloat(event.target.value) / parseFloat(this.state.limitBuy)
            ).toFixed(8),
            isAmountBuyValid: true
          });
        } else {
          this.setState({ amountBuy: "", isAmountBuyValid: true });
        }
      } else {
        this.setState({
          isTotalBuyValid: false,
          totalBuyError: errors.buyTotal
        });
      }
    } else if (event.target.value === "") {
      // process for blank message
      this.setState({
        totalBuy: event.target.value,
        total: "",
        amountBuy: ""
      });
    }
  };

  validateSellAmount = event => {
    // console.log(event.target.value);
    if (validateOnlyNumeric(event.target.value)) {
      const { isValid, errors } = validateSellAmount(event.target.value);

      this.setState({ amountSell: event.target.value });

      if (isValid) {
        this.setState({ isAmountSellValid: true });
        if (this.state.limitSell !== "" && this.state.isLimitSellValid) {
          this.setState({
            totalSell: parseFloat(
              parseFloat(event.target.value) * parseFloat(this.state.limitSell)
            ).toFixed(8),
            isTotalSellValid: true
          });
        } else {
          this.setState({ totalSell: "", isTotalSellValid: true });
        }
      } else {
        this.setState({
          isAmountSellValid: false,
          amountSellError: errors.sellAmount,
          totalSell: ""
        });
      }
    } else if (event.target.value === "") {
      // process for blank message
      this.setState({ amountSell: event.target.value, total: "" });
    }
  };

  validateSellTotal = event => {
    // console.log(event.target.value);
    if (validateOnlyNumeric(event.target.value)) {
      this.setState({ totalSell: event.target.value });

      const { isValid, errors } = validateSellTotal(event.target.value);
      if (isValid) {
        this.setState({ isTotalSellValid: true });

        // calculation process of Amount
        if (
          this.state.limitSell !== "" &&
          this.state.isLimitSellValid &&
          this.state.totalSell !== 0
        ) {
          this.setState({
            amountSell: parseFloat(
              parseFloat(event.target.value) / parseFloat(this.state.limitSell)
            ).toFixed(8),
            isAmountSellValid: true
          });
        } else {
          this.setState({ amountSell: "", isAmountSellValid: true });
        }
      } else {
        this.setState({
          isTotalSellValid: false,
          totalSellError: errors.sellTotal
        });
      }
    } else if (event.target.value === "") {
      // process for blank message
      this.setState({
        totalSell: event.target.value,
        total: "",
        amountSell: ""
      });
    }
  };

  changeSelectedBuyValue = value => {
    if (this.state.selectedBuyValue === value) {
      // this.setState({ selectedBuyValue: 0 })
    } else {
      //      this.setState({ selectedBuyValue: value })
      // calculation process of Amount
      if (
        this.state.limitBuy !== "" &&
        this.state.isLimitBuyValid &&
        this.state.totalBuy !== 0 &&
        this.state.amountBuy !== 0
      ) {
        //total = (this.props.info.secondCurrencyBalance*25)/100
        var total = parseFloat(
          parseFloat(
            parseFloat(this.props.secondCurrencyBalance) *
            parseFloat(value)
          ) / 100
        ).toFixed(8);
        this.setState({
          amountBuy: parseFloat(
            parseFloat(total) / parseFloat(this.state.limitBuy)
          ).toFixed(8),
          totalBuy: total,
          isAmountBuyValid: true,
          isTotalBuyValid: true
        });
      } else {
        this.setState({
          amountBuy: "",
          totalBuy: "",
          isTotalBuyValid: true,
          isAmountBuyValid: true
        });
      }
    }
  };

  changeSelectedSellValue = value => {
    if (this.state.selectedSellValue === value) {
      // this.setState({ selectedSellValue: 0 })
    } else {
      // this.setState({ selectedSellValue: value })
      // calculation process of Amount
      if (
        this.state.limitSell !== "" &&
        this.state.isLimitSellValid &&
        this.state.totalSell !== 0 &&
        this.state.amountSell !== 0
      ) {
        //total = (this.props.info.secondCurrencyBalance*25)/100
        var amount = parseFloat(
          parseFloat(
            parseFloat(this.props.firstCurrencyBalance) * parseFloat(value)
          ) / 100
        ).toFixed(8);
        this.setState({
          totalSell: parseFloat(
            parseFloat(this.state.limitSell) * parseFloat(amount)
          ).toFixed(8),
          amountSell: amount,
          isAmountSellValid: true,
          isTotalSellValid: true
        });
      } else {
        this.setState({
          amountSell: "",
          totalSell: "",
          isTotalSellValid: true,
          isAmountSellValid: true
        });
      }
    }
  };

  doSellOrder = event => {
    event.preventDefault();
    const info = this.props.info;

    if (this.state.stopSell == '' || typeof this.state.stopSell === undefined || this.state.stopSell == 0) {

      this.setState({ showLoader: false, sellStopOrderBit: 0 });
      // NotificationManager.error(<IntlMessages id="error.trading.transaction.4607" />);
      NotificationManager.error(<IntlMessages id="trading.stoplimit.entersellstop" />);

    } else if (this.state.limitSell == '' || typeof this.state.limitSell === undefined || this.state.limitSell == 0) {
      NotificationManager.error(<IntlMessages id="trading.stoplimit.enterselllimit" />);

    } else if (this.state.amountSell == '' || typeof this.state.amountSell === undefined || this.state.amountSell == 0) {
      this.setState({ showLoader: false, sellStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.transaction.4608" />);
    } else if (this.state.totalSell == '' || typeof this.state.totalSell === undefined || this.state.totalSell == 0) {

      this.setState({ showLoader: false, sellStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.transaction.4609" />);
    } else if (info.currencyPairID == '' || typeof info.currencyPairID === undefined || info.currencyPairID == 0) {

      this.setState({ showLoader: false, sellStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.transaction.4601" />);
    } else if (this.props.secondCurrencyWalletId == '' || typeof this.props.secondCurrencyWalletId === undefined || this.props.secondCurrencyWalletId == 0) {

      this.setState({ showLoader: false, sellStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.creditwallet" />);
    } else if (this.props.firstCurrencyWalletId == '' || typeof this.props.firstCurrencyWalletId === undefined || this.props.firstCurrencyWalletId == 0) {

      this.setState({ showLoader: false, sellStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.debitwallet" />);
    } else {

      const data = {
        currencyPairID: info.currencyPairID,
        debitWalletID: this.props.firstCurrencyWalletId,
        creditWalletID: this.props.secondCurrencyWalletId,
        fee: 0,
        trnMode: 21,
        price: this.state.limitSell,
        amount: this.state.amountSell,
        total: this.state.totalSell,
        ordertype: 4,
        orderSide: 5,
        StopPrice: this.state.stopSell,
        Pair: this.props.firstCurrency + '_' + this.props.secondCurrency,
        feePer: 0,
        marginOrder: this.props.marginTrading
      };

      const { isValid, errors } = validateSellData(data);
      if (!isValid) {
        if (errors.sellLimit) {
          this.setState({
            isLimitSellValid: false,
            limitSellError: errors.sellLimit,
            total: ""
          });
        }

        if (errors.sellAmount) {
          this.setState({
            isAmountSellValid: false,
            amountSellError: errors.sellAmount,
            totalSell: ""
          });
        }

        if (errors.sellTotal) {
          this.setState({
            isTotalSellValid: false,
            totalSellError: errors.sellTotal
          });
        }
      } else {
        if (
          this.state.isAmountSellValid &&
          this.state.isLimitSellValid &&
          this.state.isTotalSellValid &&
          this.state.isStopSellValid
        ) {

          this.setState({
            buyStopOrderBit: 0,
            sellStopOrderBit: 1
          });
          // this.props.doSellOrder(data);
          if (this.state.amountSell <= this.props.firstCurrencyBalance) {
            this.props.doSellOrder(data);
          } else {
            this.setState({ showLoader: false, sellStopOrderBit: 0 });
            NotificationManager.error(
              <IntlMessages id="trading.placeorder.error.minBalance" />
            );
          }
        } else {
          this.setState({ showLoader: false, sellStopOrderBit: 0 });
          NotificationManager.error(
            <IntlMessages id="trading.placeorder.error.properdata" />
          );
        }
      }
    }

  };

  doBuyOrder = event => {
    event.preventDefault();
    const info = this.props.info;

    if (this.state.stopBuy == '' || typeof this.state.stopBuy === undefined || this.state.stopBuy == 0) {

      this.setState({ showLoader: false, buyStopOrderBit: 0 });
      // NotificationManager.error(<IntlMessages id="error.trading.transaction.4607" />);
      NotificationManager.error(<IntlMessages id="trading.stoplimit.enterbuystop" />);

    } else if (this.state.limitBuy == '' || typeof this.state.limitBuy === undefined || this.state.limitBuy == 0) {
      NotificationManager.error(<IntlMessages id="trading.stoplimit.enterbuylimit" />);

    } else if (this.state.amountBuy == '' || typeof this.state.amountBuy === undefined || this.state.amountBuy == 0) {
      this.setState({ showLoader: false, buyStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.transaction.4608" />);
    } else if (this.state.totalBuy == '' || typeof this.state.totalBuy === undefined || this.state.totalBuy == 0) {

      this.setState({ showLoader: false, buyStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.transaction.4609" />);
    } else if (info.currencyPairID == '' || typeof info.currencyPairID === undefined || info.currencyPairID == 0) {

      this.setState({ showLoader: false, buyStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.transaction.4601" />);
    } else if (this.props.secondCurrencyWalletId == '' || typeof this.props.secondCurrencyWalletId === undefined || this.props.secondCurrencyWalletId == 0) {

      this.setState({ showLoader: false, buyStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.creditwallet" />);
    } else if (this.props.firstCurrencyWalletId == '' || typeof this.props.firstCurrencyWalletId === undefined || this.props.firstCurrencyWalletId == 0) {

      this.setState({ showLoader: false, buyStopOrderBit: 0 });
      NotificationManager.error(<IntlMessages id="error.trading.debitwallet" />);
    }
    else {

      const data = {
        currencyPairID: info.currencyPairID,
        debitWalletID: this.props.secondCurrencyWalletId,
        creditWalletID: this.props.firstCurrencyWalletId,
        feePer: 0,
        fee: 0,
        trnMode: 21,
        price: this.state.limitBuy,
        amount: this.state.amountBuy,
        total: this.state.totalBuy,
        ordertype: 4,
        orderSide: 4,
        StopPrice: this.state.stopBuy,
        Pair: this.props.firstCurrency + '_' + this.props.secondCurrency,
        marginOrder: this.props.marginTrading
      };

      const { isValid, errors } = validateBuyData(data);
      if (!isValid) {
        if (errors.buyLimit) {
          this.setState({
            isLimitBuyValid: false,
            limitBuyError: errors.buyLimit,
            total: ""
          });
        }

        if (errors.buyAmount) {
          this.setState({
            isAmountBuyValid: false,
            amountBuyError: errors.buyAmount,
            totalBuy: ""
          });
        }

        if (errors.buyTotal) {
          this.setState({
            isTotalBuyValid: false,
            totalBuyError: errors.buyTotal
          });
        }
      } else {
        if (
          this.state.isAmountBuyValid &&
          this.state.isLimitBuyValid &&
          this.state.isTotalBuyValid &&
          this.state.isStopBuyValid
        ) {
          this.setState({
            showLoader: true,
            buyStopOrderBit: 1,
            sellStopOrderBit: 0
          });

          if (this.state.totalBuy <= this.props.secondCurrencyBalance) {
            this.props.doBuyOrder(data);
          } else {
            this.setState({ showLoader: false, buyStopOrderBit: 0 });
            NotificationManager.error(
              <IntlMessages id="trading.placeorder.error.minBalance" />
            );
          }
        } else {
          this.setState({ showLoader: false, buyStopOrderBit: 0 });
          NotificationManager.error(
            <IntlMessages id="trading.placeorder.error.properdata" />
          );
        }
      }
    }
  };

  render() {

    // if(this.props.bulkBuyOrder && this.props.bulkBuyOrder.Price && this.props.bulkBuyOrder.Amount && this.props.bulkBuyOrder.Total) {

    //   this.state.priceBuy = parseFloat(this.props.bulkBuyOrder.Price).toFixed(8)
    //   this.state.amountBuy = parseFloat(this.props.bulkBuyOrder.Amount).toFixed(8)
    //   this.state.totalBuy = this.props.bulkBuyOrder.Total

    // }

    // if(this.props.bulkSellOrder && this.props.bulkSellOrder.Price && this.props.bulkSellOrder.Amount && this.props.bulkSellOrder.Total) {
    //   this.state.priceSell = parseFloat(this.props.bulkSellOrder.Price).toFixed(8)
    //   this.state.amountSell = parseFloat(this.props.bulkSellOrder.Amount).toFixed(8)
    //   this.state.totalSell = this.props.bulkSellOrder.Total
    // }

    const data = this.props.info;
    return (
      <Row>
        {/* {this.props.loading && <JbsSectionLoader />} */}
        <Col sm={6} xs={6} className="">
          <div className="p-0 d-flex">
            <h4>
              {<IntlMessages id="trading.placeorder.label.buy" />}{" "}
              {data.firstCurrency}
            </h4>
            <p className="fs-14 mb-0 btcbuyprice">
              {this.props.marginTrading ? <AddMarginBalance
                {...this.props}
                widgetType={3}
                walletTypeName={data.secondCurrency}
                CurrencyBalance={this.props.secondCurrencyBalance ?
                  parseFloat(this.props.secondCurrencyBalance).toFixed(8)
                  : parseFloat(0).toFixed(8)
                } /> : <a href="javascript:void(0)">
                  <i className="zmdi zmdi-balance-wallet">
                    {" "}
                    {this.props.secondCurrencyBalance ? parseFloat(this.props.secondCurrencyBalance).toFixed(8) : parseFloat(0).toFixed(8)
                    } <span>{data.secondCurrency}</span>
                  </i>
                </a>}
            </p>
          </div>
          <div className="mb-10 mt-10">
            <Form className="mt-20">
              <Row>
                <Label sm={4} for="stop">
                  {
                    <IntlMessages id="trading.placeorder.stoplimit.label.stop" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    // onBlur={this.validateBuyStop}
                    name="stop"
                    id="stop"
                    placeholder={data.secondCurrency}
                    value={this.state.stopBuy}
                    onChange={this.validateBuyStop}
                    className={!this.state.isStopBuyValid ? "error" : ""}
                  />
                  {!this.state.isStopBuyValid && (
                    <div>
                      <span className="text-danger">
                        <IntlMessages id={this.state.stopBuyError} />
                      </span>
                    </div>
                  )}
                </Col>
              </Row>

              <Row>
                <Label sm={4} for="limit">
                  {
                    <IntlMessages id="trading.placeorder.stoplimit.label.limit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="limit"
                    id="limit"
                    placeholder={data.secondCurrency}
                    // onBlur={this.validateBuyLimit}
                    value={this.state.limitBuy}
                    onChange={this.validateBuyLimit}
                    className={!this.state.isLimitBuyValid ? "error" : ""}
                  />
                  {!this.state.isLimitBuyValid && (
                    <div>
                      <span className="text-danger">
                        <IntlMessages id={this.state.limitBuyError} />
                      </span>
                    </div>
                  )}
                </Col>
              </Row>

              <Row>
                <Label sm={4} for="Amount">
                  {<IntlMessages id="trading.placeorder.label.amount" />}
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    //onBlur={this.validateBuyAmount}
                    disabled={
                      this.state.selectedBuyValue !== 0 ? true : false
                    }
                    name="amount"
                    id="amount"
                    placeholder={data.firstCurrency}
                    value={this.state.amountBuy}
                    onChange={this.validateBuyAmount}
                    className={!this.state.isAmountBuyValid ? "error" : ""}
                  />
                  {!this.state.isAmountBuyValid && (
                    <div>
                      <span className="text-danger">
                        <IntlMessages id={this.state.amountBuyError} />
                      </span>
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm={{ size: '8', offset: '4' }}>
                  <Row className="pl-5 pr-5">
                    <Col sm={3} xs={3} className="m-0 p-0">
                      <Button
                        value="25"
                        className={classnames(
                          { active: this.state.selectedBuyValue === 25 },
                          "btnbuy-per btn-xs m-2"
                        )}
                        onClick={event => {
                          this.changeSelectedBuyValue(25);
                        }}
                      >
                        25%
                        </Button>
                    </Col>

                    <Col sm={3} xs={3} className="m-0 p-0">
                      <Button
                        value="50"
                        className={classnames(
                          { active: this.state.selectedBuyValue === 50 },
                          "btnbuy-per btn-xs m-2"
                        )}
                        onClick={event => {
                          this.changeSelectedBuyValue(50);
                        }}
                      >
                        50%
                    </Button>
                    </Col>

                    <Col sm={3} xs={3} className="m-0 p-0">
                      <Button
                        value="75"
                        className={classnames(
                          { active: this.state.selectedBuyValue === 75 },
                          "btnbuy-per btn-xs m-2"
                        )}
                        onClick={event => {
                          this.changeSelectedBuyValue(75);
                        }}
                      >
                        75%
                    </Button>
                    </Col>

                    <Col sm={3} xs={3} className="m-0 p-0">
                      <Button
                        value="100"
                        className={classnames(
                          { active: this.state.selectedBuyValue === 100 },
                          "btnbuy-per btn-xs m-2"
                        )}
                        onClick={event => {
                          this.changeSelectedBuyValue(100);
                        }}
                      >
                        100%
                    </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Label sm={4} for="Total">
                  {<IntlMessages id="trading.placeorder.label.total" />}
                </Label>
                <Col sm={8}>

                  <Input
                    type="text"
                    value={this.state.totalBuy}
                    name="total"
                    id="total"
                    onChange={this.validateBuyTotal}
                    placeholder={data.secondCurrency}
                    className={!this.state.isTotalBuyValid ? "error" : ""}
                  />

                  {!this.state.isTotalBuyValid && (
                    <div>
                      <span className="text-danger">
                        <IntlMessages id={this.state.totalBuyError} />
                      </span>
                    </div>
                  )}

                </Col>
              </Row>

              <FormGroup className="mt-10 mb-0">
                <Button
                  type="submit"
                  name={
                    <IntlMessages id="trading.placeorder.button.buy" />
                  }
                  onClick={event => {
                    this.doBuyOrder(event);
                  }}
                  className="btn btn-buy btnbuysell">
                  {<IntlMessages id="trading.placeorder.button.buy" />} {" "}
                  {data.firstCurrency}
                  {this.props.buyOrderLoading && <CircularProgress size={18} style={{ top: '15px', position: 'absolute', right: '20px', color: "white" }} />}
                </Button>
              </FormGroup>
            </Form>
          </div>
        </Col>
        <Col sm={6} xs={6} className="">
          <div className="p-0 d-flex">
            <h4>
              {<IntlMessages id="trading.placeorder.label.sell" />}{" "}
              {data.firstCurrency}
            </h4>
            <p className="fs-14 mb-0 btcbuyprice">
              {this.props.marginTrading ? <AddMarginBalance
                {...this.props}
                widgetType={3}
                walletTypeName={data.firstCurrency}
                CurrencyBalance={this.props.firstCurrencyBalance ?
                  parseFloat(this.props.firstCurrencyBalance).toFixed(8)
                  : parseFloat(0).toFixed(8)
                } /> :
                <a href="javascript:void(0)">
                  <i className="zmdi zmdi-balance-wallet">
                    {" "}
                    {this.props.firstCurrencyBalance ? parseFloat(this.props.firstCurrencyBalance).toFixed(8) : parseFloat(0).toFixed(8)
                    } <span>{data.firstCurrency}</span>
                  </i>
                </a>}
            </p>
          </div>

          <div className="mb-10 mt-10">
            <Form className="mt-20">
              <Row>
                <Label sm={4} for="stop">
                  {
                    <IntlMessages id="trading.placeorder.stoplimit.label.stop" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="stop"
                    id="stop"
                    placeholder={data.secondCurrency}
                    value={this.state.stopSell}
                    onChange={this.validateSellStop}
                    className={!this.state.isStopSellValid ? "error" : ""}
                  />
                  {!this.state.isStopSellValid && (
                    <div>
                      <span className="text-danger">
                        <IntlMessages id={this.state.stopSellError} />
                      </span>
                    </div>
                  )}
                </Col>
              </Row>

              <Row>
                <Label sm={4} for="limit">
                  {
                    <IntlMessages id="trading.placeorder.stoplimit.label.limit" />
                  }
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="limit"
                    id="limit"
                    placeholder={data.secondCurrency}
                    value={this.state.limitSell}
                    onChange={this.validateSellLimit}
                    className={!this.state.isLimitSellValid ? "error" : ""}
                  />
                  {!this.state.isLimitSellValid && (
                    <div>
                      <span className="text-danger">
                        <IntlMessages id={this.state.limitSellError} />
                      </span>
                    </div>
                  )}
                </Col>
              </Row>

              <Row>
                <Label sm={4} for="Amount">
                  {<IntlMessages id="trading.placeorder.label.amount" />}
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    disabled={
                      this.state.selectedSellValue !== 0 ? true : false
                    }
                    name="amount"
                    id="amount"
                    placeholder={data.firstCurrency}
                    value={this.state.amountSell}
                    onChange={this.validateSellAmount}
                    className={!this.state.isAmountSellValid ? "error" : ""}
                  />
                  {!this.state.isAmountSellValid && (
                    <div>
                      <span className="text-danger">
                        <IntlMessages id={this.state.amountSellError} />
                      </span>
                    </div>
                  )}
                </Col>
              </Row>

              <Row>
                <Col sm={{ size: 8, offset: 4 }}>
                  <Row className="pl-5 pr-5">
                    <Col sm={3} xs={3} className="m-0 p-0">
                      <Button
                        value="25"
                        className={classnames(
                          { active: this.state.selectedSellValue === 25 },
                          "btnsell-per btn-xs m-2"
                        )}
                        onClick={event => {
                          this.changeSelectedSellValue(25);
                        }}
                      >
                        25%
                    </Button>
                    </Col>

                    <Col sm={3} xs={3} className="m-0 p-0">
                      <Button
                        value="50"
                        className={classnames(
                          { active: this.state.selectedSellValue === 50 },
                          "btnsell-per btn-xs m-2"
                        )}
                        onClick={event => {
                          this.changeSelectedSellValue(50);
                        }}
                      >
                        50%
                  </Button>
                    </Col>

                    <Col sm={3} xs={3} className="m-0 p-0">
                      <Button
                        value="75"
                        className={classnames(
                          { active: this.state.selectedSellValue === 75 },
                          "btnsell-per btn-xs m-2"
                        )}
                        onClick={event => {
                          this.changeSelectedSellValue(75);
                        }}
                      >
                        75%
                  </Button>
                    </Col>
                    <Col sm={3} xs={3} className="m-0 p-0">
                      <Button
                        value="100"
                        className={classnames(
                          { active: this.state.selectedSellValue === 100 },
                          "btnsell-per btn-xs m-2"
                        )}
                        onClick={event => {
                          this.changeSelectedSellValue(100);
                        }}
                      >
                        100%
                  </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Label sm={4} for="Total">
                  {<IntlMessages id="trading.placeorder.label.total" />}
                </Label>
                <Col sm={8}>
                  <Input
                    type="text"
                    value={this.state.totalSell}
                    name="total"
                    id="total"
                    onChange={this.validateSellTotal}
                    placeholder={data.secondCurrency}
                    className={!this.state.isTotalSellValid ? "error" : ""}
                  />

                  {!this.state.isTotalSellValid && (
                    <div>
                      <span className="text-danger">
                        <IntlMessages id={this.state.totalSellError} />
                      </span>
                    </div>
                  )}

                </Col>
              </Row>

              <FormGroup className="mt-10 mb-0">
                <Button
                  type="submit"
                  name={
                    <IntlMessages id="trading.placeorder.button.sell" />
                  }
                  onClick={event => {
                    this.doSellOrder(event);
                  }}
                  className="btn btn-sell btnbuysell"
                >
                  {<IntlMessages id="trading.placeorder.button.sell" />}{" "}
                  {data.firstCurrency}
                  {this.props.sellOrderLoading && <CircularProgress size={18} style={{ top: '15px', position: 'absolute', right: '20px', color: "white" }} />}
                </Button>
              </FormGroup>
            </Form>
          </div>
        </Col>

      </Row>
    );
  }
}

// export component
//export default StopLimitOrder;

// Set Props when actions are dispatch
const mapStateToProps = state => ({
  buyOrder: state.placeOrder.buyOrder,
  sellOrder: state.placeOrder.sellOrder,
  loading: state.placeOrder.loading,
  buyOrderLoading: state.placeOrder.buyOrderLoading,
  sellOrderLoading: state.placeOrder.sellOrderLoading,
  error: state.placeOrder.error,
  //currentPrice:state.currency.currentPrice,  
  currentPrice: state.currentMarketCap.currentMarketCap,
  lastPriceBit: state.currentMarketCap.lastPriceBit,
});

// connect action with store for dispatch
export default connect(
  mapStateToProps,
  {
    doBuyOrder,
    doSellOrder
  }
)(StopLimitOrder);
