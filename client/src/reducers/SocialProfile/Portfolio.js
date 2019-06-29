/**
 * Auther : Salim Deraiya
 * Created : 29-10-2019
 * Leader Portfolio List Reducers
 */

import {
    //Get Leader Portfolio List
    GET_LEADER_PORTFOLIO_LIST,
    GET_LEADER_PORTFOLIO_LIST_SUCCESS,
    GET_LEADER_PORTFOLIO_LIST_FAILURE,
} from 'Actions/types';

/**
 * initial Leader Portfolio
 */
const INIT_STATE = {
    portfolioList: {},
    loading: false
};

export default (state,action) => {
	if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //Get Leader Portfolio List
        case GET_LEADER_PORTFOLIO_LIST:
            return { ...state, loading: true, portfolioList: '' };

        case GET_LEADER_PORTFOLIO_LIST_SUCCESS:
            return { ...state, loading: false, portfolioList: action.payload };

        case GET_LEADER_PORTFOLIO_LIST_FAILURE:
            return { ...state, loading: false, portfolioList: action.payload };

        default:
            return { ...state };
    }
}