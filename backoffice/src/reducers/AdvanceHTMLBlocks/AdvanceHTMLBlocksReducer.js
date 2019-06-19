/**
 * Create By Sanjay 
 * Created Date 05-06-2019
 * Reducer file for Advance HTML Blocks 
 */

import {

    //Action Types For Get List Of Advance HTML Blocks
    GET_ADVANCE_HTML_BLOCKS_LIST,
    GET_ADVANCE_HTML_BLOCKS_LIST_SUCCESS,
    GET_ADVANCE_HTML_BLOCKS_LIST_FAILURE,

    //Action Types For Add Advance HTML Block
    ADD_ADVANCE_HTML_BLOCK,
    ADD_ADVANCE_HTML_BLOCK_SUCCESS,
    ADD_ADVANCE_HTML_BLOCK_FAILURE,

    //Action Types For Edit Advance HTM Block
    EDIT_ADVANCE_HTML_BLOCK,
    EDIT_ADVANCE_HTML_BLOCK_SUCCESS,
    EDIT_ADVANCE_HTML_BLOCK_FAILURE

} from "Actions/types";

//Initial State
const INIT_STATE = {
    advance_htmlblocks_list: {},
    add_advance_htmlblock: {},
    edit_advance_htmlblock: {},
    loading: false
}

export default (state= INIT_STATE, action) => {
    switch(action.type){

        case GET_ADVANCE_HTML_BLOCKS_LIST:
            return { ...state, loading: true, add_advance_htmlblock: {}, edit_advance_htmlblock: {} }

        case GET_ADVANCE_HTML_BLOCKS_LIST_SUCCESS:
            return { ...state, loading: false, advance_htmlblocks_list: action.payload }

        case GET_ADVANCE_HTML_BLOCKS_LIST_FAILURE:
            return { ...state, loading: false, advance_htmlblocks_list: action.payload }

        case ADD_ADVANCE_HTML_BLOCK:
            return { ...state, loading: true }

        case ADD_ADVANCE_HTML_BLOCK_SUCCESS:
            return { ...state, loading: false, add_advance_htmlblock: action.payload}

        case ADD_ADVANCE_HTML_BLOCK_FAILURE:
            return { ...state, loading: false, add_advance_htmlblock: action.payload }

        case EDIT_ADVANCE_HTML_BLOCK:
            return { ...state, loading: true }

        case EDIT_ADVANCE_HTML_BLOCK_SUCCESS:
            return{ ...state, loading: false, edit_advance_htmlblock: action.payload }

        case EDIT_ADVANCE_HTML_BLOCK_FAILURE:
            return { ...state, loading: false, edit_advance_htmlblock: action.payload }

        default:
            return { ...state }
    }
}