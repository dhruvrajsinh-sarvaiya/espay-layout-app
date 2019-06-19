
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

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // increase...
        case INCREASE_TOKENSUPPLY:
            return { ...state, loading: true};
        case INCREASE_TOKENSUPPLY_SUCCESS:
            return { ...state, loading: false, Increase: action.payload};
        case INCREASE_TOKENSUPPLY_FAILURE:
            return { ...state, loading: false, Increase: action.payload};
          // decrease...
        case DECREASE_TOKENSUPPLY:
            return { ...state, loading: true};
        case DECREASE_TOKENSUPPLY_SUCCESS:
            return { ...state, loading: false, Decrease: action.payload};
        case DECREASE_TOKENSUPPLY_FAILURE:
            return { ...state, loading: false, Decrease: action.payload};
            // token transfer...
        case GET_TOKEN_TRANSFER:
            return { ...state, loading: true};
        case GET_TOKEN_TRANSFER_SUCCESS:
            return { ...state, loading: false, tokenTransfer: action.payload};
        case GET_TOKEN_TRANSFER_FAILURE:
            return { ...state, loading: false, tokenTransfer: action.payload};
            // set transfer fee...
        case SET_TRANSFER_FEE:
            return { ...state, loading: true}; 
        case SET_TRANSFER_FEE_SUCCESS:
            return { ...state, loading: false, TransferFee: action.payload};
        case SET_TRANSFER_FEE_FAILURE:
            return { ...state, loading: false, TransferFee: action.payload};
        default:
            return { ...state };
    }
}
