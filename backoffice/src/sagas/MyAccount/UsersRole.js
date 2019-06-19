/**
 * Auther : Salim Deraiya
 * Created : 29/09/2018
 * Users Role Sagas Method
 */

import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { LIST_USER_ROLES } from "Actions/types";

// import functions from action
import { userRolesSuccess, userRolesFailure } from "Actions/MyAccount";

const userRoles = [
  {
    id: 1,
    name: "Atul Khan",
    email: "atul.khan@gmail.com",
    profile: "Partner",
    status: 1
  },
  {
    id: 2,
    name: "John Deo",
    email: "john.deo@gmail.com",
    profile: "Partner",
    status: 1
  },
  {
    id: 3,
    name: "Black Smith",
    email: "black.smith@gmail.com",
    profile: "Partner",
    status: 0
  },
  {
    id: 4,
    name: "Ajay Patel",
    email: "ayan.patel@gmail.com",
    profile: "Partner",
    status: 0
  }
];

//Function check API call for User Roles..
const getUserRolesAPIRequest = async request =>
  await api
    .get("transHistory.js")
    .then(response => response)
    .catch(error => error);

//Function for Get User Roles API
function* getUserRolesAPI({ payload }) {
  try {
    //const response = yield call(getUserRolesAPIRequest,payload);
    if (userRoles.length > 0) {
      yield put(userRolesSuccess(userRoles));
    } else {
      yield put(userRolesFailure("Failure"));
    }
  } catch (error) {
    yield put(userRolesFailure(error));
  }
}

//Edit Roles
function* getUserRoles() {
  yield takeEvery(LIST_USER_ROLES, getUserRolesAPI);
}

export default function* rootSaga() {
  yield all([fork(getUserRoles)]);
}
