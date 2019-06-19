/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-09-2018
    UpdatedDate : 17-09-2018
    Description : ContactUs Reducer action manager
	Changed by Jayesh on 29-10-2018 Complete Contact Module
*/
// action types
import {
    ADD_NEW_CONTACTUS,
    ADD_CONTACTUS_SUCCESS,
    ADD_CONTACTUS_FAILURE
} from 'Actions/types';

/**
 * initial state
 */
const INIT_STATE = {
    loading: false,
    data: []
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {

        // add new Contactus
        case ADD_NEW_CONTACTUS:
            return { ...state, loading: true, data:''};
        
        case ADD_CONTACTUS_SUCCESS:
            return { ...state, loading: false, data:action.payload};

        case ADD_CONTACTUS_FAILURE:
            return {...state, loading: false, data:action.payload};

        default: return { ...state };
    }
}
