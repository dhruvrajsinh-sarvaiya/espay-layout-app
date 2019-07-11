/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 29-10-2018
    UpdatedDate : 29-10-2018
    Description : ContactUs Reducer action manager
*/
// action types
import {
    GET_CONTACTUS,
    GET_CONTACTUS_SUCCESS,
    GET_CONTACTUS_FAILURE,

} from 'Actions/types';

// initial state
const INITIAL_STATE = {
    contact_list: [],
    loading: false,
    data: [],
    addUpdateStatus: [],
    errors: {}
};
export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }

    switch (action.type) {
        // get ContactUs List
        case GET_CONTACTUS:
            return { ...state, loading: true, data: action.payload };

        // get ContactUs List success
        case GET_CONTACTUS_SUCCESS:
            return { ...state, loading: false, contact_list: action.payload };

        // get ContactUs List failure
        case GET_CONTACTUS_FAILURE:
            return { ...state, loading: false };

        default: return { ...state };
    }
}
