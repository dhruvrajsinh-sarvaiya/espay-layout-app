import React, { Component } from "react";
import LiquidityProviderComponent from "Components/LiquidityProvider/LiquidityProvider";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";

export default class LiquidityProvider extends Component {
  render() {
    return (
      <div className="data-table-wrapper mb-20">
        <PageTitleBar
          title={<IntlMessages id="sidebar.liquidityProvider" />}
          match={this.props.match}
        />
        <LiquidityProviderComponent />
      </div>
    );
  }
}
