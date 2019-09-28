// ApiPlanConfigHistorySaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_API_PLAN_CONFIG_HISTORY } from '../../actions/ActionTypes';
import { getApiPlanConfigurationHistorySuccess, getApiPlanConfigurationHistoryFailure } from '../../actions/ApiKeyConfiguration/ApiPlanConfigHistoryAction';

export default function* ApiPlanConfigHistorySaga() {
    // To register Get Api Plan Configuration History method
    yield takeEvery(GET_API_PLAN_CONFIG_HISTORY, getApiPlanConfigHistoryData)
}

// Generator for Get Api Plan Configuration History
function* getApiPlanConfigHistoryData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let obj = payload;

        if (obj) {
            if (obj.UserID === undefined || obj.UserID == 0 || obj.UserID === '') {
                delete obj.UserID
            }
            if (obj.PlanID === undefined || obj.PlanID == 0 || obj.PlanID === '') {
                delete obj.PlanID
            }
        }

        // To call Get Api Plan Configuration History Data Api
        const data = yield call(swaggerPostAPI, Method.ViewAPIPlanConfigurationHistory, obj, headers)

        // To set Get Api Plan Configuration History success response to reducer
        yield put(getApiPlanConfigurationHistorySuccess(data))
    } catch (error) {
        // To set Get Api Plan Configuration History failure response to reducer
        yield put(getApiPlanConfigurationHistoryFailure())
    }
}