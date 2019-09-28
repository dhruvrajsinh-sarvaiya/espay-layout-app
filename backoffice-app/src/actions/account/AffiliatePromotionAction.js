import {
    //Add Affiliate Promotion
    ADD_AFFILIATE_PROMOTION,
    ADD_AFFILIATE_PROMOTION_SUCCESS,
    ADD_AFFILIATE_PROMOTION_FAILURE,

    //Edit Affiliate Promotion
    EDIT_AFFILIATE_PROMOTION,
    EDIT_AFFILIATE_PROMOTION_SUCCESS,
    EDIT_AFFILIATE_PROMOTION_FAILURE,

    //Change Affiliate Promotion Status
    CHANGE_AFFILIATE_PROMOTION_STATUS,
    CHANGE_AFFILIATE_PROMOTION_STATUS_SUCCESS,
    CHANGE_AFFILIATE_PROMOTION_STATUS_FAILURE,

    //List Affiliate Promotion
    LIST_AFFILIATE_PROMOTION,
    LIST_AFFILIATE_PROMOTION_SUCCESS,
    LIST_AFFILIATE_PROMOTION_FAILURE,

    //clear data
    CLEAR_AFFILIATE_PROMOTION,
} from "../ActionTypes";

// Redux Action To Add Affiliate Promotion
export const addAffiliatePromotion = (data) => ({
    type: ADD_AFFILIATE_PROMOTION,
    payload: data
})

// Redux Action Add Affiliate Promotion Success
export const addAffiliatePromotionSuccess = (data) => ({
    type: ADD_AFFILIATE_PROMOTION_SUCCESS,
    payload: data
});

// Redux Action Add Affiliate Promotion Failure
export const addAffiliatePromotionFailure = (error) => ({
    type: ADD_AFFILIATE_PROMOTION_FAILURE,
    payload: error
});

// Redux Action To Edit Affiliate Promotion
export const editAffiliatePromotion = (data) => ({
    type: EDIT_AFFILIATE_PROMOTION,
    payload: data
})

// Redux Action Edit Affiliate Promotion Success
export const editAffiliatePromotionSuccess = (data) => ({
    type: EDIT_AFFILIATE_PROMOTION_SUCCESS,
    payload: data
});

// Redux Action Edit Affiliate Promotion Failure
export const editAffiliatePromotionFailure = (error) => ({
    type: EDIT_AFFILIATE_PROMOTION_FAILURE,
    payload: error
});

// Redux Action To Change Status Affiliate Promotion
export const changeStatusAffiliatePromotion = (data) => ({
    type: CHANGE_AFFILIATE_PROMOTION_STATUS,
    payload: data
})

// Redux Action Change Status Affiliate Promotion Success
export const changeStatusAffiliatePromotionSuccess = (data) => ({
    type: CHANGE_AFFILIATE_PROMOTION_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Affiliate Promotion Failure
export const changeStatusAffiliatePromotionFailure = (error) => ({
    type: CHANGE_AFFILIATE_PROMOTION_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Affiliate Promotion
export const getAffiliatePromotionList = (data) => ({
    type: LIST_AFFILIATE_PROMOTION,
    payload: data
})

// Redux Action List Affiliate Promotion Success
export const getAffiliatePromotionListSuccess = (data) => ({
    type: LIST_AFFILIATE_PROMOTION_SUCCESS,
    payload: data
});

// Redux Action List Affiliate Promotion Failure
export const getAffiliatePromotionListFailure = (error) => ({
    type: LIST_AFFILIATE_PROMOTION_FAILURE,
    payload: error
});

// Redux Action clear data
export const clearAffiliatePromotion = () => ({
    type: CLEAR_AFFILIATE_PROMOTION,
});