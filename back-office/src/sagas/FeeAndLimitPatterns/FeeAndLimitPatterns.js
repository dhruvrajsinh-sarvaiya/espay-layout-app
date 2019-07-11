/* 
    Developer : Nishant Vadgam
    Date : 27-08-2018
    File Comment : Fee & Limits Patterns Saga methods
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import {
    GET_PATTERNLIST,
    DELETE_PATTERN,
    GET_PATTERNINFO,
    POST_PATTERNINFO,
    GET_PATTERNBYID
} from "Actions/types";

// import functions from action
import {
    getPatternListSuccess,
    getPatternListFailure,
    deletePatterSuccess,
    deletePatterFailure,
    getPatternInfoSuccess,
    getPatternInfoFailure,
    postPatternInfoSuccess,
    postPatternInfoFailure,
    getPatternByIdSuccess,
    getPatternByIdFailure
} from "Actions/FeeAndLimitPatterns";

// get pattern list request
const getPatternListRequest = async () =>
    await api
        .get("feesAndLimitPatterns.js")
        .then(response => response)
        .catch(error => error);
// get pattern list data 
function* getPatternListData() {
    try {
        const response = yield call(getPatternListRequest);
        yield put(getPatternListSuccess(response));
    } catch (error) {
        yield put(getPatternListFailure(error));
    }
}
// get existing pattern list
function* getPatternList() {
    yield takeEvery(GET_PATTERNLIST, getPatternListData);
}

// delelete server request
const deletePatternsRequest = async index =>
    await api
        .post("feesAndLimitPatterns.js", { index })
        .then(response => response)
        .catch(error => error);

// delete params data with pattern ID
function* deletePatternData(patternId) {
    try {
        const response = yield call(deletePatternsRequest, patternId);
        yield put(deletePatterSuccess(response));
    } catch (error) {
        yield put(deletePatterFailure(error));
    }
}
// delete method saga
function* deletePattern() {
    yield takeEvery(DELETE_PATTERN, deletePatternData);
}

// get info server request
const getPatternInfoRequest = async () =>
    await api.get('getPatternInfo')
        .then(response => response)
        .catch(error => error);
// get info data
function* getPatternInfoData() {
    try {
        const response = yield call(getPatternInfoRequest);
        yield put(getPatternInfoSuccess(response));
    } catch (error) {
        yield put(getPatternInfoFailure(error));
    }
}
// get info for add new pattern
function* getPatternInfo() {
    yield takeEvery(GET_PATTERNINFO, getPatternInfoData)
}
/* POST data request to server */
const postPatternInfoRequest = async (request) =>
    await api.post('postPatternInfo', { request })
        .then(response => response)
        .catch(error => error);
// post data
function* postPatternInfoData(request) {
    try {
        const response = yield call(postPatternInfoRequest, request);
        yield put(postPatternInfoSuccess(response));
    } catch (error) {
        yield put(postPatternInfoFailure(error));
    }
}
// form post request to server
function* postPatternInfo() {
    yield takeEvery(POST_PATTERNINFO, postPatternInfoData)
}

function* getPatternByIdData(payload) {
    try {
        const response = {
            data: {
                patternId : payload.payload,
                activeIndex: 0,
                //main form details
                patternName: 'My Name '+ payload.payload,
                patternDesc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo',
                patternStatus: 'Active',
                patternExchange: 'PAROEXCHANGE',
                // deposit form
                depositFeeAndLimit: {
                    errors: {},
                    depositFeeType: 'Fixed',
                    depositFeeRange: 'No',
                    depositFeeAmount: '',
                    limits: [{
                        type: 'Monthly',
                        min_amount: '01',
                        max_amount: '10',
                    }, {
                        type: 'Weekly',
                        min_amount: '20',
                        max_amount: '10',
                    }],
                    fees: [{
                        from: '',
                        to: '',
                        amount: '',
                    }],
                    coins: [],
                    isSubmitted: false,
                },
                // withdraw form
                withdrawFeeAndLimit: {
                    errors: {},
                    withdrawFeeType: 'Fixed',
                    withdrawFeeRange: 'Yes',
                    withdrawFeeAmount: '',
                    limits: [{
                        type: '',
                        min_amount: '',
                        max_amount: '',
                    }],
                    fees: [{
                        from: '10',
                        to: '20',
                        amount: '5',
                    }, {
                        from: '20',
                        to: '30',
                        amount: '10',
                    }],
                    coins: [],
                    isSubmitted: false,
                },
                //trade form
                tradeFeeAndLimit: {
                    errors: {},
                    tradeFeeType: 'Fixed',
                    tradeFeeRange: 'No',
                    tradeFeeAmount: '',
                    limits: [{
                        type: '',
                        min_amount: '',
                        max_amount: '',
                    }],
                    fees: [{
                        from: '',
                        to: '',
                        amount: '',
                    }],
                    pairs: [],
                    isSubmitted: false,
                },
                // errors
                errors: {}
            }
        }
        yield put(getPatternByIdSuccess(response));
    } catch (error) {
        yield put(getPatternByIdFailure(error));
    }
}
// get pattern details by ID
function* getPatternById() {
    yield takeEvery(GET_PATTERNBYID, getPatternByIdData);
}

export default function* rootSaga() {
    yield all([
        fork(getPatternList),
        fork(deletePattern),
        fork(getPatternInfo),
        fork(postPatternInfo),
        fork(getPatternById)
    ]);
}
