import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import {
    swaggerGetAPI,
} from "../../api/helper";
import {
    GET_STAKINGHISTORY_LIST,
} from '../../actions/ActionTypes';
import {
    getStakingHistoryListSuccess,
    getStakingHistoryListFailure,
} from '../../actions/Wallet/StackingHistoryAction';
import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Constants';

//get Staking History list from API
function* getStakingHistoryListRequest({ payload }) {

    try {
        var request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.GetStackingHistory + '/' + request.PageSize + '/' + request.PageNo + '?';
        if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
            URL += '&FromDate=' + request.FromDate;
        }
        if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
            URL += '&ToDate=' + request.ToDate;
        }
        if (request.hasOwnProperty("Slab") && request.Slab != "") {
            URL += '&Slab=' + request.Slab;
        }
        if (request.hasOwnProperty("UserId") && request.UserId != "") {
            URL += '&UserId=' + request.UserId;
        }
        if (request.hasOwnProperty("StakingType") && request.StakingType != "") {
            URL += '&StakingType=' + request.StakingType;
        }

        // To call Stacking History List Data Api
        const response = yield call(swaggerGetAPI, URL, {}, headers);

        // To set Stacking History List success response to reducer
        yield put(getStakingHistoryListSuccess(response));
    } catch (error) {
        // To set Stacking History List Failure response to reducer
        yield put(getStakingHistoryListFailure(error));
    }
}

//To call Stacking History List Api
export function* getStakingHistoryList() {
    yield takeEvery(GET_STAKINGHISTORY_LIST, getStakingHistoryListRequest);
}

// link to root saga middleware
export default function* rootSaga() {
    yield all([
        fork(getStakingHistoryList),
    ]);
}