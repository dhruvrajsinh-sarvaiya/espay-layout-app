// CoinListFieldSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { WebPageUrlGetApi, WebPageUrlPutAPI } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_COIN_LIST_FIELDS, UPDATE_COIN_LIST_FIELDS } from '../../actions/ActionTypes';
import {
    getCoinListFieldDataSuccess, getCoinListFieldDataFailure,
    updateCoinListFieldDataSuccess, updateCoinListFieldDataFailure
} from '../../actions/CMS/CoinListFieldAction';

export default function* CoinListFieldSaga() {
    // To register Get Coin List Field List method
    yield takeEvery(GET_COIN_LIST_FIELDS, getCoinListField)
    yield takeEvery(UPDATE_COIN_LIST_FIELDS, updateCoinListField)
}

// Generator for Get Coin List Field
function* getCoinListField() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };

        // To call Get Coin List Field Data Api
        const data = yield call(WebPageUrlGetApi, Method.coinListRequest, {}, headers)

        // To set Get Coin List Field success response to reducer
        yield put(getCoinListFieldDataSuccess(data))
    } catch (error) {
        // To set Get Coin List Field failure response to reducer
        yield put(getCoinListFieldDataFailure())
    }
}
// Generator for Update Coin List Field
function* updateCoinListField({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };

        // To call Update Coin List Field Data Api
        const data = yield call(WebPageUrlPutAPI, Method.editCoinListField, { coinListdata: payload }, headers)

        // To set updated Coin List Field success response to reducer
        yield put(updateCoinListFieldDataSuccess(data))
    } catch (error) {
        // To set updated Coin List Field failure response to reducer
        yield put(updateCoinListFieldDataFailure())
    }
}