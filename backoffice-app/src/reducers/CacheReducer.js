import { ACTION_LOGOUT, SET_CACHE } from '../actions/ActionTypes';

const initialValue = {}

//Common Caching reducer
function cacheReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialValue;
    }

    switch (action.type) {

        case ACTION_LOGOUT: {
            return initialValue;
        }

        case SET_CACHE:
            let object = action.object;
            return Object.assign({}, state, object);

        default:
            return state;
    }
}

export default cacheReducer;