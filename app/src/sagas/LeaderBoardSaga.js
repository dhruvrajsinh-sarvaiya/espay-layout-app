//Sagas Effects..
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
//Action Types..
import {
    GET_LEADER_BOARD_LIST
} from '../actions/ActionTypes';

//Action methods..
import {
    getLeaderBoardListSuccess,
    getLeaderBoardListFailure
} from '../actions/Wallet/LeaderBoardAction';

import { swaggerGetAPI, queryBuilder } from '../api/helper';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';

//Function for Get Leader Board List API
function* getLeaderBoardListAPI({ payload }) {
    try {
        const request = payload;

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // Create request
        let req = {};
        if (request.UserCount > 0) {
            req = {
                ...req,
                UserCount: request.UserCount
            }
        }

        // To call Leader Board List api
        const response = yield call(swaggerGetAPI, Method.LeaderBoard + queryBuilder(req), request, headers);

        // To set leader board list success response to reducer
        yield put(getLeaderBoardListSuccess(response));
    } catch (error) {
        // To set leader board list failure response to reducer
        yield put(getLeaderBoardListFailure(error));
    }
}

// Create Sagas method for Get Leader Board List
export function* getLeaderBoardListSagas() {
    yield takeLatest(GET_LEADER_BOARD_LIST, getLeaderBoardListAPI);
}

// Export methods to rootSagas
export default function* rootSaga() {
    yield all([
        // To register Leader Board List method
        fork(getLeaderBoardListSagas)
    ]);
}