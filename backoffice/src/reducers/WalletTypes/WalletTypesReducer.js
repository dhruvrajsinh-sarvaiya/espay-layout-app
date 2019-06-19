import {
    GET_WALLET_TYPE_MASTER,
    GET_WALLET_TYPE_MASTERL_SUCCESS,
    GET_WALLET_TYPE_MASTER_FAILURE,

    DELETE_WALLET_TYPE_MASTER,
    DELETE_WALLET_TYPE_MASTER_SUCCESS,
    DELETE_WALLET_TYPE_MASTER_FAILURE,

    ADD_WALLET_TYPE_MASTER,
    ADD_WALLET_TYPE_MASTER_SUCCESS,
    ADD_WALLET_TYPE_MASTER_FAILURE,

    UPDATE_WALLET_TYPE_MASTER,
    UPDATE_WALLET_TYPE_MASTER_SUCCESS,
    UPDATE_WALLET_TYPE_MASTER_FAILURE,

    GET_WALLET_TYPE_MASTER_BY_ID,
    GET_WALLET_TYPE_MASTER_BY_ID_SUCCESS,
    GET_WALLET_TYPE_MASTER_BY_ID_FAILURE

} from "Actions/types";

const INITIAL_STATE = {
    walletTypesData: [],
    deleteStatus: {},
    getWalletTypeById: {},
    addWalletTypeMasterData: {},
    updateWalletTypeMaster: {},
    Loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_WALLET_TYPE_MASTER:
            return {
                ...state,
                deleteStatus: {},
                addWalletTypeMasterData: {},
                updateWalletTypeMaster: {},
                getWalletTypeById: {},
                Loading: true
            };

        case GET_WALLET_TYPE_MASTERL_SUCCESS:
            return {
                ...state,
                Loading: false,
                walletTypesData: action.payload,
                addWalletTypeMasterData: {},
                updateWalletTypeMaster: {},
                deleteStatus: {}
            };

        case GET_WALLET_TYPE_MASTER_FAILURE:
            return {
                ...state, Loading: false, deleteStatus: {}, addWalletTypeMasterData: {}, updateWalletTypeMaster: {},
            };

        case GET_WALLET_TYPE_MASTER_BY_ID:
            return {
                ...state,
                Loading: true,
                addWalletTypeMasterData: {},
                updateWalletTypeMaster: {},
                getWalletTypeById: {},
            };

        case GET_WALLET_TYPE_MASTER_BY_ID_SUCCESS:
            return {
                ...state,
                Loading: false,
                getWalletTypeById: action.payload
            };

        case GET_WALLET_TYPE_MASTER_BY_ID_FAILURE:
            return {
                ...state, Loading: false, getWalletTypeById: {}
            };

        case DELETE_WALLET_TYPE_MASTER:
            return {
                ...state, Loading: true,
                addWalletTypeMasterData: {},
                updateWalletTypeMaster: {},
                getWalletTypeById: {},
            };

        case DELETE_WALLET_TYPE_MASTER_SUCCESS:
            return {
                ...state,
                Loading: false,
                deleteStatus: action.payload,
            };

        case DELETE_WALLET_TYPE_MASTER_FAILURE:
            return {
                ...state, Loading: false
            };

        case ADD_WALLET_TYPE_MASTER:
            return {
                ...state, Loading: true,
                addWalletTypeMasterData: {},
                updateWalletTypeMaster: {},
                getWalletTypeById: {},
            };
        case ADD_WALLET_TYPE_MASTER_SUCCESS:
            return { ...state, Loading: false, addWalletTypeMasterData: action.payload };
        case ADD_WALLET_TYPE_MASTER_FAILURE:
            return { ...state, Loading: false,addWalletTypeMasterData: action.payload, error: action.payload };

        case UPDATE_WALLET_TYPE_MASTER:
            return {
                ...state, Loading: true, getWalletTypeById: {},
                addWalletTypeMasterData: {},
                updateWalletTypeMaster: {},
                getWalletTypeById: {},
            };
        case UPDATE_WALLET_TYPE_MASTER_SUCCESS:
            return { ...state, Loading: false, updateWalletTypeMaster: action.payload };
        case UPDATE_WALLET_TYPE_MASTER_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        default:
            return { ...state };
    }
};
