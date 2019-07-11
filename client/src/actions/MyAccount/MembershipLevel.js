/**
 * Auther : Kevin Ladani
 * Created : 14/09/2018
 * Membership Level Actions
 */

import {
	//For Membership Level
	MEMBERSHIP_LEVEL,
	MEMBERSHIP_LEVEL_SUCCESS,
	MEMBERSHIP_LEVEL_FAILURE,

} from "../types";

//For Membership Level
/**
 * Redux Action To Membership Level
 */

export const membershipLevel = (data) => ({
	type: MEMBERSHIP_LEVEL,
	payload : data
});

/**
 * Redux Action To Membership Level Success
 */
export const membershipLevelSuccess = (data) => ({
	type: MEMBERSHIP_LEVEL_SUCCESS,
	payload: data
});

/**
 * Redux Action To Membership Level Failure
 */
export const membershipLevelFailure = (error) => ({
	type: MEMBERSHIP_LEVEL_FAILURE,
	payload: error
});