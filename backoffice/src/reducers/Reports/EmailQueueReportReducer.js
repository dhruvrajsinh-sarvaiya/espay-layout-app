import {
    GET_EMAIL_QUEUE_REQUEST,
    GET_EMAIL_QUEUE_SUCCESS,
    GET_EMAIL_QUEUE_FAIL,
    RESEND_EMAIL_QUEUE_REQUEST,
    RESEND_EMAIL_QUEUE_REQUEST_SUCCESS,
    RESEND_EMAIL_QUEUE_REQUEST_FAIL
} from 'Actions/types';

const INIT_STATE = {
    QueueListResponse: {},
    Loading: false,
    error:"",
    ResendEmailResponse:{},
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {
        //For Display Users
        case GET_EMAIL_QUEUE_REQUEST:
            return { ...state, loading: true };

        case GET_EMAIL_QUEUE_SUCCESS:
            return { ...state,
                loading: false,
                QueueListResponse: action.payload,
                ResendEmailResponse:{},
                error:''
            };

        case GET_EMAIL_QUEUE_FAIL:
            return { ...state,
                loading: false,
                QueueListResponse:{},
                ResendEmailResponse:{},
                error: action.payload
            };

        case RESEND_EMAIL_QUEUE_REQUEST:
            return { ...state,loading:true};

        case RESEND_EMAIL_QUEUE_REQUEST_SUCCESS:
            return { ...state,
                loading:false,
                ResendEmailResponse:action.payload,
                error:''
            };

        case RESEND_EMAIL_QUEUE_REQUEST_FAIL:
            return { ...state,
                loading:false,
                error:action.payload,
                ResendEmailResponse:{},
                QueueListResponse:{}
            };
        //For Delete Users

        default:
            return { ...state };
    }
};
