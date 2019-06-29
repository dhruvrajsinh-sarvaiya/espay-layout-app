/**
 * Auther : Salim Deraiya
 * Created : 31-01-2019
 * Top Leader Reducers
 */

import {
    //Get Top Leader List
    GET_TOP_LEADER_LIST,
    GET_TOP_LEADER_LIST_SUCCESS,
    GET_TOP_LEADER_LIST_FAILURE,
} from 'Actions/types';

/**
 * initial Top Leader
 */
const INIT_STATE = {
    topLeader: {},
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //Get Top Leader List
        case GET_TOP_LEADER_LIST:
            return { ...state, loading: true, topLeader: '' };

        case GET_TOP_LEADER_LIST_SUCCESS:
            return { ...state, loading: false, topLeader: action.payload };

        case GET_TOP_LEADER_LIST_FAILURE:
            return { ...state, loading: false, topLeader: action.payload };

        default:
            return { ...state };
    }
}