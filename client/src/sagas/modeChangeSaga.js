import { all, fork, call, put, takeEvery } from "redux-saga/effects";
import {
    MODE_CHANGE
} from "Actions/types";
// import functions from action
import {
    modeChangeSuccess,
    modeChangeFailure
} from "Actions";
import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Add Application Config Data
function* modeChangeDataAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Manage/DayNightModePreference', payload, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(modeChangeSuccess(response));
        } else {
            yield put(modeChangeFailure(response));
        }
    } catch (error) {
        yield put(modeChangeFailure(error));
    }
}

//Add Application Config Data
function* modeChangeData() {
    yield takeEvery(MODE_CHANGE, modeChangeDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(modeChangeData)
    ]);
}