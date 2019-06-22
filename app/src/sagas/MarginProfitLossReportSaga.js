// MarginProfitLossReportSaga.js
import { call, select, put, takeLatest } from 'redux-saga/effects';
import { GET_MARGIN_PROFIT_LOSS_DATA, } from "../actions/ActionTypes";
import { getMarginProfitLossDataSuccess, getMarginProfitLossDataFailure, } from "../actions/Reports/MarginProfitLossAction";
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerGetAPI, queryBuilder } from '../api/helper';

function* marginProfitLossData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // Create requestUrl
        var Request = Method.GetProfitNLossReportData + '/' + payload.PageNo;

        // Create request
        let obj = {}

        // PageSize is not undefine and empty
        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            obj = {
                ...obj,
                PageSize: payload.PageSize
            }
        }

        // PairId is not undefine and empty
        if (payload.PairId !== undefined && payload.PairId !== '') {
            obj = {
                ...obj,
                PairId: payload.PairId
            }
        }

        // CurrencyName is not undefine and empty
        if (payload.CurrencyName !== undefined && payload.CurrencyName !== '') {
            obj = {
                ...obj,
                CurrencyName: payload.CurrencyName
            }
        }

        // Create Request into QueryBuilder
        let newRequest = Request + queryBuilder(obj)

        // To call MarginProfitLoss api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);

        // To set Margin Profit Loss success response to reducer
        yield put(getMarginProfitLossDataSuccess(data));
    } catch (error) {
        // To set Margin Profit Loss failure response to reducer
        yield put(getMarginProfitLossDataFailure());
    }
}

export default function* MarginProfitLossReportSaga() {

    // To register marginProfitLossData method
    yield takeLatest(GET_MARGIN_PROFIT_LOSS_DATA, marginProfitLossData);

}