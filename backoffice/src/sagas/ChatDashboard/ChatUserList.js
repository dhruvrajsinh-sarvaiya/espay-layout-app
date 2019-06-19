/* 
    Createdby : Dhara gajera
    CreatedDate : 26-12-2018
    Description : For chat user list Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//import action types
import {
    GET_CHATUSERLIST,
    CHANGEUSERBLOCKSTATUSCHAT,
    GET_CHATUSERHISTORY
} from 'Actions/types';

//import function from action
import {
    getChatUserListSuccess,
    getChatUserListFailure,
    changeBlockUserChatStatusSuccess,
    changeBlockUserChatStatusFailure,
    getChatUserhistorySuccess,
    getChatUserhistoryFailure
} from 'Actions/ChatDashboard';
import {
    swaggerPostAPI,
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';

/**
 * Get Chat User List API
 */
function* getChatUserlistApi({payload}) {
   
    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/Chat/GetUserList', payload, headers);
        // static response
        // const response = JSON.parse('{"Users": [{"IsEnabled": true,"IsBlocked":true, "CreatedDate": "0001-01-01T00:00:00", "FirstName": "Jayesh", "LastName": "Pathak", "Mobile": "9725079411", "CountryCode": null, "ProfilePhoto": null, "Name": "Jayesh Pathak", "Id": 4, "UserName": "jayesh@jbspl.com", "NormalizedUserName": "JAYESH@JBSPL.COM", "Email": "jayesh@jbspl.com", "NormalizedEmail": "JAYESH@JBSPL.COM", "EmailConfirmed": true, "PasswordHash": "AQAAAAEAACcQAAAAEP1VnnQf4X+nseFePxITL2rNB7mG0HlbPpCsxXQF/w/7JTipxM1oNbKfDLTSaBON1Q==", "SecurityStamp": "XKSBI3RF3GYZAEXLHMADCKSXB5JVUGZO", "ConcurrencyStamp": "9760de39-ff90-4e32-ad99-19f840b52c72", "PhoneNumber": "PR7HG7CB2OITZFS62DAXEM5AFHLLNV4A", "PhoneNumberConfirmed": false, "TwoFactorEnabled": false, "LockoutEnd": null, "LockoutEnabled": true, "AccessFailedCount": 0 }, {"IsEnabled": false,"IsBlocked":false, "CreatedDate": "0001-01-01T00:00:00", "FirstName": null, "LastName": null, "Mobile": "7211121123", "CountryCode": null, "ProfilePhoto": null, "Name": " ", "Id": 5, "UserName": "72111213123", "NormalizedUserName": "72111213123", "Email": null, "NormalizedEmail": null, "EmailConfirmed": false, "PasswordHash": null, "SecurityStamp": "CNXJHGH72U5KN7TBF7QJOEDTA6HMQ6XU", "ConcurrencyStamp": "b5f51a97-a8ef-4746-8c7e-acb9ea5123de", "PhoneNumber": null, "PhoneNumberConfirmed": false, "TwoFactorEnabled": false, "LockoutEnd": null, "LockoutEnabled": true, "AccessFailedCount": 0 }, {"IsEnabled": false,"IsBlocked":true, "CreatedDate": "0001-01-01T00:00:00", "FirstName": null, "LastName": null, "Mobile": null, "CountryCode": null, "ProfilePhoto": null, "Name": " ", "Id": 6, "UserName": "dhara.gajera1990@gmail.com", "NormalizedUserName": "DHARA.GAJERA1990@GMAIL.COM", "Email": "dhara.gajera1990@gmail.com", "NormalizedEmail": "DHARA.GAJERA1990@GMAIL.COM", "EmailConfirmed": false, "PasswordHash": null, "SecurityStamp": "YXVZSRQPRPCT3LJIJLV5M7LYQ353FGCE", "ConcurrencyStamp": "379c13a0-8791-404b-99bd-85f92806154f", "PhoneNumber": null, "PhoneNumberConfirmed": false, "TwoFactorEnabled": false, "LockoutEnd": null, "LockoutEnabled": true, "AccessFailedCount": 0 }], "ReturnCode": 0, "ReturnMsg": "Record Found Successfully!", "ErrorCode": 2253 }');
        // const response = JSON.parse('{"ReturnCode": 9, "ReturnMsg": "Error occurred.", "ErrorCode": 500 }');
        if (typeof response.Users != 'undefined' && response.ReturnCode === 0) {
            yield put(getChatUserListSuccess(response));
        } else {
            yield put(getChatUserListFailure(response));
        }
    } catch (error) {
        yield put(getChatUserListFailure(error));
    }
}
/**
 * Change User Block Unblock
 */
function* changeBlockUserChatStatusApi({payload}) {
    try {
        // static response
        // const response = JSON.parse('{"ReturnCode": 0, "ReturnMsg": "User Blocked Successfully.", "ErrorCode": 5007 }');
        // const response = JSON.parse('{"ReturnCode": 9, "ReturnMsg": "Error occurred.", "ErrorCode": 500 }');
       
        const response = yield call(swaggerPostAPI, 'api/Chat/BlockUser', payload,1);
        // console.log("res : --",response);
       
        if (response.ReturnCode === 0) {
            yield put(changeBlockUserChatStatusSuccess(response));
        } else {
            yield put(changeBlockUserChatStatusFailure(response));
        }
    } catch (error) {
        yield put(changeBlockUserChatStatusFailure(error));
    }
}

/**
 * Get Chat User History API Call
 */
function* getChatUserhistoryAPI({payload}) {
    try {
        const response = yield call(swaggerPostAPI, 'api/Chat/GetUserWiseChat', payload,1);
        // console.log("res : --",response);
       
        if (response.ReturnCode === 0) {
            yield put(getChatUserhistorySuccess(response));
        } else {
            yield put(getChatUserhistoryFailure(response));
        }
    } catch (error) {
        yield put(getChatUserhistoryFailure(error));
    }
}

/**
 * Get cht user list
 */
export function* getChatUserList() {
    yield takeEvery(GET_CHATUSERLIST, getChatUserlistApi);
}
/**
 * Get cht user list
 */
export function* changeBlockUserChatStatus() {
    yield takeEvery(CHANGEUSERBLOCKSTATUSCHAT, changeBlockUserChatStatusApi);
}

/**
 * Get Chat User History
 */
export function* getChatUserhistory() {
    yield takeEvery(GET_CHATUSERHISTORY, getChatUserhistoryAPI);
}

/**
 * chat user list Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(getChatUserList),
        fork(changeBlockUserChatStatus),
        fork(getChatUserhistory)
    ]);
}