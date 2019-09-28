
import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { GET_PERSONAL_INFO, EDIT_PERSONAL_INFO } from '../../actions/ActionTypes';
import {
  getPersonalInfoDataSuccess, getPersonalInfoDataFailure, editPersonalInfoDataSuccess, editPersonalInfoDataFailure
} from '../../actions/account/PersonalInfoAction';
import { Method } from '../../controllers/Constants';
import { swaggerPostAPI, swaggerGetAPI } from "../../api/helper";
import { userAccessToken } from '../../selector';

//Display Personal Information Data Configuration API
function* getPersonalInfoDataAPI() {
  try {

    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }

    // To call user info api
    const response = yield call(swaggerGetAPI, Method.userinfo, {}, headers);

    // To set user info success response to reducer
    yield put(getPersonalInfoDataSuccess(response));
  } catch (error) {

    // To set user info failure response to reducer
    yield put(getPersonalInfoDataFailure(error));
  }
}

//Function for Edit Personal Information Data Configuration API
function* editPersonalInfoDataAPI({ payload }) {
  try {

    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }

    // To call edit user info api
    const response = yield call(swaggerPostAPI, Method.userinfo, payload, headers);

    // To set edit user info success response to reducer
    yield put(editPersonalInfoDataSuccess(response));
  } catch (error) {

    // To set edit user info failure response to reducer
    yield put(editPersonalInfoDataFailure(error));
  }
}

//Display Personal Information Data 
function* getPersonalInfoData() {
  yield takeEvery(GET_PERSONAL_INFO, getPersonalInfoDataAPI);
}

//Function for Edit Personal Information Data
function* editPersonalInfoData() {
  yield takeEvery(EDIT_PERSONAL_INFO, editPersonalInfoDataAPI);
}

//saga middleware
export default function* rootSaga() {
  yield all([
    fork(getPersonalInfoData),
    fork(editPersonalInfoData)
  ]);
}