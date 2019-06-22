import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
import { GET_HELPMANUALMODUALS, GET_HELPMANUALS_BY_ID } from '../actions/ActionTypes';
import {
    getHelpManualModulesSuccess,
    getHelpManualModulesFailure,
    getHelpManualByIdSuccess,
    getHelpManualByIdFailure
} from '../actions/CMS/HelpCenterAction';

import { WebPageUrlGetApi } from "../api/helper";
import { Method } from "../controllers/Constants";
import { userAccessToken } from '../selector';

//Function for Get HelpManualModule Data API
function* getHelpManualModuleAPI() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };

        // To call Help Manual Module api
        const response = yield call(WebPageUrlGetApi, Method.listHelpManualModule, {}, headers);

        // To set Help Manual Module success response to reducer
        yield put(getHelpManualModulesSuccess(response));
    } catch (error) {
        // To set Help Manual Module failure response to reducer
        yield put(getHelpManualModulesFailure(error));
    }
}

//Function for Get HelpManual By ID API
function* getHelpManualByIdAPI(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };

        // To call Help Manual Module By Id api
        const response = yield call(WebPageUrlGetApi, Method.getHelpManualByModuleId + payload.payload, {}, headers);

        // To set Help Manual Module By Id success response to reducer
        yield put(getHelpManualByIdSuccess(response));
    } catch (error) {
        // To set Help Manual Module By Id failure response to reducer
        yield put(getHelpManualByIdFailure(error));
    }
}

//Get HelpManualModule
export function* getHelpManualModules() {
    yield takeLatest(GET_HELPMANUALMODUALS, getHelpManualModuleAPI);
}

//Get HelpManual by Id
export function* getHelpManualById() {
    yield takeLatest(GET_HELPMANUALS_BY_ID, getHelpManualByIdAPI);
}

//HelpManualModule Root Saga
export default function* HelpCenterSaga() {
    yield all([
        // To register getHelpManualModules method
        fork(getHelpManualModules),
        // To register getHelpManualById method
        fork(getHelpManualById)
    ]);
}