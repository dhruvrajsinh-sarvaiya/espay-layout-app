/**
 * Authorization Token Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';
//Action Types..
import {
    GENERATE_TOKEN,
    REFRESH_TOKEN,
    GET_PROFILE_BY_ID_SUCCESS,
} from '../actions/ActionTypes';

//Action methods..
import {
    generateTokenSuccess,
    generateTokenFailure,
    refreshTokenSuccess,
    refreshTokenFailure
} from '../actions/Login/AuthorizeToken';

//Call redirectToLogin to helper
import { staticResponse, statusErrCodeList, swaggerPostHeaderFormAPI } from '../api/helper';
import { ServiceUtilConstant, Method } from '../controllers/Constants';
import { logger } from '../controllers/CommonUtils';
import { userRefreshToken, userDetail } from '../selector';
import { AppConfig } from '../controllers/AppConfig';
import { getProfileByID } from '../actions/account/ChatAction';
import { validateResponseNew } from '../validations/CommonValidation';
import { setData } from '../App';
import moment from 'moment';
const statusErrCode = statusErrCodeList();

//Function for Generate Token API
function* gerenateTokenAPI({ payload }) {

    var swaggerUrl = (payload.appkey !== undefined && payload.appkey !== '') ? Method.token + '?appkey=' + payload.appkey : Method.token;
    let request = {
        'grant_type': AppConfig.grantTypeForToken,
        'username': payload.username,
        'password': payload.password,
        'client_id': AppConfig.clientIDForToken,
        'scope': AppConfig.scopeForToken,
    }

    try {
        const response = yield call(swaggerPostHeaderFormAPI, swaggerUrl, request);
        if (statusErrCode.includes(response.statusCode)) {
            let staticRes = staticResponse(response.statusCode);
            yield put(generateTokenSuccess(staticRes));
        } else {
            yield put(generateTokenSuccess(response));
            if (response.statusCode == 200) {
                yield put(getProfileByID());
            }

            //To store expiration time of token
            let expirationTime = moment().add(ServiceUtilConstant.refreshTokenInterval, 'minutes');
            setData({ [ServiceUtilConstant.KEY_Expiration]: expirationTime });
        }
    } catch (error) {
        logger('Catch', error.message);
        yield put(generateTokenFailure(error));
    }
}

//Function for Refresh Token API
function* refreshTokenAPI() {

    let refreshToken = yield select(userRefreshToken);

    let request = {
        refresh_token: refreshToken,
        grant_type: AppConfig.grantTypeForRefreshToken
    }

    try {
        const response = yield call(swaggerPostHeaderFormAPI, Method.token, request);

        if (statusErrCode.includes(response.statusCode)) {
            let staticRes = staticResponse(response.statusCode);
            yield put(refreshTokenSuccess(staticRes));
        } else {
            if (validateResponseNew({ response: response, isList: true })) {
                setData({
                    [ServiceUtilConstant.ACCESS_TOKEN]: 'Bearer ' + response.access_token,
                    [ServiceUtilConstant.ID_TOKEN]: response.id_token
                });
            }
            yield put(refreshTokenSuccess(response));
        }
    } catch (error) {
        //logger('Catch', error);
        yield put(refreshTokenFailure(error));
    }
}

/**
 * To get details of user profile
 */
function* getProfileDetail() {
    let userDetailSelector = yield select(userDetail);

    if (validateResponseNew({ response: userDetailSelector, isList: true })) {
        setData({
            [ServiceUtilConstant.FIRSTNAME]: userDetailSelector.UserData.FirstName,
            [ServiceUtilConstant.LASTNAME]: userDetailSelector.UserData.LastName,
            [ServiceUtilConstant.KEY_USER_NAME]: userDetailSelector.UserData.Username,
            [ServiceUtilConstant.Email]: userDetailSelector.UserData.Email,
            [ServiceUtilConstant.MOBILENO]: userDetailSelector.UserData.MobileNo,
            [ServiceUtilConstant.KEY_IsMargin]: false,
            [ServiceUtilConstant.KEY_SocialProfilePlan]: userDetailSelector.UserData.SocialProfile !== 'No',
        })
    }
}

/* Create Sagas method for Generate Token */
export function* gerenateTokenSagas() {
    yield takeLatest(GENERATE_TOKEN, gerenateTokenAPI);
}

/* Create Sagas method for Refresh Token */
export function* refreshTokenSagas() {
    yield takeLatest(REFRESH_TOKEN, refreshTokenAPI);
}

/**
 * To get user detail
 */
export function* getUserDetail() {
    yield takeLatest(GET_PROFILE_BY_ID_SUCCESS, getProfileDetail);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(gerenateTokenSagas),
        fork(refreshTokenSagas),
        fork(getUserDetail),
    ]);
}