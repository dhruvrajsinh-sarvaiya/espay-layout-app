/* 
    Developer : Nishant Vadgama
    Date : 15-10-2018
    File Comment : Coin Config File actions list, edit , update, & delete reducer
*/
import {
    // get list
    GET_COINLIST,
    GET_COINLIST_SUCCESS,
    GET_COINLIST_FAILURE,
    // add coin
    ADD_COIN,
    ADD_COIN_SUCCESS,
    ADD_COIN_FAILURE,
    // get coin details for edit
    GET_COINDETAILS,
    GET_COINDETAILS_SUCCESS,
    GET_COINDETAILS_FAILURE,
    // update coin
    UPDATE_COIN,
    UPDATE_COIN_SUCCESS,
    UPDATE_COIN_FAILURE,
    // delete coin
    DELETE_COIN,
    DELETE_COIN_SUCCESS,
    DELETE_COIN_FAILURE,
} from 'Actions/types';

const INITIAL_STATE = {
    coinList: [],
    coinDetails: {},
    loading: false,
    listLoader: false,
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // get list
        case GET_COINLIST:
            return { ...state, listLoader: true, response: {} }
        case GET_COINLIST_SUCCESS:
            return { ...state, listLoader: false, coinList: action.payload, response: {} }
        case GET_COINLIST_FAILURE:
            return { ...state, listLoader: false }

        // add coin
        case ADD_COIN:
            return { ...state, loading: true }
        case ADD_COIN_SUCCESS:
            return { ...state, loading: false, response: action.payload }
        case ADD_COIN_FAILURE:
            return { ...state, loading: false }

        // get coin details for edi:
        case GET_COINDETAILS:
            return { ...state, loading: true }
        case GET_COINDETAILS_SUCCESS:
            return { ...state, loading: false, coinDetails: action.payload, response: {} }
        case GET_COINDETAILS_FAILURE:
            return { ...state, loading: false }

        // updateCoinRes coin
        case UPDATE_COIN:
            return { ...state, loading: true }
        case UPDATE_COIN_SUCCESS:
            return { ...state, loading: false, response: action.payload }
        case UPDATE_COIN_FAILURE:
            return { ...state, loading: false }

        // delete coi:
        case DELETE_COIN:
            return { ...state, listLoader: true }
        case DELETE_COIN_SUCCESS:
            return { ...state, listLoader: false, response: action.payload }
        case DELETE_COIN_FAILURE:
            return { ...state, listLoader: false }

        default:
            return { ...state }
    }
}