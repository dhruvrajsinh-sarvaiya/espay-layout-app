/**
 * Create By Sanajy 
 * Created Date 27-05-2019 
 * Actions For HTML Blocks CRUD Operation
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

 /**
  * Actions For Get HTML Blocks List 
 */

export const getHTMLBlocks = () => ({
    type: GET_HTMLBLOCKS
})

export const getHTMLBlocksSuccess = (response) => ({
    type: GET_HTMLBLOCKS_SUCCESS,
    payload: response
})

export const getHTMLBlocksFailure = (error) => ({
    type: GET_HTMLBLOCKS_FAILURE,
    payload: error
})

/**
 * Actions For ADD HTML Block 
 */

export const addHTMLBlockDetails = (request) => ({
    type:ADD_HTMLBLOCK_DETAILS,
    payload: request
})

export const addHTMLBlockDetailsSuccess = (response) => ({
    type: ADD_HTMLBLOCK_DETAILS_SUCCESS,
    payload: response
})

export const addHTMLBlockDetailsFailure = (error) => ({
    type: ADD_HTMLBLOCK_DETAILS_FAILURE,
    payload: error
})

/**
 * Actions For Edit HTML Block
 */

export const editHTMLBlock = (request) => ({
    type: EDIT_HTMLBLOCK,
    payload: request
})

export const editHTMLBlockSuccess = (response) => ({
    type: EDIT_HTMLBLOCK_SUCCESS,
    payload: response
})

export const editHTMLBlockFailure = (error) => ({
    type: EDIT_HTMLBLOCK_FAILURE,
    payload: error
})
