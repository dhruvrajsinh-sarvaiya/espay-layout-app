import {
    FETCH_SLAB_LIST,
    FETCH_SLAB_LIST_SUCCESS,
    FETCH_SLAB_LIST_FAILURE,
    FETCHING_TOKEN_STACKING_HISTORY_DATA,
    FETCHING_TOKEN_STACKING_HISTORY_SUCCESS,
    FETCHING_TOKEN_STACKING_HISTORY_FAILURE,
    STAKREQUEST,
    PRECONFIRMATIONDETAILS,
    UNSTAKING_REQUEST
} from "../actions/ActionTypes";
import { put, takeLatest, select, call, } from 'redux-saga/effects'
import { swaggerGetAPI, swaggerPostAPI } from "../api/helper";
import { userAccessToken } from "../selector";
import { Method } from "../controllers/Constants";
import { postStackRequestSuccess, postStackRequestFailure, getPreConfirmationDetailsSuccess, getPreConfirmationDetailsFailure, UnstackingRequestSuccess, UnstackingRequestFailure } from "../actions/Wallet/TockenStackingAction";

// Fetch Slab List Data
function* fetchSlabListData(payload) {
    try {
        var request = payload.request;
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Slab List api
        const data = yield call(swaggerGetAPI, Method.GetStackingPolicyDetail + '/' + request.StatkingTypeID + '/' + request.CurrencyTypeID, payload, headers);
        
        // To set Slab List success response to reducer
        yield put({ type: FETCH_SLAB_LIST_SUCCESS, data })
    } catch (error) {
        // To set Slab List failure response to reducer
        yield put({ type: FETCH_SLAB_LIST_FAILURE, e })
    }
}

// staking request confirmation...
function* postStackRequestServer(payload) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Post Stack Request Server api
        const responseFromSocket = yield call(swaggerPostAPI, Method.UserStackingPolicyRequest, payload.request, headers);
        
        // To set Post Stacking Request success response to reducer
        yield put(postStackRequestSuccess(responseFromSocket));
    } catch (error) {
        // To set Post Stacking Request failure response to reducer
        yield put(postStackRequestFailure(error));
    }
}

// pre confirmation details request...
function* getPreConfirmationRequest(payload) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Pre Confirmation Stack Request Server api
        const responseFromSocket = yield call(swaggerPostAPI, Method.GetPreStackingConfirmationData, payload.request, headers);
        
        // To set Pre Confirmation Detail success response to reducer
        yield put(getPreConfirmationDetailsSuccess(responseFromSocket));
    } catch (error) {
        // To set Pre Confirmation Detail failure response to reducer
        yield put(getPreConfirmationDetailsFailure(error));
    }
}

// Fetch On Token History Data
function* fetchTokenHistoryData(payload) {
    try {
        const request = payload.stakingHistoryRequest;
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // create requestUrl
        var URL = Method.GetStackingHistory + '/' + request.PageSize + "/" + request.Page + '?';

        // FromDate is not undefined and empty
        if (request.hasOwnProperty("FromDate") && request.FromDate != "") {
            URL += '&FromDate=' + request.FromDate;
        }        

        // ToDate is not undefined and empty
        if (request.hasOwnProperty("ToDate") && request.ToDate != "") {
            URL += '&ToDate=' + request.ToDate;
        }

        // Type is not undefined and empty
        if (request.hasOwnProperty("Type") && request.Type != "") {
            URL += '&Type=' + request.Type;
        }

        // Slab is not undefined and empty
        if (request.hasOwnProperty("Slab") && request.Slab != "") {
            URL += '&Slab=' + request.Slab;
        }
        
        // StackingType is not undefined and empty
        if (request.hasOwnProperty("StakingType") && request.StakingType != "") {
            URL += '&StakingType=' + request.StakingType;
        }

        // To call Token Stacking History api
        const data = yield call(swaggerGetAPI, URL, request, headers);

        // To set Token Stacking History success response to reducer
        yield put({ type: FETCHING_TOKEN_STACKING_HISTORY_SUCCESS, data })
    } catch (e) {
        // To set Token Stacking History failure response to reducer
        yield put({ type: FETCHING_TOKEN_STACKING_HISTORY_FAILURE, e })
    }
}

// pre confirmation details request...
function* unstakingRequest(payload) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Unstacking Request api
        const responseFromSocket = yield call(swaggerPostAPI, Method.UserUnstackingRequest, payload.request, headers);
        
        // To set Unstacking Request success response to reducer
        yield put(UnstackingRequestSuccess(responseFromSocket));
    } catch (error) {
        // To set Unstacking Request failure response to reducer
        yield put(UnstackingRequestFailure(error));
    }
}

function* TokenStackingSaga() {

    // Call to get pre confirmation details...
    yield takeLatest(PRECONFIRMATIONDETAILS, getPreConfirmationRequest)

    // Post staking final request...
    yield takeLatest(STAKREQUEST, postStackRequestServer)

    // Call Get Slab List Data From Api
    yield takeLatest(FETCH_SLAB_LIST, fetchSlabListData)

    // Call get Token Stacking History Data
    yield takeLatest(FETCHING_TOKEN_STACKING_HISTORY_DATA, fetchTokenHistoryData)

    // Call Unstaking Request
    yield takeLatest(UNSTAKING_REQUEST, unstakingRequest)

}

export default TokenStackingSaga
