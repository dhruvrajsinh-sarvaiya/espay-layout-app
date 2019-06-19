import {
    GET_TRANSFEROUT,
    GET_TRANSFEROUT_SUCCESS,
    GET_TRANSFEROUT_FAILURE,
} from "Actions/types";

// initial state
const INIT_STATE = {
    errors: {},
    TotalCount: 0,
    transferOutData: [],
    loading: false
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {
        case GET_TRANSFEROUT:
            return { ...state, loading: true, errors: {} };
        case GET_TRANSFEROUT_SUCCESS:

            return {
                ...state,
                loading: false,
                transferOutData: action.payload.Transfers,
                TotalCount: action.payload.TotalCount,
                errors: {},
            };
        case GET_TRANSFEROUT_FAILURE:
            return { ...state, loading: false, errors: action.payload, transferOutData: [], TotalCount: 0 };

        default:
            return { ...state };
    }
};
