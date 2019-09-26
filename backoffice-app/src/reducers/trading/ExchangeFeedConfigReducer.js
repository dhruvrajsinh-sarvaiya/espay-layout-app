// Reducer For Handle Exchange Feed Configuration
// import types
import {
	//Exchange Feed Configuration List
	GET_EXCHANGE_FEED_CONFIGURATION_LIST,
	GET_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
	GET_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,

	//Exchange Feed Configuration add
	ADD_EXCHANGE_FEED_CONFIGURATION_LIST,
	ADD_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
	ADD_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,

	//Exchange Feed Configuration update
	UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST,
	UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
	UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,

	//Exchange Feed Configuration method List
	GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST,
	GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_SUCCESS,
	GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_FAILURE,

	//Exchange Feed Configuration method List
	GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST,
	GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_SUCCESS,
	GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_FAILURE,

	//clear data
	ADD_EXCHANGE_FEED_CONFIGURATION_LIST_CLEAR,
	UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_CLEAR,
	CLEAR_EXCHANGE_FEED_CONFIGURATION,
	ACTION_LOGOUT,
} from "../../actions/ActionTypes";

// Set Initial State
const initialState = {
	//Exchange Feed Configuration List
	exchangeFeedList: null,
	isLoadingExchangeFeedList: false,
	exchangeFeedListError: false,

	//Exchange Feed Configuration add
	addExchangeFeedList: null,
	isAddingExchangeFeed: false,
	addExchangeFeedError: false,

	//Exchange Feed Configuration edit
	updateExchangeFeedList: null,
	isUpdatingExchangeFeed: false,
	updateExchangeFeedError: false,

	//Exchange Feed Configuration method List
	socketMethods: null,
	isLoadingSocketMethods: false,
	socketMethodErrors: false,

	//Exchange Feed Configuration method List 
	limitMethods: null,
	isLoadingLimitMethods: false,
	limitMethodErrors: false,
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
		case CLEAR_EXCHANGE_FEED_CONFIGURATION:
			return initialState

		// get Exchange Feed Configuration List
		case GET_EXCHANGE_FEED_CONFIGURATION_LIST:
			return Object.assign({}, state, {
				exchangeFeedList: null,
				isLoadingExchangeFeedList: true,
				exchangeFeedListError: false,
			});

		// set Data Of Exchange Feed Configuration List
		case GET_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS:
			return Object.assign({}, state, {
				exchangeFeedList: action.payload,
				isLoadingExchangeFeedList: false,
				exchangeFeedListError: false,
			});

		// Display Error for Exchange Feed Configuration List failure
		case GET_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE:
			return Object.assign({}, state, {
				exchangeFeedList: null,
				isLoadingExchangeFeedList: false,
				exchangeFeedListError: true,
			});

		// get Exchange Feed Configuration Socket methods List
		case GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST:
			return Object.assign({}, state, {
				socketMethods: null,
				isLoadingSocketMethods: true,
				socketMethodErrors: false,
			});

		// set Data Of Exchange Feed Configuration Socket methods List
		case GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_SUCCESS:
			return Object.assign({}, state, {
				socketMethods: action.payload,
				isLoadingSocketMethods: false,
				socketMethodErrors: false,
			});

		// Display Error for Exchange Feed Configuration Socket methods List failure
		case GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_FAILURE:
			return Object.assign({}, state, {
				socketMethods: null,
				isLoadingSocketMethods: false,
				socketMethodErrors: true,
			});

		// get Exchange Feed Configuration limit methods List
		case GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST:
			return Object.assign({}, state, {
				limitMethods: null,
				isLoadingLimitMethods: true,
				limitMethodErrors: false,
			});

		// set Data Of Exchange Feed Configuration limit methods List
		case GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_SUCCESS:
			return Object.assign({}, state, {
				limitMethods: action.payload,
				isLoadingLimitMethods: false,
				limitMethodErrors: false,
			});

		// Display Error for Exchange Feed Configuration limit methods List failure
		case GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_FAILURE:
			return Object.assign({}, state, {
				limitMethods: null,
				isLoadingLimitMethods: false,
				limitMethodErrors: true,
			});

		// add Exchange Feed Configuration List
		case ADD_EXCHANGE_FEED_CONFIGURATION_LIST:
			return Object.assign({}, state, {
				addExchangeFeedList: null,
				isAddingExchangeFeed: true,
				addExchangeFeedError: false
			});

		// set Data Of add Exchange Feed Configuration List
		case ADD_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS:
			return Object.assign({}, state, {
				addExchangeFeedList: action.payload,
				isAddingExchangeFeed: false,
				addExchangeFeedError: false
			});

		// Display Error for add Exchange Feed Configuration List failure
		case ADD_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE:
			return Object.assign({}, state, {
				addExchangeFeedList: null,
				isAddingExchangeFeed: false,
				addExchangeFeedError: true
			});

		// update Exchange Feed Configuration List
		case UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST:
			return Object.assign({}, state, {
				updateExchangeFeedList: null,
				isUpdatingExchangeFeed: true,
				updateExchangeFeedError: false
			});

		// set Data Of update Exchange Feed Configuration List
		case UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS:
			return Object.assign({}, state, {
				updateExchangeFeedList: action.payload,
				isUpdatingExchangeFeed: false,
				updateExchangeFeedError: false
			});

		// Display Error for update Exchange Feed Configuration List failure
		case UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE:
			return Object.assign({}, state, {
				updateExchangeFeedList: null,
				isUpdatingExchangeFeed: false,
				updateExchangeFeedError: true
			});

		//add data clear 
		case ADD_EXCHANGE_FEED_CONFIGURATION_LIST_CLEAR:
			return Object.assign({}, state, {
				addExchangeFeedList: null,
				isAddingExchangeFeed: false,
			});

		//update data clear 
		case UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_CLEAR:
			return Object.assign({}, state, {
				updateExchangeFeedList: null,
				isUpdatingExchangeFeed: false
			});

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state
	}
};
