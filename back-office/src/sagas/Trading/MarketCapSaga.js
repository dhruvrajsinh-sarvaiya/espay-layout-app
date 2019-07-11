/* 
    Createdby : Devang Parekh
    CreatedDate : 26-12-2018
    Description : Coin Slider Saga for call and get coin slider infromation
*/

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//import action types
import {
    MARKET_CAP_LIST,
    //ADD_MARKET_CAP,
    EDIT_MARKET_CAP,
} from 'Actions/types';

//import function from action
import {
    getMarketCapListSuccess,
    getMarketCapListFailure,
    // addMarketCapSuccess,
    // addMarketCapSuccessFailure,
    editMarketCapSuccess,
    editMarketCapFailure,
} from 'Actions/Trading';

// import call to swagger api
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';
//added by parth andhariya
//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';
// get detail from swagger list
function* getMarketCapListAPI({ payload }) {
    var request = payload;
    try {
        //added by parth andhariya
        var IsMargin = '';
        if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
            IsMargin += "?&IsMargin=" + request.IsMargin;
        }
		var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetMarketTickerPairData' + IsMargin, request,headers);
        if (response.ReturnCode === 0) {
            yield put(getMarketCapListSuccess(response.Response));
        } else {
            yield put(getMarketCapListFailure(response));
        }

    } catch (error) {
        yield put(getMarketCapListFailure(error));
    }

}

// intiate saga function 
export function* getMarketCapList() {
    yield takeEvery(MARKET_CAP_LIST, getMarketCapListAPI);
}

// get detail from swagger list
function* editMarketCapAPI({ payload }) {
    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateMarketTickerPairData', payload, headers);

        // set response if its available else set error message
        if (response != null && response.ReturnCode === 0) {
            yield put(editMarketCapSuccess(response));
        } else {
            yield put(editMarketCapFailure(response));
        }
    } catch (error) {
        yield put(editMarketCapFailure(error));
    }

}

// intiate saga function 
export function* editMarketCapDetail() {
    yield takeEvery(EDIT_MARKET_CAP, editMarketCapAPI);
}

// manage saga function
export default function* rootSaga() {
    yield all([
        fork(getMarketCapList),
        //fork(addMarketCap),
        fork(editMarketCapDetail)
    ]);
}