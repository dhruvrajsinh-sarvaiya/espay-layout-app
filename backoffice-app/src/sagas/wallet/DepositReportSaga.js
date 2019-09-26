
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { parseIntVal } from '../../controllers/CommonUtils';
import { getDepositReportSuccess, getDepositReportFailure, depositReconProcessSuccess, depositReconProcessFailure } from '../../actions/Wallet/DepositReportAction';
import { GET_DEPOSIT_REPORT, DEPOSIT_RECON_PROCESS } from '../../actions/ActionTypes';

export default function* DepositReportSaga() {
    // To register Get Deposit Report List method
    yield takeEvery(GET_DEPOSIT_REPORT, getDepositReportList)
    // To register Get Deposit Report List method
    yield takeEvery(DEPOSIT_RECON_PROCESS, getDepositReconData)
}

// Generator for Deposit Recon List
function* getDepositReconData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Deposit Recon List Data Api
        const data = yield call(swaggerPostAPI, Method.DepositionReconProcess, payload, headers);

        // To set Get Deposit Recon List success response to reducer
        yield put(depositReconProcessSuccess(data));
    } catch (error) {
        // To set Get Deposit Recon List failure response to reducer
        yield put(depositReconProcessFailure());
    }
}

// Generator for Get Deposit Report
function* getDepositReportList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let Request = Method.DepositionReport + '/' + payload.FromDate + '/' + payload.ToDate + '/' + payload.PageNo + '/' + payload.PageSize;

        // create request
        let obj = {}

        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = {
                ...obj, UserID: parseIntVal(payload.UserId)
            }
        }
        if (payload.CoinName !== undefined && payload.CoinName !== '') {
            obj = { ...obj, CoinName: payload.CoinName }
        }
        if (payload.Address !== undefined && payload.Address !== '') {
            obj = {
                ...obj,
                Address: payload.Address
            }
        }
        if (payload.Status !== undefined && payload.Status !== '') {
            obj = { ...obj, Status: parseIntVal(payload.Status) }
        }
        if (payload.OrgId !== undefined && payload.OrgId !== '') {
            obj = {
                ...obj,
                OrgId: parseIntVal(payload.OrgId)
            }
        }
        if (payload.TrnId !== undefined && payload.TrnId !== '') {
            obj = {
                ...obj, TrnID: payload.TrnId
            }
        }

        // Create New Request
        let newRequest = Request + queryBuilder(obj)

        // To call Get Deposit Report Data Api
        const data = yield call(swaggerGetAPI, newRequest, obj, headers);

        // To set Get Deposit Report success response to reducer
        yield put(getDepositReportSuccess(data));
    } catch (error) {
        // To set Get Deposit Report failure response to reducer
        yield put(getDepositReportFailure());
    }
}