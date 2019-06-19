/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : For Get Help Manual Module Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_HELPMANUAL_MODULES,
    ADD_HELPMANUAL_MODULES,
    UPDATE_HELPMANUAL_MODULES,
    GET_HELPMANUAL_MODULES_BY_ID,
    DELETE_HELPMANUAL_MODULES,
} from 'Actions/types';

//import function from action
import {
    getHelpmanualmodulesSuccess,
    getHelpmanualmodulesFailure,
    addHelpmanualmoduleSuccess,
    addHelpmanualmoduleFailure,
    updateHelpmanualmoduleSuccess,
    updateHelpmanualmoduleFailure,
    deleteHelpmanualmoduleSuccess,
    deleteHelpmanualmoduleFailure,
    getHelpmanualmoduleByIdSuccess,
    getHelpmanualmoduleByIdFailure
} from 'Actions/HelpManual';

//Function check API call for Help Manual Module List..
const getHelpmanualmodulesRequest = async () =>
await api.get('api/private/v1/helpmanualmodule')
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Help Manual Module Add..
const addHelpmanualmoduleRequest = async (helpmoduledata) =>
await api.post('/api/private/v1/helpmanualmodule/addHelpModule', {helpmoduledata})
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Help Manual Module Edit..
const editHelpmanualmoduleRequest = async (helpmoduledata) =>
await api.put('/api/private/v1/helpmanualmodule/editHelpModule', {helpmoduledata})
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Help Manual Module By Id..
const getHelpmanualmoduleByIdRequest = async (moduleid) =>
await api.get('/api/private/v1/helpmanualmodule/getHelpModuleById/'+moduleid)
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Delete Help Manual Module By Id..
const deleteHelpmanualmoduleRequest = async (moduleid) =>
await api.delete('/api/private/v1/helpmanualmodule/deleteHelpModule/'+moduleid)
.then(response => response)
.catch(error => JSON.parse(JSON.stringify(error.response)));


//Function for Get Help Manual Module List API
function* getHelpmanualmodulesAPI() {
    try {
        const response = yield call(getHelpmanualmodulesRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getHelpmanualmodulesSuccess(response.data.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            
            yield put(getHelpmanualmodulesFailure(response.data));
        }
    } catch (error) {
        yield put(getHelpmanualmodulesFailure(error));
    }
}

//Function for Add Help Manual Module API
function* addHelpmanualmoduleAPI({payload}) {
    try 
    {
        const response = yield call(addHelpmanualmoduleRequest, payload);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(addHelpmanualmoduleSuccess(response.data));
        }
        else
        {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(addHelpmanualmoduleFailure(response.data));
        }
    } catch (error) {
        yield put(addHelpmanualmoduleFailure(error));
    }
}

//Function for Update Help Manual Module API
function* updateHelpmanualmoduleAPI({payload}) {
    try {
        const response = yield call(editHelpmanualmoduleRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(updateHelpmanualmoduleSuccess(response.data));
        }else {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(updateHelpmanualmoduleFailure(response.data));
        }
    } catch (error) {
        yield put(updateHelpmanualmoduleFailure(error));
    }
}


//Function for Get Help Manual By ID API
function* getHelpmanualmoduleByIdAPI({ payload }) {
    try {
        const response = yield call(getHelpmanualmoduleByIdRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getHelpmanualmoduleByIdSuccess(response.data.data));
        }else {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getHelpmanualmoduleByIdFailure(response.data));
        }
    } catch (error) {
        yield put(getHelpmanualmoduleByIdFailure(error));
    }
}


//Function for Delete Helpmanual Module API
function* deleteHelpmanualmoduleAPI({ payload }) {
    try {
        const response = yield call(deleteHelpmanualmoduleRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(deleteHelpmanualmoduleSuccess(response.data));
        }else {
            // let errorObject=JSON.parse(JSON.stringify(response));
            yield put(deleteHelpmanualmoduleFailure(response.data));
        }
    } catch (error) {
        yield put(deleteHelpmanualmoduleFailure(error));
    }
}

// Get Help Manual Module
export function* getHelpmanualmodules() {
    yield takeEvery(GET_HELPMANUAL_MODULES, getHelpmanualmodulesAPI);
}

// add Help Manual Module
export function* addHelpmanualmodule() {
    yield takeEvery(ADD_HELPMANUAL_MODULES, addHelpmanualmoduleAPI);
}

// Edit help Manual Module
export function* updateHelpmanualmodule() {
    yield takeEvery(UPDATE_HELPMANUAL_MODULES, updateHelpmanualmoduleAPI);
}

// Edit Help Manual Module by Id
export function* getHelpmanualmoduleById() {
    yield takeEvery(GET_HELPMANUAL_MODULES_BY_ID, getHelpmanualmoduleByIdAPI);
}

// Delete Help Manual Module by Id
export function* deleteHelpmanualmodule() {
    yield takeEvery(DELETE_HELPMANUAL_MODULES, deleteHelpmanualmoduleAPI);
}

// Faq Root Saga
export default function* rootSaga() {
    yield all([
        fork(getHelpmanualmodules),
        fork(addHelpmanualmodule),
        fork(updateHelpmanualmodule),
        fork(getHelpmanualmoduleById),
        fork(deleteHelpmanualmodule)
    ]);
}