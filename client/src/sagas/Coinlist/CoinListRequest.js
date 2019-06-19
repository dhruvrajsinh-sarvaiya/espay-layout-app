/* 
    Createdby : Dhara gajera
    CreatedDate : 4-1-2019
    Description : Coinlist Saga Action from Fetch data from API 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

import {
    GET_COINLIST_REQUEST,
    ADD_COINLIST_REQUEST,
    GET_COUNTRY
} from 'Actions/types';

import {
    getCoinlistRequestSuccess,
    getCoinlistRequestFailure,
    addCoinListRequestFailure,
    addCoinListRequestSuccess,
    getCountrySuccess,
    getCountryFailure,
} from 'Actions/Coinlist';

/**
 * Send coin list Request
 */
const getCoinListRequestRequest = async () =>
await api.get('/api/private/v1/coinListRequest')
    .then(response => response)
    .catch(error => error);	
/**
 * Send coin list request request To Server API call
 */
const addNEWCoinListRequestData = async (coinListdata) =>
    await api.post('/api/private/v1/coinListRequest/addCoinListFieldsData', {coinListdata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));	

/**
 * Send Add Country Request To Server
 */
const getCountryRequest = async (countrydata) => await api.get('/api/private/v1/localization/country/listCountry/' + countrydata.page + '/' + countrydata.rowsPerPage + '/' + countrydata.searchValue + '/' + countrydata.orderBy + '/' + countrydata.sortOrder)
    .then(response => response.data)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function for Get Faq Category List API
function* getCoinListRequestAPI() {
    try {
        const response = yield call(getCoinListRequestRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getCoinlistRequestSuccess(response.data));
        }else{
            yield put(getCoinlistRequestFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getCoinlistRequestFailure(error));
    }
}
	
/**
 * Send coin list request form request To Server
 */
function* addCoinListRequstServer({payload}) {
    try {
        const response = yield call(addNEWCoinListRequestData, payload);
        //validate if data found in response 
        if (typeof response.data != undefined && response.data.responseCode==0) {
            yield put(addCoinListRequestSuccess(response.data));
        } else {
            yield put(addCoinListRequestFailure(response.data));
        }
    } catch (error) {
        yield put(addCoinListRequestFailure(error));
    }
}
/**
 * Get Country data From Server
 */
function* getCountryFromServer({ payload }) {
    try {
        const response = yield call(getCountryRequest, payload);

        if (typeof response.data != 'undefined' && response.responseCode == 0) {
            yield put(getCountrySuccess(response));
        } else {
            yield put(getCountryFailure(response));
        }

    } catch (error) {
        yield put(getCountryFailure(error));
    }
}
//Get Coinlist
export function* getCoinlistRequest() {
    yield takeEvery(GET_COINLIST_REQUEST, getCoinListRequestAPI);
}
/**
 * Add coin list request form in Saga
 */
export function* addNewCoinListRequstForm() {
    yield takeEvery(ADD_COINLIST_REQUEST, addCoinListRequstServer);
}
/**
 * Get Country
 */
export function* getCountry() {

    yield takeEvery(GET_COUNTRY, getCountryFromServer);
}
// Coinlist Root Saga
export default function* rootSaga() {
    yield all([
        fork(getCoinlistRequest),
        fork(addNewCoinListRequstForm),
        fork(getCountry),
    ]);
}