// sagas For Api Match Engine Actions By Tejas

// for call axios call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { NotificationManager } from "react-notifications";

// types for set actions and reducers
import {
  GET_MATCH_ENGINE_LIST,
  ADD_MATCH_ENGINE_LIST,
  UPDATE_MATCH_ENGINE_LIST,
  DELETE_MATCH_ENGINE_LIST
} from "Actions/types";

// action sfor set data or response
import {
  getMatchEngineListSuccess,
  getMatchEngineListFailure,
  addMatchEngineListSuccess,
  addMatchEngineListFailure,
  updateMatchEngineListSuccess,
  updateMatchEngineListFailure,
  deleteMatchEngineListSuccess,
  deleteMatchEngineListFailure
} from "Actions/ApiMatchConfiguration";

// Sagas Function for get Match Engine List by :Tejas
function* getMatchEngineList() {
  yield takeEvery(GET_MATCH_ENGINE_LIST, getMatchEngineListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getMatchEngineListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(getMatchEngineListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(getMatchEngineListSuccess(response));
    } else {
      yield put(getMatchEngineListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("MatchEngine List Not Found");
    yield put(getMatchEngineListFailure(error));
  }
}

// function for Call api and set response
const getMatchEngineListRequest = async Data =>
  await api
    .get("MatchEngineList.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for Add MatchEngine List by :Tejas
function* addMatchEngineList() {
  yield takeEvery(ADD_MATCH_ENGINE_LIST, addMatchEngineListDetail);
}

// Function for set response to data and Call Function for Api Call
function* addMatchEngineListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(addMatchEngineListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(addMatchEngineListSuccess(response));
    } else {
      yield put(addMatchEngineListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("MatchEngine List Not Found");
    yield put(addMatchEngineListFailure(error));
  }
}

// function for Call api and set response
const addMatchEngineListRequest = async Data =>
  await api
    .get("AddMatchEngineList.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for Update MatchEngine List by :Tejas
function* updateMatchEngineList() {
  yield takeEvery(UPDATE_MATCH_ENGINE_LIST, updateMatchEngineListDetail);
}

// Function for set response to data and Call Function for Api Call
function* updateMatchEngineListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(updateMatchEngineListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response != undefined &&
      response.status === 200
    ) {
      yield put(updateMatchEngineListSuccess(response));
    } else {
      yield put(updateMatchEngineListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("MatchEngine List Not Found");
    yield put(updateMatchEngineListFailure(error));
  }
}

// function for Call api and set response
const updateMatchEngineListRequest = async Data =>
  await api
    .get("UpdateMatchEngineList.js", Data)
    .then(response => response)
    .catch(error => error);

// Sagas Function for delete MatchEngine List by :Tejas
function* deleteMatchEngineList() {
  yield takeEvery(DELETE_MATCH_ENGINE_LIST, deleteMatchEngineListDetail);
}

// Function for set response to data and Call Function for Api Call
function* deleteMatchEngineListDetail({ payload }) {
  const { Data } = payload;
  try {
    const response = yield call(deleteMatchEngineListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(deleteMatchEngineListSuccess(response));
    } else {
      yield put(deleteMatchEngineListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("MatchEngine List Not Found");
    yield put(deleteMatchEngineListFailure(error));
  }
}

// function for Call api and set response
const deleteMatchEngineListRequest = async Data =>
  await api
    .get("UpdateMatchEngineList.js", Data)
    .then(response => response)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([
    fork(getMatchEngineList),
    fork(addMatchEngineList),
    fork(updateMatchEngineList),
    fork(deleteMatchEngineList)
  ]);
}
