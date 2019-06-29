/**
 * Author : Saloni Rathod
 * Created :07/03/2019
 * Display Affiliate Invite Friends reducers
*/
import {
    //For email promotion 
    AFFILIATE_EMAIL_PROMO,
    AFFILIATE_EMAIL_PROMO_SUCCESS,
    AFFILIATE_EMAIL_PROMO_FAILURE,
    //fOR SMS PROMOTION
    AFFILIATE_SMS_PROMO,
    AFFILIATE_SMS_PROMO_SUCCESS,
    AFFILIATE_SMS_PROMO_FAILURE,
    //FOR SOCIAL SHARING
    AFFILIATE_SOCIAL_SHARING_PROMO,
    AFFILIATE_SOCIAL_SHARING_PROMO_SUCCESS,
    AFFILIATE_SOCIAL_SHARING_PROMO_FAILURE,
    // FOR PROMOTION LINK
    GET_AFFILIATE_PROMOTION_LINK,
    GET_AFFILIATE_PROMOTION_LINK_SUCCESS,
    GET_AFFILIATE_PROMOTION_LINK_FAILURE
} from "Actions/types";

const INIT_STATE = {
    AffiliateEmailData: [],
    AffiliateSmsData: [],
    SocialSharingData: [],
    loading: false,
    smsloading: false,
    socialloading: false,
    PromotionLinkData: []
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {
        //For Afiiliate email promo
        case AFFILIATE_EMAIL_PROMO:
            return {
                ...state, loading: true, AffiliateEmailData: []
            };

        case AFFILIATE_EMAIL_PROMO_SUCCESS:
        case AFFILIATE_EMAIL_PROMO_FAILURE:
            return {
                ...state, loading: false, AffiliateEmailData: action.payload
            };

        //For  Affiliate sms promo
        case AFFILIATE_SMS_PROMO:
            return {
                ...state, smsloading: true, AffiliateSmsData: []
            };

        case AFFILIATE_SMS_PROMO_SUCCESS:
        case AFFILIATE_SMS_PROMO_FAILURE:
            return {
                ...state, smsloading: false, AffiliateSmsData: action.payload
            };



        //For  Affiliate social sharing Report
        case AFFILIATE_SOCIAL_SHARING_PROMO:
            return {
                ...state, loading: true, SocialSharingData: []
            };

        case AFFILIATE_SOCIAL_SHARING_PROMO_SUCCESS:
        case AFFILIATE_SOCIAL_SHARING_PROMO_FAILURE:
            return {
                ...state, loading: false, SocialSharingData: action.payload
            };



        //For  Affiliate PROMOTION LINK
        case GET_AFFILIATE_PROMOTION_LINK:
            return {
                ...state, socialloading: true, PromotionLinkData: []
            };

        case GET_AFFILIATE_PROMOTION_LINK_SUCCESS:
        case GET_AFFILIATE_PROMOTION_LINK_FAILURE:
            return {
                ...state, socialloading: false, PromotionLinkData: action.payload
            };


        default:
            return { ...state };
    }
};
