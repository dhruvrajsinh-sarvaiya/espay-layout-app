//Sagas Effects..
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
//Action Types..
import {
    ADD_CURRENCY_LOGO
} from '../../actions/ActionTypes';

//Action methods..
import {
    addCurrencyLogoSuccess,
    addCurrencyLogoFailure
} from '../../actions/Trading/AddCurrencyLogoAction';

import { swaggerPostAPI, convertObjToFormData } from "../../api/helper";
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';

//Function for Get Leader Board List API
function* addCurrencyLogoAPI({ payload }) {

    try {
        var formData = convertObjToFormData(payload);

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Add Currency Logo Api
        const response = yield call(swaggerPostAPI, Method.AddCurrencyLogo, formData, headers);

        // To set Add Currency success response to reducer
        yield put(addCurrencyLogoSuccess(response));
    } catch (error) {
        // To set Add Currency failure response to reducer
        yield put(addCurrencyLogoFailure(error));
    }
}

/* Create Sagas method for Add Currency Logo */
export function* addCurrencyLogo() {
    yield takeLatest(ADD_CURRENCY_LOGO, addCurrencyLogoAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(addCurrencyLogo)
    ]);
}