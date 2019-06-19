/**
 * Auther : Kevin Ladani
 * Created : 19/12/2018
 * UpdatedBy : Salim Deraiya 24/12/2018
 * Social Profile Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    GET_LEADER_CONFIG,
    EDIT_LEADER_CONFIG,
    GET_FOLLOWER_CONFIG,
    EDIT_FOLLOWER_CONFIG,
    GET_SOCIAL_PROFILE_SUBSCRIPTION,
    SOCIAL_PROFILE_SUBSCRIBE,
	SOCIAL_PROFILE_UNSUBSCRIBE,
	GET_LEADER_LIST,
	GET_FOLLOWER_LIST,
	GET_LEADER_FOLLOW_BY_ID,
	UNFOLLOW_LEADER,
	ADD_WATCHLIST_GROUP,
	ADD_WATCHLIST,
	REMOVE_WATCHLIST,
    GET_WATCHLIST,
	GET_LEADER_WATCH_LIST,
} from 'Actions/types';

//Action methods..
import {
    getLeaderConfigSuccess,
    getLeaderConfigFailure,
    editLeaderConfigSuccess,
    editLeaderConfigFailure,
    getFollowerConfigSuccess,
    getFollowerConfigFailure,
    editFollowerConfigSuccess,
    editFollowerConfigFailure,
    getSocialProfileSubscriptionSuccess,
    getSocialProfileSubscriptionFailure,
    getSocialProfileSubscribeSuccess,
    getSocialProfileSubscribeFailure,
    getSocialProfileUnSubscribeSuccess,
	getSocialProfileUnSubscribeFailure,
	getLeaderListSuccess,
	getLeaderListFailure,
	getFollowerListSuccess,
	getFollowerListFailure,
	getLeaderFollowByIdSuccess,
	getLeaderFollowByIdFailure,
	unFollowLeaderSuccess,
	unFollowLeaderFailure,
	getWatchlistSuccess,
	getWatchlistFailure,
	addWatchlistGroupSuccess,
	addWatchlistGroupFailure,
	addWatchlistSuccess,
	addWatchlistFailure,
	removeWatchlistSuccess,
	removeWatchlistFailure,
	getLeaderWatchlistSuccess,
	getLeaderWatchlistFailure,
} from 'Actions/SocialProfile';

import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI, swaggerPostAPI } from 'Helpers/helpers';

//Function for Get Leader Configuration API
function* getLeaderConfigAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    // const response = yield call(swaggerPostAPI, 'api/SocialProfile/SetLeaderFrontProfile', payload, headers);
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetLeaderFrontProfileConfiguration', '', headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getLeaderConfigSuccess(response));
		} else {
			yield put(getLeaderConfigFailure(response));
		}
	} catch (error) {
		yield put(getLeaderConfigFailure(error));
	}
}

//Function for Edit Leader Configuration API
function* editLeaderConfigAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/SetLeaderFrontProfile', payload, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(editLeaderConfigSuccess(response));
		} else {
			yield put(editLeaderConfigFailure(response));
		}
	} catch (error) {
		yield put(editLeaderConfigFailure(error));
	}
}

//Function for Get Follower Configuration API
function* getFollowerConfigAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/SetFollowerFrontProfile', payload, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getFollowerConfigSuccess(response));
		} else {
			yield put(getFollowerConfigFailure(response));
		}
	} catch (error) {
		yield put(getFollowerConfigFailure(error));
	}
}

//Function for Edit Follower Configuration API
function* editFollowerConfigAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/SetFollowerFrontProfile', payload, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(editFollowerConfigSuccess(response));
		} else {
			yield put(editFollowerConfigFailure(response));
		}
	} catch (error) {
		yield put(editFollowerConfigFailure(error));
	}
}

//Function for Get Social Profile Subscription API
function* getSocialProfileSubscriptionAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetSocialProfile', {}, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getSocialProfileSubscriptionSuccess(response));
		} else {
			yield put(getSocialProfileSubscriptionFailure(response));
		}
	} catch (error) {
		yield put(getSocialProfileSubscriptionFailure(error));
	}
}

//Function for Get Social Profile Subscription API
function* getSocialProfileSubscriptionAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetSocialProfile', {}, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getSocialProfileSubscriptionSuccess(response));
		} else {
			yield put(getSocialProfileSubscriptionFailure(response));
		}
	} catch (error) {
		yield put(getSocialProfileSubscriptionFailure(error));
	}
}

//Function for Get Social Profile Subscribe API
function* getSocialProfileSubscribeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/SubscribSocialProfile/'+payload, '', headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getSocialProfileSubscribeSuccess(response));
		} else {
			yield put(getSocialProfileSubscribeFailure(response));
		}
	} catch (error) {
		yield put(getSocialProfileSubscribeFailure(error));
	}
}

//Function for Get Social Profile UnSubscribe API
function* getSocialProfileUnSubscribeAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/UnsibscribeSocialProfile/'+payload, '', headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getSocialProfileUnSubscribeSuccess(response));
		} else {
			yield put(getSocialProfileUnSubscribeFailure(response));
		}
	} catch (error) {
		yield put(getSocialProfileUnSubscribeFailure(error));
	}
}

//Function for Get Leader List API
function* getLeaderListAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetLeaderList/'+payload.PageIndex+'/'+payload.Page_Size, {}, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getLeaderListSuccess(response));
		} else {
			yield put(getLeaderListFailure(response));
		}
	} catch (error) {
		yield put(getLeaderListFailure(error));
	}
}

//Function for Get Follower List API
function* getFollowerListAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetLeaderWiseFollowerConfig/'+payload.PageIndex+'/'+payload.Page_Size, {}, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getFollowerListSuccess(response));
		} else {
			yield put(getFollowerListFailure(response));
		}
	} catch (error) {
		yield put(getFollowerListFailure(error));
	}
}

//Function for Get Leader Follow By ID API
function* getLeaderFollowByIDAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetFollowerFrontProfileConfiguration/'+payload.LeaderId, {}, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getLeaderFollowByIdSuccess(response));
		} else {
			yield put(getLeaderFollowByIdFailure(response));
		}
	} catch (error) {
		yield put(getLeaderFollowByIdFailure(error));
	}
}

//Function for Get Leader Follow By ID API
function* unFollowLeaderAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/UnFollow?LeaderId='+payload.LeaderId, {}, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(unFollowLeaderSuccess(response));
		} else {
			yield put(unFollowLeaderFailure(response));
		}
	} catch (error) {
		yield put(unFollowLeaderFailure(error));
	}
}

//Function for Add Watchlist Group API
function* addWatchlistGroupAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/AddGroup', payload, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(addWatchlistGroupSuccess(response));
		} else {
			yield put(addWatchlistGroupFailure(response));
		}
	} catch (error) {
		yield put(addWatchlistGroupFailure(error));
	}
}

//Function for Add Watchlist API
function* addWatchlistAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/AddWatch', payload, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(addWatchlistSuccess(response));
		} else {
			yield put(addWatchlistFailure(response));
		}
	} catch (error) {
		yield put(addWatchlistFailure(error));
	}
}

//Function for Remove Watchlist API
function* removeWatchlistAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/SocialProfile/UnFollowWatch', payload, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(removeWatchlistSuccess(response));
		} else {
			yield put(removeWatchlistFailure(response));
		}
	} catch (error) {
		yield put(removeWatchlistFailure(error));
	}
}

//Function for Get Watchlist API
function* getWatchlistAPI() {
    var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerGetAPI, 'api/SocialProfile/GetGroupList', {}, headers);
	
	try {
		if (response.ReturnCode === 0) {
			yield put(getWatchlistSuccess(response));
		} else {
			yield put(getWatchlistFailure(response));
		}
	} catch (error) {
		yield put(getWatchlistFailure(error));
	}
}

//Function for Get Leader Watchlist API
function* getLeaderWatchlistAPI({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	var swaggerAPIUrl = 'api/SocialProfile/GetWatcherWiseLeaderList/'+payload.PageIndex+'/'+payload.Page_Size+'/'+payload.GroupId;
    const response = yield call(swaggerGetAPI, swaggerAPIUrl, payload, headers);
    
	try {
		if (response.ReturnCode === 0) {
			yield put(getLeaderWatchlistSuccess(response));
		} else {
			yield put(getLeaderWatchlistFailure(response));
		}
	} catch (error) {
		yield put(getLeaderWatchlistFailure(error));
	}
}

/* Create Sagas method for Get Leader Configuration */
export function* getLeaderConfigSagas() {
    yield takeEvery(GET_LEADER_CONFIG, getLeaderConfigAPI);
}

