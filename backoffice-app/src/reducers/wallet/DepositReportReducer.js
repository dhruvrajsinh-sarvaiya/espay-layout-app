import {
	// Action Logout
	ACTION_LOGOUT,

	// Get Deposit Report
	GET_DEPOSIT_REPORT,
	GET_DEPOSIT_REPORT_SUCCESS,
	GET_DEPOSIT_REPORT_FAILURE,

	// Clear Deposit Report Data
	CLEAR_DEPOSIT_REPORT_DATA,

	// Get User Data
	GET_USER_DATA,
	GET_USER_DATA_SUCCESS,
	GET_USER_DATA_FAILURE,

	// Get Wallet Type
	GET_WALLET_TYPE,
	GET_WALLET_TYPE_SUCCESS,
	GET_WALLET_TYPE_FAILURE,

	// Organization List
	ORGLIST,
	ORGLIST_SUCCESS,
	ORGLIST_FAIL,

	// Deposit Recon Process
	DEPOSIT_RECON_PROCESS,
	DEPOSIT_RECON_PROCESS_SUCCESS,
	DEPOSIT_RECON_PROCESS_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Deposit Report
const INITIAL_STATE = {
	// for Deposit Report List
	DepositReportList: null,
	DepositReportLoading: false,
	DepositReportError: false,

	// for user data
	UserDataList: null,
	UserDataListLoading: false,
	UserDataListError: false,

	// for wallet
	WalletDataList: null,
	WalletDataListLoading: false,
	WalletDataListError: false,

	// for organization list
	OrganizationList: null,
	OrganizationListLoading: false,
	OrganizationListError: false,

	// for Deposit Report
	DepositRecon: null,
	DepositReconLoading: false,
	DepositReconError: false,
}

export default function DepositReportReducer(state, action) {

	//If state is undefine then return with initial state
	if (typeof state === 'undefined')
		return INITIAL_STATE

	switch (action.type) {
		// To reset initial state on logout
		case ACTION_LOGOUT:
			return INITIAL_STATE;

		// Handle Deposit Report List method data
		case GET_DEPOSIT_REPORT:
			return Object.assign({}, state, {
				DepositReportList: null,
				DepositReportLoading: true
			})
		// Set Deposit Report List success data
		case GET_DEPOSIT_REPORT_SUCCESS:
			return Object.assign({}, state, {
				DepositReportList: action.data,
				DepositReportLoading: false,
			})
		// Set Deposit Report List failure data
		case GET_DEPOSIT_REPORT_FAILURE:
			return Object.assign({}, state, {
				DepositReportList: null,
				DepositReportLoading: false,
				DepositReportError: true
			})

		// Handle Get User Data method data
		case GET_USER_DATA:
			return Object.assign({}, state, {
				UserDataList: null,
				UserDataListLoading: true
			})
		// Set Get User Data success data
		case GET_USER_DATA_SUCCESS:
			return Object.assign({}, state, {
				UserDataList: action.payload,
				UserDataListLoading: false,
			})
		// Set Get User Data failure data
		case GET_USER_DATA_FAILURE:
			return Object.assign({}, state, {
				UserDataList: null,
				UserDataListLoading: false,
				UserDataListError: true
			})

		// Handle Get Wallet Data method data
		case GET_WALLET_TYPE:
			return Object.assign({}, state, {
				WalletDataList: null,
				WalletDataListLoading: true
			})
		// Set Get Wallet Data success data
		case GET_WALLET_TYPE_SUCCESS:
			return Object.assign({}, state, {
				WalletDataList: action.payload,
				WalletDataListLoading: false,
			})
		// Set Get Wallet Data failure data
		case GET_WALLET_TYPE_FAILURE:
			return Object.assign({}, state, {
				WalletDataList: null,
				WalletDataListLoading: false,
				WalletDataListError: true
			})

		// Handle Get Organization List method data
		case ORGLIST:
			return Object.assign({}, state, {
				OrganizationList: null,
				OrganizationListLoading: true
			})
		// Set Get Organization List success data
		case ORGLIST_SUCCESS:
			return Object.assign({}, state, {
				OrganizationList: action.payload,
				OrganizationListLoading: false,
			})
		// Set Get Organization List failure data
		case ORGLIST_FAIL:
			return Object.assign({}, state, {
				OrganizationList: null,
				OrganizationListLoading: false,
				OrganizationListError: true
			})

		// Handle Get Deposit Recon Data method data
		case DEPOSIT_RECON_PROCESS:
			return Object.assign({}, state, {
				DepositRecon: null,
				DepositReconLoading: true
			})
		// Set Deposit Recon Data success data
		case DEPOSIT_RECON_PROCESS_SUCCESS:
			return Object.assign({}, state, {
				DepositRecon: action.data,
				DepositReconLoading: false,
			})
		// Set Deposit Recon Data failure data
		case DEPOSIT_RECON_PROCESS_FAILURE:
			return Object.assign({}, state, {
				DepositRecon: null,
				DepositReconLoading: false,
				DepositReconError: true
			})

		// Clear Deposit Report method data
		case CLEAR_DEPOSIT_REPORT_DATA:
			return Object.assign({}, state, {
				DepositReportList: null,
				DepositRecon: null,
			})

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state;
	}
}