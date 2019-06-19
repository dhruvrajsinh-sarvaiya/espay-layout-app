/* 
    Developer : Nishant Vadgama
    Date : 14-09-2018
    File Comment : Address Generation action manager
*/
import { NotificationManager } from 'react-notifications';

//import only required address generation actions 
import {
    // get currency lsit
    GET_AD_CURRENCY,
    GET_AD_CURRENCY_SUCCESS,
    GET_AD_CURRENCY_FAILURE,
    // get wallets and balance,
    GET_AD_WALLETS,
    GET_AD_WALLETS_SUCCESS,
    GET_AD_WALLETS_FAILURE,
    //get wallet Balance
    GET_AD_BALANCE,
    GET_AD_BALANCE_SUCCESS,
    GET_AD_BALANCE_FAILURE,
    //get defualt wallet address
    GET_DEFAULT_ADD,
    GET_DEFAULT_ADD_SUCCESS,
    GET_DEFAULT_ADD_FAILURE,
    // generate address
    GENERATE_ADDRESS,
    GENERATE_ADDRESS_SUCCESS,
    GENERATE_ADDRESS_FAILURE,
    //update p2sh convertion
    UPDATE_P2SH_ADDRESS,
    UPDATE_P2SH_ADDRESS_SUCCESS,
    UPDATE_P2SH_ADDRESS_FAILURE,
} from 'Actions/types';

//Set Initial State
const INITIAL_STATE = {
    currencies: [],
    wallets: [],
    balance: {},
    defaultAddress: [],
    p2shResponse: {},
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // get currency list
        case GET_AD_CURRENCY:
            return {
                ...state,
                loading: true,
                currencies: [],
                wallets: [],
                balance: {},
                defaultAddress: []
            };
        case GET_AD_CURRENCY_SUCCESS:
            return { ...state, loading: false, currencies: action.payload };
        case GET_AD_CURRENCY_FAILURE:
            return { ...state, loading: false };

        // get wallets
        case GET_AD_WALLETS:
            return { ...state, loading: true, balance: {}, defaultAddress: [] };
        case GET_AD_WALLETS_SUCCESS:
            return { ...state, loading: false, wallets: action.payload, balance: {}, defaultAddress: [] };
        case GET_AD_WALLETS_FAILURE:
            return { ...state, loading: false, wallets: [], balance: {} };

        // GET BALANCE BY WALLET ID
        case GET_AD_BALANCE:
            return { ...state, loading: true, balance: {}, addresses: [] }
        case GET_AD_BALANCE_SUCCESS:
            return { ...state, loading: false, balance: action.payload, response: {} }
        case GET_AD_BALANCE_FAILURE:
            return { ...state, loading: false, balance: {} }

        // GET DEFAULT ADDRESS OF WALLET
        case GET_DEFAULT_ADD:
            return { ...state, loading: true, defaultAddress: [] }
        case GET_DEFAULT_ADD_SUCCESS:
            return { ...state, loading: false, defaultAddress: action.payload }
        case GET_DEFAULT_ADD_FAILURE:
            return { ...state, loading: false, defaultAddress: [] }

        //generate address
        case GENERATE_ADDRESS:
            return { ...state, loading: true };
        case GENERATE_ADDRESS_SUCCESS:
            return { ...state, loading: false, response: action.payload };
        case GENERATE_ADDRESS_FAILURE:
            return { ...state, loading: false };

        //update p2sh convertion
        case UPDATE_P2SH_ADDRESS:
            return { ...state, loading: true, p2shResponse: {} };
        case UPDATE_P2SH_ADDRESS_SUCCESS:
            return { ...state, loading: false, p2shResponse: action.payload };
        case UPDATE_P2SH_ADDRESS_FAILURE:
            return { ...state, loading: false, p2shResponse: action.payload };

        //default
        default:
            return { ...state };
    }
}