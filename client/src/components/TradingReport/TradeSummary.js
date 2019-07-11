/*
 * Created By Megha Kariya
 * Date :- 09-01-2019
 * Component File for Trade Summary Report
 */
/**
 * Trade Summary
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import validator from "validator";
import { Form, Label, Input } from "reactstrap";
// redux action
import MatButton from "@material-ui/core/Button";
import { listTradeSummary } from "Actions/TradingReport";
import { getTradePairs } from "Actions/TradingReport";
// intl messages
import IntlMessages from "Util/IntlMessages";
import MUIDataTable from "mui-datatables";
// jbs card box
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import { NotificationManager } from "react-notifications";
import JbsSectionLoader from "Components/JbsSectionLoader/JbsSectionLoader";

const options = {
    filterType: "dropdown",
    responsive: "stacked",
    selectableRows: false,
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    textLabels: {
        body: {
            noMatch: <IntlMessages id="wallet.emptyTable" />,
            toolTip: <IntlMessages id="wallet.sort" />,
        },
    },
};
//Columns Object
const columns = [
    { name: <IntlMessages id="tradesummary.tradeSummaryColumn.trnNo" /> },

    { name: <IntlMessages id="tradesummary.tradeSummaryColumn.pair" /> },

    { name: <IntlMessages id="tradesummary.tradeSummaryColumn.type" /> },

    { name: <IntlMessages id="tradesummary.tradeSummaryColumn.orderType" /> },

    { name: <IntlMessages id="tradesummary.tradeSummaryColumn.price" /> },

    { name: <IntlMessages id="tradesummary.tradeSummaryColumn.amount" /> },

    { name: <IntlMessages id="tradesummary.tradeSummaryColumn.dateTime" /> },

];

class MembershipLevelProfileWdgt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start_date: new Date().toISOString().slice(0, 10),
            end_date: new Date().toISOString().slice(0, 10),
            currentDate: new Date().toISOString().slice(0, 10),
            pair: "",
            status: "",
            type: "",
            onLoad: 1,
            open: false,
            userID: "",
            trnNo: "",
            currency: "",
            orderType: this.props.state ? this.props.state.orderType : "",
            loading: false,
            pairList: [],
            tradingLedger: [],
            isChange: false,
        };

        this.onApply = this.onApply.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeOrder = this.handleChangeOrder.bind(this);
    }

    validateNumericValue = (event) => {
        const regexNumeric = /^[0-9]+$/;
        if (
            validator.matches(event.target.value, regexNumeric) ||
            event.target.value === ""
        ) {
            if (event.target.name === "userID") {
                this.setState({ userID: event.target.value });
            } else if (event.target.name === "trnNo") {
                this.setState({ trnNo: event.target.value });
            }
        }
    };
    onApply(event) {
        if (this.state.start_date === "") {
            NotificationManager.error(
                <IntlMessages id="trading.openorders.selectstartdate" />
            );
        } else if (this.state.end_date === "") {
            NotificationManager.error(
                <IntlMessages id="trading.openorders.selectenddate" />
            );
        } else if (
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
            var makeLedgerRequest = {
                FromDate: this.state.start_date,
                ToDate: this.state.end_date,
            };
            if (this.state.trnNo) {
                makeLedgerRequest.TrnNo = this.state.trnNo;
            }
            if (this.state.userID) {
                makeLedgerRequest.MemberID = this.state.userID;
            }
            if (this.state.type) {
                makeLedgerRequest.TrnType = this.state.type;
            }
            if (this.state.pair) {
                makeLedgerRequest.PairName = this.state.pair;
            }
            if (this.state.orderType) {
                makeLedgerRequest.OrderType = this.state.orderType;
            }
            this.setState({ onLoad: 1 });
            this.props.listTradeSummary(makeLedgerRequest);
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeOrder(event) {
        this.setState({
            isChange: true,
            [event.target.name]: event.target.value,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pairList.length) {
            this.setState({ pairList: nextProps.pairList });
        }

        if (
            nextProps.tradeSummaryList &&
            nextProps.error.length === 0 &&
            this.state.onLoad
        ) {
            this.setState({
                tradingLedger: nextProps.tradeSummaryList,
                onLoad: 0,
            });
        } else if (
            nextProps.error.length !== 0 &&
            nextProps.error.ReturnCode !== 0 &&
            this.state.onLoad
        ) {
            NotificationManager.error(
                <IntlMessages id={`error.trading.transaction.${nextProps.error.ErrorCode}`} />
            );
            this.setState({ tradingLedger: [], onLoad: 0 });
        }
    }

    componentDidMount() {
        this.setState({ onLoad: 1 });
        this.props.getTradePairs();
    }

    closeAll = () => {
        this.props.closeAll();
        this.setState({ open: false });
    };

    render() {
        const data = this.props.tradeSummaryList;
        return (
            <Fragment>
                <div className="charts-widgets-wrapper">
                    <div className="m-20 page-title d-flex justify-content-between align-items-center">
                        <div className="page-title-wrap">
                            <h2>
                                {<IntlMessages id="tradeSummary.title.report" />}
                            </h2>
                        </div>
                    </div>
                    <div className="transaction-history-detail">
                        <div className="col-md-12">
                            <JbsCollapsibleCard>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="top-filter clearfix tradefrm">
                                            <Form name="frm_search" className="row mb-10" >
                                                <div className="col-md-3">
                                                    <Label for="startDate1">
                                                        {<IntlMessages id="sidebar.tradeSummary.filterLabel.startDate" />}
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        name="start_date"
                                                        value={this.state.start_date}
                                                        id="startDate1"
                                                        placeholder="dd/mm/yyyy"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <Label for="endDate1">
                                                        {<IntlMessages id="sidebar.tradeSummary.filterLabel.endDate" />}
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        name="end_date"
                                                        value={this.state.end_date}
                                                        id="endDate1"
                                                        placeholder="dd/mm/yyyy"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <Label for="Select-2">
                                                        {<IntlMessages id="tradeSummary.filterLabel.trnNo" />}
                                                    </Label>
                                                    <IntlMessages id="tradeSummary.filterLabel.trnNo">
                                                        {(placeholder) => (
                                                            <Input
                                                                type="text"
                                                                name="trnNo"
                                                                value={this.state.trnNo}
                                                                id="trnNo"
                                                                placeholder={placeholder}
                                                                onChange={this.validateNumericValue}
                                                            />
                                                        )}
                                                    </IntlMessages>
                                                </div>
                                                <div className="col-md-3">
                                                    <Label for="Select-2">
                                                        {<IntlMessages id="sidebar.tradeSummary.filterLabel.type" />}
                                                    </Label>
                                                    <div className="app-selectbox-sm">
                                                        <Input
                                                            type="select"
                                                            name="type"
                                                            value={this.state.type}
                                                            id="Select-2"
                                                            onChange={this.handleChange}
                                                        >
                                                            <IntlMessages id="tradeSummary.selectType">
                                                                {(selectType) => (
                                                                    <option value=""> {selectType} </option>
                                                                )}
                                                            </IntlMessages>
                                                            <IntlMessages id="tradeSummary.selectType.buy">
                                                                {(buy) => (
                                                                    <option value="buy"> {buy} </option>
                                                                )}
                                                            </IntlMessages>
                                                            <IntlMessages id="tradeSummary.selectType.sell">
                                                                {(sell) => (
                                                                    <option value="sell"> {sell} </option>
                                                                )}
                                                            </IntlMessages>
                                                        </Input>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 mt-10">
                                                    <Label for="Select-1">
                                                        {<IntlMessages id="sidebar.tradeSummary.filterLabel.currencyPair" />}
                                                    </Label>
                                                    <div className="app-selectbox-sm">
                                                        <Input
                                                            type="select"
                                                            name="pair"
                                                            value={this.state.pair}
                                                            id="Select-1"
                                                            onChange={this.handleChange}
                                                        >
                                                            <IntlMessages id="tradeSummary.selectCurrencyPair.all">
                                                                {(all) => (
                                                                    <option value=""> {all} </option>
                                                                )}
                                                            </IntlMessages>
                                                            {this.state.pairList.map(
                                                                (currency, key) => (
                                                                    <option key={key} value={currency.PairName} > {currency.PairName} </option>
                                                                )
                                                            )}
                                                        </Input>
                                                    </div>
                                                </div>

                                                <div className="col-md-3 mt-10">
                                                    <Label for="Select-2">
                                                        {<IntlMessages id="tradeSummary.orderType.label" />}
                                                    </Label>
                                                    <div className="app-selectbox-sm">
                                                        <Input
                                                            type="select"
                                                            name="orderType"
                                                            value={this.state.orderType}
                                                            id="Select-2"
                                                            onChange={this.handleChangeOrder}
                                                        >
                                                            <IntlMessages id="tradeSummary.orderType">
                                                                {(orderType) => (
                                                                    <option value=""> {orderType} </option>
                                                                )}
                                                            </IntlMessages>
                                                            <IntlMessages id="tradeSummary.orderType.limit">
                                                                {(limit) => (
                                                                    <option value="LIMIT"> {limit} </option>
                                                                )}
                                                            </IntlMessages>
                                                            <IntlMessages id="tradeSummary.orderType.market">
                                                                {(market) => (
                                                                    <option value="MARKET"> {market} </option>
                                                                )}
                                                            </IntlMessages>
                                                            <IntlMessages id="tradeSummary.orderType.stopLimit">
                                                                {(stopLimit) => (
                                                                    <option value="STOP_Limit"> {stopLimit} </option>
                                                                )}
                                                            </IntlMessages>
                                                            <IntlMessages id="tradeSummary.orderType.spot">
                                                                {(spot) => (
                                                                    <option value="SPOT"> {spot} </option>
                                                                )}
                                                            </IntlMessages>
                                                        </Input>
                                                    </div>
                                                </div>
                                                <div className="col-md-1 mt-10">
                                                    <Label className="d-block">
                                                        &nbsp;
                                                    </Label>
                                                    <MatButton
                                                        variant="raised"
                                                        className="btn-primary text-white"
                                                        onClick={this.onApply}
                                                    >
                                                        <IntlMessages id="sidebar.tradeSummary.button.apply" />
                                                    </MatButton>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </JbsCollapsibleCard>
                        </div>
                        {this.props.loading && <JbsSectionLoader />}
                        {data.length !== 0 && (
                            <div className="responsive-table-wrapper">
                                <JbsCollapsibleCard>
                                    <div className="table-responsive">
                                        <div className="unseen">
                                            <MUIDataTable
                                                title={
                                                    <IntlMessages id="sidebar.tradeSummary" />
                                                }
                                                data={data.map((item) => {
                                                    return [
                                                        item.TrnNo,
                                                        item.PairName,
                                                        item.TrnType,
                                                        item.OrderType,
                                                        item.Price === 0
                                                            ? "price"
                                                            : parseFloat(item.Price).toFixed(8),
                                                        item.Qty
                                                            ? parseFloat(item.Qty).toFixed(8)
                                                            : 0,
                                                        item.TrnDate.replace(
                                                            "T",
                                                            " "
                                                        ).split(".")[0],
                                                    ];
                                                })}
                                                columns={columns}
                                                options={options}
                                            />
                                        </div>
                                    </div>
                                </JbsCollapsibleCard>
                            </div>
                        )}
                    </div>
                </div>
            </Fragment>
        );
    }
}
// map state to props
const mapStateToProps = ({ tradeSummaryReport }) => {
    var response = {
        tradeSummaryList: tradeSummaryReport.tradeSummaryData,
        loading: tradeSummaryReport.loading,
        error: tradeSummaryReport.error,
        pairList: tradeSummaryReport.pairList,
    };
    return response;
};

export default connect(
    mapStateToProps,
    {
        listTradeSummary,
        getTradePairs,
    }
)(MembershipLevelProfileWdgt);
