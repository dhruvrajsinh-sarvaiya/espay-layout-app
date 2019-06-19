/**
 * Create By Sanjay 
 * Created Date 26/02/19
 * Route For Referral Participate 
 */
import React from 'react';
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ReferralParticipateReport } from "Components/MyAccount/ReferralProgram";

export default function ReferralParticipate(props) {
    return (
        <div className="my-account-wrapper">
            <PageTitleBar title={<IntlMessages id="sidebar.referralParticipate" />} match={props.match} />
            <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                <ReferralParticipateReport {...props} />
            </JbsCollapsibleCard>
        </div>
    )
}