/* Create Sagas method for Get Follower Configuration */
export function* getFollowerConfigSagas() {
    yield takeEvery(GET_FOLLOWER_CONFIG, getFollowerConfigAPI);
}

/* Create Sagas method for Edit Leader Configuration */
export function* editLeaderConfigSagas() {
    yield takeEvery(EDIT_LEADER_CONFIG, editLeaderConfigAPI);
}

/* Create Sagas method for Edit Follower Configuration */
export function* editFollowerConfigSagas() {
    yield takeEvery(EDIT_FOLLOWER_CONFIG, editFollowerConfigAPI);
}

/* Create Sagas method for Get Social Profile Subscription */
export function* getSocialProfileSubscriptionSagas() {
    yield takeEvery(GET_SOCIAL_PROFILE_SUBSCRIPTION, getSocialProfileSubscriptionAPI);
}

/* Create Sagas method for Social Profile Subscribe */
export function* getSocialProfileSubscribeSagas() {
    yield takeEvery(SOCIAL_PROFILE_SUBSCRIBE, getSocialProfileSubscribeAPI);
}

/* Create Sagas method for Social Profile UnSubscribe */
export function* getSocialProfileUnSubscribeSagas() {
    yield takeEvery(SOCIAL_PROFILE_UNSUBSCRIBE, getSocialProfileUnSubscribeAPI);
}

