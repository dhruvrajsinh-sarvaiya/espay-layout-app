import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_WITHDRAW_REPORT, WITHDRAW_RECON_PROCESS } from '../../actions/ActionTypes';
import { getWithdrawReportSuccess, getWithdrawReportFailure, withdrawReconProcessSuccess, withdrawReconProcessFailure } from '../../actions/Wallet/WithdrawReportActions';
import { parseIntVal } from '../../controllers/CommonUtils';

export default function* WithdrawReportSaga() {
    // To register Get Withdraw Report List method
    yield takeEvery(GET_WITHDRAW_REPORT, getWithdrawReportList);
    // To register Get Withdraw Report List method
    yield takeEvery(WITHDRAW_RECON_PROCESS, getWithdrawReconData);
}

// Generator for Withdraw Recon List
function* getWithdrawReconData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Withdraw Recon List Data Api
        const data = yield call(swaggerPostAPI, Method.WithdrawalRecon, payload, headers);

        // To set Get Withdraw Recon List success response to reducer
        yield put(withdrawReconProcessSuccess(data));
    } catch (error) {
        // To set Get Withdraw Recon List failure response to reducer
        yield put(withdrawReconProcessFailure());
    }
}

// Generator for Get Withdraw Report List
function* getWithdrawReportList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let Request = Method.WithdrawalReportv2 + '/' + payload.FromDate + '/' + payload.ToDate + '/' + payload.PageNo + '/' + payload.PageSize;

        // create request
        let obj = {}

        if (payload.CoinName !== undefined && payload.CoinName !== '') {
            obj = {
                ...obj,
                CoinName: payload.CoinName
            }
        }
        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = {
                ...obj,
                UserID: parseIntVal(payload.UserId)
            }
        }
        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj,
                Status: parseIntVal(payload.Status)
            }
        }
        if (payload.Address !== undefined && payload.Address !== '') {
            obj = {
                ...obj,
                Address: payload.Address
            }
        }
        if (payload.TrnId !== undefined && payload.TrnId !== '') {
            obj = {
                ...obj,
                TrnID: payload.TrnId
            }
        }
        if (payload.TrnNo !== undefined && payload.TrnNo !== '') {
            obj = {
                ...obj,
                TrnNo: payload.TrnNo
            }
        }
        if (payload.OrgId !== undefined && payload.OrgId !== '') {
            obj = {
                ...obj,
                OrgId: parseIntVal(payload.OrgId)
            }
        }

        // Create New Request
        let newRequest = Request + queryBuilder(obj)

        // To call Get Withdraw Report List Data Api
        const data = yield call(swaggerGetAPI, newRequest, obj, headers);

        // To set Get Withdraw Report List success response to reducer
        yield put(getWithdrawReportSuccess(data));
    } catch (error) {
        // To set Get Withdraw Report List failure response to reducer
        yield put(getWithdrawReportFailure());
    }
}