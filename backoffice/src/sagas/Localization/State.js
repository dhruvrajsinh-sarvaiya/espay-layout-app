/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 21-11-2018
    Description : For State Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_STATE,
    ADD_NEW_STATE,
    UPDATE_STATE,
    GET_STATE_BY_ID,
    GET_STATE_BY_COUNTRY_ID
} from 'Actions/types';

//import function from action
import {
    getStateSuccess,
    getStateFailure,
    addNewStateSuccess,
    addNewStateFailure,
    updateStateSuccess,
    updateStateFailure,
    getStateByIdSuccess,
    getStateByIdFailure,
    getStateByCountryIdSuccess,
    getStateByCountryIdFailure
} from 'Actions/Localization';

/**
 * Send Add Page Request To Server
 */
const getStateRequest = async (statedata) => await api.get('/api/private/v1/localization/state/listState/' + statedata.page + '/' + statedata.rowsPerPage + '/' + statedata.searchValue + '/' + statedata.orderBy + '/' + statedata.sortOrder)
    .then(response => response.data)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for State Add..
const addNewStateRequest = async (statedata) =>
    await api.post('/api/private/v1/localization/state/addState', { statedata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));


//Function check API call for State Edit..
const editStateRequest = async (statedata) =>
    await api.put('/api/private/v1/localization/state/updateState/', { statedata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get State By Id..
const getStateByIdRequest = async (stateId) =>
    await api.get('/api/private/v1/localization/state/getStateById/' + stateId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get State By countryId..
const getStateByCountryIdRequest = async (data) =>
    await api.get('/api/private/v1/localization/state/getStateByCountryId/' + data.countryId)
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));


/**
 * Get State data From Server
 */
function* getStateFromServer({ payload }) {
    try {
        const response = yield call(getStateRequest, payload);

        if (typeof response.data != 'undefined' && response.responseCode == 0) {
            yield put(getStateSuccess(response));
        } else {
            yield put(getStateFailure(response));
        }

    } catch (error) {
        yield put(getStateFailure(error));
    }
}

//Function for Add State API
function* addNewStateAPI({ payload }) {

    try {

        const response = yield call(addNewStateRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(addNewStateSuccess(response.data));
        } else {
            yield put(addNewStateFailure(response.data));
        }
    } catch (error) {
        yield put(addNewStateFailure(error));
    }
}

//Function for Update State API
function* updateStateAPI({ payload }) {

    try {
        const response = yield call(editStateRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(updateStateSuccess(response.data));
        } else {
            yield put(updateStateFailure(response.data));
        }
    } catch (error) {

        yield put(updateStateFailure(error));
    }
}

//Function for Get State By ID API
function* getStateByIdAPI({ payload }) {
    try {
        const response = yield call(getStateByIdRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getStateByIdSuccess(response.data));
        } else {
            yield put(getStateByIdFailure(response.data));
        }
    } catch (error) {
        yield put(getStateByIdFailure(error));
    }
}

//Function for Get State By Country ID API
function* getStateByCountryIdAPI({ payload }) {
    try {
        const response = yield call(getStateByCountryIdRequest, payload);

        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getStateByCountryIdSuccess(response.data));
        } else {
            yield put(getStateByCountryIdFailure(response.data));
        }
    } catch (error) {
        yield put(getStateByCountryIdFailure(error));
    }
}

/**
 * Get State
 */
export function* getState() {

    yield takeEvery(GET_STATE, getStateFromServer);
}

// add New State 
export function* addNewState() {
    yield takeEvery(ADD_NEW_STATE, addNewStateAPI);
}

// Edit State
export function* updateState() {
    yield takeEvery(UPDATE_STATE, updateStateAPI);
}

//Get State by Id
export function* getStateById() {
    yield takeEvery(GET_STATE_BY_ID, getStateByIdAPI);
}


export function* getStateByCountryId() {
    yield takeEvery(GET_STATE_BY_COUNTRY_ID, getStateByCountryIdAPI);
}

/**
 * State Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getState),
        fork(addNewState),
        fork(updateState),
        fork(getStateById),
        fork(getStateByCountryId),
    ]);
}