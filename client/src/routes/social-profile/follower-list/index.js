/* 
    Developer : Salim Deraiya
    Date : 22-01-2019
    File Comment : Follower List Component
*/
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { FollowerListDataTbl } from "Components/SocialProfile";

export default class LeaderList extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.followerList" />} match={this.props.match} />
                <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                    <FollowerListDataTbl {...this.props} />
                </JbsCollapsibleCard>
            </div>
        );
    }
}