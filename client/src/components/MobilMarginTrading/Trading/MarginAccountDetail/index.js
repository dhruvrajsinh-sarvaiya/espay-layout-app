// Dev: Devang parekh
// Date : 1-3-2019
// use: this Component used for displaying margin and safety and profit balance detail in this component

import React, { Component, Fragment } from "react";
// import scrollbar
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from 'react-redux';
// intl messages
import IntlMessages from "Util/IntlMessages";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { changeDateFormat } from "Helpers/helpers";
//import action for call or get leverage detail
import {
  getLeverageDetail
} from "Actions/MarginTrading";
//import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";
// display or process for margin trading wallet creation
import { AddMarginBalance } from 'Components/MarginTrading';

class MarginAccountDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coinlist: [],
      loading: true,
      leverageDetail: {}
    };
  }

  componentWillMount() {
    this.props.getLeverageDetail({ firstCurrency: this.props.firstCurrency, secondCurrency: this.props.secondCurrency });
  }

  componentWillReceiveProps(nextProps) {

    // code for handle leverage detail and display in component
    if (nextProps.leverageDetail && nextProps.leverageDetail.ReturnCode === 0) {
      this.setState({ leverageDetail: nextProps.leverageDetail })
    } else if (nextProps.leverageDetail && (nextProps.leverageDetail.ReturnCode === 1 || nextProps.leverageDetail.ReturnCode === 9)) {
      this.setState({ leverageDetail: {} })
    }
  }

  render() {

    return (
      <Fragment>
        {this.props.loading && <JbsSectionLoader />}
        <div className="coinbasetitle"><IntlMessages id="marginTrading.marginAccountDetail" /> </div>
        <Scrollbars
          className="jbs-scroll"
          autoHeight
          autoHeightMin={this.props.autoHeightMin}
          autoHeightMax={this.props.autoHeightMax}
          autoHide
        >
          <ExpansionPanel className="mb-15 panel mt-5 panel-border">
            <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-balance-wallet color-icon"></i>} className="m-0 panel-heading demo">
              <Typography className="text-dblue">{this.props.secondCurrency}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ "display": "block" }}>

              {(typeof this.state.leverageDetail.SecondCurrency === "undefined" || this.state.leverageDetail.SecondCurrency === null || (this.state.leverageDetail.SecondCurrency.IsLeverageTaken && this.state.leverageDetail.SecondCurrency.IsLeverageTaken === 0)) ?
                <div className="text-center">
                  {<AddMarginBalance
                    widgetType={4}
                    walletTypeName={this.props.secondCurrency}
                    firstCurrency={this.props.firstCurrency}
                    secondCurrency={this.props.secondCurrency} />}
                </div>
                :
                <div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="wallet.MarginWallets" /></div>
                    <div className="col-sm-6">: {this.props.secondCurrencyMarginDetail[0] ? parseFloat(this.props.secondCurrencyMarginDetail[0].Balance).toFixed(8) : 0}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="wallet.SafetyWallets" /></div>
                    <div className="col-sm-6">: {this.props.secondCurrencyMarginDetail[1] ? parseFloat(this.props.secondCurrencyMarginDetail[1].Balance).toFixed(8) : 0}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="wallet.ProfitWallets" /></div>
                    <div className="col-sm-6">: {this.props.secondCurrencyMarginDetail[2] ? parseFloat(this.props.secondCurrencyMarginDetail[2].Balance).toFixed(8) : 0}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="marginTrading.leverage" /></div>
                    <div className="col-sm-6">: {typeof this.state.leverageDetail.SecondCurrency !== "undefined" ? this.state.leverageDetail.SecondCurrency.Leverage + 'X' : "0X"}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="marginTrading.leverageCharge" /></div>
                    <div className="col-sm-6">: {typeof this.state.leverageDetail.SecondCurrency !== "undefined" ? this.state.leverageDetail.SecondCurrency.LeverageCharge + '%' : "0%"}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="marginTrading.lastLeverageTime" /></div>
                    <div className="col-sm-6">: {typeof this.state.leverageDetail.SecondCurrency !== "undefined" ? this.state.leverageDetail.SecondCurrency.LastLeverageTime ? changeDateFormat(this.state.leverageDetail.SecondCurrency.LastLeverageTime, 'YYYY-MM-DD HH:mm:ss', false) : '-' : "-"}</div>
                  </div>
                </div>
              }
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel className="mb-15 panel panel-border">
            <ExpansionPanelSummary expandIcon={<i className="zmdi zmdi-balance-wallet color-icon"></i>} className="m-0 panel-heading demo">
              <Typography className="text-dblue">{this.props.firstCurrency}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ "display": "block" }}>
              {(typeof this.state.leverageDetail.FirstCurrency === "undefined" || this.state.leverageDetail.FirstCurrency === null || (this.state.leverageDetail.FirstCurrency.IsLeverageTaken && this.state.leverageDetail.FirstCurrency.IsLeverageTaken === 0)) ?
                <div className="text-center">
                  {<AddMarginBalance
                    widgetType={4}
                    walletTypeName={this.props.firstCurrency}
                    firstCurrency={this.props.firstCurrency}
                    secondCurrency={this.props.secondCurrency} />}
                </div>
                :
                <div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="wallet.MarginWallets" /></div>
                    <div className="col-sm-6">: {this.props.firstCurrencyMarginDetail[0] ? parseFloat(this.props.firstCurrencyMarginDetail[0].Balance).toFixed(8) : 0}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="wallet.SafetyWallets" /></div>
                    <div className="col-sm-6">: {this.props.firstCurrencyMarginDetail[1] ? parseFloat(this.props.firstCurrencyMarginDetail[1].Balance).toFixed(8) : 0}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="wallet.ProfitWallets" /></div>
                    <div className="col-sm-6">: {this.props.firstCurrencyMarginDetail[2] ? parseFloat(this.props.firstCurrencyMarginDetail[2].Balance).toFixed(8) : 0}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="marginTrading.leverage" /></div>
                    <div className="col-sm-6">: {typeof this.state.leverageDetail.FirstCurrency !== "undefined" ? this.state.leverageDetail.FirstCurrency.Leverage + 'X' : "0X"}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="marginTrading.leverageCharge" /></div>
                    <div className="col-sm-6">: {typeof this.state.leverageDetail.FirstCurrency !== "undefined" ? this.state.leverageDetail.FirstCurrency.LeverageCharge + '%' : "0%"}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 font-weight-bold"><IntlMessages id="marginTrading.lastLeverageTime" /></div>
                    <div className="col-sm-6">: {typeof this.state.leverageDetail.FirstCurrency !== "undefined" ? this.state.leverageDetail.FirstCurrency.LastLeverageTime ? (this.state.leverageDetail.FirstCurrency.LastLeverageTime.split('T')[0] + ' ' + this.state.leverageDetail.FirstCurrency.LastLeverageTime.split('T')[1].split('.')[0]) : '-' : "-"}</div>
                  </div>
                </div>
              }
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Scrollbars>
      </Fragment>
    )
  }
}

const mapStateToProps = ({ leverageDetail }) => {
  var response = {
    leverageDetail: leverageDetail.leverageDetail,
    loading: leverageDetail.loading,
  };
  return response
}

export default connect(mapStateToProps, {
  getLeverageDetail
})(MarginAccountDetail);