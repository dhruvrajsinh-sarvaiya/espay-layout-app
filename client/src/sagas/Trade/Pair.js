/**
 * Pair Sagas
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

// api
import api from "Api";

import { GET_PAIR, UPDATE_PAIR, ADD_TASK, GET_TASK } from "Actions/types";

import {
  getPairListSuccess,
  getPairListFailure,
  getUpdatedPairListSuccess,
  getUpdatedPairListFailure,
  addTaskSuccess,
  addTaskFailure,
  getTaskSuccess,
  getTaskFailure
} from "Actions";

//import static data from file
//import { BasePairData } from 'Api/pairData';

/**
 * Send Todos Request To Server
 */
const getPairRequest = async () =>
  await api
    .get("pairsForApp.js")
    .then(response => response)
    .catch(error => error);

/**
 * Get Todos From Server
 */
function* getPairFromServer() {
  try {
    // const response = yield call(getTodosRequest);
    const response = yield call(getPairRequest);
    // const response = BasePairData;

    //validate if data found in response
    if (response.data !== undefined) yield put(getPairListSuccess(response));
    else yield put(getPairListFailure("Unable to fetch pairs."));
  } catch (error) {
    yield put(getPairListFailure(error));
  }
}

/**
 * Ger Emails
 */
export function* getPairList() {
  // console.log('SAGA', 'getPairList');
  yield takeEvery(GET_PAIR, getPairFromServer);
}
/**
 * Get Todos From Server
 */
function* getUpdatePairFromServer() {
  try {
    // const response = yield call(getTodosRequest);
    const response = yield call(getPairRequest);
    // const response = BasePairData;

    //validate if data found in response
    if (response.data !== undefined)
      yield put(getUpdatedPairListSuccess(response));
    else yield put(getUpdatedPairListFailure("Unable to fetch pairs."));
  } catch (error) {
    yield put(getUpdatedPairListFailure(error));
  }
}

/**
 * Ger Emails
 */
export function* getUpdatedPairList() {
  // console.log('SAGA', 'getUpdatedPairList');
  yield takeEvery(UPDATE_PAIR, getUpdatePairFromServer);
}

/**
 * Send Todos Request To Server
 */
const addNEWtask = async newTask =>
  await api
    .post("addNewTask", { newTask })
    .then(response => response)
    .catch(error => error);
/**
 * Add TASK From Server
 */
function* addTaskServer({ payload }) {
  try {
    // const response = yield call(getTodosRequest);
    const response = yield call(addNEWtask, payload);
    // const response = BasePairData;

    //validate if data found in response
    if (response.data !== undefined) yield put(addTaskSuccess(response));
    else yield put(addTaskFailure("Unable to fetch pairs."));
  } catch (error) {
    yield put(addTaskFailure(error));
  }
}

/**
 * Ger Emails
 */
export function* addTask() {
  yield takeEvery(ADD_TASK, addTaskServer);
}

/**
 * Send Todos Request To Server
 */
const getTaskList = async () =>
  await api
    .get("getTask")
    .then(response => response)
    .catch(error => error);
/**
 * Add TASK From Server
 */
function* getTaskListServer() {
  try {
    // const response = yield call(getTodosRequest);
    const response = yield call(getTaskList);
    // const response = BasePairData;

    //validate if data found in response
    if (response.data !== undefined) yield put(getTaskSuccess(response));
    else yield put(getTaskFailure("Unable to fetch pairs."));
  } catch (error) {
    yield put(getTaskFailure(error));
  }
}

/**
 * Ger Emails
 */
export function* getTask() {
  yield takeEvery(GET_TASK, getTaskListServer);
}

/**
 * Email Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getPairList),
    fork(getUpdatedPairList),
    fork(getTask)
    // fork(addTask)
  ]);
}
