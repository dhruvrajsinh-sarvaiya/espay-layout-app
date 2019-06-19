import {
    // get all wallet list
    GET_ALL_WALLETS,
    GET_ALL_WALLETS_SUCCESS,
    GET_ALL_WALLETS_FAILURE,
    // get auth user list
    GETWALLETAUTHUSERS,
    GETWALLETAUTHUSERS_SUCCESS,
    GETWALLETAUTHUSERS_FAILURE,
    // get wallet details by id
    GETWALLETBYID,
    GETWALLETBYID_SUCCESS,
    GETWALLETBYID_FAILURE,
    //export wallets
    EXPORT_WALLETS,
    EXPORT_WALLETS_SUCCESS,
    EXPORT_WALLETS_FAILURE
} from "Actions/types";

// initial state
const INIT_STATE = {
    TotalWallet: 0,
    errors: {},
    walletDetails: [],
    walletsList: [],
    authUserList: [],
    exportResponse: {},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        // get all wallet list
        case GET_ALL_WALLETS:
            return { ...state, loading: true, errors: {}, exportResponse: {} };
        case GET_ALL_WALLETS_SUCCESS:
            return { ...state, loading: false, walletsList: action.payload.Data, TotalWallet: action.payload.TotalWallet, errors: {} };
        case GET_ALL_WALLETS_FAILURE:
            return { ...state, loading: false, errors: action.payload, walletsList: [], TotalWallet: 0 };

        //get auth user list
        case GETWALLETAUTHUSERS:
            return { ...state, loading: true, errors: {}, authUserList: [] };
        case GETWALLETAUTHUSERS_SUCCESS:
            return { ...state, loading: false, authUserList: action.payload, errors: {} };
        case GETWALLETAUTHUSERS_FAILURE:
            return { ...state, loading: false, errors: action.payload };

        //get wallet details by wallet id
        case GETWALLETBYID:
            return { ...state, loading: true, errors: {}, walletDetails: {} };
        case GETWALLETBYID_SUCCESS:
            return { ...state, loading: false, walletDetails: action.payload, errors: {} };
        case GETWALLETBYID_FAILURE:
            return { ...state, loading: false, errors: action.payload };

        //export wallet
        case EXPORT_WALLETS:
            return { ...state, loading: true, errors: {}, walletDetails: {}, exportResponse: {} };
        case EXPORT_WALLETS_SUCCESS:
            return { ...state, loading: false, exportResponse: action.payload, errors: {} };
        case EXPORT_WALLETS_FAILURE:
            return { ...state, loading: false, exportResponse: action.payload };

        default:
            return { ...state };
    }
};
