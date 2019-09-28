import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    swaggerGetAPI, queryBuilder,
} from "../../api/helper";
import {
    GET_ORG_WALLETS,
    GET_ORG_LEDGER
} from "../../actions/ActionTypes";
import {
    getOrganizationWalletsSuccess,
    getOrganizationWalletsFailure,
    getOrganizationLedgerSuccess,
    getOrganizationLedgerFailure
} from '../../actions/Wallet/OrginizationLedgerAction';
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";

// get organization wallets request
function* getOrganizationWalletsRequest({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.ListOrganizationWallet + queryBuilder(payload);
        /*   if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
              URL += "&WalletTypeId=" + request.WalletTypeId;
          }
          if (request.hasOwnProperty("WalletUsageType") && request.WalletUsageType != "") {
              URL += "&WalletUsageType=" + request.WalletUsageType;
          } */

        // To call Org wallet Data Api
        const response = yield call(swaggerGetAPI, URL, payload, headers);

        // To set Org wallet success response to reducer
        yield put(getOrganizationWalletsSuccess(response));
    } catch (error) {
        // To set Org wallet Failure response to reducer
        yield put(getOrganizationWalletsFailure(error));
    }
}

// get organization wallet ledger
function* getOrganizationLedgerRequest({ payload }) {

    try {
        const request = payload

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.GetWalletLedger + '/' + request.FromDate + "/" + request.ToDate + "/" + request.AccWalletId + "/" + request.PageNo + "/" + request.PageSize;

        // To call Org ledger Data Api
        const response = yield call(swaggerGetAPI, URL, request, headers);

        // To set organization Ledger success response to reducer
        yield put(getOrganizationLedgerSuccess(response));
    } catch (error) {

        // To set organization Ledger success response to reducer
        yield put(getOrganizationLedgerFailure(error));
    }
}

//get organization wallets
export function* getOrganizationWallets() {
    yield takeEvery(GET_ORG_WALLETS, getOrganizationWalletsRequest);
}
//get organization wallet ledger
export function* getOrganizationLedger() {
    yield takeEvery(GET_ORG_LEDGER, getOrganizationLedgerRequest);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getOrganizationWallets),
        fork(getOrganizationLedger)
    ]);
}
