/**
 * Auther : Salim Deraiya
 * Created : 29-10-2019
 * Leader Portfolio List Actions
 */

import {
    //Get Leader Portfolio List
    GET_LEADER_PORTFOLIO_LIST,
    GET_LEADER_PORTFOLIO_LIST_SUCCESS,
    GET_LEADER_PORTFOLIO_LIST_FAILURE,

} from "../types";

/**
 * Redux Action To Get Leader Portfolio List
 */
export const getLeaderPortfolioList = (data) => ({
    type: GET_LEADER_PORTFOLIO_LIST,
    payload: data
});

/**
 * Redux Action To Get Leader Portfolio List Success
 */
export const getLeaderPortfolioListSuccess = (data) => ({
    type: GET_LEADER_PORTFOLIO_LIST_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Leader Portfolio List Failure
 */
export const getLeaderPortfolioListFailure = (error) => ({
    type: GET_LEADER_PORTFOLIO_LIST_FAILURE,
    payload: error
});