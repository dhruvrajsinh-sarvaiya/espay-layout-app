/**
 * Created By: Sanjay
 * Create Date:04/02/2019
 * Route For Chart in MyAccount Score Chart
 */
import React, { Component, Fragment } from 'react'
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import ChartAccount from "Components/MyAccount/ChartAccount";

export default class index extends Component {
    render() {
        return (
            <Fragment>
                <PageTitleBar title={<IntlMessages id="sidebar.chartAccount" />} match={this.props.match} />
                <ChartAccount />
            </Fragment>
        )
    }
}
