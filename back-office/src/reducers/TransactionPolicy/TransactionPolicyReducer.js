import {
    GET_TRANSACTION_POLICY,
    GET_TRANSACTION_POLICY_SUCCESS,
    GET_TRANSACTION_POLICY_FAILURE,

    UPDATE_TRANSACTION_POLICY_STATUS,
    UPDATE_TRANSACTION_POLICY_STATUS_SUCCESS,
    UPDATE_TRANSACTION_POLICY_STATUS_FAILURE,

    ADD_TRANSACTION_POLICY,
    ADD_TRANSACTION_POLICY_SUCCESS,
    ADD_TRANSACTION_POLICY_FAILURE,

    UPDATE_TRANSACTION_POLICY,
    UPDATE_TRANSACTION_POLICY_SUCCESS,
    UPDATE_TRANSACTION_POLICY_FAILURE,

    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    GET_ROLE_DETAILS,
    GET_ROLE_DETAILS_SUCCESS,
    GET_ROLE_DETAILS_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    transactionPolicyData: [],
    updateStatus: {},
    addTransactionData: {},
    updateTransactionData: {},
    Loading: false,
    walletTransactionType: [],
    roleDetails: []
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }
    switch (action.type) {
        case GET_TRANSACTION_POLICY:
            return { ...state, Loading: true, addTransactionData: {}, updateTransactionData: {}, updateStatus: {} };

        case GET_TRANSACTION_POLICY_SUCCESS:
            return {
                ...state,
                Loading: false,
                transactionPolicyData: action.payload,
                addTransactionData: {},
                updateTransactionData: {},
                updateStatus: {}
            };

        case GET_TRANSACTION_POLICY_FAILURE:
            return { ...state, Loading: false, addTransactionData: {}, updateTransactionData: {}, updateStatus: {} };

        case UPDATE_TRANSACTION_POLICY_STATUS:
            return { ...state, Loading: true ,addTransactionData:{}};

        case UPDATE_TRANSACTION_POLICY_STATUS_SUCCESS:
            return { ...state, Loading: false, updateStatus: action.payload ,addTransactionData:{}};

        case UPDATE_TRANSACTION_POLICY_STATUS_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        case ADD_TRANSACTION_POLICY:
            return { ...state, Loading: true };
        case ADD_TRANSACTION_POLICY_SUCCESS:
            return { ...state, Loading: false, addTransactionData: action.payload };
        case ADD_TRANSACTION_POLICY_FAILURE:
            return { ...state, Loading: false, addTransactionData: action.payload,error: action.payload };

        case UPDATE_TRANSACTION_POLICY:
            return { ...state, Loading: true ,addTransactionData: {}};
        case UPDATE_TRANSACTION_POLICY_SUCCESS:
            return { ...state, Loading: false, updateTransactionData: action.payload ,addTransactionData: {}};
        case UPDATE_TRANSACTION_POLICY_FAILURE:
            return { ...state, Loading: false, error: action.payload ,addTransactionData: {}};

        case GET_WALLET_TRANSACTION_TYPE:
            return { ...state, Loading: true };

        case GET_WALLET_TRANSACTION_TYPE_SUCCESS:
            return {
                ...state,
                Loading: false,
                walletTransactionType: action.payload
            };

        case GET_WALLET_TRANSACTION_TYPE_FAILURE:
            return { ...state, Loading: false, walletTransactionType : [] };

        case GET_ROLE_DETAILS:
            return { ...state, Loading: true };

        case GET_ROLE_DETAILS_SUCCESS:
            return {
                ...state,
                Loading: false,
                roleDetails: action.payload
            };

        case GET_ROLE_DETAILS_FAILURE:
            return { ...state, Loading: false };


        default:
            return { ...state };
    }
};
