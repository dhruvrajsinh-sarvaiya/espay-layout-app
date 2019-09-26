import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { Method } from "../../controllers/Methods";
import { swaggerGetAPI } from '../../api/helper';
import { userAccessToken } from "../../selector";
import { roleAssignHistorySuccess, roleAssignHistoryFailure } from "../../actions/account/RoleAssignHistoryAction";
import { USERS_ROLE_ASSIGN_HISTORY } from "../../actions/ActionTypes";

//Function for role Assign History API 
function* roleAssignHistoryAPI({ payload }) {

    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //url
        var sUrl = Method.GetRoleHistory + '/' + payload.PageNo + '?PageSize=' + payload.PageSize + '&FromDate=' + payload.FromDate + '&ToDate=' + payload.ToDate;

        if (payload.hasOwnProperty('UserId') && payload.UserId !== "") {
            sUrl += '&UserId=' + payload.UserId;
        }

        if (payload.hasOwnProperty('ModuleId') && payload.ModuleId !== "") {
            sUrl += '&ModuleId=' + payload.ModuleId;
        }

        if (payload.hasOwnProperty('Status') && payload.Status !== "") {
            sUrl += '&Status=' + payload.Status;
        }

        // To call role assign history list api
        const response = yield call(swaggerGetAPI, sUrl, {}, headers);

        // To set role assign history list success response to reducer
        yield put(roleAssignHistorySuccess(response));
    } catch (error) {

        // To set role assign history list success response to reducer
        yield put(roleAssignHistoryFailure(error));
    }
}


/* Create Sagas method for role assign */
export function* userRoleAssignHistory() {
    yield takeEvery(USERS_ROLE_ASSIGN_HISTORY, roleAssignHistoryAPI);
}

//saga middleware
export default function* rootSaga() {
    yield all([
        fork(userRoleAssignHistory),
    ]);
}