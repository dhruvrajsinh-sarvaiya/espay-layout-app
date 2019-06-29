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
import { CommissionReport } from "Components/MyAccount/AffiliateProgram";

export default class AffiliateCommissionReport extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.commissionReport" />} match={this.props.match} />
                <JbsCollapsibleCard customClasses="col-lg-12 p-0">                
                    <CommissionReport {...this.props} />
                </JbsCollapsibleCard>
            </div>
        );
    }
}