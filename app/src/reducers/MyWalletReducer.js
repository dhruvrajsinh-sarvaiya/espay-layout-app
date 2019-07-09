// Action types for MyWallet
import {
    //list all wallets
    LISTALLWALLETS,
    LISTALLWALLETS_SUCCESS,
    LISTALLWALLETS_FAILURE,

    //Get Coin List
    FETCH_BALANCE,
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,

    //list wallet users...
    LISTWALLETUSERS,
    LISTWALLETUSERS_SUCCESS,
    LISTWALLETUSERS_FAILURE,

    //add wallet user...
    ADDWALLETUSER,
    ADDWALLETUSER_SUCCESS,
    ADDWALLETUSER_FAILURE,

    //accept reject wallet request...
    ACCEPTREJECTWALLETREQUEST,
    ACCEPTREJECTWALLETREQUEST_SUCCESS,
    ACCEPTREJECTWALLETREQUEST_FAILURE,

    //List User Wallet Request
    LIST_USER_WALLET_REQUEST,
    LIST_USER_WALLET_REQUEST_SUCCESS,
    LIST_USER_WALLET_REQUEST_FAILURE,

    //Clear Add User Data
    CLEAR_ADD_USER_DATA,

    // Action Logout
    ACTION_LOGOUT
} from "../actions/ActionTypes";

const INITIAL_STATE = {

    // Get All Wallet List
    GetAllWalletListFetchData: true,
    GetAllWalletListIsFetching: false,
    GetAllWalletListdata: '',

    // Get Coin List
    BalanceFetchData: true,
    BalanceIsFetching: false,
    Balancedata: '',

    // List Wallet User
    GetWalletUserListFetchData: true,
    GetWalletUserListIsFetching: false,
    GetWalletUserListWisedata: '',

    // Add Wallet User
    AddWalletUserFetchData: true,
    AddWalletUserIsFetching: false,
    AddWalletUserData: '',

    // List User Wallet Request
    GetUserWalletRequestFetchData: true,
    GetUserWalletRequestIsFetching: false,
    GetUserWalletRequestData: '',

    // Accept and Reject Wallet Request
    AcceptRejectWalletFetchData: true,
    AcceptRejectWalletIsFetching: false,
    AcceptRejectWalletData: '',
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle List All Wallet method data
        case LISTALLWALLETS:
            return { ...state, GetAllWalletListFetchData: true, GetAllWalletListdata: '', GetAllWalletListIsFetching: true, BalanceFetchData: true, };
        // Set List All Wallet success data
        case LISTALLWALLETS_SUCCESS:
            return { ...state, GetAllWalletListFetchData: false, GetAllWalletListdata: action.payload, GetAllWalletListIsFetching: false, BalanceFetchData: true, };
        // Set List All Wallet failure data
        case LISTALLWALLETS_FAILURE:
            return { ...state, GetAllWalletListFetchData: false, GetAllWalletListdata: action.payload, GetAllWalletListIsFetching: false, BalanceFetchData: true, };

        // Handle Fetch Balance method data
        case FETCH_BALANCE:
            return { ...state, BalanceFetchData: true, Balancedata: '', BalanceIsFetching: true, GetAllWalletListFetchData: true, };
        // Set Fetch Balance success data
        case FETCH_BALANCE_SUCCESS:
            return { ...state, BalanceFetchData: false, Balancedata: action.data, BalanceIsFetching: false, GetAllWalletListFetchData: true, };
        // Set Fetch Balance failure data
        case FETCH_BALANCE_FAILURE:
            return { ...state, BalanceFetchData: false, Balancedata: action.data, BalanceIsFetching: false, GetAllWalletListFetchData: true, };

        // Handle Wallet User List method data
        case LISTWALLETUSERS:
            return { ...state, GetWalletUserListFetchData: true, GetWalletUserListWisedata: '', GetWalletUserListIsFetching: true, AddWalletUserFetchData: true, };
        // Set Wallet User List success data
        case LISTWALLETUSERS_SUCCESS:
            return { ...state, GetWalletUserListFetchData: false, GetWalletUserListWisedata: action.payload, GetWalletUserListIsFetching: false, AddWalletUserFetchData: true, };
        // Set Wallet User List failure data
        case LISTWALLETUSERS_FAILURE:
            return { ...state, GetWalletUserListFetchData: false, GetWalletUserListWisedata: action.payload, GetWalletUserListIsFetching: false, AddWalletUserFetchData: true, };

        // Handle Add Wallet User method data
        case ADDWALLETUSER:
            return { ...state, AddWalletUserFetchData: true, AddWalletUserData: '', AddWalletUserIsFetching: true, GetWalletUserListFetchData: true, };
        // Set Add Wallet User success data
        case ADDWALLETUSER_SUCCESS:
            return { ...state, AddWalletUserFetchData: false, AddWalletUserData: action.payload, AddWalletUserIsFetching: false, GetWalletUserListFetchData: true, };
        // Set Add Wallet User failure data
        case ADDWALLETUSER_FAILURE:
            return { ...state, AddWalletUserFetchData: false, AddWalletUserData: action.payload, AddWalletUserIsFetching: false, GetWalletUserListFetchData: true, };

        // Handle User Wallet User Request method data
        case LIST_USER_WALLET_REQUEST:
            return { ...state, GetUserWalletRequestFetchData: true, GetUserWalletRequestData: '', GetUserWalletRequestIsFetching: true, AcceptRejectWalletFetchData: true, };
        // Set User Wallet User Request success data
        case LIST_USER_WALLET_REQUEST_SUCCESS:
            return { ...state, GetUserWalletRequestFetchData: false, GetUserWalletRequestData: action.payload, GetUserWalletRequestIsFetching: false, AcceptRejectWalletFetchData: true, };
        // Set User Wallet User Request failure data
        case LIST_USER_WALLET_REQUEST_FAILURE:
            return { ...state, GetUserWalletRequestFetchData: false, GetUserWalletRequestData: action.payload, GetUserWalletRequestIsFetching: false, AcceptRejectWalletFetchData: true, };

        // Handle Accept Reject Wallet method data
        case ACCEPTREJECTWALLETREQUEST:
            return { ...state, AcceptRejectWalletFetchData: true, AcceptRejectWalletData: '', AcceptRejectWalletIsFetching: true, GetUserWalletRequestFetchData: true, };
        // Set Accept Reject Wallet success data
        case ACCEPTREJECTWALLETREQUEST_SUCCESS:
            return { ...state, AcceptRejectWalletFetchData: false, AcceptRejectWalletData: action.payload, AcceptRejectWalletIsFetching: false, GetUserWalletRequestFetchData: true, };
        // Set Accept Reject Wallet failure data
        case ACCEPTREJECTWALLETREQUEST_FAILURE:
            return { ...state, AcceptRejectWalletFetchData: false, AcceptRejectWalletData: action.payload, AcceptRejectWalletIsFetching: false, GetUserWalletRequestFetchData: true, };

        // Clear Add User Data
        case CLEAR_ADD_USER_DATA:
            return { ...state, AddWalletUserFetchData: true, AddWalletUserData: '', AddWalletUserIsFetching: false, };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};
