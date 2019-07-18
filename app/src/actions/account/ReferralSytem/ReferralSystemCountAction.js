import { action } from '../../GlobalActions';
import {
    // Get Referral Invite List
    GET_REFERRAL_INVITES_LIST,
    GET_REFERRAL_INVITES_LIST_SUCCESS,
    GET_REFERRAL_INVITES_LIST_FAILURE,

    // Get Referral Email List
    GET_REFERRAL_EMAIL_LIST,
    GET_REFERRAL_EMAIL_LIST_SUCCESS,
    GET_REFERRAL_EMAIL_LIST_FAILURE,

    // Get Referral Participant List
    GET_REFERRAL_PARTICIPANT_LIST,
    GET_REFERRAL_PARTICIPANT_LIST_SUCCESS,
    GET_REFERRAL_PARTICIPANT_LIST_FAILURE,

    // Get Referral Click List
    GET_REFERRAL_CLICKS_LIST,
    GET_REFERRAL_CLICKS_LIST_SUCCESS,
    GET_REFERRAL_CLICKS_LIST_FAILURE,

    // Get Referral Converts List
    GET_REFERRAL_CONVERTS_LIST,
    GET_REFERRAL_CONVERTS_LIST_SUCCESS,
    GET_REFERRAL_CONVERTS_LIST_FAILURE,
    CLEAR_ALL_REFERRAL_DATA,
} from '../../ActionTypes';

// Redux action to Get Referral Invites List
export function getReferralInvitesList(data) {
    return action(GET_REFERRAL_INVITES_LIST,{data})
}
// Redux action to Get Referral Invites List Success
export function getReferralInvitesListSuccess(data) {
    return action(GET_REFERRAL_INVITES_LIST_SUCCESS, { data })
}
// Redux Action To Get Referral Invites List 
export function getReferralInvitesListFailure() {
    return action(GET_REFERRAL_INVITES_LIST_FAILURE)
}

// Redux Action To Get Referral Email List
export function getReferralEmailList(data) {
    return action(GET_REFERRAL_EMAIL_LIST,{data})
}
// Redux Action To Get Referral Email List Success
export function getReferralEmailListSuccess(data) {
    return action(GET_REFERRAL_EMAIL_LIST_SUCCESS, { data })
}
// Redux Action To Get Referral Email List Failure
export function getReferralEmailListFailure() {
    return action(GET_REFERRAL_EMAIL_LIST_FAILURE)
}

// Redux Action To Get Referral Participant List
export function getReferralParticipantList(data) {
    return action(GET_REFERRAL_PARTICIPANT_LIST,{data})
}
// Redux Action To Get Referral Participant List Success
export function getReferralParticipantListSuccess(data) {
    return action(GET_REFERRAL_PARTICIPANT_LIST_SUCCESS, { data })
}
// Redux Action To Get Referral Participant List Failure
export function getReferralParticipantListFailure() {
    return action(GET_REFERRAL_PARTICIPANT_LIST_FAILURE)
}

// Redux Action To Get Referral Clicks List
export function getReferralClicksList(data) {
    return action(GET_REFERRAL_CLICKS_LIST,{data})
}
// Redux Action To Get Referral Clicks List Success
export function getReferralClicksListSuccess(data) {
    return action(GET_REFERRAL_CLICKS_LIST_SUCCESS, { data })
}
// Redux Action To Get Referral Clicks List Failure
export function getReferralClicksListFailure() {
    return action(GET_REFERRAL_CLICKS_LIST_FAILURE)
}

// Redux Action To Get Referral Converts List
export function getReferralConvertList(data) {
    return action(GET_REFERRAL_CONVERTS_LIST,{data})
}
// Redux Action To Get Referral Converts List Success
export function getReferralConvertListSuccess(data) {
    return action(GET_REFERRAL_CONVERTS_LIST_SUCCESS, { data })
}
// Redux Action To Get Referral Converts List Failure
export function getReferralConvertListFailure() {
    return action(GET_REFERRAL_CONVERTS_LIST_FAILURE)
}

// Redux Action To Clear Referral Data
export function clearAllData(){
    return action(CLEAR_ALL_REFERRAL_DATA)
}