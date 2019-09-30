//Sagas Effects..
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
//Action Types..
import { CHANGE_PASSWORD } from '../../actions/ActionTypes';
//Action methods..
import { changePasswordSuccess, changePasswordFailure } from '../../actions/Login/ResetPasswordAction';
import { swaggerPostAPI } from '../../api/helper';

//Function for Change Password
function* changePasswordAPI({ payload }) {
  try {
    //to get tokenID of currently logged in user.
    let tokenID = yield select(userAccessToken);
    var headers = { 'Authorization': tokenID }

    // To call Get Arbitrage Api Request Data Api
    const response = yield call(swaggerPostAPI, Method.changepassword, payload, headers);

    // To set changePassword success response to reducer
    yield put(changePasswordSuccess(response));
  } catch (error) {

    // To set changePassword failure response to reducer
    yield put(changePasswordFailure(error));
  }
}

/* Create Sagas method for Change Password */
export function* ResetPasswordSaga() {
  yield takeLatest(CHANGE_PASSWORD, changePasswordAPI);
}

/* Export methods to rootSagas */
export default ResetPasswordSaga