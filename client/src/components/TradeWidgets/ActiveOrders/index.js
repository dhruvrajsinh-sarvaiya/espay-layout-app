// Component for Display Active Orders History By:Tejas Date : 13/9/2018

import React, { Component, Fragment } from "react";

// import for Tabs
import { TabPane, Card, Col, Row } from "reactstrap";

// import check box and labels
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

// used for multiple classes with conditionas
import classnames from "classnames";

// import Appbar for display buttons
import AppBar from "@material-ui/core/AppBar";

// Display tables as a Swipable View When Change
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// import My Orders Component
import MyOrders from "./MyOrders";

// import open order component
import OpenOrders from "./OpenOrders";

// function for connect store
import { connect } from "react-redux";

// intl messages for language
import IntlMessages from "Util/IntlMessages";

class ActiveOrder extends Component {
    state = {
        selectedOrderType: 0,
        displayOtherPairs: false,
    };

    // Function for change state for tabs for view By Tejas Date : 13/9/2018
    changeOrderType = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                selectedOrderType: tab
            });
        }
    };

    // Handle Change Tables
    handleChange = (event, value) => {
        this.setState({
            selectedOrderType: value
        });
    };

    // change tab selection
    handleChangeIndex = index => {
        //set tab index value
        this.setState({ selectedOrderType: index });
    };

    // Handle Checkbox for display particular currency Data
    handleChangeDisplayPair = (event) => {
        this.setState({ displayOtherPairs: !this.state.displayOtherPairs });
    };

    // render Component and view for Acive order component
    render() {
        const darkMode = this.props.darkMode;
        return (
            <Fragment>
                <Card>
                    <Row>
                        <Col sm={10} className="p-0 m-0">
                            <AppBar
                                position="static"
                                className={classnames(
                                    darkMode && "darkordertabmenu",
                                    "placeordertabmenu"
                                )}
                            >
                                <Tabs
                                    value={this.state.selectedOrderType}
                                    onChange={this.handleChange}
                                    textColor="primary"
                                    fullWidth
                                >
                                    <Tab
                                        label={
                                            <IntlMessages id="trading.activeorders.label.openorder" />
                                        }
                                        className={classnames(
                                            {
                                                active:
                                                    this.state
                                                        .selectedOrderType ===
                                                    0,
                                            },
                                            ""
                                        )}
                                    />

                                    <Tab
                                        label={
                                            <IntlMessages id="trading.activeorders.label.myorder" />
                                        }
                                        className={classnames(
                                            {
                                                active:
                                                    this.state
                                                        .selectedOrderType ===
                                                    1,
                                            },
                                            ""
                                        )}
                                    />
                                </Tabs>
                            </AppBar>
                        </Col>

                        <Col sm={2} className="p-0 m-0">
                            <div
                                className={classnames(
                                    darkMode && "darkordertabmenu",
                                    "placeordertabmenu"
                                )}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                this.state.displayOtherPairs
                                            }
                                            onChange={
                                                this.handleChangeDisplayPair
                                            }
                                            icon={<CheckBoxOutlineBlankIcon />}
                                            checkedIcon={<CheckBoxIcon />}
                                        />
                                    }
                                    label={
                                        <IntlMessages id="trading.activeorders.hidepairs" />
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                    <SwipeableViews
                        index={this.state.selectedOrderType}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        <TabPane tabId="0">
                            <MyOrders
                                {...this.props}
                                firstCurrency={this.props.firstCurrency}
                                secondCurrency={this.props.secondCurrency}
                                currencyPair={this.props.currencyPair}
                                hubConnection={this.props.hubConnection}
                                hideOtherPairs={this.state.displayOtherPairs}
                            />
                        </TabPane>
                        <TabPane tabId="1">
                            <OpenOrders
                                {...this.props}
                                firstCurrency={this.props.firstCurrency}
                                secondCurrency={this.props.secondCurrency}
                                currencyPair={this.props.currencyPair}
                                hubConnection={this.props.hubConnection}
                                hideOtherPairs={this.state.displayOtherPairs}
                            />
                        </TabPane>
                    </SwipeableViews>
                </Card>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ settings }) => {
    const { darkMode } = settings;
    return { darkMode };
};

// connect action with store for dispatch
export default connect(mapStateToProps)(ActiveOrder);
