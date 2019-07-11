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
import MyWatchListTbl from "../../../components/SocialProfile/MyWatchListTbl";

export default class MyWatchlists extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.watchlists" />} match={this.props.match} />
                <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                    <MyWatchListTbl {...this.props} />
                </JbsCollapsibleCard>
            </div>
        );
    }
}
