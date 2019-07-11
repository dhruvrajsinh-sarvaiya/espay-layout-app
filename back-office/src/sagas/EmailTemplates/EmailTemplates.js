/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 29-12-2018
    UpdatedDate : 29-12-2018
    Description : For Email Templates Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';

import AppConfig from 'Constants/AppConfig';

//import action types
import {
    GET_EMAILTEMPLATES,
    GET_LISTTEMPLATES,
    ADD_NEW_EMAILTEMPLATE,
    UPDATE_EMAILTEMPLATE,
    GET_EMAILTEMPLATE_BY_ID,
    UPDATE_TEMPLATE_STATUS,
    GET_EMAILTEMPLATES_BY_CATEGORY,
    GET_EMAILTEMPLATES_PARAMETERS,
    UPDATE_EMAILTEMPLATECONFIG
} from 'Actions/types';

//import function from action
import {
    getEmailTemplatesSuccess,
    getEmailTemplatesFailure,
    getListTemplatesSuccess,
    getListTemplatesFailure,
    addNewEmailTemplateSuccess,
    addNewEmailTemplateFailure,
    updateEmailTemplateSuccess,
    updateEmailTemplateFailure,
    getEmailTemplateByIdSuccess,
    getEmailTemplateByIdFailure,
    updateTemplateStatusSuccess,
    updateTemplateStatusFailure,
    getEmailTemplateByCategorySuccess,
    getEmailTemplateByCategoryFailure,
    getEmailTemplatesParametersSuccess,
    getEmailTemplatesParametersFailure,
    updateTemplateConfigurationSuccess,
    updateTemplateConfigurationFailure
} from 'Actions/EmailTemplates';

//Function for EmailTemplate List API
function* getEmailTemplatesAPI(payload) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/MasterConfiguration/GetAllTemplate', payload, headers);

    try {
        if (typeof response != 'undefined' && response.ReturnCode === 0) {
            yield put(getEmailTemplatesSuccess(response));
        } else {
            yield put(getEmailTemplatesFailure(response));
        }
    } catch (error) {
        yield put(getEmailTemplatesFailure(error));
    }

}

//Function for ListTemplate API
function* getListTemplatesAPI(payload) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/MasterConfiguration/ListTemplateType', payload, headers);

    try {
        if (typeof response != 'undefined' && response.ReturnCode === 0) {
            yield put(getListTemplatesSuccess(response));
        } else {
            yield put(getListTemplatesFailure(response));
        }
    } catch (error) {
        yield put(getListTemplatesFailure(error));
    }

}

//Function for Add EmailTemplate API
function* addNewEmailTemplateAPI({ payload }) {

    try {
        const response = yield call(swaggerPostAPI, 'api/MasterConfiguration/AddTemplate', payload, 1);

        if (response !== undefined && response.ReturnCode === 0) {
            yield put(addNewEmailTemplateSuccess(response));
        } else {

            yield put(addNewEmailTemplateFailure(response));
        }
    } catch (error) {
        yield put(addNewEmailTemplateFailure(error));
    }

}

//Function for Update EmailTemplate API
function* updateEmailTemplateAPI({ payload }) {

    const response = yield call(swaggerPostAPI, '/api/MasterConfiguration/UpdateTemplate', payload, 1);

    try {
        if (response !== undefined && response.ReturnCode === 0) {
            yield put(updateEmailTemplateSuccess(response));
        } else {
            yield put(updateEmailTemplateFailure(response));
        }
    } catch (error) {
        yield put(updateEmailTemplateFailure(error));
    }

}

//Function for Get EmailTemplate By ID API
function* getEmailTemplateByIdAPI({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/MasterConfiguration/GetTemplateById/' + payload, payload, headers);

    try {
        if (response !== undefined && response.ReturnCode === 0) {
            yield put(getEmailTemplateByIdSuccess(response));
        } else {
            yield put(getEmailTemplateByIdFailure(response));
        }
    } catch (error) {
        yield put(getEmailTemplateByIdFailure(error));
    }
}

function* updateTemplateStatusAPI({ payload }) {

    const request = payload;

    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/MasterConfiguration/ChangeTemplateStatus/' + request.id + "/" + request.status, payload, headers);

        if (response !== undefined && response.ReturnCode === 0) {
            yield put(updateTemplateStatusSuccess(response));
        } else {
            yield put(updateTemplateStatusFailure(response));
        }
    } catch (error) {
        yield put(updateTemplateStatusFailure(error));
    }
}


