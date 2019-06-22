import { all, call, fork, put, takeLatest, select } from "redux-saga/effects";
import { GET_MEMBERSHIP_LEVEL } from "../actions/ActionTypes";
// import functions from action
import { getMembershipLevelSuccess, getMembershipLevelFailure } from "../actions/account/MembershipLevelAction";
import { Method } from "../controllers/Constants";
import { userAccessToken } from "../selector";
import { swaggerGetAPI } from "../api/helper";

export default function* MembershipLevelSaga() {
	// To register Membership Level method
	yield all([fork(getMembershipLevel)]);
}

function* getMembershipLevel() {
	yield takeLatest(GET_MEMBERSHIP_LEVEL, getMembershipLevelData);
}

//for memmbershiplevel data
function* getMembershipLevelData() {
	try {

		//to get tokenID of currently logged in user.
		let token = yield select(userAccessToken);
		var headers = { 'Authorization': token }

		// To call Membership Level Data Api
		const response = yield call(swaggerGetAPI, Method.GetProfileData, {}, headers);

		// To set Memebership Level success response to reducer
		yield put(getMembershipLevelSuccess(response));
	} catch (error) {
		// To set Memebership Level failure response to reducer
		yield put(getMembershipLevelFailure(error));
	}
}