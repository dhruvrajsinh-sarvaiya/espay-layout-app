/* 
    Createdby : DHara gajera
    CreatedDate : 26-12-2018
    UpdatedDate : 2-1-2019
    Description : chat user list Reducer action manager
*/
// action types
import {
    GET_CHATUSERLIST,
    GET_CHATUSERLIST_SUCCESS,
    GET_CHATUSERLIST_FAILURE,

    //update block user status for chat
    CHANGEUSERBLOCKSTATUSCHAT,
    CHANGEUSERBLOCKSTATUSCHAT_SUCCESS,
    CHANGEUSERBLOCKSTATUSCHAT_FAILURE,
    GET_USERDATA_BY_USERNAME,
    GET_CHATUSERHISTORY,
    GET_CHATUSERHISTORY_SUCCESS,
    GET_CHATUSERHISTORY_FAILURE,
   
} from 'Actions/types';

// initial state
const INIT_STATE = {
    chatUser_list:[],
	loading: false,
    errors:{},
    chatUserStatus:[],
    UserData:{},
    statusChecker:0, //to check status update method called
    chatUser_History:[],
};
export default (state = INIT_STATE, action) => {
    // console.log("CHATList===>",action);
    switch (action.type) {
        // get Chat User List
        case GET_CHATUSERLIST:
            return { ...state,loading:true, chatUser_History:[], chatUserStatus:[],errors:{},UserData:{},statusChecker:0}; // set chatUser_History to blank by Jayesh 28-01-2019

        // get Chat User List success
        case GET_CHATUSERLIST_SUCCESS:        
            return { ...state, loading: false,chatUserStatus:[],chatUser_list:action.payload,statusChecker:0};

        // get Chat User List failure
        case GET_CHATUSERLIST_FAILURE:
            // return {...state, loading: false};
            return {...state, loading: false,errors: action.payload,statusChecker:0};

        // chat user block status
        case CHANGEUSERBLOCKSTATUSCHAT:
            return { ...state,loading:true,chatUserStatus:[],errors:{},statusChecker:1};

        // chat user block status success
        case CHANGEUSERBLOCKSTATUSCHAT_SUCCESS:        
            return { ...state, loading: false,chatUserStatus:action.payload,statusChecker:1};

        // chat user block status failure
        case CHANGEUSERBLOCKSTATUSCHAT_FAILURE:
            return {...state, loading: false,errors: action.payload,statusChecker:1};

        // get Chat User History
        case GET_CHATUSERHISTORY:
            return { ...state,loading:true, chatUser_History:[], errors:{},statusChecker:0}; // set chatUser_History to blank by Jayesh 25-01-2019

        // get Chat User History success
        case GET_CHATUSERHISTORY_SUCCESS:        
            return { ...state, loading: false,chatUser_History:action.payload,statusChecker:0};

        // get Chat User History failure
        case GET_CHATUSERHISTORY_FAILURE:
            return {...state, loading: false,errors: action.payload,statusChecker:0};

        //now not in use
        case GET_USERDATA_BY_USERNAME:
            let userdataSaver ={};
            state.chatUser_list.Users.forEach(element => {
                if(element.UserName === action.payload){
                    userdataSaver=element;
                }
            });
            return {...state, loading: true,UserData:userdataSaver};

        default: return { ...state };
    }
}
