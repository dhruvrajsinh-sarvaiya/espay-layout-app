import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { LIST_USER_SIGNUP_REPORT, USER_SIGNUP_DASHBOARD } from "../../actions/ActionTypes";

// import functions from action
import {
  getUserSignupRptDataSuccess,
  getUserSignupRptDataFailure,
  getUserSignupDataSuccess,
  getUserSignupDataFailure
} from "../../actions/account/UsersSignupReportAction"
import { userAccessToken } from '../../selector';
import { Method } from '../../controllers/Constants';
//Get function form helper for Swagger API Call
import { swaggerGetAPI } from "../../api/helper";

//Display Signup User Dashbord Data
function* getSignupUserCountDataAPI() {
  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }

    // To call User sign up Report count Api
    const response = yield call(swaggerGetAPI, Method.GetUserSignUpCount, {}, headers);

    // To User sign up Report count success response to reducer
    yield put(getUserSignupDataSuccess(response));
  } catch (error) {

    // To User sign up Report count failure response to reducer
    yield put(getUserSignupDataFailure(error));
  }
}

//Display Users Signup Report
function* getUserSignupDataReport({ payload }) {

  try {
    // To get tokenID of currently logged in user.
    let token = yield select(userAccessToken);
    var headers = { 'Authorization': token }
    var swaggerUrl = Method.GetUserSignUPreport + '?PageIndex=' + payload.PageIndex + '&Page_Size=' + payload.Page_Size;
    if (payload.hasOwnProperty("EmailAddress") && payload.EmailAddress !== "") {
      swaggerUrl += '&EmailAddress=' + payload.EmailAddress;
    }
    if (payload.hasOwnProperty("Username") && payload.Username !== "") {
      swaggerUrl += '&Username=' + payload.Username;
    }
    if (payload.hasOwnProperty("Mobile") && payload.Mobile !== "") {
      swaggerUrl += '&Mobile=' + payload.Mobile;
    }
    if (payload.hasOwnProperty("Status") && payload.Status !== "") {
      swaggerUrl += '&Status=' + payload.Status;
    }
    if (payload.hasOwnProperty("Filtration") && payload.Filtration !== "") {
      swaggerUrl += '&Filtration=' + payload.Filtration;
    }
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
      swaggerUrl += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
      swaggerUrl += '&ToDate=' + payload.ToDate;
    }

    // To call User sign up Report list Api
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

    // To User sign up Report list success response to reducer
    yield put(getUserSignupRptDataSuccess(response));
  } catch (error) {

    // To User sign up Report list failure response to reducer
    yield put(getUserSignupRptDataFailure(error));
  }
}

//Display User Signup Count Data
function* getSignupUserCount() {
  yield takeEvery(USER_SIGNUP_DASHBOARD, getSignupUserCountDataAPI);
}

//Display Users Signup Report
function* getSignupUserReport() {
  yield takeEvery(LIST_USER_SIGNUP_REPORT, getUserSignupDataReport);
}

//root saga
export default function* rootSaga() {
  yield all([
    fork(getSignupUserCount),
    fork(getSignupUserReport)]);
}
