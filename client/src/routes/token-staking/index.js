/* 
    Developer : Nishant Vadgama
    Date : 20-09-2018
    File Comment : Token staking root componet
*/
import React, { Component } from "react";
// Import component for internationalization
import IntlMessages from "Util/IntlMessages";
// import component for Page Title
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import TokenStaking from "Components/TokenStaking/TokenStaking";
import StakingHistory from "Components/TokenStaking/StakingHistory";

// Create Class For Display token staking details
class TokenStakingIndex extends Component {
    // render frees unfreez token details with history
    render() {
        const { match } = this.props;
        return (
            <div>
                <div className="Deposit">
                    <PageTitleBar
                        title={<IntlMessages id="wallet.TSPageTitle" />}
                        match={match}
                    />
                    <div className="row">
                        <TokenStaking />
                        <StakingHistory />
                    </div>
                </div>
            </div>
        );
    }
}

export default TokenStakingIndex;
