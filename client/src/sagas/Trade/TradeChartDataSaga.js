// sagas For Trade Chart Data Actions By Tejas Date : 25/9/2018

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// types for set actions and reducers
import { GET_CHART_DATA,GET_MARKET_DEPTH } from 'Actions/types';

// action sfor set data or response
import {
    getChartDataSuccess,
    getChartDataFailure,
    getMarketDepthSuccess,
    getMarketDepthFailure
} from 'Actions/Trade';
import { swaggerGetAPI } from 'Helpers/helpers';

// Sagas Function for get Chart data by :Tejas Date : 25/9/2018
function* getChartData() {
    yield takeEvery(GET_CHART_DATA, getChartDataDetail)
}

// Function for Chart data
function* getChartDataDetail({ payload }) {

    try {

        // code changed by devang parekh for handling margintrading data (23-2-2019)
        var isMargin = '';
        if(payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
            isMargin = '?IsMargin=1';
        }
        // end
        
        const response = yield call(swaggerGetAPI, 'api/Transaction/GetGraphDetail/' + payload.Pair + "/" + payload.Interval+isMargin, {});
        if (response.ReturnCode === 0) {
            yield put(getChartDataSuccess(response));
        } else {
            yield put(getChartDataFailure(response));
        }

    } catch (error) {
        yield put(getChartDataFailure(error));
    }

}

// Sagas Function for get Market Depth data by :Tejas Date :12/1/2019
function* getMarketDepth() {
    yield takeEvery(GET_MARKET_DEPTH, getMarketDepthDetail)
}

// Function for Open Oders
function* getMarketDepthDetail({ payload }) {

    try {

        // code changed by devang parekh for handling margintrading data (23-2-2019)
        var isMargin = '';
        if(payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
            isMargin = '?IsMargin=1';
        }
        // end

        const response = yield call(swaggerGetAPI, 'api/Transaction/GetMarketDepthChart/' + payload.Pair+isMargin, {});
        if (response.ReturnCode === 0) {
            yield put(getMarketDepthSuccess(response));
        } else {
            yield put(getMarketDepthFailure(response));
        }

    } catch (error) {
        yield put(getMarketDepthFailure(error));
    }

}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getChartData),
        fork(getMarketDepth),
    ]);
}