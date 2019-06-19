// sagas For Bug Report Actions By Tejas

// for call axios call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { NotificationManager } from "react-notifications";

// types for set actions and reducers
import { GET_FILE_LIST, CLEAR_FILE_LIST, GET_FILE_DETAIL } from "Actions/types";

// action sfor set data or response
import {
  fileListSuccess,
  fileListFailure,
  clearFileListSuccess,
  clearFileListFailure,
  getFileDetailSuccess,
  getFileDetailFailure
} from "Actions/BugReport";

// Sagas Function for get File List by :Tejas
function* getFileList() {
  yield takeEvery(GET_FILE_LIST, getFileListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getFileListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(getFileListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(fileListSuccess(response));
    } else {
      yield put(fileListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("File List Not Found");
    yield put(fileListFailure(error));
  }
}

// function for Call api and set response
const getFileListRequest = async Data =>
  await api
    .get(
      "http://172.20.65.111:5000/api/private/v1/getLogs/getFrontErrorLogsDetails"
    )
    .then(response => response)
    .catch(error => error);

// Sagas Function for clear File List by :Tejas
function* clearFileList() {
  yield takeEvery(CLEAR_FILE_LIST, clearFileListDetail);
}

// Function for set response to data and Call Function for Api Call
function* clearFileListDetail({ payload }) {
  const { Data } = payload;

  try {
    const response = yield call(clearFileListRequest, Data);
    // set response if its available else set error message
    if (
      response &&
      response != null &&
      response !== undefined &&
      response.status === 200
    ) {
      yield put(clearFileListSuccess(response));
    } else {
      yield put(clearFileListFailure(response));
    }
  } catch (error) {
    NotificationManager.error("clear List Not done");
    yield put(clearFileListFailure(error));
  }
}

// function for Call api and set response 
const clearFileListRequest = async (Data) =>
    await api.get('ClearList.js', Data)
        .then(response => response)
        .catch(error => error)

// Sagas Function for get File Detail by :Tejas
function* getFileDetail() {
  yield takeEvery(GET_FILE_DETAIL, getFileDetaileData);
}

// Function for set response to data and Call Function for Api Call
function* getFileDetaileData({ payload }) {
  const { Data } = payload;

  try {
    // var stringData = "2017-11-22 11:22:50 - PHP Notice:  Trying to get property of non-object in E:\wamp64\www\JTC\B2B\Front\trunk\catalog\controller\common\home.php on line 262  2017-11-22 11:22:50 - PHP Notice:  Undefined index: modules in E:\wamp64\www\JTC\B2B\Front\trunk\catalog\view\theme\JTC\template\common\home.tpl on line 9      2017-11-22 11:22:50 - PHP Warning:  Invalid argument supplied for foreach() in E:\wamp64\www\JTC\B2B\Front\trunk\catalog\view\theme\JTC\template\common\home.tpl on line 9       2017-11-22 11:23:58 - PHP Notice:  Undefined index: MemberID in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 29        2017-11-22 11:24:01 - PHP Notice:  Server was unable to read request. ---> There is an error in XML document (2, 162). ---> Input string was not in a correct format. in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 95        2017-11-22 11:24:01 - PHP Notice:  Undefined index: MemberID in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 29        2017-11-22 11:24:03 - PHP Notice:  Server was unable to read request. ---> There is an error in XML document (2, 162). ---> Input string was not in a correct format. in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 95        2017-11-22 11:24:03 - PHP Notice:  Undefined index: MemberID in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 29        2017-11-22 11:24:05 - PHP Notice:  Server was unable to read request. ---> There is an error in XML document (2, 162). ---> Input string was not in a correct format. in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 95        2017-11-22 11:25:23 - PHP Notice:  Undefined index: MemberID in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 29        2017-11-22 11:25:26 - PHP Notice:  Server was unable to read request. ---> There is an error in XML document (2, 162). ---> Input string was not in a correct format. in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 95        2017-11-22 11:25:26 - PHP Notice:  Undefined index: MemberType in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\menu.php on line 26        2017-11-22 11:25:26 - PHP Notice:  Undefined index: MemberType in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\menu.php on line 27        2017-11-22 11:25:26 - PHP Notice:  Undefined index: MemberType in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\menu.php on line 28        2017-11-22 11:25:26 - PHP Notice:  Undefined index: MemberType in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\menu.php on line 29        2017-11-22 11:25:26 - PHP Notice:  Undefined index: MemberID in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 29        2017-11-22 11:25:28 - PHP Notice:  Server was unable to read request. ---> There is an error in XML document (2, 162). ---> Input string was not in a correct format. in E:\wamp64\www\JTC\B2B\Front\trunk\system\library\curl.php on line 95";

    const response = yield call(getFileDetailRequest, Data);
    if (response && response != null && response !== undefined) {
      yield put(getFileDetailSuccess(response));
    } else {
      yield put(getFileDetailFailure(response));
    }
  } catch (error) {
    NotificationManager.error("clear List Not done");
    yield put(getFileDetailFailure(error));
  }
}

// function for Call api and set response
const getFileDetailRequest = async Data =>
  await api
    .get(
      "http://172.20.65.111:5000/api/private/v1/getLogs/getFrontErrorLogsDetails?fileID=" +
        Data.fileID
    )
    .then(response => response)
    .catch(error => error);

// Function for root saga
export default function* rootSaga() {
  yield all([fork(getFileList), fork(clearFileList), fork(getFileDetail)]);
}
