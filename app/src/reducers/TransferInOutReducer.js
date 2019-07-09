// Action types for TransferInOut Module
import {
    // Get OutGoing Transaction Report
    GET_OUTGOINGTRANSACTONS_REPORT,
    GET_OUTGOINGTRANSACTONS_REPORT_SUCCESS,
    GET_OUTGOINGTRANSACTONS_REPORT_FAILURE,

    // Get InComing Transaction Report
    GET_INCOMINGTRANSACTONS_REPORT,
    GET_INCOMINGTRANSACTONS_REPORT_SUCCESS,
    GET_INCOMINGTRANSACTONS_REPORT_FAILURE,
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// Initial state for TransferInOut
const initialState = {

    //Initial State For Outgoing Transaction Request
    OutGoingTransactionData: '',
    OutGoingTransactionFetchData: true,
    Loading: false,

    // initial state for transaction in request
    incomingTransactionsData: '',
    // Loading: false,
    incomingfetchdata: true,

}

const TransferInOutReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle OutGoing Transaction Report method data
        case GET_OUTGOINGTRANSACTONS_REPORT:
            return {
                ...state,
                Loading: true,
                OutGoingTransactionData: '',
                OutGoingTransactionFetchData: true,
            };
        // Set OutGoing Transaction Report success and failure data
        case GET_OUTGOINGTRANSACTONS_REPORT_SUCCESS:
        case GET_OUTGOINGTRANSACTONS_REPORT_FAILURE:
            return {
                ...state,
                Loading: false,
                OutGoingTransactionData: action.payload,
                OutGoingTransactionFetchData: false,
            };

        // Handle Incoming Transaction Report method data
        case GET_INCOMINGTRANSACTONS_REPORT:
            return {
                ...state,
                Loading: true,
                incomingTransactionsData: '',
                incomingfetchdata: true,
            };
        // Set Incoming Transaction Report success data
        case GET_INCOMINGTRANSACTONS_REPORT_SUCCESS:
            return {
                ...state,
                Loading: false,
                incomingTransactionsData: action.payload,
                incomingfetchdata: false,
            };
        // Set Incoming Transaction Report failure data
        case GET_INCOMINGTRANSACTONS_REPORT_FAILURE:
            return {
                ...state,
                Loading: false,
                incomingTransactionsData: action.payload,
                incomingfetchdata: false
            };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default TransferInOutReducer;