//Function for EmailTemplate Parameters API
function* getEmailTemplatesParametersAPI(payload) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/MasterConfiguration/TemplateParameterInfo', payload, headers);

    try {
        if (response !== undefined && response.ReturnCode === 0) {
            yield put(getEmailTemplatesParametersSuccess(response));
        } else {
            yield put(getEmailTemplatesParametersFailure(response));
        }
    } catch (error) {
        yield put(getEmailTemplatesParametersFailure(error));
    }

}

//Function for Get EmailTemplate By Category API
function* getEmailTemplateByCategoryAPI({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/MasterConfiguration/GetTemplateByCategory/' + payload, payload, headers);

    try {
        if (response !== undefined && response.ReturnCode === 0) {
            yield put(getEmailTemplateByCategorySuccess(response));
        } else {
            yield put(getEmailTemplateByCategoryFailure(response));
        }
    } catch (error) {
        yield put(getEmailTemplateByCategoryFailure(error));
    }
}

//Function for Update EmailTemplate Config API
function* updateTemplateConfigurationAPI({ payload }) {

    const request = payload;

    try {

        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/MasterConfiguration/UpdateTemplateCategory/' + request.TemplateType + "/" + request.Status + "/" + request.TemplateID, payload, headers);

        if (response !== undefined && response.ReturnCode === 0) {
            yield put(updateTemplateConfigurationSuccess(response));
        } else {
            yield put(updateTemplateConfigurationFailure(response));
        }
    } catch (error) {
        yield put(updateTemplateConfigurationFailure(error));
    }

}

// Get EmailTemplates
export function* getEmailTemplates() {
    yield takeEvery(GET_EMAILTEMPLATES, getEmailTemplatesAPI);
}

// Get List Templates
export function* getListTemplates() {
    yield takeEvery(GET_LISTTEMPLATES, getListTemplatesAPI);
}

// add New EmailTemplate 
export function* addNewEmailTemplate() {
    yield takeEvery(ADD_NEW_EMAILTEMPLATE, addNewEmailTemplateAPI);
}

// Edit EmailTemplate
export function* updateEmailTemplate() {
    yield takeEvery(UPDATE_EMAILTEMPLATE, updateEmailTemplateAPI);
}

//Edit EmailTemplate by Id
export function* getEmailTemplateById() {
    yield takeEvery(GET_EMAILTEMPLATE_BY_ID, getEmailTemplateByIdAPI);
}

//Get template update status
export function* updateTemplateStatus() {
    yield takeEvery(UPDATE_TEMPLATE_STATUS, updateTemplateStatusAPI);
}

// Get EmailTemplates Parameters
export function* getEmailTemplatesParameters() {
    yield takeEvery(GET_EMAILTEMPLATES_PARAMETERS, getEmailTemplatesParametersAPI);
}

//Edit EmailTemplate by Category
export function* getEmailTemplateByCategory() {
    yield takeEvery(GET_EMAILTEMPLATES_BY_CATEGORY, getEmailTemplateByCategoryAPI);
}

// Edit EmailTemplate Config
export function* updateTemplateConfiguration() {
    yield takeEvery(UPDATE_EMAILTEMPLATECONFIG, updateTemplateConfigurationAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getEmailTemplates),
        fork(getListTemplates),
        fork(addNewEmailTemplate),
        fork(updateEmailTemplate),
        fork(getEmailTemplateById),
        fork(updateTemplateStatus),
        fork(getEmailTemplatesParameters),
        fork(getEmailTemplateByCategory),
        fork(updateTemplateConfiguration),
    ]);
}