import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { swaggerGetAPI, swaggerPostAPI, queryBuilder } from '../../api/helper';
import { getKycVerifyListSuccess, getKycVerifyListFailure, editKycStatusSuccess, editKycStatusFailure } from '../../actions/account/KYCVerifyActions';
import { GET_KYC_VERIFY_LIST, EDIT_KYC_VERIFY_STATUS } from '../../actions/ActionTypes';
import { Method } from '../../controllers/Constants';
import { userAccessToken } from '../../selector';

export default function* KYCVerifySaga() {
    yield takeEvery(GET_KYC_VERIFY_LIST, getKYCVeriftList);
    yield takeEvery(EDIT_KYC_VERIFY_STATUS, editKycVerifyAPI);
}

/* Generator for Edit KYC Status  */
function* editKycVerifyAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Edit KYC Status Api
        const data = yield call(swaggerPostAPI, Method.KYCStatusUpdate, payload, headers);

        // To set Edit KYC Status success response to reducer
        yield put(editKycStatusSuccess(data));

    } catch (error) {

        // To set Edit KYC Status Failure response to reducer
        yield put(editKycStatusFailure());
    }
}

/* Generator for KYC Verify List */
function* getKYCVeriftList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call KYC list Api
        const data = yield call(swaggerGetAPI, Method.GetKYCList + queryBuilder(payload), {}, headers);

        // To set KYC list success response to reducer
        yield put(getKycVerifyListSuccess(data));

    } catch (error) {
        // To set KYC list Failure response to reducer
        yield put(getKycVerifyListFailure());
    }
}