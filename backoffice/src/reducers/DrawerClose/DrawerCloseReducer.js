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
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        //List action
        case DRAWER_CLOSE:
            return {
                ...state, loading: true, Drawersclose: "", bit: 0
            };
        case DRAWER_CLOSE_SUCCESS:

            // if (state.bit === 0) {
            //     state.bit = 1;
            // }

            // setTimeout(function () {
            //     state.bit = 2;
            //     // console.log("TIMEOUT", state.bit);
            // }, 1000);

            return {
                ...state,
                loading: false,
                Drawersclose: action.payload,
                bit: 1
            };
            // console.log("bit reducer 2 ", state.bit)
        default: return { ...state }
    }
}