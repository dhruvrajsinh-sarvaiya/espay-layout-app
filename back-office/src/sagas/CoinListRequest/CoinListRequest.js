/* 
    Createdby : Dhara gajera
    CreatedDate : 9-01-2019
    Description : get coin list request data
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_COINLIST_REQUEST,
    GET_COINLIST_FIELDS,
    UPDATE_COINLIST_FIELDS
} from 'Actions/types';

//import function from action
import {
    getCoinListRequestSuccess,
    getCoinListRequestFailure,
    getCoinListFieldsSuccess,
    getCoinListFieldsFailure,
    updateCoinListFieldsSuccess,
    updateCoinListFieldsFailure
} from 'Actions/CoinListRequest';

//Function check API call for coin list request List..
const getCoinListRequest = async () =>
await api.get('/api/private/v1/coinListRequest/coinRequestByUser')
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for coin list fields List..
const getCoinListFieldsRequest = async () =>
await api.get('/api/private/v1/coinListRequest')
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for coin list fields update..
const CoinListFieldsUpdateRequest = async (coinListdata) =>
    await api.put('/api/private/v1/coinListRequest/editCoinListField', {coinListdata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function for Getcoin list request List API
function* getCoinListRequestAPI() {
    try {
        const response = yield call(getCoinListRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getCoinListRequestSuccess(response.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            
            yield put(getCoinListRequestFailure(response.data));
        }
    } catch (error) {
        yield put(getCoinListRequestFailure(error));
    }
}
//Function for Getcoin list fields List API
function* getCoinListFieldsAPI() {
    try {
        const response = yield call(getCoinListFieldsRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getCoinListFieldsSuccess(response.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            
            yield put(getCoinListFieldsFailure(response.data));
        }
    } catch (error) {
        yield put(getCoinListFieldsFailure(error));
    }
}

//Function for Gcoin list fields List API update
function* updateCoinListFieldsAPI({payload}) {
    try {
        const response = yield call(CoinListFieldsUpdateRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(updateCoinListFieldsSuccess(response.data));
        }else {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(updateCoinListFieldsFailure(response.data));
        }
    } catch (error) {
        yield put(updateCoinListFieldsFailure(error));
    }
}

// Get coin list request
export function* getCoinListRequests() {
    yield takeEvery(GET_COINLIST_REQUEST, getCoinListRequestAPI);
}
// Get coin list fields
export function* getCoinListFields() {
    yield takeEvery(GET_COINLIST_FIELDS, getCoinListFieldsAPI);
}

// update coin list fields
export function* updateCoinListFields() {
    yield takeEvery(UPDATE_COINLIST_FIELDS, updateCoinListFieldsAPI);
}
// coin list request Root Saga
export default function* rootSaga() {
    yield all([
        fork(getCoinListRequests),
        fork(getCoinListFields),
        fork(updateCoinListFields),
    ]);
}