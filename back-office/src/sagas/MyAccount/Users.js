//Users Saga Config

import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import {
  DISPALY_USERS,
  DELETE_USERS,
  ADD_USERS,
  EDIT_USERS
} from "Actions/types";

// import functions from action
import {
  displayUsersSuccess,
  displayUsersFailure,
  deleteUsersSuccess,
  deleteUsersFailure,
  addUsersSuccess,
  addUsersFailure,
  editUsersSuccess,
  editUsersFailure
} from "Actions/MyAccount";

const displayUsers = [
  {
    id: 1,
    firstname: "Kevin",
    lastname: "Ladani",
    email: "kevin@gmail.com",
    password: "111",
    mobileno: "111",
    exchange: "UNIQ Exchange",
    profile: "Partner",
    role: "Administrator",
    status: "Active"
  },
  {
    id: 2,
    firstname: "Sanjay",
    lastname: "Rathod",
    email: "sanjay@gmail.com",
    password: "112",
    mobileno: "222",
    exchange: "PARO Exchange",
    profile: "Partner",
    role: "Administrator",
    status: "Active"
  },
  {
    id: 3,
    firstname: "Parth",
    lastname: "Jani",
    email: "parth@gmail.com",
    password: "113",
    mobileno: "333",
    exchange: "PARO Exchange",
    profile: "Partner",
    role: "Administrator",
    status: "Active"
  }
];

//Display Users
function* displayUsersData() {
  try {
    // const response = yield call(displayUsersDataRequest);
    yield put(displayUsersSuccess(displayUsers));
  } catch (error) {
    yield put(displayUsersFailure(error));
  }
}

//Delete Users
function* deleteUsersData({ payload }) {
  const displayUserData = payload;
  try {
    const response = yield call(displayUserData);
    yield put(deleteUsersSuccess(response));
    //yield put(deleteUsersSuccess(displayUserData));
  } catch (error) {
    yield put(deleteUsersFailure(error));
  }
}

//Add Users
function* addUsersData({ payload }) {
  const addUserData = payload;
  try {
    yield put(addUsersSuccess(addUserData));
  } catch (error) {
    yield put(addUsersFailure(error));
  }
}

//Edit Users
function* editUsersData({ payload }) {
  const editUserData = payload;
  try {
    yield put(editUsersSuccess(editUserData));
  } catch (error) {
    yield put(editUsersFailure(error));
  }
}

//Display Users
function* displayUsersDataReport() {
  yield takeEvery(DISPALY_USERS, displayUsersData);
}

//Delete Users
function* deleteUsersDataReport() {
  yield takeEvery(DELETE_USERS, deleteUsersData);
}

//Add Users
function* addUsersDataReport() {
  yield takeEvery(ADD_USERS, addUsersData);
}

//Edit Users
function* editUsersDataReport() {
  yield takeEvery(EDIT_USERS, editUsersData);
}

export default function* rootSaga() {
  yield all([
    fork(displayUsersDataReport),
    fork(deleteUsersDataReport),
    fork(addUsersDataReport),
    fork(editUsersDataReport)
  ]);
}
