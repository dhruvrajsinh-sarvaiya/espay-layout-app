import {
    //get referral system 
    GET_REFERAL_SYSTEM_DATA,
    GET_REFERAL_SYSTEM_DATA_SUCCESS,
    GET_REFERAL_SYSTEM_DATA_FAILURE,

    //get referral invites 
    GET_REFERAL_INVITES_DATA,
    GET_REFERAL_INVITES_DATA_SUCCESS,
    GET_REFERAL_INVITES_DATA_FAILURE,

} from '../ActionTypes';
import { action } from '../GlobalActions';

// --------------- for Referral System data--------------
//To fetch data
export function getReferalSystemData() {
    return action(GET_REFERAL_SYSTEM_DATA)
}

//On success result
export function getReferalSystemDataSuccess(data) {
    return action(GET_REFERAL_SYSTEM_DATA_SUCCESS, { data })
}

//On Failure
export function getReferalSystemDataFailure() {
    return action(GET_REFERAL_SYSTEM_DATA_FAILURE)
}

// --------------- for Referral Invites data--------------
//To fetch data
export function getReferralInvitesData(data) {
    return action(GET_REFERAL_INVITES_DATA, { data })
}

//On success result
export function getReferralInvitesDataSuccess(data) {
    return action(GET_REFERAL_INVITES_DATA_SUCCESS, { data })
}

//On Failure
export function getReferralInvitesDataFailure() {
    return action(GET_REFERAL_INVITES_DATA_FAILURE)
}