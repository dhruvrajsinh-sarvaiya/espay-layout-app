import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_TOP_LOSERS_DATA } from '../../actions/ActionTypes';
import { getTopLosersSuccess, getTopLosersFailure } from '../../actions/Trading/TopLoserActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

export default function* topLosersDataSagaBO() {

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

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = Method.GetTopLooserPair + '/' + payload.type
        // Add IsMargin params in request url if IsMargin payload is 1
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        // To call top loser Data Api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set top loser success response to reducer
        yield put(getTopLosersSuccess(response))
    } catch (e) {

        // To set top loser failure response to reducer
        yield put(getTopLosersFailure(e.message))
    }
}