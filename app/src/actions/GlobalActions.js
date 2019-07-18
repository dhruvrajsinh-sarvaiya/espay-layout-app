import { SAVE_OBJECT_PREFERENCE, ACTION_LOGOUT, SET_CACHE } from "./ActionTypes";

export function action(type, payload = {}) {
    return { type, ...payload };
}

export function logoutUser() {
    return action(ACTION_LOGOUT);
}

//To store object in preference
export function saveObjectPreference(object) {
    return action(SAVE_OBJECT_PREFERENCE, { object });
}

// To Store Cache
export function saveCache(object) {
    return action(SET_CACHE, { object });
}