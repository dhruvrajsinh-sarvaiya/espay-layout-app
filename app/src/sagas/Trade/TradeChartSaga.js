import {
    GET_GRAPH_DETAILS,
} from '../../actions/ActionTypes'
import { put, call, takeLatest } from 'redux-saga/effects';
import { Method } from '../../controllers/Constants';
import { swaggerGetAPI } from '../../api/helper';
import { getGraphDetailsSuccess, getGraphDetailsFailure } from '../../actions/Trade/TradeChartAction';

export default function* tradeChartSaga() {
    //For getting Graph Details
    yield takeLatest(GET_GRAPH_DETAILS, fetchGraphDetails);
}

function* fetchGraphDetails({ params }) {
    try {
        let url = Method.GetGraphDetail + '/' + params.pairName + '/' + params.interval;
        if (params.IsMargin !== undefined && params.IsMargin != 0) {
            url += '?IsMargin=' + params.IsMargin;
        }
        const response = yield call(swaggerGetAPI, url, {});
        yield put(getGraphDetailsSuccess(response))
    } catch (error) {
        yield put(getGraphDetailsFailure());
    }
}