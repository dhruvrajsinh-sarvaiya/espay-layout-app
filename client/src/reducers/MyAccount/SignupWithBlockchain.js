/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup With Blockchain Reducers
 */
import {
    SIGNUP_WITH_BLOCKCHAIN,
    SIGNUP_WITH_BLOCKCHAIN_SUCCESS,
    SIGNUP_WITH_BLOCKCHAIN_FAILURE
 } from 'Actions/types';
 
 
 /*
 * Initial State
 */
const INIT_STATE = {
    loading : false,
    data : [],
    redirect : false
}

//Check Action for Signup With Blockchain...
export default (state = INIT_STATE, action) => {
    switch(action.type) 
    {
        case SIGNUP_WITH_BLOCKCHAIN:
            return { ...state, loading : true, data : '' };

        case SIGNUP_WITH_BLOCKCHAIN_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case SIGNUP_WITH_BLOCKCHAIN_FAILURE:
            return { ...state, loading : false, data : action.payload };

        default : 
            return { ...state };
    }
}