/* Create Sagas method for Leader List */
export function* getLeaderListSagas() {
    yield takeEvery(GET_LEADER_LIST, getLeaderListAPI);
}

/* Create Sagas method for Follower List */
export function* getFollowerListSagas() {
    yield takeEvery(GET_FOLLOWER_LIST, getFollowerListAPI);
}

/* Create Sagas method for Get Leader Follow By ID */
export function* getLeaderFollowByIDSagas() {
    yield takeEvery(GET_LEADER_FOLLOW_BY_ID, getLeaderFollowByIDAPI);
}

/* Create Sagas method for Get Leader Follow By ID */
export function* unFollowLeaderSagas() {
    yield takeEvery(UNFOLLOW_LEADER, unFollowLeaderAPI);
}

/* Create Sagas method for Add Watchlist Group */
export function* addWatchlistGroupSagas() {
    yield takeEvery(ADD_WATCHLIST_GROUP, addWatchlistGroupAPI);
}

/* Create Sagas method for Add Watchlist */
export function* addWatchlistSagas() {
    yield takeEvery(ADD_WATCHLIST, addWatchlistAPI);
}

/* Create Sagas method for Remove Watchlist */
export function* removeWatchlistSagas() {
    yield takeEvery(REMOVE_WATCHLIST, removeWatchlistAPI);
}

/* Create Sagas method for Get Watchlist */
export function* getWatchlistSagas() {
    yield takeEvery(GET_WATCHLIST, getWatchlistAPI);
}

/* Create Sagas method for Get Leader Watchlist */
export function* getLeaderWatchlistSagas() {
    yield takeEvery(GET_LEADER_WATCH_LIST, getLeaderWatchlistAPI);
}


/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getLeaderConfigSagas),
        fork(editLeaderConfigSagas),
        fork(getFollowerConfigSagas),
        fork(editFollowerConfigSagas),
        fork(getSocialProfileSubscriptionSagas),
        fork(getSocialProfileSubscribeSagas),
        fork(getSocialProfileUnSubscribeSagas),
        fork(getLeaderListSagas),
        fork(getFollowerListSagas),
        fork(getLeaderFollowByIDSagas),
        fork(unFollowLeaderSagas),
        fork(addWatchlistGroupSagas),
        fork(addWatchlistSagas),
        fork(removeWatchlistSagas),
        fork(getWatchlistSagas),
        fork(getLeaderWatchlistSagas),
    ]);
}