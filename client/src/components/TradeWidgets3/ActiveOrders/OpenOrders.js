// Component for Display My Orders History By:Tejas Date : 13/9/2018

import React, { Fragment } from "react";
// import modal dialog boxes
import { Col, Row, Table } from "reactstrap";

// intl messages
import IntlMessages from "Util/IntlMessages";

// import scrollbar
import { Scrollbars } from "react-custom-scrollbars";

// import loader for section
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// import connect function
import { connect } from "react-redux";

class MyOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeOpenOrder: this.props.hasOwnProperty("activeOpenOrder")
                ? this.props.activeOpenOrder
                : [],
            showLoader: true,
            socketData: [],
            displayOtherPairs: false,
            isComponentActive: 1,
            recentOrderBit: 0,
        };
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.activeOpenOrder) {
            // set Active My Open Order list if gets from API only
            this.setState({
                activeOpenOrder: nextprops.activeOpenOrder,
            });
        }
    }

    componentWillMount() {
        this.isComponentActive = 1;
    }

    componentWillUnmount() {
        this.isComponentActive = 0;
    }

    // Render Component for Active Open Order
    render() {
        //console.log("recent orders ",this.state.activeOpenOrder)
        const activeOpenOrder = [];
        if (this.state.activeOpenOrder) {
            this.state.activeOpenOrder.map((value) => {
                if (this.props.hideOtherPairs) {
                    if (value.PairName === this.props.currencyPair) {
                        activeOpenOrder.push(value);
                    }
                } else {
                    activeOpenOrder.push(value);
                }
            });
        }

        return (
            <Fragment>
                <div className="table-responsive-design">
                    <Table className="m-0 p-0">
                        <thead>
                            <tr className="bg-light">
                                <th>
                                    {
                                        <IntlMessages id="trading.activeorders.label.pair" />
                                    }
                                </th>
                                <th className="numeric">
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
                                    {
                                        <IntlMessages id="trading.activeorders.label.price" />
                                    }
                                </th>
                                <th className="numeric">
                                    {
                                        <IntlMessages id="trading.activeorders.label.quantity" />
                                    }
                                </th>
                                <th className="numeric">
                                    {
                                        <IntlMessages id="trading.activeorders.label.settleqty" />
                                    }
                                </th>
                                <th className="numeric">
                                    {
                                        <IntlMessages id="trading.activeorders.label.status" />
                                    }
                                </th>
                                <th>
                                    {
                                        <IntlMessages id="trading.activeorders.label.date" />
                                    }
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
                        <Table className="m-0 p-0">
                            <tbody>
                                {activeOpenOrder.length !== 0 ? (
                                    activeOpenOrder.map((value, key) => {
                                        return (
                                            <tr key={key}>
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
                                                    {value.OrderType ===
                                                    "LIMIT" ? (
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
                                                    {value.OrderType ===
                                                    "SPOT" ? (
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
                                                    {value.Qty}
                                                </td>
                                                <td className="text-center">
                                                    {value.SettledQty}
                                                </td>
                                                
                                                <td className="text-center">
                                                    {value.StatusCode === 1 && (
                                                        <span
                                                            className="badge badge-success w-65"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            {
                                                                <IntlMessages id="myorders.response.status.1" />
                                                            }
                                                        </span>
                                                    )}
                                                    {value.StatusCode === 4 && (
                                                        <span
                                                            className="badge badge-info w-65"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            {
                                                                <IntlMessages id="myorders.response.status.4" />
                                                            }
                                                        </span>
                                                    )}
                                                    {value.StatusCode === 2 && (
                                                        <span
                                                            className="badge badge-danger w-65"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            {
                                                                <IntlMessages id="myorders.response.status.2" />
                                                            }
                                                        </span>
                                                    )}
                                                    {value.StatusCode === 3 && (
                                                        <span
                                                            className="badge badge-danger w-65"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            {
                                                                <IntlMessages id="myorders.response.status.3" />
                                                            }
                                                        </span>
                                                    )}
                                                    {value.StatusCode === 5 && (
                                                        <span
                                                            className="badge badge-danger w-65"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            {
                                                                <IntlMessages id="myorders.response.status.5" />
                                                            }
                                                        </span>
                                                    )}
                                                    {value.StatusCode === 6 && (
                                                        <span
                                                            className="badge badge-danger w-65"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            {
                                                                <IntlMessages id="myorders.response.status.6" />
                                                            }
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {
                                                        value.DateTime.replace(
                                                            "T",
                                                            " "
                                                        ).split(".")[0]
                                                    }
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
                                                                fontSize:
                                                                    "80px",
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
                </div>
            </Fragment>
        );
    }
}

// Set Props when actions are dispatch
const mapStateToProps = (state) => ({
    loading: state.recentOrder.loading,
    recentOrderBit: state.recentOrder.recentOrderBit,
});

// connect action with store for dispatch
export default connect(
    mapStateToProps,
    {}
)(MyOrder);
