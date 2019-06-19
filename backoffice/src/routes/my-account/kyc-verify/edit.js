/**
 * List Roles
 */
import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// intl messages
import IntlMessages from "Util/IntlMessages";

import { EditKYCVerifyWdgt } from "Components/MyAccount";

export default class EditKYCVerify extends Component {
    render() {
        return (
            <div className="my-account-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.editKyc" />} match={this.props.match} />
                <EditKYCVerifyWdgt />
            </div>
        );
    }
}