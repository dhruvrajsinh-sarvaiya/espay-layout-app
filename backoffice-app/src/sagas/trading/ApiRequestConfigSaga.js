// sagas For Api Request Actions
// effects for redux-saga
import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
// types for set actions and reducers
import {
  ADD_API_REQUEST_LIST,
  UPDATE_API_REQUEST_LIST,
} from "../../actions/ActionTypes";
// action sfor set data or response
import {
  addThirdPartyApiRequestListSuccess,
  addThirdPartyApiRequestListFailure,
  updateThirdPartyApiRequestListSuccess,
  updateThirdPartyApiRequestListFailure,
} from "../../actions/Trading/ApiRequestConfigAction";
import { Method } from "../../controllers/Methods";
import { swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from "../../selector";

// Sagas Function for Add Api Response List
function* addThirdPartyApiRequestList() {
  yield takeEvery(ADD_API_REQUEST_LIST, addThirdPartyApiRequestListDetail);
}
// Function for set response to data and Call Function for Api Call
function* addThirdPartyApiRequestListDetail({ payload }) {

  const { requestUpdateThirdPartyApi } = payload;

  try {

    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }

    // To call add third party api
    const response = yield call(swaggerPostAPI, Method.AddThirdPartyAPIConfig, requestUpdateThirdPartyApi, headers);

    // To set add third party success response to reducer
    yield put(addThirdPartyApiRequestListSuccess(response));
  } catch (error) {

    // To set add third party failure response to reducer
    yield put(addThirdPartyApiRequestListFailure(error));
  }
}

// Sagas Function for Update Api Response List 
function* updateThirdPartyApiRequestList() {
  yield takeEvery(UPDATE_API_REQUEST_LIST, updateThirdPartyApiRequestListDetail);
}
// Function for set response to data and Call Function for Api Call
function* updateThirdPartyApiRequestListDetail({ payload }) {
  const { requestUpdateThirdPartyApi } = payload;

  try {

    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }

    // To call update third party api
    const response = yield call(swaggerPostAPI, Method.UpdateThirdPartyAPIConfig, requestUpdateThirdPartyApi, headers);
  
    // To set update third party success response to reducer
    yield put(updateThirdPartyApiRequestListSuccess(response));
  } catch (error) {

    // To set update third party failure response to reducer
    yield put(updateThirdPartyApiRequestListFailure(error));
  }
}

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(addThirdPartyApiRequestList),
    fork(updateThirdPartyApiRequestList),
  ]);
}
