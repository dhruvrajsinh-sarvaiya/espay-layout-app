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

    //get all user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    //get all wallet type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    //get all Provider
    GET_PROVIDER_LIST,
    GET_PROVIDER_LIST_SUCCESS,
    GET_PROVIDER_LIST_FAILURE,

    //clear data
    CLEAR_DAEMON_ADDRESSES,
    ACTION_LOGOUT,
} from "../../actions/ActionTypes";

// initial state
const INITIAL_STATE = {
    //daemon address list
    daemonAddressLoading: false,
    daemonAddressData: null,

    //import 
    importLoading: false,
    importData: null,

    //export 
    exportLoading: false,
    exportData: null,

    //confirm add export 
    confiormAddExportLoading: false,
    confiormAddExportData: null,

    //for User list
    userData: null,

    //for Wallet list
    walletData: null,

    //for provider list
    providerData: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        //clear ledger response
        case CLEAR_DAEMON_ADDRESSES:
            { return INITIAL_STATE; }

        //clear data on logout
        case ACTION_LOGOUT:
            { return INITIAL_STATE; }

        // Handle Get userData Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, { userData: null })
        // Handle Set userData Data method data success   
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, { userData: action.payload })
        // Handle Get userData Data method data failure
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, { userData: action.payload })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, { walletData: null })
        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, { walletData: action.payload })
        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, { walletData: action.payload })

        // Handle Get Prtovider Data method data
        case GET_PROVIDER_LIST:
            return Object.assign({}, state, { providerData: null })
        // Set Get Prtovider Data success data
        case GET_PROVIDER_LIST_SUCCESS:
            return Object.assign({}, state, { providerData: action.payload })
        // Set Get Prtovider Data failure data
        case GET_PROVIDER_LIST_FAILURE:
            return Object.assign({}, state, { providerData: action.payload })

        // Handle Daemon Address List data
        case GET_DAEMON_ADDRESSES:
            return Object.assign({}, state, { daemonAddressLoading: true, daemonAddressData: null, })
        // Handle Daemon Address List data Success
        case GET_DAEMON_ADDRESSES_SUCCESS:
            return Object.assign({}, state, { daemonAddressLoading: false, daemonAddressData: action.payload })
        // Handle Daemon Address List data Failure
        case GET_DAEMON_ADDRESSES_FAILURE:
            return Object.assign({}, state, { daemonAddressLoading: false, daemonAddressData: action.payload })

        // Handle import Address List data
        case IMPORT_ADDRESSES:
            return Object.assign({}, state, { importLoading: true, importData: null })
        // Handle import Address List success
        case IMPORT_ADDRESSES_SUCCESS:
            return Object.assign({}, state, { importLoading: false, importData: action.payload })
        // Handle import Address List Failure
        case IMPORT_ADDRESSES_FAILURE:
            return Object.assign({}, state, { importLoading: false, importData: action.payload })

        // Handle Export Address List data
        case EXPORT_ADDRESSES:
            return Object.assign({}, state, { exportLoading: true, exportData: null })
        // Handle Export Address List success
        case EXPORT_ADDRESSES_SUCCESS:
            return Object.assign({}, state, { exportLoading: false, exportData: action.payload })
        // Handle Export Address List Failure
        case EXPORT_ADDRESSES_FAILURE:
            return Object.assign({}, state, { exportLoading: false, exportData: action.payload })

        // Handle import confirm  Address List data
        case CONFIRM_ADD_EXPORT:
            return Object.assign({}, state, { confiormAddExportLoading: true, confiormAddExportData: null })
        // Handle import confirm Address List success
        case CONFIRM_ADD_EXPORT_SUCCESS:
            return Object.assign({}, state, { confiormAddExportLoading: false, confiormAddExportData: action.payload })
        // Handle import confirm Address List Failure
        case CONFIRM_ADD_EXPORT_FAILURE:
            return Object.assign({}, state, { confiormAddExportLoading: false, confiormAddExportData: action.payload })

        default:
            return state
    }
}
