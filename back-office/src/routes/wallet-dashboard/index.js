import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import WalletDashBoardComponent from "Components/WalletDashBoard/WalletDashBoard";

export default class WalletDashBoard extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <PageTitleBar
          title={<IntlMessages id="sidebar.walletMenu" />}
          match={match}
        />
        <WalletDashBoardComponent />
      </div>
    );
  }
}
