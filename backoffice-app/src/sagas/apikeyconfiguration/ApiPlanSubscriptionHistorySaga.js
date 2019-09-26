import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { getApiPlanSubHistorySuccess, getApiPlanSubHistoryFailure } from '../../actions/ApiKeyConfiguration/ApiPlanSubcriptionHistoryActions';
import { GET_API_PLAN_SUBSCRIPTION_HISTORY } from '../../actions/ActionTypes';

export default function* ApiPlanSubscriptionHistorySaga() {
    // To register Api Plan Subscription History method
    yield takeEvery(GET_API_PLAN_SUBSCRIPTION_HISTORY, getApiPlanSubscriptionHistory)
}

// Generator for Api Plan Subscription History
function* getApiPlanSubscriptionHistory({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request
        let obj = {}

        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }

        if (payload.PageNo !== undefined && payload.PageNo !== '') {
            obj = {
                ...obj,
                PageNo: payload.PageNo
            }
        }

        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            obj = {
                ...obj,
                PageSize: payload.PageSize
            }
        }

        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = {
                ...obj,
                UserID: payload.UserId
            }
        }

        if (payload.PlanId !== undefined && payload.PlanId !== '') {
            obj = {
                ...obj,
                PlanID: payload.PlanId
            }
        }

        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj,
                Status: payload.Status
            }
        }

        // To call Api Plan Subscription History Data Api
        const data = yield call(swaggerPostAPI, Method.ViewUserSubscriptionHistory, obj, headers)

        // To set Api Plan Subscription History success response to reducer
        yield put(getApiPlanSubHistorySuccess(data))
    } catch (error) {
        // To set Api Plan Subscription History failure response to reducer
        yield put(getApiPlanSubHistoryFailure())
    }
}