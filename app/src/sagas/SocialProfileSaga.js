import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../selector';
import { swaggerGetAPI, swaggerPostAPI, slowInternetStaticResponse } from '../api/helper';
import { Method } from '../controllers/Constants';
import { GET_SOCIAL_PROFILE_SUBSCRIPTION, SOCIAL_PROFILE_SUBSCRIBE, SOCIAL_PROFILE_UNSUBSCRIBE, ADD_LEADER_CONFIG, GET_LEADER_FOLLOW_BY_ID, EDIT_FOLLOWER_CONFIG, GET_LEADER_LIST, UNFOLLOW_LEADER, GET_LEADER_CONFIG, GET_FOLLOWER_LIST, GET_GROUP_LIST, ADD_NEW_WATCH_LIST, ADD_TO_WATCH_LIST, REMOVE_FROM_WATCH_LIST, GET_LEADER_WATCH_LIST, GET_SOCIAL_PROFILE_TOP_GAINER_LIST, GET_SOCIAL_PROFILE_TOP_LOSER_LIST, GET_SOCIAL_PROFILE_TOP_LEADER_LIST, GET_LEADER_PORTFOLIO_LIST, GET_HISTORICAL_PERFORM_CHART } from '../actions/ActionTypes';
import { getSocialProfileSubscriptionSuccess, getSocialProfileSubscriptionFailure, getSocialProfileSubscribeSuccess, getSocialProfileSubscribeFailure, getSocialProfileUnSubscribeSuccess, getSocialProfileUnSubscribeFailure, addLeaderConfigSuccess, addLeaderConfigFailure, getLeaderFollowByIdSuccess, getLeaderFollowByIdFailure, editFollowerConfigSuccess, editFollowerConfigFailure, getLeaderListSuccess, getLeaderListFailure, unFollowLeaderSuccess, unFollowLeaderFailure, getLeaderConfigSuccess, getLeaderConfigFailure, getFollowerListSuccess, getFollowerListFailure, removeFromWatchListSuccess, removeFromWatchListFailure, addToWatchListSuccess, addToWatchListFailure, addNewWatchListSuccess, addNewWatchListFailure, getGroupListSuccess, getGroupListFailure, getLeaderWatchlistSuccess, getLeaderWatchlistFailure, getSocialProfileTopGainerListSuccess, getSocialProfileTopGainerListFailure, getSocialProfileTopLoserListSuccess, getSocialProfileTopLoserListFailure, getSocialProfileTopLeaderListSuccess, getSocialProfileTopLeaderListFailure, getLeaderPortfolioListSuccess, getLeaderPortfolioListFailure, getHistoricalPerformChartSuccess, getHistoricalPerformChartFailure } from '../actions/SocialProfile/SocialProfileActions';
import { getIPAddress, } from '../controllers/CommonUtils';

export default function* SocialProfileSaga() {
    // Get Social Profile Subscription (Leader and Follower)
    yield takeEvery(GET_SOCIAL_PROFILE_SUBSCRIPTION, getSocialProfileSubscriptionAPI);
    // Social Profile Subscribe
    yield takeEvery(SOCIAL_PROFILE_SUBSCRIBE, getSocialProfileSubscribeAPI);
    // Socail Profile UnSubscribe
    yield takeEvery(SOCIAL_PROFILE_UNSUBSCRIBE, getSocialProfileUnSubscribeAPI);
    // Add Leader Configuration
    yield takeEvery(ADD_LEADER_CONFIG, addLeaderConfigAPI);
    // Leader Follow By Id
    yield takeEvery(GET_LEADER_FOLLOW_BY_ID, getLeaderFollowById);
    // Edit Follower Configuration
    yield takeEvery(EDIT_FOLLOWER_CONFIG, editFollowerConfig);
    // Leader List
    yield takeEvery(GET_LEADER_LIST, getLeaderListAPI);
    // Unfollow Leader
    yield takeEvery(UNFOLLOW_LEADER, unFollowLeaderAPI);
    //get leader config
    yield takeEvery(GET_LEADER_CONFIG, getLeaderConfigAPI);
    // follower List
    yield takeEvery(GET_FOLLOWER_LIST, getFollowerListAPI);
    //get group list
    yield takeEvery(GET_GROUP_LIST, getGroupList);
    //add group list
    yield takeEvery(ADD_NEW_WATCH_LIST, addWatchListItem);
    // item add to watch list
    yield takeEvery(ADD_TO_WATCH_LIST, addToWatchList);
    // item remove from watch list
    yield takeEvery(REMOVE_FROM_WATCH_LIST, removeFromWatchList);
    // get My watcher list
    yield takeEvery(GET_LEADER_WATCH_LIST, getLeaderWatchlistAPI);
    // get top gainer list
    yield takeEvery(GET_SOCIAL_PROFILE_TOP_GAINER_LIST, getTopGainerList);
    // get top loser list
    yield takeEvery(GET_SOCIAL_PROFILE_TOP_LOSER_LIST, getTopLoserList);
    // get top leader list
    yield takeEvery(GET_SOCIAL_PROFILE_TOP_LEADER_LIST, getTopLeaderList);
    // get Portfolio list
    yield takeEvery(GET_LEADER_PORTFOLIO_LIST, getLeaderPortfolioListAPI);
    // get Historical Performance Chart 
    yield takeEvery(GET_HISTORICAL_PERFORM_CHART, getHistoricalPerformChart);
}

