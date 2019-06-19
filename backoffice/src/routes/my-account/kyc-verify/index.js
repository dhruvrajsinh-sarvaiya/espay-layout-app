/**
 * List Roles
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// jbs collapsible card
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { ListKYCVerifyWdgt } from "Components/MyAccount";

export default class ListKYCVerify extends Component {
    render() {
        return (
            <div className="mb-20" > 
                <PageTitleBar title={<IntlMessages id="sidebar.kycVerify" />} match={this.props.match} />                             
                <ListKYCVerifyWdgt />                
            </div>
        );
    }
}