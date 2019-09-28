import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { queryBuilder, swaggerGetAPI } from "../../api/helper";
import { ARBI_LIST_WALLET_MASTER } from "../../actions/ActionTypes";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Constants";
import { getArbiUserWalletsListSuccess, getArbiUserWalletsListFailure } from "../../actions/Arbitrage/ArbitrageUserWalletsActions";

// Generator for Arbitrage user wallets List
function* getArbiUserWalletsApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token };

        // To call Arbitrage user wallets list Api
        const response = yield call(swaggerGetAPI, Method.ListWalletMaster + queryBuilder(payload), {}, headers);

        // To set Arbitrage user wallets list success response to reducer
        yield put(getArbiUserWalletsListSuccess(response));
    } catch (error) {

        // To set Arbitrage user wallets list failure response to reducer
        yield put(getArbiUserWalletsListFailure(error));
    }
}

//call Apis
export function* ArbitrageUserWalletsSaga() {
    // To register Arbitrage user wallets List method
    yield takeEvery(ARBI_LIST_WALLET_MASTER, getArbiUserWalletsApi);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(ArbitrageUserWalletsSaga),
    ]);
}
