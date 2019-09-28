// MarketMakingSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_MARKING_MAKING_LIST, CHANGE_MARKING_MAKING_STATUS } from '../../actions/ActionTypes';
import {
    getMarketMakingListSuccess, getMarketMakingListFailure,
    changeMarketMakingStatusSuccess, changeMarketMakingStatusFailure
} from '../../actions/Trading/MarketMakingActions';

export default function* MarketMakingSaga() {
    // To register Get Market Making List method
    yield takeEvery(GET_MARKING_MAKING_LIST, marginMakingList)
    // To register Change Marketing Making Status method
    yield takeEvery(CHANGE_MARKING_MAKING_STATUS, changeMarketMakingStatus)
}

// Generator for Get Market Making
function* marginMakingList() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Market Making Data Api
        const data = yield call(swaggerGetAPI, Method.TradingConfigurationList, {}, headers)

        // To set Get Market Making success response to reducer
        yield put(getMarketMakingListSuccess(data))
    } catch (error) {
        // To set Get Market Making failure response to reducer
        yield put(getMarketMakingListFailure())
    }
}
// Generator for change Market Making status
function* changeMarketMakingStatus({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call change Market Making status Data Api
        const data = yield call(swaggerPostAPI, Method.ChangeTradingConfigurationStatus, payload, headers)

        // To set change Market Making status success response to reducer
        yield put(changeMarketMakingStatusSuccess(data))
    } catch (error) {
        // To set change Market Making status failure response to reducer
        yield put(changeMarketMakingStatusFailure())
    }
}