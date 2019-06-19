/* 
    Developer : Nishant Vadgama
    Date : 25-09-2018
    File Commet : Configuration and Preference setting page
*/
import React, { Component } from "react";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { injectIntl } from 'react-intl';
//import limit controll configuration
import LimitsControl from "Components/LimitsControl/LimitsControl";
function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

class ConfigurationAndPreference extends Component {
    state = {
        activeIndex: 0
    };
    handleChange(event, value) {
        this.setState({ activeIndex: value });
    }
    handleChangeIndex(index) {
        this.setState({ activeIndex: index });
    }
    render() {
        return (
            <div className="ConfigurationAndPreference todo-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="wallet.ConfigurationAndPreference" />}
                    match={this.props.match}
                />
                <JbsCollapsibleCard
                    colClasses="col-sm-12 col-md-12 col-lg-12"
                    fullBlock
                    customClasses="overflow-hidden"
                >
                    <AppBar position="static" color="default">
                        <Tabs
                            value={this.state.activeIndex}
                            onChange={(e, value) => this.handleChange(e, value)}
                            fullWidth
                        >
                            <Tab
                                label={<IntlMessages id="wallet.CFLimitControl" />}
                                className="font-weight-bold"
                            />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={"x"}
                        index={this.state.activeIndex}
                        onChangeIndex={index => this.handleChangeIndex(index)}
                    >
                        <TabContainer>
                            <LimitsControl {...this.props} />
                        </TabContainer>
                    </SwipeableViews>
                </JbsCollapsibleCard>
            </div>
        );
    }
}

export default injectIntl(ConfigurationAndPreference);
