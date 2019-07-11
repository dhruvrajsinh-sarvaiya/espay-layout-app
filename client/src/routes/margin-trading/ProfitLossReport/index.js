/* 
    Developer : Vishva Shah
    Date : 18-04-2019
    File Comment : Profit & loss report
*/
import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import {ProfitLossReport} from 'Components/MarginTrading';

class marginProfitLossReport extends Component {
    render() {
        const { intl } = this.props;
        return (
            <div className="History pb-20">
                <PageTitleBar title={intl.formatMessage({ id: "sidebar.profitlossReport" })} match={this.props.match} />
                <ProfitLossReport {...this.props} />
            </div>
        )
    }
}

export default injectIntl(marginProfitLossReport);
