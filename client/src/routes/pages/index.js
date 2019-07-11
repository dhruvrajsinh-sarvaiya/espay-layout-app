/**
 * Pages Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncFaqComponent,
    //Addedby Kushal
    AsyncAboutUsComponent,
    AsyncTermsOfServiceComponent,
    AsyncPrivacyPolicyComponent,
    AsyncLegalStatementComponent,
    AsyncRefundPolicyComponent,
    AsyncAPIComponent,
    AsyncApplicationCenterComponent,
    AsyncCoinListComponent,
    AsyncCoinInfoComponent,
    AsyncFeesComponent,
    AsyncNewsComponent,
    AsyncContactUsComponent,
    AsyncSurveyComponent,
    //Added by Jayesh 
    AsyncHelpCenterComponent,
    AsyncHelpCenterInfoComponent,
    AsyncCoinListRequestComponent,
} from 'Components/AsyncComponent/AsyncComponent';

const Pages = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/about-us`} />

            <Route path={`${match.url}/about-us`} component={AsyncAboutUsComponent} />
            <Route path={`${match.url}/faq`} component={AsyncFaqComponent} />
            <Route path={`${match.url}/terms-of-service`} component={AsyncTermsOfServiceComponent} />
            <Route path={`${match.url}/privacy-policy`} component={AsyncPrivacyPolicyComponent} />
            <Route path={`${match.url}/legal-statement`} component={AsyncLegalStatementComponent} />
            <Route path={`${match.url}/refund-policy`} component={AsyncRefundPolicyComponent} />
            <Route path={`${match.url}/api`} component={AsyncAPIComponent} />
            <Route path={`${match.url}/application-center`} component={AsyncApplicationCenterComponent} />
            <Route path={`${match.url}/coin-list`} component={AsyncCoinListComponent} />
            <Route path={`${match.url}/coin-info`} component={AsyncCoinInfoComponent} />
            <Route path={`${match.url}/fees`} component={AsyncFeesComponent} />
            <Route path={`${match.url}/news`} component={AsyncNewsComponent} />
            <Route path={`${match.url}/contact-us`} component={AsyncContactUsComponent} />
            <Route path={`${match.url}/survey`} component={AsyncSurveyComponent} />
            <Route path={`${match.url}/helpcenter`} component={AsyncHelpCenterComponent} />
            <Route path={`${match.url}/helpcenter-info`} component={AsyncHelpCenterInfoComponent} />
            <Route path={`${match.url}/coin-list-request`} component={AsyncCoinListRequestComponent} />
        </Switch>
    </div>
);

export default Pages;
