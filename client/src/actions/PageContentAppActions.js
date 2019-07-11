/**
 * Page CONTENTS App Actions
 */
import {
    GET_PAGE_CONTENTS,
    GET_PAGE_CONTENTS_SUCCESS,
    GET_PAGE_CONTENTS_FAILURE,

} from './types';

/**
 * Redux Action Get PAGE_CONTENTS
 */
export const getPageContents = (pageId) => ({
    type: GET_PAGE_CONTENTS,
    payload:pageId
});

/**
 * Redux Action Get PAGE_CONTENT Success
 */
export const getPageContentsSuccess = (response) => ({
    type: GET_PAGE_CONTENTS_SUCCESS,
    payload: response.data
});

/**
 * Redux Action Get PAGE_CONTENTS Failure
 */
export const getPageContentsFailure = (error) => ({
    type: GET_PAGE_CONTENTS_FAILURE,
    payload: error
});
