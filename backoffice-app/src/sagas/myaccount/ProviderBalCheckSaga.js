import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_PROVIDER_BAL_LIST } from '../../actions/ActionTypes';
import { getProviderBalListSuccess, getProviderBalListFailure } from '../../actions/account/ProviderBalCheckAction';

export default function* ProviderBalCheckSaga() {
    // To register Get Provider Balance Check List method
    yield takeEvery(GET_PROVIDER_BAL_LIST, getProviderBalCheckList)
}

// Generator for Get Provider Balance Check
function* getProviderBalCheckList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let Request = Method.GetLPProviderBalance + '/' + payload.SMSCode;

        // create request
        let obj = {}

        if (payload.ServiceProviderId !== undefined && payload.ServiceProviderId !== '') {
            obj = { ...obj, SerProID: payload.ServiceProviderId }
        }
        if (payload.GenerateMismatch !== undefined && payload.GenerateMismatch !== '') {
            obj = { ...obj, GenerateMismatch: payload.GenerateMismatch }
        }

        // Create New Request
        let newRequest = Request + queryBuilder(obj)

        // To call Get Provider Balance Check Data Api
        const data = yield call(swaggerGetAPI, newRequest, obj, headers);

        // To set Get Provider Balance Check success response to reducer
        yield put(getProviderBalListSuccess(data));
    } catch (error) {
        // To set Get Provider Balance Check failure response to reducer
        yield put(getProviderBalListFailure());
    }
}