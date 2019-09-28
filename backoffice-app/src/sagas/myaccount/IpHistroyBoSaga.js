import { call, put, takeLatest, select } from 'redux-saga/effects';
import { swaggerGetAPI } from '../../api/helper';
import { userAccessToken } from '../../selector';
import { IP_HISTORY_LIST } from '../../actions/ActionTypes';
import { ipHistoryBoListSuccess, ipHistoryBoListFailure } from '../../actions/account/IpHistoryAction';
import { Method } from '../../controllers/Constants';

//Function for IP History List Bo API
function* ipHistoryListBOAPI({ payload }) {
    try {

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        var swaggerUrl = Method.GetIpHistory + '/' + payload.PageIndex + '/' + payload.PAGE_SIZE;

        // To call ip history list Api
        const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

        // To set ip history list success response to reducer
        yield put(ipHistoryBoListSuccess(response));

    } catch (error) {
        // To set ip history list failure response to reducer
        yield put(ipHistoryBoListFailure(error));
    }
}

function* IpHistroyBoSaga() {
    // Call get Ip History Bo Data
    yield takeLatest(IP_HISTORY_LIST, ipHistoryListBOAPI)
}

export default IpHistroyBoSaga
//Sagas Effects..
