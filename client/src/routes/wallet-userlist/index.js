/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : wallet sharing list of all available wallets users
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import ListWalletUsers from "Components/MyWallets/ListWalletUsers";

//initial state
const initState = {}

class WalletUserList extends Component {
    state = initState;
    //render component
    render() {
        const { match } = this.props;
        return (
            <Fragment>
                <PageTitleBar title={<IntlMessages id="sidebar.walletUserlist" />} match={match} />
                <ListWalletUsers {...this.props} />
            </Fragment>
        );
    }
}

export default WalletUserList