/* 
    Developer : Vishva shah
    Date : 04-06-2019
    File Comment : Arbitrage report reducer
*/
import {
    //list
    GET_ARBITRAGELEDGER_LIST,
    GET_ARBITRAGELEDGER_LIST_SUCCESS,
    GET_ARBITRAGELEDGER_LIST_FAILURE,

} from 'Actions/types';

const INIT_STATE = {
    loading: false,
    arbitrageList: [],
    TotalCount: 0
}

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case GET_ARBITRAGELEDGER_LIST:
            return { ...state, loading: true, TotalCount: 0 }
        case GET_ARBITRAGELEDGER_LIST_SUCCESS:
            return { ...state, loading: false, arbitrageList: action.payload.WalletLedgers, TotalCount: action.payload.TotalCount }
        case GET_ARBITRAGELEDGER_LIST_FAILURE:
            return { ...state, loading: false, arbitrageList: [], TotalCount: 0 }

        default:
            return { ...state };
    }
}