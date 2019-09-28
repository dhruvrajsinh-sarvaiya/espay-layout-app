import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_ARBI_CURRENCY_CONFIG_LIST } from '../../actions/ActionTypes';
import { getCurrencyConfigListSuccess, getCurrencyConfigListFailure } from '../../actions/Arbitrage/CurrencyConfigActions';

export default function* CurrencyConfigSaga() {
    // To register Get Currency Config List method
    yield takeEvery(GET_ARBI_CURRENCY_CONFIG_LIST, getCurrencyConfigList)
}

// Generator for Get Currency Config
function* getCurrencyConfigList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Currency Config Data Api
        const data = yield call(swaggerGetAPI, Method.ListAllArbitrageWalletTypeMaster, {}, headers)

        // To set Get Currency Config success response to reducer
        yield put(getCurrencyConfigListSuccess(data))
    } catch (error) {
        // To set Get Currency Config failure response to reducer
        yield put(getCurrencyConfigListFailure())
    }
}