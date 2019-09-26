import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, swaggerPostAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { getIncreDecreTokenSupplyListSuccess, getIncreDecreTokenSupplyListFailure, addIncreaseTokenSuccess, addIncreaseTokenFailure, addDecreaseTokenSuccess, addDecreaseTokenFailure, getDestroyBlackFundListSuccess, getDestroyBlackFundListFailure, getTransferFeeListSuccess, getTransferFeeListFailure, addTransferFeeSuccess, addTransferFeeFailure } from '../../actions/Wallet/ERC223DashboardActions';
import { GET_INCRE_DECRE_TOKEN_SUPPLY, ADD_INCREASE_TOKEN, ADD_DECREASE_TOKEN, GET_DESTROY_BLACKFUND_LIST, GET_TRANSFER_FEE_LIST, ADD_TRANSFER_FEE } from '../../actions/ActionTypes';

export default function* ERC223DashboardSaga() {
    // To register Get Increase Decrease Token Supply method
    yield takeEvery(GET_INCRE_DECRE_TOKEN_SUPPLY, getIncreDecreTokenSupplyList);
    // To register Add Increase Token method
    yield takeEvery(ADD_INCREASE_TOKEN, addIncreaseTokenData);
    // To register Add Decrease Token method
    yield takeEvery(ADD_DECREASE_TOKEN, addDecreaseTokenData);
    // To register Destroy Black Fund method
    yield takeEvery(GET_DESTROY_BLACKFUND_LIST, getDestroyBlackFundList);
    // To register Transfer Fee method
    yield takeEvery(GET_TRANSFER_FEE_LIST, getTransferFeeList);
    // To register Add Transfer Fee method
    yield takeEvery(ADD_TRANSFER_FEE, addTransferFeeData);
}

// Generator for Add Transfer Fee
function* addTransferFeeData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Transfer Fee Data Api
        const data = yield call(swaggerPostAPI, Method.SetTransferFee, payload, headers);

        // To set Transfer Fee success response to reducer
        yield put(addTransferFeeSuccess(data));
    } catch (error) {
        // To set Transfer Fee failure response to reducer
        yield put(addTransferFeeFailure());
    }
}

// Generator for Get Transfer Fee List
function* getTransferFeeList({ payload }) {
    try {
        let obj = {}
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }



        // WalletTypeId is not undefined and empty
        if (payload.WalletTypeId !== undefined && payload.WalletTypeId !== '') {
            obj = {
                ...obj, WalletTypeId: payload.WalletTypeId
            }
        }
        // ToDate is not undefined and empty
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj, ToDate: payload.ToDate
            }
        }
        // FromDate is not undefined and empty
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj, FromDate: payload.FromDate
            }
        }
        // request url
        let reqUrl = Method.TransferFeeHistory + queryBuilder(obj)

        // To call Transfer Fee Data Api
        const data = yield call(swaggerGetAPI, reqUrl, obj, headers);

        // To set Transfer Fee success response to reducer
        yield put(getTransferFeeListSuccess(data));
    } catch (error) {
        // To set Transfer Fee failure response to reducer
        yield put(getTransferFeeListFailure());
    }
}

// Generator for Get Destroy Black Fund List
function* getDestroyBlackFundList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        let obj = {}
        // FromDate is not undefined and empty
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }

        // ToDate is not undefined and empty
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }

        // Address is not undefined and empty
        if (payload.Address !== undefined && payload.Address !== '') {
            obj = { ...obj, Address: payload.Address }
        }

        // request url
        let reqUrl = Method.DestroyedBlackFundHistory + queryBuilder(obj)

        // To call Destroy Black Fund Data Api
        const data = yield call(swaggerGetAPI, reqUrl, obj, headers);

        // To set Destroy Black Fund success response to reducer
        yield put(getDestroyBlackFundListSuccess(data));
    } catch (error) {
        // To set Destroy Black Fund failure response to reducer
        yield put(getDestroyBlackFundListFailure());
    }
}

// Generator for Add Decrease Token Supply
function* addDecreaseTokenData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Decrease Token Supply Data Api
        const data = yield call(swaggerPostAPI, Method.DecreaseTokenSupply, payload, headers);

        // To set Decrease Token Supply success response to reducer
        yield put(addDecreaseTokenSuccess(data));
    } catch (error) {
        // To set Decrease Token Supply failure response to reducer
        yield put(addDecreaseTokenFailure());
    }
}

// Generator for Add Increase Token Supply
function* addIncreaseTokenData({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Increase Token Supply Data Api
        const data = yield call(swaggerPostAPI, Method.IncreaseTokenSupply, payload, headers);

        // To set Increase Token Supply success response to reducer
        yield put(addIncreaseTokenSuccess(data));
    } catch (error) {
        // To set Increase Token Supply failure response to reducer
        yield put(addIncreaseTokenFailure());
    }
}

// Generator for Get Increase Decrease Token Supply
function* getIncreDecreTokenSupplyList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let obj = {}
        if (payload.FromDate !== undefined && payload.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: payload.FromDate
            }
        }
        if (payload.ToDate !== undefined && payload.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: payload.ToDate
            }
        }
        if (payload.WalletTypeId !== undefined && payload.WalletTypeId !== '') {
            obj = {
                ...obj,
                WalletTypeId: payload.WalletTypeId
            }
        }

        // request url
        let reqUrl = Method.IncreaseDecreaseTokenSupplyHistory + queryBuilder(obj)

        // To call Increase Decrease Token Supply Data Api
        const data = yield call(swaggerGetAPI, reqUrl, obj, headers);

        // To set Increase Decrease Token Supply success response to reducer
        yield put(getIncreDecreTokenSupplyListSuccess(data));
    } catch (error) {
        // To set Increase Decrease Token Supply failure response to reducer
        yield put(getIncreDecreTokenSupplyListFailure());
    }
}