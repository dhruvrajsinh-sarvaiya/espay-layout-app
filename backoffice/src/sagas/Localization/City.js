/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : For City Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_CITY,
    ADD_NEW_CITY,
    UPDATE_CITY,
    GET_CITY_BY_ID,
    GET_CITY_BY_STATE_ID, //Added by dhara gajera 11/2/2019
} from 'Actions/types';

//import function from action
import {
    getCitySuccess,
    getCityFailure,
    addNewCitySuccess,
    addNewCityFailure,
    updateCitySuccess,
    updateCityFailure,
    getCityByIdSuccess,
    getCityByIdFailure,
    getCitiesByStateIdSuccess,
    getCitiesByStateIdFailure
} from 'Actions/Localization';

/**
 * Send Add Page Request To Server
 */
const getCityRequest = async (citydata) => await api.get('/api/private/v1/localization/city/listCity/' + citydata.page + '/' + citydata.rowsPerPage + '/' + citydata.searchValue + '/' + citydata.orderBy + '/' + citydata.sortOrder)
    .then(response => response.data)
    .catch(error => JSON.parse(JSON.stringify(error.response)));


//Function check API call for City Add..
const addNewCityRequest = async (citydata) =>
    await api.post('/api/private/v1/localization/city/addCity', { citydata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));


//Function check API call for City Edit..
const editCityRequest = async (citydata) =>
    await api.put('/api/private/v1/localization/city/updateCity/', { citydata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get City By Id..
const getCityByIdRequest = async (cityId) =>
    await api.get('/api/private/v1/localization/city/getCityById/' + cityId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Cities By state Id ,Added by dhara gajera 11/2/2019.
const getCitiesByStateIdRequest = async (data) =>
    await api.get('/api/private/v1/localization/city/getCityByStateId/' + data.stateId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));
/**
 * Get City data From Server
 */
function* getCityFromServer({ payload }) {
    try {

        const response = yield call(getCityRequest, payload);

        if (typeof response.data != 'undefined' && response.responseCode == 0) {
            // console.log("......city......saga:",response);
            yield put(getCitySuccess(response));
        } else {
            yield put(getCityFailure(response));
        }

    } catch (error) {
        yield put(getCityFailure(error));
    }
}

//Function for Add City API
function* addNewCityAPI({ payload }) {
    try {
        const response = yield call(addNewCityRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(addNewCitySuccess(response.data));
        } else {
            yield put(addNewCityFailure(response.data));
        }
    } catch (error) {
        yield put(addNewCityFailure(error));
    }
}

//Function for Update City API
function* updateCityAPI({ payload }) {

    try {
        const response = yield call(editCityRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(updateCitySuccess(response.data));
        } else {
            yield put(updateCityFailure(response.data));
        }
    } catch (error) {

        yield put(updateCityFailure(error));
    }
}

//Function for Get City By ID API
function* getCityByIdAPI({ payload }) {
    try {
        const response = yield call(getCityByIdRequest, payload);

        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCityByIdSuccess(response.data));
        } else {
            yield put(getCityByIdFailure(response.data));
        }
    } catch (error) {
        yield put(getCityByIdFailure(error));
    }
}
//Function for Get Cities By state ID API ,Added by dhara gajera 11/2/2019 for localization zipcodes
function* getCitiesByStateIdAPI({ payload }) {
    try {
        const response = yield call(getCitiesByStateIdRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getCitiesByStateIdSuccess(response.data));
        } else {
            yield put(getCitiesByStateIdFailure(response.data));
        }
    } catch (error) {
        yield put(getCitiesByStateIdFailure(error));
    }
}

/**
 * Get City
 */
export function* getCity() {

    yield takeEvery(GET_CITY, getCityFromServer);
}

// add New city 
export function* addNewCity() {
    yield takeEvery(ADD_NEW_CITY, addNewCityAPI);
}

// Edit City
export function* updateCity() {
    yield takeEvery(UPDATE_CITY, updateCityAPI);
}

//Edit City by Id
export function* getCityById() {
    yield takeEvery(GET_CITY_BY_ID, getCityByIdAPI);
}
//Edit Cities by state Id
export function* getCitiesByStateId() {
    yield takeEvery(GET_CITY_BY_STATE_ID, getCitiesByStateIdAPI);
}
/**
 * City Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getCity),
        fork(addNewCity),
        fork(updateCity),
        fork(getCityById),
        fork(getCitiesByStateId)
    ]);
}