/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : wallet sharing list of all available wallets
*/
import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ListWallets from "Components/MyWallets/ListWallets";
import WalletActivityList from "Components/MyWallets/WalletActivityList";

function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

//initial state
const initState = {
    activeTab: 0,
    count: 0,
}

class MyWalletsIndex extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
        // This binding is necessary to make `this` work in the callback
        this.setCounter = this.setCounter.bind(this);
    }
    //tab change handler
    handleChange(value) {
        this.setState({ activeTab: value });
    }
    //index change handler
    handleChangeIndex(index) {
        this.setState({ activeTab: index });
    }

    //change count
    setCounter(count) {
        this.setState({ count: count });
    }

    //render component
    render() {
        const { match } = this.props;
        const { activeTab, count } = this.state;
        return (
            <Fragment>
                <PageTitleBar title={<IntlMessages id="sidebar.myWallets" />} match={match} />
                <JbsCollapsibleCard
                    colClasses="col-sm-12"
                    fullBlock>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={activeTab}
                            onChange={(e, value) => this.handleChange(value)}
                            fullWidth
                            textColor="primary"
                            variant="fullWidth"
                            indicatorColor="primary">
                            <Tab icon={
                                <Fragment>
                                    <Tooltip title="Notifications" placement="bottom">
                                        <IconButton className="" aria-label="bell">
                                            <i className="zmdi zmdi-notifications-active"></i>
                                            {count !== 0 && <Badge color="danger" className="badge-xs badge-top-right jbs-notify">{count}</Badge>}
                                        </IconButton>
                                    </Tooltip>
                                </Fragment>
                            } />
                            <Tab icon={
                                <Fragment>
                                    <Tooltip title="Wallets" placement="bottom">
                                        <IconButton className="" aria-label="wallets">
                                            <i className="zmdi zmdi-balance-wallet"></i>
                                        </IconButton>
                                    </Tooltip>
                                </Fragment>
                            } />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={'x'}
                        index={activeTab}
                        onChangeIndex={(index) => this.handleChangeIndex(index)}>
                        <TabContainer>
                            <WalletActivityList {...this.props} setCount={this.setCounter} />
                        </TabContainer>
                        <TabContainer>
                            <ListWallets {...this.props} />
                        </TabContainer>
                    </SwipeableViews>
                </JbsCollapsibleCard>
            </Fragment>
        );
    }
}

export default MyWalletsIndex