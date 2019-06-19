/**
 * Page Content App Reducer
 */

// action types
import {
    GET_PAGE_CONTENTS,
    GET_PAGE_CONTENTS_SUCCESS,
    GET_PAGE_CONTENTS_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    pageContents: {
        locale:{
            en:{
                title:'',
                content:''
            }
        }
    },
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        // get PAGE_CONTENTS
        case GET_PAGE_CONTENTS:
            return { ...state, pageContents: null,loading:true };

        // get PAGE_CONTENTS success
        case GET_PAGE_CONTENTS_SUCCESS:
            return { ...state, pageContents: action.payload,loading:false };

        // get PAGE_CONTENTS failure
        case GET_PAGE_CONTENTS_FAILURE:
            return {...state,loading:false}
        
        default: return { ...state };
    }
}
