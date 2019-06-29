// sagas For Pair List Actions By Tejas Date : 14/9/2018

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// types for set actions and reducers
import {
    GET_PAIR_LIST,
    GET_VOLUME_DATA,
    GET_BUYER_ORDER_LIST,
    GET_SELLER_ORDER_LIST,
    GET_MARKET_TRADE_HISTORY,
    GET_FAVOURITE_PAIR_LIST,
    ADD_PAIR_TO_FAVOURITE_PAIR,
    REMOVE_PAIR_FROM_FAVOURITE_PAIR,
} from 'Actions/types';

// action sfor set data or response
import {
    getPairListSuccess,
    getPairListFailure,
    getVolumeDataSuccess,
    getVolumeDataFailure,
    getBuyerOrderListSuccess,
    getBuyerOrderListFailure,
    getSellerOrderListSuccess,
    getSellerOrderListFailure,
    getMarketTradeHistorySuccess,
    getMarketTradeHistoryFailure,
    getFavouritePairListSuccess,
    addToFavouritePairListSuccess,
    addToFavouritePairListFailure,
} from 'Actions/Trade';

import AppConfig from 'Constants/AppConfig';
// import { swaggerGetAPI } from 'Helpers/helpers';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// function for call socket and handle socket response
function* getBuyerOrderData({ payload }) {

    try {

        // code changed by devang parekh for handling margintrading data (23-2-2019)
        var isMargin = '';
        if (payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
            isMargin = '?IsMargin=1';
        }
        // end

        const response = yield call(swaggerGetAPI, 'api/Transaction/GetBuyerBook/' + payload.Pair + isMargin, {});

        if (response.ReturnCode === 0) {
            yield put(getBuyerOrderListSuccess(response));
        } else {
            yield put(getBuyerOrderListFailure(response));
        }

    } catch (error) {
        yield put(getBuyerOrderListFailure(error));
    }

}

// Function for set response to data and Call Function for Api Call
function* getSellerOrderData({ payload }) {

    try {

        // code changed by devang parekh for handling margintrading data (23-2-2019)
        var isMargin = '';
        if (payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
            isMargin = '?IsMargin=1';
        }
        // end

        const response = yield call(swaggerGetAPI, 'api/Transaction/GetSellerBook/' + payload.Pair + isMargin, {});

        if (response.ReturnCode === 0) {
            yield put(getSellerOrderListSuccess(response));
        } else {
            yield put(getSellerOrderListFailure(response));
        }

    } catch (error) {
        yield put(getSellerOrderListFailure(error));
    }

}

// Function for set response to data and Call Function for Api Call
function* getMarketTradeHistoryData({ payload }) {

    try {

        // code changed by devang parekh for handling margintrading data (23-2-2019)
        var isMargin = '';
        if (payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
            isMargin = '&IsMargin=1';
        }
        // end

        const response = yield call(swaggerGetAPI, 'api/Transaction/GetOrderhistory?Pair=' + payload.Pair + isMargin, {});

        if (response.ReturnCode === 0) {
            yield put(getMarketTradeHistorySuccess(response));
        } else {
            yield put(getMarketTradeHistoryFailure(response));
        }

    } catch (error) {
        yield put(getMarketTradeHistoryFailure(error));
    }

}


// Function for PAIR LIST DATA
function* getPairListData({ payload }) {

    try {

        // code changed by devang parekh for handling margintrading data (23-2-2019)
        var isMargin = '';
        if (payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
            isMargin = '?IsMargin=1';
        }
        // end

        const response = yield call(swaggerGetAPI, 'api/Transaction/GetTradePairAsset' + isMargin, {});

        if (response.ReturnCode === 0) {
            yield put(getPairListSuccess(response));
        } else {
            yield put(getPairListFailure(response));
        }

    } catch (error) {
        yield put(getPairListFailure(error));
    }

}


