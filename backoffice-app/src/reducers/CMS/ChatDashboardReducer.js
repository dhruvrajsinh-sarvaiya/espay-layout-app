//ChatDashboardReducer 
import {
    GET_CHATONLINEUSER_DASHBOARD,
    GET_CHATONLINEUSER_DASHBOARD_SUCCESS,
    GET_CHATONLINEUSER_DASHBOARD_FAILURE,

    GET_CHATOFFLINEUSER_DASHBOARD,
    GET_CHATOFFLINEUSER_DASHBOARD_SUCCESS,
    GET_CHATOFFLINEUSER_DASHBOARD_FAILURE,

    GET_CHATACTIVEUSER_DASHBOARD,
    GET_CHATACTIVEUSER_DASHBOARD_SUCCESS,
    GET_CHATACTIVEUSER_DASHBOARD_FAILURE,

    GET_CHATBLOCKEDUSER_DASHBOARD,
    GET_CHATBLOCKEDUSER_DASHBOARD_SUCCESS,
    GET_CHATBLOCKEDUSER_DASHBOARD_FAILURE,
    ACTION_LOGOUT,
    CLEAR_CHAT_DASHBOARD
} from '../../actions/ActionTypes';

// initial state
const initialState = {
    dashboarddata: {},
    data: [],
    loading: false,
    offlineloading: false,
    Activeloading: false,
    blockloading: false,
    errors: {},
    onlineUserCount: null,
    offlineUserCount: null,
    activeUserCount: null,
    blockedUserCount: null,
};

const ChatDashboardReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }


    switch (action.type) {
        case ACTION_LOGOUT: {
            return initialState;
        }
        // get ONLINE USER CHAT Dashboard Data
        case GET_CHATONLINEUSER_DASHBOARD:
            return { ...state, loading: true, data: [] };

        // get ONLINE USER  CHAT Dashboard Data success
        case GET_CHATONLINEUSER_DASHBOARD_SUCCESS:
            return { ...state, loading: false, data: [], onlineUserCount: action.payload };

        // get ONLINE USER CHAT Dashboard Data failure
        case GET_CHATONLINEUSER_DASHBOARD_FAILURE:
            return { ...state, loading: false, data: action.payload };

        // get OFFLINE USER CHAT Dashboard Data
        case GET_CHATOFFLINEUSER_DASHBOARD:
            return { ...state, offlineloading: true, data: [] };

        // get OFFLINE USER CHAT Dashboard Data success
        case GET_CHATOFFLINEUSER_DASHBOARD_SUCCESS:
            return { ...state, offlineloading: false, data: [], offlineUserCount: action.payload };

        // get OFFLINE USER CHAT Dashboard Data failure
        case GET_CHATOFFLINEUSER_DASHBOARD_FAILURE:
            return { ...state, offlineloading: false, data: action.payload };

        // get OFFLINE USER CHAT Dashboard Data
        case GET_CHATACTIVEUSER_DASHBOARD:
            return { ...state, Activeloading: true, data: [] };

        // get OFFLINE USER CHAT Dashboard Data success
        case GET_CHATACTIVEUSER_DASHBOARD_SUCCESS:
            return { ...state, Activeloading: false, data: [], activeUserCount: action.payload };

        // get OFFLINE USER CHAT Dashboard Data failure
        case GET_CHATACTIVEUSER_DASHBOARD_FAILURE:
            return { ...state, Activeloading: false, data: action.payload };

        // get OFFLINE USER CHAT Dashboard Data
        case GET_CHATBLOCKEDUSER_DASHBOARD:
            return { ...state, blockloading: true, data: [] };

        // get OFFLINE USER CHAT Dashboard Data success
        case GET_CHATBLOCKEDUSER_DASHBOARD_SUCCESS:
            return { ...state, blockloading: false, data: [], blockedUserCount: action.payload };

        // get OFFLINE USER CHAT Dashboard Data failure
        case GET_CHATBLOCKEDUSER_DASHBOARD_FAILURE:
            return { ...state, blockloading: false, data: action.payload };

        // clear chat dashboard data
        case CLEAR_CHAT_DASHBOARD:
            return {
                ...state, loading: false, offlineloading: false, Activeloading: false,
                blockloading: false, onlineUserCount: null, offlineUserCount: null,
                activeUserCount: null, blockedUserCount: null,
            };

        default: return { ...state };
    }
}

export default ChatDashboardReducer;