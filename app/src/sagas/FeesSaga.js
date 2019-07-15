import { GET_WALLET_TYPE_CHARGES_LIST } from '../actions/ActionTypes'
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { Method } from '../controllers/Constants';
import { swaggerGetAPI } from '../api/helper';
import { getFeesListsSuccess, getFeesListsFailure } from '../actions/Fees/FeesAction';
import { userAccessToken } from '../selector';

export default function* FeesSaga() {
    // To register fetchFeesLists method
    yield takeLatest(GET_WALLET_TYPE_CHARGES_LIST, fetchFeesLists);
}

function* fetchFeesLists() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Fees List api
        const response = yield call(swaggerGetAPI, Method.ListChargesTypeWise, {}, headers);

        // To set Fees List success response to reducer
        yield put(getFeesListsSuccess(response));
    } catch (e) {
        // To set Fees List failure response to reducer
        yield put(getFeesListsFailure(e))
    }
}