// Added by Karan Joshi

import React, { Component } from 'react'
import { TradingSummeryLpWiseWdhtApiManager }from "Components/TradingWidgets/Reports/Components/TradingSummeryLpwiseApiManager/"
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";


export default class TradesummeryLPRoute extends Component {
  render() {
    return (
      <div>
           <PageTitleBar
          title={<IntlMessages id="sidebar.tradesummeylpwise" />}
          match={this.props.match}
        />
        <TradingSummeryLpWiseWdhtApiManager/>
      </div>
    )
  }
}
