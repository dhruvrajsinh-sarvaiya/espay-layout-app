import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { getLeverageReqListSuccess, getLeverageReqListFailure } from '../../actions/Margin/LeverageRequestActions';
import { GET_LEVERAGE_REQUEST_LIST } from '../../actions/ActionTypes';

export default function* LeverageRequestSaga() {
    // To register Leverage Request List method
    yield takeEvery(GET_LEVERAGE_REQUEST_LIST, getLeverageRequestList);
}

// Generator for Get Leverage Request List
function* getLeverageRequestList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let Request = Method.LeveragePendingReport + '/' + payload.PageNo + '/' + payload.PageSize;

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
        if (payload.WalletTypeId !== undefined && payload.WalletTypeId !== '') {
            obj = {
                ...obj,
                WalletTypeId: payload.WalletTypeId
            }
        }
        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = {
                ...obj,
                UserId: payload.UserId
            }
        }
        // Create New Request
        let newRequest = Request + queryBuilder(obj)

        // To call Get Leverage Request List Data Api
        const data = yield call(swaggerGetAPI, newRequest, obj, headers);

        // To set Get Leverage Request List success response to reducer
        yield put(getLeverageReqListSuccess(data));
    } catch (error) {
        // To set Get Leverage Request List failure response to reducer
        yield put(getLeverageReqListFailure());
    }
}