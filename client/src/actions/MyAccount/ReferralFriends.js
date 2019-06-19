/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Referral Friends Actions
 */

 //Import action types form type.js
 import {
    REFERRAL_FRIENDS_LIST,
    REFERRAL_FRIENDS_SUCCESS,
    REFERRAL_FRIENDS_FAILURE
} from '../types';

/**
 * Redux Action Referral Friends Success
 */
export const referralFriendsSuccess = (list) => ({
    type: REFERRAL_FRIENDS_SUCCESS,
    payload: list
});

/**
 * Redux Action Referral Friends Failure
 */
export const referralFriendsFailure = (error) => ({
    type: REFERRAL_FRIENDS_FAILURE,
    payload: error
})

/**
 * Redux Action To Referral Friends
 */
export const referralFriends = () => ({
    type: REFERRAL_FRIENDS_LIST
})
