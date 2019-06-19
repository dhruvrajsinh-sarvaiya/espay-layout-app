// Component for display balance info.

import React, { Component } from 'react';
import IntlMessages from 'Util/IntlMessages';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import FundBalances from 'Components/FundBalances/FundBalances';

// Create Class For Display Balance Detail
class BalanceIndex extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="Balance">
                <PageTitleBar title={<IntlMessages id="sidebar.balance" />} match={match} />
                <JbsCollapsibleCard
                    reloadable
                >
                    <FundBalances {...this.props} />
                </JbsCollapsibleCard>
            </div>
        )
    }
}

export default BalanceIndex;
