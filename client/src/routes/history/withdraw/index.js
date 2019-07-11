/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    File Comment : History -> Withdraw index file component
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import component for Card Design
import JbsCollapsibleCard from 'Components/JbsCollapsibleCard/JbsCollapsibleCard';
// import component for Page Title
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
// Import component for internationalization
import IntlMessages from 'Util/IntlMessages';
//component for withdraw history
import DepositWithdrawHistory from 'Components/Trading/DepositWithdrawHistory';
import {
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
// Withdraw History Actions
import {
    getWithdrawalHistory,
    resendMailConfirmation
} from 'Actions/Withdraw';
import { NotificationManager } from 'react-notifications';
/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    Comment : withdraw history root componet
*/

class history extends Component {
    constructor(props) {
        super(props);
        this.resendMailConfirmation = this.resendMailConfirmation.bind(this);
    }
    state = {
        FromDate: "",
        ToDate: "",
        today: "",
    };
    // Function for call method of get Balance
    componentWillMount() {
        let today = new Date();
        today = today.getFullYear() + '-' + (today.getMonth() < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        this.setState({ FromDate: today, ToDate: today, today: today });
        let reqObj = {
            FromDate: today,
            ToDate: today,
        }
        this.props.getWithdrawalHistory(reqObj);
    }
    //will receive props validate response
    componentWillReceiveProps(nextProps) {
        if (nextProps.resendMailResponse.hasOwnProperty('ReturnCode')) {
            if (nextProps.resendMailResponse.ReturnCode === 0) {   //success
                NotificationManager.success(nextProps.resendMailResponse.ReturnMsg);
            } else if (nextProps.resendMailResponse.ReturnCode === 1) {   //failed
                NotificationManager.error(<IntlMessages id={"apiWalletErrCode." + nextProps.resendMailResponse.ErrorCode} />);
            }
        }
    }
    onChangeDate(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    getHistoryData(e) {
        e.preventDefault();
        if (this.state.FromDate != "" && this.state.ToDate != "") {
            this.props.getWithdrawalHistory(this.state);
        }
    }
    //resend mail confirmation...
    resendMailConfirmation(TrnNo) {
        this.props.resendMailConfirmation(TrnNo);
    }
    render() {
        return (
            <div className="History pb-20">
                <PageTitleBar title={<IntlMessages id="wallet.historyWithdrawTitle" />} match={this.props.match} />
                <JbsCollapsibleCard>
                    <div className="top-filter row withdrawl-search">
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="FromDate"><IntlMessages id="wallet.startDate" /><span className="text-danger">*</span></Label>
                            <Input type="date" name="date" id="FromDate" placeholder="dd/mm/yyyy" value={this.state.FromDate} onChange={(e) => this.onChangeDate(e, 'FromDate')} max={this.state.today} />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <Label for="ToDate"><IntlMessages id="wallet.endDate" /><span className="text-danger">*</span></Label>
                            <Input type="date" name="date" id="ToDate" placeholder="dd/mm/yyyy" value={this.state.ToDate} onChange={(e) => this.onChangeDate(e, 'ToDate')} max={this.state.today} />
                        </FormGroup>
                        <FormGroup className="col-md-2 col-sm-4">
                            <div className="btn_area">
                                <Button color="primary" className={"mr-10 border-0 rounded-0  perverbtn" + ((this.state.FromDate === "" || this.state.ToDate === "") ? " disabled" : "")} onClick={(e) => this.getHistoryData(e)}><IntlMessages id="widgets.apply" /></Button>
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <DepositWithdrawHistory
                    name="withdraw"
                    loading={this.props.withdrawhistoryLoading}
                    history={this.props.withdrawhistory}
                    darkMode={this.props.darkMode}
                    resendMailConfirmation={this.resendMailConfirmation}
                    title={<IntlMessages id="wallet.withdrawTableTile" />} />
            </div>
        )
    }
}

const mapDispatchToProps = ({ withdrawHistory, settings }) => {
    const { darkMode } = settings;
    const { withdrawhistory, withdrawhistoryLoading, resendMailResponse } = withdrawHistory;
    return { withdrawhistory, withdrawhistoryLoading, darkMode, resendMailResponse };
}

export default connect(mapDispatchToProps, {
    getWithdrawalHistory,
    resendMailConfirmation
})(history);
