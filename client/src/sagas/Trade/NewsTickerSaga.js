// sagas For News Ticker Actions By Tejas Date : 14/9/2018

// for call api call or API Call
import api from 'Api';

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// types for set actions and reducers
import { GET_NEWS_TICKER_LIST, GET_TICKERS_LIST } from 'Actions/types';

// action for set data or response
import {
    getNewsTickerListSuccess,
    getNewsTickerListFailure,
    getTickersListSuccess,
    getTickersListFailure
} from 'Actions/Trade';

// Sagas Function for get News Ticker data by :Tejas Date : 14/9/2018
function* getNewsTickerList() {
    yield takeEvery(GET_NEWS_TICKER_LIST, getNewsTickerListData)
}

// Function for set response to data and Call Function for Api Call
function* getNewsTickerListData({payload}) {
    const { Pair } = payload;
    //console.log(Pair)
    try {
        const response = yield call(getNewsTickerListRequest,Pair)

        // set response if its available else set error message
        if (response && response != null && response != undefined) {
            yield put(getNewsTickerListSuccess(response))
        } else {
            yield put(getNewsTickerListFailure(error))
        }
    } catch (error) {
        yield put(getNewsTickerListFailure(error))
    }
}

// function for Call api and set response 
const getNewsTickerListRequest = async (newstickerListRequest) =>
    await api.get('newsTicker.js')
    //.then(console.log('API',newstickerListRequest))   
        .then(response => response)
        .catch(error => error)


// Sagas Function for get News Ticker data by :Tejas Date : 14/9/2018
function* getTickersList() {
    yield takeEvery(GET_TICKERS_LIST, getTickersListData)
}

// Function for set response to data and Call Function for Api Call
function* getTickersListData({payload}) {
    try {
        const response = yield call(getTickersListRequest,payload.tickerListRequest)

        // set response if its available else set error message
        if (response && response != null && response != undefined) {
            yield put(getTickersListSuccess(response))
        } else {
            yield put(getTickersListFailure(error))
        }
    } catch (error) {
        yield put(getTickersListFailure(error))
    }
}

// function for Call api and set response 
const getTickersListRequest = async (tickerListRequest) =>
    await api.get('Tickers.js')
        .then(response => response)
        .catch(error => error)

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getNewsTickerList),
        fork(getTickersList),
    ]);
}