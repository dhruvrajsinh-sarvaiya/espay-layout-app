// Action types for Api Key Module
import {
    // Get Api Key List
    GET_API_KEY_LIST,
    GET_API_KEY_LIST_SUCCESS,
    GET_API_KEY_LIST_FAILURE,

    // Add Ip Address
    ADD_IP_ADDRESS,
    ADD_IP_ADDRESS_SUCCESS,
    ADD_IP_ADDRESS_FAILURE,

    // Update Api Key List
    UPDATE_API_KEY_LIST,
    UPDATE_API_KEY_LIST_SUCCESS,
    UPDATE_API_KEY_LIST_FAILURE,

    // Generate Api Key
    GENERATE_API_KEY,
    GENERATE_API_KEY_SUCCESS,
    GENERATE_API_KEY_FAILURE,

    // Get Ip Whitelist Data
    GET_IP_WHITELIST_DATA,
    GET_IP_WHITELIST_DATA_SUCCESS,
    GET_IP_WHITELIST_DATA_FAILURE,

    // Remove Ip Address
    REMOVE_IP_ADDRESS,
    REMOVE_IP_ADDRESS_SUCCESS,
    REMOVE_IP_ADDRESS_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Verify 2FA Api Key
    VERIFY_2FA_API_KEY,
    VERIFY_2FA_API_KEY_SUCCESS,
    VERIFY_2FA_API_KEY_FAILURE,

    // Get Api Key By Id
    GET_API_KEY_BY_ID,
    GET_API_KEY_BY_ID_SUCCESS,
    GET_API_KEY_BY_ID_FAILURE,

    // Clear Api Key
    CLEAR_API_KEY_DATA
} from "../actions/ActionTypes";

// Set Initial State for Api Key Module
const INITIAL_STATE = {
    // Api Key List
    apiKeyList: null,
    apiKeyListLoading: false,
    error: null,
    errorCode: 0,
    keyLimit: 0,
    keyCount: 0,

    // Add IP Address Data
    addIPAddressData: null,
    addIPLoading: false,
    addIPerror: null,
    addIpBit: 0,

    // Update Key List
    updateKeyList: null,
    updateLoading: false,
    updateError: null,
    updateBit: 0,

    // Generate Api Key
    generateApiKeyData: null,
    generateApiKeyLoading: false,
    generateApiKeyError: null,
    generateAPiKeyBit: 0,

    // Delete Api Key
    deleteApiKeyData: null,
    deleteApiKeyLoading: false,
    deleteApiKeyError: null,
    deleteAPiKeyBit: 0,

    // Ip Whitelist 
    ipWhitelistData: null,
    ipWhitelistError: null,
    ipWhitelistLoading: false,
    IPCount: 0,
    IPLimit: 0,

    // Remove Ip Address
    removeIPAddressData: null,
    removeIPLoading: false,
    removeIPerror: null,
    removeIpBit: 0,

    // User Active Plan
    UserActivePlanData: null,
    UserActivePlanLoading: null,
    UserActivePlanError: null,

    // for 2FA Google Auth Verify
    VerifyGoogleAuthData: null,
    VerifyGoogleAuthIsFetching: false,

    //to get view api key
    apiKeyListByID: null,
    apiKeyListByIDError: null,
    apiKeyListByIDLoading: false,
};

