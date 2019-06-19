/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import AffiliateDashboard from './dashboard';
import AffiliateCmsPtrn from './commission-pattern';
import AffiliatePromotion from './promotion';
import AffiliateSendMailReport from './reports/send-mail';
import AffiliateSendSMSReport from './reports/send-sms';
import AffiliateFacebookShareReport from './reports/facebook-share';
import AffiliateTwitterShareReport from './reports/twitter-share';
import AffiliateSignupReport from './reports/signup';
import AffiliateClickOnLinkReport from './reports/click-on-link';
import AffiliateCommissionReport from './reports/commission';
import AffiliateInviteFriends from './invite-friends';

const Affiliate = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}`} to={`${match.url}/dashboard`} />
            <Route path={`${match.url}/dashboard`} component={AffiliateDashboard} />
            <Route path={`${match.url}/commission-pattern`} component={AffiliateCmsPtrn} />
            <Route path={`${match.url}/promotion`} component={AffiliatePromotion} />
            <Route path={`${match.url}/send-mail-report`} component={AffiliateSendMailReport} />
            <Route path={`${match.url}/send-sms-report`} component={AffiliateSendSMSReport} />
            <Route path={`${match.url}/facebook-share-report`} component={AffiliateFacebookShareReport} />
            <Route path={`${match.url}/twitter-share-report`} component={AffiliateTwitterShareReport} />
            <Route path={`${match.url}/signup-report`} component={AffiliateSignupReport} />
            <Route path={`${match.url}/click-on-link-report`} component={AffiliateClickOnLinkReport} />
            <Route path={`${match.url}/commission-report`} component={AffiliateCommissionReport} />
            <Route path={`${match.url}/invite-friends`} component={AffiliateInviteFriends} />
        </Switch>
    </div>
);

export default Affiliate;