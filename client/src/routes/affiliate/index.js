/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import AffiliateDashboard from './dashboard';
import AffiliateCmsPtrn from './commission-pattern';
import AffiliateSendMailReport from './reports/AffiliateSendMailReport';
import AffiliateSendSMSReport from './reports/AffiliateSendSMSReport';
import AffiliateFacebookShareReport from './reports/AffiliateFacebookShareReport';
import AffiliateTwitterShareReport from './reports/AffiliateTwitterShareReport';
import AffiliateSignupReport from './reports/AffiliateSignupReport';
import AffiliateClickOnLinkReport from './reports/AffiliateClickOnLinkReport';
import AffiliateCommissionReport from './reports/AffiliateCommissionReport';
import AffiliateInviteFriends from './invite-friends';

const Affiliate = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}`} to={`${match.url}/dashboard`} />
            <Route path={`${match.url}/dashboard`} component={AffiliateDashboard} />
            <Route path={`${match.url}/commission-pattern`} component={AffiliateCmsPtrn} />
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