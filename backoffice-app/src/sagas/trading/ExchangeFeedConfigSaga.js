// sagas For Exchange Feed Configuration Actions

// effects for redux-saga
import { call, put, takeLatest, select } from "redux-saga/effects";

// types for set actions and reducers
import {
  GET_EXCHANGE_FEED_CONFIGURATION_LIST,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST
} from "../../actions/ActionTypes";

// action sfor set data or response
import {
  getExchangeFeedListSuccess,
  getExchangeFeedListFailure,
  addExchangeConfigurationListSuccess,
  addExchangeConfigurationListFailure,
  updateExchangeConfigurationListSuccess,
  updateExchangeConfigurationListFailure,
  getExchangeFeedConfigSocketSuccess,
  getExchangeFeedConfigSocketFailure,
  getExchangeFeedConfigLimitsSuccess,
  getExchangeFeedConfigLimitsFailure
} from "../../actions/Trading/ExchangeFeedConfigAction";
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";

// Function for root saga
export default function* rootSaga() {

  // To register get Exchange Feed Configuration Data 
  yield takeLatest(GET_EXCHANGE_FEED_CONFIGURATION_LIST, getExchangeFeedConfigListDetail);

  // To register get Exchange Feed Configuration Socket Methods Data
  yield takeLatest(GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST, getExchangeFeedConfigSocketDetail);

  // To register get Exchange Feed Configuration Socket Methods Data
  yield takeLatest(GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST, getExchangeFeedConfigLimitsDetail);

  // To register Add Exchange Feed Configuration Data 
  yield takeLatest(ADD_EXCHANGE_FEED_CONFIGURATION_LIST, addExchangeFeedConfigListDetail);

  // To register Add Exchange Feed Configuration Data 
  yield takeLatest(UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST, updateExchangeFeedConfigListDetail);

}

// Function for set response to data and Call Function for Api Call
function* getExchangeFeedConfigListDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call all feed config list api
    const response = yield call(swaggerGetAPI, Method.GetAllFeedConfiguration, payload, headers);

    // To set all feed config list success response to reducer
    yield put(getExchangeFeedListSuccess(response));
  } catch (error) {

    // To set all feed config list failure response to reducer
    yield put(getExchangeFeedListFailure(error));
  }
}

// Function for set response to data and Call Function for Api Call
function* getExchangeFeedConfigSocketDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call socket methods api
    const response = yield call(swaggerGetAPI, Method.GetSocketMethods, payload, headers)

    // To set socket methods success response to reducer
    yield put(getExchangeFeedConfigSocketSuccess(response));
  } catch (error) {

    // To set socket methods failure response to reducer
    yield put(getExchangeFeedConfigSocketFailure(response));
  }
}

// Function for set response to data and Call Function for Api Call
function* getExchangeFeedConfigLimitsDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call feed limit list api
    const response = yield call(swaggerGetAPI, Method.GetFeedLimitListV2, payload, headers)

    // To set feed limit list success response to reducer
    yield put(getExchangeFeedConfigLimitsSuccess(response));
  } catch (error) {

    // To set feed limit list failure response to reducer
    yield put(getExchangeFeedConfigLimitsFailure(response));
  }
}

// Function for set response to data and Call Function for Api Call
function* addExchangeFeedConfigListDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call add feed config api
    const response = yield call(swaggerPostAPI, Method.AddFeedConfiguration, payload, headers);

    // To set add feed config success response to reducer
    yield put(addExchangeConfigurationListSuccess(response));
  } catch (error) {

    // To set add feed config failure response to reducer
    yield put(addExchangeConfigurationListFailure(error));
  }
}

// Function for set response to data and Call Function for Api Call
function* updateExchangeFeedConfigListDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call update feed config api
    const response = yield call(swaggerPostAPI, Method.UpdateFeedConfiguration, payload, headers);

    // To set update feed config success response to reducer
    yield put(updateExchangeConfigurationListSuccess(response));
  } catch (error) {

    // To set update feed config failure response to reducer
    yield put(updateExchangeConfigurationListFailure(error));
  }
}