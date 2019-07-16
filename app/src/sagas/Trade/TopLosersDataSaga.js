import { put, call, takeEvery } from 'redux-saga/effects';
import { GET_TOP_LOSERS_DATA } from '../../actions/ActionTypes';
import { getTopLosersSuccess, getTopLosersFailure } from '../../actions/Trade/TopGainerLoser/TopLoserActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';

export default function* topLosersDataSaga() {

    //For get top losers
    yield takeEvery(GET_TOP_LOSERS_DATA, getTopLosers);
}

function* getTopLosers({ payload }) {
    try {

        // Type : 
        // 1 - Volume Wise
        // 2 - Change Per Wise
        // 3 - LTP Wise
        // 4 - ChnageValue Wise

        const response = yield call(swaggerGetAPI, Method.GetFrontTopLooserPair + '/' + payload.type, {});
        yield put(getTopLosersSuccess(response))
    } catch (e) {
        yield put(getTopLosersFailure(e.message))
    }
}