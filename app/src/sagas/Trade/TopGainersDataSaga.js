import { put, call, takeEvery } from 'redux-saga/effects';
import { GET_TOP_GAINERS_DATA } from '../../actions/ActionTypes';
import { getTopGainersSuccess, getTopGainersFailure } from '../../actions/Trade/TopGainerLoser/TopGainerActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';

export default function* topGainersDataSaga() {

    //For get top gainers
    yield takeEvery(GET_TOP_GAINERS_DATA, getTopGainers);
}

function* getTopGainers({ payload }) {
    try {
        // Type : 
        // 1 - Volume Wise
        // 2 - Change Per Wise
        // 3 - LTP Wise
        // 4 - ChnageValue Wise
        const response = yield call(swaggerGetAPI, Method.GetFrontTopGainerPair + '/' + payload.type, {});
        yield put(getTopGainersSuccess(response))
    } catch (e) {
        yield put(getTopGainersFailure(e.message))
    }
}