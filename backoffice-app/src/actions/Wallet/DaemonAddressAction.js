import {
    //Daemon Address List
    GET_DAEMON_ADDRESSES,
    GET_DAEMON_ADDRESSES_SUCCESS,
    GET_DAEMON_ADDRESSES_FAILURE,
    //import Address
    IMPORT_ADDRESSES,
    IMPORT_ADDRESSES_SUCCESS,
    IMPORT_ADDRESSES_FAILURE,
    //export Address
    EXPORT_ADDRESSES,
    EXPORT_ADDRESSES_SUCCESS,
    EXPORT_ADDRESSES_FAILURE,
    //confirm add and Export 
    CONFIRM_ADD_EXPORT,
    CONFIRM_ADD_EXPORT_SUCCESS,
    CONFIRM_ADD_EXPORT_FAILURE,
    //clear data
    CLEAR_DAEMON_ADDRESSES,
} from '../ActionTypes'

// Redux action get daemon addresses
export const getDaemonAddresses = (data) => ({
    type: GET_DAEMON_ADDRESSES,
    payload: data
});
// Redux action get daemon addresses success
export const getDaemonAddressesSuccess = payload => ({
    type: GET_DAEMON_ADDRESSES_SUCCESS,
    payload: payload
});
// Redux action get daemon addresses failure
export const getDaemonAddressesFailure = error => ({
    type: GET_DAEMON_ADDRESSES_FAILURE,
    payload: error
});

// Redux action import daemon addresses
export const importAddresses = request => ({
    type: IMPORT_ADDRESSES,
    request: request
});
// Redux action import daemon addresses success
export const importAddressesSuccess = payload => ({
    type: IMPORT_ADDRESSES_SUCCESS,
    payload: payload
});
// Redux action import daemon addresses failure
export const importAddressesFailure = error => ({
    type: IMPORT_ADDRESSES_FAILURE,
    payload: error
});

// Redux action export addresses
export const exportAddresses = request => ({
    type: EXPORT_ADDRESSES,
    payload: request
});
// Redux action export addresses Success
export const exportAddressesSuccess = response => ({
    type: EXPORT_ADDRESSES_SUCCESS,
    payload: response
});
// Redux action export addresses Failure
export const exportAddressesFailure = error => ({
    type: EXPORT_ADDRESSES_FAILURE,
    payload: error
});

// Redux action confirm address export
export const confirmAddExport = (data) => ({
    type: CONFIRM_ADD_EXPORT,
    payload: data
});
// Redux action confirm address export Success
export const confirmAddExportSuccess = (data) => ({
    type: CONFIRM_ADD_EXPORT_SUCCESS,
    payload: data
});
// Redux action confirm address export Failure
export const confirmAddExportFailure = (error) => ({
    type: CONFIRM_ADD_EXPORT_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearDaemonAddress = () => ({
    type: CLEAR_DAEMON_ADDRESSES,
});

