import {
    // Get Trading Ledgers
    GET_TRADING_LEDGERS,
    GET_TRADING_LEDGERS_SUCCESS,
    GET_TRADING_LEDGERS_FAILURE,

    // Clear Data
    CLEAR_TRADING_LEDGERS,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const initialState = {

    //Trading Ledgers List
    tradingLedgers: null,
    isLoadingLedger: false,
    tradingLedgerError: false
}

export default function tradingLedgerBOReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // To reset initial state on clear data
        case CLEAR_TRADING_LEDGERS: {
            return initialState;
        }

        // Handle Get Trading Ledger method data
        case GET_TRADING_LEDGERS: {
            return Object.assign({}, state, {
                tradingLedgers: null,
                isLoadingLedger: true,
                tradingLedgerError: false,
            })
        }
        // Set Trading Ledgers List success data
        case GET_TRADING_LEDGERS_SUCCESS: {
            return Object.assign({}, state, {
                tradingLedgers: action.payload,
                isLoadingLedger: false,
                tradingLedgerError: false
            })
        }
        // Set Trading Ledgers List failure data
        case GET_TRADING_LEDGERS_FAILURE: {
            return Object.assign({}, state, {
                tradingLedgers: null,
                isLoadingLedger: false,
                tradingLedgerError: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}