// TemplateSaga
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI } from '../../api/helper';
import { userAccessToken } from '../../selector';

//import action types
import {
    GET_EMAILTEMPLATES,
    GET_LISTTEMPLATES,
    ADD_NEW_EMAILTEMPLATE,
    UPDATE_EMAILTEMPLATE,
    GET_EMAILTEMPLATE_BY_ID,
    UPDATE_TEMPLATE_STATUS
} from '../../actions/ActionTypes';

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
    updateTemplateStatusFailure
} from '../../actions/CMS/EmailTemplatesActions';
import { Method } from '../../controllers/Constants';

//Function for EmailTemplate List API
function* getEmailTemplatesAPI(payload) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call all template api
        const response = yield call(swaggerGetAPI, Method.GetAllTemplate, payload, headers);

        // To set all template success response to reducer
        yield put(getEmailTemplatesSuccess(response));
    } catch (error) {

        // To set all template failure response to reducer
        yield put(getEmailTemplatesFailure(error));
    }

}

//Function for ListTemplate API
function* getListTemplatesAPI(payload) {

    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call template list api
        const response = yield call(swaggerGetAPI, Method.ListTemplate, payload, headers);

        // To set template list success response to reducer
        yield put(getListTemplatesSuccess(response));
    } catch (error) {

        // To set template list failure response to reducer
        yield put(getListTemplatesFailure(error));
    }

}

//Function for Add EmailTemplate API
function* addNewEmailTemplateAPI({ payload }) {
    let { request } = payload;
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call add template api
        const response = yield call(swaggerPostAPI, Method.AddTemplate, request, headers);

        // To set add template success response to reducer
        yield put(addNewEmailTemplateSuccess(response));
    } catch (error) {

        // To set add template failure response to reducer
        yield put(addNewEmailTemplateFailure(error));
    }
}

//Function for Update EmailTemplate API
function* updateEmailTemplateAPI({ payload }) {
    let { request } = payload
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call edit template api
        const response = yield call(swaggerPostAPI, Method.UpdateTemplate, request, headers);

        // To set edit template success response to reducer
        yield put(updateEmailTemplateSuccess(response));
    } catch (error) {

        // To set edit template failure response to reducer
        yield put(updateEmailTemplateFailure(error));
    }

}

//Function for Get EmailTemplate By ID API
function* getEmailTemplateByIdAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call email template by id api
        const response = yield call(swaggerGetAPI, Method.GetTemplateById + payload, payload, headers);

        // To set email template by id success response to reducer
        yield put(getEmailTemplateByIdSuccess(response));
    } catch (error) {

        // To set email template by id failure response to reducer
        yield put(getEmailTemplateByIdFailure(error));
    }
}

function* updateTemplateStatusAPI({ payload }) {

    const request = payload;

    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call change temlate status api
        const response = yield call(swaggerPostAPI, Method.ChangeTemplateStatus + request.id + "/" + request.status, payload, headers);

        // To set change temlate status success response to reducer
        yield put(updateTemplateStatusSuccess(response));
    } catch (error) {

        // To set change temlate status failure response to reducer
        yield put(updateTemplateStatusFailure(error));
    }
}

// Get EmailTemplates
export function* getEmailTemplates() {
    yield takeLatest(GET_EMAILTEMPLATES, getEmailTemplatesAPI);
}

// Get List Templates
export function* getListTemplates() {
    yield takeLatest(GET_LISTTEMPLATES, getListTemplatesAPI);
}

// add New EmailTemplate 
export function* addNewEmailTemplate() {
    yield takeLatest(ADD_NEW_EMAILTEMPLATE, addNewEmailTemplateAPI);
}

// Edit EmailTemplate
export function* updateEmailTemplate() {
    yield takeLatest(UPDATE_EMAILTEMPLATE, updateEmailTemplateAPI);
}

//Edit EmailTemplate by Id
export function* getEmailTemplateById() {
    yield takeLatest(GET_EMAILTEMPLATE_BY_ID, getEmailTemplateByIdAPI);
}

//Get template update status
export function* updateTemplateStatus() {
    yield takeLatest(UPDATE_TEMPLATE_STATUS, updateTemplateStatusAPI);
}

//saga middleware
export default function* TemplatesSaga() {
    yield all([
        fork(getEmailTemplates),
        fork(getListTemplates),
        fork(addNewEmailTemplate),
        fork(updateEmailTemplate),
        fork(getEmailTemplateById),
        fork(updateTemplateStatus)
    ]);
}
