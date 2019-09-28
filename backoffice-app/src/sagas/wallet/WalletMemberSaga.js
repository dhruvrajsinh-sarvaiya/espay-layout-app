import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, queryBuilder, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { GET_WALLET_MEMBER_LIST } from '../../actions/ActionTypes';
import { getWalletMemberListSuccess, getWalletMemberListFailure } from '../../actions/Wallet/WalletMemberActions';
import { parseIntVal } from '../../controllers/CommonUtils';

export default function* WalletMemberSaga() {
    // To register Get Wallet Member List method
    yield takeEvery(GET_WALLET_MEMBER_LIST, getWalletMemberList)
}

// Generator for Wallet Member List
function* getWalletMemberList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }


        // create request
        let obj = {}

        if (payload.OrgID !== undefined && payload.OrgID !== '') {
            obj = {
                ...obj,
                OrgID: payload.OrgID
            }
        }
        if (payload.UserType !== undefined && payload.UserType !== '') {
            obj = {
                ...obj,
                UserType: parseIntVal(payload.UserType)
            }
        }
        if (payload.Status !== undefined && payload.Status !== '') {
            obj = {
                ...obj,
                Status: parseIntVal(payload.Status)
            }
        }
        if (payload.PageNo !== undefined && payload.PageNo !== '') {
            obj = {
                ...obj,
                PageNo: payload.PageNo
            }
        }
        if (payload.PageSize !== undefined && payload.PageSize !== '') {
            obj = {
                ...obj,
                PageSize: payload.PageSize
            }
        }

        // Create New Request
        let newRequest = Method.ListAllUserDetails + queryBuilder(obj)

        // To call Get Wallet Member List Data Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers);

        // To set Get Wallet Member List success response to reducer
        yield put(getWalletMemberListSuccess(data));
    } catch (error) {
        // To set Get Wallet Member List failure response to reducer
        yield put(getWalletMemberListFailure());
    }
}