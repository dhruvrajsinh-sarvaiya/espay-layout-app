/**
 * Create By Sanjay 
 * Created Date 30-05-2019
 * Reducer For Image Sliders
 */

import {

    GET_IMAGESLIDERS,
    GET_IMAGESLIDERS_SUCCESS,
    GET_IMAGESLIDERS_FAILURE,

    ADD_IMAGE_SLIDER,
    ADD_IMAGE_SLIDER_SUCCESS,
    ADD_IMAGE_SLIDER_FAILURE,

    EDIT_IMAGE_SLIDER,
    EDIT_IMAGE_SLIDER_SUCCESS,
    EDIT_IMAGE_SLIDER_FAILURE

} from "Actions/types";

//Initial State 

const INIT_STATE = {
    imagesliders_list: {},
    add_image_slider: {},
    edit_image_slider: {},
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_IMAGESLIDERS:
            return { ...state, loading: true, add_image_slider: {}, edit_image_slider: {} };

        case GET_IMAGESLIDERS_SUCCESS:
            return { ...state, loading: false, imagesliders_list: action.payload };

        case GET_IMAGESLIDERS_FAILURE:
            return { ...state, loading: false, imagesliders_list: action.payload };

        case ADD_IMAGE_SLIDER:
            return { ...state, loading: true }

        case ADD_IMAGE_SLIDER_SUCCESS:
            return { ...state, loading: false, add_image_slider: action.payload };

        case ADD_IMAGE_SLIDER_FAILURE:
            return { ...state, loading: false, add_image_slider: action.payload };

        case EDIT_IMAGE_SLIDER:
            return { ...state, loading: true }

        case EDIT_IMAGE_SLIDER_SUCCESS:
            return { ...state, loading: false, edit_image_slider: action.payload }

        case EDIT_IMAGE_SLIDER_FAILURE:
            return { ...state, loading: false, edit_image_slider: action.payload }

        default:
            return { ...state };

    }
}