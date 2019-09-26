// sagas For Feed Limit Configuration Actions
// effects for redux-saga
import { call, put, takeLatest, select } from "redux-saga/effects";
// types for set actions and reducers
import {
  GET_FEED_LIMIT_LIST,
  GET_FEED_LIMIT_TYPE,
  ADD_FEED_LIMIT_CONFIGURATION,
  UPDATE_FEED_LIMIT_CONFIGURATION,
} from "../../actions/ActionTypes";
// action for set data or response
import {
  getFeedLimitListSuccess,
  getFeedLimitListFailure,
  getExchangeFeedLimitSuccess,
  getExchangeFeedLimitFailure,
  addFeedLimitListSuccess,
  addFeedLimitListFailure,
  updateFeedLimitListSuccess,
  updateFeedLimitListFailure,
} from "../../actions/Trading/FeedLimitConfigAction";
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";

// Function for root saga
export default function* rootSaga() {

  // To get feed limit list
  yield takeLatest(GET_FEED_LIMIT_LIST, getFeedLimitList);

  // To get feed limit type list
  yield takeLatest(GET_FEED_LIMIT_TYPE, getExchangeFeedLimitDetail);

  // To add feed limit 
  yield takeLatest(ADD_FEED_LIMIT_CONFIGURATION, addFeedLimitListDetail);

  // To update feed limit
  yield takeLatest(UPDATE_FEED_LIMIT_CONFIGURATION, updateFeedLimitListDetail);

}

// Function to get feed limit list
function* getFeedLimitList({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call feed limit list api
    const response = yield call(swaggerGetAPI, Method.GetFeedLimitList, payload, headers);

    // To set feed limit list success response to reducer
    yield put(getFeedLimitListSuccess(response));
  } catch (error) {
    // To set feed limit list failure response to reducer
    yield put(getFeedLimitListFailure(error));
  }
}

// Function to get Feed Limit types list
function* getExchangeFeedLimitDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call exchange limit type api
    const response = yield call(swaggerGetAPI, Method.GetExchangeFeedLimitType, payload, headers)

    // To set exchange limit type success response to reducer
    yield put(getExchangeFeedLimitSuccess(response));
  } catch (error) {
    // To set exchange limit type failure response to reducer
    yield put(getExchangeFeedLimitFailure(response));
  }
}

// Function to add feed limit list
function* addFeedLimitListDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call add exchange feed limit api
    const response = yield call(swaggerPostAPI, Method.AddExchangeFeedLimit, payload, headers);

    // To set add exchange feed limit success response to reducer
    yield put(addFeedLimitListSuccess(response));
  } catch (error) {
    // To set add exchange feed limit failure response to reducer
    yield put(addFeedLimitListFailure(error));
  }
}

// Function to update feed limit list
function* updateFeedLimitListDetail({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call update exchange feed limit api
    const response = yield call(swaggerPostAPI, Method.UpdateExchangeFeedLimit, payload, headers);

    // To set update exchange feed limit success response to reducer
    yield put(updateFeedLimitListSuccess(response));
  } catch (error) {
    // To set update exchange feed limit failure response to reducer
    yield put(updateFeedLimitListFailure(error));
  }
}