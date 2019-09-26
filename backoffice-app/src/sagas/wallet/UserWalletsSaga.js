import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_USER_WALLETS_LIST, GET_WALLET_LEDGER_LIST, GET_AUTH_USER_LIST } from '../../actions/ActionTypes';
import { getUserWalletsListSuccess, getUserWalletsListFailure, getWalletLedgerListSuccess, getWalletLedgerListFailure, getAuthUserListSuccess, getAuthUserListFailure } from '../../actions/Wallet/UserWalletsActions';

export default function* UserWalletsSaga() {
    // To register Get User Wallets List method
    yield takeEvery(GET_USER_WALLETS_LIST, getUserWalletsList);
    // To register Get Wallet Ledger List method
    yield takeEvery(GET_WALLET_LEDGER_LIST, getWalletLedgerList);
    // To register Get Auth User List method
    yield takeEvery(GET_AUTH_USER_LIST, getAuthUserList);
}

// Generator for Get WalletL Ledger List
function* getWalletLedgerList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let request = Method.GetWalletLedger + '/' + payload.FromDate + '/' + payload.ToDate + '/' + payload.WalletId + '/' + payload.PageNo + '/' + payload.PageSize;

        // To call Get WalletL Ledger List Data Api
        const data = yield call(swaggerGetAPI, request, {}, headers);

        // To set Get WalletL Ledger List success response to reducer
        yield put(getWalletLedgerListSuccess(data));
    } catch (error) {
        // To set Get WalletL Ledger List failure response to reducer
        yield put(getWalletLedgerListFailure());
    }
}

// Generator for Get Auth User List
function* getAuthUserList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let request = Method.ListWalletAuthorizeUser + '/' + payload.WalletId

        // To call Get Auth User List Data Api
        const data = yield call(swaggerGetAPI, request, {}, headers);

        // To set Get Auth User List success response to reducer
        yield put(getAuthUserListSuccess(data));
    } catch (error) {
        // To set Get Auth User List failure response to reducer
        yield put(getAuthUserListFailure());
    }
}

// Generator for Get User Wallets List
function* getUserWalletsList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let Request = Method.ListAllWallet + '/' + payload.PageSize + '/' + payload.PageNo;

        // create request
        let obj = {}

        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = { ...obj, FromDate: payload.FromDate }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = { ...obj, ToDate: payload.ToDate }
        }
        if (payload.Status !== undefined && payload.Status !== '') {
            obj = { ...obj, Status: payload.Status }
        }
        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = { ...obj, UserId: payload.UserId }
        }
        if (payload.OrgId !== undefined && payload.OrgId !== '') {
            obj = { ...obj, OrgId: payload.OrgId }
        }
        if (payload.WalletType !== undefined && payload.WalletType !== '') {
            obj = { ...obj, WalletType: payload.WalletType }
        }

        // Create New Request
        let newRequest = Request + queryBuilder(obj)

        // To call Get User Wallets List Data Api
        const data = yield call(swaggerGetAPI, newRequest, obj, headers);

        // To set Get User Wallets List success response to reducer
        yield put(getUserWalletsListSuccess(data));
    } catch (error) {
        // To set Get User Wallets List failure response to reducer
        yield put(getUserWalletsListFailure());
    }
}