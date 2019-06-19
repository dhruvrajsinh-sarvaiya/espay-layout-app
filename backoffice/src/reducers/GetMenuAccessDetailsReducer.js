// reducers for Get Menu Acces Detail By Tejas 29/4/2019

// import types 
import {
    GET_MENU_ACCESS,
    GET_MENU_ACCESS_SUCCESS,
    GET_MENU_ACCESS_FAILURE,

    //Added by salim dt:06/05/2019
    //Update Module Permission Access
    UPDATE_MODULE_PERMISSION_ACCESS,
    UPDATE_MODULE_PERMISSION_ACCESS_SUCCESS,
    UPDATE_MODULE_PERMISSION_ACCESS_FAILURE,

    //Update Module Field Access
    UPDATE_MODULE_FIELD_ACCESS,
    UPDATE_MODULE_FIELD_ACCESS_SUCCESS,
    UPDATE_MODULE_FIELD_ACCESS_FAILURE,
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
    menuList: [],
    loading: false,
    getListBit:0,
    updData : '', //Added by salim dt:06/05/2019
    menuListError:[]
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_MENU_ACCESS:
            return { ...state, loading: true,menuList:[], updData : '',menuListError:[] };

        case GET_MENU_ACCESS_SUCCESS:
            return { ...state, getListBit: ++state.getListBit,loading: false, menuList: action.payload,menuListError:[] };

        case GET_MENU_ACCESS_FAILURE:
            return { ...state, loading: false, menuList: [],menuListError:action.payload,getListBit: ++state.getListBit };

        //Added by salim dt:06/05/2019
        case UPDATE_MODULE_PERMISSION_ACCESS:
            return { ...state, loading: true, updData:'', menuList:[] };

        case UPDATE_MODULE_PERMISSION_ACCESS_SUCCESS:
            return { ...state, loading: false, updData: action.payload };

        case UPDATE_MODULE_PERMISSION_ACCESS_FAILURE:
            return { ...state, loading: false, updData: action.payload };

        //Added by salim dt:06/05/2019
        case UPDATE_MODULE_FIELD_ACCESS:
            return { ...state, loading: true, updData:'', menuList:[] };

        case UPDATE_MODULE_FIELD_ACCESS_SUCCESS:
            return { ...state, loading: false, updData: action.payload };

        case UPDATE_MODULE_FIELD_ACCESS_FAILURE:
            return { ...state, loading: false, updData: action.payload };

        default:
            return { ...state };
    }
};
