/* 
    Developer : Vishva shah
    Date : 12-06-2019
    File Comment :  Arbitrage Address saga 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_ARBITRAGE_ADDRESS_LIST,
    INSERT_UPDATE_ARBITRAGEADDRESS,
} from 'Actions/types';
import {
    getArbitrageAddressListSuccess,
    getArbitrageAddressListFailure,
    insertUpdateArbitrageAddressSuccess,
    insertUpdateArbitrageAddressFailure
} from 'Actions/Arbitrage/ArbitrageProviderAddress';
//get arbitrage address list
function* getArbitrageAddressListRequest(payload) {
    var request = payload.payload;
    var headers = { 'Authorization': AppConfig.authorizationToken }
     var URL = 'api/ArbitrageWalletControlPanel/ListArbitrageAddress' + '?';
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
        URL += '&WalletTypeId=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("Address") && request.Address != "") {
        URL += '&Address=' + request.Address;
    }
    if (request.hasOwnProperty("ServiceProviderId") && request.ServiceProviderId != "") {
        URL += '&ServiceProviderId=' + request.ServiceProviderId;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
            if (response.ReturnCode == 0) {
                yield put(getArbitrageAddressListSuccess(response));
            } else {
                yield put(getArbitrageAddressListFailure(response));
            }
    } catch (error) {
        yield put(getArbitrageAddressListFailure(error));
    }
}
/* Insert & Update arbitrage address  */
function* insertUpdateArbitrageAddressRequest(payload) {
    const request = payload.payload
    var req = {
        Id: request.Id,
        Address: request.Address,
        IsDefaultAddress: request.IsDefault,
        ServiceProviderID: request.SerProId,
        WalletTypeId: request.WalletTypeId,
    }
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/ArbitrageWalletControlPanel/InsertUpdateArbitrageAddress', req, headers);
    try {
        // check response code
            if (response.ReturnCode == 0) {
                yield put(insertUpdateArbitrageAddressSuccess(response));
            } else {
                yield put(insertUpdateArbitrageAddressFailure(response));
            }
        
    } catch (error) {
        yield put(insertUpdateArbitrageAddressFailure(error));
    }
}
/* get arbitrage address list */
export function* getArbitrageAddressList() {
    yield takeEvery(GET_ARBITRAGE_ADDRESS_LIST, getArbitrageAddressListRequest);
}
// get inser&update arbitrage address
export function* insertUpdateArbitrageAddress() {
    yield takeEvery(INSERT_UPDATE_ARBITRAGEADDRESS, insertUpdateArbitrageAddressRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getArbitrageAddressList),
        fork(insertUpdateArbitrageAddress),
    ]);
}