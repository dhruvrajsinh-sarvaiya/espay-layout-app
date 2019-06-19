/**
 * App Widgets
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
   <PreloadWidget />
)

//Referral Top Commission Widget...
const ReferralTopCommissionWdgt = Loadable({
   loader: () => import("./ReferralTopCommissionWdgt"),
   loading: MyLoadingComponent
});

//Referral Program Detail Widget...
const ReferralProgramDetailsWdgt = Loadable({
    loader: () => import("./ReferralProgramDetailsWdgt"),
    loading: MyLoadingComponent
});

//Referral Program Detail Widget...
const ReferralWithoutLoginBlk = Loadable({
    loader: () => import("./ReferralWithoutLoginBlk"),
    loading: MyLoadingComponent
});

//Referral Program Detail Widget...
const ReferralDetailBlk = Loadable({
    loader: () => import("./ReferralDetailBlk"),
    loading: MyLoadingComponent
});

//Referral Friends Table Widget...
const ReferralFriendsTableWdgt = Loadable({
    loader: () => import("./ReferralFriendsTableWdgt"),
    loading: MyLoadingComponent
});

//Referral Friends Table Widget...
const ReferralLatestCommissionHistoryTableWdgt = Loadable({
    loader: () => import("./LatestCommissionHistoryTableWdgt"),
    loading: MyLoadingComponent
});

const ReferralCountCardsWdgt = Loadable({
    loader: () => import("./ReferralCountCardsWdgt"),
    loading: MyLoadingComponent
})

const ReferralInviteReport = Loadable({
    loader: () => import("./ReferralInviteReport"),
    loading: MyLoadingComponent
})

const ReferralParticipateReport = Loadable({
    loader: () => import("./ReferralParticipateReport"),
    loading: MyLoadingComponent
})

const ReferralInvitationViaEmailSMS = Loadable({
    loader: () => import("./ReferralInvitationViaEmailSMS"),
    loading: MyLoadingComponent
})

const ClickOnReferralLinkReport = Loadable({
    loader: () => import("./ClickOnReferralLinkReport"),
    loading: MyLoadingComponent
})

const ListReferralRewards = Loadable({
    loader: () => import("./ListReferralRewards"),
    loading: MyLoadingComponent
})

export {
    ReferralTopCommissionWdgt,
    ReferralProgramDetailsWdgt,
    ReferralWithoutLoginBlk,
    ReferralDetailBlk,
    ReferralFriendsTableWdgt,
    ReferralLatestCommissionHistoryTableWdgt,
    ReferralCountCardsWdgt,
    ReferralInviteReport,
    ReferralParticipateReport,
    ReferralInvitationViaEmailSMS,
    ClickOnReferralLinkReport,
    ListReferralRewards
}