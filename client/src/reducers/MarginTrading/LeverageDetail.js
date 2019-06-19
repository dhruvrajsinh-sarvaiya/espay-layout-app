// Dev: Devang Parekh 
// Date : 6-3-2019
// reducer For get leverage detail for margin trading dashboard ()

import {
    GET_LEVERAGE_DETAIL,
    GET_LEVERAGE_DETAIL_SUCCESS,
    GET_LEVERAGE_DETAIL_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    leverageDetail: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get leverage detail
        case GET_LEVERAGE_DETAIL:
            return { ...state, loading: true };

        // set Data Of leverage detail
        case GET_LEVERAGE_DETAIL_SUCCESS:

            return { ...state, loading: false, leverageDetail: action.payload };

        // Display Error for leverage detail failure
        case GET_LEVERAGE_DETAIL_FAILURE:

            return { ...state, loading: false, leverageDetail: [] };

        default: return { ...state };
    }
}