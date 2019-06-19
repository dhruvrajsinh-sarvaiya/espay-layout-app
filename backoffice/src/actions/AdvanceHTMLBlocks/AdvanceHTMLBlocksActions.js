/**
 * Create By Sanjay 
 * Created Date 05-06-2019
 * Actions for Advance HTML Blocks
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

/**
 * Actions For Get List Of Advance HTML Blocks
 */

export const getAdvanceHTMLBlocksList = () => ({
    type: GET_ADVANCE_HTML_BLOCKS_LIST
})

export const getAdvanceHTMLBlocksListSuccess = (response) => ({
    type: GET_ADVANCE_HTML_BLOCKS_LIST_SUCCESS,
    payload: response
})


export const getAdvanceHTMLBlocksListFailure = (error) => ({
    type: GET_ADVANCE_HTML_BLOCKS_LIST_FAILURE,
    payload: error
})

/**
 * Actions For Add Advance HTML Block
 */

export const addAdvanceHTMLBlock = (request) => ({
    type: ADD_ADVANCE_HTML_BLOCK,
    payload: request
})

export const addAdvanceHTMLBlockSuccess = (response) => ({
    type: ADD_ADVANCE_HTML_BLOCK_SUCCESS,
    payload: response
})

export const addAdvanceHTMLBlockFailure = (error) => ({
    type: ADD_ADVANCE_HTML_BLOCK_FAILURE,
    payload: error
})

/**
 * Actions For Edit Advance HTML Block
 */

export const editAdvanceHTMLBlock = (request) => ({
    type: EDIT_ADVANCE_HTML_BLOCK,
    payload: request
})

export const editAdvanceHTMLBlockSuccess = (response) => ({
    type: EDIT_ADVANCE_HTML_BLOCK_SUCCESS,
    payload: response
})

export const editAdvanceHTMLBlockFailure = (error) => ({
    type: EDIT_ADVANCE_HTML_BLOCK_FAILURE,
    payload: error
})