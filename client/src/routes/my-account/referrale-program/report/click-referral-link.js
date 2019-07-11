/**
 * Create By Sanjay
 * Created Date 6/03/2019
 * Report For Referral Link Click
 */
import React from 'react';
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ClickOnReferralLinkReport } from "Components/MyAccount/ReferralProgram";

export default function ClickReferralLink(props) {
    return (
        <div className="my-account-wrapper">
            <PageTitleBar title={<IntlMessages id="my_account.ClickOnReferralLinkReport" />} match={props.match} />
            <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                <ClickOnReferralLinkReport {...props} />
            </JbsCollapsibleCard>
        </div>
    )
}
