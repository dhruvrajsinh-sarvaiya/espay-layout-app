/**
 * Auther : Salim Deraiya
 * Created : 08/10/2018
 * Complain Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import api from "Api";

//Action Types..
import {
  HELPNSUPPORT_DASHBOARD,
  LIST_COMPLAIN,
  // EDIT_COMPLAIN,
  GET_COMPLAIN_BY_ID,
  GET_COMPLAIN_CONVERSION_BY_ID,
  REPLAY_COMPLAIN,
  GET_SLA_LIST,
} from "Actions/types";

//Action methods..
import {
  getSLAListSuccess,
  getSLAListFailure,
  getHelpNSupportDataSuccess,
  getHelpNSupportDataFailure,
  complainListSuccess,
  complainListFailure,
  // editComplainSuccess,
  // editComplainFailure,
  getComplainByIdSuccess,
  getComplainByIdFailure,
  replayComplainSuccess,
  replayComplainFailure,
  // getComplainConversionByIdSuccess,
  // getComplainConversionByIdFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

//Display Help & Support Dashbord Data
function* getHelpNSupportDataAPI() {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerGetAPI, 'api/BackOfficeComplain/GetTotalNoCount?Type=0&ComplainStatus=0&UserId=0', {}, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getHelpNSupportDataSuccess(response));
    } else {
      yield put(getHelpNSupportDataFailure(response));
    }
  } catch (error) {
    yield put(getHelpNSupportDataFailure(error));
  }
}

//Function for Complain List API
function* getComplainListAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  var swaggerUrl = 'api/BackOfficeComplain/GetAllComplainReport/' + payload.PageIndex + '/' + payload.Page_Size + '?';
  //ComplainId=' + payload.ComplainId + '&EmailId=' + payload.EmailId + '&MobileNo=' + payload.MobileNo + '&Status=' + payload.Status + '&TypeId=' + payload.TypeId
  if (payload.hasOwnProperty("Status") && payload.Status !== "") {
    swaggerUrl += '&Status=' + payload.Status;
  }
  if (payload.hasOwnProperty("ComplainId") && payload.ComplainId !== "") {
    swaggerUrl += '&ComplainId=' + payload.ComplainId;
  }
  if (payload.hasOwnProperty("EmailId") && payload.EmailId !== "") {
    swaggerUrl += '&EmailId=' + payload.EmailId;
  }
  if (payload.hasOwnProperty("MobileNo") && payload.MobileNo !== "") {
    swaggerUrl += '&MobileNo=' + payload.MobileNo;
  }
  if (payload.hasOwnProperty("TypeId") && payload.TypeId !== "") {
    swaggerUrl += '&TypeId=' + payload.TypeId;
  }
  if (payload.hasOwnProperty("PriorityId") && payload.PriorityId !== "") {
    swaggerUrl += '&PriorityId=' + payload.PriorityId;
  }
  if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
    swaggerUrl += '&FromDate=' + payload.FromDate;
  }
  if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
    swaggerUrl += '&ToDate=' + payload.ToDate;
  }

  const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(complainListSuccess(response));
    } else {
      yield put(complainListFailure(response));
    }
  } catch (error) {
    yield put(complainListFailure(error));
  }
}

// //Function for Edit Complain API
// function* editComplainAPI({ payload }) {
//   try {
//     //const response = yield call(editComplainAPIRequest,payload);
//     if (response.status === 200) {
//       yield put(editComplainSuccess(response));
//     } else {
//       yield put(editComplainFailure("Error"));
//     }
//   } catch (error) {
//     yield put(editComplainFailure(error));
//   }
// }

//Function for Get Complain By Id API
function* getComplainByIdAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerGetAPI, 'api/BackOfficeComplain/GetComplain?ComplainId=' + payload, {}, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getComplainByIdSuccess(response));
    } else {
      yield put(getComplainByIdFailure(response));
    }
  } catch (error) {
    yield put(complainListFailure(error));
  }
}

// //Function for Get Complain By Id API
// function* getComplainConversionByIdAPI({ payload }) {
//   try {
//     //const response = yield call(getComplainByIdAPIRequest,payload);
//     if (Object.keys(complayReplay).length > 0) {
//       yield put(getComplainConversionByIdSuccess(complayReplay));
//     } else {
//       yield put(getComplainConversionByIdFailure("Error"));
//     }
//   } catch (error) {
//     yield put(getComplainConversionByIdFailure(error));
//   }
// }

//Function for Replay Complain API
function* replayComplainAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerPostAPI, 'api/BackOfficeComplain/AddRiseComplain', payload, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(replayComplainSuccess(response));
    } else {
      yield put(replayComplainFailure(response));
    }
  } catch (error) {
    yield put(replayComplainFailure(error));
  }
}

//Function for SLA Configuration List API
function* getSLAListAPI({ payload }) {
  var headers = { 'Authorization': AppConfig.authorizationToken }
  const response = yield call(swaggerGetAPI, 'api/BackOffice/GetComplaintPriority', payload, headers);
  try {
    if (response.ReturnCode === 0) {
      yield put(getSLAListSuccess(response));
    } else {
      yield put(getSLAListFailure(response));
    }
  } catch (error) {
    yield put(getSLAListFailure(error));
  }
}

//Display Domain Data
function* getHelpNSupportData() {
  yield takeEvery(HELPNSUPPORT_DASHBOARD, getHelpNSupportDataAPI);
}

/* Create Sagas method for Complain List */
export function* complainListSagas() {
  yield takeEvery(LIST_COMPLAIN, getComplainListAPI);
}

// /* Create Sagas method for Edit Complain */
// export function* editComplainSagas() {
//   yield takeEvery(EDIT_COMPLAIN, editComplainAPI);
// }

/* Create Sagas method for get Complain By Id */
export function* getComplainByIdSagas() {
  yield takeEvery(GET_COMPLAIN_BY_ID, getComplainByIdAPI);
}

/* Create Sagas method for Replay Complain */
export function* replayComplainSagas() {
  yield takeEvery(REPLAY_COMPLAIN, replayComplainAPI);
}

/* Create Sagas method for SLA Configuration List */
export function* slaListSagas() {
  yield takeEvery(GET_SLA_LIST, getSLAListAPI);
}

// /* Create Sagas method for get Complain Conversion By Id */
// export function* getComplainConversionByIdSagas() {
//   yield takeEvery(GET_COMPLAIN_CONVERSION_BY_ID, getComplainConversionByIdAPI);
// }

/* Export methods to rootSagas */
export default function* rootSaga() {
  yield all([
    fork(slaListSagas),
    fork(getHelpNSupportData),
    fork(complainListSagas),
    // fork(editComplainSagas),
    fork(getComplainByIdSagas),
    fork(replayComplainSagas),
    // fork(getComplainConversionByIdSagas)
  ]);
}
