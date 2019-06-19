/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    File Comment : Leader Profile Configuration Component
*/

import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";

import LeaderProfileConfigWdgt from "../../../components/SocialProfile/LeaderProfileConfigWdgt";

export default class LeaderProfileConfiguration extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.leaderProfileConfiguration" />}
                    match={this.props.match}
                />
                <JbsCollapsibleCard customClasses="col-lg-10 mx-auto p-0">
                    <LeaderProfileConfigWdgt />
                </JbsCollapsibleCard>
            </div>
        );
    }
}
