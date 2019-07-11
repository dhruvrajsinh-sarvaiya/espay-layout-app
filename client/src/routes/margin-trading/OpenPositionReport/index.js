/* 
    Developer : Parth Andhariya
    Date : 22-04-2019
    File Comment : margin trading Open Position Report management
*/
import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { OpenPositionReport } from 'Components/MarginTrading';

class OpenPositionReportRoute extends Component {
    render() {
        const { intl } = this.props;
        return (
            <div className="History pb-20">
                <PageTitleBar title={intl.formatMessage({ id: "sidebar.OpenPositionReport" })} match={this.props.match} />
                <OpenPositionReport {...this.props} />
            </div>
        )
    }
}

export default injectIntl(OpenPositionReportRoute);
