/**
 * Redux App Settings Actions
 */
import {
    COLLAPSED_SIDEBAR,
    //DARK_MODE,
    BOXED_LAYOUT,
    RTL_LAYOUT,
    TOGGLE_MENU,
    MINI_SIDEBAR,
    SEARCH_FORM_ENABLE,
    CHANGE_THEME_COLOR,
    TOGGLE_SIDEBAR_IMAGE,
    SET_SIDEBAR_IMAGE,
    SET_LANGUAGE,
    SET_LANGUAGE_SUCCESS, //added by salim dt:04/04/2019
    SET_LANGUAGE_FAILURE, //added by salim dt:04/04/2019
    START_USER_TOUR,
    STOP_USER_TOUR,
    TOGGLE_DARK_SIDENAV,
    AGENCY_TOGGLE_MENU,
    CHANGE_AGENCY_LAYOUT_BG,
    //Added by Kushal For Get language Action type
    GET_LANGUAGES,
    GET_LANGUAGES_SUCCESS,
    GET_LANGUAGES_FAILURE,

    MODE_CHANGE,
    MODE_CHANGE_SUCCESS,
    MODE_CHANGE_FAILURE
} from './types';

/**
 * Redux Action To Emit Collapse Sidebar
 * @param {*boolean} isCollapsed 
 */
export const collapsedSidebarAction = (isCollapsed) => ({
    type: COLLAPSED_SIDEBAR,
    isCollapsed
});

/**
 * Redux Action To Start User Tour
 */
export const startUserTour = () => ({
    type: START_USER_TOUR
});

/**
 * Redux Action To Stop User Tour
 */
export const stopUserTour = () => ({
    type: STOP_USER_TOUR
});

/**
 * Redux Action To Emit Dark Mode
 * @param {*boolean} isDarkMode 
 */

/**
 * Redux Action To Emit Boxed Layout
 * @param {*boolean} isBoxLayout 
 */
export const boxLayoutAction = (isBoxLayout) => ({
    type: BOXED_LAYOUT,
    payload: isBoxLayout
});

/**
 * Redux Action To Emit Rtl Layout
 *  @param {*boolean} isRtlLayout
 */
export const rtlLayoutAction = (isRtlLayout) => ({
    type: RTL_LAYOUT,
    payload: isRtlLayout
});

/**
 * Redux Action To Toggle Sidebar Menus
 */
export const onToggleMenu = (selectedMenu) => ({
    type: TOGGLE_MENU,
    payload: selectedMenu
});

/**
 * Redux Action To Toggle Agency Sidebar Menus
 */
export const onToggleAgencyMenu = (selectedAgencyMenu) => ({
    type: AGENCY_TOGGLE_MENU,
    payload: selectedAgencyMenu
});

/**
 * Redux Action To Emit Mini Sidebar
 */
export const miniSidebarAction = (isMiniSidebar) => ({
    type: MINI_SIDEBAR,
    payload: isMiniSidebar
});

/**
 * Redux Action To Enable/Disable The Search Form
 */
export const toggleSearchForm = () => ({
    type: SEARCH_FORM_ENABLE
});

/**
 * Reduc Action To Change Theme Colors
 */
export const changeThemeColor = (theme) => ({
    type: CHANGE_THEME_COLOR,
    payload: theme
});

/**
 * Redux Action To Enable/Disable Sidebar Background Image
 */
export const toggleSidebarImage = () => ({
    type: TOGGLE_SIDEBAR_IMAGE
});

/**
 * Redux Action To Set Sidebar Background Image
 */
export const setSidebarBgImageAction = (sidebarImage) => ({
    type: SET_SIDEBAR_IMAGE,
    payload: sidebarImage
});

/**
 * Redux Action To Set Language
 */
export const setLanguage = (language) => ({
    type: SET_LANGUAGE,
    payload: language
});

//Added by salim dt:04/04/2019
/**
 * Redux Action To Set Language Success
 */
export const setLanguageSuccess = (data) => ({
    type: SET_LANGUAGE_SUCCESS,
    payload: data
});

/**
 * Redux Action To Set Language Failure
 */
export const setLanguageFailure = (error) => ({
    type: SET_LANGUAGE_FAILURE,
    payload: error
});
//End salim code

/**
 * Redux Action To Toggle Dark Sidenav
 */
export const toggleDarkSidebar = () => ({
    type: TOGGLE_DARK_SIDENAV
})

/**
 * Redux Action For Agency Layout Bg Handler
 */
export const agencyLayoutBgHandler = (color) => ({
    type: CHANGE_AGENCY_LAYOUT_BG,
    payload: color
})

/**
 * Redux Action To Get Languages  added by Jayesh 11-12-2018
 */
export const getLanguages = () => ({
    type: GET_LANGUAGES
});

/**
 * Redux Action To Get Languages Success
 */
export const getLanguagesSuccess = (response) => ({
    type: GET_LANGUAGES_SUCCESS,
    payload: response.data
});

/**
 * Redux Action To Get Languages Failure
 */
export const getLanguagesFailure = (error) => ({
    type: GET_LANGUAGES_FAILURE,
    payload: error
});

export const modeChange = (request) => ({
    type: MODE_CHANGE,
    payload:request
})

export const modeChangeSuccess = (res) => ({
    type: MODE_CHANGE_SUCCESS,
    payload:res
})

export const modeChangeFailure = (err) => ({
    type: MODE_CHANGE_FAILURE,
    payload:err
})