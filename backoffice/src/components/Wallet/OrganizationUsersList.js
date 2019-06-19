import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import IntlMessages from "Util/IntlMessages";
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import { WalletFeedsWidget } from './DashboardWidgets';
import MemberTopup from "Components/MemberTopup/TopupForm";
import EarningLedger from "Routes/earningLedger";


const buttonSizeSmall = {
    maxHeight: "28px",
    minHeight: "28px",
    maxWidth: "28px",
    fontSize: "1rem"
};

const components = {
    MemberTopup: MemberTopup,
    EarningLedger: EarningLedger
};

// dynamic component binding
const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll
    });
};

export default class OrganizationUsersList extends Component {
    state = {
        open: false,
        componentName: ""
    }
    toggleDrawer = () => {
        this.setState({
            open: !this.state.open,
        })
    }
    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    };
    closeAll = () => {
        this.props.closeAll();
        this.setState({
            open: false
        });
    };
    render() {
        const { drawerClose } = this.props;
        return (
            <div className="jbs-page-content">
                <div className="page-title d-flex justify-content-between align-items-center">
                    <h2><IntlMessages id="walletDeshbard.UsersList" /></h2>
                    <div className="page-title-wrap">
                        <Button
                            className="btn-warning text-white mr-10 mb-10"
                            style={buttonSizeSmall}
                            variant="fab"
                            mini
                            onClick={drawerClose}
                        >
                            <i className="zmdi zmdi-mail-reply" />
                        </Button>
                        <Button
                            className="btn-info text-white mr-10 mb-10"
                            style={buttonSizeSmall}
                            variant="fab"
                            mini
                            onClick={this.closeAll}
                        >
                            <i className="zmdi zmdi-home" />
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("MemberTopup")}
                            className="text-dark col-sm-full"
                        >
                            <WalletFeedsWidget
                                feedsTitle={<IntlMessages id="walletDeshbard.MemberTopup" />}
                                feedsCount={0}
                                icon="zmdi zmdi-widgets"
                            />
                            {/*<CardWidgetType2
                                title={<IntlMessages id="walletDeshbard.MemberTopup" />}
                                adminCount={"146"}
                                userCount={"440"}
                            clickEvent={this.onChildClick} />*/}
                        </a>
                    </div>
                    <div className="col-sm-12 col-md-4 w-xs-full">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("EarningLedger")}
                            className="text-dark col-sm-full"
                        >
                            <WalletFeedsWidget
                                feedsTitle={<IntlMessages id="sidebar.earningLedger" />}
                                feedsCount={0}
                                icon="zmdi zmdi-balance-wallet"
                            />
                            {/*<CardWidgetType2
                                title={<IntlMessages id="sidebar.earningLedger" />}
                                adminCount={"146"}
                                userCount={"440"}
                            clickEvent={this.onChildClick} />*/}
                        </a>
                    </div>
                </div>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.toggleDrawer}
                    className="drawer3"
                    level=".drawer2"
                    placement="right"
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.toggleDrawer,
                            this.closeAll
                        )}
                </Drawer>
            </div>
        )
    }
}
