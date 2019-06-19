/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 28-12-2018
    UpdatedDate : 28-12-2018
    Description : Region Reducer action manager
*/
import {
    GET_REGIONS,
    GET_REGIONS_SUCCESS,
    GET_REGIONS_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    regioncontent:[],
    loading: false,
    data:[],
};

export default (state = INIT_STATE, action) => {
    //console.log("regions",action.payload);
    switch (action.type) {
        // get Region List
        case GET_REGIONS:
            return { ...state,loading:true,data:[]};

        // get Region List success
        case GET_REGIONS_SUCCESS:
            return { ...state, loading: false,data:[],regioncontent:action.payload};

        // get Region List failure
        case GET_REGIONS_FAILURE:
            //NotificationManager.error(action.payload)
            return {...state, loading: false,data:action.payload};

        default: return { ...state };
    }
}
