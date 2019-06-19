/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : wallet sharing list of all available wallets
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import WalletActivityList from "Components/MyWallets/WalletActivityList";

//initial state
const initState = {}

class WalletActivityIndex extends Component {
    state = initState;
    //render component
    render() {
        const { match } = this.props;
        return (
            <Fragment>
                <PageTitleBar title={<IntlMessages id="sidebar.walletActivity" />} match={match} />
                <WalletActivityList {...this.props} />
            </Fragment>
        );
    }
}

export default WalletActivityIndex