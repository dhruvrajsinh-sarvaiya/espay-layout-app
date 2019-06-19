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
import Portfolio from "../../../components/SocialProfile/Portfolio";

export default class MyPortfolio extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.portfolio" />} match={this.props.match} />
                <JbsCollapsibleCard customClasses="col-lg-12 p-0">
                    <Portfolio {...this.props} />
                </JbsCollapsibleCard>
            </div>
        );
    }
}
