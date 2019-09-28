//Sagas Effects..
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { Method } from '../../controllers/Constants';
import { socialTradingHistoryListSuccess, socialTradingHistoryListFailure } from '../../actions/account/SocialTradingHistoryAction';
import { swaggerPostAPI } from '../../api/helper';
import { SOCIAL_TRADING_HISTORY_LIST } from '../../actions/ActionTypes';
import { userAccessToken } from '../../selector';

//Function for  Social Trading History
function* socialTradingHistoryListAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let request = {}

        if (payload.hasOwnProperty("UserID") && payload.UserID !== "") {
            request = {
                ...request,
                UserID: payload.UserID,
            }
        }
        if (payload.hasOwnProperty("Pair") && payload.Pair !== "") {
            request = {
                ...request,
                Pair: payload.Pair,
            }
        }
        if (payload.hasOwnProperty("TrnType") && payload.TrnType !== "") {
            request = {
                ...request,
                TrnType: payload.TrnType,
            }
        }
        if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
            request = {
                ...request,
                FromDate: payload.FromDate,
            }
        }
        if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
            request = {
                ...request,
                ToDate: payload.ToDate,
            }
        }
        if (payload.hasOwnProperty("FollowTradeType") && payload.FollowTradeType !== "") {
            request = {
                ...request,
                FollowTradeType: payload.FollowTradeType,
            }
        }
        if (payload.hasOwnProperty("FollowingTo") && payload.FollowingTo !== "") {
            request = {
                ...request,
                FollowingTo: payload.FollowingTo,
            }
        }
        if (payload.hasOwnProperty("PageNo") && payload.PageNo !== "") {
            request = {
                ...request,
                PageNo: payload.PageNo,
            }
        }
        if (payload.hasOwnProperty("PageSize") && payload.PageSize !== "") {
            request = {
                ...request,
                PageSize: payload.PageSize,
            }
        }

        // To call Social trading History list Api
        const response = yield call(swaggerPostAPI, Method.GetCopiedLeaderOrders, request, headers);

        // To set Social trading History list success response to reducer
        yield put(socialTradingHistoryListSuccess(response));
    } catch (error) {
        // To set Social trading History list Failure response to reducerF
        yield put(socialTradingHistoryListFailure());
    }
}

/* Create Sagas method for  Social Trading History */
export function* socialTradingHistoryListSagas() {
    yield takeEvery(SOCIAL_TRADING_HISTORY_LIST, socialTradingHistoryListAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(socialTradingHistoryListSagas),
    ]);
}