import { put, takeEvery, select, call } from 'redux-saga/effects';
import { GET_CONFLICT_HISTORY, CONFLICT_RECON_PROCESS } from '../../actions/ActionTypes';
import { getConflictHistorySuccess, getConflictHistoryFailure, conflictReconProcessFailure, conflictReconProcessSuccess } from '../../actions/Arbitrage/ConflictHistoryActions';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI } from '../../api/helper';
import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Constants';
import { logger } from '../../controllers/CommonUtils';

export default function* ConflictHistorySaga() {
    // To register Get Conflict History method
    yield takeEvery(GET_CONFLICT_HISTORY, getConflictHistory)
    // To register Conflict Recon method
    yield takeEvery(CONFLICT_RECON_PROCESS, conflictReconProcessApi)
}

// Generator for Get Conflict History
function* getConflictHistory({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let methodName

        if (payload.screenType == 1)
            methodName = Method.ListLPWalletMismatch
        else
            methodName = Method.ListLPArbitrageWalletMismatch

        // Create request url
        var URL = methodName + '/' + payload.FromDate + "/" + payload.ToDate + '/' + payload.PageNo + "/" + payload.PageSize;


        let request = {};

        if (payload.WalletId !== undefined && payload.WalletId !== '') {
            request = { ...request, WalletId: payload.WalletId }
        }
        if (payload.SerProID !== undefined && payload.SerProID !== '') {
            request = { ...request, SerProID: payload.SerProID }
        }
        if (payload.Status !== undefined && payload.Status !== '') {
            request = { ...request, Status: payload.Status }
        }

        // To call Get Conflict History Data Api
        const data = yield call(swaggerGetAPI, URL + queryBuilder(request), {}, headers);

        // To set Get Conflict History success response to reducer
        yield put(getConflictHistorySuccess(data));
    } catch (error) {
        logger(error)
        // To set Get Conflict History failure response to reducer
        yield put(getConflictHistoryFailure());
    }
}

// Generator for Conflict Recon
function* conflictReconProcessApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let methodName

        if (payload.screenType == 1)
            methodName = Method.LPWalletRecon
        else
            methodName = Method.ArbitrageRecon

        // screenType is not include in request 
        delete payload['screenType']

        // To call Get Conflict History Data Api
        const data = yield call(swaggerPostAPI, methodName, payload, headers);

        // To set Conflict Recon success response to reducer
        yield put(conflictReconProcessSuccess(data));
    } catch (error) {
        // To set Conflict Recon failure response to reducer
        yield put(conflictReconProcessFailure());
    }
}