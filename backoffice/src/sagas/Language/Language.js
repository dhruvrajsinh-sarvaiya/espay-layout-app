/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 10-10-2018
    UpdatedDate : 21-11-2018
    Description : Saga Function for Get Language List
    Updated by Jayesh Pathak 26-10-2018 for adding language module listing/add/edit
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

import {
    GET_LANGUAGE,
	GET_ALL_LANGUAGE,
	ADD_NEW_LANGUAGE,
    UPDATE_LANGUAGE,
    GET_LANGUAGE_BY_ID,
    GET_LANGUAGE_CONFIG,
    UPDATE_LANGUAGE_CONFIG,
} from 'Actions/types';

import {
    getLanguageSuccess,
    getLanguageFailure,
	getAllLanguageSuccess,
    getAllLanguageFailure,
	addNewLanguageSuccess,
    addNewLanguageFailure,
    updateLanguageSuccess,
    updateLanguageFailure,
    getLanguageByIdSuccess,
    getLanguageByIdFailure,
    getLanguageConfigSuccess,
    getLanguageConfigFailure,
    updateLanguageConfigSuccess,
    updateLanguageConfigFailure
} from 'Actions/Language';

//Function check API call for Language List..
const getLanguageRequest = async () =>
    await api.get('/api/private/v1/languages')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));
		
//Function check API call for Active Language Config Pack List.. CMS PAGES TAB VIEW
const getActiveDefaultLanguages = async () =>
    await api.get('/api/private/v1/languages/getActiveLanguagesConfig')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Language Add..
const addNewLanguageRequest = async (languagedata) =>
    await api.post('/api/private/v1/languages/addLanguage', {languagedata})
        .then(response => response)
        .catch(error =>JSON.parse(JSON.stringify(error.response)));


//Function check API call for Language Edit..
const editLanguageRequest = async (languagedata) =>
    await api.put('/api/private/v1/languages/updateLanguage/', {languagedata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Language By Id..
const getLanguageByIdRequest = async (languageId) =>
await api.get('/api/private/v1/languages/getLanguageById/'+languageId)
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));		

//Function check API call for Language Config List..
const getLanguageConfigRequest = async () =>
await api.get('/api/private/v1/languages/getLanguageInfo')
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));


//Function check API call for Language Config Edit..
const editLanguageConfigRequest = async (languagedata) =>
await api.put('/api/private/v1/languages/updateLanguageConfiguration/', {languagedata})
    .then(response => response)
    .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function for Get Language API
function* getLanguageAPI() {
    try {
        const response = yield call(getActiveDefaultLanguages);
        if(typeof response.data != undefined && response.data.responseCode==0)
        {
            yield put(getLanguageSuccess(response.data.data));
        }else{
            yield put(getLanguageFailure(response.data));
        }
    } catch (error) {
        yield put(getLanguageFailure(error));
    }
}

/**
 * Get Language data From Server
 */
function* getAllLanguageFromServer() {

    try {
        const response = yield call(getLanguageRequest);
		
		if (typeof response.data != undefined && response.data.responseCode == 0) {
            yield put(getAllLanguageSuccess(response.data));
        } else {
            yield put(getAllLanguageFailure(response.data));
        }

    } catch (error) {
        yield put(getAllLanguageFailure(error));
    }
}

//Function for Add Language API
function* addNewLanguageAPI({payload}) {
    try {
       const response = yield call(addNewLanguageRequest, payload);
       
        if (typeof response.data != undefined && response.data.responseCode==0) {
            yield put(addNewLanguageSuccess(response.data));
        } else {
            yield put(addNewLanguageFailure(response.data));
        }
    } catch (error) {
        yield put(addNewLanguageFailure(error));
    }
}

//Function for Update Language API
function* updateLanguageAPI({payload}) {
    
    try {
        const response = yield call(editLanguageRequest, payload);
        //validate if data found in response 
        if (typeof response.data != undefined && response.data.responseCode==0)
        {
            yield put(updateLanguageSuccess(response.data));
        }else {
            yield put(updateLanguageFailure(response.data));
        }
    } catch (error) {
        
        yield put(updateLanguageFailure(error));
    }
}

//Function for Get Language By ID API
function* getLanguageByIdAPI({ payload }) {
    try {
        const response = yield call(getLanguageByIdRequest, payload);
        if (typeof response.data != undefined && response.data.responseCode==0)
        {
            yield put(getLanguageByIdSuccess(response.data));
        }else {
            yield put(getLanguageByIdFailure(response.data));
        }
    } catch (error) {
        yield put(getLanguageByIdFailure(error));
    }
}

//Function for Get Language API
function* getLanguageConfigAPI() {
    try {
        const response = yield call(getLanguageConfigRequest);
       
        if(typeof response.data != undefined && response.data.responseCode==0)
        {
            yield put(getLanguageConfigSuccess(response.data.data));
        }else{
            yield put(getLanguageConfigFailure(response.data));
        }
    } catch (error) {
        yield put(getLanguageConfigFailure(error));
    }
}

//Function for Update Language Config API
function* updateLanguageConfigAPI({payload}) {
    // console.log("payload",payload);
    try {
        const response = yield call(editLanguageConfigRequest, payload);
        //validate if data found in response 
        // console.log("response",response);
        if (typeof response.data != undefined && response.data.responseCode==0)
        {
            yield put(updateLanguageConfigSuccess(response.data));
        }else {
            yield put(updateLanguageConfigFailure(response.data));
        }
    } catch (error) {
        
        yield put(updateLanguageConfigFailure(error));
    }
}

// Get Language
export function* getLanguage() {
    yield takeEvery(GET_LANGUAGE, getLanguageAPI);
}

/**
 * Get Language
 */
export function* getAllLanguage() {
    
    yield takeEvery(GET_ALL_LANGUAGE, getAllLanguageFromServer);
}

// add New Language 
export function* addNewLanguage() {
    yield takeEvery(ADD_NEW_LANGUAGE, addNewLanguageAPI);
}

// Edit Language
export function* updateLanguage() {
    yield takeEvery(UPDATE_LANGUAGE, updateLanguageAPI);
}

//Edit Language by Id
export function* getLanguageById() {
    yield takeEvery(GET_LANGUAGE_BY_ID, getLanguageByIdAPI);
}


// Get Language
export function* getLanguageConfig() {
    yield takeEvery(GET_LANGUAGE_CONFIG, getLanguageConfigAPI);
}

// Edit Language
export function* updateLanguageConfig() {
    yield takeEvery(UPDATE_LANGUAGE_CONFIG, updateLanguageConfigAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getLanguage),
		fork(getAllLanguage),
        fork(addNewLanguage),
        fork(updateLanguage),
        fork(getLanguageById),
        fork(getLanguageConfig),
        fork(updateLanguageConfig),
    ]);
}