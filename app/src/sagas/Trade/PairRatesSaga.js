import {
    GET_PAIR_RATES,
} from '../../actions/ActionTypes'

import { put, call, takeLatest } from 'redux-saga/effects';
import { Method } from '../../controllers/Constants';
import { swaggerGetAPI } from '../../api/helper';
import { getPairRatesSuccess, getPairRatesFailure } from '../../actions/Trade/PairRatesActions';

export default function* pairRatesSaga() {

    //For getting selected currency pair rates
    yield takeLatest(GET_PAIR_RATES, fetchPairRates);
}

function* fetchPairRates({ payload }) {
    try {
        let url = Method.GetPairRates + '/' + payload.PairName;
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }
        const response = yield call(swaggerGetAPI, url, {});
        yield put(getPairRatesSuccess(response))
    } catch (error) {
        yield put(getPairRatesFailure());
    }
}