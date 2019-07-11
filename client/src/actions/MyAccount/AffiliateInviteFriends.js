/**
 * Author : Saloni Rathod
 * Created :07/03/2019
 * Display Affiliate  invite friends Actions
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
    //  get promotion link
    GET_AFFILIATE_PROMOTION_LINK,
    GET_AFFILIATE_PROMOTION_LINK_SUCCESS,
    GET_AFFILIATE_PROMOTION_LINK_FAILURE,
} from "../types";


/**
 * Redux Action To AFFILIATE EMAIL PROMOTION
 */

export const AffiliateEmailPromo = data => ({
    type: AFFILIATE_EMAIL_PROMO,
    payload: data
});

/**
 * Redux Action To AFFILIATE EMAIL PROMO Success
 */
export const AffiliateEmailPromoSuccess = response => ({
    type: AFFILIATE_EMAIL_PROMO_SUCCESS,
    payload: response
});

/**
 * Redux Action To AFFILIATE EMAIL PROMO Failure
 */
export const AffiliateEmailPromoFailure = error => ({
    type: AFFILIATE_EMAIL_PROMO_FAILURE,
    payload: error
});


/**
 * Redux Action To AFFILIATE SMS PROMO
 */

export const AffiliateSmsPromo = data => ({
    type: AFFILIATE_SMS_PROMO,
    payload: data
});

/**
 * Redux Action To AFFILIATE SMS PROMO Success
 */
export const AffiliateSmsPromoSuccess = response => ({
    type: AFFILIATE_SMS_PROMO_SUCCESS,
    payload: response
});

/**
 * Redux Action To AFFILIATE SMS PROMO Failure
 */
export const AffiliateSmsPromoFailure = error => ({
    type: AFFILIATE_SMS_PROMO_FAILURE,
    payload: error
});


/**
 * Redux Action To SOCIAL SHARING PROMO
 */

export const AffiliateSocialSharing = data => ({
    type: AFFILIATE_SOCIAL_SHARING_PROMO,
    payload: data
});

/**
 * Redux Action To SOCIAL SHARING PROMO Success
 */
export const AffiliateSocialSharingSuccess = response => ({
    type: AFFILIATE_SOCIAL_SHARING_PROMO_SUCCESS,
    payload: response
});

/**
 * Redux Action To SOCIAL SHARING PROMO Failure
 */
export const AffiliateSocialSharingFailure = error => ({
    type: AFFILIATE_SOCIAL_SHARING_PROMO_FAILURE,
    payload: error
});


/**
 * Redux Action To SOCIAL SHARING PROMO
 */

export const GetAffiliatePromotionLink = data => ({
    type: GET_AFFILIATE_PROMOTION_LINK,
    payload: data
});

/**
 * Redux Action To SOCIAL SHARING PROMO Success
 */
export const GetAffiliatePromotionLinkSuccess = response => ({
    type: GET_AFFILIATE_PROMOTION_LINK_SUCCESS,
    payload: response
});

/**
 * Redux Action To SOCIAL SHARING PROMO Failure
 */
export const GetAffiliatePromotionLinkFailure = error => ({
    type: GET_AFFILIATE_PROMOTION_LINK_FAILURE,
    payload: error
});