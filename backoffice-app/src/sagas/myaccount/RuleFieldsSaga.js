import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import {
    ADD_RULE_FIELD,
    EDIT_RULE_FIELD,
    LIST_RULE_FIELD
} from "../../actions/ActionTypes";
import {
    addRuleFieldSuccess,
    addRuleFieldFailure,
    editRuleFieldSuccess,
    editRuleFieldFailure,
    getRuleFieldListSuccess,
    getRuleFieldListFailure,
} from "../../actions/account/RuleFieldsAction";
import { userAccessToken } from "../../selector";
import { swaggerPostAPI, swaggerGetAPI } from "../../api/helper";
import { Method } from "../../controllers/Constants";

//Function for Add Rule Field API
function* addRuleFieldAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call add rule field api
        const response = yield call(swaggerPostAPI, Method.AddFieldData, payload, headers);

        // To set add rule field success response to reducer
        yield put(addRuleFieldSuccess(response));
    } catch (error) {

        // To set add rule field failure response to reducer
        yield put(addRuleFieldFailure(error));
    }
}

//Function for Edit Rule Field API
function* editRuleFieldAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call edit rule field api
        const response = yield call(swaggerPostAPI, Method.UpdateFieldData, payload, headers);

        // To set edit rule field success response to reducer
        yield put(editRuleFieldSuccess(response));
    } catch (error) {

        // To set edit rule field failure response to reducer
        yield put(editRuleFieldFailure(error));
    }
}

//Function for List Rule Field API
function* listRuleFieldAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        //url
        var sUrl = Method.GetAllFieldData + '/' + payload.PageNo + '?PageSize=' + payload.PageSize;
        if (payload.hasOwnProperty('AllRecords') && payload.AllRecords > 0) {
            sUrl += '&AllRecords=' + payload.AllRecords;
        }

        // To call all field data api
        const response = yield call(swaggerGetAPI, sUrl, {}, headers);

        // To set all field data success response to reducer
        yield put(getRuleFieldListSuccess(response));
    } catch (error) {

        // To set all field data failure response to reducer
        yield put(getRuleFieldListFailure(error));
    }
}

/* Create Sagas method for Add Rule Field */
export function* addRuleFieldSagas() {
    yield takeEvery(ADD_RULE_FIELD, addRuleFieldAPI);
}

/* Create Sagas method for Edit Rule Field */
export function* editRuleFieldSagas() {
    yield takeEvery(EDIT_RULE_FIELD, editRuleFieldAPI);
}

/* Create Sagas method for List Rule Field */
export function* listRuleFieldSagas() {
    yield takeEvery(LIST_RULE_FIELD, listRuleFieldAPI);
}

//saga middleware
export default function* rootSaga() {
    yield all([
        fork(addRuleFieldSagas),
        fork(editRuleFieldSagas),
        fork(listRuleFieldSagas),
    ]);
}