// Reducer for PAir List Data By Tejas Date: 14/9/2018

import {
    GET_PAIR_LIST,
    GET_PAIR_LIST_SUCCESS,
    GET_PAIR_LIST_FAILURE,
    GET_VOLUME_DATA,
    GET_VOLUME_DATA_SUCCESS,
    GET_VOLUME_DATA_FAILURE,
    GET_FAVOURITE_PAIR_LIST,
    GET_FAVOURITE_PAIR_LIST_SUCCESS,
    GET_FAVOURITE_PAIR_LIST_FAILED,
    ADD_PAIR_TO_FAVOURITE_PAIR,
    ADD_PAIR_TO_FAVOURITE_PAIR_SUCCESS,
    ADD_PAIR_TO_FAVOURITE_PAIR_FAILED,
    REMOVE_PAIR_FROM_FAVOURITE_PAIR,
    REMOVE_PAIR_FROM_FAVOURITE_PAIR_SUCCESS,
    REMOVE_PAIR_FROM_FAVOURITE_PAIR_FAILED,
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    pairList: [],
    volumeData: [],
    favouritePairList:[],
    error: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        // get pair list
        case GET_PAIR_LIST:
            return { ...state, loading: true };

        // set Data Of  pair list
        case GET_PAIR_LIST_SUCCESS:
            return { ...state, loading: false, pairList: action.payload, error: [] };

        // Display Error for pair list failure
        case GET_PAIR_LIST_FAILURE:
            return { ...state, loading: false, pairList: [], error: action.payload };

        // get Volume Data
        case GET_VOLUME_DATA:
            return { ...state, loading: true };

        // set Data Of  Volume Data
        case GET_VOLUME_DATA_SUCCESS:
            return { ...state, loading: false, volumeData: action.payload };

        // Display Error for Volume Data failure
        case GET_VOLUME_DATA_FAILURE:
            return { ...state, loading: false, volumeData: [] };

        // code for add pair and list for favourite pair by devang parekh 29-11-2018
        case GET_FAVOURITE_PAIR_LIST:
            return { ...state};        
        case GET_FAVOURITE_PAIR_LIST_SUCCESS:
            return { ...state,favouritePairList: action.payload };
        case GET_FAVOURITE_PAIR_LIST_FAILED:
            return { ...state,favouritePairList: [] };
        case ADD_PAIR_TO_FAVOURITE_PAIR:
            return { ...state};        
        case ADD_PAIR_TO_FAVOURITE_PAIR_SUCCESS:
            return { ...state,favouritePairData: action.payload };
        case ADD_PAIR_TO_FAVOURITE_PAIR_FAILED:
            return { ...state,favouritePairData: action.payload };
        case REMOVE_PAIR_FROM_FAVOURITE_PAIR:
            return { ...state};        
        case REMOVE_PAIR_FROM_FAVOURITE_PAIR_SUCCESS:
            return { ...state,favouritePairData: action.payload };
        case REMOVE_PAIR_FROM_FAVOURITE_PAIR_FAILED:
            return { ...state,favouritePairData: action.payload };
        // end 

        default: return { ...state };

    }
}