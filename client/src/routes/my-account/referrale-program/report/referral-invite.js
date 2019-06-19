/**
 * Create By Sanjay
 * Created Date 26/02/2019
 * Report For Referral Invite
 */
import React from 'react';
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ReferralInviteReport } from "Components/MyAccount/ReferralProgram";

export default function ReferralInvite(props) {
    return (
        <div className="my-account-wrapper">
            <PageTitleBar title={<IntlMessages id="sidebar.referralInvite" />} match={props.match} />
            <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                <ReferralInviteReport {...props} />
            </JbsCollapsibleCard>
        </div>
    )
}

