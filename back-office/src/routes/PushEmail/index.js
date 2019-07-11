import React, {Component} from "react";


import {PushEmailForm} from "Components/PushEmail";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";

export default class PushEmail extends Component {
    render() {
        return (
            <div className="data-table-wrapper mb-20">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.PushEmail" />}
                    match={this.props.match}
                />
                <PushEmailForm />
            </div>
        );
    }
}

