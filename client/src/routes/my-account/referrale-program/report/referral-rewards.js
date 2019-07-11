/**
 * Create By Sanjay
 * Created Date 6/03/2019
 * Report For Referral Reward
 */
import React from 'react';
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ListReferralRewards } from "Components/MyAccount/ReferralProgram";

export default function ReferralRewards(props) {
    return (
        <div className="my-account-wrapper">
            <PageTitleBar title={<IntlMessages id="my_account.convert" />} match={props.match} />
            <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                <ListReferralRewards {...props} />
            </JbsCollapsibleCard>
        </div>
    )
}

