/* 
    Createdby : Devang Parekh
    CreatedDate : 26-12-2018
    Description : handle State for coin slider list landing page
*/
import {
    COIN_SLIDER_LIST,
    COIN_SLIDER_LIST_SUCCESS,
    COIN_SLIDER_LIST_FAILURE
} from 'Actions/types';

// initial state
const INIT_STATE = {
    coinSliderList: [],
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        // get News
        case COIN_SLIDER_LIST:
            return { ...state,loading: true};

        // get News success
        case COIN_SLIDER_LIST_SUCCESS:
            return { ...state,loading: false, coinSliderList: action.payload };

        // get News failure
        case COIN_SLIDER_LIST_FAILURE:
            return {...state,loading: false,coinSliderList:[]};
            
        default: return { ...state };
    }
}
