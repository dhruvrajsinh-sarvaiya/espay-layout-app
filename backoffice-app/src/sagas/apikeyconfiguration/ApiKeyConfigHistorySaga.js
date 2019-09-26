import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_API_KEY_CONFIG_HISTORY } from '../../actions/ActionTypes';
import { getApiKeyConfigHistorySuccess } from '../../actions/ApiKeyConfiguration/ApiKeyConfigHistoryAction';

export default function* ApiKeyConfigHistorySaga() {
    // To register Api Key Configuration History method
    yield takeEvery(GET_API_KEY_CONFIG_HISTORY, getApiKeyConfigurationHistory)
}

// Generator for Api Key Configuration History
function* getApiKeyConfigurationHistory({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request
        let obj = {}

        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj, FromDate: payload.FromDate
            }
        }

        if (payload.PageNo !== undefined && payload.PageNo !== '') {
            obj = {
                ...obj, PageNo: payload.PageNo
            }
        }
        
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj, ToDate: payload.ToDate
            }
        }
        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            obj = {
                ...obj, PageSize: payload.PageSize
            }
        }

        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = {
                ...obj, UserID: payload.UserId
            }
        }

        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj, Status: payload.Status
            }
        }

        if (payload.PlanId !== undefined && payload.PlanId !== '') {
            obj = {
                ...obj, PlanID: payload.PlanId
            }
        }
        // To call Api Key Configuration History Data Api
        const data = yield call(swaggerPostAPI, Method.ViewPublicAPIKeys, obj, headers)

        // To set Api Key Configuration History success response to reducer
        yield put(getApiKeyConfigHistorySuccess(data))
    } catch (error) {
        // To set Api Key Configuration History failure response to reducer
        yield put(getApiKeyConfigHistoryFailure())
    }
}