import { put, call, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI } from '../../api/helper';
import { GET_CHARGES_LIST, } from '../../actions/ActionTypes'
import { getChargesListSuccess, getChargesListFailure } from '../../actions/Trade/ChargeListActions';
import { Method } from '../../controllers/Constants';

export default function* chargeListSaga() {

    // For getting charges list
    yield takeEvery(GET_CHARGES_LIST, getChargeListData);
}

//To get charges list
function* getChargeListData({ payload }) {
    try {
        const response = yield call(swaggerGetAPI, Method.ListChargesTypeWise, payload);
        yield put(getChargesListSuccess(response))
    } catch (error) {
        yield put(getChargesListFailure());
    }
}