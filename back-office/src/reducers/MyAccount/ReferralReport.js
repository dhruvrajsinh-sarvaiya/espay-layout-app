/* 
    Developer : Bharat Jograna
    Date : 11-02-2019
    File Comment : MyAccount Referral Report Dashboard Reducer
*/
import {
    REFERRAL_SIGNUP_REPORT,
    REFERRAL_SIGNUP_REPORT_SUCCESS,
    REFERRAL_SIGNUP_REPORT_FAILURE,

    REFERRAL_BUY_TRADE_REPORT,
    REFERRAL_BUY_TRADE_REPORT_SUCCESS,
    REFERRAL_BUY_TRADE_REPORT_FAILURE,

    REFERRAL_SELL_TRADE_REPORT,
    REFERRAL_SELL_TRADE_REPORT_SUCCESS,
    REFERRAL_SELL_TRADE_REPORT_FAILURE,

    REFERRAL_DEPOSIT_REPORT,
    REFERRAL_DEPOSIT_REPORT_SUCCESS,
    REFERRAL_DEPOSIT_REPORT_FAILURE,

    REFERRAL_SEND_EMAIL_REPORT,
    REFERRAL_SEND_EMAIL_REPORT_SUCCESS,
    REFERRAL_SEND_EMAIL_REPORT_FAILURE,

    REFERRAL_SEND_SMS_REPORT,
    REFERRAL_SEND_SMS_REPORT_SUCCESS,
    REFERRAL_SEND_SMS_REPORT_FAILURE,

    REFERRAL_SHARE_ON_FACEBOOK_REPORT,
    REFERRAL_SHARE_ON_FACEBOOK_REPORT_SUCCESS,
    REFERRAL_SHARE_ON_FACEBOOK_REPORT_FAILURE,

    REFERRAL_SHARE_ON_TWITTER_REPORT,
    REFERRAL_SHARE_ON_TWITTER_REPORT_SUCCESS,
    REFERRAL_SHARE_ON_TWITTER_REPORT_FAILURE,

    REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT,
    REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT_SUCCESS,
    REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT_FAILURE,

} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    loading: false,
    SignupData: {},
    BuyTradeData: {},
    SellTradeData: {},
    DepositData: {},
    SendEmailData: {},
    SendSMSData: {},
    ShareOnFBData: {},
    ShareOnTwitData: {},
    ClickOnReferralLinkData: {},
    DataList: {}
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        //Referral Signup Report Configuration..
        case REFERRAL_SIGNUP_REPORT:
            return { ...state, loading: true, SignupData: {} };

        case REFERRAL_SIGNUP_REPORT_SUCCESS:
        case REFERRAL_SIGNUP_REPORT_FAILURE:
            return { ...state, loading: false, SignupData: action.payload };


        //Referral BuyTrade Report Configuration..
        case REFERRAL_BUY_TRADE_REPORT:
            return { ...state, loading: true, BuyTradeData: {} };

        case REFERRAL_BUY_TRADE_REPORT_SUCCESS:
        case REFERRAL_BUY_TRADE_REPORT_FAILURE:
            return { ...state, loading: false, BuyTradeData: action.payload };


        //Referral SellTrade Report Configuration..
        case REFERRAL_SELL_TRADE_REPORT:
            return { ...state, loading: true, SellTradeData: {} };

        case REFERRAL_SELL_TRADE_REPORT_SUCCESS:
        case REFERRAL_SELL_TRADE_REPORT_FAILURE:
            return { ...state, loading: false, SellTradeData: action.payload };


        //Referral Deposit Report Configuration..
        case REFERRAL_DEPOSIT_REPORT:
            return { ...state, loading: true, DepositData: {} };

        case REFERRAL_DEPOSIT_REPORT_SUCCESS:
        case REFERRAL_DEPOSIT_REPORT_FAILURE:
            return { ...state, loading: false, DepositData: action.payload };


        //Referral Signup Report Configuration..
        case REFERRAL_SEND_EMAIL_REPORT:
            return { ...state, loading: true, SendEmailData: {} };

        case REFERRAL_SEND_EMAIL_REPORT_SUCCESS:
        case REFERRAL_SEND_EMAIL_REPORT_FAILURE:
            return { ...state, loading: false, SendEmailData: action.payload };


        //Referral Signup Report Configuration..
        case REFERRAL_SEND_SMS_REPORT:
            return { ...state, loading: true, SendSMSData: {} };

        case REFERRAL_SEND_SMS_REPORT_SUCCESS:
        case REFERRAL_SEND_SMS_REPORT_FAILURE:
            return { ...state, loading: false, SendSMSData: action.payload };


        //Referral Signup Report Configuration..
        case REFERRAL_SHARE_ON_FACEBOOK_REPORT:
            return { ...state, loading: true, ShareOnFBData: {} };

        case REFERRAL_SHARE_ON_FACEBOOK_REPORT_SUCCESS:
        case REFERRAL_SHARE_ON_FACEBOOK_REPORT_FAILURE:
            return { ...state, loading: false, ShareOnFBData: action.payload };


        //Referral Signup Report Configuration..
        case REFERRAL_SHARE_ON_TWITTER_REPORT:
            return { ...state, loading: true, ShareOnTwitData: {} };

        case REFERRAL_SHARE_ON_TWITTER_REPORT_SUCCESS:
        case REFERRAL_SHARE_ON_TWITTER_REPORT_FAILURE:
            return { ...state, loading: false, ShareOnTwitData: action.payload };


        //Referral Signup Report Configuration..
        case REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT:
            return { ...state, loading: true, ClickOnReferralLinkData: {} };

        case REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT_SUCCESS:
        case REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT_FAILURE:
            return { ...state, loading: false, ClickOnReferralLinkData: action.payload };


        // Default Configuration
        default:
            return { ...state };
    }
};
