// import neccessary action types
import { ARBITRGAE_SERVICE_CONFIG_BASE, ARBITRGAE_SERVICE_CONFIG_BASE_SUCCESS, ARBITRGAE_SERVICE_CONFIG_BASE_FAILURE, GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST, GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST_SUCCESS, GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST_FAILURE } from "./ActionTypes";

import { action } from "./GlobalActions";

export function getServiceConfiguByBaseArbitrage(payload = {}) { return action(ARBITRGAE_SERVICE_CONFIG_BASE, { payload }) }

export function getServiceConfigByBaseArbitrageSuccess(payload) { return action(ARBITRGAE_SERVICE_CONFIG_BASE_SUCCESS, { payload }) }

export function getServiceConfigByBaseArbitrageFailure(payload) { return action(ARBITRGAE_SERVICE_CONFIG_BASE_FAILURE, { payload }) }

// Redux action for Get all third party response list 
export function getArbitrageThirdPartyResponse() { return action(GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST) }
// Redux action for Get all third party response list  Success
export function getArbitrageThirdPartyResponseSuccess(data) { return action(GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST_SUCCESS, { data }) }
// Redux action for Get all third party response list  Failure
export function getArbitrageThirdPartyResponseFailure() { return action(GET_ALL_THIRD_PARTY_RESPONSE_ARBITRAGE_LIST_FAILURE) }
