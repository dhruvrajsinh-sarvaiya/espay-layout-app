import { action } from "../GlobalActions";
import {
    // Generate Token
    GENERATE_TOKEN,
    GENERATE_TOKEN_SUCCESS,
    GENERATE_TOKEN_FAILURE,

    // Refresh Token
    REFRESH_TOKEN,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAILURE,

    // Check Token
    CHECK_TOKEN,
    CHECK_TOKEN_SUCCESS,
    CHECK_TOKEN_FAILURE,

    // Clear Generate Token 
    CLEAR_GENERATE_TOKEN_DATA
} from "../ActionTypes";

// Redux Action to Generate Token
export function generateToken(payload) {
    return action(GENERATE_TOKEN, { payload });
}
// Redux Action to Generate Token Success
export function generateTokenSuccess(payload) {
    return action(GENERATE_TOKEN_SUCCESS, { payload });
}
// Redux Action to Generate Token Failure
export function generateTokenFailure(payload) {
    return action(GENERATE_TOKEN_FAILURE, { payload });
}

// Redux Action to Refresh Token
export function refreshToken() {
    return action(REFRESH_TOKEN);
}
// Redux Action to Refresh Token Success
export function refreshTokenSuccess(payload) {
    return action(REFRESH_TOKEN_SUCCESS, { payload });
}
// Redux Action to Refresh Token Failure
export function refreshTokenFailure(payload) {
    return action(REFRESH_TOKEN_FAILURE, { payload });
}

// Redux Action to Check Token
export function checkToken(payload) {
    return action(CHECK_TOKEN, { payload });
}
// Redux Action to Check Token Success
export function checkTokenSuccess(payload) {
    return action(CHECK_TOKEN_SUCCESS, { payload });
}
// Redux Action to Check Token Failure
export function checkTokenFailure() {
    return action(CHECK_TOKEN_FAILURE);
}

// Clear Generate Token
export function clearGenerateTokenData() {
    return action(CLEAR_GENERATE_TOKEN_DATA);
}