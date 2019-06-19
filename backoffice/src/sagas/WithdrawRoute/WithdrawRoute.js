import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    LISTCURRENCY,
    GET_WITHDRAWROUTELIST,
    DELETE_WITHDRAWROUTE,
    GET_WITHDRAWROUTEINFO,
    POST_WITHDRAWROUTEINFO,
    GETROUTEBYID
} from "Actions/types";
// import functions from action
import {
    getCurrencyListSuccess,
    getCurrencyListFailure,
    getWithdrawRouteListSuccess,
    getWithdrawRouteListFailure,
    deleteWithdrawRouteSuccess,
    deleteWithdrawRouteFailure,
    getWithdrawRouteInfoSuccess,
    getWithdrawRouteInfoFailure,
    postWithdrawRouteInfoSuccess,
    postWithdrawRouteInfoFailure,
    getRouteInfoByIdSuccess,
    getRouteInfoByIdFailure
} from "Actions/WithdrawRoute";

/* get currency list */
function* getCurrencyListRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/ListCurrency', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getCurrencyListSuccess(response.Response));
        } else {
            yield put(getCurrencyListFailure(response));
        }
    } catch (error) {
        yield put(getCurrencyListFailure(error));
    }
}
function* getCurrencyList() {
    yield takeEvery(LISTCURRENCY, getCurrencyListRequest);
}
/* get added route list records */
function* getWithdrawRouteListData({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllRouteConfiguration/' + payload.TrnType, payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWithdrawRouteListSuccess(response.Response));
        } else {
            yield put(getWithdrawRouteListFailure(response));
        }
    } catch (error) {
        yield put(getWithdrawRouteListFailure(error));
    }
}
function* getWithdrawRouteList() {
    yield takeEvery(GET_WITHDRAWROUTELIST, getWithdrawRouteListData);
}
function* deleteWithdrawRouteData(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken };
    const request = {
        Request: {
            ServiceID: payload.withdrawRouteId.routeId,
            status: 9,
            AvailableRoute: [],
            TrnType: payload.withdrawRouteId.TrnType, // for withdrawal
            CurrencyName: '',
        }
    };
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/UpdateWithdrawRouteConfiguration', request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(deleteWithdrawRouteSuccess(response));
        } else {
            yield put(deleteWithdrawRouteFailure(response));
        }
    } catch (error) {
        yield put(deleteWithdrawRouteFailure(error));
    }
}
function* deleteWithdrawRoute() {
    yield takeEvery(DELETE_WITHDRAWROUTE, deleteWithdrawRouteData);
}
// get available route information
function* getWithdrawRouteInfoData(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/GetAvailableRoute', payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getWithdrawRouteInfoSuccess(response.Response));
        } else {
            yield put(getWithdrawRouteInfoFailure(response));
        }
    } catch (error) {
        yield put(getWithdrawRouteInfoFailure(error));
    }
}
function* getWithdrawRouteInfo() {
    yield takeEvery(GET_WITHDRAWROUTEINFO, getWithdrawRouteInfoData);
}
// post route info method
function* postWithdrawRouteInfoData(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    let selectedRoutes = [];
    let request = {};
    request['CurrencyName'] = payload.payload.CurrencyName;
    request['ServiceID'] = payload.payload.ServiceID;
    request['status'] = payload.payload.status;
    request['TrnType'] = payload.payload.TrnType; // for withdrawal
    if (payload.payload.AvailableRoute.length) {
        payload.payload.AvailableRoute.forEach((route, index) => {
            if (payload.payload.TrnType === 9) {
                selectedRoutes.push({
                    Priority: (index + 1),
                    ServiceProDetailId: route.ServiceProDetailId,
                    ProviderWalletID: route.ProviderWalletID,
                    ConfirmationCount: route.ConfirmationCount,
                    AssetName: route.AssetName,
                    AccountNoLen: route.AccountNoLen,
                    AccNoStartsWith: route.AccNoStartsWith,
                    AccNoValidationRegex: route.AccNoValidationRegex
                });
            } else if (payload.payload.TrnType === 6) {
                selectedRoutes.push({
                    Priority: (index + 1),
                    ServiceProDetailId: route.ServiceProDetailId,
                    ProviderWalletID: route.ProviderWalletID,
                    ConfirmationCount: route.ConfirmationCount,
                    AssetName: route.AssetName,
                    ConvertAmount: route.ConvertAmount,
                });
            }
        });
        request['AvailableRoute'] = selectedRoutes;
    }
    let reqObj = {};
    let URL = "";
    reqObj['Request'] = request;
    if (payload.payload.editMode) {
        URL = "api/TransactionConfiguration/UpdateWithdrawRouteConfiguration";
    } else {
        URL = "api/TransactionConfiguration/AddWithdrawRouteConfiguration";
    }
    const response = yield call(swaggerPostAPI, URL, reqObj, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(postWithdrawRouteInfoSuccess(response));
        } else {
            yield put(postWithdrawRouteInfoFailure(response));
        }
    } catch (error) {
        yield put(postWithdrawRouteInfoFailure(error));
    }
}
function* postWithdrawRouteInfo() {
    yield takeEvery(POST_WITHDRAWROUTEINFO, postWithdrawRouteInfoData);
}
/* get route info by id */
function* getRouteInfoByIdRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetWithdrawRouteByService/' + payload.routeId.ServiceID + '/' + payload.routeId.TrnType, payload, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getRouteInfoByIdSuccess(response));
        } else {
            yield put(getRouteInfoByIdFailure(response));
        }
    } catch (error) {
        yield put(getRouteInfoByIdFailure(error));
    }
}
function* getRouteInfoById() {
    yield takeEvery(GETROUTEBYID, getRouteInfoByIdRequest);
}
export default function* rootSaga() {
    yield all([
        fork(getCurrencyList),
        fork(getWithdrawRouteList),
        fork(deleteWithdrawRoute),
        fork(getWithdrawRouteInfo),
        fork(postWithdrawRouteInfo),
        fork(getRouteInfoById),
    ]);
}
