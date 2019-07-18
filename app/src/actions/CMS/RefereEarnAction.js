import {
	// Get Estimated Commission Success
	GET_ENSTIMATED_COMMISSION,
	GET_ENSTIMATED_COMMISSION_SUCCESS,
	GET_ENSTIMATED_COMMISSION_FAILURE,

	// Get Referral Channel User Count
	GET_REFERRAL_CHANNEL_USER_COUNT,
	GET_REFERRAL_CHANNEL_USER_COUNT_SUCCESS,
	GET_REFERRAL_CHANNEL_USER_COUNT_FAILURE,

	// Get Referral Url
	GET_REFERRAL_URL,
	GET_REFERRAL_URL_SUCCESS,
	GET_REFERRAL_URL_FAILURE,

	// Get Referral Service Description
	GET_REFERRAL_SERVICE_DESCRIPTION,
	GET_REFERRAL_SERVICE_DESCRIPTION_SUCCESS,
	GET_REFERRAL_SERVICE_DESCRIPTION_FAILURE,

	// Get Referral Code
	GET_REFERRAL_CODE,
	GET_REFERRAL_CODE_SUCCESS,
	GET_REFERRAL_CODE_FAILURE,

	// Referral Email Send
	REFERRAL_EMAIL_SEND,
	REFERRAL_EMAIL_SEND_SUCCESS,
	REFERRAL_EMAIL_SEND_FAILURE,

	// Referral Sms Send
	REFERRAL_SMS_SEND,
	REFERRAL_SMS_SEND_SUCCESS,
	REFERRAL_SMS_SEND_FAILURE,

	// Clear Send Data
	CLEAR_SEND_DATA,

	// Clear Referral Data
	CLEAR_REFERRAL_DATA
} from '../ActionTypes'
import { action } from '../GlobalActions';

//  Redux Action Get GET_ENSTIMATED_COMMISSION
export function getEnsitmatedCommissionValue(request) {
	return action(GET_ENSTIMATED_COMMISSION, { request })
}
//  Redux Action Get GET_ENSTIMATED_COMMISSION Success
export function getEnsitmatedCommissionValueSuccess(response) {
	return action(GET_ENSTIMATED_COMMISSION_SUCCESS, { response })
}
//  Redux Action Get GET_ENSTIMATED_COMMISSION Failure
export function getEnsitmatedCommissionValueFailure(response) {
	return action(GET_ENSTIMATED_COMMISSION_FAILURE, { response })
}

//  Redux Action Get GET_REFERRAL_CHANNEL_USER_COUNT
export function getReferralChannelUserCount() {
	return action(GET_REFERRAL_CHANNEL_USER_COUNT)
}
//  Redux Action GET_REFERRAL_CHANNEL_USER_COUNT Success
export function getReferralChannelUserCountSuccess(response) {
	return action(GET_REFERRAL_CHANNEL_USER_COUNT_SUCCESS, { response })
}
//  Redux Action Get GET_REFERRAL_CHANNEL_USER_COUNT Failure
export function getReferralChannelUserCountFailure(error) {
	return action(GET_REFERRAL_CHANNEL_USER_COUNT_FAILURE, { error })
}

// Redux Action to Get Referral Url
export function getReferralUrls() {
	return action(GET_REFERRAL_URL)
}
// Redux Action to Get Referral Url Success
export function getReferralUrlSuccess(response) {
	return action(GET_REFERRAL_URL_SUCCESS, { response })
}
// Redux Action to Get Referral Url Failure
export function getReferralUrlFailure(error) {
	return action(GET_REFERRAL_URL_FAILURE, { error })
}

// Redux Action to Get Referral Description
export function getReferralDescriptionData() {
	return action(GET_REFERRAL_SERVICE_DESCRIPTION)
}
// Redux Action to Get Referral Description Success
export function getReferralDescriptionDataSuccess(response) {
	return action(GET_REFERRAL_SERVICE_DESCRIPTION_SUCCESS, { response })
}
// Redux Action to Get Referral Description Failure
export function getReferralDescriptionDataFailure(error) {
	return action(GET_REFERRAL_SERVICE_DESCRIPTION_FAILURE, { error })
}

// Redux Action to Get Referral Code
export function getReferralCode() {
	return action(GET_REFERRAL_CODE)
}
// Redux Action to Get Referral Code Success
export function getReferralCodeSuccess(response) {
	return action(GET_REFERRAL_CODE_SUCCESS, { response })
}
// Redux Action to Get Referral Code Failure
export function getReferralCodeFailure(error) {
	return action(GET_REFERRAL_CODE_FAILURE, { error })
}

// Redux Action to Get Referral Email
export function getReferralEmailData(request) {
	return action(REFERRAL_EMAIL_SEND, { request })
}
// Redux Action to Get Referral Email Success
export function getReferralEmailDataSuccess(response) {
	return action(REFERRAL_EMAIL_SEND_SUCCESS, { response })
}
// Redux Action to Get Referral Email Failure
export function getReferralEmailDataFailure(error) {
	return action(REFERRAL_EMAIL_SEND_FAILURE, { error })
}

// Redux Action to Get Referral SMS
export function getReferralSmsData(request) {
	return action(REFERRAL_SMS_SEND, { request })
}
// Redux Action to Get Referral SMS Success
export function getReferralSmsDataSuccess(response) {
	return action(REFERRAL_SMS_SEND_SUCCESS, { response })
}
// Redux Action to Get Referral SMS Failure
export function getReferralSmsDataFailure(error) {
	return action(REFERRAL_SMS_SEND_FAILURE, { error })
}

//on clear 
export function clearSendedData() {
	return action(CLEAR_SEND_DATA)
}

//for clear all Referral Data 
export function clearAllReferralData() {
	return action(CLEAR_REFERRAL_DATA)
}
