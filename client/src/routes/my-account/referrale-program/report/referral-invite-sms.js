/**
 * Created By Sanjay
 * Created Date 25/02/19
 * Route For Referral invite by SMS
 */
import React from 'react';
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ReferralInvitationViaEmailSMS } from "Components/MyAccount/ReferralProgram";

export default function ReferralInviteSMS(props) {
    return (
        <div className="my-account-wrapper">
            <PageTitleBar title={<IntlMessages id="sidebar.referralInviteSms" />} match={props.match} />
            <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                <ReferralInvitationViaEmailSMS {...props} channelId="2" />
            </JbsCollapsibleCard>
        </div>
    )
}
