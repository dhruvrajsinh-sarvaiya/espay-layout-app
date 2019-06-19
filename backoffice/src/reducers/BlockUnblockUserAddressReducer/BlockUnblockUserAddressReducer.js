/* 
    Developer : Parth Andhariya
    Date : 24-05-2019
    File Comment : Block Unblock User Address Reducer
*/
import {
    // list 
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,
    //block/unblock
    GET_BLOCK_UNBLOCK_USER_ADDRESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS,
    GET_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE,
    //added by vishva for destroy black fund
    DESTROY_BLACKFUND,
    DESTROY_BLACKFUND_SUCCESS,
    DESTROY_BLACKFUND_FAILURE
} from "Actions/types";
// initial state
const INITIAL_STATE = {
    loading: false,
    BlockUnblockList: [],
    BlockUnblock: '',
    BlackFund : []
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        //list...
        case GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS:
            return {
                ...state,
                loading: true,
            };
        case GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                BlockUnblockList: action.payload.Data,
            };
        case GET_LIST_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                BlockUnblockList: [],
            };
        //Block/Unblock...
        case GET_BLOCK_UNBLOCK_USER_ADDRESS:
            return {
                ...state,
                loading: true,
            };
        case GET_BLOCK_UNBLOCK_USER_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                BlockUnblock: action.payload,
            };
        case GET_BLOCK_UNBLOCK_USER_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                BlockUnblock: action.payload,
            };
            //destroy black fund
        case DESTROY_BLACKFUND:
            return {
                ...state,
                loading: true,
            };
        case DESTROY_BLACKFUND_SUCCESS:
            return {
                ...state,
                loading: false,
                BlackFund: action.payload,
            };
        case DESTROY_BLACKFUND_FAILURE:
            return {
                ...state,
                loading: false,
                BlackFund: action.payload,
            };
        default:
            return { ...state };
    }
};
