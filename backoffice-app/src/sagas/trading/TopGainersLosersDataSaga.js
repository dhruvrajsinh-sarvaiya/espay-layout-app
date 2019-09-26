import { put, call, takeEvery, select } from 'redux-saga/effects';
import { GET_TOP_GAINERS_LOSERS_DATA } from '../../actions/ActionTypes';
import { getTopGainersLosersSuccess, getTopGainersLosersFailure } from '../../actions/Trading/TopGainerLoserActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

export default function* topGainersLossersDataSagaBO() {

    //For get top gainers
    yield takeEvery(GET_TOP_GAINERS_LOSERS_DATA, getTopGainersLosers);
}

function* getTopGainersLosers({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = Method.GetTopLooserGainerPair
        // Add IsMargin params in request url if IsMargin payload is 1
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        // To call top gainer and looser Data Api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set top gainer and looser success response to reducer
        yield put(getTopGainersLosersSuccess(response))
    } catch (e) {

        // To set top gainer and looser failure response to reducer
        yield put(getTopGainersLosersFailure(e.message))
    }
}