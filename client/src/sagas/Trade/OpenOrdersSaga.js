// sagas For Active My Open Order By Tejas Date : 14/9/2018

// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';

import AppConfig from 'Constants/AppConfig';

import { swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';

// types for set actions and reducers
import { GET_ACTIVE_OPEN_MY_ORDER_LIST,DO_CANCEL_ORDER } from 'Actions/types';

// action sfor set data or response
import { getOpenOrderListSuccess, getOpenOrderListFailure,
    doCancelOrderSuccess, doCancelOrderFailure } from 'Actions/Trade';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get My Open Order list data by :Tejas Date : 14/9/2018
function* getOpenOrderList() {
    yield takeEvery(GET_ACTIVE_OPEN_MY_ORDER_LIST, getOpenOrderListData)
}

// Function for Open Oders
function* getOpenOrderListData({payload}) {
   
    var headers =  {'Authorization': AppConfig.authorizationToken}
    const response = yield call(swaggerPostAPI,'api/Transaction/GetActiveOrder',payload,headers);   
    
    try {

        if(lgnErrCode.includes(response.statusCode)){
            redirectToLogin();
        } else if(statusErrCode.includes(response.statusCode)){               
            staticRes = staticResponse(response.statusCode);
            yield put(getOpenOrderListFailure(staticRes));
        } else if(response.statusCode === 200) {
            yield put(getOpenOrderListSuccess(response));
        } else {
            yield put(getOpenOrderListFailure(response));
        }

    } catch (error) {
        yield put(getOpenOrderListFailure(error));
    }

}

// Sagas Function for do Bulk Order list data by :Tejas Date : 20/9/2018
function* doCancelOrder() {
    yield takeEvery(DO_CANCEL_ORDER, doCancelOrderData)
}
    
// Function for set do Bulk Order data and Call Function for Api Call
function* doCancelOrderData({payload}) {    
    
    const { Order } = payload    
    //console.log("Cancel Request :",Order);
    var headers =  {'Authorization': AppConfig.authorizationToken}
    var requestObject = { TranNo : Order.TranNo,CancelAll:Order.CancelAll,OrderType:Order.OrderType }
    
    if(Order.hasOwnProperty('IsMargin') && Order.IsMargin === 1) {
        requestObject.IsMargin = 1
    }
    
    const response = yield call(swaggerPostAPI,'api/Transaction/CancelOrder',requestObject,headers);   
    //console.log(response);

    try {

        if(lgnErrCode.includes(response.statusCode)){
            redirectToLogin();
        } else if(statusErrCode.includes(response.statusCode)){               
            staticRes = staticResponse(response.statusCode);
            yield put(doCancelOrderFailure(staticRes));
        } else if(response.statusCode === 200) {
            yield put(doCancelOrderSuccess(response));
        } else {
            yield put(doCancelOrderFailure(response));
        }

    } catch (error) {
        yield put(doCancelOrderFailure(error));
    }

}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getOpenOrderList),
        fork(doCancelOrder)
    ]);
}