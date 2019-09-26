import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_GRAPH_DETAIL } from '../../actions/ActionTypes';
import { getGraphDataSuccess, getGraphDataFailure } from '../../actions/Trading/TradingChartActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

export default function* tradeChartBOSaga() {

    //For get trade graph data
    yield takeEvery(GET_GRAPH_DETAIL, getTradeGraphData);
}

function* getTradeGraphData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = Method.GetBackOfficeGraphDetail + '/' + payload.Pair + '/' + payload.interval

        // Add IsMargin params in request url if IsMargin payload is 1
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        // To call Trade Graph Data Api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set Trade Graph Data success response to reducer
        yield put(getGraphDataSuccess(response))
    } catch (e) {
        // To set Trade Graph Data failure response to reducer
        yield put(getGraphDataFailure(e.message))
    }
}