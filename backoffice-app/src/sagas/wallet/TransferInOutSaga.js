import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_TRANSFER_IN_LIST, GET_TRANSFER_OUT_LIST } from '../../actions/ActionTypes';
import { getTransferOutListFailure, getTransferOutListSuccess, getTransferInListSuccess, getTransferInListFailure } from '../../actions/Wallet/TransferInOutActions';

export default function* TransferInOutSaga() {
    // To register Get Transfer In List method
    yield takeEvery(GET_TRANSFER_IN_LIST, getTransferInList);
    // To register Get Transfer Out List method
    yield takeEvery(GET_TRANSFER_OUT_LIST, getTransferOutList);
}

// Generator for Get Transfer Out List
function* getTransferOutList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let request = Method.GetTransferOut + '/' + payload.PageNo + '/' + payload.PageSize + '/' + payload.Coin;

        // create request
        let obj = {}

        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = {
                ...obj, UserId: payload.UserId
            }
        }
        if (payload.TrnId !== undefined && payload.TrnId !== '') {
            obj = {
                ...obj, TrnID: payload.TrnId
            }
        }
        if (payload.Address !== undefined && payload.Address !== '') {
            obj = {
                ...obj, Address: payload.Address
            }
        }
        if (payload.OrgId !== undefined && payload.OrgId !== '') {
            obj = {
                ...obj, OrgId: payload.OrgId
            }
        }

        // Create New Request
        let newRequest = request + queryBuilder(obj)

        // To call Transfer Out List Data Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);

        // To set Transfer Out List success response to reducer
        yield put(getTransferOutListSuccess(data));
    } catch (error) {
        // To set Transfer Out List failure response to reducer
        yield put(getTransferOutListFailure());
    }
}

// Generator for Get Transfer In List
function* getTransferInList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let request = Method.GetTransferIn + '/' + payload.PageNo + '/' + payload.PageSize + '/' + payload.Coin;

        // create request
        let obj = {}

        if (payload.UserId !== undefined && payload.UserId !== '') {
            obj = {
                ...obj,
                UserId: payload.UserId
            }
        }
        if (payload.Address !== undefined && payload.Address !== '') {
            obj = {
                ...obj,
                Address: payload.Address
            }
        }
        if (payload.TrnId !== undefined && payload.TrnId !== '') {
            obj = {
                ...obj,
                TrnID: payload.TrnId
            }
        }
        if (payload.OrgId !== undefined && payload.OrgId !== '') {
            obj = {
                ...obj,
                OrgId: payload.OrgId
            }
        }

        // Create New Request
        let newRequest = request + queryBuilder(obj)

        // To call Transfer In List Data Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);

        // To set Transfer In List success response to reducer
        yield put(getTransferInListSuccess(data));
    } catch (error) {
        // To set Transfer In List failure response to reducer
        yield put(getTransferInListFailure());
    }
}