/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    File Comment : Follower Profile Configuration Component
*/
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import FollowerProfileConfigWdgt from "../../../components/SocialProfile/FollowerProfileConfigWdgt";

export default class LeaderProfileConfiguration extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.followerProfileConfiguration" />}
                    match={this.props.match}
                />
                <JbsCollapsibleCard customClasses="col-sm-8 col-lg-8 mx-auto p-0">
                    <FollowerProfileConfigWdgt />
                </JbsCollapsibleCard>
            </div>
        );
    }
}
