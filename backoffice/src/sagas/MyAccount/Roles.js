/**
 * Auther : Salim Deraiya
 * Created : 29/09/2018
 * Roles Sagas Method
 */

import { all, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import {
  LIST_ROLES,
  DELETE_ROLES,
  ADD_ROLES,
  EDIT_ROLES,
  GET_ROLES_BY_ID
} from "Actions/types";

// import functions from action
import {
  rolesSuccess,
  rolesFailure,
  deleteRolesSuccess,
  deleteRolesFailure,
  addRolesSuccess,
  addRolesFailure,
  editRolesSuccess,
  editRolesFailure,
  getRolesByIdSuccess,
  getRolesByIdFailure
} from "Actions/MyAccount";

const listRoles = [
  { id: 1, name: "Joshi Biztech Solutions Limited", parent: 0 },
  { id: 2, name: "Joshi Biztech Solutions Limited -> CEO", parent: 1 },
  {
    id: 3,
    name: "Joshi Biztech Solutions Limited -> CEO -> Manager",
    parent: 2
  },
  {
    id: 4,
    name: "Joshi Biztech Solutions Limited -> CEO -> Manager -> OHO Cash",
    parent: 3
  },
  {
    id: 5,
    name:
      "Joshi Biztech Solutions Limited -> CEO -> Manager -> OHO Cash -> Exchange Admin",
    parent: 4
  },
  { id: 6, name: "Joshi Biztech Solutions Limited", parent: 0 },
  { id: 7, name: "Joshi Biztech Solutions Limited -> CEO", parent: 1 },
  {
    id: 8,
    name: "Joshi Biztech Solutions Limited -> CEO -> Manager",
    parent: 2
  },
  {
    id: 9,
    name: "Joshi Biztech Solutions Limited -> CEO -> Manager -> Paro Exchange",
    parent: 3
  },
  {
    id: 10,
    name:
      "Joshi Biztech Solutions Limited -> CEO -> Manager -> Paro Exchange -> Exchange Admin",
    parent: 4
  }
];

const editData = {
  role_name: "Role Name",
  role_description: "Description",
  role_exchange: "2",
  reports_to: "3",
  created_by: "Indrani Tiwari on July 9, 2018 at 03:12 PM",
  modified_by: "Indrani Tiwari on July 16, 2018 at 07:16 PM"
};

//Function check API call for Roles List..
const getRolesAPIRequest = async request =>
  await api
    .get("roles.js")
    .then(response => response)
    .catch(error => error);

//Function check API call for Roles Add..
const addRolesAPIRequest = async request =>
  await api
    .get("transHistory.js")
    .then(response => response)
    .catch(error => error);

//Function check API call for Roles Edit..
const editRolesAPIRequest = async request =>
  await api
    .get("transHistory.js")
    .then(response => response)
    .catch(error => error);

//Function check API call for Roles Delete..
const deleteRolesAPIRequest = async request =>
  await api
    .get("transHistory.js")
    .then(response => response)
    .catch(error => error);

//Function check API call for Get Roles By Id..
const getRolesByIdAPIRequest = async request =>
  await api
    .get("transHistory.js")
    .then(response => response)
    .catch(error => error);

//Function for API Setting Create
function* getRolesAPI({ payload }) {
  try {
    //const response = yield call(getRolesAPIRequest,payload);
    if (listRoles.length > 0) {
      yield put(rolesSuccess(listRoles));
    } else {
      yield put(rolesFailure());
    }
  } catch (error) {
    yield put(rolesFailure(error));
  }
}

//Function for API Setting Save
function* addRolesAPI({ payload }) {
  try {
    //const response = yield call(addRolesAPIRequest,payload);
    if (response1.status === 200) {
      yield put(addRolesSuccess(response1));
    } else {
      yield put(addRolesFailure("Failure"));
    }
  } catch (error) {
    yield put(addRolesFailure(error));
  }
}

//Function for API Setting Edit
function* editRolesAPI({ payload }) {
  try {
    //const response = yield call(editRolesAPIRequest,payload);
    if (response1.status === 200) {
      yield put(editRolesSuccess(response1));
    } else {
      yield put(editRolesFailure("Failure"));
    }
  } catch (error) {
    yield put(editRolesFailure(error));
  }
}

//Function for API Setting Delete
function* deleteRolesAPI({ payload }) {
  try {
    //const response = yield call(deleteRolesAPIRequest,payload);
    if (response1.status === 200) {
      yield put(deleteRolesSuccess(response1));
    } else {
      yield put(deleteRolesFailure("Failure"));
    }
  } catch (error) {
    yield put(deleteRolesFailure(error));
  }
}

//Function for Get Roles By ID API
function* getRolesByIdAPI({ payload }) {
  try {
    //const response = yield call(getRolesByIdAPIRequest,payload);
    if (Object.keys(editData).length > 0) {
      yield put(getRolesByIdSuccess(editData));
    } else {
      yield put(getRolesByIdFailure("Failure"));
    }
  } catch (error) {
    yield put(getRolesByIdFailure(error));
  }
}

//List Roles
function* getRoles() {
  yield takeEvery(LIST_ROLES, getRolesAPI);
}

//Delete Roles
function* deleteRoles() {
  yield takeEvery(DELETE_ROLES, deleteRolesAPI);
}

//Add Roles
function* addRoles() {
  yield takeEvery(ADD_ROLES, addRolesAPI);
}

//Edit Roles
function* editRoles() {
  yield takeEvery(EDIT_ROLES, editRolesAPI);
}

//Edit Roles
function* getRolesById() {
  yield takeEvery(GET_ROLES_BY_ID, getRolesByIdAPI);
}

export default function* rootSaga() {
  yield all([
    fork(getRoles),
    fork(addRoles),
    fork(editRoles),
    fork(deleteRoles),
    fork(getRolesById)
  ]);
}
