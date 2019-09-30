// sagas For Coin Configuration Actions
// effects for redux-saga
import { call, put, takeLatest, select } from "redux-saga/effects";
// types for set actions and reducers
import {
  GET_COIN_CONFIGURATION_LIST,
  ADD_COIN_CONFIGURATION_LIST,
  UPDATE_COIN_CONFIGURATION_LIST,
} from "../../actions/ActionTypes";
// action sfor set data or response
import {
  getCoinConfigurationListSuccess,
  getCoinConfigurationListFailure,
  addCoinConfigurationListSuccess,
  addCoinConfigurationListFailure,
  updateCoinConfigurationListSuccess,
  updateCoinConfigurationListFailure,
} from "../../actions/Trading/CoinConfigurationAction";
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from "../../selector";
import { Method } from "../../controllers/Methods";

// Function for root saga
export default function* rootSaga() {

  // To get coin configuration list
  yield takeLatest(GET_COIN_CONFIGURATION_LIST, getCoinConfigurationListDetail);

  // To add coin configuration
  yield takeLatest(ADD_COIN_CONFIGURATION_LIST, addCoinConfigurationListDetail);

  // To update coin configuration
  yield takeLatest(UPDATE_COIN_CONFIGURATION_LIST, updateCoinConfigurationListDetail);

}

// Function to get coin configuration list
function* getCoinConfigurationListDetail({ payload }) {
  try {

    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // Add IsMargin params in request url if IsMargin payload is 1
    var IsMargin = '';
    if (payload.hasOwnProperty("IsMargin") && payload.IsMargin != "") {
      IsMargin += "?IsMargin=" + payload.IsMargin;
    }

    // To call all service configuration api
    const response = yield call(swaggerGetAPI, Method.GetAllServiceConfigurationData + IsMargin, payload, headers);

    // To set all service configuration success response to reducer
    yield put(getCoinConfigurationListSuccess(response));

  } catch (error) {

    // To set all service configuration failure response to reducer
    yield put(getCoinConfigurationListFailure(error));
  }
}

// Function to add feed limit list
function* addCoinConfigurationListDetail({ payload }) {
  try {

    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call add service configuration api
    const response = yield call(swaggerPostAPI, Method.AddServiceConfiguration, payload, headers);

    // To set add service configuration success response to reducer
    yield put(addCoinConfigurationListSuccess(response));

  } catch (error) {

    // To set add service configuration failure response to reducer
    yield put(addCoinConfigurationListFailure(error));
  }
}

// Function to update feed limit list
function* updateCoinConfigurationListDetail({ payload }) {
  try {

    //to get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token };

    // To call update service configuration api
    const response = yield call(swaggerPostAPI, Method.UpdateServiceConfiguration, payload, headers);

    // To set update service configuration success response to reducer
    yield put(updateCoinConfigurationListSuccess(response));
  } catch (error) {

    // To set update service configuration failure response to reducer
    yield put(updateCoinConfigurationListFailure(error));
  }
}