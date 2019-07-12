import { action } from '../GlobalActions';
import {
  // Generate New Address
  GENERATE_NEW_ADDRESS,

  // Dropdown Change
  DropdownChange,

  // Fetch Deposit History
  FETCHING_DEPOSIT_HISTORY_DATA,

  // get wallets and balance,
  GET_AD_WALLETS,
  GET_AD_WALLETS_SUCCESS,
  GET_AD_WALLETS_FAILURE,

  //get defualt wallet address
  GET_DEFAULT_ADD,
  GET_DEFAULT_ADD_SUCCESS,
  GET_DEFAULT_ADD_FAILURE,
} from '../ActionTypes';

// Action Fired On Generate New Address
export function GenerateNewAddress(generateAddressRequest) {
  return action(GENERATE_NEW_ADDRESS, { generateAddressRequest })
}

//on Dropdown coin or address selection
export function OnDropdownChange() {
  return action(DropdownChange)
}

// For Deposit History
export function onDepositHistory(depositHistoryRequest) {
  return action(FETCHING_DEPOSIT_HISTORY_DATA, { depositHistoryRequest })
}

/* 
    Comment :Function for dispatch Get Address Action
*/
export const getWallets = (walletsRequest) => ({
  type: GET_AD_WALLETS,
  walletsRequest: walletsRequest,
});

/* 
  Comment :Function for dispatch Get Address Action for Success
*/
export const getWalletsSuccess = (response) => ({
  type: GET_AD_WALLETS_SUCCESS,
  payload: response
})

/* 
  Comment :Function for dispatch Get Address Action for Failure
*/
export const getWalletsFailure = (error) => ({
  type: GET_AD_WALLETS_FAILURE,
  payload: error
})

// Redux action to Get Default Address
export const getDefaultAddress = (walletDefaultAddRequest) => ({
  type: GET_DEFAULT_ADD,
  walletDefaultAddRequest: walletDefaultAddRequest
})

// Redux action to Get Default Address Success
export const getDefaultAddressSuccess = (response) => ({
  type: GET_DEFAULT_ADD_SUCCESS,
  payload: response
})

// Redux action to Get Default Address Failure
export const getDefaultAddressFailure = (error) => ({
  type: GET_DEFAULT_ADD_FAILURE,
  payload: error
})