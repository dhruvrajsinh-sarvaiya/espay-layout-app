import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { swaggerPostAPI, swaggerDeleteAPI, swaggerPutAPI } from "../../api/helper";
import { DELETE_WALLET_TYPE_MASTER, ADD_WALLET_TYPE_MASTER, UPDATE_WALLET_TYPE_MASTER } from '../../actions/ActionTypes';
import {
    deleteWalletTypeMasterSuccess,
    deleteWalletTypeMasterFailure,
    addWalletTypeMasterSuccess,
    addWalletTypeMasterFailure,
    onUpdateWalletTypeMasterSuccess,
    onUpdateWalletTypeMasterFail,
} from '../../actions/Wallet/WalletTypesAction';
import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";

//Get deleteWalletTypeMasterAPI
function* deleteWalletTypeMasterAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Delete Wallet Master Api
        const response = yield call(swaggerDeleteAPI, Method.DeleteWalletTypeMaster + '/' + payload.id, {}, headers);

        // To set Delete Wallet Master success response to reducer
        yield put(deleteWalletTypeMasterSuccess(response));
    } catch (error) {

        // To set Delete Wallet Master failure response to reducer
        yield put(deleteWalletTypeMasterFailure(error));
    }
}

function* addWalletTypeMasterAPI({ payload }) {

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call add Wallet Master Api
    const response = yield call(swaggerPostAPI, Method.AddWalletTypeMaster, payload, headers); try {

        // To set add Wallet Master success response to reducer
        yield put(addWalletTypeMasterSuccess(response));
    } catch (error) {

        // To set add Wallet Master success response to reducer
        yield put(addWalletTypeMasterFailure(error));
    }
}

function* updateWalletTypeMasterAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call edit Wallet Master Api
        const response = yield call(swaggerPutAPI, Method.UpdateWalletTypeMaster + '/' + payload.id, payload, headers);

        // To set edit Wallet Master success response to reducer
        yield put(onUpdateWalletTypeMasterSuccess(response));
    } catch (error) {
        // To set edit Wallet Master success response to reducer
        yield put(onUpdateWalletTypeMasterFail(error));
    }
}

//deleteWalletTypeMaster call
function* deleteWalletTypeMaster() {
    yield takeEvery(DELETE_WALLET_TYPE_MASTER, deleteWalletTypeMasterAPI);
}
//addWalletTypeMaster call
function* addWalletTypeMaster() {
    yield takeEvery(ADD_WALLET_TYPE_MASTER, addWalletTypeMasterAPI);
}
//updateWalletTypeMaster call
function* updateWalletTypeMaster() {
    yield takeEvery(UPDATE_WALLET_TYPE_MASTER, updateWalletTypeMasterAPI);
}

//root saga middleware
export default function* rootSaga() {
    yield all([
        fork(deleteWalletTypeMaster),
        fork(addWalletTypeMaster),
        fork(updateWalletTypeMaster),
    ]);
}
