
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { GET_CMS_DASHBOARD_DETAILS } from '../../actions/ActionTypes';
import {
    getCmsDashboardDetailsSuccess,
    getCmsDashboardDetailsFailure
} from '../../actions/CMS/CmsDashBoardAction';
import { Method } from '../../controllers/Constants';
import { WebPageUrlGetApi } from '../../api/helper';
import { userAccessToken } from '../../selector';

//Function for cms dashboard List API
function* cmsDashboardAPI({ payload }) {
    try {

        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + tokenID.replace('Bearer ', '') };

        const response = yield call(WebPageUrlGetApi, Method.contactUsCount, {}, headers);

        yield put(getCmsDashboardDetailsSuccess(response));

    } catch (error) {
        yield put(getCmsDashboardDetailsFailure(error));
    }

}
function* CmsDashboardSaga() {
    // Call get cms dashboard Data
    yield takeLatest(GET_CMS_DASHBOARD_DETAILS, cmsDashboardAPI)

}
export default CmsDashboardSaga
//Sagas Effects..
