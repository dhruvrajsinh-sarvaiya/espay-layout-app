/**
 * Author : jayshreeba Gohil
 * Created : 03/06/2019
 *  Arbitrage Open Order
 * update by : devang parekh (11-6-2019)
 * Reason: for handling signalr & api data from parent component because of unmount issue
 * 
 * * changes by Tejas 12/6/2019
*/

import React, { Component, Fragment } from "react";
// used for connect store
import { connect } from "react-redux";

// import for design 
import { Table, Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

// import For Display notification
import { NotificationManager } from "react-notifications";

import { Tabs, Tab, TabList } from "react-web-tabs";

// intl messages for language conversion
import IntlMessages from "Util/IntlMessages";

// import scrollbar
import { Scrollbars } from "react-custom-scrollbars";

//added by Tejas 14/6/2019
import JbsLoader from "Components/JbsPageLoader/JbsLoader"

// method for cancel order process
import { doCancelOrderArbitrage } from 'Actions/Arbitrage';

import { withRouter } from 'react-router-dom';

const orderTypes = [
    { "type": "LIMIT", "ID": "1" },
    { "type": "MARKET", "ID": "2" },
    // { "type": "SPOT", "ID": "3" },
    { "type": "STOP_Limit", "ID": "4" },
]



//class for Open order
class OpenOrder extends Component {

    constructor(props) {
        super(props);

        this.state = {
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
            exchangeName: "all"
        };
    }

    //Open Modal add new Schedule dailog
    openModal = (key) => {

        this.setState({ modalInfo: key, modal: true });
    }

    // cancel All Modal and open new dialog
    openCancelAllModal = (e) => {

        if (e.target.value !== '') {

            if (e.target.value > 0) {
                var isOrderType = false;
                if (this.state.OpenOrderList.length > 0) {

                    this.state.OpenOrderList && this.state.OpenOrderList.map((value) => {
                        orderTypes.map((item) => {
                            if (item.ID === e.target.value) {
                                if (item.type === value.OrderType) {
                                    isOrderType = true
                                }
                            }
                            return [];
                        })
                        return [];
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
                if (this.state.OpenOrderList.length > 0) {
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
    handleClose = () => {
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
    cancelOrder = (total) => {

        this.setState({ sectionReload: true });

        var currrentOrder = {};
        // itrerate object and get particular order
        if (this.props.OpenOrderList && this.props.OpenOrderList.length) {
            this.props.OpenOrderList.map((value, key) => {
                if (key === this.state.modalInfo) {
                    currrentOrder = value;
                }
            });
        }

        // call action for cancel order

        this.props.doCancelOrderArbitrage({
            TranNo: currrentOrder.Id,
            CancelAll: 0,
            OrderType: 1,
        });
    }

    handleChangeCancelOrder = (e) => {
        if (this.state.cancelOrderBit === 0) {
            this.setState({ sectionReloadCancelAll: true, cancelOrderBit: "" });
            // call action for cancel order
            this.props.doCancelOrderArbitrage({ TranNo: 0, CancelAll: 1, OrderType: 0 });
        }

        if (this.state.cancelOrderBit > 0) {
            this.setState({ sectionReloadCancelAll: true, cancelOrderBit: "" });
            this.props.doCancelOrderArbitrage({
                TranNo: 0,
                CancelAll: 2,
                OrderType: this.state.cancelOrderBit,
            });
        }
    };

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

        if (nextprops.cancelOrder && (this.state.sectionReload || this.state.sectionReloadCancelAll)) {

            if (nextprops.cancelOrder && nextprops.cancelOrder.statusCode === 200 && nextprops.cancelOrder.ErrorCode === 4643) {

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
                //cancelOrderSuccess:true
            });

        }
    }

    tabClick(exchangeName) {
        this.setState({ exchangeName: exchangeName })
    }

    render() {

        // for dynamic tabs
        const uniqueTags = [];
        // for count no. of records in tab
        const countTags = [];
        var k;
        this.props.OpenOrderList.map((item) => {
            if (uniqueTags.indexOf(item.ExchangeName) === -1) {
                uniqueTags.push(item.ExchangeName)
            }
        });

        uniqueTags.map((i) => {
            k = 1;
            this.props.OpenOrderList.map((item) => {
                if (uniqueTags[i] === item.ExchangeName) {
                    countTags[i] = k++;
                }
                return [];
            });
            return [];
        });

        return (
            <Fragment>

                <div className="row">
                    <div className="col-md-10">
                        {<Tabs className="arbitrage_tabs_try">
                            <TabList className="tab_list_try clearfix">
                                <Tab tabFor="all" onClick={() => this.tabClick("all")} className="d-flex">
                                    {/* ALL  */}
                                    <IntlMessages id="sidebar.arbitrageAll" />
                                    &nbsp;
                                    ({this.props.OpenOrderList.length})</Tab>
                                {
                                    uniqueTags.map((item, key) =>
                                        <Tab className="d-flex" key={key} tabFor={item} onClick={() => this.tabClick(item)}>{item} ({countTags[key]})</Tab>
                                    )
                                }
                            </TabList>
                        </Tabs>}
                    </div>

                    <div className="col-md-2 text-right arbitrage-btnmore">
                        <a href="javascript:void(0)"
                            onClick={() => { this.props.history.push('/app/arbitrage/open-order') }}
                        >
                            <IntlMessages id="sidebar.apiplan.button.viewmore" />
                        </a>
                    </div>
                </div>
                <Scrollbars
                    className="jbs-scroll"
                    autoHeight
                    autoHeightMin={220}
                    autoHeightMax={220}
                    autoHide
                >
                    {this.props.openOrderListLoading && <JbsLoader />}
                    {this.props.isShowTitle && <h2>
                        {/* Open Order */}
                        <IntlMessages id="sidebar.arbitrageOpenOrder" />
                    </h2>}
                    <table className="opn_ord_list striped highlight">
                        <thead>
                            <tr>
                                <th>
                                    <IntlMessages id="trading.currencypair.label.pair" />
                                </th>

                                <th>
                                    <IntlMessages id="trading.history.label.Side" />
                                </th>

                                <th>
                                    <IntlMessages id="tradesummary.tradeSummaryColumn.orderType" />
                                </th>

                                <th>
                                    <IntlMessages id="myaccount.tradeSummaryColumn.exchange" />
                                </th>

                                <th>
                                    <IntlMessages id="trading.orders.label.amount" />
                                </th>

                                <th>
                                    <IntlMessages id="trading.orders.label.price" />
                                </th>

                                <th>
                                    <IntlMessages id="trading.activeorders.label.date" />
                                </th>

                                <th>
                                    <IntlMessages id="my_account.deviceWhitelisting.colAction" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.OpenOrderList && this.props.OpenOrderList.length > 0 ?
                                this.props.OpenOrderList.map((list, key) => {

                                    if (list.ExchangeName === this.state.exchangeName || this.state.exchangeName === 'all') {

                                        return (
                                            <tr key={key}>
                                                <td>{list.PairName.split("_")[0] + " / " + list.PairName.split("_")[1]}</td>
                                                <td className={list.Type === "BUY" ? "text-success" : list.Type === "SELL" && "text-danger"}>
                                                    {list.Type}</td>
                                                <td>{list.OrderType}</td>
                                                <td>{list.ExchangeName}</td>
                                                <td>{list.Amount.toFixed(8)}</td>
                                                <td>{list.Price.toFixed(8)}</td>
                                                <td>{list.TrnDate.replace('T', ' ').split('.')[0]}</td>
                                                <td>
                                                    <a href="javascript:void(0);" onClick={() => this.openModal(key)} className="order_tbl_lnk"> <i className="zmdi zmdi-close zmdi-hc-sm" /> </a>
                                                </td>
                                            </tr>
                                        )

                                    }

                                })
                                :

                                <tr><td colSpan="8"><IntlMessages id="trading.activeorders.label.nodata" /></td></tr>
                            }
                        </tbody>
                    </table>
                    <Modal
                        isOpen={this.state.cancelAllModal}
                        className="myorderviewcancelall"
                    >
                        <h1 className="text-center mt-10">
                            {
                                <IntlMessages id="trading.activeorders.cancelorder.title" />
                            }
                        </h1>

                        {this.props.cancelOrderLoader && <JbsLoader />}

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

                        {this.props.cancelOrderLoader && <JbsLoader />}

                        <ModalBody>
                            <div className="table-responsive">
                                <Table className="table m-0 p-0 hover bordered striped">
                                    <thead>
                                        <tr className="bg-primary text-white">
                                            <th>
                                                <IntlMessages id="trading.currencypair.label.pair" />
                                            </th>
                                            <th>
                                                <IntlMessages id="trading.history.label.Side" />
                                            </th>

                                            <th>
                                                <IntlMessages id="tradesummary.tradeSummaryColumn.orderType" />
                                            </th>
                                            <th>
                                                <IntlMessages id="myaccount.tradeSummaryColumn.exchange" />
                                            </th>
                                            <th>
                                                <IntlMessages id="trading.orders.label.amount" />
                                            </th>

                                            <th>
                                                <IntlMessages id="trading.orders.label.price" />
                                            </th>

                                            <th>
                                                <IntlMessages id="trading.activeorders.label.date" />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.OpenOrderList && this.props.OpenOrderList.length ? (
                                            this.props.OpenOrderList.map((value, key) =>
                                                key === this.state.modalInfo && (
                                                    <tr key={key}>
                                                        <td>{value.PairName}</td>
                                                        <td className={value.Type === "BUY" ? "text-success" : value.Type === "SELL" && "text-danger"}>
                                                            {value.Type}</td>
                                                        <td>{value.OrderType}</td>
                                                        <td>{value.ExchangeName}</td>
                                                        <td>{value.Amount.toFixed(8)}</td>
                                                        <td>{value.Price.toFixed(8)}</td>
                                                        <td>{value.TrnDate.replace('T', ' ').split('.')[0]}</td>
                                                    </tr>
                                                )
                                            )
                                        ) : (

                                                <tr><td colSpan="7"><IntlMessages id="trading.activeorders.label.nodata" /></td></tr>

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
                                onClick={() => this.cancelOrder(this.props.OpenOrderList)}
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

                </Scrollbars>
            </Fragment>
        );
    }
}

OpenOrder.defaultProps = {
    isShowTitle: true
}
const mapStateToProps = ({ arbitrageReports }) => {

    const {
        openOrderListLoading,
        cancelOrderLoader,
        openOrderList,
        cancelOrder,
        cancelOrderError
    } = arbitrageReports;

    return {
        openOrderListLoading,
        cancelOrderLoader,
        openOrderList,
        cancelOrder,
        cancelOrderError
    };
}
export default connect(mapStateToProps, {
    doCancelOrderArbitrage
})(withRouter((OpenOrder)));