// Initial state for Api Key
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

        // Clear Api Key Data
        case CLEAR_API_KEY_DATA:
            return {
                VerifyGoogleAuthData: null,
                VerifyGoogleAuthIsFetching: false,

                generateApiKeyData: null,
                generateApiKeyLoading: false,

                addIPAddressData: null,
                addIPLoading: false,

                updateKeyList: null,
                updateLoading: true,

                removeIPAddressData: null,
                removeIPLoading: false,

                apiKeyListByID: null,
                apiKeyListByIDLoading: false,

                apiKeyList: null,
                apiKeyListLoading: false,

                ipWhitelistData: null,
                ipWhitelistLoading: false,
            };

        // Handle Verify 2FA method data
        case VERIFY_2FA_API_KEY:
            return {
                ...state,
                VerifyGoogleAuthIsFetching: true,
                VerifyGoogleAuthData: null,
            };
        // Set Verify 2FA success and failure data
        case VERIFY_2FA_API_KEY_SUCCESS:
        case VERIFY_2FA_API_KEY_FAILURE:
            return {
                ...state,
                VerifyGoogleAuthIsFetching: false,
                VerifyGoogleAuthData: action.payload,
            };

        // Handle Get Api Key List method data
        case GET_API_KEY_LIST:
            return {
                ...state,
                apiKeyListLoading: true,
                error: null,
                apiKeyList: null,
                errorCode: 0,
                keyLimit: 0,
                keyCount: 0
            };

        // Set Get Api Key List success data
        case GET_API_KEY_LIST_SUCCESS:
            return {
                ...state,
                apiKeyList: action.payload,
                errorCode: action.payload.ErrorCode,
                apiKeyListLoading: false,
                error: null,
                keyLimit: action.payload.APIKeyLimit,
                keyCount: action.payload.APIKeyCount
            };

        // Set Get Api Key List failure data
        case GET_API_KEY_LIST_FAILURE:

            return {
                ...state,
                apiKeyListLoading: false,
                apiKeyList: null,
                errorCode: 0,
                error: action.payload,
                keyLimit: 0,
                keyCount: 0
            };

        // Handle Add Ip Address method data
        case ADD_IP_ADDRESS:
            return {
                ...state,
                addIPLoading: true,
                addIPerror: null,
                addIPAddressData: null,
            };
        // Set Add Ip Address success data
        case ADD_IP_ADDRESS_SUCCESS:
            return {
                ...state,
                addIPAddressData: action.payload,
                addIPLoading: false,
                addIPerror: null,
                addIpBit: ++state.addIpBit
            };
        // Set Add Ip Address failure data
        case ADD_IP_ADDRESS_FAILURE:

            return {
                ...state,
                addIPAddressData: null,
                addIPLoading: false,
                addIPerror: action.payload,
                addIpBit: ++state.addIpBit
            };

        // Handle Remove Ip Address method data
        case REMOVE_IP_ADDRESS:
            return {
                ...state,
                removeIPLoading: true,
                removeIPerror: null,
                removeIPAddressData: null,
            };
        // Set Remove Ip Address success data
        case REMOVE_IP_ADDRESS_SUCCESS:
            return {
                ...state,
                removeIPAddressData: action.payload,
                removeIPLoading: false,
                removeIPerror: null,
                removeIpBit: ++state.removeIpBit
            };
        // Set Remove Ip Address failure data
        case REMOVE_IP_ADDRESS_FAILURE:

            return {
                ...state,
                removeIPAddressData: null,
                removeIPLoading: false,
                removeIPerror: action.payload,
                removeIpBit: ++state.removeIpBit
            };

        // Handle Update Api Key List method data
        case UPDATE_API_KEY_LIST:
            return {
                ...state,
                updateKeyList: null,
                updateLoading: true,
                updateError: null
            };
        // Set Update Api Key List success data
        case UPDATE_API_KEY_LIST_SUCCESS:
            return {
                ...state,
                updateKeyList: action.payload,
                updateLoading: false,
                updateError: null,
                updateBit: ++state.updateBit
            };
        // Set Update Api Key List failure data
        case UPDATE_API_KEY_LIST_FAILURE:

            return {
                ...state,
                updateKeyList: null,
                updateLoading: false,
                updateError: action.payload,
                updateBit: ++state.updateBit
            };

        // Handle Generate Api Key method data
        case GENERATE_API_KEY:
            return {
                ...state,
                generateApiKeyData: null,
                generateApiKeyLoading: true,
                generateApiKeyError: null
            };
        // Set Generate Api Key success data
        case GENERATE_API_KEY_SUCCESS:
            return {
                ...state,
                generateApiKeyData: action.payload,
                generateApiKeyLoading: false,
                generateApiKeyError: null,
            };
        // Set Generate Api Key failure data
        case GENERATE_API_KEY_FAILURE:

            return {
                ...state,
                generateApiKeyData: null,
                generateApiKeyLoading: false,
                generateApiKeyError: action.payload,
            };

        // Handle IP whitelist method data
        case GET_IP_WHITELIST_DATA:
            return {
                ...state,
                ipWhitelistData: null,
                ipWhitelistError: null,
                ipWhitelistLoading: true,
            };
        // Set IP whitelist success data
        case GET_IP_WHITELIST_DATA_SUCCESS:
            return {
                ...state,
                ipWhitelistData: action.payload,
                ipWhitelistLoading: false,
                ipWhitelistError: null,
            };
        // Set IP whitelist failure data
        case GET_IP_WHITELIST_DATA_FAILURE:
            return {
                ...state,
                ipWhitelistData: null,
                ipWhitelistLoading: false,
                ipWhitelistError: action.payload,
            };

        // Handle Api Key By ID method data
        case GET_API_KEY_BY_ID:
            return {
                ...state,
                apiKeyListByID: null,
                apiKeyListByIDError: null,
                apiKeyListByIDLoading: true
            };
        // Set Api Key By ID success data
        case GET_API_KEY_BY_ID_SUCCESS:
            return {
                ...state,
                apiKeyListByID: action.payload,
                apiKeyListByIDError: null,
                apiKeyListByIDLoading: false
            };
        // Set Api Key By ID failure data
        case GET_API_KEY_BY_ID_FAILURE:

            return {
                ...state,
                apiKeyListByID: null,
                apiKeyListByIDError: action.payload,
                apiKeyListByIDLoading: false
            };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};
