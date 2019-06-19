/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Send SMS Reports
 */

import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { SendSMSReport } from "Components/MyAccount/AffiliateProgram";

export default class AffiliateSendSMSReport extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.sendSmsReport" />} match={this.props.match} />
                <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                    <SendSMSReport {...this.props} />
                </JbsCollapsibleCard>
            </div>
        );
    }
}