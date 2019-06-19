/**
 * Auther : Salim Deraiya
 * Created : 31-01-2019
 * Top Looser Reducers
 */

import {
    //Get Top Looser List
    GET_TOP_LOOSER_LIST,
    GET_TOP_LOOSER_LIST_SUCCESS,
    GET_TOP_LOOSER_LIST_FAILURE,
} from 'Actions/types';

/**
 * initial Top Looser
 */
const INIT_STATE = {
    topLooser: {},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        //Get Top Looser List
        case GET_TOP_LOOSER_LIST:
            return { ...state, loading: true, topLooser: '' };

        case GET_TOP_LOOSER_LIST_SUCCESS:
            return { ...state, loading: false, topLooser: action.payload };

        case GET_TOP_LOOSER_LIST_FAILURE:
            return { ...state, loading: false, topLooser: action.payload };

        default:
            return { ...state };
    }
}