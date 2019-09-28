import {

    //For IP Whitelist
    LIST_IP_WHITELIST,
    LIST_IP_WHITELIST_SUCCESS,
    LIST_IP_WHITELIST_FAILURE,

    //For Add IP to WhiteList
    ADD_IP_TO_WHITELIST,
    ADD_IP_TO_WHITELIST_SUCCESS,
    ADD_IP_TO_WHITELIST_FAILURE,

    //For Delete IP to WhiteList
    DELETE_IP_TO_WHITELIST,
    DELETE_IP_TO_WHITELIST_SUCCESS,
    DELETE_IP_TO_WHITELIST_FAILURE,

    //For Update IP To Whitelist
    UPDATE_IP_TO_WHITELIST,
    UPDATE_IP_TO_WHITELIST_SUCCESS,
    UPDATE_IP_TO_WHITELIST_FAILURE,

    // Clear data
    ACTION_LOGOUT,
    CLEAR_IP_WHITELIST_DATA,

} from '../../actions/ActionTypes'

/**
 * initial IP Whitelist
 */
const INITIAL_STATE = {

    //Initial State For IP Whitelist
    IPWhitelistData: null,
    IPWhitelistLoading: false,
    IPWhitelistError: false,

    //Initial State For Add IP To Whitelist
    AddIpToWhitelistData: null,
    AddIpToWhitelistLoading: false,
    AddIpToWhitelistError: false,

    //Initial State For Delete IP From Whitelist
    DeleteIpWhitelistData: null,
    DeleteIpWhitelistLoading: false,
    DeleteIpWhitelistError: false,

    //Initial State For Enable IP From Whitelist
    UpdateIpWhitelistData: null,
    UpdateIpWhitelistLoading: false,
    UpdateIpWhitelistError: false,
};

export default function IPWhitelistHistoryReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle IP Whitelist method data
        case LIST_IP_WHITELIST:
            return Object.assign({}, state, {
                IPWhitelistData: null,
                IPWhitelistLoading: true,
            })
        // Set IP Whitelist success data
        case LIST_IP_WHITELIST_SUCCESS:
            return Object.assign({}, state, {
                IPWhitelistData: action.payload,
                IPWhitelistLoading: false,
            })
        // Set IP Whitelist failure data
        case LIST_IP_WHITELIST_FAILURE:
            return Object.assign({}, state, {
                IPWhitelistData: null,
                IPWhitelistLoading: false,
                IPWhitelistError: true,
            })

        // Handle Add IP Whitelist method data
        case ADD_IP_TO_WHITELIST:
            return Object.assign({}, state, {
                AddIpToWhitelistData: null,
                AddIpToWhitelistLoading: true,
            })
        // Set Add IP Whitelist success data
        case ADD_IP_TO_WHITELIST_SUCCESS:
            return Object.assign({}, state, {
                AddIpToWhitelistData: action.payload,
                AddIpToWhitelistLoading: false,
            })
        // Set Add IP Whitelist failure data
        case ADD_IP_TO_WHITELIST_FAILURE:
            return Object.assign({}, state, {
                AddIpToWhitelistData: null,
                AddIpToWhitelistLoading: false,
                AddIpToWhitelistError: true,
            })

        // Handle Delete IP Whitelist method data
        case DELETE_IP_TO_WHITELIST:
            return Object.assign({}, state, {
                DeleteIpWhitelistData: null,
                DeleteIpWhitelistLoading: true,
            })

        // Set Delete IP Whitelist success data
        case DELETE_IP_TO_WHITELIST_SUCCESS:
            return Object.assign({}, state, {
                DeleteIpWhitelistData: action.payload,
                DeleteIpWhitelistLoading: false,
            })
        // Set Delete IP Whitelist failure data
        case DELETE_IP_TO_WHITELIST_FAILURE:
            return Object.assign({}, state, {
                DeleteIpWhitelistData: null,
                DeleteIpWhitelistLoading: false,
                DeleteIpWhitelistError: false,
            })

        // Handle Update IP to Whitelist method data
        case UPDATE_IP_TO_WHITELIST:
            return Object.assign({}, state, {
                UpdateIpWhitelistData: null,
                UpdateIpWhitelistLoading: true,
            })
        // Set Update IP to Whitelist success data
        case UPDATE_IP_TO_WHITELIST_SUCCESS:
            return Object.assign({}, state, {
                UpdateIpWhitelistData: action.payload,
                UpdateIpWhitelistLoading: false,

            })
        // Set Update IP to Whitelist failure data
        case UPDATE_IP_TO_WHITELIST_FAILURE:
            return Object.assign({}, state, {
                UpdateIpWhitelistData: null,
                UpdateIpWhitelistLoading: false,
                UpdateIpWhitelistError: false,
            })

        // Handle Clear IP to Whitelist method data
        case CLEAR_IP_WHITELIST_DATA:
            return INITIAL_STATE

        default:
            return state;
    }
}