import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import Drawer from "rc-drawer";
import { Row, Col } from "reactstrap";
import { SimpleCard } from "./DashboardWidgets";
// import ChargeCollect from "Routes/charges-collected";
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
// import AssetReport from "Routes/asset-report";
// import DaemonAddresses from "Routes/daemon-addresses";
// import WalletList from "Components/Wallet/WalletList";
// import TransactionPolicyList from "Components/TransactionPolicy/TransactionPolicyList";
// import CommisssionTypeDetail from "Components/CommisssionType/CommisssionTypeDetail";
// import WalletUsagePolicy from "Components/WalletUsagePolicy/WalletUsagePolicy";
// import TradeRoute from "Components/TradeRoute/TradeRoute";
// import WithdrawRoute from "Components/WithdrawRoute/WithdrawRoute";
// import ChargeTypeDetail from "Components/ChargeTypeDetail/ChargeTypeDetail";

const components = {
    // ChargeCollect: ChargeCollect,
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
    // AssetReport: AssetReport,
    // DaemonAddresses: DaemonAddresses,
    // WalletList: WalletList,
    // TransactionPolicyList: TransactionPolicyList,
    // TradeRoute: TradeRoute,
    // WithdrawRoute: WithdrawRoute,
    // CommisssionTypeDetail: CommisssionTypeDetail,
    // WalletUsagePolicy: WalletUsagePolicy,
    // ChargeTypeDetail: ChargeTypeDetail
};

const dynamicComponent = (TagName, props, drawerClose, closeAll) => {
    return React.createElement(components[TagName], {
        props,
        drawerClose,
        closeAll
    });
};

export default class WalletDashBoard extends Component {
    state = {
        componentName: "",
        open: false
    };
    onClick = () => {
        this.setState({
            open: !this.state.open
        });
    };
    showComponent = componentName => {
        this.setState({
            componentName: componentName,
            open: !this.state.open
        });
    };
    closeAll = () => {
        this.setState({
            open: false
        });
    };
    render() {
        return (
            <Fragment>
                {/* <Row> */}
                    {/*<Col md="4" sm="12">
            <a
              href="javascript:void(0)"
              onClick={e => this.showComponent("ChargeCollect")}
              className="text-dark col-sm-full"
            >
              <SimpleCard
                title={<IntlMessages id="sidebar.chargeCollected" />}
                icon="zmdi zmdi-account-circle"
                bgClass="bg-dark"
                clickEvent={this.onClick}
              />
            </a>
          </Col>
          <Col md="4" sm="12">
            <a
              href="javascript:void(0)"
              onClick={e => this.showComponent("EarningLedger")}
              className="text-dark col-sm-full"
            >
              <SimpleCard
                title={<IntlMessages id="sidebar.earningLedger" />}
                icon="zmdi zmdi-account-circle"
                bgClass="bg-dark"
                clickEvent={this.onClick}
              />
            </a>
          </Col>*/}
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("TradeRoute")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.tradeRoute" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("WithdrawRoute")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.withdrawRoute" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                    <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("StackingFees")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.tradingfees" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                </Row> */}
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
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("TransferIn")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.internalTransfer" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col>
                    <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("TransferOut")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="sidebar.externalTransfer" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
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
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("AssetReport")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="table.adminAsset" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
                </Row>
                <Row>
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("DaemonAddresses")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="wallet.DATitle" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("WalletList")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="wallet.walletTitle" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("TransactionPolicyList")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="walletDashboard.transactionPolicy" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
                </Row>
                <Row>
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("CommisssionTypeDetail")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="walletDashboard.CommissionType" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("WalletUsagePolicy")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="walletDashboard.WalletUsagePolicy" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
                    {/* <Col md="4" sm="12">
                        <a
                            href="javascript:void(0)"
                            onClick={e => this.showComponent("ChargeTypeDetail")}
                            className="text-dark col-sm-full"
                        >
                            <SimpleCard
                                title={<IntlMessages id="walletDashboard.ChargeTypeDetail" />}
                                icon="zmdi zmdi-account-circle"
                                bgClass="bg-dark"
                                clickEvent={this.onClick}
                            />
                        </a>
                    </Col> */}
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
