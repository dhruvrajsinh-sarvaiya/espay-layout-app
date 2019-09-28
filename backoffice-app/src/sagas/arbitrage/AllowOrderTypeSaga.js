import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { getArbiAllowOrderTypeListSuccess, getArbiAllowOrderTypeListFailure, allowOrderTypeDataSuccess, allowOrderTypeDataFailure } from "../../actions/Arbitrage/AllowOrderTypeActions";
import { GET_ARBI_ALLOW_ORDER_TYPE_LIST, ALLOW_ORDER_TYPE_DATA } from '../../actions/ActionTypes';

export default function* AllowOrderTypeSaga() {
    // To register Get Arbitrage Allow Order Type List method
    yield takeEvery(GET_ARBI_ALLOW_ORDER_TYPE_LIST, getAllowOrderTypeList)
    // To register Update Order Type Data method
    yield takeEvery(ALLOW_ORDER_TYPE_DATA, allowOrderTypeData)
}

// Generator for Update Order Type
function* allowOrderTypeData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Update Order Type Data Api
        const data = yield call(swaggerPostAPI, Method.UpdateExchangeConfigurationArbitrage, payload, headers)

        // To set Update Order Type success response to reducer
        yield put(allowOrderTypeDataSuccess(data))
    } catch (error) {
        // To set Update Order Type failure response to reducer
        yield put(allowOrderTypeDataFailure())
    }
}

// Generator for Get Arbitrage Allow Order Type
function* getAllowOrderTypeList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let reqUrl = Method.GetAllExchangeConfigurationArbitrage + '/' + payload.PageNo

        // create request
        let obj = {}

        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            obj = {
                ...obj,
                PageSize: payload.PageSize
            }
        }

        // Create New Request
        let newRequest = reqUrl + queryBuilder(obj)

        // To call Get Arbitrage Allow Order Type Data Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers)

        // To set Get Arbitrage Allow Order Type success response to reducer
        yield put(getArbiAllowOrderTypeListSuccess(data))
    } catch (error) {
        // To set Get Arbitrage Allow Order Type failure response to reducer
        yield put(getArbiAllowOrderTypeListFailure())
    }
}