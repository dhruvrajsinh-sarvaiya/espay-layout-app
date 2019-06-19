/**
 * Create By Sanjay 
 * Created Date 06/03/2019
 * Saga For Referral URL Click By User
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
    REFERRAL_URL_CLICK
} from 'Actions/types';

import {
    referralUrlClickSuccess,
    referralUrlClickFailure
} from 'Actions/MyAccount';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//Function For Get Referral Code
function* referralURLClickDataAPI({payload}) {
    
    const response = yield call(swaggerPostAPI, 'api/Referral/AddReferralUserClick', payload, {});
    
    try {
        if (response.ReturnCode === 0) {
            yield put(referralUrlClickSuccess(response));
        } else {
            yield put(referralUrlClickFailure(response));
        }
    } catch (error) {
        yield put(referralUrlClickFailure(error));
    }
}

function* referralURLClickData() {
    yield takeEvery(REFERRAL_URL_CLICK, referralURLClickDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(referralURLClickData)
    ]);
}