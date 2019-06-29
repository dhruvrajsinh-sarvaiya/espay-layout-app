/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Transaction History Reducers
 */

// import neccessary actions types
import {
    TRANSACTION_HISTORY,
    TRANSACTION_HISTORY_SUCCESS,
    TRANSACTION_HISTORY_FAILURE,
    TRANSACTION_HISTORY_REFRESH,
} from 'Actions/types';

// define intital state for transcation history list
const INIT_STATE = {
    loading: false,
    transactionList: [],
    errorCode: []
};

// this export is used to handle action types and its function based on Word which is define in 
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }

    switch (action.type) {

        case TRANSACTION_HISTORY:
            return { ...state, loading: true };

        case TRANSACTION_HISTORY_REFRESH:
            return { ...state, loading: true, transactionList: [] };

        case TRANSACTION_HISTORY_SUCCESS:
            return { ...state, loading: false, transactionList: action.payload, errorCode: [] };

        case TRANSACTION_HISTORY_FAILURE:
            return { ...state, loading: false, transactionList: [], errorCode: action.payload };

        default: return { ...state };
    }
}
