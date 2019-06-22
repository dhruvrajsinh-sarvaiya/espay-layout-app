// Action types for Cache
import { ACTION_LOGOUT, SET_CACHE } from '../actions/ActionTypes';

const initialValue = {}

//Common Caching reducer
function cacheReducer(state = initialValue, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialValue;
        }

        // Set cache method data
        case SET_CACHE:
            let object = action.object;
            return Object.assign({}, state, object);

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default cacheReducer;