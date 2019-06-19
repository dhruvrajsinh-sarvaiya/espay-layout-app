import {
    GET_CHARGE_TYPE_DETAIL,
    GET_CHARGE_TYPE_DETAIL_SUCCESS,
    GET_CHARGE_TYPE_DETAIL_FAILURE,

    UPDATE_CHARGE_TYPE_STATUS,
    UPDATE_CHARGE_TYPE_STATUS_SUCCESS,
    UPDATE_CHARGE_TYPE_STATUS_FAILURE,

    ADD_CHARGE_TYPE,
    ADD_CHARGE_TYPE_SUCCESS,
    ADD_CHARGE_TYPE_FAILURE,

    UPDATE_CHARGE_TYPE,
    UPDATE_CHARGE_TYPE_SUCCESS,
    UPDATE_CHARGE_TYPE_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    chargeTypeData: [],
    updateStatus: {},
    addChargeTypeData: {},
    updateChargeTypeData: {},
    Loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CHARGE_TYPE_DETAIL:
            return {
                ...state, Loading: true
                , addChargeTypeData: {},
                updateChargeTypeData: {},
                updateStatus:{}
            };

        case GET_CHARGE_TYPE_DETAIL_SUCCESS:
            return {
                ...state,
                Loading: false,
                chargeTypeData: action.payload,
                addChargeTypeData: {},
                updateChargeTypeData: {},
                updateStatus:{}
            };

        case GET_CHARGE_TYPE_DETAIL_FAILURE:
            return {
                ...state, Loading: false,
                addChargeTypeData: {},
                updateChargeTypeData: {},
                updateStatus:{}
            };

        case UPDATE_CHARGE_TYPE_STATUS:
            return { ...state, Loading: true };

        case UPDATE_CHARGE_TYPE_STATUS_SUCCESS:
            return { ...state, Loading: false, updateStatus: action.payload };

        case UPDATE_CHARGE_TYPE_STATUS_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        case ADD_CHARGE_TYPE:
            return { ...state, Loading: true };
        case ADD_CHARGE_TYPE_SUCCESS:
            return { ...state, Loading: false, addChargeTypeData: action.payload };
        case ADD_CHARGE_TYPE_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        case UPDATE_CHARGE_TYPE:
            return { ...state, Loading: false };
        case UPDATE_CHARGE_TYPE_SUCCESS:
            return { ...state, Loading: false, updateChargeTypeData: action.payload };
        case UPDATE_CHARGE_TYPE_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        default:
            return { ...state };
    }
};
