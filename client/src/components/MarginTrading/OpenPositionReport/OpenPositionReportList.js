/**
 *   Developer : Parth Andhariya
 *   Date : 22-04-2019
 *   Component: Open Position Report List
*/
import React, { Component } from 'react';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import MUIDataTable from "mui-datatables";
import { changeDateFormat } from "Helpers/helpers";
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import IntlMessages from 'Util/IntlMessages';
import {
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import {
    getOpenPositionReportList
} from 'Actions/MarginTrading';
import { getPairList } from "Actions/Trade";
const initState = {
    showReset: false,
    pair: '',
    pairList: []
}
class OpenPositionReport extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    componentWillMount() {
        this.props.getPairList({})
        this.props.getOpenPositionReportList({})
    }
    componentWillReceiveProps(nextProps) {
        //set pairList response in state
        if (nextProps.pairList.length) {
            this.setState({
                pairList: nextProps.pairList
            })
        }
    }
    /* apply filter */
    applyFilter() {
        if (this.state.pair !== '') {
            this.props.getOpenPositionReportList({ PairId: this.state.pair })
            this.setState({ showReset: true })
        }
    }
    /* reset filter options */
    clearFilter() {
        this.setState({ pair: '', showReset: false });
        this.props.getOpenPositionReportList({})
    }
    // used to handle change event of every input field and set values in states
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    render() {
        //added  for pair list in dropdown
        var pairs = []
        if (this.state.pairList.length) {
            this.state.pairList.map(value => {
                value.PairList.map(info => {
                    pairs.push(info)
                })
            })
        }
        const { intl, Report, loading } = this.props;
        var columns = [
            {
                name: intl.formatMessage({ id: "tradeSummary.filterLabel.trnNo" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.topgainerslosers.pair" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "tradesummary.tradeSummaryColumn.orderType" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.activeorders.label.quantity" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.BidPrice" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.LandingPrice" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.TrnDate" }),
                options: { filter: true, sort: true }
            },

        ]
        const options = {
            filter: false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
            rowsPerPageOptions: [10, 25, 50, 100],
            print: false,
            download: false,
            viewColumns: false,
            search: true,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },

        };
        return (
            <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode tbl_overflow_auto' : 'DepositWithdrawHistory tbl_overflow_auto'}>
                {loading && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <div className="top-filter row">
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="Select-1">{<IntlMessages id="sidebar.transactionHistory.filterLabel.currencyPair" />}</Label>
                            <Input type="select" name="pair" value={this.state.pair} id="Select-1" onChange={e => this.handleChange(e)}>
                                <IntlMessages id="transactioncharge.report.filter.option.label.select">
                                    {(labelSelect) =>
                                        <option value="">{labelSelect}</option>
                                    }
                                </IntlMessages>
                                {pairs.map((currency, key) =>
                                    <option key={key} value={currency.PairId}>{currency.PairName}</option>
                                )}
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <div className="btn_area">
                                <Button color="primary" className={"border-0 rounded-0 perverbtn" + ((this.state.pair !== '') ? "" : "disabled")} onClick={(e) => this.applyFilter(e)}>{intl.formatMessage({ id: "widgets.apply" })}</Button>
                                {this.state.showReset && <Button className="ml-15 border-0 btn-danger rounded-0" onClick={(e) => this.clearFilter()}>{intl.formatMessage({ id: "button.clear" })}</Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <div className="StackingHistory">
                <MUIDataTable
                    data={Report.map(item => {
                        return [
                            item.TrnNo,
                            item.PairName,
                            item.OrderType,
                            item.Qty,
                            parseFloat(item.BidPrice).toFixed(8),
                            parseFloat(item.LandingPrice).toFixed(8),
                            changeDateFormat(item.TrnDate, 'YYYY-MM-DD', false),
                        ]
                    })}
                    columns={columns}
                    options={options}
                />
                </div>
            </div >
        )
    }
}
// map states to props when changed in states from reducer
const mapStateToProps = ({ OpenPositionReport, tradePairList }) => {
    const { loading, Report } = OpenPositionReport;
    const { pairList } = tradePairList;
    return { loading, pairList, Report };
};

// export this component with action methods and props
export default connect(
    mapStateToProps,
    { getPairList, getOpenPositionReportList }
)(injectIntl(OpenPositionReport));
