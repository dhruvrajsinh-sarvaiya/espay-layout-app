import {
    DRAWER_CLOSE,
    DRAWER_CLOSE_SUCCESS
} from "Actions/types";
//initial state
const INITIAL_STATE = {
    Drawersclose: "",
    loading: false,
    bit: 0

};
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //List action
        case DRAWER_CLOSE:
            return {
                ...state, loading: true, Drawersclose: "", bit: 0
            };
        case DRAWER_CLOSE_SUCCESS:

            return {
                ...state,
                loading: false,
                Drawersclose: action.payload,
                bit: 1
            };
        default: return { ...state }
    }
}