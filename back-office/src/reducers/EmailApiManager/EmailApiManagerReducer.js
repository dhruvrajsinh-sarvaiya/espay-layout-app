import {
    GET_EMAIL_API_LIST_REQUEST,
    GET_EMAIL_API_LIST_REQUEST_SUCCESS,
    GET_EMAIL_API_LIST_REQUEST_FAIL,
    EDIT_EMAIL_API_REQUEST,
    EDIT_EMAIL_API_REQUEST_SUCCESS,
    EDIT_EMAIL_API_REQUEST_FAIL,
    ADD_EMAIL_API_REQUEST,
    ADD_EMAIL_API_REQUEST_SUCCESS,
    ADD_EMAIL_API_REQUEST_FAIL,
    GET_REQUEST_FORMAT,
    GET_REQUEST_FORMAT_SUCCESS,
    GET_REQUEST_FORMAT_FAIL,
    GET_ALL_THIRD_PARTY_RESPONSE,
    GET_ALL_THIRD_PARTY_RESPONSE_SUCCESS,
    GET_ALL_THIRD_PARTY_RESPONSE_FAIL
} from 'Actions/types';

const INIT_STATE = {
    EmailApiList: [],
    error:"",
    Loading: false,
    EditResponse:{},
    EditError:"",
    EditLoading:false,
    AddResponse:{},
    AddError:"",
    AddLoading:false,
    RequestFormatResponse:{},
    ThirdPartyAPIResponse:{}
};


export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    
    switch (action.type) {
        //For Display Users
        case GET_EMAIL_API_LIST_REQUEST:
            return { ...state, loading: true};

        case GET_EMAIL_API_LIST_REQUEST_SUCCESS:
            return { ...state, loading: false, EmailApiList: action.payload,error:''};

        case GET_EMAIL_API_LIST_REQUEST_FAIL:
            return { ...state, loading: false,EmailApiList:[],error:action.payload.error};

        case EDIT_EMAIL_API_REQUEST :
            return { ...state,loading:true};

        case EDIT_EMAIL_API_REQUEST_SUCCESS :
            return {...state,loading:false,EditResponse:action.payload,EditError:""};

        case EDIT_EMAIL_API_REQUEST_FAIL :
            return {...state,loading:false,EditError:action.payload.error,EditResponse:{}};

        case ADD_EMAIL_API_REQUEST :
            return { ...state,loading:true};

        case ADD_EMAIL_API_REQUEST_SUCCESS :
            return {...state,loading:false,AddResponse:action.payload,AddError:""};

        case ADD_EMAIL_API_REQUEST_FAIL :
            return {...state,loading:false,AddError:action.payload.error,AddResponse:{}};

        case GET_REQUEST_FORMAT :
            return {...state,loading:true,RequestFormatResponse:{},EditResponse:{},AddResponse:{},ThirdPartyAPIResponse:{}};

        case GET_REQUEST_FORMAT_SUCCESS :
            return {...state,loading:false,RequestFormatResponse:action.payload,AddResponse:{}};

        case GET_REQUEST_FORMAT_FAIL :
            return {...state,loading:false,RequestFormatResponse:action.payload.error,AddResponse:{}};

        case GET_ALL_THIRD_PARTY_RESPONSE :
            return {...state,loading:true,RequestFormatResponse:{},EditResponse:{},AddResponse:{},ThirdPartyAPIResponse:{}};

        case GET_ALL_THIRD_PARTY_RESPONSE_SUCCESS :
            return {...state,loading:false,ThirdPartyAPIResponse:action.payload};

        case GET_ALL_THIRD_PARTY_RESPONSE_FAIL :
            return {...state,loading:false,ThirdPartyAPIResponse:action.payload.error};

        default:
            return { ...state };
    }
};
