/* 
    Developer : Nishant Vadgama
    Date : 19-09-2018
    FIle Comment : Daemon address list report actions
*/
import {
    //list...
    GET_DAEMON_ADDRESSES,
    GET_DAEMON_ADDRESSES_SUCCESS,
    GET_DAEMON_ADDRESSES_FAILURE,
    //import...
    IMPORT_ADDRESSES,
    IMPORT_ADDRESSES_SUCCESS,
    IMPORT_ADDRESSES_FAILURE,
    //export...
    EXPORT_ADDRESSES,
    EXPORT_ADDRESSES_SUCCESS,
    EXPORT_ADDRESSES_FAILURE,

    CONFIRM_ADD_EXPORT,
    CONFIRM_ADD_EXPORT_SUCCESS,
    CONFIRM_ADD_EXPORT_FAILURE
} from "../types";

// get daemon addresses
export const getDaemonAddresses = (request) => ({
    type: GET_DAEMON_ADDRESSES,
    request: request
});

// get daemon addresses success
export const getDaemonAddressesSuccess = payload => ({
    type: GET_DAEMON_ADDRESSES_SUCCESS,
    payload: payload
});

// get daemon addresses failure
export const getDaemonAddressesFailure = error => ({
    type: GET_DAEMON_ADDRESSES_FAILURE,
    payload: error
});

// import daemon addresses
export const importAddresses = request => ({
    type: IMPORT_ADDRESSES,
    request: request
});

// import daemon addresses success
export const importAddressesSuccess = payload => ({
    type: IMPORT_ADDRESSES_SUCCESS,
    payload: payload
});

// import daemon addresses failure
export const importAddressesFailure = error => ({
    type: IMPORT_ADDRESSES_FAILURE,
    payload: error
});

// export addresses
export const exportAddresses = request => ({
    type: EXPORT_ADDRESSES,
    payload: request
});
export const exportAddressesSuccess = response => ({
    type: EXPORT_ADDRESSES_SUCCESS,
    payload: response
});
export const exportAddressesFailure = error => ({
    type: EXPORT_ADDRESSES_FAILURE,
    payload: error
});

// confirm address export

export const confirmAddExport = (data) => ({
    type: CONFIRM_ADD_EXPORT,
    payload: data
});

export const confirmAddExportSuccess = (data) => ({
    type: CONFIRM_ADD_EXPORT_SUCCESS,
    payload: data
});

export const confirmAddExportFailure = (error) => ({
    type: CONFIRM_ADD_EXPORT_FAILURE,
    payload: error
});
