/**
 * Auther : Salim Deraiya
 * Created : 04/04/2019
 * Language Preference Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { SET_LANGUAGE } from "Actions/types";
import { setLanguageSuccess, setLanguageFailure } from "Actions";
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI } from 'Helpers/helpers';


//Function for Language Preference
function* setLanguagePreferenceApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Manage/UpdateLanguagePreference/'+payload.locale, {}, headers);
    const fullResponse = {
        locale : payload,
        response : response
    }
    
	try {
        if(response.ReturnCode === 0) {
            localStorage.setItem('locale',payload.locale);
            yield put(setLanguageSuccess(fullResponse));
        } else {
            yield put(setLanguageFailure(fullResponse));
        }
	} catch (error) {
		yield put(setLanguageFailure(error));
	}
}

/**
 * Device WhiteList
 */
export function* setLanguagePreferenceSagas() {
	yield takeEvery(SET_LANGUAGE, setLanguagePreferenceApi);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
	yield all([
		fork(setLanguagePreferenceSagas)
	]);
}