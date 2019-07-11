/* 
    Developer : Nishant Vadgama
    Date : 05-12-2018
    File Comment : Transaction Types action
*/
import {
    //Withdrawal Summary
    WITHDRAWALSUMMARY,
    WITHDRAWALSUMMARY_SUCCESS,
    WITHDRAWALSUMMARY_FAIL,
} from '../types';

// get withdrawal summary
export const getWithdrawSummary = () => ({
    type: WITHDRAWALSUMMARY
});
export const getWithdrawSummarySuccess = (response) => ({
    type: WITHDRAWALSUMMARY_SUCCESS,
    payload: response
});
export const getWithdrawSummaryFail = (error) => ({
    type: WITHDRAWALSUMMARY_FAIL,
    payload: error
});
