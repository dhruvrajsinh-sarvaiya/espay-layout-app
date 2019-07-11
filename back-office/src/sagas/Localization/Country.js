/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 21-11-2018
    Description : For Country Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_COUNTRY,
    ADD_NEW_COUNTRY,
    UPDATE_COUNTRY,
    GET_COUNTRY_BY_ID
} from 'Actions/types';

//import function from action
import {
    getCountrySuccess,
    getCountryFailure,
    addNewCountrySuccess,
    addNewCountryFailure,
    updateCountrySuccess,
    updateCountryFailure,
    getCountryByIdSuccess,
    getCountryByIdFailure
} from 'Actions/Localization';

/**
 * Send Add Country Request To Server
 */
const getCountryRequest = async (countrydata) => await api.get('/api/private/v1/localization/country/listCountry/' + countrydata.page + '/' + countrydata.rowsPerPage + '/' + countrydata.searchValue + '/' + countrydata.orderBy + '/' + countrydata.sortOrder)
    .then(response => response.data)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Country Add..
const addNewCountryRequest = async (countrydata) =>
    await api.post('/api/private/v1/localization/country/addCountry', { countrydata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));


//Function check API call for Country Edit..
const editCountryRequest = async (countrydata) =>
    await api.put('/api/private/v1/localization/country/updateCountry/', { countrydata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Country By Id..
const getCountryByIdRequest = async (countryId) =>
    await api.get('/api/private/v1/localization/country/getCountryById/' + countryId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));


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

//Function for Add Country API
function* addNewCountryAPI({ payload }) {
    try {
        const response = yield call(addNewCountryRequest, payload);

        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(addNewCountrySuccess(response.data));
        } else {
            yield put(addNewCountryFailure(response.data));
        }
    } catch (error) {
        yield put(addNewCountryFailure(error));
    }
}

//Function for Update Country API
function* updateCountryAPI({ payload }) {

    try {
        const response = yield call(editCountryRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(updateCountrySuccess(response.data));
        } else {
            yield put(updateCountryFailure(response.data));
        }
    } catch (error) {

        yield put(updateCountryFailure(error));
    }
}

//Function for Get Country By ID API
function* getCountryByIdAPI({ payload }) {
    try {
        const response = yield call(getCountryByIdRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCountryByIdSuccess(response.data));
        } else {
            yield put(getCountryByIdFailure(response.data));
        }
    } catch (error) {
        yield put(getCountryByIdFailure(error));
    }
}

/**
 * Get Country
 */
export function* getCountry() {

    yield takeEvery(GET_COUNTRY, getCountryFromServer);
}

// add New country 
export function* addNewCountry() {
    yield takeEvery(ADD_NEW_COUNTRY, addNewCountryAPI);
}

// Edit Country
export function* updateCountry() {
    yield takeEvery(UPDATE_COUNTRY, updateCountryAPI);
}

//Edit Country by Id
export function* getCountryById() {
    yield takeEvery(GET_COUNTRY_BY_ID, getCountryByIdAPI);
}

/**
 * Country Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getCountry),
        fork(addNewCountry),
        fork(updateCountry),
        fork(getCountryById),
    ]);
}