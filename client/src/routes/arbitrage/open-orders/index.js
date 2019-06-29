/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Open Orders Component
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { Form, Label, FormGroup, Input } from "reactstrap";
import Button from "@material-ui/core/Button";

// import neccessary actions
import { arbitrageOpenOrder } from 'Actions/Arbitrage';

import { NotificationManager } from "react-notifications";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// import section loader
import JbsSectionLoader from "Components/JbsPageLoader/JbsLoader";

// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";

// intl messages means convert text into selected languages
import IntlMessages from "Util/IntlMessages";

// import ex data tables for display table
import ExDatatable from "./components/ex_datatable";

import { injectIntl } from "react-intl";

import { changeDateFormat } from "Helpers/helpers";

import {
    getArbitragePairList
} from "Actions/Arbitrage";

// define Open Orders component
class ArbitrageOpenOrders extends Component {
    // make default state values on load
    constructor(props) {
        super();
        this.state = {
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            pair: "",
            type: "",
            onLoad: 0,
            pairList: [],
            getOpenOrders: 0,
            openOrdersList: [],
            LPType: 0,
            IsArbitrage: 1
        };

        this.onApply = this.onApply.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
    }

    // used to handle change event of every input field and set values in states
    handleChange(event) {
        if (event.target.value <= this.state.currentDate) {
            this.setState({ [event.target.name]: event.target.value });
        } else {
            NotificationManager.error(
                <IntlMessages id="trading.openorders.properdate" />
            );
        }
    }

