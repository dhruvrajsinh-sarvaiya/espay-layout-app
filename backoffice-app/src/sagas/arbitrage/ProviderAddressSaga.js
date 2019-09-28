import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import {
    addProviderAddressSuccess, addProviderAddressFailure,
    updateProviderAddressSuccess, updateProviderAddressFailure
} from '../../actions/Arbitrage/ProviderAddressAction';
import { ADD_PROVIDER_ADDRESS_LIST, UPDATE_PROVIDER_ADDRESS_LIST } from '../../actions/ActionTypes';

export default function* ProviderAddressSaga() {
    // To register Get Provider Address List method
    yield takeEvery(ADD_PROVIDER_ADDRESS_LIST, addProviderAddressList)
    // To register Update Provider Address List
    yield takeEvery(UPDATE_PROVIDER_ADDRESS_LIST, updateProviderAddressList)
}

function* addProviderAddressList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Provider Address Data Api
        const data = yield call(swaggerPostAPI, Method.InsertUpdateArbitrageAddress, payload, headers);

        // To set Add Provider Address success response to reducer
        yield put(addProviderAddressSuccess(data));
    } catch (error) {
        // To set Add Provider Address failure response to reducer
        yield put(addProviderAddressFailure());
    }
}

function* updateProviderAddressList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Update Provider Address Data Api
        const data = yield call(swaggerPostAPI, Method.InsertUpdateArbitrageAddress, payload, headers);

        // To set Update Provider Address success response to reducer
        yield put(updateProviderAddressSuccess(data));
    } catch (error) {
        // To set Update Provider Address failure response to reducer
        yield put(updateProviderAddressFailure());
    }
}

