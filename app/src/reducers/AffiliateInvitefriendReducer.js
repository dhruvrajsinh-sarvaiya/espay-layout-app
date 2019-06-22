// Action types for Affiliate Invite Friend
import {
    // Action Logout
    ACTION_LOGOUT,

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

    CLEAR_AFFILIATE_INVITE_DATA,

} from '../actions/ActionTypes'

// Initial state for Affiliate Invite Friend
const initialState = {
    // Invite Link
    loading: false,
    inviteLink: null,
    inviteLinkFetch: true,

    // Send Email
    isSendingEmail: false,
    emailSendData: null,
    emailSendingDataFetch: true,

    // Send SMS
    isSendingSms: false,
    smsSendData: null,
    smsSendingDataFetch: true,
}

export default function AffiliateInvitefriendReducer(state = initialState, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle affiliate invite link method data
        case GET_AFFILIATE_INVITE_LINK:
            return {
                ...state,
                loading: true,
                inviteLink: null,
                inviteLinkFetch: true,
                emailSendingDataFetch: true,
                smsSendingDataFetch: true,
            }
        // Set affiliate invite link success data
        case GET_AFFILIATE_INVITE_LINK_SUCCESS:
            return {
                ...state,
                loading: false,
                inviteLink: action.data,
                inviteLinkFetch: false,
                emailSendingDataFetch: true,
                smsSendingDataFetch: true,
            }
        // Set affiliate invite link failure data
        case GET_AFFILIATE_INVITE_LINK_FAILURE:
            return {
                ...state,
                loading: false,
                inviteLink: null,
                inviteLinkFetch: false,
                emailSendingDataFetch: true,
                smsSendingDataFetch: true,
            }

        // Handle Email method data using affiliate invite
        case AFFILIATE_INVITE_BY_EMAIL:
            return {
                ...state,
                isSendingEmail: true,
                emailSendData: null,
                emailSendingDataFetch: true,
                inviteLinkFetch: true,
                smsSendingDataFetch: true,
            }
        // Set Email success data using affiliate invite
        case AFFILIATE_INVITE_BY_EMAIL_SUCCESS:
            return {
                ...state,
                isSendingEmail: false,
                emailSendData: action.data,
                emailSendingDataFetch: false,
                inviteLinkFetch: true,
                smsSendingDataFetch: true,
            }
        // Set Email failure data using affiliate invite        
        case AFFILIATE_INVITE_BY_EMAIL_FAILURE:
            return {
                ...state,
                isSendingEmail: false,
                emailSendData: null,
                emailSendingDataFetch: false,
                inviteLinkFetch: true,
                smsSendingDataFetch: true,
            }

        // Handle SMS method data using affiliate invite
        case AFFILIATE_INVITE_BY_SMS:
            return {
                ...state,
                isSendingSms: true,
                smsSendData: null,
                smsSendingDataFetch: true,
                inviteLinkFetch: true,
                emailSendingDataFetch: true,
            }
        // Set SMS success data using affiliate invite
        case AFFILIATE_INVITE_BY_SMS_SUCCESS:
            return {
                ...state,
                isSendingSms: false,
                smsSendData: action.data,
                smsSendingDataFetch: false,
                inviteLinkFetch: true,
                emailSendingDataFetch: true,
            }
        // Set SMS failure data using affiliate invite        
        case AFFILIATE_INVITE_BY_SMS_FAILURE:
            return {
                ...state,
                isSendingSms: false,
                smsSendData: null,
                smsSendingDataFetch: false,
                inviteLinkFetch: true,
                emailSendingDataFetch: true,
            }
        // Clear affiliate invite data
        case CLEAR_AFFILIATE_INVITE_DATA: {
            return initialState;
        }
        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}