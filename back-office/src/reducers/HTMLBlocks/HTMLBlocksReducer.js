/**
 * Create By Sanjay
 * Created Date 27-05-2019
 * Reducer For HTML Blocks CRUD Operation
 */

import {

    GET_HTMLBLOCKS,
    GET_HTMLBLOCKS_SUCCESS,
    GET_HTMLBLOCKS_FAILURE,

    ADD_HTMLBLOCK_DETAILS,
    ADD_HTMLBLOCK_DETAILS_SUCCESS,
    ADD_HTMLBLOCK_DETAILS_FAILURE,

    EDIT_HTMLBLOCK,
    EDIT_HTMLBLOCK_SUCCESS,
    EDIT_HTMLBLOCK_FAILURE

} from "Actions/types";

//Initial State 

const INIT_STATE = {
    htmlblocks_list: {},
    add_htmlblock: {},
    edit_htmlblock: {},
    loading: false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        case GET_HTMLBLOCKS:
            return { ...state, loading: true, add_htmlblock: {}, edit_htmlblock: {} };

        case GET_HTMLBLOCKS_SUCCESS:
        case GET_HTMLBLOCKS_FAILURE:
        return { ...state, loading: false, htmlblocks_list: action.payload };        

        case ADD_HTMLBLOCK_DETAILS:            
            return { ...state, loading: true }

        case ADD_HTMLBLOCK_DETAILS_SUCCESS:         
        case ADD_HTMLBLOCK_DETAILS_FAILURE: 
            return { ...state, loading: false, add_htmlblock: action.payload };

        case EDIT_HTMLBLOCK:
            return { ...state, loading: true }
            
        case EDIT_HTMLBLOCK_SUCCESS:
        case EDIT_HTMLBLOCK_FAILURE: 
            return { ...state, loading: false, edit_htmlblock: action.payload }

        default:
            return { ...state };

    }
}