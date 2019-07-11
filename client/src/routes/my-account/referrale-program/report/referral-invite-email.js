/**
 * Cretaed By Sanjay
 * Created Date 26/02/19
 * Route For Referral Invite By Email
 */
import React from 'react';
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ReferralInvitationViaEmailSMS } from "Components/MyAccount/ReferralProgram";

export default function ReferralInviteEmail(props) {
    return (
        <div className="my-account-wrapper">
            <PageTitleBar title={<IntlMessages id="sidebar.referralInviteEmail" />} match={props.match} />
            <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                <ReferralInvitationViaEmailSMS {...props} channelId="1"/>
            </JbsCollapsibleCard>
        </div>
    )
}
