import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI,
    queryBuilder
} from "../../api/helper";
import {
    GET_TOKEN_TRANSFER,
    GET_TOKEN_TRANSFER_LIST
} from '../../actions/ActionTypes';
import {
    getTokenTransferSuccess,
    getTokenTransferFailure,
    getTokenTransferlistSuccess,
    getTokenTransferlistFailure
} from '../../actions/Wallet/TokenTransferAction';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';

//Token transfer
function* tokenTransferRequest({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add Token transfer Api
        const response = yield call(swaggerPostAPI, Method.TokenTransfer, payload, headers);

        // To set add Token transfer success response to reducer
        yield put(getTokenTransferSuccess(response));
    } catch (error) {

        // To set add Token transfer failure response to reducer
        yield put(getTokenTransferFailure(error));
    }
}

//Token transfer list
function* tokenTransferListRequest({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Token transfer List Api
        const response = yield call(swaggerGetAPI, Method.TokenTransferHistory + queryBuilder(payload), payload, headers);

        // To set Token transfer List success response to reducer
        yield put(getTokenTransferlistSuccess(response));
    } catch (error) {
        // To set Token transfer List Failure response to reducer
        yield put(getTokenTransferlistFailure(error));
    }
}

/*token Transfer Add */
export function* tokenTransfer() {
    yield takeEvery(GET_TOKEN_TRANSFER, tokenTransferRequest);
}
/*token Transfer List */
export function* tokenTransferList() {
    yield takeEvery(GET_TOKEN_TRANSFER_LIST, tokenTransferListRequest);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(tokenTransfer),
        fork(tokenTransferList)
    ]);
}