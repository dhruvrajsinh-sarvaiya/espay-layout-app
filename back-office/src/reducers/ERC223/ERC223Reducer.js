
/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : ERC223 Reducer
*/
import {
    // Increse token supply...
    INCREASE_TOKENSUPPLY,
    INCREASE_TOKENSUPPLY_SUCCESS,
    INCREASE_TOKENSUPPLY_FAILURE,
    //decrease token supply
   DECREASE_TOKENSUPPLY,
   DECREASE_TOKENSUPPLY_SUCCESS,
   DECREASE_TOKENSUPPLY_FAILURE,
   //TokenTransfer
   GET_TOKEN_TRANSFER,
   GET_TOKEN_TRANSFER_SUCCESS,
   GET_TOKEN_TRANSFER_FAILURE,
   //setTransferFee
   SET_TRANSFER_FEE,
   SET_TRANSFER_FEE_SUCCESS,
   SET_TRANSFER_FEE_FAILURE,
} from "Actions/types";

const INITIAL_STATE = {
    loading: false,
    Increase: [],
    TotalCount : 0,
    Decrease: [],
    tokenTransfer: [],
    TransferFee: []
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }
    
    switch (action.type) {
        // increase...
        case INCREASE_TOKENSUPPLY:
        case DECREASE_TOKENSUPPLY:
        case GET_TOKEN_TRANSFER:
        case SET_TRANSFER_FEE:
            return { ...state, loading: true};

        case INCREASE_TOKENSUPPLY_SUCCESS:
        case INCREASE_TOKENSUPPLY_FAILURE:
            return { ...state, loading: false, Increase: action.payload};

        // decrease...
        case DECREASE_TOKENSUPPLY_SUCCESS:
        case DECREASE_TOKENSUPPLY_FAILURE:
            return { ...state, loading: false, Decrease: action.payload};

        // token transfer...
        case GET_TOKEN_TRANSFER_SUCCESS:
        case GET_TOKEN_TRANSFER_FAILURE:
            return { ...state, loading: false, tokenTransfer: action.payload};
            
        // set transfer fee... 
        case SET_TRANSFER_FEE_SUCCESS:
        case SET_TRANSFER_FEE_FAILURE:
            return { ...state, loading: false, TransferFee: action.payload};
            
        default:
            return { ...state };
    }
}
