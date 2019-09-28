// sagas For Provider Configuration Actions 
// effects for redux-saga
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerPostAPI } from "../../api/helper";
// types for set actions and reducers
import {
  GET_PROVIDER_CONFIGURATION_LIST,
  ADD_PROVIDER_CONFIGURATION_LIST,
  UPDATE_PROVIDER_CONFIGURATION_LIST,
} from "../../actions/ActionTypes";
// action for set data or response
import {
  //provider configuration list 
  getProviderConfigListSuccess,
  getProviderConfigListFailure,

  //add provider configuration
  addProviderConfigSuccess,
  addProviderConfigFailure,

  //update provider configuration
  updateProviderConfigSuccess,
  updateProviderConfigFailure,
} from "../../actions/Trading/ProviderConfigurationAction";
import { Method } from '../../controllers/Methods';
import { userAccessToken } from "../../selector";

// Sagas Function for get Provider Configuration list
function* getProviderConfigList() {
  yield takeEvery(GET_PROVIDER_CONFIGURATION_LIST, getProviderConfigListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getProviderConfigListDetail() {

  try {

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call all provider configuration api
    const response = yield call(swaggerPostAPI, Method.GetAllProviderConfiguration, {}, headers);

    // To set all provider configuration success response to reducer
    yield put(getProviderConfigListSuccess(response));
  }
  catch (error) {

    // To set all provider configuration failure response to reducer
    yield put(getProviderConfigListFailure(error));
  }
}
// Sagas Function for Add Provider Configuration 
function* addProviderConfig() {
  yield takeEvery(ADD_PROVIDER_CONFIGURATION_LIST, addProviderConfigDetail);
}

// Function for set response to data and Call Function for Api Call
function* addProviderConfigDetail({ payload }) {

  try {

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    const { Data } = payload;

    // To call add provider configuration api
    const response = yield call(swaggerPostAPI, Method.AddProviderConfiguration, Data, headers);

    // To set add provider configuration success response to reducer
    yield put(addProviderConfigSuccess(response));
  } catch (error) {

    // To set add provider configuration failure response to reducer
    yield put(addProviderConfigFailure(error));
  }
}
// Sagas Function for Update Provider Configuration 
function* updateProviderConfig() {
  yield takeEvery(UPDATE_PROVIDER_CONFIGURATION_LIST, updateProviderConfigDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateProviderConfigDetail({ payload }) {

  try {

    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    const { Data } = payload;

    // To call edit provider configuration api
    const response = yield call(swaggerPostAPI, Method.UpdateProviderConfiguration, Data, headers);

    // To set edit provider configuration success response to reducer
    yield put(updateProviderConfigSuccess(response));
  }
  catch (error) {

    // To set edit provider configuration failure response to reducer
    yield put(updateProviderConfigFailure(error));
  }
}

// Function for root saga
export default function* ProviderConfigurationSaga() {
  yield all([
    fork(getProviderConfigList),
    fork(addProviderConfig),
    fork(updateProviderConfig),
  ]);
}
