// Component for Display Open Orders History By:Tejas Date : 13/9/2018

import React from "react";
// import modal dialog boxes
import { Table, Modal, ModalBody, ModalFooter, Button } from "reactstrap";

// import For Display notification
import { NotificationManager } from "react-notifications";

import { Row, Col } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

// Display Alert Box
import { Alert } from "reactstrap";
// import Action For Get Open Order Records
import { doCancelOrder } from "Actions/Trade";

// import scrollbar
import { Scrollbars } from "react-custom-scrollbars";

// import loader for section
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import connect function
import { connect } from "react-redux";

import $ from 'jquery';

const orderTypes = [
    { "type": "LIMIT", "ID": "1" },
    { "type": "MARKET", "ID": "2" },
    { "type": "STOP_Limit", "ID": "4" },
]
class OpenOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeMyOpenOrder: this.props.hasOwnProperty("activeMyOpenOrder")
                ? this.props.activeMyOpenOrder
                : [],
            modal: false,
            cancelAllModal: false,
            modalInfo: -1,
            sectionReload: false,
            sectionReloadCancelAll: false,
            showLoader: true,
            socketData: [],
            cancelOrderSuccess: false,
            displayOtherPairs: false,
            isComponentActive: 1,
            listUpdated: 0,
            activeOrderBitCount: 0,
            cancelOrderBit: "",

        };
        this.openModal = this.openModal.bind(this);
        this.openCancelAllModal = this.openCancelAllModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
    }

    //Open Modal add new Schedule dailog
    openModal(orderID) {
        this.setState({ modalInfo: orderID, modal: true });
    }

    // cancel All Modal and open new dialog
    openCancelAllModal = (e) => {

        if (e.target.value !== '') {

            if (e.target.value > 0) {
                var isOrderType = false;
                if (this.state.activeMyOpenOrder.length > 0) {

                    this.state.activeMyOpenOrder.map((value, key1) => {
                        orderTypes.map((item, key) => {
                            if (item.ID == e.target.value) {
                                if (item.type === value.OrderType) {
                                    isOrderType = true
                                }
                            }
                        })

                    })
                }

                if (isOrderType === true) {
                    this.setState({
                        cancelAllModal: true,
                        cancelOrderBit: e.target.value
                    });
                } else {
                    NotificationManager.error(
                        <IntlMessages id="openorder.ordernotavailable" />
                    );
                    this.setState({
                        cancelAllModal: false,
                        cancelOrderBit: "",
                    });
                }
            }

            if (e.target.value == 0) {
                if (this.state.activeMyOpenOrder.length > 0) {
                    this.setState({
                        cancelAllModal: true,
                        cancelOrderBit: e.target.value
                    })
                } else {
                    NotificationManager.error(
                        <IntlMessages id="openorder.noorder" />
                    );
                    this.setState({
                        cancelAllModal: false,
                        cancelOrderBit: "",
                    })
                }

            }
        }

    }

    // handle close add new Schedule dailog
    handleClose() {
        this.setState({
            modal: false,
            modalInfo: -1,
            cancelOrderSuccess: false,
            sectionReload: false,
            cancelAllModal: false,
            sectionReloadCancelAll: false,
            cancelOrderBit: "",
        });
    }

    // function for cancel order
    cancelOrder(total) {
        this.setState({ sectionReload: true });

        var currrentOrder = {};
        // itrerate object and get particular order
        if (this.state.activeMyOpenOrder) {
            this.state.activeMyOpenOrder.map((value, key) => {
                if (value.Id === this.state.modalInfo) {
                    currrentOrder = value;
                }
            });
        }

        // call action for cancel order
        this.props.doCancelOrder({
            TranNo: currrentOrder.Id,
            CancelAll: 0,
            OrderType: 0,
        });
    }

    handleChangeCancelOrder = (e) => {
        if (this.state.cancelOrderBit === 0) {
            this.setState({ sectionReloadCancelAll: true, cancelOrderBit: "" });
            // call action for cancel order
            this.props.doCancelOrder({ TranNo: 0, CancelAll: 1, OrderType: 0 });
        }

        if (this.state.cancelOrderBit > 0) {
            this.setState({ sectionReloadCancelAll: true, cancelOrderBit: "" });
            this.props.doCancelOrder({
                TranNo: 0,
                CancelAll: 2,
                OrderType: this.state.cancelOrderBit,
            });
        }
    };

    // This will invoke Before component render
    componentWillMount() {
        this.isComponentActive = 1;
    }

    componentWillUnmount() {
        this.isComponentActive = 0;
    }

    // This will Invoke when component will recieve Props or when props changed
    componentWillReceiveProps(nextprops) {
        if (nextprops.cancelAll === 1) {
            this.openCancelAllModal(nextprops.cancelAllValue);
        }

        // open order process
        if (nextprops.activeMyOpenOrder) {
            // set Active My Open Order list if gets from API only
            this.setState({
                activeMyOpenOrder: nextprops.activeMyOpenOrder,
            });
        }

        if (
            nextprops.cancelOrder &&
            (this.state.sectionReload || this.state.sectionReloadCancelAll)
        ) {
            if (
                nextprops.cancelOrder.statusCode === 200 &&
                nextprops.cancelOrder.ErrorCode === 4643
            ) {
                NotificationManager.success(
                    <IntlMessages
                        id={`openorder.cancelorder.message.${
                            nextprops.cancelOrder.ErrorCode
                            }`}
                    />
                );
            }

            this.setState({
                ...this.state,
                showLoader: false,
                sectionReload: false,
                sectionReloadCancelAll: false,
                modalInfo: -1,
                modal: false,
                cancelAllModal: false,
            });
        }
    }

    render() {
        const activeMyOpenData = [];
        if (this.state.activeMyOpenOrder) {
            this.state.activeMyOpenOrder.map((value) => {
                if (this.props.hideOtherPairs) {
                    if (value.PairName === this.props.currencyPair) {
                        activeMyOpenData.push(value);
                    }
                } else {
                    activeMyOpenData.push(value);
                }
            });
        }

        return (
            <div className="table-responsive-design" style={{ width: "100%" }}>
                <Table className="openorder m-0 p-0">
                    <thead>
                        <tr className="bg-light">
                            <th>
                                {" "}
                                {
                                    <IntlMessages id="trading.activeorders.label.pair" />
                                }
                            </th>
                            <th className="numeric">
                                {" "}
                                {
                                    <IntlMessages id="trading.activeorders.label.type" />
                                }
                            </th>
                            <th>
                                {
                                    <IntlMessages id="trading.activeorders.label.orderType" />
                                }
                            </th>
                            <th className="numeric">
                                {" "}
                                {
                                    <IntlMessages id="trading.activeorders.label.price" />
                                }
                            </th>
                            <th className="numeric">
                                {" "}
                                {
                                    <IntlMessages id="trading.activeorders.label.amount" />
                                }
                            </th>
                            <th className="numeric">
                                {" "}
                                {<IntlMessages id="sidebar.settleAmount" />}
                            </th>
                            <th className="numeric">
                                {" "}
                                {
                                    <IntlMessages id="trading.activeorders.label.date" />
                                }
                            </th>
                            <th className="numeric">
                                {" "}
                                {<IntlMessages id="widgets.action" />}
                            </th>
                        </tr>
                    </thead>
                </Table>
                <Scrollbars
                    className="jbs-scroll"
                    autoHeight
                    autoHeightMin={225}
                    autoHeightMax={225}
                    autoHide
                >
                    {this.props.loading && <JbsSectionLoader />}
                    <Table className="openorder m-0 p-0">
                        <tbody>
                            {activeMyOpenData.length !== 0 ? (
                                activeMyOpenData.map((value, key) => {
                                    return (
                                        <tr
                                            style={{ cursor: "pointer" }}
                                            key={key}
                                            onClick={() =>
                                                this.openModal(value.Id)
                                            }
                                        >
                                            <td className="text-center">
                                                {value.PairName !== null
                                                    ? value.PairName.replace(
                                                        "_",
                                                        "/"
                                                    )
                                                    : ""}
                                            </td>
                                            <td
                                                className={
                                                    value.Type === "BUY"
                                                        ? "text-success text-center"
                                                        : "text-danger text-center"
                                                }
                                            >
                                                {value.Type === "BUY" ? (
                                                    <IntlMessages id="sidebar.openOrders.filterLabel.type.buy" />
                                                ) : (
                                                        <IntlMessages id="sidebar.openOrders.filterLabel.type.sell" />
                                                    )}
                                            </td>
                                            <td className="text-center">
                                                {value.OrderType === "LIMIT" ? (
                                                    <IntlMessages id="trading.placeorder.label.limit" />
                                                ) : (
                                                        ""
                                                    )}
                                                {value.OrderType ===
                                                    "MARKET" ? (
                                                        <IntlMessages id="trading.placeorder.label.market" />
                                                    ) : (
                                                        ""
                                                    )}
                                                {value.OrderType ===
                                                    "STOP_Limit" ? (
                                                        <IntlMessages id="trading.placeorder.label.stoplimit" />
                                                    ) : (
                                                        ""
                                                    )}
                                                {value.OrderType === "SPOT" ? (
                                                    <IntlMessages id="trading.placeorder.label.spot" />
                                                ) : (
                                                        ""
                                                    )}
                                            </td>
                                            <td className="text-center">
                                                {value.Price === 0 ? (
                                                    <IntlMessages id="trading.placeorder.label.market" />
                                                ) : (
                                                        parseFloat(
                                                            value.Price
                                                        ).toFixed(8)
                                                    )}
                                            </td>
                                            <td className="text-center">
                                                {parseFloat(
                                                    value.Amount
                                                ).toFixed(8)}
                                            </td>
                                            <td className="text-center">
                                                {parseFloat(
                                                    value.SettledQty
                                                ).toFixed(8)}
                                            </td>
                                            <td className="text-center">
                                                {
                                                    value.TrnDate.replace(
                                                        "T",
                                                        " "
                                                    ).split(".")[0]
                                                }
                                            </td>
                                            <td
                                                className="text-center text-danger"
                                                onClick={() =>
                                                    this.openModal(value.Id)
                                                }
                                            >
                                                <IntlMessages id="button.cancel" />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                    <tr>
                                        <td>
                                            <Row className="justify-content-center m-0">
                                                <Col
                                                    className="text-center m-0"
                                                    sm={12}
                                                >
                                                    <span>
                                                        <i
                                                            className="zmdi zmdi-view-list-alt"
                                                            style={{
                                                                fontSize: "80px",
                                                            }}
                                                        />
                                                        <br />
                                                    </span>
                                                </Col>

                                                <Col
                                                    className="text-center text-danger m-0 fs-32"
                                                    sm={12}
                                                    style={{ fontSize: "18px" }}
                                                >
                                                    <IntlMessages id="trading.activeorders.label.nodata" />
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                </Scrollbars>

                <Modal
                    isOpen={this.state.cancelAllModal}
                    className="myorderviewcancelall"
                >
                    <h1 className="text-center mt-10">
                        {
                            <IntlMessages id="trading.activeorders.cancelorder.title" />
                        }
                    </h1>

                    {this.props.cancelOrderLoading && <JbsSectionLoader />}

                    <ModalBody>
                        {this.state.cancelOrderBit !== "" && (
                            <h3>
                                <IntlMessages
                                    id={
                                        `openorder.cancelsure.` +
                                        this.state.cancelOrderBit
                                    }
                                />
                            </h3>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="raised"
                            color="primary"
                            className="text-white"
                            onClick={() => this.handleChangeCancelOrder()}
                        >
                            <span>
                                <IntlMessages id="trading.activeorders.cancelorder.button.cancelorder" />
                            </span>
                        </Button>
                        <Button
                            variant="raised"
                            onClick={() => this.handleClose()}
                            className="btn-danger text-white"
                        >
                            <span>
                                <IntlMessages id="sidebar.btnClose" />
                            </span>
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modal} className="myorderview">
                    <h1 className="text-center mt-10">
                        {
                            <IntlMessages id="trading.activeorders.cancelorder.title" />
                        }
                    </h1>

                    {this.props.cancelOrderLoading && <JbsSectionLoader />}

                    <ModalBody>
                        <div className="table-responsive">
                            <Table className="table m-0 p-0 hover bordered striped">
                                <thead>
                                    <tr className="bg-primary text-white">
                                        <th className="text-center">
                                            {" "}
                                            {
                                                <IntlMessages id="trading.activeorders.label.pair" />
                                            }
                                        </th>
                                        <th className="numeric text-center">
                                            {" "}
                                            {
                                                <IntlMessages id="trading.activeorders.label.type" />
                                            }
                                        </th>
                                        <th className="numeric text-center">
                                            {" "}
                                            {
                                                <IntlMessages id="trading.activeorders.label.price" />
                                            }
                                        </th>
                                        <th className="numeric text-center">
                                            {" "}
                                            {
                                                <IntlMessages id="trading.activeorders.label.amount" />
                                            }
                                        </th>
                                        <th className="numeric text-center">
                                            {" "}
                                            {
                                                <IntlMessages id="trading.activeorders.label.date" />
                                            }
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeMyOpenData.length ? (
                                        activeMyOpenData.map(
                                            (value, key) =>
                                                value.Id ===
                                                this.state.modalInfo && (
                                                    <tr key={key}>
                                                        <td className="text-center">
                                                            {value.PairName !==
                                                                null
                                                                ? value.PairName.replace(
                                                                    "_",
                                                                    "/"
                                                                )
                                                                : ""}
                                                        </td>
                                                        <td
                                                            className={
                                                                value.Type ===
                                                                    "BUY"
                                                                    ? "text-success text-center"
                                                                    : "text-danger text-center"
                                                            }
                                                        >
                                                            {value.Type ===
                                                                "BUY" ? (
                                                                    <IntlMessages id="sidebar.openOrders.filterLabel.type.buy" />
                                                                ) : (
                                                                    <IntlMessages id="sidebar.openOrders.filterLabel.type.sell" />
                                                                )}
                                                        </td>
                                                        <td className="text-center">
                                                            {parseFloat(
                                                                value.Price
                                                            ).toFixed(8)}
                                                        </td>
                                                        <td className="text-center">
                                                            {parseFloat(
                                                                value.Amount
                                                            ).toFixed(8)}
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                value.TrnDate.replace(
                                                                    "T",
                                                                    " "
                                                                ).split(".")[0]
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                        )
                                    ) : (
                                            <tr>
                                                <td colSpan="5">
                                                    <Alert
                                                        color="danger"
                                                        className="text-center fs-32"
                                                    >
                                                        <IntlMessages id="trading.activeorders.label.nodata" />
                                                    </Alert>
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </Table>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="raised"
                            color="primary"
                            className="text-white"
                            onClick={() => this.cancelOrder(activeMyOpenData)}
                        >
                            <span>
                                <IntlMessages id="trading.activeorders.cancelorder.button.cancelorder" />
                            </span>
                        </Button>
                        <Button
                            variant="raised"
                            onClick={() => this.handleClose()}
                            className="btn-danger text-white"
                        >
                            <span>
                                <IntlMessages id="sidebar.btnClose" />
                            </span>
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

// Set Props when actions are dispatch
const mapStateToProps = (state) => ({
    loading: state.openOrder.loading,
    cancelOrderLoading: state.openOrder.cancelOrderLoading,
    cancelOrder: state.openOrder.cancelOrder,
    activeOrderBit: state.openOrder.activeOrderBit,
});

// connect action with store for dispatch
export default connect(
    mapStateToProps,
    {
        doCancelOrder,
    }
)(OpenOrder);
