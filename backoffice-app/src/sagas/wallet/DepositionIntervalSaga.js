import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_DEPOSITION_INTERVAL_LIST, ADD_DEPOSITION_INTERVAL } from '../../actions/ActionTypes';
import { getDepositionIntervalListFailure, getDepositionIntervalListSuccess, addDepositionIntervalSuccess, addDepositionIntervalFailure } from '../../actions/Wallet/DepositionIntervalActions';

export default function* DepositionIntervalSaga() {
    // To register Get Deposition Interval List method
    yield takeEvery(GET_DEPOSITION_INTERVAL_LIST, getDepositionIntervalList);
    // To register Add Deposition Interval List method
    yield takeEvery(ADD_DEPOSITION_INTERVAL, addDepositionInterval);
}

// Generator for Get Deposition Interval List
function* getDepositionIntervalList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Deposition Interval List Data Api
        const data = yield call(swaggerGetAPI, Method.ListDepositionInterval, {}, headers);

        // To set Deposition Interval List success response to reducer
        yield put(getDepositionIntervalListSuccess(data));
    } catch (error) {
        // To set Deposition Interval List failure response to reducer
        yield put(getDepositionIntervalListFailure(error));
    }
}

// Generator for Add Deposition Interval 
function* addDepositionInterval({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Deposition Interval Data Api
        const data = yield call(swaggerPostAPI, Method.AddDepositionInterval, payload, headers);

        // To Add Deposition Interval success response to reducer
        yield put(addDepositionIntervalSuccess(data));
    } catch (error) {
        // To Add Deposition Interval failure response to reducer
        yield put(addDepositionIntervalFailure(error));
    }
}