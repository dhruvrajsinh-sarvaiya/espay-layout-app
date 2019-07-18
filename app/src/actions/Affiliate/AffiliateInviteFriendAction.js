import {
    // Get Affiliate Invite Link
    GET_AFFILIATE_INVITE_LINK,
    GET_AFFILIATE_INVITE_LINK_SUCCESS,
    GET_AFFILIATE_INVITE_LINK_FAILURE,

    // Affiliate Invite By Email
    AFFILIATE_INVITE_BY_EMAIL,
    AFFILIATE_INVITE_BY_EMAIL_SUCCESS,
    AFFILIATE_INVITE_BY_EMAIL_FAILURE,

    // Affiliate Invite By Sms
    AFFILIATE_INVITE_BY_SMS,
    AFFILIATE_INVITE_BY_SMS_SUCCESS,
    AFFILIATE_INVITE_BY_SMS_FAILURE,

    // Clear Affiliate Invite Data
    CLEAR_AFFILIATE_INVITE_DATA,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to Get Affiliate Invite Link
export function getAffiliateInviteLink() {
    return action(GET_AFFILIATE_INVITE_LINK)
}
// Redux action to Get Affiliate Invite Link Success
export function getAffiliateInviteLinkSuccess(data) {
    return action(GET_AFFILIATE_INVITE_LINK_SUCCESS, { data })
}
// Redux action to Get Affiliate Invite Link Failure
export function getAffiliateInviteLinkFailure() {
    return action(GET_AFFILIATE_INVITE_LINK_FAILURE)
}

// Redux action to Get Affiliate Invite Link By Email 
export function shareAffiliateInviteLinkByEmail(payload) {
    return action(AFFILIATE_INVITE_BY_EMAIL, { payload })
}
// Redux action to Get Affiliate Invite Link By Email Success
export function shareAffiliateInviteLinkByEmailSuccess(data) {
    return action(AFFILIATE_INVITE_BY_EMAIL_SUCCESS, { data })
}
// Redux action to Get Affiliate Invite Link By Email Failure
export function shareAffiliateInviteLinkByEmailFailure() {
    return action(AFFILIATE_INVITE_BY_EMAIL_FAILURE)
}

// Redux action to Get Affiliate Invite Link By SMS  
export function shareAffiliateInviteLinkBySMS(payload) {
    return action(AFFILIATE_INVITE_BY_SMS, { payload })
}
// Redux action to Get Affiliate Invite Link By SMS Success
export function shareAffiliateInviteLinkBySMSSuccess(data) {
    return action(AFFILIATE_INVITE_BY_SMS_SUCCESS, { data })
}
// Redux action to Get Affiliate Invite Link By SMS Failure
export function shareAffiliateInviteLinkBySMSFailure() {
    return action(AFFILIATE_INVITE_BY_SMS_FAILURE)
}

// To Clear data
export function clearAffiliateInviteData() {
    return action(CLEAR_AFFILIATE_INVITE_DATA)
}