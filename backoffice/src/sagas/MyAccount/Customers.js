import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import {
  DISPALY_CUSTOMERS,
  DELETE_CUSTOMERS,
  ADD_CUSTOMERS,
  EDIT_CUSTOMERS
} from "Actions/types";

import { swaggerPostAPI } from 'Helpers/helpers';

// import functions from action
import {
  displayCustomersSuccess,
  displayCustomersFailure,
  deleteCustomersSuccess,
  deleteCustomersFailure,
  addCustomersSuccess,
  addCustomersFailure,
  editCustomersSuccess,
  editCustomersFailure
} from "Actions/MyAccount";

const CustomersData = [
  {
    id: 1,
    firstname: "Jayesh",
    lastname: "Dhola",
    email: "jayesh@gmail.com",
    password: "111",
    phoneno: "111",
    country: "India",
    usertype: "Enterprise",
    exchange: "UNIQ Exchange",
    tfa: "Enable",
    documents: "Verified",
    status: "Active",
    googleauth: "Enable",
    smsauth: "Enable",
    antipishing: "Test1",
    whitelist: "YES",
    accountstatus: "Active",
    accountcreatedat: "July 9, 2018 at 12:32PM",
    accountupdatedat: "July 16, 2018 at 12:32PM",
    lastlogin: "September 16, 2018 at 12:32PM"
  },
  {
    id: 2,
    firstname: "Rajesh",
    lastname: "Kangad",
    email: "rajesh@gmail.com",
    password: "111",
    phoneno: "111",
    country: "India",
    usertype: "Individual",
    exchange: "UNIQ Exchange",
    tfa: "Enable",
    documents: "Verified",
    status: "Active",
    googleauth: "Enable",
    smsauth: "Enable",
    antipishing: "Test2",
    whitelist: "YES",
    accountstatus: "Active",
    accountcreatedat: "July 9, 2018 at 12:32PM",
    accountupdatedat: "July 16, 2018 at 12:32PM",
    lastlogin: "September 16, 2018 at 12:32PM"
  },
  {
    id: 3,
    firstname: "Uday",
    lastname: "Dodiya",
    email: "uday@gmail.com",
    password: "111",
    phoneno: "111",
    country: "India",
    usertype: "Individual",
    exchange: "UNIQ Exchange",
    tfa: "Enable",
    documents: "Verified",
    status: "Active",
    googleauth: "Enable",
    smsauth: "Enable",
    antipishing: "Test3",
    whitelist: "NO",
    accountstatus: "Active",
    accountcreatedat: "July 9, 2018 at 12:32PM",
    accountupdatedat: "July 16, 2018 at 12:32PM",
    lastlogin: "September 16, 2018 at 12:32PM"
  }
];

//Display Customers
function* displayCustomersData() {
  try {
    yield put(displayCustomersSuccess(CustomersData));
  } catch (error) {
    yield put(displayCustomersFailure(error));
  }
}

//Delete Customers
function* deleteCustomersData({ payload }) {
  const displayCustomerData = payload;
  try {
    const response = yield call(displayCustomerData);
    yield put(deleteCustomersSuccess(response));
    //yield put(deleteUsersSuccess(displayUserData));
  } catch (error) {
    yield put(deleteCustomersFailure(error));
  }
}

//Add Customers
function* addCustomersData({ payload }) {
  const response = yield call(swaggerPostAPI, 'api/BackOfficeUser/RegisterUser', payload);
  try {
    if (response.ReturnCode === 0) {
      yield put(addCustomersSuccess(response));
    }
    else {
      yield put(addCustomersFailure(response));
    }
  }
  catch (error) {
    yield put(addCustomersFailure(error));
  }
}

//Edit Customers
function* editCustomersData({ payload }) {
  const editCustomerData = payload;

  try {
    yield put(editCustomersSuccess(editCustomerData));
  } catch (error) {
    yield put(editCustomersFailure(error));
  }
}

//Display Customers
function* displayCustomersDataReport() {
  yield takeEvery(DISPALY_CUSTOMERS, displayCustomersData);
}

//Delete Customers
function* deleteCustomersDataReport() {
  yield takeEvery(DELETE_CUSTOMERS, deleteCustomersData);
}

//Add Customers
function* addCustomersDataReport() {
  yield takeEvery(ADD_CUSTOMERS, addCustomersData);
}

//Add Customers
function* editCustomersDataReport() {
  yield takeEvery(EDIT_CUSTOMERS, editCustomersData);
}

export default function* rootSaga() {
  yield all([
    fork(displayCustomersDataReport),
    fork(deleteCustomersDataReport),
    fork(addCustomersDataReport),
    fork(editCustomersDataReport)
  ]);
}
