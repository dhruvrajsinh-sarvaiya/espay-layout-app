import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from "../../api/helper";
import {
    GET_WITHDRAWROUTELIST,
    DELETE_WITHDRAWROUTE,
    GET_WITHDRAWROUTEINFO,
    ADD_ADDRESS_GENRATION_ROUTE,
    UPDATE_ADDRESS_GENRATION_ROUTE
} from "../../actions/ActionTypes";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";
import {
    getWithdrawRouteListSuccess,
    getWithdrawRouteListFailure,
    getWithdrawRouteInfoSuccess,
    getWithdrawRouteInfoFailure,
    addAddressGenrationRouteSuccess,
    addAddressGenrationRouteFailure,
    updateAddressGenrationRouteFailure,
    updateAddressGenrationRouteSuccess,
    deleteWithdrawRouteSuccess,
    deleteWithdrawRouteFailure,
} from "../../actions/Wallet/AddressGenrationRouteAction";

/* get added route list records */
function* getWithdrawRouteListData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call addressgenration Route List Data Api
        const response = yield call(swaggerGetAPI, Method.GetAllRouteConfiguration + '/' + payload.TrnType, payload, headers);

        // To set addressgenration Route List success response to reducer
        yield put(getWithdrawRouteListSuccess(response));
    } catch (error) {

        // To set addressgenration Route List failure response to reducer
        yield put(getWithdrawRouteListFailure(error));
    }
}

/* GET addressgenration Route list */
function* getWithdrawRouteList() {
    yield takeEvery(GET_WITHDRAWROUTELIST, getWithdrawRouteListData);
}

// Generator for Delete address Genration Route Data
function* deleteWithdrawRouteData({ payload }) {
    try {
        const request = {
            Request: {
                ServiceID: payload.ServiceID,
                status: payload.status,
                AvailableRoute: [],
                TrnType: payload.TrnType,
                CurrencyName: '',
            }
        };

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Delete address Genration Api
        const response = yield call(swaggerPostAPI, Method.UpdateWithdrawRouteConfiguration, request, headers);

        // To set Delete address Genration success response to reducer
        yield put(deleteWithdrawRouteSuccess(response));
    } catch (error) {

        // To set Delete address Genration failure response to reducer
        yield put(deleteWithdrawRouteFailure(error));
    }
}

/* delete address Genrationr */
function* deleteWithdrawRoute() {
    yield takeEvery(DELETE_WITHDRAWROUTE, deleteWithdrawRouteData);
}

// get available route information
function* getWithdrawRouteInfoData(payload) {

    try {

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Routes List Api
        const response = yield call(swaggerPostAPI, Method.GetAvailableRoute, {}, headers);

        // To set Routes success response to reducer
        yield put(getWithdrawRouteInfoSuccess(response));
    } catch (error) {

        // To set Routes Failure response to reducer
        yield put(getWithdrawRouteInfoFailure(error));
    }
}

/* GET routs list */
function* getWithdrawRouteInfo() {
    yield takeEvery(GET_WITHDRAWROUTEINFO, getWithdrawRouteInfoData);
}

// add address genration route info method
function* addAddressGenrationRouteApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        let request = {};
        var headers = { 'Authorization': token }
        let selectedRoutes = [];

        request['status'] = payload.status;
        request['ServiceID'] = payload.ServiceID;
        request['TrnType'] = payload.TrnType; // for withdrawal
        request['CurrencyName'] = payload.CurrencyName;
        if (payload.AvailableRoute.length) {
            payload.AvailableRoute.forEach((route, index) => {
                if (payload.TrnType === 9) { // TrnType=9 for address genration route else withdraw route
                    selectedRoutes.push({
                        AccNoStartsWith: route.AccNoStartsWith,
                        Priority: (index + 1),
                        ServiceProDetailId: route.ServiceProDetailId,
                        AccNoValidationRegex: route.AccNoValidationRegex,
                        AccountNoLen: route.AccountNoLen,
                        ConfirmationCount: route.ConfirmationCount,
                        AssetName: route.AssetName,
                        ProviderWalletID: route.ProviderWalletID,
                    });
                } else {
                    selectedRoutes.push({
                        Priority: (index + 1),
                        ServiceProDetailId: route.ServiceProDetailId,
                        ConfirmationCount: route.ConfirmationCount,
                        AssetName: route.AssetName,
                        ProviderWalletID: route.ProviderWalletID,
                        ConvertAmount: route.ConvertAmount,
                    });
                }
            });
            request['AvailableRoute'] = selectedRoutes;
        }
        let reqObj = {};
        reqObj['Request'] = request;

        // To call add address genration route Api
        const response = yield call(swaggerPostAPI, Method.AddWithdrawRouteConfiguration, reqObj, headers);

        // To set add address genration routes success response to reducer
        yield put(addAddressGenrationRouteSuccess(response));
    } catch (error) {

        // To set address genration routes failure response to reducer
        yield put(addAddressGenrationRouteFailure(error));
    }
}

/* addAddressGenrationRoute */
function* addAddressGenrationRoute() {
    yield takeEvery(ADD_ADDRESS_GENRATION_ROUTE, addAddressGenrationRouteApi);
}

// Generator for updateAddressGenrationRoute Api
function* updateAddressGenrationRouteApi({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let selectedRoutes = [];
        let request = {};
        request['CurrencyName'] = payload.CurrencyName;
        request['ServiceID'] = payload.ServiceID;
        request['status'] = payload.status;
        request['TrnType'] = payload.TrnType; // for withdrawal
        if (payload.AvailableRoute.length) {
            payload.AvailableRoute.forEach((route, index) => {
                if (payload.TrnType === 9) {//TrnType=9 for address genration route else withdraw route
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
                } else {
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
        reqObj['Request'] = request;

        // To call Edit Address genration Route Api
        const response = yield call(swaggerPostAPI, Method.UpdateWithdrawRouteConfiguration, reqObj, headers);

        // To set Edit Address genration Route success response to reducer
        yield put(updateAddressGenrationRouteSuccess(response));
    } catch (error) {

        // To set Edit Address genration Route Failure response to reducer
        yield put(updateAddressGenrationRouteFailure(error));
    }
}

/* get updateAddressGenrationRoute */
function* updateAddressGenrationRoute() {
    yield takeEvery(UPDATE_ADDRESS_GENRATION_ROUTE, updateAddressGenrationRouteApi);
}

export default function* rootSaga() {
    yield all([
        fork(getWithdrawRouteList),
        fork(deleteWithdrawRoute),
        fork(getWithdrawRouteInfo),
        fork(addAddressGenrationRoute),
        fork(updateAddressGenrationRoute),
    ]);
}
