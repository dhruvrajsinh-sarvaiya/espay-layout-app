// Reduceders for Transaction Charge Report By Tejas Date: 5/10/2018
import {
    GET_TRANSACTION_CHARGE,
    GET_TRANSACTION_CHARGE_SUCCESS,
    GET_TRANSACTION_CHARGE_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    transactionChargeReport: []
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    switch (action.type) {

        // get Transaction Charge Report
        case GET_TRANSACTION_CHARGE:
            return { ...state, loading: true };

        // set Data Of  Transaction Charge Report
        case GET_TRANSACTION_CHARGE_SUCCESS:
            return { ...state, transactionChargeReport: action.payload, loading: false };

        // Display Error for Transaction Charge Report failure
        case GET_TRANSACTION_CHARGE_FAILURE:
            return { ...state, loading: false, transactionChargeReport: [] };

        default: return { ...state };
    }
}