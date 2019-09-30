import { call, select, put, takeLatest } from 'redux-saga/effects';
import { Method } from "../../controllers/Constants";
import { userAccessToken } from "../../selector";
import { swaggerGetAPI } from "../../api/helper";
import { LOGIN_HISTORY_LIST_BO } from "../../actions/ActionTypes";
import { getLoginHistoryListBoSuccess, getLoginHistoryListBoFailure } from '../../actions/account/LoginHistoryBoAction';

//Function for Login History List API
function* loginHistoryListBoAPI({ payload }) {
    try {
        var swaggerUrl = Method.GetLoginHistory + '/' + payload;

        //to get tokenID of currently logged in user. 
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Login History Api
        const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

        // To set Login History success response to reducer
        yield put(getLoginHistoryListBoSuccess(response));
    } catch (error) {
        // To set Login History failure response to reducer
        yield put(getLoginHistoryListBoFailure(error));
    }
}

function* LoginHistoryBoSaga() {
    // Call get Login History Data
    yield takeLatest(LOGIN_HISTORY_LIST_BO, loginHistoryListBoAPI);
}

export default LoginHistoryBoSaga
