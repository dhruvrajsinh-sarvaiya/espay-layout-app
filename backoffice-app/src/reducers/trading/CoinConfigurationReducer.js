// Reducer For Handle Coin Configuration
// import types
import {
	//Coin Configuration List
	GET_COIN_CONFIGURATION_LIST,
	GET_COIN_CONFIGURATION_LIST_SUCCESS,
	GET_COIN_CONFIGURATION_LIST_FAILURE,

	//Coin Configuration add
	ADD_COIN_CONFIGURATION_LIST,
	ADD_COIN_CONFIGURATION_LIST_SUCCESS,
	ADD_COIN_CONFIGURATION_LIST_FAILURE,

	//Coin Configuration update
	UPDATE_COIN_CONFIGURATION_LIST,
	UPDATE_COIN_CONFIGURATION_LIST_SUCCESS,
	UPDATE_COIN_CONFIGURATION_LIST_FAILURE,

	//clear data
	CLEAR_ADD_UPDATE_COIN_CONFIG_DATA,
	CLEAR_COIN_CONFIGURATION,
	ACTION_LOGOUT
} from "../../actions/ActionTypes";

// Set Initial State
const initialState = {
	//Coin Configuration List
	coinConfigurationList: null,
	isLoadingCoinConfig: false,
	errorCoinConfig: false,

	//Coin Configuration add
	addCoinConfigurationListData: null,
	isAddingCoinConfig: false,
	errorAddCoinConfig: false,

	//Coin Configuration update
	updateCoinConfigurationListData: null,
	isUpdatingCoinConfig: false,
	errorUpdateCoinConfig: false,
};

export default (state, action) => {

	//If state is undefine then return with initial state
	if (typeof state === 'undefined')
		return initialState

	switch (action.type) {

		// To reset initial state on logout
		case ACTION_LOGOUT:
			return initialState

		// To reset initial state on clear data
		case CLEAR_COIN_CONFIGURATION:
			return initialState

		// get Coin Configuration List
		case GET_COIN_CONFIGURATION_LIST:
			return Object.assign({}, state, {
				coinConfigurationList: null,
				isLoadingCoinConfig: true,
				errorCoinConfig: false,
			});

		// set Data Of Coin Configuration List
		case GET_COIN_CONFIGURATION_LIST_SUCCESS:
			return Object.assign({}, state, {
				coinConfigurationList: action.payload,
				isLoadingCoinConfig: false,
				errorCoinConfig: false,
			});

		// Display Error for Coin Configuration List failure
		case GET_COIN_CONFIGURATION_LIST_FAILURE:
			return Object.assign({}, state, {
				coinConfigurationList: null,
				isLoadingCoinConfig: false,
				errorCoinConfig: true,
			});

		// add Coin Configuration List
		case ADD_COIN_CONFIGURATION_LIST:
			return Object.assign({}, state, {
				addCoinConfigurationListData: null,
				isAddingCoinConfig: true,
				errorAddCoinConfig: false
			});

		// set Data Of add Coin Configuration List
		case ADD_COIN_CONFIGURATION_LIST_SUCCESS:
			return Object.assign({}, state, {
				addCoinConfigurationListData: action.payload,
				isAddingCoinConfig: false,
				errorAddCoinConfig: false
			});

		// Display Error for add Coin Configuration List failure
		case ADD_COIN_CONFIGURATION_LIST_FAILURE:
			return Object.assign({}, state, {
				addCoinConfigurationListData: null,
				isAddingCoinConfig: false,
				errorAddCoinConfig: true
			});

		// update Coin Configuration List
		case UPDATE_COIN_CONFIGURATION_LIST:
			return Object.assign({}, state, {
				updateCoinConfigurationListData: null,
				isUpdatingCoinConfig: true,
				errorUpdateCoinConfig: false
			});

		// set Data Of update Coin Configuration List
		case UPDATE_COIN_CONFIGURATION_LIST_SUCCESS:
			return Object.assign({}, state, {
				updateCoinConfigurationListData: action.payload,
				isUpdatingCoinConfig: false,
				errorUpdateCoinConfig: false
			});

		// Display Error for update Coin Configuration List failure
		case UPDATE_COIN_CONFIGURATION_LIST_FAILURE:
			return Object.assign({}, state, {
				updateCoinConfigurationListData: null,
				isUpdatingCoinConfig: false,
				errorUpdateCoinConfig: true
			});

		// To clear add and update coin config data
		case CLEAR_ADD_UPDATE_COIN_CONFIG_DATA:
			return Object.assign({}, state, {
				addCoinConfigurationListData: null,
				updateCoinConfigurationListData: null,
				isAddingCoinConfig: false,
				isUpdatingCoinConfig: false
			});

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state
	}
};
