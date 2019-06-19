// sagas For get charge type list  By Tejas Date : 6/2/2019

// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';

import AppConfig from 'Constants/AppConfig';

import { swaggerPostAPI,swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';

// types for set actions and reducers
import { GET_CHARGES_LIST } from 'Actions/types';

// action for set data or response
import { getChargeListSuccess, getChargeListFailure } from 'Actions/Trade';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get get charge type list data by :Tejas Date : 6/2/2019
function* getChargeList() {    
    yield takeEvery(GET_CHARGES_LIST, getChargeListData)
}

// Function for Open Oders
function* getChargeListData({payload}) {   

    // code changed by devang parekh for handling margintrading data (23-2-2019)
    if(payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
        var methodName = 'api/MarginWalletControlPanel/ListMarginChargesTypeWise';
    } else {
        var methodName = 'api/Wallet/ListChargesTypeWise';
    }
    // end
    
    var headers =  {'Authorization': AppConfig.authorizationToken}
    const response = yield call(swaggerGetAPI,methodName,payload,headers);   
    
    try {

        if(lgnErrCode.includes(response.statusCode)){
            redirectToLogin();
        } else if(statusErrCode.includes(response.statusCode)){               
            staticRes = staticResponse(response.statusCode);
            yield put(getChargeListFailure(staticRes));
        } else if(response.statusCode === 200) {
            yield put(getChargeListSuccess(response));
        } else {
            yield put(getChargeListFailure(response));
        }

    } catch (error) {
        yield put(getChargeListFailure(error));
    }

}


// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getChargeList),        
    ]);
}