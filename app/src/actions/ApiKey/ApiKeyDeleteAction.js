import {
    // Delete Api Key
    DELETE_API_KEY,
    DELETE_API_KEY_SUCCESS,
    DELETE_API_KEY_FAILURE,

    // Clear Delete Api Key Data
    CLEAR_DELETE_API_KEY_DATA
} from "../ActionTypes";

//action for delete Api Key and set type for reducers
export const deleteApiKey = Data => ({
    type: DELETE_API_KEY,
    payload: Data
});

//action for set Success and delete Api Key and set type for reducers
export const deleteApiKeySuccess = response => ({
    type: DELETE_API_KEY_SUCCESS,
    payload: response
});

//action for set failure and error to delete Api Key and set type for reducers
export const deleteApiKeyFailure = error => ({
    type: DELETE_API_KEY_FAILURE,
    payload: error
});

export const clearApikeyDeleteData = () => ({
    type: CLEAR_DELETE_API_KEY_DATA,
});


