import { GET_OUTGOINGTRANSACTONS_REPORT, GET_INCOMINGTRANSACTONS_REPORT } from '../actions/ActionTypes';
// import functions from action
import {
    getOutgoingTransactionsReportSuccess,
    getOutgoingTransactionsReportFailure,
    getIncomingTransactionsReportSuccess,
    getIncomingTransactionsReportFailure
} from "../actions/Reports/TradeInOutAction";

import { call, select, put, takeLatest } from 'redux-saga/effects';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerGetAPI } from '../api/helper';

function* getOutGoingTransactionsReportSocket() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Outgoing Transaction Report api
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetOutGoingTransaction, {}, headers);

        // To set Outgoing Transation Report success response to reducer
        yield put(getOutgoingTransactionsReportSuccess(responseFromSocket));
    } catch (error) {
        // To set Outgoing Transation Report failure response to reducer
        yield put(getOutgoingTransactionsReportFailure(error));
    }
}

function* getIncomingTransactionsReportSocket() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Incoming Transaction Report api
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetIncomingTransaction, {}, headers);

        // To set Incoming Transation Report success response to reducer
        yield put(getIncomingTransactionsReportSuccess(responseFromSocket));
    } catch (error) {
        // To set Incoming Transation Report failure response to reducer
        yield put(getIncomingTransactionsReportFailure(error));
    }
}

function* TransferInOutSaga() {
    //Call For Get OutGoing Transaction Data
    yield takeLatest(GET_OUTGOINGTRANSACTONS_REPORT, getOutGoingTransactionsReportSocket);
    //Call For Get In Comming Transaction Data
    yield takeLatest(GET_INCOMINGTRANSACTONS_REPORT, getIncomingTransactionsReportSocket)
}

export default TransferInOutSaga
