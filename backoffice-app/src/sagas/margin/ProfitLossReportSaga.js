import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { swaggerGetAPI, queryBuilder } from "../../api/helper";
import { GET_PROFITLOSS_LIST } from "../../actions/ActionTypes";
import { getProfitLossListSuccess, getProfitLossListFailure } from '../../actions/Margin/ProfitLossReportAction';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';

// api call for Profit Loss report 
function* getProfitLossreportDetails(payload) {
    var request = payload.payload;
    try {
        
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        
        // Create request url
        var url = Method.GetProfitNLossReportData + '/' + request.PageNo;

        let obj = { PageNo: request.PageNo }
        if (request.PairId !== undefined && request.PairId !== '') {
            obj = {
                ...obj,
                PairId: request.PairId
            }
        }

        if (request.UserID !== undefined && request.UserID !== '') {
            obj = {
                ...obj,
                UserID: request.UserID
            }
        }

        if (request.WalletType !== undefined && request.WalletType !== '') {
            obj = {
                ...obj,
                CurrencyName: request.WalletType
            }
        }

        if (request.PageSize !== undefined && request.PageSize !== '') {
            obj = {
                ...obj,
                PageSize: request.PageSize
            }
        }

        // create request
        let newReq = url + queryBuilder(obj)

        // To call Get Profit Loss report  Data Api
        const response = yield call(swaggerGetAPI, newReq, obj, headers);

        // To set Get Profit Loss report List success response to reducer
        yield put(getProfitLossListSuccess(response));
    } catch (error) {

        // To set Get Profit Loss report List failure response to reducer 
        yield put(getProfitLossListFailure(error));
    }
}

//get api for Profit Loss Report 
function* getProfitLossList() {
    // To register Get Profit Loss List method
    yield takeEvery(GET_PROFITLOSS_LIST, getProfitLossreportDetails);
}

export default function* rootSaga() {
    yield all([
        fork(getProfitLossList),
    ]);
}
