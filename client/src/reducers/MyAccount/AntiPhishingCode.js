/**
 * Anti-Phishing Code reducers (code added by Parth Jani 21-9-2018)
 */
import {
    ANTI_PHISHING_CODE,
    ANTI_PHISHING_CODE_SUCCESS,
    ANTI_PHISHING_CODE_FAILURE,
} from 'Actions/types';

/**
 * initial Anti-Phishing Code
 */
const INIT_STATE = {
    data: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        
        case ANTI_PHISHING_CODE:
            return { ...state, loading: true };

        case ANTI_PHISHING_CODE_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case ANTI_PHISHING_CODE_FAILURE:
            return { ...state, loading: false, error : action.payload };

        default: 
            return { ...state };
    }
}
