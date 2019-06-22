// Action types for Address Management
import {
    // Fetch Balance
    FETCH_BALANCE,
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,

    // GET GLOBAL PREFERENCE
    GET_PREFERENCE,
    GET_PREFERENCE_SUCCESS,
    GET_PREFERENCE_FAILURE,

    // SET GLOBAL PREFERENCE
    SET_PREFERENCE,
    SET_PREFERENCE_SUCCESS,
    SET_PREFERENCE_FAILURE,

    //list
    FETCH_WITHDRAWALADDRESS,
    FETCH_WITHDRAWALADDRESS_SUCCESS,
    FETCH_WITHDRAWALADDRESS_FAIL,

    // add
    SUBMIT_WITHDRAWALADDRESSES,
    SUBMIT_WITHDRAWALADDRESSES_SUCCESS,
    SUBMIT_WITHDRAWALADDRESSES_FAIL,

    // add to whitelist
    ADDTO_WHITELIST,
    ADDTO_WHITELIST_SUCCESS,
    ADDTO_WHITELIST_FAILURE,

    // remove form whitelist
    REMOVE_WHITELIST,
    REMOVE_WHITELIST_SUCCESS,
    REMOVE_WHITELIST_FAILURE,

    // delete from whitelist
    DELETE_ADDRESSES,
    DELETE_ADDRESSES_SUCCESS,
    DELETE_ADDRESSES_FAILURE,
    ACTION_LOGOUT,

    //For Verify 2FA
    VERIFY_2FA,
    VERIFY_2FA_SUCCESS,
    VERIFY_2FA_FAILURE,

} from "../actions/ActionTypes";

// Initial state for Address Management
const INTIAL_STATE = {

    //Common Progress Bit For Request
    formLoading: false,
    listLoading: false,

    //Initial State For Get Balance Request Data
    BalanceFetchData: true,
    Balancedata: '',
    BalanceDataIsFetching: false,

    //initial State For Get Global Preferance 
    getGlobalPerfFetchData: true,
    getGlobalPrefdata: '',

    //initial State For Set Global Preferance 
    setGlobalPerfFetchData: true,
    setGlobalPrefdata: '',

    //Initial State For Withdrawal Address Add to Whitelist Request Data
    AddToWhitelistFetchData: true,
    AddToWhitelistdata: '',

    // Initial State For Withdrawal Addresses History Data
    WithdrawalAddressIsFetching: false,
    WithdrawalAddresssFetchData: true,
    WithdrawalAddressHistorydata: '',

    // Initial State For Add Whitelisted Address Data
    AddAddresssFetchData: true,
    AddAddressHistorydata: '',

    // Initial State For Remove Whitelisted Address Data
    RemoveAddresssFetchData: true,
    RemoveAddressHistorydata: '',

    // Initial State For Delete Whitelisted Address History Data 
    DeleteWithdrawalAddressFetchData: true,
    DeleteWWithdrawalAddressHistorydata: '',

    // for 2FA Google Auth Verify
    VerifyGoogleAuthData: '',
    VerifyGoogleAuthFetchData: true,
    VerifyGoogleAuthIsFetching: false,
}

const AddressManagementReducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Verify 2FA method data
        case VERIFY_2FA:
            return {
                ...state, VerifyGoogleAuthIsFetching: true,
                VerifyGoogleAuthData: '',
                VerifyGoogleAuthFetchData: true,
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                BalanceFetchData: true,
            };
        // Set Verify 2FA success data
        case VERIFY_2FA_SUCCESS:
            return {
                ...state, VerifyGoogleAuthIsFetching: false,
                VerifyGoogleAuthData: action.payload,
                VerifyGoogleAuthFetchData: false,
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                BalanceFetchData: true,
            };
        // Set Verify 2FA failure data
        case VERIFY_2FA_FAILURE:
            return {
                ...state, VerifyGoogleAuthIsFetching: false,
                VerifyGoogleAuthData: action.payload,
                VerifyGoogleAuthFetchData: false,
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                BalanceFetchData: true,
            };

        // Handle Fetch Balance method data        
        case FETCH_BALANCE:
            return Object.assign({}, state, {
                BalanceDataIsFetching: true,
                BalanceFetchData: true,
                Balancedata: '',
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });
        // Set Fetch Balance success data        
        case FETCH_BALANCE_SUCCESS:

            return Object.assign({}, state, {
                BalanceFetchData: false,
                BalanceDataIsFetching: false,
                Balancedata: action.data,
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });
        // Set Fetch Balance failure data        
        case FETCH_BALANCE_FAILURE:
            return Object.assign({}, state, {
                BalanceFetchData: false,
                BalanceDataIsFetching: false,
                Balancedata: action.e,
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });

        // Handle Preference method data
        case GET_PREFERENCE:
            return {
                ...state,
                formLoading: true,
                getGlobalPerfFetchData: true,
                getGlobalPrefdata: '',
                BalanceFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Preference success data
        case GET_PREFERENCE_SUCCESS:
            return {
                ...state,
                formLoading: false,
                getGlobalPerfFetchData: false,
                getGlobalPrefdata: action.payload,
                BalanceFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Preference failure data
        case GET_PREFERENCE_FAILURE:
            return {
                ...state,
                formLoading: false,
                getGlobalPerfFetchData: false,
                getGlobalPrefdata: action.payload,
                BalanceFetchData: true,
                setGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };

        // Handle Set Preference method data
        case SET_PREFERENCE:
            return {
                ...state,
                formLoading: true,
                setGlobalPerfFetchData: true,
                setGlobalPrefdata: '',
                BalanceFetchData: true,
                getGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Preference success data
        case SET_PREFERENCE_SUCCESS:
            return {
                ...state,
                formLoading: false,
                setGlobalPerfFetchData: false,
                setGlobalPrefdata: action.payload,
                BalanceFetchData: true,
                getGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Preference failure data
        case SET_PREFERENCE_FAILURE:
            return {
                ...state,
                formLoading: false,
                setGlobalPerfFetchData: false,
                setGlobalPrefdata: action.payload,
                BalanceFetchData: true,
                getGlobalPerfFetchData: true,
                AddToWhitelistFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };

        // Handle Submit Withdrawal Address method data
        case SUBMIT_WITHDRAWALADDRESSES:
            return {
                ...state,
                formLoading: true,
                AddToWhitelistFetchData: true,
                AddToWhitelistdata: '',
                BalanceFetchData: true,
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Submit Withdrawal Address success data
        case SUBMIT_WITHDRAWALADDRESSES_SUCCESS:
            return {
                ...state,
                formLoading: false,
                AddToWhitelistFetchData: false,
                AddToWhitelistdata: action.payload,
                BalanceFetchData: true,
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Submit Withdrawal Address failure data
        case SUBMIT_WITHDRAWALADDRESSES_FAIL:
            return {
                ...state,
                formLoading: false,
                AddToWhitelistFetchData: false,
                AddToWhitelistdata: action.payload,
                BalanceFetchData: true,
                getGlobalPerfFetchData: true,
                setGlobalPerfFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };

        // Handle Fetch Withdrawal Address method data
        case FETCH_WITHDRAWALADDRESS:
            return {
                ...state,
                WithdrawalAddressIsFetching: true,
                WithdrawalAddresssFetchData: true,
                WithdrawalAddressHistorydata: '',
                AddAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Fetch Withdrawal Address success data
        case FETCH_WITHDRAWALADDRESS_SUCCESS:
            return {
                ...state,
                WithdrawalAddressIsFetching: false,
                WithdrawalAddresssFetchData: false,
                WithdrawalAddressHistorydata: action.payload,
                AddAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Fetch Withdrawal Address failure data
        case FETCH_WITHDRAWALADDRESS_FAIL:
            return {
                ...state,
                WithdrawalAddressIsFetching: false,
                WithdrawalAddresssFetchData: false,
                WithdrawalAddressHistorydata: action.payload,
                AddAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };

        // Handle Add To Whitelist method data
        case ADDTO_WHITELIST:
            return {
                ...state,
                listLoading: true,
                AddAddresssFetchData: true,
                AddAddressHistorydata: '',
                WithdrawalAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Add To Whitelist success data
        case ADDTO_WHITELIST_SUCCESS:
            return {
                ...state,
                listLoading: false,
                AddAddresssFetchData: false,
                AddAddressHistorydata: action.payload,
                WithdrawalAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Add To Whitelist failure data
        case ADDTO_WHITELIST_FAILURE:
            return {
                ...state,
                listLoading: false,
                AddAddresssFetchData: false,
                AddAddressHistorydata: action.payload,
                WithdrawalAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };

        // Handle Remove Whitelist method data
        case REMOVE_WHITELIST:
            return {
                ...state,
                listLoading: true,
                RemoveAddresssFetchData: true,
                RemoveAddressHistorydata: '',
                WithdrawalAddresssFetchData: true,
                AddAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Remove Whitelist success data
        case REMOVE_WHITELIST_SUCCESS:
            return {
                ...state,
                listLoading: false,
                RemoveAddresssFetchData: false,
                RemoveAddressHistorydata: action.payload,
                WithdrawalAddresssFetchData: true,
                AddAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Remove Whitelist failure data
        case REMOVE_WHITELIST_FAILURE:
            return {
                ...state,
                listLoading: false,
                RemoveAddresssFetchData: false,
                RemoveAddressHistorydata: action.payload,
                WithdrawalAddresssFetchData: true,
                AddAddresssFetchData: true,
                DeleteWithdrawalAddressFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };

        // Handle Delete Address method data
        case DELETE_ADDRESSES:
            return {
                ...state,
                listLoading: true,
                DeleteWithdrawalAddressFetchData: true,
                DeleteWWithdrawalAddressHistorydata: '',
                WithdrawalAddresssFetchData: true,
                AddAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                VerifyGoogleAuthFetchData: true,

            };
        // Set Delete Address success data
        case DELETE_ADDRESSES_SUCCESS:
            return {
                ...state,
                listLoading: false,
                DeleteWithdrawalAddressFetchData: false,
                DeleteWWithdrawalAddressHistorydata: action.payload,
                WithdrawalAddresssFetchData: true,
                AddAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };
        // Set Delete Address failure data
        case DELETE_ADDRESSES_FAILURE:
            return {
                ...state,
                listLoading: false,
                DeleteWithdrawalAddressFetchData: false,
                DeleteWWithdrawalAddressHistorydata: action.payload,
                WithdrawalAddresssFetchData: true,
                AddAddresssFetchData: true,
                RemoveAddresssFetchData: true,
                VerifyGoogleAuthFetchData: true,
            };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default AddressManagementReducer;



