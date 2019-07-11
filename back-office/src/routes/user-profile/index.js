/* 
    Developer : Salim Deraiya
    Date : 28/03/2019
    File Comment : User Profile Routes
*/

import React, { Component } from "react";
import ViewUserProfile from "Components/MyAccount/Dashboards/ViewUserProfile";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";

export default class UserProfile extends Component {
    render() {
        return (
            <div className="data-table-wrapper mb-20">
                <PageTitleBar title={<IntlMessages id="sidebar.userProfile" />} match={this.props.match} />
                <ViewUserProfile {...this.props} />
            </div>
        );
    }
}