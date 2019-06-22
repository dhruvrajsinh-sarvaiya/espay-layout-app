// Action types for FAQ Module
import {
    // Get FAQ
    GET_FAQ,
    GET_FAQ_SUCCESS,
    GET_FAQ_FAILURE,

    // Get FAQ Category
    GET_FAQ_CATEGORIES,
    GET_FAQ_CATEGORIES_SUCCESS,
    GET_FAQ_CATEGORIES_FAILURE,

    // Get FAQ Question
    GET_FAQ_QUESTIONS,
    GET_FAQ_QUESTIONS_SUCCESS,
    GET_FAQ_QUESTIONS_FAILURE,

    // Update Search FAQ
    UPDATE_SEARCH_FAQ,

    // On Search FAQ
    ON_SEARCH_FAQ,

    // Show FAQ Loading Indicator
    SHOW_FAQ_LOADING_INDICATOR,

    // Hide FAQ Loading Indicator
    HIDE_FAQ_LOADING_INDICATOR,

    // Action Logout
    ACTION_LOGOUT,
} from '../actions/ActionTypes';

// initial state for FAQ Module
const INTIAL_STATE = {
    faqs_categories_list: null,
    allfaqs: null,
    faqs: null,
    faqloading: false,
    searchFaqText: ''
};

export default (state = INTIAL_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle FAQ Categories method data
        case GET_FAQ_CATEGORIES:
            return { ...state, faqloading: true, faqs_categories_list: null };

        // Set FAQ Categories success data
        case GET_FAQ_CATEGORIES_SUCCESS:
            return { ...state, faqloading: false, faqs_categories_list: action.payload };

        // Set FAQ Categories failure data
        case GET_FAQ_CATEGORIES_FAILURE:
            return { ...state, faqloading: false, faqs_categories_list: null };

        // Handle FAQ Questions method data
        case GET_FAQ_QUESTIONS:
            return { ...state, faqloading: true };

        // Set FAQ Questions success data
        case GET_FAQ_QUESTIONS_SUCCESS:
            return { ...state, faqloading: false, allfaqs: action.payload, faqs: action.payload };

        // Set FAQ Questions failure data
        case GET_FAQ_QUESTIONS_FAILURE:
            return { ...state, faqloading: false }

        // Handle Get FAQ method data
        case GET_FAQ:
            return { ...state, faqloading: true, faqs: null };

        // Get FAQ success data
        case GET_FAQ_SUCCESS:
            return { ...state, faqloading: false, allfaqs: action.payload, faqs: action.payload };

        // Get FAQ failure data
        case GET_FAQ_FAILURE:
            return { ...state, faqloading: false, faqs: null };

        // show loading indicator
        case SHOW_FAQ_LOADING_INDICATOR:
            return { ...state, faqloading: true };

        // hide loading indicator
        case HIDE_FAQ_LOADING_INDICATOR:
            return { ...state, faqloading: false };

        // update search
        case UPDATE_SEARCH_FAQ:
            return { ...state, searchFaqText: action.payload };

        // on search faq
        case ON_SEARCH_FAQ:
            if (action.payload === '') {
                return { ...state, faqs: state.allfaqs, faqloading: false };
            } else {
                const searchFaqs = state.allfaqs.filter((faq) =>
                    faq.locale.en.question.toLowerCase().indexOf(action.payload.toLowerCase()) > -1);
                return { ...state, faqs: searchFaqs, faqloading: false }
            }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}
