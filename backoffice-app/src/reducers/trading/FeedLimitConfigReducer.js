// Reducer For Handle Exchange Feed Configuration
// import types
import {
	//Feed limit list
	GET_FEED_LIMIT_LIST,
	GET_FEED_LIMIT_LIST_SUCCESS,
	GET_FEED_LIMIT_LIST_FAILURE,

	//Feed limit add
	ADD_FEED_LIMIT_CONFIGURATION,
	ADD_FEED_LIMIT_CONFIGURATION_SUCCESS,
	ADD_FEED_LIMIT_CONFIGURATION_FAILURE,

	//Feed limit update
	UPDATE_FEED_LIMIT_CONFIGURATION,
	UPDATE_FEED_LIMIT_CONFIGURATION_SUCCESS,
	UPDATE_FEED_LIMIT_CONFIGURATION_FAILURE,

	//Feed limit type
	GET_FEED_LIMIT_TYPE,
	GET_FEED_LIMIT_TYPE_SUCCESS,
	GET_FEED_LIMIT_TYPE_FAILURE,

	//clear data
	CLEAR_ADD_UPDATE_FEED_LIMIT_DATA,
	CLEAR_FEED_LIMIT_DATA,
	ACTION_LOGOUT,
} from "../../actions/ActionTypes";

// Set Initial State
const initialState = {
	//Feed limit list
	feedLimitList: null,
	isLoadingFeedLimitList: false,
	errorFeedLimitList: false,

	//Feed limit add
	addFeedLimitListData: null,
	isAddingFeedLimit: false,
	errorAddFeedLimitList: false,

	//Feed limit update
	updateFeedLimitListData: null,
	isUpdatingFeedLimit: false,
	errorUpdateFeedLimitList: false,

	//Feed limit type
	feedLimitTypes: null,
	isLoadingFeedLimitTypes: false,
	errorFeedLimitType: false,
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
		case CLEAR_FEED_LIMIT_DATA:
			return initialState

		// get Exchange Feed Limit Configuration List
		case GET_FEED_LIMIT_LIST:
			return Object.assign({}, state, {
				feedLimitList: null,
				isLoadingFeedLimitList: true,
				errorFeedLimitList: false,
			});

		// set Data Of Exchange Feed Limit Configuration List
		case GET_FEED_LIMIT_LIST_SUCCESS:
			return Object.assign({}, state, {
				feedLimitList: action.payload,
				isLoadingFeedLimitList: false,
				errorFeedLimitList: false,
			});

		// Display Error for Exchange Feed Limit Configuration List failure
		case GET_FEED_LIMIT_LIST_FAILURE:
			return Object.assign({}, state, {
				feedLimitList: null,
				isLoadingFeedLimitList: false,
				errorFeedLimitList: true,
			});

		// get Exchange Feed Configuration limit types methods List
		case GET_FEED_LIMIT_TYPE:
			return Object.assign({}, state, {
				feedLimitTypes: null,
				isLoadingFeedLimitTypes: true,
				errorFeedLimitType: false,
			});

		// set Data Of Exchange Feed Configuration limit types methods List
		case GET_FEED_LIMIT_TYPE_SUCCESS:
			return Object.assign({}, state, {
				feedLimitTypes: action.payload,
				isLoadingFeedLimitTypes: false,
				errorFeedLimitType: false,
			});

		// Display Error for Exchange Feed Configuration limit types methods List failure
		case GET_FEED_LIMIT_TYPE_FAILURE:
			return Object.assign({}, state, {
				feedLimitTypes: null,
				isLoadingFeedLimitTypes: false,
				errorFeedLimitType: true,
			});

		// add Exchange Feed Limit Configuration List
		case ADD_FEED_LIMIT_CONFIGURATION:
			return Object.assign({}, state, {
				addFeedLimitListData: null,
				isAddingFeedLimit: true,
				errorAddFeedLimitList: false
			});

		// set Data Of add Exchange Feed Limit Configuration List
		case ADD_FEED_LIMIT_CONFIGURATION_SUCCESS:
			return Object.assign({}, state, {
				addFeedLimitListData: action.payload,
				isAddingFeedLimit: false,
				errorAddFeedLimitList: false
			});

		// Display Error for add Exchange Feed Limit Configuration List failure
		case ADD_FEED_LIMIT_CONFIGURATION_FAILURE:
			return Object.assign({}, state, {
				addFeedLimitListData: null,
				isAddingFeedLimit: false,
				errorAddFeedLimitList: true
			});

		// update Exchange Feed Limit Configuration List
		case UPDATE_FEED_LIMIT_CONFIGURATION:
			return Object.assign({}, state, {
				updateFeedLimitListData: null,
				isUpdatingFeedLimit: true,
				errorUpdateFeedLimitList: false
			});

		// set Data Of update Exchange Feed Limit Configuration List
		case UPDATE_FEED_LIMIT_CONFIGURATION_SUCCESS:
			return Object.assign({}, state, {
				updateFeedLimitListData: action.payload,
				isUpdatingFeedLimit: false,
				errorUpdateFeedLimitList: false
			});

		// Display Error for update Exchange Feed Limit Configuration List failure
		case UPDATE_FEED_LIMIT_CONFIGURATION_FAILURE:
			return Object.assign({}, state, {
				updateFeedLimitListData: null,
				isUpdatingFeedLimit: false,
				errorUpdateFeedLimitList: true
			});

		case CLEAR_ADD_UPDATE_FEED_LIMIT_DATA:
			return Object.assign({}, state, {
				addFeedLimitListData: null,
				updateFeedLimitListData: null,
				isAddingFeedLimit: false,
				isUpdatingFeedLimit: false
			});

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state
	}
};
