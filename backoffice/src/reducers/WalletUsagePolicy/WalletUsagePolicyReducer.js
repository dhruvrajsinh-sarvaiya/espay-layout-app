import {
    GET_WALLET_USAGE_POLICY,
    GET_WALLET_USAGE_POLICY_SUCCESS,
    GET_WALLET_USAGE_POLICY_FAILURE,

    UPDATE_WALLET_USAGE_POLICY_STATUS,
    UPDATE_WALLET_USAGE_POLICY_STATUS_SUCCESS,
    UPDATE_WALLET_USAGE_POLICY_STATUS_FAILURE,

    ADD_WALLET_USAGE_POLICY,
    ADD_WALLET_USAGE_POLICY_SUCCESS,
    ADD_WALLET_USAGE_POLICY_FAILURE,

    UPDATE_WALLET_USAGE_POLICY,
    UPDATE_WALLET_USAGE_POLICY_SUCCESS,
    UPDATE_WALLET_USAGE_POLICY_FAILURE,

    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    walletUsagePolicyData: [],
    updateStatus: {},
    addWalletUsagePolicyData: {},
    updateWalletUsagePolicyData: {},
    Loading: false,
    walletType: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_WALLET_USAGE_POLICY:
            return {
                ...state, Loading: true
                , addWalletUsagePolicyData: {},
                updateWalletUsagePolicyData: {},
                updateStatus: {}
            };

        case GET_WALLET_USAGE_POLICY_SUCCESS:
            return {
                ...state,
                Loading: false,
                walletUsagePolicyData: action.payload,
                addWalletUsagePolicyData: {},
                updateWalletUsagePolicyData: {},
                updateStatus: {}
            };

        case GET_WALLET_USAGE_POLICY_FAILURE:
            return {
                ...state, Loading: false,
                addWalletUsagePolicyData: {},
                updateWalletUsagePolicyData: {},
                updateStatus: {}
            };

        case UPDATE_WALLET_USAGE_POLICY_STATUS:
            return { ...state, Loading: true };

        case UPDATE_WALLET_USAGE_POLICY_STATUS_SUCCESS:
            return { ...state, Loading: false, updateStatus: action.payload };

        case UPDATE_WALLET_USAGE_POLICY_STATUS_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        case ADD_WALLET_USAGE_POLICY:
            return { ...state, Loading: true };
        case ADD_WALLET_USAGE_POLICY_SUCCESS:
            return { ...state, Loading: false, addWalletUsagePolicyData: action.payload };
        case ADD_WALLET_USAGE_POLICY_FAILURE:
            return { ...state, Loading: false, addWalletUsagePolicyData: action.payload, error: action.payload };

        case UPDATE_WALLET_USAGE_POLICY:
            return { ...state, Loading: true };
        case UPDATE_WALLET_USAGE_POLICY_SUCCESS:
            return { ...state, Loading: false, updateWalletUsagePolicyData: action.payload };
        case UPDATE_WALLET_USAGE_POLICY_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        case GET_WALLET_TYPE:
            return { ...state, Loading: true };

        case GET_WALLET_TYPE_SUCCESS:
            return {
                ...state,
                Loading: false,
                walletType: action.payload
            };

        case GET_WALLET_TYPE_FAILURE:
            return { ...state, Loading: false, walletType: action.payload };

        default:
            return { ...state };
    }
};
