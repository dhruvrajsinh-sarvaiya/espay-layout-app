// Action types for Device Whitelist Module
import {
    // Device History
    DEVICEHISTORY_FETCH,
    DEVICEHISTORY_SUCCESS,
    DEVICEHISTORY_FAILURE,

    // Delete Device Whitelist
    DELETE_DEVICE_WHITELIST,
    DELETE_DEVICE_WHITELIST_SUCCESS,
    DELETE_DEVICE_WHITELIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Disable Device Whitelist
    DISABLE_DEVICE_WHITELIST,
    DISABLE_DEVICE_WHITELIST_SUCCESS,
    DISABLE_DEVICE_WHITELIST_FAILURE,

    // Enable Device Whitelist
    ENABLE_DEVICE_WHITELIST,
    ENABLE_DEVICE_WHITELIST_SUCCESS,
    ENABLE_DEVICE_WHITELIST_FAILURE,

    // Clear Device Whitelist
    CLEAR_DEVICE_WHITELIST_DATA,
} from '../actions/ActionTypes'

// Initial state for Device Whitelist
const INITIAL_STATE = {
    // Device Whitelist History
    isLoadingDeviceHistory: false,
    deviceHistory: null,
    errorDeviceHistory: false,

    // Delete Device Whitelist 
    isDeletingDevice: false,
    deleteHistory: null,
    errorDeleteHistory: false,

    // Disable Device
    isDesablingDevice: false,
    DisableDeviceWhitelistdata: null,
    errorDisableDevice: false,

    // Enable Device
    isEnablingDevice: false,
    EnableDeviceWhitelistdata: null,
    errorEnableDevice: false,
}

export default function DeviceHistoryReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Clear device whitelist data
        case CLEAR_DEVICE_WHITELIST_DATA: {
            return INITIAL_STATE;
        }

        // Handle device whitelist method data
        case DEVICEHISTORY_FETCH:
            return {
                ...state,
                isLoadingDeviceHistory: true,
                deviceHistory: null,
                errorDeviceHistory: false,
                deleteHistory: null,
                DisableDeviceWhitelistdata: null,
                EnableDeviceWhitelistdata: null,
            }
        // Set device whitelist success data
        case DEVICEHISTORY_SUCCESS:
            return {
                ...state,
                isLoadingDeviceHistory: false,
                deviceHistory: action.data,
                errorDeviceHistory: false,
            }
        // Set device whitelist failure data
        case DEVICEHISTORY_FAILURE:
            return {
                ...state,
                isLoadingDeviceHistory: false,
                deviceHistory: null,
                errorDeviceHistory: true,
            }

        // Handle delete device whitelist method data
        case DELETE_DEVICE_WHITELIST:
            return {
                ...state,
                isDeletingDevice: true,
                deleteHistory: null,
                errorDeleteHistory: false,
            }
        // Set delete device whitelist success data
        case DELETE_DEVICE_WHITELIST_SUCCESS:
            return {
                ...state,
                isDeletingDevice: false,
                deleteHistory: action.payload,
                errorDeleteHistory: false,
            }
        // Set delete device whitelist failure data
        case DELETE_DEVICE_WHITELIST_FAILURE:
            return {
                ...state,
                isDeletingDevice: false,
                deleteHistory: null,
                errorDeleteHistory: true,
            }

        // Handle enable device whitelist method data
        case ENABLE_DEVICE_WHITELIST:
            return {
                ...state,
                isEnablingDevice: true,
                EnableDeviceWhitelistdata: null,
                errorEnableDevice: false,
            }
        // Set enable device whitelist success data
        case ENABLE_DEVICE_WHITELIST_SUCCESS:
            return {
                ...state,
                isEnablingDevice: false,
                EnableDeviceWhitelistdata: action.payload,
                errorEnableDevice: false,
            }
        // Set enable device whitelist failure data
        case ENABLE_DEVICE_WHITELIST_FAILURE:
            return {
                ...state,
                isEnablingDevice: false,
                EnableDeviceWhitelistdata: action.payload,
                errorEnableDevice: true,
            }

        // Handle disable device whitelist method data
        case DISABLE_DEVICE_WHITELIST:
            return {
                ...state,
                isDesablingDevice: true,
                DisableDeviceWhitelistdata: null,
                errorDisableDevice: false,
            }
        // Set disable device whitelist success data
        case DISABLE_DEVICE_WHITELIST_SUCCESS:
            return {
                ...state,
                isDesablingDevice: false,
                DisableDeviceWhitelistdata: action.payload,
                errorDisableDevice: false,
            }
        // Set disable device whitelist failure data
        case DISABLE_DEVICE_WHITELIST_FAILURE:
            return {
                ...state,
                isDesablingDevice: false,
                DisableDeviceWhitelistdata: action.payload,
                errorDisableDevice: true,
            }
        
        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
} 