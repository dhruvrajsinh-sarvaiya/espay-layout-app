// TemplateConfigurationSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import {
    getTemplateConfigurationListSuccess, getTemplateConfigurationListFailure,
    getTemplateCategoryTypeSuccess, getTemplateCategoryTypeFailure,
    updateTemplateConfigurationSuccess, updateTemplateConfigurationFailure,
} from '../../actions/CMS/TemplateConfigurationAction';
import { GET_TEMPLATE_CONFIGURATION_LIST, GET_TEMPLATE_CATEGORY_TYPE, UPDATE_TEMPLATE_CONFIGURATION } from '../../actions/ActionTypes';

export default function* TemplateConfigurationSaga() {
    // To register Template Configuration method
    yield takeEvery(GET_TEMPLATE_CONFIGURATION_LIST, TemplateConfigurationList);
    yield takeEvery(GET_TEMPLATE_CATEGORY_TYPE, GetTemplateCategorybyId);
    yield takeEvery(UPDATE_TEMPLATE_CONFIGURATION, UpdateTemplateConfiguration);
}

// Generator for Template Configuration
function* TemplateConfigurationList() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Template Configuration Data Api
        const data = yield call(swaggerGetAPI, Method.ListTemplateType, {}, headers);

        // To set Template Configuration success response to reducer
        yield put(getTemplateConfigurationListSuccess(data));
    } catch (error) {
        // To set Template Configuration failure response to reducer
        yield put(getTemplateConfigurationListFailure());
    }
}

// Generator for Template Category By id
function* GetTemplateCategorybyId({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Template Category By id Data Api
        const data = yield call(swaggerGetAPI, Method.GetTemplateByCategory + '/' + payload.id, {}, headers);

        // To set Template Category By id success response to reducer
        yield put(getTemplateCategoryTypeSuccess(data));
    } catch (error) {
        // To set Template Category By id failure response to reducer
        yield put(getTemplateCategoryTypeFailure());
    }
}

// Generator for Update Template Configuration
function* UpdateTemplateConfiguration({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Update Template Configuration Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateTemplateCategory + '/' + payload.TemplateType + "/" + payload.Status + "/" + payload.TemplateID, {}, headers);

        // To set Update Template Configuration success response to reducer
        yield put(updateTemplateConfigurationSuccess(data));
    } catch (error) {
        // To set Update Template Configuration failure response to reducer
        yield put(updateTemplateConfigurationFailure());
    }
}