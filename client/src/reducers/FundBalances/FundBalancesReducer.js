/* 
    Developer : Nishant Vadgama
    Date : 25-10-2018
    File Comment : Fund Balance page reducer 
*/
// import only required withdraw actions
import {
    // get all balances
    GET_ALL_BALANCE,
    GET_ALL_BALANCE_SUCCESS,
    GET_ALL_BALANCE_FAILURE,
    // get seprated balance
    GET_WALLETBALANCE,
    GET_WALLETBALANCE_SUCCESS,
    GET_WALLETBALANCE_FAILURE,
} from 'Actions/types';

//Set Initial State
const INITIAL_STATE = {
    allBalance: {},
    wallets: [],
    loading: false,
    subLoading: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // get all balance
        case GET_ALL_BALANCE:
            return { ...state, loading: true, allBalance: {} };
        case GET_ALL_BALANCE_SUCCESS:
            return { ...state, loading: false, allBalance: action.payload };
        case GET_ALL_BALANCE_FAILURE:
            return { ...state, loading: false };

        // get wallets balance
        case GET_WALLETBALANCE:
            return { ...state, subLoading: true, wallets: [] };
        case GET_WALLETBALANCE_SUCCESS:
            return { ...state, subLoading: false, wallets: action.payload };
        case GET_WALLETBALANCE_FAILURE:
            return { ...state, subLoading: false, wallets: [] };

        default: return { ...state };
    }
}