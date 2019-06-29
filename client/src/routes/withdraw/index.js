/*
    Developer : Nishant Vadgama
    File Comment : withdraw route component
    Date : 13-09-2018
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import Withdraw from "Components/Withdraw/Withdraw";
import DepositWithdrawHistory from "Components/Trading/DepositWithdrawHistory";
// Deposit History Actions
import {
    getCurrency,
    getWallets,
    getBalance,
    getFeeAndLimits,
    getWithdrawalHistory,
    doWithdraw,
    getAddressById,
    verify2fa,
    resendMailConfirmation,
    getWithdrawalPolicy
} from "Actions/Withdraw";
import {
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import { NotificationManager } from "react-notifications";
/* WITHDRAWAL TRN TYPE CONSTANT ENUM */
const WITHDRAW_TRNTYPE = 9;

// Create Class For Display Balance Detail
class withdraw extends Component {
    constructor(props) {
        super(props);
        this.resendMailConfirmation = this.resendMailConfirmation.bind(this);
    }
    state = {
        Coin: "",
        FromDate: "",
        ToDate: "",
        today: "",
    };
    // Function for call method of get Balance
    componentWillMount() {
        let today = new Date();
        today =
            today.getFullYear() +
            "-" +
            (today.getMonth() < 10 ? "0" : "") +
            (today.getMonth() + 1) +
            "-" +
            (today.getDate() < 10 ? "0" : "") +
            today.getDate();
        this.setState({ FromDate: today, ToDate: today, today: today });
        this.props.getCurrency();
        this.props.getWithdrawalPolicy(WITHDRAW_TRNTYPE);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.response && nextProps.response.returnCode === 0) {
            NotificationManager.success(
                nextProps.response.returnMsg +
                "Transaction ID is " +
                nextProps.response.txid
            );
        } else if (nextProps.response && nextProps.response.returnCode === 1) {
            NotificationManager.error(nextProps.response.returnMsg);
        }
        // validate resend mail response...
        if (nextProps.resendMailResponse.hasOwnProperty('ReturnCode')) {
            if (nextProps.resendMailResponse.ReturnCode === 0) {   //success
                NotificationManager.success(nextProps.resendMailResponse.ReturnMsg);
            } else if (nextProps.resendMailResponse.ReturnCode === 1) {   //failed
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.resendMailResponse.ErrorCode} />);
            }
        }
    }
    onChangeSelectCurrency(currency) {
        let reqObj = {
            Coin: currency,
            FromDate: this.state.FromDate,
            ToDate: this.state.ToDate
        };
        this.props.getWallets({ Coin: currency });
        this.props.getWithdrawalHistory(reqObj);
        this.setState({ Coin: currency });
    }
    onChangeDate(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    getHistoryData() {
        if (this.state.FromDate != "" && this.state.ToDate != "") {
            this.props.getWithdrawalHistory(this.state);
        }
    }
    //resend mail confirmation...
    resendMailConfirmation(TrnNo) {
        this.props.resendMailConfirmation(TrnNo);
    }
    // on click function will redirect to view all withdraw history
    onClickViewAll() {
        this.props.history.push("/app/history/withdraw");
    }
    // render withdraw data and history
    render() {
        const { match } = this.props;
        return (
            <Fragment>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.withdraw" />}
                    match={match}
                />
                <div className="row">
                    <Withdraw
                        {...this.props}
                        refreshHistory={e => this.getHistoryData(e)}
                        loading={this.props.loading}
                        wallets={this.props.wallets}
                       
                        IsWhitelisting={1} // changed default ON deu to compulsary add benificiary
                        WithdrawalDailyLimit={this.props.WithdrawalDailyLimit}
                        addresses={this.props.addresses}
                        currencies={this.props.currencies}
                        balance={this.props.balance}
                        onChangeSelectCurrency={e => this.onChangeSelectCurrency(e)}
                        getAddressById={this.props.getAddressById}
                        getBalanceById={this.props.getBalance}
                        doWithdraw={this.props.doWithdraw}
                        feeAndLimit={this.props.feeAndLimit}
                        getFeeAndLimits={this.props.getFeeAndLimits}
                        response={this.props.response}
                        verify2fa={this.props.verify2fa}
                    />
                    <JbsCollapsibleCard
                        colClasses="col-sm-12 col-md-12 col-xl-6"
                        fullBlock
                    >
                        <div className="jbs-block-title">
                            <h4>{<IntlMessages id="wallet.history" />}</h4>
                            <div className="contextual-link">
                                <a onClick={() => this.onClickViewAll()}>
                                    {<IntlMessages id="wallet.viewall" />}
                                </a>
                            </div>
                        </div>
                        <div className="top-filter row px-20 pb-20">
                            <FormGroup className="col-md-3 col-sm-4">
                                <Label for="FromDate">
                                    <IntlMessages id="wallet.startDate" /><span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="FromDate"
                                    placeholder="dd/mm/yyyy"
                                    value={this.state.FromDate}
                                    onChange={e => this.onChangeDate(e, "FromDate")}
                                    max={this.state.today}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-3 col-sm-4">
                                <Label for="ToDate">
                                    <IntlMessages id="wallet.endDate" /><span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="ToDate"
                                    placeholder="dd/mm/yyyy"
                                    value={this.state.ToDate}
                                    onChange={e => this.onChangeDate(e, "ToDate")}
                                    max={this.state.today}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-2 col-sm-4">
                                <div className="btn_area">
                                    <Button className={"mr-10 border-0 rounded-0  perverbtn" + ((this.state.FromDate === "" || this.state.ToDate === "") ? "disabled" : "")} onClick={e => this.getHistoryData(e)}><IntlMessages id="widgets.apply" /></Button>
                                </div>
                            </FormGroup>
                        </div>
                        <DepositWithdrawHistory
                            name="withdraw"
                            loading={this.props.withdrawhistoryLoading}
                            history={this.props.withdrawhistory}
                            darkMode={this.props.darkMode}
                            resendMailConfirmation={this.resendMailConfirmation}
                        />
                    </JbsCollapsibleCard>
                </div>
            </Fragment>
        );
    }
}

// connect props for dispatch actions
const mapDispatchToProps = ({ withdrawApp, settings }) => {
    const { darkMode } = settings;
    const {
        addresses,
        currencies,
        balance,
        wallets,
        loading,
        response,
        IsWhitelisting,
        WithdrawalDailyLimit,
        feeAndLimit,
        response2fa,
        errors,
        withdrawhistory,
        withdrawhistoryLoading,
        resendMailResponse,
        withdrawalPolicy
    } = withdrawApp;

    return {
        addresses,
        withdrawhistory,
        currencies,
        wallets,
        loading,
        withdrawhistoryLoading,
        response,
        balance,
        IsWhitelisting,
        WithdrawalDailyLimit,
        feeAndLimit,
        darkMode,
        response2fa,
        errors,
        resendMailResponse,
        withdrawalPolicy
    };
};

export default connect(mapDispatchToProps, {
    getCurrency,
    getWallets,
    getBalance,
    getFeeAndLimits,
    getWithdrawalHistory,
    doWithdraw,
    getAddressById,
    verify2fa,
    resendMailConfirmation,
    getWithdrawalPolicy
})(withdraw);
