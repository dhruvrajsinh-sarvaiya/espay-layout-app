// sagas For Api Plan Configuration By Tejas 21/2/2019

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI, swaggerGetAPI, } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
  ADD_API_PLAN_CONFIG_DATA,
  UPDATE_API_PLAN_CONFIG_DATA,
  GET_API_PLAN_CONFIG_LIST,
  GET_REST_METHOD_READ_ONLY,
  GET_REST_METHOD_FULL_ACCESS,
  ENABLE_DISABLE_API_PLAN
} from "Actions/types";

// action sfor set data or Request
import {
  addApiPlanConfigDataSuccess,
  addApiPlanConfigDataFailure,
  updateApiPlanConfigDataSuccess,
  updateApiPlanConfigDataFailure,
  getApiPlanConfigListSuccess,
  getApiPlanConfigListFailure,
  getRestMethodReadOnlySuccess,
  getRestMethodReadOnlyFailure,
  getRestMethodFullAccessSuccess,
  getRestMethodFullAccessFailure,
  enableDisableAPIPlanSuccess,
  enableDisableAPIPlanFailure
} from "Actions/ApiKeyConfiguration";

// Sagas Function for Add Api Plan Configuration List by :Tejas
function* addApiPlanConfigData() {
  yield takeEvery(ADD_API_PLAN_CONFIG_DATA, addApiPlanConfigDataDetail);
}

// Function for set Request to data and Call Function for Api Call
function* addApiPlanConfigDataDetail({ payload }) {
  const { Data } = payload;
  // console.log(payload)
  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/AddAPIPlan', Data, headers);
    // console.log(response)
    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(addApiPlanConfigDataSuccess(response));
    } else {
      yield put(addApiPlanConfigDataFailure(response));
    }
  } catch (error) {
    yield put(addApiPlanConfigDataFailure(error));
  }
}

// Sagas Function for Update Api Plan Configuration List by :Tejas
function* updateApiPlanConfigData() {
  yield takeEvery(UPDATE_API_PLAN_CONFIG_DATA, updateApiPlanConfigDataDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateApiPlanConfigDataDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/UpdateAPIPlan', Data, headers);

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(updateApiPlanConfigDataSuccess(response));
    } else {
      yield put(updateApiPlanConfigDataFailure(response));
    }
  } catch (error) {
    yield put(updateApiPlanConfigDataFailure(error));
  }
}

// Sagas Function for Update Api Plan Configuration List by :Tejas
function* getApiPlanConfigList() {
  yield takeEvery(GET_API_PLAN_CONFIG_LIST, getApiPlanConfigListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getApiPlanConfigListDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeAPIConfiguration/GetAPIPlan', {});

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getApiPlanConfigListSuccess(response));
    } else {
      yield put(getApiPlanConfigListFailure(response));
    }
  } catch (error) {
    yield put(getApiPlanConfigListFailure(error));
  }
}

// Sagas Function for Get Rest Method List with read only access List by :Tejas
function* getRestMethodReadOnly() {
  yield takeEvery(GET_REST_METHOD_READ_ONLY, getRestMethodReadOnlyDetail);
}

// Function for set response to data and Call Function for Api Call
function* getRestMethodReadOnlyDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeAPIConfiguration/GetRestMethodsReadOnly', {});

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getRestMethodReadOnlySuccess(response));
    } else {
      yield put(getRestMethodReadOnlyFailure(response));
    }
  } catch (error) {
    yield put(getRestMethodReadOnlyFailure(error));
  }
}

// Sagas Function for Get Rest Method List with Full access List by :Tejas
function* getRestMethodFullAccess() {
  yield takeEvery(GET_REST_METHOD_FULL_ACCESS, getRestMethodFullAccessDetail);
}

// Function for set response to data and Call Function for Api Call
function* getRestMethodFullAccessDetail({ payload }) {
  const { Data } = payload;

  try {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/BackOfficeAPIConfiguration/GetRestMethodsFullAccess', {});

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(getRestMethodFullAccessSuccess(response));
    } else {
      yield put(getRestMethodFullAccessFailure(response));
    }
  } catch (error) {
    yield put(getRestMethodFullAccessFailure(error));
  }
}

// Sagas Function for Get Rest Method List with Full access List by :Tejas
function* enableDisableAPIPlan() {
  yield takeEvery(ENABLE_DISABLE_API_PLAN, enableDisableAPIPlanDetail);
}

// Function for set response to data and Call Function for Api Call
function* enableDisableAPIPlanDetail({ payload }) {
  const { Data } = payload;
  let queryParams = '';

  try {

    const createQueryParams = params =>
      Object.keys(params)
        .map(k => `${k}=${encodeURI(params[k])}`)
        .join('&');

    if (Data.AllowAPIKey) {
      queryParams = createQueryParams(Data);
    }

    var url = 'api/BackOfficeAPIConfiguration/EnableDisableAPIPlan/' + Data.PlanId + "/" + Data.Status +  (queryParams !== "" ? '/?' + queryParams : '')

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, url, Data, headers);
    //const response = yield call(swaggerPostAPI, 'api/BackOfficeAPIConfiguration/EnableDisableAPIPlan/' + Data.PlanId + "/" + Data.AllowAPIKey , {});

    // set response if its available else set error message
    if (response && response != null && response.ReturnCode === 0) {
      yield put(enableDisableAPIPlanSuccess(response));
    } else {
      yield put(enableDisableAPIPlanFailure(response));
    }
  } catch (error) {
    yield put(enableDisableAPIPlanFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(addApiPlanConfigData),
    fork(updateApiPlanConfigData),
    fork(getApiPlanConfigList),
    fork(getRestMethodFullAccess),
    fork(getRestMethodReadOnly),
    fork(enableDisableAPIPlan),
  ]);
}
