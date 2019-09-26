import { call, put, takeEvery } from 'redux-saga/effects';
import { GET_LICENSE_DETAIL } from '../actions/ActionTypes';
import { getLicenseDetailSuccess, getLicenseDetailFailure } from '../actions/SplashScreen/SplashScreenAction';
import { callSoapApi } from '../api/helper';

//Function for State API
function* getLicenseAPI() {
    try {
        // To call State api
        const response = yield call(callSoapApi);

        // To set State success response to reducer
        yield put(getLicenseDetailSuccess(response));
    } catch (error) {
        // To set StateList failure response to reducer
        yield put(getLicenseDetailFailure(error));
    }
}

export default function* SplashScreenSaga() {
    // To register Get License Detail method
    yield takeEvery(GET_LICENSE_DETAIL, getLicenseAPI)
}