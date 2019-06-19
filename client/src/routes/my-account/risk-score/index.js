/**
 * Created By: Sanjay
 * Create Date:05/02/2019
 * Route For Risk Score Chart
 */
import React, { Component, Fragment } from 'react';
import RiskScore from "Components/MyAccount/RiskScore";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";

export default class index extends Component {
    render() {
        return (
            <Fragment>
                <PageTitleBar title={<IntlMessages id="sidebar.riskScore" />} match={this.props.match} />
                <RiskScore />
            </Fragment>
        )
    }
}
