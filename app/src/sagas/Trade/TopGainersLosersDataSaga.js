import { put, call, takeEvery } from 'redux-saga/effects';
import { GET_TOP_GAINERS_LOSERS_DATA } from '../../actions/ActionTypes';
import { getTopGainersLosersSuccess, getTopGainersLosersFailure } from '../../actions/Trade/TopGainerLoser/TopGainerLoserActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';

export default function* topGainersLossersDataSaga() {

    //For get top gainers
    yield takeEvery(GET_TOP_GAINERS_LOSERS_DATA, getTopGainersLosers);
}

function* getTopGainersLosers() {
    try {
        const response = yield call(swaggerGetAPI, Method.GetFrontTopLooserGainerPair, {});
        yield put(getTopGainersLosersSuccess(response))
    } catch (e) {
        yield put(getTopGainersLosersFailure(e.message))
    }
}