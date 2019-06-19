/* 
    Developer : Devang Parekh
    Date : 6-03-2019
    File Comment : margin trading history
*/
import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { MarginTradingHistory } from 'Components/MarginTrading';

class MarginTradingHistoryList extends Component {
    render() {
        const { intl } = this.props;
        return (
            <div className="History pb-20">
                <PageTitleBar title={intl.formatMessage({ id: "sidebar.marginHistory" })} match={this.props.match} />
                <MarginTradingHistory {...this.props} />
            </div>
        )
    }
}

export default injectIntl(MarginTradingHistoryList);
