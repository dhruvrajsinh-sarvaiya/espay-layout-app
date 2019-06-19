/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : wallet approval page
*/
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import IntlMessages from "Util/IntlMessages";
import JbsCollapsibleCard from "Components/JbsCollapsibleCard/JbsCollapsibleCard";
import JbsSectionLoader from 'Components/JbsSectionLoader/JbsSectionLoader';
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import qs from 'query-string';
import AppConfig from 'Constants/AppConfig';
import Divider from "@material-ui/core/Divider";
import { NotificationManager } from 'react-notifications';
import { changeDateFormat } from "Helpers/helpers";
//initial state
const initState = {}
import {
    confirmaWithdraw
} from "Actions/Withdraw";
class withdrawConfirmation extends Component {
    state = initState;
    //will mount fetch data
    componentWillMount() {
        const parsed = qs.parse(location.search);
        //fetch from localstorage after login
        if (localStorage.getItem('RefNo') !== null && localStorage.getItem('Bit') !== null) {
            this.props.confirmaWithdraw({
                RefNo: localStorage.getItem('RefNo'),
                TransactionBit: localStorage.getItem('Bit'),
            });
            localStorage.removeItem("RefNo");
            localStorage.removeItem("Bit");
        } else if (parsed.Bit !== '' && parsed.RefNo !== '') {
            //if already loagin fetch from query string params
            this.props.confirmaWithdraw({
                RefNo: parsed.RefNo,
                TransactionBit: parsed.Bit,
            })
        } else {
            window.location.href = AppConfig.afterLoginRedirect;
        }
    }
    // will receive props get response validate
    componentWillReceiveProps(nextProps) {
        if (nextProps.confirmationResponse.hasOwnProperty("ReturnCode")) {
            if (nextProps.confirmationResponse.ReturnCode === 0) { // success
                NotificationManager.success(nextProps.confirmationResponse.ReturnMsg);
            } else if (nextProps.confirmationResponse.ReturnCode === 1) { // failed
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${nextProps.confirmationResponse.ErrorCode}`} />);
            }
        }
    }
    //render component
    render() {
        const { match } = this.props;
        const Response = (this.props.confirmationResponse.hasOwnProperty("Response") && this.props.confirmationResponse.Response !== null) ? this.props.confirmationResponse.Response : {};
        return (
            <Fragment>
                <PageTitleBar title={<IntlMessages id="sidebar.withdrawConfirmation" />} match={match} />
                <JbsCollapsibleCard
                    colClasses="col-sm-12 col-md-12 col-xl-12"
                >
                    {this.props.confirmationResponse.loading ? < JbsSectionLoader /> :
                        <div className="col-sm-6 offset-3">
                            <div className="col-sm-12 p-0 d-flex">
                                <h4 className="w-40 p-10 m-0">
                                    <strong>{<IntlMessages id="sidebar.withdrawDetails" />}</strong>
                                </h4>
                            </div>
                            <Divider />
                            <div className="col-sm-12 p-0 d-flex">
                                <h4 className="w-40 p-10 m-0">
                                    <IntlMessages id="tradeSummary.filterLabel.trnNo" />
                                </h4>
                                <h4 className="p-10 m-0">{Response.hasOwnProperty("TrnNo") ? Response.TrnNo : ""}</h4>
                            </div>
                            <Divider />
                            <div className="col-sm-12 p-0 d-flex">
                                <h4 className="w-40 p-10 m-0">
                                    <IntlMessages id="lable.address" />
                                </h4>
                                <h4 className="p-10 m-0">{Response.hasOwnProperty("TransactionAddress") ? Response.TransactionAddress : ""}</h4>
                            </div>
                            <Divider />
                            <div className="col-sm-12 p-0 d-flex">
                                <h4 className="w-40 p-10 m-0">
                                    <IntlMessages id="trading.holdingorder.label.currency" />
                                </h4>
                                <h4 className="p-10 m-0">{Response.hasOwnProperty("Currency") ? Response.Currency : ""}</h4>
                            </div>
                            <Divider />
                            <div className="col-sm-12 p-0 d-flex">
                                <h4 className="w-40 p-10 m-0">
                                    <IntlMessages id="trading.orders.label.amount" />
                                </h4>
                                <h4 className="p-10 m-0">{Response.hasOwnProperty("Amount") ? parseFloat(Response.Amount).toFixed(8) : ""}</h4>
                            </div>
                            <Divider />
                            <div className="col-sm-12 p-0 d-flex">
                                <h4 className="w-40 p-10 m-0">
                                    <IntlMessages id="trading.activeorders.label.fee" />
                                </h4>
                                <h4 className="p-10 m-0">{Response.hasOwnProperty("Fee") ? parseFloat(Response.Fee).toFixed(8) : ""}</h4>
                            </div>
                            <Divider />
                            <div className="col-sm-12 p-0 d-flex">
                                <h4 className="w-40 p-10 m-0">
                                    <IntlMessages id="widgets.date" />
                                </h4>
                                <h4 className="p-10 m-0">{Response.hasOwnProperty("TrnDate") ? changeDateFormat(Response.TrnDate, 'YYYY-MM-DD HH:mm:ss', false) : ""}</h4>
                            </div>
                            <Divider />
                            <div className="col-sm-12 p-0 d-flex">
                                <h4 className="w-40 p-10 m-0">
                                    <IntlMessages id="widgets.status" />
                                </h4>
                                <h4 className="p-10 m-0">{Response.hasOwnProperty("StatusMsg") ? Response.StatusMsg : ""}</h4>
                            </div>
                        </div>}
                </JbsCollapsibleCard>
            </Fragment>
        );
    }
}

// connect props for dispatch actions
const mapDispatchToProps = ({ withdrawApp, settings }) => {
    const { darkMode } = settings;
    const { confirmationResponse } = withdrawApp;
    return { darkMode, confirmationResponse };
};

export default connect(mapDispatchToProps, {
    confirmaWithdraw
})(withdrawConfirmation);