// Generator for Historical Performance Chart 
function* getHistoricalPerformChart({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Historical Performance Chart api
        const data = yield call(swaggerGetAPI, Method.GetHistoricalPerformance + '/' + payload.LeaderId, {}, headers);

        // To set Historical Performance Chart success response to reducer
        yield put(getHistoricalPerformChartSuccess(data));
    } catch (error) {
        // To set Historical Performance Chart failure response to reducer
        yield put(getHistoricalPerformChartFailure());
    }
}

//Function for Get Leader Portfolio List API
function* getLeaderPortfolioListAPI({ data }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request
        let obj = {
            PageNo: data.PageNo,
            PageSize: data.PageSize,
        }

        // FromDate is not undefine and empty
        if (data.FromDate !== undefined && data.FromDate !== '') {
            obj = {
                ...obj,
                FromDate: data.FromDate
            }
        }

        // ToDate is not undefine and empty
        if (data.ToDate !== undefined && data.ToDate !== '') {
            obj = {
                ...obj,
                ToDate: data.ToDate
            }
        }

        // Pair is not undefine and empty
        if (data.Pair !== undefined && data.Pair !== '') {
            obj = {
                ...obj,
                Pair: data.Pair
            }
        }

        // TrnType is not undefine and empty
        if (data.TrnType !== undefined && data.TrnType !== '') {
            obj = {
                ...obj,
                TrnType: data.TrnType
            }
        }

        // To call Leader Portfolio List api
        const response = yield call(swaggerPostAPI, Method.GetCopiedLeaderOrders, obj, headers);

        // To set Leader Portfolio List success response to reducer
        yield put(getLeaderPortfolioListSuccess(response));
    } catch (error) {
        // To set Leader Portfolio List failure response to reducer
        yield put(getLeaderPortfolioListFailure());
    }
}

// Generator for Top Leader List
function* getTopLeaderList({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Top Leader List api
        const data = yield call(swaggerGetAPI, Method.TopLeadersList, {}, headers);

        // To set Social Profile Top Leader List success response to reducer
        yield put(getSocialProfileTopLeaderListSuccess(data));
    } catch (error) {
        // To set Social Profile Top Leader List failure response to reducer
        yield put(getSocialProfileTopLeaderListFailure());
    }
}

// Generator for Top Loser List
function* getTopLoserList({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Top Loser List api
        const data = yield call(swaggerGetAPI, Method.TopProfitLoser + '/' + payload.curDate + '/' + payload.limit, {}, headers);

        // To set Social Profile Top Loser List success response to reducer
        yield put(getSocialProfileTopLoserListSuccess(data));
    } catch (error) {
        // To set Social Profile Top Loser List failure response to reducer
        yield put(getSocialProfileTopLoserListFailure());
    }
}

// Generator for Top Gainer List
function* getTopGainerList({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Top Gainer List api
        const data = yield call(swaggerGetAPI, Method.TopProfitGainer + '/' + payload.curDate + '/' + payload.limit, {}, headers);

        // To set Top Gainer List success response to reducer
        yield put(getSocialProfileTopGainerListSuccess(data));
    } catch (error) {
        // To set Top Gainer List failure response to reducer
        yield put(getSocialProfileTopGainerListFailure());
    }
}

