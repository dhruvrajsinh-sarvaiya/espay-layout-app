import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_ADMIN_ASSETS_LIST } from '../../actions/ActionTypes';
import { getAdminAssetsListSuccess, getAdminAssetsListFailure } from '../../actions/Wallet/AdminAssetsActions';

export default function* AdminAssetsSaga() {
    // To register Get Admin Assets List method
    yield takeEvery(GET_ADMIN_ASSETS_LIST, getAdminAssetsList);
}

// Generator for Get Admin Assets List
function* getAdminAssetsList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request Url
        let Request = Method.AdminAssets + '/' + payload.PageNo + '/' + payload.PageSize;

        // create request
        let obj = { PageNo: payload.PageNo, PageSize: payload.PageSize }

        if (payload.WalletTypeId !== undefined && payload.WalletTypeId !== '') {
            obj = {
                ...obj,
                WalletTypeId: payload.WalletTypeId
            }
        }
        if (payload.WalletUsageTypeId !== undefined && payload.WalletUsageTypeId !== '') {
            obj = {
                ...obj,
                WalletUsageType: payload.WalletUsageTypeId
            }
        }
        // Create New Request
        let newRequest = Request + queryBuilder(obj)

        // To call Get Admin Assets List Data Api
        const data = yield call(swaggerGetAPI, newRequest, obj, headers);

        // To set Get Admin Assets List success response to reducer
        yield put(getAdminAssetsListSuccess(data));
    } catch (error) {
        // To set Get Admin Assets List failure response to reducer
        yield put(getAdminAssetsListFailure());
    }
}