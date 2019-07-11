/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate index file
 */

import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

//Signup Form...
const SignupForm = Loadable({
    loader: () => import("./SignupForm"),
    loading: MyLoadingComponent
});

//Commissoin Pattern...
const CommissionPattern = Loadable({
    loader: () => import("./CommissionPattern"),
    loading: MyLoadingComponent
});

//Send Mail Report...
const SendMailReport = Loadable({
    loader: () => import("./SendMailReport"),
    loading: MyLoadingComponent
});

//Send SMS Report...
const SendSMSReport = Loadable({
    loader: () => import("./SendSMSReport"),
    loading: MyLoadingComponent
});

//Click On Link Report...
const ClickOnLinkReport = Loadable({
    loader: () => import("./ClickOnLinkReport"),
    loading: MyLoadingComponent
});

//Facebook Share Report...
const FacebookShareReport = Loadable({
    loader: () => import("./FacebookShareReport"),
    loading: MyLoadingComponent
});

//Twitter Share Report...
const TwitterShareReport = Loadable({
    loader: () => import("./TwitterShareReport"),
    loading: MyLoadingComponent
});

//Signup Report...
const SignupReport = Loadable({
    loader: () => import("./SignupReport"),
    loading: MyLoadingComponent
});

//Commission Report...
const CommissionReport = Loadable({
    loader: () => import("./CommissionReport"),
    loading: MyLoadingComponent
});

//Invite People Chart...
const InvitePeopleChart = Loadable({
    loader: () => import("./InvitePeopleChart"),
    loading: MyLoadingComponent
});

//Earning Chart...
const EarningChart = Loadable({
    loader: () => import("./EarningChart"),
    loading: MyLoadingComponent
});

//Invite Friendsks...
const InviteFriends = Loadable({
    loader: () => import("./InviteFriends"),
    loading: MyLoadingComponent
});

//Affiliate Confirmation...
const AffiliateConfirmationWdgt = Loadable({
    loader: () => import("./AffiliateConfirmationWdgt"),
    loading: MyLoadingComponent
});

export {
    SignupForm,
    CommissionPattern,
    SendMailReport,
    SendSMSReport,
    ClickOnLinkReport,
    FacebookShareReport,
    TwitterShareReport,
    SignupReport,
    CommissionReport,
    InvitePeopleChart,
    EarningChart,
    InviteFriends,
    AffiliateConfirmationWdgt,
}