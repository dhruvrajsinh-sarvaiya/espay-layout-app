import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { LIST_UNASSIGN_USER_ROLE } from "../../actions/ActionTypes";
import { listUnassignUserRoleSuccess, listUnassignUserRoleFailure } from "../../actions/account/UnsignedUserRoleAction";
import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";
import { swaggerGetAPI } from "../../api/helper";

//Function for List Unassign User Role API
function* listUnassignUserRoleAPI({ payload }) {

    try {

        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //url
        var sUrl = Method.ViewUnassignedUsers + '/' + payload.PageNo + '?PageSize=' + payload.PageSize + '&FromDate=' + payload.FromDate + '&ToDate=' + payload.ToDate;

        if (payload.hasOwnProperty('UserName') && payload.UserName !== "") {
            sUrl += '&UserName=' + payload.UserName;
        }

        if (payload.hasOwnProperty('Status') && payload.Status !== "") {
            sUrl += '&Status=' + payload.Status;
        }

        // To call view unassign users list api
        const response = yield call(swaggerGetAPI, sUrl, {}, headers);

        // To set view unassign users list success response to reducer
        yield put(listUnassignUserRoleSuccess(response));
    } catch (error) {

        // To set view unassign users list success response to reducer
        yield put(listUnassignUserRoleFailure(error));
    }
}

/* Create Sagas method for List Unassign User Role */
export function* listUnassignUserRoleSaga() {
    yield takeEvery(LIST_UNASSIGN_USER_ROLE, listUnassignUserRoleAPI);
}

//saga middle ware
export default function* rootSaga() {
    yield all([
        fork(listUnassignUserRoleSaga),
    ]);
}