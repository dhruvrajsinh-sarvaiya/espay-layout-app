import {
    GET_COMMISSION_TYPE_DETAIL,
    GET_COMMISSION_TYPE_DETAIL_SUCCESS,
    GET_COMMISSION_TYPE_DETAIL_FAILURE,

    UPDATE_COMMISSION_TYPE_STATUS,
    UPDATE_COMMISSION_TYPE_STATUS_SUCCESS,
    UPDATE_COMMISSION_TYPE_STATUS_FAILURE,

    ADD_COMMISSION_TYPE,
    ADD_COMMISSION_TYPE_SUCCESS,
    ADD_COMMISSION_TYPE_FAILURE,

    UPDATE_COMMISSION_TYPE,
    UPDATE_COMMISSION_TYPE_SUCCESS,
    UPDATE_COMMISSION_TYPE_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    commissionTypeData: [],
    updateStatus: {},
    addCommissionTypeData: {},
    updateCommissionTypeData: {},
    Loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_COMMISSION_TYPE_DETAIL:
            return {
                ...state, Loading: true
                , addCommissionTypeData: {},
                updateCommissionTypeData: {},
                updateStatus: {}
            };

        case GET_COMMISSION_TYPE_DETAIL_SUCCESS:
            return {
                ...state,
                Loading: false,
                commissionTypeData: action.payload,
                addCommissionTypeData: {},
                updateCommissionTypeData: {},
                updateStatus: {}
            };

        case GET_COMMISSION_TYPE_DETAIL_FAILURE:
            return {
                ...state, Loading: false,
                addCommissionTypeData: {},
                updateCommissionTypeData: {},
                updateStatus: {}
            };

        case UPDATE_COMMISSION_TYPE_STATUS:
            return { ...state, Loading: true };

        case UPDATE_COMMISSION_TYPE_STATUS_SUCCESS:
            return { ...state, Loading: false, updateStatus: action.payload };

        case UPDATE_COMMISSION_TYPE_STATUS_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        case ADD_COMMISSION_TYPE:
            return { ...state, Loading: true };
        case ADD_COMMISSION_TYPE_SUCCESS:
            return { ...state, Loading: false, addCommissionTypeData: action.payload };
        case ADD_COMMISSION_TYPE_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        case UPDATE_COMMISSION_TYPE:
            return { ...state, Loading: false };
        case UPDATE_COMMISSION_TYPE_SUCCESS:
            return { ...state, Loading: false, updateCommissionTypeData: action.payload };
        case UPDATE_COMMISSION_TYPE_FAILURE:
            return { ...state, Loading: false, error: action.payload };

        default:
            return { ...state };
    }
};
