/**
 * Create By Sanjay 
 * Created Date 09/02/2019
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'

//Action Types..
import {
  ADD_CONFIGURATION_SETUP,
  GET_PAY_TYPE,
  GET_SERVICE_TYPE,
  LIST_REFERRAL_REWARD_CONFIG,
  UPDATE_REFERRAL_REWARD_CONFIG,
  ACTIVE_REFERRAL_REWARD_CONFIG,
  INACTIVE_REFERRAL_REWARD_CONFIG,
  GET_REFERRAL_REWARD_CONFIG_BY_ID
} from "Actions/types";

//Action methods..
import {
  addConfigurationSetupSuccess,
  addConfigurationSetupFailure,
  getPayTypeSuccess,
  getPayTypeFailure,
  getServiceTypeSuccess,
  getServiceTypeFailure,
  getReferralRewardConfigDataSuccess,
  getReferralRewardConfigDataFailure,
  updateReferralRewardConfigSuccess,
  updateReferralRewardConfigFailure,
  activeReferralRewardConfigSuccess,
  activeReferralRewardConfigFailure,
  inactiveReferralRewardConfigSuccess,
  inactiveReferralRewardConfigFailure,
  getReferralRewardConfigByIdSuccess,
  getReferralRewardConfigByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';

//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';

//For List Referral Reward 
function* listReferralRewardConfigAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/Referral/ListReferralService?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.PAGE_SIZE, {}, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getReferralRewardConfigDataSuccess(response));
    } else {
      yield put(getReferralRewardConfigDataFailure(response));
    }
  } catch (error) {
    yield put(getReferralRewardConfigDataFailure(error));
  }
}

//For Add Referral Reward 
function* addConfigurationSetupAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/Referral/AddReferralService', payload, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(addConfigurationSetupSuccess(response));
    } else {
      yield put(addConfigurationSetupFailure(response));
    }
  } catch (error) {
    yield put(addConfigurationSetupFailure(error));
  }
}

//For Update Referral Reward 
function* updateReferralRewardConfigAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/Referral/UpdateReferralService', payload, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(updateReferralRewardConfigSuccess(response));
    } else {
      yield put(updateReferralRewardConfigFailure(response));
    }
  } catch (error) {
    yield put(updateReferralRewardConfigFailure(error));
  }
}

//For Enable Referral Reward 
function* enableReferralRewardConfigAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/Referral/EnableReferralService', payload, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(activeReferralRewardConfigSuccess(response));
    } else {
      yield put(activeReferralRewardConfigFailure(response));
    }
  } catch (error) {
    yield put(activeReferralRewardConfigFailure(error));
  }
}

//For List Referral Reward 
function* disableReferralRewardConfigAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/Referral/DisableReferralService', payload, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(inactiveReferralRewardConfigSuccess(response));
    } else {
      yield put(inactiveReferralRewardConfigFailure(response));
    }
  } catch (error) {
    yield put(inactiveReferralRewardConfigFailure(error));
  }
}

//For List Referral Reward 
function* getReferralRewardConfigByIdAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/Referral/GetReferralServiceById', payload, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getReferralRewardConfigByIdSuccess(response));
    } else {
      yield put(getReferralRewardConfigByIdFailure(response));
    }
  } catch (error) {
    yield put(getReferralRewardConfigByIdFailure(error)); 
  }
}

//For Get Pay Type Data from API
function* getPayTypeDataAPI() {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/Referral/DropDownReferralPayType', {}, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getPayTypeSuccess(response));
    } else {
      yield put(getPayTypeFailure(response));
    }
  } catch (error) {
    yield put(getPayTypeFailure(error));
  }
}


//For Get Service Type Data from API
function* getServiceTypeDataAPI() {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/Referral/DropDownReferralServiceType', {}, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getServiceTypeSuccess(response));
    } else {
      yield put(getServiceTypeFailure(response));
    }
  } catch (error) {
    yield put(getServiceTypeFailure(error));
  }
}

function* listReferralRewardConfig() {
  yield takeEvery(LIST_REFERRAL_REWARD_CONFIG, listReferralRewardConfigAPI);
}

function* updateReferralRewardConfig() {
  yield takeEvery(UPDATE_REFERRAL_REWARD_CONFIG, updateReferralRewardConfigAPI);
}

function* enableReferralRewardConfig() {
  yield takeEvery(ACTIVE_REFERRAL_REWARD_CONFIG, enableReferralRewardConfigAPI);
}

function* disableReferralRewardConfig() {
  yield takeEvery(INACTIVE_REFERRAL_REWARD_CONFIG, disableReferralRewardConfigAPI);
}

function* getReferralRewardConfigById() {
  yield takeEvery(GET_REFERRAL_REWARD_CONFIG_BY_ID, getReferralRewardConfigByIdAPI);
}

function* addConfiSetup() {
  yield takeEvery(ADD_CONFIGURATION_SETUP, addConfigurationSetupAPI);
}

function* getPayTypeData() {
  yield takeEvery(GET_PAY_TYPE, getPayTypeDataAPI);
}

function* getServiceTypeData() {
  yield takeEvery(GET_SERVICE_TYPE, getServiceTypeDataAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
  yield all([
    fork(addConfiSetup),
    fork(getPayTypeData),
    fork(getServiceTypeData),
    fork(listReferralRewardConfig),
    fork(updateReferralRewardConfig),
    fork(enableReferralRewardConfig),
    fork(disableReferralRewardConfig),
    fork(getReferralRewardConfigById)
  ]);
}
