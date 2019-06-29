/**
 * Auther : Salim Deraiya
 * Created : 07-02-2019
 * Leader Board Reducers
 */

import {
    //List
    GET_LEADER_BOARD_LIST,
    GET_LEADER_BOARD_LIST_SUCCESS,
    GET_LEADER_BOARD_LIST_FAILURE,
} from 'Actions/types';

/**
 * initial Leader Board
 */
const INIT_STATE = {
    ldrBrdList: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) 
    {
        //List
        case GET_LEADER_BOARD_LIST:
            return { ...state, loading: true, ldrBrdList: '' };

        case GET_LEADER_BOARD_LIST_SUCCESS:
            return { ...state, loading: false, ldrBrdList: action.payload };

        case GET_LEADER_BOARD_LIST_FAILURE:
            return { ...state, loading: false, ldrBrdList: action.payload };

        default:
            return { ...state };
    }
}