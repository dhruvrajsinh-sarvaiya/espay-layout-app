import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, swaggerPostAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_DEPOSIT_ROUTE_LIST, DELETE_DEPOSIT_ROUTE_DATA, ADD_DEPOSIT_ROUTE } from '../../actions/ActionTypes';
import { getDepositRouteListSuccess, getDepositRouteListFailure, deleteDepositRouteDataSuccess, deleteDepositRouteDataFailure, addDepositRouteSuccess, addDepositRouteFailure } from '../../actions/Wallet/DepositRouteActions';

export default function* DepositRouteSaga() {
    // To register Get Deposit Route List method
    yield takeEvery(GET_DEPOSIT_ROUTE_LIST, getDepositRouteList);
    // To register Delete Deposit Route List method
    yield takeEvery(DELETE_DEPOSIT_ROUTE_DATA, deleteDepositRouteData);
    // To register Add Deposit Route List method
    yield takeEvery(ADD_DEPOSIT_ROUTE, addDepositRouteData);
}

// Generator for Add Deposit Route List
function* addDepositRouteData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Add Deposit Route List Data Api
        const data = yield call(swaggerPostAPI, Method.InsertUpdateDepositCounter, payload, headers);

        // To set Add Deposit Route List success response to reducer
        yield put(addDepositRouteSuccess(data));
    } catch (error) {
        // To set Add Deposit Route List failure response to reducer
        yield put(addDepositRouteFailure());
    }
}

// Generator for Delete Deposit Route List
function* deleteDepositRouteData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Delete Deposit Route List Data Api
        const data = yield call(swaggerPostAPI, Method.ChangeDepositCounterStatus + '/' + payload.Id + '/' + payload.Status, payload, headers);

        // To set Delete Deposit Route List success response to reducer
        yield put(deleteDepositRouteDataSuccess(data));
    } catch (error) {
        // To set Delete Deposit Route List failure response to reducer
        yield put(deleteDepositRouteDataFailure());
    }
}

// Generator for Get Deposit Route List
function* getDepositRouteList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let Request = Method.GetDepositCounter + '/' + payload.PageNo + '/' + payload.PageSize;

        // create request
        let obj = { PageNo: payload.PageNo, PageSize: payload.PageSize }

        if (payload.WalletTypeId !== undefined && payload.WalletTypeId !== '') {
            obj = {
                ...obj,
                WalletTypeId: payload.WalletTypeId
            }
        }
        if (payload.ProviderId !== undefined && payload.ProviderId !== '') {
            obj = {
                ...obj,
                SerProId: payload.ProviderId
            }
        }
        // Create New Request
        let newRequest = Request + queryBuilder(obj)

        // To call Get Deposit Route List Data Api
        const data = yield call(swaggerGetAPI, newRequest, obj, headers);

        // To set Get Deposit Route List success response to reducer
        yield put(getDepositRouteListSuccess(data));
    } catch (error) {
        // To set Get Deposit Route List failure response to reducer
        yield put(getDepositRouteListFailure());
    }
}