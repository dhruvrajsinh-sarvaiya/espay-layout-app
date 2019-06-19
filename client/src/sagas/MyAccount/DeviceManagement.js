/**
 * Device Management saga file is used to call api and response send to call function and handle actions functions (code added by Parth Jani 17-9-2018)
 */
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import api from "Api";

import { DEVICE_MANAGEMENT } from "Actions/types";

import { getDeviceManagementSuccess, getDeviceManagementFail } from "Actions";

const getDeviceManagementRequest = async () =>
  await api
    .get("deviceManagementData.js")
    .then(response => response)
    .catch(error => error);

function* getDeviceManagementData() {
  try {
    const response = yield call(getDeviceManagementRequest);
    yield put(getDeviceManagementSuccess(response));
  } catch (error) {
    yield put(getDeviceManagementFail(error));
  }
}

function* getDeviceManagementReport() {
  yield takeEvery(DEVICE_MANAGEMENT, getDeviceManagementData);
}

export default function* rootSaga() {
  //yield all([fork(getDeviceManagementReport)]);
}

// import { all, fork, put, takeEvery } from 'redux-saga/effects';

// import {
//     DEVICE_MANAGEMENT,
// } from 'Actions/types';

// import {
//     getDeviceManagementSuccess,
//     getDeviceManagementFail
// } from 'Actions';

// import {
//     UserDeviceManagementDataNew
// } from '../../routes/my-account/device-management/data';

// function* getDeviceManagementDetail() {
//      try {
//         const UserData = UserDeviceManagementDataNew;
//         //const UserData = {message:"Device Management List not found."};
//         if (UserData.message) {
//             yield put(getDeviceManagementFail(UserData.message));
//         } else {
//             yield put(getDeviceManagementSuccess(UserData));
//         }
//     } catch (error) {
//         yield put(getDeviceManagementFail(error));
//     }
// }

// export function* getDeviceManagement() {
//     yield takeEvery(DEVICE_MANAGEMENT, getDeviceManagementDetail);
// }

// export default function* rootSaga() {
//     yield all([
//         fork(getDeviceManagement),
//     ]);
// }
