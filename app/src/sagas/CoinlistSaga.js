import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
import { GET_COINLIST, } from '../actions/ActionTypes';
import { getCoinlistSuccess, getCoinlistFailure } from '../actions/CMS/CoinlistActions';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerGetAPI } from '../api/helper';

//Function for Get Coin List API
function* getCoinlistAPI() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Coin List api
        const response = yield call(swaggerGetAPI, Method.GetAllServiceConfiguration, {}, headers);

        // To set Coin List success response to reducer
        yield put(getCoinlistSuccess(response));
    } catch (error) {
        // To set Coin List failure response to reducer
        yield put(getCoinlistFailure(error));
    }
}

//Get Coinlist
export function* getCoinlist() {
    yield takeLatest(GET_COINLIST, getCoinlistAPI);
}

// Coinlist Root Saga
export default function* rootSaga() {
    // To register getCoinlist method
    yield all([fork(getCoinlist)]);
}