/* 
    Createdby : Dhara Gajera
    CreatedDate :8/2/2019
    Description : For zip codes Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_ZIPCODES,
    ADD_NEW_ZIPCODES,
    GET_ZIPCODES_BY_ID,
    UPDATE_ZIPCODES
} from 'Actions/types';

//import function from action
import {
    getZipCodesSuccess,
    getZipCodesFailure,
    addNewZipcodeSuccess,
    addNewZipcodeFailure,
    getZipCodeByIdSuccess,
    getZipCodeByIdFailure,
    updateZipcodeSuccess,
    updateZipcodeFailure
} from 'Actions/Localization';

/**
 * Send Add Page Request To Server
 */
// api/private/v1/localization/zipcodes/listZipcodes
const getZipCodesRequest = async (zip) => await api.get('/api/private/v1/localization/zipcodes/listZipcodes/' + zip.page + '/' + zip.rowsPerPage + '/' + zip.searchValue + '/' + zip.orderBy + '/' + zip.sortOrder)
    .then(response => response.data)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

 //Function check API call to Add zipcodes
const addNewZipcodesRequest = async (zipCodedata) =>
    await api.post('/api/private/v1/localization/zipcodes/addZipcode', { zipCodedata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));
 
//Function check API call to get zipcode detail by id
const getZipcodeByIdRequest = async (zipcodesId) =>
    await api.get('/api/private/v1/localization/zipcodes/getZipcodeById/' + zipcodesId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for zipcode Edit..
const editZipcodeRequest = async (zipCodedata) =>
    await api.put('/api/private/v1/localization/zipcodes/updateZipcode/', { zipCodedata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

/**
 * Get State data From Server
 */
function* getZipCodesFromServer({ payload }) {
    try {
        const response = yield call(getZipCodesRequest, payload);

        if (typeof response.data != 'undefined' && response.responseCode == 0) {
            yield put(getZipCodesSuccess(response));
        } else {
            yield put(getZipCodesFailure(response));
        }

    } catch (error) {
        yield put(getZipCodesFailure(error));
    }
}

//Function for Add zipcode API
function* addNewZipCodeOnServer({ payload }) {
    try {
        const response = yield call(addNewZipcodesRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(addNewZipcodeSuccess(response.data));
        } else {
            yield put(addNewZipcodeFailure(response.data));
        }

    } catch (error) {
        yield put(addNewZipcodeFailure(error));
    }
}
//Function to get zipcode by id API
function* getZipCodeByIdOnServer({ payload }) {
    try {
        const response = yield call(getZipcodeByIdRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getZipCodeByIdSuccess(response.data));
        } else {
            yield put(getZipCodeByIdFailure(response.data));
        }

    } catch (error) {
        yield put(getZipCodeByIdFailure(error));
    }
}
//Function for Update State API
function* updateZipcodeAPI({ payload }) {
    try {
        const response = yield call(editZipcodeRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(updateZipcodeSuccess(response.data));
        } else {
            yield put(updateZipcodeFailure(response.data));
        }
    } catch (error) {
        yield put(updateZipcodeFailure(error));
    }
}

/**
 * Get State
 */
export function* getZipCodes() {

    yield takeEvery(GET_ZIPCODES, getZipCodesFromServer);
}
/**
 * Add new zip code
 */
export function* addNewZipcode() {

    yield takeEvery(ADD_NEW_ZIPCODES, addNewZipCodeOnServer);
}
/**
 * get zip code by id
 */
export function* getZipCodeById() {

    yield takeEvery(GET_ZIPCODES_BY_ID, getZipCodeByIdOnServer);
}

// Edit State
export function* updateZipcode() {
    yield takeEvery(UPDATE_ZIPCODES, updateZipcodeAPI);
}

/**
 * State Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getZipCodes),
        fork(addNewZipcode),
        fork(getZipCodeById),
        fork(updateZipcode)
    ]);
}