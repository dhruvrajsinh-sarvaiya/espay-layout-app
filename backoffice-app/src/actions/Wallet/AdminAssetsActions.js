import {
    // Get Admin Assets List
    GET_ADMIN_ASSETS_LIST,
    GET_ADMIN_ASSETS_LIST_SUCCESS,
    GET_ADMIN_ASSETS_LIST_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Admin Assets List
export function getAdminAssetsList(payload = {}) {
    return action(GET_ADMIN_ASSETS_LIST, { payload })
}

// Redux action for Get Admin Assets List Success
export function getAdminAssetsListSuccess(data) {
    return action(GET_ADMIN_ASSETS_LIST_SUCCESS, { data })
}

// Redux action for Get Admin Assets List Failure
export function getAdminAssetsListFailure() {
    return action(GET_ADMIN_ASSETS_LIST_FAILURE)
}