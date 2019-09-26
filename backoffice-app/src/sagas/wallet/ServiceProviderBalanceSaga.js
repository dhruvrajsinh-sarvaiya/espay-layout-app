import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_SERVICE_PROVIDER_BAL_LIST } from '../../actions/ActionTypes';
import { getServiceProviderBalListSuccess, getServiceProviderBalListFailure } from '../../actions/Wallet/ServiceProviderBalActions';

export default function* ServiceProviderBalanceSaga() {
    // Get Service Provider Bal List
    yield takeEvery(GET_SERVICE_PROVIDER_BAL_LIST, getServiceProviderBalList);
}

// Generator for Get Service Provider Bal List
function* getServiceProviderBalList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = Method.GetServiceProviderBalance + '/' + payload.ServiceProviderId + '/' + payload.CurrencyName
        let obj = {}
        if (payload.TransactionType !== undefined && payload.TransactionType !== '') {
            obj = {
                ...obj,
                TransactionType: payload.TransactionType
            }
            url += queryBuilder(obj)
        }

        // To call Service Provider Bal List Data Api
        const data = yield call(swaggerGetAPI, url, obj, headers);

        // To set Service Provider Bal List success response to reducer
        yield put(getServiceProviderBalListSuccess(data));
    } catch (error) {
        // To set Service Provider Bal List failure response to reducer
        yield put(getServiceProviderBalListFailure());
    }
}