    componentDidMount() {
        this.props.getArbitragePairList({});
    }
    // Used for set Currency Pairs
    handleChangeCurrency(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    // Used for set Types
    handleChangeType(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    // apply button used to call open orders list
    onApply(event) {
        event.preventDefault();
        const data = {
            pair: this.state.pair,
            orderType: this.state.type,
            fromDate: this.state.start_date,
            toDate: this.state.end_date,
            page: 0,
            LPType: this.state.LPType,
            IsArbitrage: 1
        };

        // Validation For Dates And Currency Pairs By Tejas Date : 14/11/2018
        if (
            (this.state.start_date !== "" && this.state.end_date === "") ||
            (this.state.end_date !== "" && this.state.start_date === "")
        ) {
            NotificationManager.error(
                <IntlMessages id="trading.openorders.dateselect" />
            );
        } else if (this.state.end_date < this.state.start_date) {
            NotificationManager.error(
                <IntlMessages id="trading.openorders.datediff" />
            );
        } else if (this.state.end_date > this.state.currentDate) {
            NotificationManager.error(
                <IntlMessages id="trading.openorders.endcurrentdate" />
            );
        } else if (this.state.start_date > this.state.currentDate) {
            NotificationManager.error(
                <IntlMessages id="trading.openorders.startcurrentdate" />
            );
        } else {
            this.setState({ showLoader: true, getOpenOrders: 1 });
            this.props.arbitrageOpenOrder(data);
        }
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.arbitragePairList.length) {
            this.setState({
                pairList: nextprops.arbitragePairList,
            });
        }

        if (this.state.getOpenOrders && nextprops.openOrderList.length !== 0) {
            this.setState({
                getOpenOrders: 0,
                openOrdersList: nextprops.openOrderList,
            });
        } else if (
            this.state.getOpenOrders &&
            nextprops.openOrderList.length === 0
        ) {
            NotificationManager.error(
                <IntlMessages id="error.trading.transaction.4501" />
            );
            this.setState({
                getOpenOrders: 0,
                openOrdersList: [],
            });
        }


    }

    render() {
        const intl = this.props.intl;

        var pairs = [];
        if (this.state.pairList.length) {
            this.state.pairList.map((value) => {
                value.PairList.map((info) => {
                    pairs.push(info);
                });
            });
        }

        const data = this.state.openOrdersList ? this.state.openOrdersList : [];

        // define options for data tables
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            filter: false,
            download: true,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                },
            },
            downloadOptions: {
                filename:
                    "Open_Orders_" +
                    changeDateFormat(new Date(), "YYYY-MM-DD") +
                    ".csv",
            },
        };
        // define columns for data tables
        const columns = [
            {
                name: intl.formatMessage({
                    id: "sidebar.openOrders.tableHeading.tradeid",
                }),
            },
            {
                name: intl.formatMessage({
                    id: "myaccount.tradeSummaryColumn.exchange",
                }),
            },
            {
                name: intl.formatMessage({
                    id: "sidebar.openOrders.tableHeading.price",
                }),
            },
            {
                name: intl.formatMessage({
                    id: "tradesummary.tradeSummaryColumn.amount",
                }),
            },
            {
                name: intl.formatMessage({ id: "sidebar.settleAmount" }),
            },
            {
                name: intl.formatMessage({
                    id: "sidebar.openOrders.tableHeading.type",
                }),
            },

            {
                name: intl.formatMessage({
                    id: "sidebar.openOrders.tableHeading.pair",
                }),
            },
            {
                name: intl.formatMessage({
                    id: "sidebar.openOrders.tableHeading.date",
                }),
            },
        ];

        return (
            <Fragment>
                {this.props.openOrderListLoading && <JbsSectionLoader />}

                <div className="charts-widgets-wrapper">
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.openOrders.list" />}
                        match={this.props.match}
                    />
                    <div className="transaction-history-detail">
                        <JbsCollapsibleCard>
                            <div className="top-filter orderlist-search">
                                <Form name="frm_search" className="mb-10 row">
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="startDate">
                                            {
                                                <IntlMessages id="sidebar.openOrders.filterLabel.startDate" />
                                            }
                                        </Label>
                                        <Input
                                            type="date"
                                            name="start_date"
                                            value={
                                                this.state
                                                    .start_date
                                            }
                                            id="startDate"
                                            placeholder="dd/mm/yyyy"
                                            onChange={
                                                this.handleChange
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="endDate">
                                            {
                                                <IntlMessages id="sidebar.openOrders.filterLabel.endDate" />
                                            }
                                        </Label>
                                        <Input
                                            type="date"
                                            name="end_date"
                                            value={
                                                this.state.end_date
                                            }
                                            id="endDate"
                                            placeholder="dd/mm/yyyy"
                                            onChange={
                                                this.handleChange
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-2">
                                            {
                                                <IntlMessages id="sidebar.openOrders.filterLabel.type" />
                                            }
                                        </Label>
                                        <div className="app-selectbox-sm">
                                            <Input
                                                type="select"
                                                name="type"
                                                value={
                                                    this.state.type
                                                }
                                                id="Select-2"
                                                onChange={
                                                    this
                                                        .handleChangeType
                                                }
                                            >
                                                <IntlMessages id="transactioncharge.report.filter.option.label.select">
                                                    {(select) => (
                                                        <option value="">
                                                            {select}
                                                        </option>
                                                    )}
                                                </IntlMessages>
                                                <IntlMessages id="sidebar.transactionHistory.filterLabel.type.buy">
                                                    {(buy) => (
                                                        <option value="buy">
                                                            {buy}
                                                        </option>
                                                    )}
                                                </IntlMessages>
                                                <IntlMessages id="sidebar.transactionHistory.filterLabel.type.sell">
                                                    {(sell) => (
                                                        <option value="sell">
                                                            {sell}
                                                        </option>
                                                    )}
                                                </IntlMessages>
                                            </Input>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <Label for="Select-1">
                                            {
                                                <IntlMessages id="sidebar.openOrders.filterLabel.currencyPair" />
                                            }
                                        </Label>
                                        <div className="app-selectbox-sm">
                                            <Input
                                                type="select"
                                                name="pair"
                                                value={
                                                    this.state.pair
                                                }
                                                id="Select-1"
                                                onChange={
                                                    this
                                                        .handleChangeCurrency
                                                }
                                            >
                                                <option value="">
                                                    <IntlMessages id="transactioncharge.report.filter.option.label.select" />
                                                </option>
                                                {pairs.map(
                                                    (
                                                        currency,
                                                        key
                                                    ) => (
                                                            <option
                                                                key={
                                                                    key
                                                                }
                                                                value={
                                                                    currency.PairName
                                                                }
                                                            >
                                                                {
                                                                    currency.PairName
                                                                }
                                                            </option>
                                                        )
                                                )}
                                            </Input>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="col-md-2 col-sm-4">
                                        <div className="btn_area">
                                            <Button onClick={this.onApply} variant="raised" className="mr-10 text-white perverbtn"><IntlMessages id="sidebar.openOrders.button.apply" /></Button>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </JbsCollapsibleCard>
                        {data.length > 0 && (
                            <ExDatatable
                                title="sidebar.openOrders.list"
                                data={data.map((item) => {
                                    {
                                        var type =
                                            item.Type === "BUY"
                                                ? intl.formatMessage({
                                                    id:
                                                        "sidebar.openOrders.filterLabel.type.buy",
                                                })
                                                : intl.formatMessage({
                                                    id:
                                                        "sidebar.openOrders.filterLabel.type.sell",
                                                });
                                    }
                                    return [
                                        item.Id,
                                        item.ExchangeName,
                                        item.Price === 0
                                            ? intl.formatMessage({
                                                id:
                                                    "trading.placeorder.label.market",
                                            })
                                            : parseFloat(item.Price).toFixed(8),
                                        parseFloat(item.Amount).toFixed(8),
                                        parseFloat(item.SettledQty).toFixed(8),
                                        type,
                                        item.PairName,
                                        item.TrnDate.replace("T", " ").split(
                                            "."
                                        )[0],
                                    ];
                                })}
                                columns={columns}
                                options={options}
                            />
                        )}
                    </div>
                </div>
            </Fragment>
        );
    }
}

// map states to props when changed in states from reducer
const mapStateToProps = ({ arbitrageReports, arbitrageOrderBook }) => {
    const { openOrderList, openOrderListLoading } = arbitrageReports;
    const { arbitragePairList } = arbitrageOrderBook;
    return { openOrderList, arbitragePairList, openOrderListLoading };
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    { arbitrageOpenOrder, getArbitragePairList }
)(injectIntl(ArbitrageOpenOrders));
