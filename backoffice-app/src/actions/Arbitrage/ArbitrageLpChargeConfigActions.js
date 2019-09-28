import {
    //getLpChargeConfigList
    ARBITRAGE_LP_CHARGE_CONFIG_LIST,
    ARBITRAGE_LP_CHARGE_CONFIG_LIST_SUCCESS,
    ARBITRAGE_LP_CHARGE_CONFIG_LIST_FAILURE,

    //add edit delete LpChargeConfig
    ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE,
    ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE_SUCCESS,
    ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE_FAILURE,

    //getLpChargeConfigList detail
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL,
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_SUCCESS,
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_FAILURE,

    //add edit delete LpChargeConfig Detail
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE,
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE_SUCCESS,
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE_FAILURE,

    //clear data
    CLEAR_ARBITRAGE_LP_CHARGE_CONFIG_DATA,
} from "../ActionTypes";

// Redux action getLpChargeConfigList
export const getLpChargeConfigList = request => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_LIST,
    payload: request
});
// Redux action getLpChargeConfigList Success
export const getLpChargeConfigListSuccess = response => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_LIST_SUCCESS,
    payload: response
});
// Redux action getLpChargeConfigList Failure
export const getLpChargeConfigListFailure = error => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_LIST_FAILURE,
    payload: error
});

// Redux action addEditDeleteLpChargeConfig
export const addEditDeleteLpChargeConfig = request => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE,
    payload: request
});
// Redux action addEditDeleteLpChargeConfig success
export const addEditDeleteLpChargeConfigSuccess = response => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE_SUCCESS,
    payload: response
});
// Redux action addEditDeleteLpChargeConfig failure
export const addEditDeleteLpChargeConfigFailure = error => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE_FAILURE,
    payload: error
});

// Redux action getLpChargeConfigDetailList
export const getLpChargeConfigDetailList = request => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_DETAIL,
    payload: request
});
// Redux action getLpChargeConfigDetailList Success
export const getLpChargeConfigDetailListSuccess = response => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_SUCCESS,
    payload: response
});
// Redux action getLpChargeConfigDetailList Failure
export const getLpChargeConfigDetailListFailure = error => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_FAILURE,
    payload: error
});

// Redux action addEditDeleteLpChargeConfigDetail
export const addEditDeleteLpChargeConfigDetail = request => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE,
    payload: request
});
// Redux action addEditDeleteLpChargeConfigDetail success
export const addEditDeleteLpChargeConfigDetailSuccess = response => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE_SUCCESS,
    payload: response
});
// Redux action addEditDeleteLpChargeConfigDetail failure
export const addEditDeleteLpChargeConfigDetailFailure = error => ({
    type: ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearLpChargeConfigData = () => ({
    type: CLEAR_ARBITRAGE_LP_CHARGE_CONFIG_DATA,
});



