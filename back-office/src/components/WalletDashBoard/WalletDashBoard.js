import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import Drawer from "rc-drawer";
import { Row, Col } from "reactstrap";
import { SimpleCard } from "./DashboardWidgets";
import EarningLedger from "Routes/earningLedger";
import StackingFees from "Routes/stacking-fees";
import TransactionRetry from "Routes/transaction-retry";
import TransferIn from "Routes/transfer-in";
import TransferOut from "Routes/transfer-out";
import DepositReport from "Routes/deposit-report";
import PaymentMethods from "Routes/payment-methods";
import TransferInOut from "Routes/transfer-in-out";
import DeamonBalances from "Routes/deamon-balances";
import WithdrawReport from "Routes/withdraw-report";

const components = {
    EarningLedger: EarningLedger,
    StackingFees: StackingFees,
    TransactionRetry: TransactionRetry,
    TransferIn: TransferIn,
    TransferOut: TransferOut,
    DepositReport: DepositReport,
    PaymentMethods: PaymentMethods,
    TransferInOut: TransferInOut,
    DeamonBalances: DeamonBalances,
    WithdrawReport: WithdrawReport,
};

const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], { props, drawerClose, closeAll });
};

export default class WalletDashBoard extends Component {

    state = {
        componentName: "",
        open: false
    };

    onClick = () => {
        this.setState({ open: this.state.open ? false : true });
    };

    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: this.state.open ? false : true
        });
    };

    closeAll = () => {
        this.setState({ open: false });
    };

    render() {

        return (
            <Fragment>
                <Row>
                    <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("TransactionRetry")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.transactionRetry" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("DepositReport")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.depositTransaction" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                    <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("PaymentMethods")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.paymentMethod" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                    <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("TransferInOut")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.transferInOut" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("DeamonBalances")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.deamonBalances" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                    <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("WithdrawReport")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.withdrawalTransactions" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                </Row>
                <Drawer
                    width="100%"
                    handler={false}
                    open={this.state.open}
                    onMaskClick={this.onClick}
                    className="drawer1"
                    placement="right"
                >
                    {this.state.componentName !== "" &&
                        dynamicComponent(
                            this.state.componentName,
                            this.props,
                            this.onClick,
                            this.closeAll
                        )}
                </Drawer>
            </Fragment>
        );
    }
}
