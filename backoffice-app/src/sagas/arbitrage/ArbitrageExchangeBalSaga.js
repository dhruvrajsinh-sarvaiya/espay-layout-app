import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { getArbitrageExchangeBalListSuccess, getArbitrageExchangeBalListFailure } from '../../actions/Arbitrage/ArbitrageExchangeBalActions';
import { GET_ARBI_EXCHANGE_BAL_LIST } from '../../actions/ActionTypes';

export default function* ArbitrageExchangeBalSaga() {
    // To register Get Arbitrage Exchange Bal List method
    yield takeEvery(GET_ARBI_EXCHANGE_BAL_LIST, getArbitrageExchangeBalList)
}

// Generator for Get Arbitrage Exchange Bal
function* getArbitrageExchangeBalList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // create request
        let obj = {}

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
        if (payload.SerProId !== undefined && payload.SerProId !== '') {
            obj = {
                ...obj,
                SerProID: payload.SerProId
            }
        }
        if (payload.SMSCode !== undefined && payload.SMSCode !== '') {
            obj = {
                ...obj,
                SMSCode: payload.SMSCode
            }
        }
        if (payload.GenerateMismatch !== undefined && payload.GenerateMismatch !== '') {
            obj = {
                ...obj,
                GenerateMismatch: payload.GenerateMismatch
            }
        }

        // Create New Request
        let newRequest = Method.ArbitrageProviderBalance + queryBuilder(obj)

        // To call Get Arbitrage Exchange Bal Data Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers)

        // To set Get Arbitrage Exchange Bal success response to reducer
        yield put(getArbitrageExchangeBalListSuccess(data))
    } catch (error) {
        // To set Get Arbitrage Exchange Bal failure response to reducer
        yield put(getArbitrageExchangeBalListFailure())
    }
}