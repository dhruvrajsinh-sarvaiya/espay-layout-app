/* 
    Developer : Vishva shah
    Date : 1-03-2019
    File Comment : list margin wallets Ledger
*/
import React, { Component } from 'react';
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
import MUIDataTable from "mui-datatables";
import { connect } from 'react-redux';
import { changeDateFormat } from "Helpers/helpers";
import { NotificationManager } from 'react-notifications';
import IntlMessages from 'Util/IntlMessages';
import Select from "react-select";
import {
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import {
    getMarginWalletLedger
} from 'Actions/MarginTrading';
import {
    getMaringWalletList
} from 'Actions/MarginTrading';

// initial state
const initState = {
    WalletObj: null,
    walletid: "",
    FromDate: new Date().toISOString().slice(0, 10),
    ToDate: new Date().toISOString().slice(0, 10),
    Page: 0,
    PageSize: 10,
    TotalCount: 0,
    currentDate: new Date().toISOString().slice(0, 10),
    showReset: false,
}
class ListMarginWalletLedger extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }
    //handle change event for select date
    handleChange(e, key) {
        if (e.target.value <= this.state.currentDate) {
            this.setState({ [key]: e.target.value });
        }
        else {
            NotificationManager.error(<IntlMessages id="trading.openorders.properdate" />)
        }
    }
    // onchange handler for select
    onChangeHandler(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }

    // on change for select walletId
    onChangeSelectwallet(e) {
        this.setState({ walletid: e.value, WalletObj: { label: e.label } });
    }
    //apply filter
    applyFilter = () => {
        if (this.state.walletid !== "" && this.state.FromDate !== "" && this.state.ToDate !== "") {
            this.props.getMarginWalletLedger({
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                WalletId: this.state.walletid,
                Page: this.state.Page,
                PageSize: this.state.PageSize
            });
            this.setState({ showReset: true });
        }
    };

    //clear filter
    clearFilter() {
        this.setState(initState);
    }
    componentWillMount() {
        this.props.getMaringWalletList({});
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.TotalCount != nextProps.TotalCount) {
            this.setState({ TotalCount: nextProps.TotalCount });
        }
    }
    render() {
        const { intl, loading } = this.props;
        const { walletLedgerList } = this.props;
        var columns = [
            {
                name: intl.formatMessage({ id: "wallet.Id" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "wallet.Amount" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.CrAmount" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.DrAmount" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.PreBal" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "trading.PostBal" }),
                options: { filter: true, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.Remarks" }),
                options: { filter: false, sort: true }
            },
            {
                name: intl.formatMessage({ id: "table.Date" }),
                options: { filter: false, sort: true }
            },

        ]
        const options = {
            filterType: 'dropdown',
            responsive: 'scroll',
            selectableRows: false,
            download: false,
            viewColumns: false,
            print: false,
            filter: false,
            page: this.state.Page,
            rowsPerPageOptions: [10, 25, 50, 100],
            rowsPerPage: this.state.PageSize,
            count: this.state.TotalCount,
            textLabels: {
                body: {
                    noMatch: intl.formatMessage({ id: "wallet.emptyTable" }),
                    toolTip: intl.formatMessage({ id: "wallet.sort" }),
                }
            },
            onTableChange: (action, tableState) => {
                switch (action) {
                    case "changeRowsPerPage":
                        this.setState({
                            Page: tableState.page,
                            PageSize: tableState.rowsPerPage
                        });
                        this.props.getMarginWalletLedger({
                            FromDate: this.state.FromDate,
                            ToDate: this.state.ToDate,
                            WalletId: this.state.walletid,
                            Page: tableState.page,
                            PageSize: tableState.rowsPerPage
                        });
                        break;
                    case "changePage":
                        this.setState({
                            Page: tableState.page,
                            PageSize: tableState.rowsPerPage
                        });
                        this.props.getMarginWalletLedger({
                            FromDate: this.state.FromDate,
                            ToDate: this.state.ToDate,
                            WalletId: this.state.walletid,
                            Page: tableState.page,
                            PageSize: tableState.rowsPerPage
                        });
                        break;
                }
            }
        };

        return (
            <div className={this.props.darkMode ? 'DepositWithdrawHistory-darkmode' : 'DepositWithdrawHistory'}>
                {loading && <JbsSectionLoader />}
                <JbsCollapsibleCard>
                    <div className="top-filter row">
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="startDate">{intl.formatMessage({ id: "wallet.FromDate" })}</Label>
                            <Input type="date" name="date" id="startDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.handleChange(e, 'FromDate')} max={this.state.currentDate} />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="endDate">{intl.formatMessage({ id: "wallet.ToDate" })}</Label>
                            <Input type="date" name="date" id="endDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.handleChange(e, 'ToDate')} max={this.state.currentDate} />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="Select-1">{intl.formatMessage({ id: "wallet.Wallet" })}<span className="text-danger">*</span></Label>
                            <Select
                                options={this.props.walletList.map((type) => ({
                                    label: type.WalletName,
                                    value: type.AccWalletID,
                                }))}
                                onChange={e => this.onChangeSelectwallet(e)}
                                value={this.state.WalletObj}
                            />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <div className="btn_area">
                            <Button color="primary" className={"border-0 rounded-0 perverbtn" + ((this.state.walletid !== "" && this.state.FromDate !== "" && this.state.ToDate !== "") ? "" : "disabled")} onClick={(e) => this.applyFilter(e)}>{intl.formatMessage({ id: "widgets.apply" })}</Button>
                                {this.state.showReset && <Button className="ml-15 border-0 btn-danger rounded-0" onClick={(e) => this.clearFilter()}>{intl.formatMessage({ id: "button.clear" })}</Button>}
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                {this.state.showReset === true && <div className="StackingHistory">
                    <MUIDataTable
                        data={walletLedgerList.map((wallet, key) => {
                            return [
                                key++,
                                wallet.Amount.toFixed(8),
                                wallet.CrAmount.toFixed(8),
                                wallet.DrAmount.toFixed(8),
                                wallet.PreBal.toFixed(8),
                                wallet.PostBal.toFixed(8),
                                wallet.Remarks,
                                changeDateFormat(wallet.TrnDate, 'YYYY-MM-DD HH:mm:ss', false),
                            ]
                        })}
                        columns={columns}
                        options={options}
                    />
                </div>
                }
            </div>
        )
    }
}

// map state to props
const mapStateToProps = ({ WalletLedger, WalletManagementReducer }) => {
    const { walletLedgerList, loading, TotalCount } = WalletLedger;
    const { walletList } = WalletManagementReducer;
    return { walletLedgerList, loading, walletList, TotalCount };

};
export default connect(mapStateToProps, {
    getMarginWalletLedger,
    getMaringWalletList
})(ListMarginWalletLedger);