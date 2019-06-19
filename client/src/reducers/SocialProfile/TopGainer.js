/**
 * Auther : Salim Deraiya
 * Created : 31-01-2019
 * Top Gainer Reducers
 */

import {
    //Get Top Gainer List
    GET_TOP_GAINER_LIST,
    GET_TOP_GAINER_LIST_SUCCESS,
    GET_TOP_GAINER_LIST_FAILURE,
} from 'Actions/types';

/**
 * initial Top Gainer
 */
const INIT_STATE = {
    topGainer: {},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Get Top Gainer List
        case GET_TOP_GAINER_LIST:
            return { ...state, loading: true, topGainer: '' };

        case GET_TOP_GAINER_LIST_SUCCESS:
            return { ...state, loading: false, topGainer: action.payload };

        case GET_TOP_GAINER_LIST_FAILURE:
            return { ...state, loading: false, topGainer: action.payload };

        default:
            return { ...state };
    }
}