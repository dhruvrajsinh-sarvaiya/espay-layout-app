/**
 * App Settings Reducers
 */

import {
  COLLAPSED_SIDEBAR,
  BOXED_LAYOUT,
  RTL_LAYOUT,
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
  CHANGE_AGENCY_LAYOUT_BG,
  GET_LANGUAGES,
  GET_LANGUAGES_SUCCESS,
  GET_LANGUAGES_FAILURE,
  MODE_CHANGE,
  MODE_CHANGE_SUCCESS,
  MODE_CHANGE_FAILURE
} from "Actions/types";

// app config
import AppConfig from "Constants/AppConfig";

/**
 * initial app settings
 */
const INIT_STATE = {
  navCollapsed: AppConfig.navCollapsed,
  boxLayout: AppConfig.boxLayout,
  rtlLayout: AppConfig.rtlLayout,
  miniSidebar: AppConfig.miniSidebar,
  searchFormOpen: false, // search form by default false
  startUserTour: false,
  isDarkSidenav: AppConfig.isDarkSidenav,
  modeChangeData: {},
  loading: false,
  themes: [
    {
      id: 1,
      name: "primary"
    },
    {
      id: 2,
      name: "secondary"
    },
    {
      id: 3,
      name: "warning"
    },
    {
      id: 4,
      name: "info"
    },
    {
      id: 5,
      name: "danger"
    },
    {
      id: 6,
      name: "success"
    }
  ],
  activeTheme: {
    id: 1,
    name: "primary"
  },
  // sidebar background image
  sidebarBackgroundImages: [
    require("Assets/img/sidebar-1.jpg"),
    require("Assets/img/sidebar-2.jpg"),
    require("Assets/img/sidebar-3.jpg"),
    require("Assets/img/sidebar-4.jpg")
  ],
  enableSidebarBackgroundImage: AppConfig.enableSidebarBackgroundImage, // default enable sidebar background
  selectedSidebarImage: AppConfig.sidebarImage, // default sidebar background image
  locale: AppConfig.locale,
  languages: [
    {
      languageId: "english",
      locale: "en",
      name: "English",
      icon: "en"
    }
  ],
  agencyLayoutBgColors: [
    {
      id: 1,
      class: "bg-grdnt-violet",
      active: true
    },
    {
      id: 2,
      class: "bg-grdnt-youtube"
    },
    {
      id: 3,
      class: "bg-grdnt-primary-danger"
    },
    {
      id: 4,
      class: "bg-grdnt-purple-danger"
    },
    {
      id: 5,
      class: "bg-grdnt-purple-dark"
    }
  ],
  langData: '', //Added by salim dt:04/04/2019
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INIT_STATE
  }

  switch (action.type) {
    // collapse sidebar
    case COLLAPSED_SIDEBAR:
      return { ...state, navCollapsed: action.isCollapsed };

    // start user tour
    case START_USER_TOUR:
      return { ...state, startUserTour: true };

    // stop user tour
    case STOP_USER_TOUR:
      return { ...state, startUserTour: false };

    // change theme color
    case CHANGE_THEME_COLOR:
      return { ...state, activeTheme: action.payload };

    // boxed layout
    case BOXED_LAYOUT:
      return { ...state, boxLayout: action.payload };

    // rtl layout
    case RTL_LAYOUT:
      return { ...state, rtlLayout: action.payload };

    // mini sidebar
    case MINI_SIDEBAR:
      return { ...state, miniSidebar: action.payload };

    // search form
    case SEARCH_FORM_ENABLE:
      document.body.classList.toggle("search-active", !state.searchFormOpen);
      return { ...state, searchFormOpen: !state.searchFormOpen };

    // togglw sidebar image
    case TOGGLE_SIDEBAR_IMAGE:
      return {
        ...state,
        enableSidebarBackgroundImage: !state.enableSidebarBackgroundImage
      };

    // set sidebar image
    case SET_SIDEBAR_IMAGE:
      return { ...state, selectedSidebarImage: action.payload };

    // set language
    case SET_LANGUAGE:
      return { ...state, loading: true, locale: action.payload, langData: '' };

    case SET_LANGUAGE_SUCCESS: //added by salim dt:04/04/2019
      return { ...state, loading: false, locale: action.payload.locale, langData: action.payload.response };

    case SET_LANGUAGE_FAILURE: //added by salim dt:04/04/2019
      return { ...state, loading: false, locale: action.payload.locale, langData: action.payload.response };

    // dark sidenav
    case TOGGLE_DARK_SIDENAV:
      return { ...state, isDarkSidenav: !state.isDarkSidenav };

    // agency layout bg handler
    case CHANGE_AGENCY_LAYOUT_BG:
      let layoutsBg = [];
      for (const layoutBg of state.agencyLayoutBgColors) {
        if (layoutBg.id === action.payload.id) {
          layoutBg.active = true;
        } else {
          layoutBg.active = false;
        }
        layoutsBg.push(layoutBg);
      }
      return {
        ...state,
        agencyLayoutBgColors: layoutsBg
      };

    // get languages added by Jayesh 11-12-2018
    case GET_LANGUAGES:
      return { ...state, loading: true };

    // get languages success
    case GET_LANGUAGES_SUCCESS:
      return { ...state, languages: action.payload.language, locale: action.payload.defaultlanguage, rtlLayout: action.payload.defaultlanguage.rtlLayout, loading: false };

    // get languages failure
    case GET_LANGUAGES_FAILURE:
      return { ...state, loading: false }

    case MODE_CHANGE:
      return { ...state, loading: true, modeChangeData: {} };

    case MODE_CHANGE_SUCCESS:
      return { ...state, loading: false, modeChangeData: action.payload };

    case MODE_CHANGE_FAILURE:
      return { ...state, loading: false, modeChangeData: action.payload };

    default:
      return { ...state };
  }
};
