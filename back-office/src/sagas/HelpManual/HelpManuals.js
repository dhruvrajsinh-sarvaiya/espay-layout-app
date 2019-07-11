/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : For Get Help Manual Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_HELPMANUALS,
    ADD_HELPMANUAL,
    UPDATE_HELPMANUAL,
    DELETE_HELPMANUAL,
    GET_HELPMANUAL_BY_ID
} from 'Actions/types';

//import function from action
import {
    getHelpmanualsSuccess,
    getHelpmanualsFailure,
    addHelpmanualSuccess,
    addHelpmanualFailure,
    updateHelpmanualSuccess,
    updateHelpmanualFailure,
    getHelpmanualByIdSuccess,
    getHelpmanualByIdFailure,
    deleteHelpmanualSuccess,
    deleteHelpmanualFailure
} from 'Actions/HelpManual';

//Function check API call for Help Manual List..
const getHelpmanualsRequest = async () =>
    await api.get('/api/private/v1/helpmanual')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Help Manual Add..
const addHelpmanualRequest = async (helpmanualdata) =>
    await api.post('/api/private/v1/helpmanual/addHelpManual', { helpmanualdata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Help Manual Edit..
const editHelpmanualRequest = async (helpmanualdata) =>
    await api.put('/api/private/v1/helpmanual/editHelpManual', { helpmanualdata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Help Manual By Id..
const getHelpmanualByIdRequest = async (manualid) =>
    await api.get('/api/private/v1/helpmanual/getHelpManualById/' + manualid)
        .then(response => response)
        .catch(error => error);

// Function check API call for Delete Help Manual By Id..
const deleteHelpmanualRequest = async (manualid) =>
    await api.delete('/api/private/v1/helpmanual/deleteHelpManual/' + manualid)
        .then(response => response)
        .catch(error => error);



//Function for Get Help Manual List API
function* getHelpmanualsAPI() {
    try {
        const response = yield call(getHelpmanualsRequest);

        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getHelpmanualsSuccess(response.data.data));
        } else {
            yield put(getHelpmanualsFailure(response.data));
        }
    } catch (error) {
        yield put(getHelpmanualsFailure(error));
    }
}

//Function for Add Help Manual API
function* addHelpmanualAPI({ payload }) {
    try {
        const response = yield call(addHelpmanualRequest, payload);
        if (response.data != undefined && response.data.responseCode == 0) {
            yield put(addHelpmanualSuccess(response.data));
        }
        else {
            yield put(addHelpmanualFailure(response.data));
        }
    } catch (error) {
        yield put(addHelpmanualFailure(error));
    }
}

//Function for Update Help Manual API
function* updateHelpmanualAPI({ payload }) {
    try {
        const response = yield call(editHelpmanualRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(updateHelpmanualSuccess(response.data));
        } else {
            yield put(updateHelpmanualFailure(response.data));
        }
    } catch (error) {
        yield put(updateHelpmanualFailure(error));
    }
}

//Function for Get Help Manual By ID API
function* getHelpmanualByIdAPI({ payload }) {
    try {
        const response = yield call(getHelpmanualByIdRequest, payload);
        //validate if data found in response 
        if (response.data != undefined && response.data.responseCode == 0) {
            yield put(getHelpmanualByIdSuccess(response.data.data));
        } else {
            let errorObject = JSON.parse(JSON.stringify(response));
            yield put(getHelpmanualByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(getHelpmanualByIdFailure(error));
    }
}


//Function for Delete Help Manual API
function* deleteHelpmanualAPI({ payload }) {
    try {
        const response = yield call(deleteHelpmanualRequest, payload);
        //validate if data found in response 
        if (response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(deleteHelpmanualSuccess(response.data));
        } else {
            let errorObject = JSON.parse(JSON.stringify(response));
            yield put(deleteHelpmanualFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(deleteHelpmanualFailure(error));
    }
}


// Get Help Manuals
export function* getHelpmanuals() {
    yield takeEvery(GET_HELPMANUALS, getHelpmanualsAPI);
}

// add Help Manual
export function* addHelpmanual() {
    yield takeEvery(ADD_HELPMANUAL, addHelpmanualAPI);
}

// Edit add Help Manual
export function* updateHelpmanual() {
    yield takeEvery(UPDATE_HELPMANUAL, updateHelpmanualAPI);
}

// Edit Help Manual by Id
export function* getHelpmanualById() {
    yield takeEvery(GET_HELPMANUAL_BY_ID, getHelpmanualByIdAPI);
}

// Delete Help Manual by Id
export function* deleteHelpmanual() {
    yield takeEvery(DELETE_HELPMANUAL, deleteHelpmanualAPI);
}

// Faq Root Saga
export default function* rootSaga() {
    yield all([
        fork(getHelpmanuals),
        fork(addHelpmanual),
        fork(updateHelpmanual),
        fork(getHelpmanualById),
        fork(deleteHelpmanual)
    ]);
}