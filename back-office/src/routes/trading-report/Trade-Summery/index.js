import React, { Component } from "react";

//Components
import Tradefilter from "./components/trade_filter";
import Tradedadata from "./components/trade_datatable";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

export default class index extends Component {
  render() {
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.trade-summery" />}
          match={this.props.match}
        />
        <Tradefilter />
        <Tradedadata />
      </div>
    );
  }
}