// Generator for item add to Watch list 
function* removeFromWatchList({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            // To set Remove From Watch List success response to reducer
            yield put(removeFromWatchListSuccess(slowInternetStaticResponse()));
        } else {

            //to get tokenID of currently logged in user.
            let token = yield select(userAccessToken);
            var headers = { 'Authorization': token }

            // To call remove from watchlist api
            const data = yield call(swaggerPostAPI, Method.UnFollowWatch, payload, headers);

            // To set Remove From Watch List success response to reducer
            yield put(removeFromWatchListSuccess(data));
        }
    } catch (error) {
        // To set Remove From Watch List failure response to reducer
        yield put(removeFromWatchListFailure());
    }
}

// Generator for item add to Watch list 
function* addToWatchList({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            yield put(addToWatchListSuccess(slowInternetStaticResponse()));
        } else {

            //to get tokenID of currently logged in user.
            let token = yield select(userAccessToken);
            var headers = { 'Authorization': token }

            // To call Add to Watchlist api
            const data = yield call(swaggerPostAPI, Method.AddWatch, payload, headers);

            // To set Add to Watchlist success response to reducer
            yield put(addToWatchListSuccess(data));
        }
    } catch (error) {
        // To set Add to Watchlist failure response to reducer
        yield put(addToWatchListFailure());
    }
}

// Generator for Add Watch(group) list item
function* addWatchListItem({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);
        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            // To set Add Watchlist Item success response to reducer
            yield put(addNewWatchListSuccess(slowInternetStaticResponse()));
        } else {
            //to get tokenID of currently logged in user.
            let token = yield select(userAccessToken);
            var headers = { 'Authorization': token }

            // To call Add Watchlist api
            const data = yield call(swaggerPostAPI, Method.AddGroup, payload, headers);

            // To set Add Watchlist Item success response to reducer
            yield put(addNewWatchListSuccess(data));
        }
    } catch (error) {
        // To set Add Watchlist Item failure response to reducer
        yield put(addNewWatchListFailure());
    }
}

//Function for Get Group List API
function* getGroupList() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Group List api
        const data = yield call(swaggerGetAPI, Method.GetGroupList, {}, headers);

        // To set Group List success response to reducer
        yield put(getGroupListSuccess(data));
    } catch (error) {
        // To set Group List failure response to reducer
        yield put(getGroupListFailure());
    }
}

/* Generator for Add Leader Configuration API */
function* addLeaderConfigAPI({ payload }) {
    try {
        // To get IP Address
        payload.IPAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.IPAddress === '') {
            // To set Add Leader Configuration success response to reducer
            yield put(addLeaderConfigSuccess(slowInternetStaticResponse()));
        } else {

            //to get tokenID of currently logged in user.
            let token = yield select(userAccessToken);
            var headers = { 'Authorization': token }

            // To call Add Leader Configuration api
            const data = yield call(swaggerPostAPI, Method.SetLeaderFrontProfile, payload, headers);

            // To set Add Leader Configuration success response to reducer
            yield put(addLeaderConfigSuccess(data));
        }
    } catch (error) {
        // To set Add Leader Configuration failure response to reducer
        yield put(addLeaderConfigFailure());
    }
}

//  Generator for Get Social Profile UnSubscribe API
function* getSocialProfileUnSubscribeAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Social Profile Unsubscribe api
        const response = yield call(swaggerPostAPI, Method.UnsibscribeSocialProfile + '/' + payload, {}, headers);

        // To set Social Profile Unsubscribe success response to reducer
        yield put(getSocialProfileUnSubscribeSuccess(response));
    } catch (error) {
        // To set Social Profile Unsubscribe failure response to reducer
        yield put(getSocialProfileUnSubscribeFailure());
    }
}


//Function for Get Social Profile Subscribe API
function* getSocialProfileSubscribeAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Social Profile Subscribe api
        const response = yield call(swaggerPostAPI, Method.SubscribSocialProfile + '/' + payload, {}, headers);

        // To set Social Profile Subscribe success response to reducer
        yield put(getSocialProfileSubscribeSuccess(response));
    } catch (error) {
        // To set Social Profile Subscribe failure response to reducer
        yield put(getSocialProfileSubscribeFailure());
    }
}

