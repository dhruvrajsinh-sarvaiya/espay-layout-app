/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    UpdatedBy : Salim Deraiya 24-12-2018
    File Comment : Social Profile Configuration Component
*/
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import SocialSubscriptionPlan from "../../../components/SocialProfile/SocialSubscriptionPlan";

export default class SocialProfileSubscription extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.socialProfileSubscription" />}
                    match={this.props.match}
                />
                <div className="text-center mx-auto">
                    <div className="session-head membershiptitle mt-15 mb-15 text-center">
                        <h2><IntlMessages id="sidebar.socialProfileSubscription" /></h2>
                    </div>
                    <div className="row">
                        <div className="offset-md-3 col-md-6 col-sm-12">
                            <SocialSubscriptionPlan {...this.props} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}