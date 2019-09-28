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
} from '../../actions/ActionTypes';

//Action methods..
import {
    generateTokenSuccess,
    generateTokenFailure,
    refreshTokenSuccess,
    refreshTokenFailure
} from '../../actions/Login/AuthorizeToken';

//Call redirectToLogin to helper
import { staticResponse, statusErrCodeList, swaggerPostHeaderFormAPI } from '../../api/helper';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { userRefreshToken, userDetail } from '../../selector';
import { AppConfig } from '../../controllers/AppConfig';
import { getProfileByID } from '../../actions/account/EditProfileActions';
import { validateResponseNew } from '../../validations/CommonValidation';
import { setData } from '../../App';
import moment from 'moment';
import { Method } from '../../controllers/Methods';
const statusErrCode = statusErrCodeList();

//Function for Generate Token API
function* gerenateTokenAPI({ payload }) {

    // Create url
    var swaggerUrl = (payload.appkey !== undefined && payload.appkey !== '') ? Method.token + '?appkey=' + payload.appkey : Method.token;

    // Create request
    let request = {
        'grant_type': AppConfig.grantTypeForToken,
        'username': payload.username,
        'password': payload.password,
        'client_id': AppConfig.clientIDForToken,
        'scope': AppConfig.scopeForToken,
    }

    try {
        // To call Generate Token Data Api
        const response = yield call(swaggerPostHeaderFormAPI, swaggerUrl, request);

        if (statusErrCode.includes(response.statusCode)) {
            let staticRes = staticResponse(response.statusCode);

            // To set Generate Token success response to reducer
            yield put(generateTokenSuccess(staticRes));
        } else {
            // To set Generate Token success response to reducer
            yield put(generateTokenSuccess(response));
            if (response.statusCode == 200) {
                yield put(getProfileByID());
            }

            //To store expiration time of token
            let accessExpirationTime = moment().add(ServiceUtilConstant.accessTokenInterval, 'minutes');
            let refreshExpirationTime = moment().add(ServiceUtilConstant.refreshTokenInterval, 'minutes');
            setData({
                [ServiceUtilConstant.KEY_Access_Expiration]: accessExpirationTime,
                [ServiceUtilConstant.KEY_Refresh_Expiration]: refreshExpirationTime
            });
        }
    } catch (error) {
        logger('Catch', error.message);
        // To set Generate Token failure response to reducer
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
        // To call Refresh Token Data Api
        const response = yield call(swaggerPostHeaderFormAPI, Method.token, request);

        if (statusErrCode.includes(response.statusCode)) {
            let staticRes = staticResponse(response.statusCode);

            // To set Refresh Token success response to reducer
            yield put(refreshTokenSuccess(staticRes));
        } else {
            // Handle success/failure response
            if (validateResponseNew({ response: response, isList: true })) {
                let accessExpirationTime = moment().add(ServiceUtilConstant.accessTokenInterval, 'minutes');
                setData({
                    [ServiceUtilConstant.ACCESS_TOKEN]: 'Bearer ' + response.access_token,
                    [ServiceUtilConstant.ID_TOKEN]: response.id_token,
                    [ServiceUtilConstant.KEY_Access_Expiration]: accessExpirationTime
                });
            }

            // To set Refresh Token success response to reducer
            yield put(refreshTokenSuccess(response));
        }
    } catch (error) {
        //logger('Catch', error);
        // To set Refresh Token failure response to reducer
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
            [ServiceUtilConstant.KEY_GoogleAuth]: userDetailSelector.UserData.TwoFactorEnabled
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