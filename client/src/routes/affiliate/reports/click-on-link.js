/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Click On Link Reports
 */

import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ClickOnLinkReport } from "Components/MyAccount/AffiliateProgram";

export default class AffiliateClickOnLinkReport extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.clickOnLinkReport" />} match={this.props.match} />
                <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                    <ClickOnLinkReport {...this.props} />
                </JbsCollapsibleCard>
            </div>
        );
    }
}