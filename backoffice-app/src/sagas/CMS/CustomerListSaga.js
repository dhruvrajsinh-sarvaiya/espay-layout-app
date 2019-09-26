// CustomerListSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { ADD_CUSTOMER } from '../../actions/ActionTypes';
import { AddCustomerSuccess, AddCustomerFailure, } from '../../actions/CMS/CustomerListAction';
import { Method } from '../../controllers/Constants';
import { swaggerPostAPI } from '../../api/helper';
import { userAccessToken } from '../../selector';

function* AddCustomerData(action) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call add customer Api
        const data = yield call(swaggerPostAPI, Method.RegisterUser, action.AddCustomer, headers);

        // To add customer success response to reducer
        yield put(AddCustomerSuccess(data))
    } catch (e) {

        // To add customer failure response to reducer
        yield put(AddCustomerFailure())
    }
}

//call add customer Api
function* CustomerListSaga() {
    yield takeLatest(ADD_CUSTOMER, AddCustomerData)
}

export default CustomerListSaga;