// Function for Get Volume Data
function* getVolumeDataList({ payload }) {

    const { BasePair } = payload;

    try {

        const response = yield call(swaggerGetAPI, '/api/Transaction/GetVolumeData/' + BasePair, {});

        if (response.ReturnCode === 0) {
            yield put(getVolumeDataSuccess(response));
        } else {
            yield put(getVolumeDataFailure(response));
        }

    } catch (error) {
        yield put(getVolumeDataFailure(error));
    }

}

// Sagas Function for get pair list data by :Tejas Date : 14/9/2018
function* getVolumeData() {
    yield takeEvery(GET_VOLUME_DATA, getVolumeDataList)
}

// Sagas Function for get pair list data by :Tejas Date : 14/9/2018
function* getPairList() {
    yield takeEvery(GET_PAIR_LIST, getPairListData)
}

// Sagas Function for get Buyer Order list (using socket connection) data by :Tejas Date : 14/9/2018
function* getBuyerOrder() {
    yield takeEvery(GET_BUYER_ORDER_LIST, getBuyerOrderData)
}

// Sagas Function for get Seller Order list data by :Tejas Date : 14/9/2018
function* getSellerOrder() {
    yield takeEvery(GET_SELLER_ORDER_LIST, getSellerOrderData)
}

// Sagas Function for get Market Trade History list data by :Tejas Date : 14/9/2018
function* getMarketTradeHistory() {
    yield takeEvery(GET_MARKET_TRADE_HISTORY, getMarketTradeHistoryData)
}

function* getFavouritePairRequest({ payload }) {

    // code changed by devang parekh for handling margintrading data (23-2-2019)
    var isMargin = '';
    if (payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
        isMargin = '?IsMargin=1';
    }
    // end

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/Transaction/GetFavouritePair' + isMargin, {}, headers);

    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(getFavouritePairListSuccess(staticRes));
        } else if (response.statusCode === 200) {
            yield put(getFavouritePairListSuccess(response));
        } else {
            yield put(getFavouritePairListSuccess(response));
        }
    } catch (error) {
        yield put(getFavouritePairListSuccess(error));
    }

}

function* getFavouritePairList() {
    yield takeEvery(GET_FAVOURITE_PAIR_LIST, getFavouritePairRequest);
}

function* addToFavouritePairRequest({ payload }) {

    const { PairId } = payload;

    // code changed by devang parekh for handling margintrading data (23-2-2019)
    var isMargin = '';
    if (payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
        isMargin = '?IsMargin=1';
    }
    // end

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/AddToFavouritePair/' + PairId + isMargin, {}, headers);

    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(addToFavouritePairListFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(addToFavouritePairListSuccess(response));
        } else {
            yield put(addToFavouritePairListFailure(response));
        }
    } catch (error) {
        yield put(addToFavouritePairListFailure(error));
    }

}

function* addToFavouritePairList() {
    yield takeEvery(ADD_PAIR_TO_FAVOURITE_PAIR, addToFavouritePairRequest);
}

function* removeFromFavouritePairRequest({ payload }) {

    const { pair } = payload;

    // code changed by devang parekh for handling margintrading data (23-2-2019)
    var isMargin = '';
    if (payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
        isMargin = '?IsMargin=1';
    }
    // end

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/RemoveFromFavouritePair/' + pair + isMargin, {}, headers);

    try {

        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(addToFavouritePairListFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(addToFavouritePairListSuccess(response));
        } else {
            yield put(addToFavouritePairListFailure(response));
        }

    } catch (error) {
        yield put(addToFavouritePairListFailure(error));
    }

}

function* removeFromFavouritePairList() {
    yield takeEvery(REMOVE_PAIR_FROM_FAVOURITE_PAIR, removeFromFavouritePairRequest);
}


// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getPairList),
        fork(getBuyerOrder),
        fork(getMarketTradeHistory),
        fork(getSellerOrder),
        fork(getVolumeData),
        fork(getFavouritePairList),
        fork(addToFavouritePairList),
        fork(removeFromFavouritePairList)
    ]);
}