// Reducer For Handle Get Api Key List By Tejas 7/3/2019
// import types
import {
    GET_API_KEY_LIST,
    GET_API_KEY_LIST_SUCCESS,
    GET_API_KEY_LIST_FAILURE,
    ADD_IP_ADDRESS,
    ADD_IP_ADDRESS_SUCCESS,
    ADD_IP_ADDRESS_FAILURE,
    UPDATE_API_KEY_LIST,
    UPDATE_API_KEY_LIST_SUCCESS,
    UPDATE_API_KEY_LIST_FAILURE,
    GENERATE_API_KEY,
    GENERATE_API_KEY_SUCCESS,
    GENERATE_API_KEY_FAILURE,
    DELETE_API_KEY,
    DELETE_API_KEY_SUCCESS,
    DELETE_API_KEY_FAILURE,
    GET_IP_WHITELIST_DATA,
    GET_IP_WHITELIST_DATA_SUCCESS,
    GET_IP_WHITELIST_DATA_FAILURE,
    REMOVE_IP_ADDRESS,
    REMOVE_IP_ADDRESS_SUCCESS,
    REMOVE_IP_ADDRESS_FAILURE,
    GET_API_KEY_BY_ID,
    GET_API_KEY_BY_ID_SUCCESS,
    GET_API_KEY_BY_ID_FAILURE,

} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    apiKeyList: [],
    loading: false,
    error: [],
    errorCode: 0,
    keyLimit: 0,
    keyCount: 0,
    addIPAddressData: [],
    addIPLoading: false,
    addIPerror: [],
    addIpBit: 0,
    updateKeyList: [],
    updateLoading: false,
    updateError: [],
    updateBit: 0,
    generateApiKeyData: [],
    generateApiKeyLoading: false,
    generateApiKeyError: [],
    generateAPiKeyBit: 0,
    deleteApiKeyData: [],
    deleteApiKeyLoading: false,
    deleteApiKeyError: [],
    deleteAPiKeyBit: 0,
    ipWhitelistData: [],
    ipWhitelistError: [],
    ipWhitelistLoading: false,
    IPCount: 0,
    IPLimit: 0,
    removeIPAddressData: [],
    removeIPLoading: false,
    removeIPerror: [],
    removeIpBit: 0,

    apiKeyListByID: [],
    apiKeyListByIDError: [],
    apiKeyListByIDLoading: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        // get Get Api Key List
        case GET_API_KEY_LIST:
            return {
                ...state,
                loading: true,
                error: [],
                apiKeyList: [],
                errorCode: 0,
                keyLimit: 0,
                keyCount: 0
            };

        // set Data Of Get Api Key List
        case GET_API_KEY_LIST_SUCCESS:
            return {
                ...state,
                apiKeyList: action.payload.Response,
                errorCode: action.payload.ErrorCode,
                loading: false,
                error: [],
                keyLimit: action.payload.APIKeyLimit,
                keyCount: action.payload.APIKeyCount
            };

        // Display Error for Get Api Key List failure
        case GET_API_KEY_LIST_FAILURE:

            return {
                ...state,
                loading: false,
                apiKeyList: [],
                errorCode: 0,
                error: action.payload,
                keyLimit: 0,
                keyCount: 0
            };

        // get add IP Address List
        case ADD_IP_ADDRESS:
            return {
                ...state,
                addIPLoading: true,
                addIPerror: [],
                addIPAddressData: [],
            };

        // set Data Of add IP Address List
        case ADD_IP_ADDRESS_SUCCESS:
            return {
                ...state,
                addIPAddressData: action.payload,
                addIPLoading: false,
                addIPerror: [],
                addIpBit: ++state.addIpBit
            };

        // Display Error for add IP Address List failure
        case ADD_IP_ADDRESS_FAILURE:

            return {
                ...state,
                addIPAddressData: [],
                addIPLoading: false,
                addIPerror: action.payload,
                addIpBit: ++state.addIpBit
            };

        // get Remove Ip Address
        case REMOVE_IP_ADDRESS:
            return {
                ...state,
                removeIPLoading: true,
                removeIPerror: [],
                removeIPAddressData: [],
            };

        // set Data Of Remove Ip Address
        case REMOVE_IP_ADDRESS_SUCCESS:
            return {
                ...state,
                removeIPAddressData: action.payload,
                removeIPLoading: false,
                removeIPerror: [],
                removeIpBit: ++state.removeIpBit
            };

        // Display Error for Remove Ip Address failure
        case REMOVE_IP_ADDRESS_FAILURE:

            return {
                ...state,
                removeIPAddressData: [],
                removeIPLoading: false,
                removeIPerror: action.payload,
                removeIpBit: ++state.removeIpBit
            };


        // get Update Api Key
        case UPDATE_API_KEY_LIST:
            return {
                ...state,
                updateKeyList: [],
                updateLoading: true,
                updateError: []
            };

        // set Data Of Update Api Key
        case UPDATE_API_KEY_LIST_SUCCESS:
            return {
                ...state,
                updateKeyList: action.payload,
                updateLoading: false,
                updateError: [],
                updateBit: ++state.updateBit
            };

        // Display Error for Update Api Key failure
        case UPDATE_API_KEY_LIST_FAILURE:

            return {
                ...state,
                updateKeyList: [],
                updateLoading: false,
                updateError: action.payload,
                updateBit: ++state.updateBit
            };

        // Generate Api Key
        case GENERATE_API_KEY:
            return {
                ...state,
                generateApiKeyData: [],
                generateApiKeyLoading: true,
                generateApiKeyError: []
            };

        // set Data Of Generate Api Key
        case GENERATE_API_KEY_SUCCESS:
            return {
                ...state,
                generateApiKeyData: action.payload.Response,
                generateApiKeyLoading: false,
                generateApiKeyError: [],
                generateAPiKeyBit: ++state.generateAPiKeyBit
            };

        // Display Error for Generate Api Key failure
        case GENERATE_API_KEY_FAILURE:

            return {
                ...state,
                generateApiKeyData: [],
                generateApiKeyLoading: false,
                generateApiKeyError: action.payload,
                generateAPiKeyBit: ++state.generateAPiKeyBit
            };

        // delete Api Key
        case DELETE_API_KEY:
            return {
                ...state,
                deleteApiKeyData: [],
                deleteApiKeyLoading: true,
                deleteApiKeyError: []
            };

        // set Data Of delete Api Key
        case DELETE_API_KEY_SUCCESS:
            return {
                ...state,
                deleteApiKeyData: action.payload,
                deleteApiKeyLoading: false,
                deleteApiKeyError: [],
                deleteAPiKeyBit: ++state.deleteAPiKeyBit
            };

        // Display Error for delete Api Key failure
        case DELETE_API_KEY_FAILURE:

            return {
                ...state,
                deleteApiKeyData: [],
                deleteApiKeyLoading: false,
                deleteApiKeyError: action.payload,
                deleteAPiKeyBit: ++state.deleteAPiKeyBit
            };

        // get Ip White list
        case GET_IP_WHITELIST_DATA:
            return {
                ...state,
                ipWhitelistData: [],
                ipWhitelistError: [],
                ipWhitelistLoading: true,
                IPCount: 0,
                IPLimit: 0,
            };

        // set Data Of get Ip White list
        case GET_IP_WHITELIST_DATA_SUCCESS:
            return {
                ...state,
                ipWhitelistData: action.payload.Response,
                ipWhitelistLoading: false,
                ipWhitelistError: [],
                IPCount: action.payload.IPCount,
                IPLimit: action.payload.IPLimitCount,
            };

        // Display Error for get Ip White list failure
        case GET_IP_WHITELIST_DATA_FAILURE:

            return {
                ...state,
                ipWhitelistData: [],
                ipWhitelistLoading: false,
                ipWhitelistError: action.payload,
                IPCount: 0,
                IPLimit: 0,
            };

        // get Get Api Key List
        case GET_API_KEY_BY_ID:
            return {
                ...state,
                apiKeyListByID: [],
                apiKeyListByIDError: [],
                apiKeyListByIDLoading: true
            };

        // set Data Of Get Api Key List
        case GET_API_KEY_BY_ID_SUCCESS:
            return {
                ...state,
                apiKeyListByID: action.payload.Response,
                apiKeyListByIDError: [],
                apiKeyListByIDLoading: false
            };

        // Display Error for Get Api Key List failure
        case GET_API_KEY_BY_ID_FAILURE:

            return {
                ...state,
                apiKeyListByID: [],
                apiKeyListByIDError: action.payload,
                apiKeyListByIDLoading: false
            };

        default:
            return { ...state };
    }
};
