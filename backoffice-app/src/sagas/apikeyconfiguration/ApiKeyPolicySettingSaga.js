// ApiKeyPolicySettingSaga.js
import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_PUBLIC_API_KEY_POLICY, UPDATE_PUBLIC_API_KEY_POLICY } from '../../actions/ActionTypes';
import {
    getApiKeyPolicySuccess, getApiKeyPolicyFailure,
    updateApiKeyPolicySuccess, updateApiKeyPolicyFailure
} from '../../actions/ApiKeyConfiguration/ApiKeyPolicySettingAction';

export default function* ApiKeyPolicySettingSaga() {
    // To register Get Api Key Policy Setting method
    yield takeEvery(GET_PUBLIC_API_KEY_POLICY, getApiKeyPolicy)
    // To register Get Api Key Policy Setting method
    yield takeEvery(UPDATE_PUBLIC_API_KEY_POLICY, updateApiKeyPolicy)
}

// Generator for Get Api Key Policy Setting
function* getApiKeyPolicy() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Api Key Policy Setting Data Api
        const data = yield call(swaggerPostAPI, Method.GetPublicAPIKeyPolicy, {}, headers)

        // To set Get Api Key Policy Setting success response to reducer
        yield put(getApiKeyPolicySuccess(data))
    } catch (error) {
        // To set Get Api Key Policy Setting failure response to reducer
        yield put(getApiKeyPolicyFailure())
    }
}
// Generator for Update Api Key Policy Setting
function* updateApiKeyPolicy({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Update Api Key Policy Setting Data Api
        const data = yield call(swaggerPostAPI, Method.UpdatePublicAPIKeyPolicy, payload, headers)

        // To set Update Api Key Policy Setting success response to reducer
        yield put(updateApiKeyPolicySuccess(data))
    } catch (error) {
        // To set Update Api Key Policy Setting failure response to reducer
        yield put(updateApiKeyPolicyFailure())
    }
}