// Generator for Get Social Profile Subscription API
function* getSocialProfileSubscriptionAPI() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Social Profile Subscription api
        const data = yield call(swaggerGetAPI, Method.GetSocialProfile, {}, headers);

        // To set Social Profile Subscription success response to reducer
        yield put(getSocialProfileSubscriptionSuccess(data));
    } catch (error) {
        // To set Social Profile Subscription failure response to reducer
        yield put(getSocialProfileSubscriptionFailure());
    }
}

// Generator for Leader follow by Id
function* getLeaderFollowById({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Leader Follow By Id api
        const response = yield call(swaggerGetAPI, Method.GetFollowerFrontProfileConfiguration + '/' + payload.LeaderId, {}, headers);
        
        // To set Leader Follow By Id success response to reducer
        yield put(getLeaderFollowByIdSuccess(response));
    } catch (error) {
        // To set Leader Follow By Id failure response to reducer
        yield put(getLeaderFollowByIdFailure());
    }
}

// Generator for Edit Follower Configuration
function* editFollowerConfig({ payload }) {
    try {
        // To get IP Address
        payload.ipAddress = yield call(getIPAddress);

        //If ip address is empty than show static slow internet dialog
        if (payload.ipAddress === '') {
            // To set Edit Follower Configuration success response to reducer
            yield put(editFollowerConfigSuccess(slowInternetStaticResponse()));
        } else {
            //to get tokenID of currently logged in user.
            let token = yield select(userAccessToken);
            var headers = { 'Authorization': token }

            // To call Edit Follower Configuration api
            const response = yield call(swaggerPostAPI, Method.SetFollowerFrontProfile, payload, headers);

            // To set Edit Follower Configuration success response to reducer
            yield put(editFollowerConfigSuccess(response));
        }
    } catch (error) {
        // To set Edit Follower Configuration failure response to reducer
        yield put(editFollowerConfigFailure());
    }
}

//Function for Get Leader List API
function* getLeaderListAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Leader List api
        const response = yield call(swaggerGetAPI, Method.GetLeaderList + '/' + payload.PageIndex + '/' + payload.Page_Size, {}, headers);
        
        // To set Leader List success response to reducer
        yield put(getLeaderListSuccess(response));
    } catch (error) {
        // To set Leader List failure response to reducer
        yield put(getLeaderListFailure());
    }
}

// Generator for UnFollow Leader
function* unFollowLeaderAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Unfollow Leader api
        const response = yield call(swaggerPostAPI, Method.UnFollow + '?LeaderId=' + payload.LeaderId, {}, headers);

        // To set Unfollow Leader Api success response to reducer
        yield put(unFollowLeaderSuccess(response));
    } catch (error) {
        // To set Unfollow Leader Api failure response to reducer
        yield put(unFollowLeaderFailure());
    }
}

//Function for Get Leader Configuration API
function* getLeaderConfigAPI() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Leader Configuration api
        const response = yield call(swaggerGetAPI, Method.GetLeaderFrontProfileConfiguration, {}, headers);

        // To set Leader Configuration success response to reducer
        yield put(getLeaderConfigSuccess(response));
    } catch (error) {
        // To set Leader Configuration failure response to reducer
        yield put(getLeaderConfigFailure(error));
    }
}

//Function for Get Follower List API
function* getFollowerListAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Follower List api
        const response = yield call(swaggerGetAPI, Method.GetLeaderWiseFollowerConfig + '/' + payload.PageIndex + '/' + payload.Page_Size, {}, headers);
        
        // To set Follower List success response to reducer
        yield put(getFollowerListSuccess(response));
    } catch (error) {
        // To set Follower List failure response to reducer
        yield put(getFollowerListFailure());
    }
}

//Function for Get Leader Watchlist API
function* getLeaderWatchlistAPI({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call Leader Watchlist api
        const response = yield call(swaggerGetAPI, Method.GetWatcherWiseLeaderList + '/' + payload.PageIndex + '/' + payload.Page_Size + '/' + payload.GroupId, payload, headers);
        
        // To set Leader Watchlist success response to reducer
        yield put(getLeaderWatchlistSuccess(response));
    } catch (error) {
        // To set Leader Watchlist failure response to reducer
        yield put(getLeaderWatchlistFailure());
    }
}






