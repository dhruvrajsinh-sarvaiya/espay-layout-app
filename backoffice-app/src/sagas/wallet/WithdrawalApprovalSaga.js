import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { parseIntVal } from '../../controllers/CommonUtils';
import { getWithdrawalApprovalListSuccess, getWithdrawalApprovalListFailure, acceptRejectWithdrawalReqSuccess, acceptRejectWithdrawalReqFailure } from '../../actions/Wallet/WithdrawalApprovalActions';
import { GET_WITHDRAWAL_APPROVAL_LIST, ACCEPT_REJECT_WITHDRAWAL_REQ } from '../../actions/ActionTypes';

export default function* WithdrawalApprovalSaga() {
    // To register Get Withdrawal Approval List method
    yield takeEvery(GET_WITHDRAWAL_APPROVAL_LIST, getWithdrawalApprovalList);
    // To register Get Accept Reject Withdrawal Approval method
    yield takeEvery(ACCEPT_REJECT_WITHDRAWAL_REQ, acceptRejectWithdrawalApproval);
}

// Generator for Get Withdrawal Approval List
function* getWithdrawalApprovalList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request
        let obj = {}

        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }
        if (payload.TrnNo !== undefined && payload.TrnNo !== '') {
            obj = {
                ...obj,
                TrnNo: parseIntVal(payload.TrnNo)
            }
        }
        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj,
                Status: parseIntVal(payload.Status)
            }
        }

        // Create New Request
        let newRequest = Method.ListWithdrawalRequest + queryBuilder(obj)

        // To call Withdrawal Approval List Data Api
        const data = yield call(swaggerGetAPI, newRequest, obj, headers);

        // To set Withdrawal Approval List success response to reducer
        yield put(getWithdrawalApprovalListSuccess(data));
    } catch (error) {
        // To set Withdrawal Approval List failure response to reducer
        yield put(getWithdrawalApprovalListFailure());
    }
}

// Generator for Accept Reject Withdrawal Approval
function* acceptRejectWithdrawalApproval({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Accept Reject Withdrawal Approval Data Api
        const data = yield call(swaggerPostAPI, Method.AcceptRejectWithdrawalRequest, payload, headers);

        // To set Accept Reject Withdrawal Approval success response to reducer
        yield put(acceptRejectWithdrawalReqSuccess(data));
    } catch (error) {
        // To set Accept Reject Withdrawal Approval failure response to reducer
        yield put(acceptRejectWithdrawalReqFailure());
    }
}