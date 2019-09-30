import {
    //getLpChargeConfigList
    ARBITRAGE_PAIR_LIST_CONFIGURATION,
    ARBITRAGE_PAIR_LIST_CONFIGURATION_SUCCESS,
    ARBITRAGE_PAIR_LIST_CONFIGURATION_FAILURE,

    //clear data
    CLEAR_ARBITRAGE_PAIR_CONFIGURATION_DATA,

    //add pair config
    ADD_ARBITRAGE_PAIR_CONFIGURATION,
    ADD_ARBITRAGE_PAIR_CONFIGURATION_SUCCESS,
    ADD_ARBITRAGE_PAIR_CONFIGURATION_FAILURE,

    //updateArbiPairConfig
    UPDATE_ARBITRAGE_PAIR_CONFIGURATION,
    UPDATE_ARBITRAGE_PAIR_CONFIGURATION_SUCCESS,
    UPDATE_ARBITRAGE_PAIR_CONFIGURATION_FAILURE,
} from "../ActionTypes";

// Redux action get arbitrage pair configuration list 
export const getArbiPairConfigList = request => ({
    type: ARBITRAGE_PAIR_LIST_CONFIGURATION,
    payload: request
});
// Redux action get arbitrage pair configuration Success
export const getArbiPairConfigListSuccess = response => ({
    type: ARBITRAGE_PAIR_LIST_CONFIGURATION_SUCCESS,
    payload: response
});
// Redux action get arbitrage pair configuration Failure
export const getArbiPairConfigListFailure = error => ({
    type: ARBITRAGE_PAIR_LIST_CONFIGURATION_FAILURE,
    payload: error
});

// Redux action addArbiPairConfig
export const addArbiPairConfig = request => ({
    type: ADD_ARBITRAGE_PAIR_CONFIGURATION,
    payload: request
});
// Redux action addArbiPairConfig success
export const addArbiPairConfigSuccess = response => ({
    type: ADD_ARBITRAGE_PAIR_CONFIGURATION_SUCCESS,
    payload: response
});
// Redux action addArbiPairConfig failure
export const addArbiPairConfigFailure = error => ({
    type: ADD_ARBITRAGE_PAIR_CONFIGURATION_FAILURE,
    payload: error
});

// Redux action updateArbiPairConfig
export const updateArbiPairConfig = request => ({
    type: UPDATE_ARBITRAGE_PAIR_CONFIGURATION,
    payload: request
});
// Redux action updateArbiPairConfig success
export const updateArbiPairConfigSuccess = response => ({
    type: UPDATE_ARBITRAGE_PAIR_CONFIGURATION_SUCCESS,
    payload: response
});
// Redux action updateArbiPairConfig failure
export const updateArbiPairConfigFailure = error => ({
    type: UPDATE_ARBITRAGE_PAIR_CONFIGURATION_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearArbiPairConfigData = () => ({
    type: CLEAR_ARBITRAGE_PAIR_CONFIGURATION_DATA,
});



