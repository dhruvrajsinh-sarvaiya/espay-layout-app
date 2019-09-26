import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_TOP_GAINERS_DATA } from '../../actions/ActionTypes';
import { getTopGainersSuccess, getTopGainersFailure } from '../../actions/Trading/TopGainerActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

export default function* topGainersDataSagaBO() {

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

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = Method.GetTopGainerPair + '/' + payload.type
        
        // Add IsMargin params in request url if IsMargin payload is 1
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }
        // To call top gainer Data Api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set top gainer success response to reducer
        yield put(getTopGainersSuccess(response))
    } catch (e) {

        // To set top gainer failure response to reducer
        yield put(getTopGainersFailure(e.message))
    }
}