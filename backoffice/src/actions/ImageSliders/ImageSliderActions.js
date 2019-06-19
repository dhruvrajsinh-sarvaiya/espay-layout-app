/**
 * Create By Sanjay 
 * Created Date 30-05-2019
 * Action For Image Sliders CRUD
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

/**
 * Actions For Get Image slider List 
*/

export const getImageSliders = () => ({
   type: GET_IMAGESLIDERS
})

export const getImageSlidersSuccess = (response) => ({
   type: GET_IMAGESLIDERS_SUCCESS,
   payload: response
})

export const getImageSlidersFailure = (error) => ({
   type: GET_IMAGESLIDERS_FAILURE,
   payload: error
})

/**
 * Actions For ADD Image Slider 
 */

export const addImageSliders = (request) => ({
   type: ADD_IMAGE_SLIDER,
   payload: request
})

export const addImageSlidersSuccess = (response) => ({
   type: ADD_IMAGE_SLIDER_SUCCESS,
   payload: response
})

export const addImageSlidersFailure = (error) => ({
   type: ADD_IMAGE_SLIDER_FAILURE,
   payload: error
})

/**
* Actions For Edit Image Slider
*/

export const editImageSliders = (request) => ({
   type: EDIT_IMAGE_SLIDER,
   payload: request
})

export const editImageSlidersSuccess = (response) => ({
   type: EDIT_IMAGE_SLIDER_SUCCESS,
   payload: response
})

export const editImageSlidersFailure = (error) => ({
   type: EDIT_IMAGE_SLIDER_FAILURE,
   payload: error
})