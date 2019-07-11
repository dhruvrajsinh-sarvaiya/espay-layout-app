/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    File Comment : History -> Deposit index file component
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
// Deposit History Actions
import {
    getDepositHistory
} from 'Actions/Deposit';
/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    Comment : deposit history root componet
*/

class history extends Component {
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
        this.props.getDepositHistory(reqObj);
    }
    onChangeDate(e, key) {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
    }
    getHistoryData(e) {
        e.preventDefault();
        if (this.state.FromDate != "" && this.state.ToDate != "") {
            this.props.getDepositHistory(this.state);
        }
    }
    render() {
        return (
            <div className="History pb-30">
                <PageTitleBar title={<IntlMessages id="wallet.historyDepositTitle" />} match={this.props.match} />
                <JbsCollapsibleCard>
                    <div className="top-filter row deposite-search">
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
                            <Button color="primary" className={"mr-10 border-0 rounded-0 perverbtn " + ((this.state.FromDate === "" || this.state.ToDate === "") ? " disabled" : "")} onClick={(e) => this.getHistoryData(e)}><IntlMessages id="widgets.apply" /></Button>
                            </div>
                        </FormGroup>
                    </div>
                </JbsCollapsibleCard>
                <DepositWithdrawHistory
                    name="deposit"
                    loading={this.props.deposithistoryLoading}
                    history={this.props.deposithistory}
                    darkMode={this.props.darkMode}
                    title={<IntlMessages id="wallet.depositTableTile" />} />
            </div>
        )
    }
}

const mapDispatchToProps = ({ depositHistory, settings }) => {
    const { darkMode } = settings;
    const { deposithistory, deposithistoryLoading } = depositHistory;
    return { deposithistory, deposithistoryLoading, darkMode };
}

export default connect(mapDispatchToProps, {
    getDepositHistory
})(history);
