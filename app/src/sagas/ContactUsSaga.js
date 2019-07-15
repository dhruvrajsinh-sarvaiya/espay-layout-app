import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
import { ADD_NEW_CONTACTUS, } from '../actions/ActionTypes';
import { addContactusSuccess, addContactusFailure, } from '../actions/CMS/ContactusActions';
import { WebPageUrlPostAPI } from '../api/helper';
import { userAccessToken } from '../selector';

// Generator for ContactUs
function* addContactusServer({ payload }) {

    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token.replace('Bearer', 'JWT') };

        // To call Contact Us api
        const response = yield call(WebPageUrlPostAPI, 'api/private/v1/contactus/addContact', { contactdata: payload }, headers);

        // To set ContactUs success response to reducer
        yield put(addContactusSuccess(response));
    } catch (error) {
        // To set ContactUs failure response to reducer
        yield put(addContactusFailure(error));
    }
}

export function* addNewContactUs() {
    yield takeLatest(ADD_NEW_CONTACTUS, addContactusServer);
}

export default function* rootSaga() {
    // To register addNewContactUs method
    yield all([fork(addNewContactUs)]);
}