import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI, swaggerPostAPI } from "../../api/helper";
import { userAccessToken } from "../../selector";
import {
    GET_TRNTYPE_ROLEWISE,
    UPDATE_TRNTYPE_ROLEWISE_STATUS,
    ADD_TRNTYPE_ROLEWISE
} from '../../actions/ActionTypes';
import {
    getTrnTypeRoleWiseSuccess,
    getTrnTypeRoleWiseFailure,
    updateTrnTypeRoleWiseStatusSuccess,
    updateTrnTypeRoleWiseStatusFailure,
    addTrnTypeRoleWiseSuccess,
    addTrnTypeRoleWiseFailure
} from '../../actions/Wallet/RoleWiseTransactionTypesAction';
import { Method } from "../../controllers/Methods";

//Get Trn Type Role Wise Api Call 
function* getTrnTypeRoleWiseAPI({ payload }) {
    try {

        const request = payload;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        var URL = Method.ListAllowTrnTypeRoleWise + '?';
        if (request.hasOwnProperty("RoleId") && request.RoleId !== "") {
            URL += '&RoleId=' + request.RoleId;
        }
        if (request.hasOwnProperty("TrnTypeId") && request.TrnTypeId !== "") {
            URL += '&TrnTypeId=' + request.TrnTypeId;
        }
        if (request.hasOwnProperty("Status") && request.Status !== "") {
            URL += '&Status=' + request.Status;
        }

        // To call Trn Type rolewise List Data Api
        const response = yield call(swaggerGetAPI, URL, payload, headers);

        // To set Trn Type rolewise List success response to reducer
        yield put(getTrnTypeRoleWiseSuccess(response));
    } catch (error) {
        // To set Trn Type rolewise List Failure response to reducer
        yield put(getTrnTypeRoleWiseFailure(error));
    }
}

//Update Trn Type Role Wise Status Api Call 
function* updateTrnTypeRoleWiseStatusAPI({ payload }) {

    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }
        // To call Trn Type rolewise status  Api
        const response = yield call(swaggerPostAPI, Method.ChangeAllowTrnTypeRoleStatus + '/' + payload.id + "/" + payload.status, payload, headers);
        // To set Trn Type rolewise status success response to reducer
        yield put(updateTrnTypeRoleWiseStatusSuccess(response));
    } catch (error) {
        // To set Trn Type rolewise status Failure response to reducer
        yield put(updateTrnTypeRoleWiseStatusFailure(error));
    }
}

//Trn Type Role Wise call api for add 
function* addTrnTypeRoleWiseAPI({ payload }) {
    try {
  

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Trn Type rolewise add  Api
        const response = yield call(swaggerPostAPI, Method.InserUpdateAllowTrnTypeRole, payload, headers);

        // To set Trn Type rolewise add success response to reducer
        yield put(addTrnTypeRoleWiseSuccess(response));
    } catch (error) {
        // To set Trn Type rolewise add Failure response to reducer
        yield put(addTrnTypeRoleWiseFailure(error));
    }
}

function* getTrnTypeRoleWise() {
    yield takeEvery(GET_TRNTYPE_ROLEWISE, getTrnTypeRoleWiseAPI);
}
function* updateTrnTypeRoleWiseStatus() {
    yield takeEvery(UPDATE_TRNTYPE_ROLEWISE_STATUS, updateTrnTypeRoleWiseStatusAPI);
}
function* addTrnTypeRoleWise() {
    yield takeEvery(ADD_TRNTYPE_ROLEWISE, addTrnTypeRoleWiseAPI);
}

// link to root saga middleware
export default function* rootSaga() {
    yield all([
        fork(getTrnTypeRoleWise),
        fork(updateTrnTypeRoleWiseStatus),
        fork(addTrnTypeRoleWise)
    ]);
}
