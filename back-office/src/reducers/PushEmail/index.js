/**
 * App Reducers
*/
import { combineReducers } from "redux";
import settings from "./settings";
import chatAppReducer from "./ChatAppReducer";
import emailAppReducer from "./EmailAppReducer";
import sidebarReducer from "./SidebarReducer";
import todoAppReducer from "./TodoAppReducer";
import authUserReducer from "./AuthUserReducer";
import feedbacksReducer from "./FeedbacksReducer";
import ecommerceReducer from "./EcommerceReducer";
import emailpushRcd from"./MyAccount/PremissionForm";

const reducers = combineReducers({
    settings,
    chatAppReducer,
    emailApp: emailAppReducer,
    sidebar: sidebarReducer,
    todoApp: todoAppReducer,
    authUser: authUserReducer,
    feedback: feedbacksReducer,
    ecommerce: ecommerceReducer,

    /*===================== Start My Account Section ================*/
    /* Added by Kevin.... */
    emailpushRcd:emailpushRcd,
    /*===================== End My Account Section ================*/
});

export default reducers;
