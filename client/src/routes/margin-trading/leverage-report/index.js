/* 
    Developer : Parth andhariya
    Date : 05-03-2019
    File Comment : Leverge Report route
*/
import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { LeverageReport } from 'Components/MarginTrading';

class MarginLeverageReport extends Component {
    render() {
        const { intl } = this.props;
        return (
            <div className="History pb-20">
                <PageTitleBar title={intl.formatMessage({ id: "sidebar.LeverageRequest" })} match={this.props.match} />
                <LeverageReport {...this.props} />
            </div>
        )
    }
}

export default injectIntl(MarginLeverageReport);
