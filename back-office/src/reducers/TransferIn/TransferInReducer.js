import {
    GET_TRANSFERIN,
    GET_TRANSFERIN_SUCCESS,
    GET_TRANSFERIN_FAILURE,
} from "Actions/types";

// initial state
const INIT_STATE = {
    errors: {},
    TotalCount: 0,
    transferInData: [],
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {
        case GET_TRANSFERIN:
            return { ...state, loading: true, errors: {} };
        case GET_TRANSFERIN_SUCCESS:

            return {
                ...state,
                loading: false,
                transferInData: action.payload.Transfers,
                TotalCount: action.payload.TotalCount,
                errors: {},
            };
        case GET_TRANSFERIN_FAILURE:
            return { ...state, loading: false, errors: action.payload, transferInData: [], TotalCount: 0 };

        default:
            return { ...state };
    }
};
