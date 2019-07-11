// /**
//  * CreatedBy : Kevin Ladani
//  * Date : 17/12/2018
//  */
// /**
//  * Social Trading Policy
//  */

import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";


import { LeaderProfileWdgt, FollowerProfileWdgt } from "Components/SocialProfile";

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: 6 * 2 }}>
            {children}
        </Typography>
    );
}

export default class EditProfileWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            exchange: "",
            open: false
        };
        this.OnSelectChange = this.OnSelectChange.bind(this);
    }

    OnSelectChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeIndex(index) {
        this.setState({ activeIndex: index });
    }

    handleChange(event, value) {
        this.setState({ activeIndex: value });

    }

    render() {
        const { activeIndex } = this.state;
        return (
            <div className="my-account-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.socialTradingPolicy" />}
                    match={this.props.match}
                />
                <JbsCollapsibleCard >
                    <div className="col-md-12 SocialProfileTab">
                        <Tabs textColor="primary" indicatorColor="primary" value={this.state.activeIndex} onChange={(e, value) => this.handleChange(e, value)}>
                            <Tab className="btn col-md-2" label={
                                <h3><IntlMessages id="sidebar.tabLeader" /></h3>
                            } />
                            <Tab className="btn col-md-2" label={
                                <h3><IntlMessages id="sidebar.tabFollower" /></h3>
                            } />

                        </Tabs>
                        {activeIndex === 0 && (
                            <TabContainer>
                                <LeaderProfileWdgt />
                            </TabContainer>
                        )}
                        {activeIndex === 1 && (
                            <TabContainer>
                                <FollowerProfileWdgt />
                            </TabContainer>
                        )}
                    </div>
                </JbsCollapsibleCard>
            </div>
        );
    }
}
