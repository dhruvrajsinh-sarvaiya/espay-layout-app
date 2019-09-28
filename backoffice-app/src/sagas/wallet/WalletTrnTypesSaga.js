import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_WALLET_TRN_TYPES_LIST, CHANGE_WALLET_TRN_TYPE, ADD_WALLET_TRN_TYPES } from '../../actions/ActionTypes';
import { getWalletTrnTypesListFailure, getWalletTrnTypesListSuccess, changeWalletTrnTypesSuccess, changeWalletTrnTypesFailure, addWalletTrnTypesSuccess, addWalletTrnTypesFailure } from '../../actions/Wallet/WalletTrnTypesActions';

export default function* WalletTrnTypesSaga() {
    // To register Get Wallet Trn Types List method
    yield takeEvery(GET_WALLET_TRN_TYPES_LIST, getWalletTrnTypesData);
    // To register Change Wallet Trn Types method
    yield takeEvery(CHANGE_WALLET_TRN_TYPE, changeWalletTrnTypeData);
    // To register Add Wallet Trn Types method
    yield takeEvery(ADD_WALLET_TRN_TYPES, addWalletTrnTypeData);
}

// Generator for Get Wallet Trn Types List
function* getWalletTrnTypesData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Get Wallet Trn Types List Data Api
        const data = yield call(swaggerGetAPI, Method.ListUserWalletBlockTrnType, payload, headers);

        // To set Get Wallet Trn Types List success response to reducer
        yield put(getWalletTrnTypesListSuccess(data));
    } catch (error) {
        // To set Get Wallet Trn Types List failure response to reducer
        yield put(getWalletTrnTypesListFailure());
    }
}

// Generator for Change Wallet Trn Types
function* changeWalletTrnTypeData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Change Wallet Trn Types Data Api
        const data = yield call(swaggerPostAPI, Method.ChangeUserWalletBlockTrnTypeStatus + '/' + payload.Id + '/' + payload.Status, payload, headers);

        // To set Change Wallet Trn Types success response to reducer
        yield put(changeWalletTrnTypesSuccess(data));
    } catch (error) {
        // To set Change Wallet Trn Types failure response to reducer
        yield put(changeWalletTrnTypesFailure());
    }
}

// Generator for Add Wallet Trn Types
function* addWalletTrnTypeData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Wallet Trn Types Data Api
        const data = yield call(swaggerPostAPI, Method.InsertUpdateUserWalletBlockTrnType, payload, headers);

        // To set Add Wallet Trn Types success response to reducer
        yield put(addWalletTrnTypesSuccess(data));
    } catch (error) {
        // To set Add Wallet Trn Types failure response to reducer
        yield put(addWalletTrnTypesFailure());
    }
}