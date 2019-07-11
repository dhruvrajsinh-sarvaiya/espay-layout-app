/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from 'react';
import Loadable from 'react-loadable';

// jbs page loader
import JbsPageLoader from 'Components/JbsPageLoader/JbsPageLoader';

// ecommerce dashboard
const AsyncEcommerceDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/ecommerce"),
	loading: () => <JbsPageLoader />,
});

// agency dashboard
const AsyncSaasDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/saas"),
	loading: () => <JbsPageLoader />,
});

// agency dashboard
const AsyncAgencyDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/agency"),
	loading: () => <JbsPageLoader />,
});

// boxed dashboard
const AsyncNewsDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/news"),
	loading: () => <JbsPageLoader />,
});
// trading dashboard
const AsyncTradingDashboardComponent = Loadable({
	loader: () => import("Routes/dashboard/trading"),
	loading: () => <JbsPageLoader />,
});

const AsyncUserWidgetComponent = Loadable({
	loader: () => import("Routes/widgets/user-widgets"),
	loading: () => <JbsPageLoader />,
});

const AsyncUserChartsComponent = Loadable({
	loader: () => import("Routes/widgets/charts-widgets"),
	loading: () => <JbsPageLoader />,
});

const AsyncGeneralWidgetsComponent = Loadable({
	loader: () => import("Routes/widgets/general-widgets"),
	loading: () => <JbsPageLoader />,
});

const AsyncPromoWidgetsComponent = Loadable({
	loader: () => import("Routes/widgets/promo-widgets"),
	loading: () => <JbsPageLoader />,
});

// about us
const AsyncAboutUsComponent = Loadable({
	loader: () => import("Routes/about-us"),
	loading: () => <JbsPageLoader />,
});

// chat app
const AsyncChatComponent = Loadable({
	loader: () => import("Routes/chat"),
	loading: () => <JbsPageLoader />,
});

// mail app
const AsyncMailComponent = Loadable({
	loader: () => import("Routes/mail"),
	loading: () => <JbsPageLoader />,
});

// todo app
const AsyncTodoComponent = Loadable({
	loader: () => import("Routes/todo"),
	loading: () => <JbsPageLoader />,
});

// gallery
const AsyncGalleryComponent = Loadable({
	loader: () => import("Routes/pages/gallery"),
	loading: () => <JbsPageLoader />,
});

// feedback
const AsyncFeedbackComponent = Loadable({
	loader: () => import("Routes/pages/feedback"),
	loading: () => <JbsPageLoader />,
});

// report
const AsyncReportComponent = Loadable({
	loader: () => import("Routes/pages/report"),
	loading: () => <JbsPageLoader />,
});

// faq
const AsyncFaqComponent = Loadable({
	loader: () => import("Routes/pages/faq"),
	loading: () => <JbsPageLoader />,
});

// pricing
const AsyncPricingComponent = Loadable({
	loader: () => import("Routes/pages/pricing"),
	loading: () => <JbsPageLoader />,
});

// blank
const AsyncBlankComponent = Loadable({
	loader: () => import("Routes/pages/blank"),
	loading: () => <JbsPageLoader />,
});

// google maps
const AsyncGooleMapsComponent = Loadable({
	loader: () => import("Routes/maps/google-map"),
	loading: () => <JbsPageLoader />,
});

// google maps
const AsyncLeafletMapComponent = Loadable({
	loader: () => import("Routes/maps/leaflet-map"),
	loading: () => <JbsPageLoader />,
});

// shop list
const AsyncShoplistComponent = Loadable({
	loader: () => import("Routes/ecommerce/shop-list"),
	loading: () => <JbsPageLoader />,
});

// shop grid
const AsyncShopGridComponent = Loadable({
	loader: () => import("Routes/ecommerce/shop-grid"),
	loading: () => <JbsPageLoader />,
});

// shop 
const AsyncShopComponent = Loadable({
	loader: () => import("Routes/ecommerce/shop"),
	loading: () => <JbsPageLoader />,
});

// cart 
const AsyncCartComponent = Loadable({
	loader: () => import("Routes/ecommerce/cart"),
	loading: () => <JbsPageLoader />,
});

// checkout 
const AsyncCheckoutComponent = Loadable({
	loader: () => import("Routes/ecommerce/checkout"),
	loading: () => <JbsPageLoader />,
});

// invoice
const AsyncInvoiceComponent = Loadable({
	loader: () => import("Routes/ecommerce/invoice"),
	loading: () => <JbsPageLoader />,
});

// react dragula
const AsyncReactDragulaComponent = Loadable({
	loader: () => import("Routes/drag-drop/react-dragula"),
	loading: () => <JbsPageLoader />,
});

// react dnd
const AsyncReactDndComponent = Loadable({
	loader: () => import("Routes/drag-drop/react-dnd"),
	loading: () => <JbsPageLoader />,
});

// themify icons
const AsyncThemifyIconsComponent = Loadable({
	loader: () => import("Routes/icons/themify-icons"),
	loading: () => <JbsPageLoader />,
});

// Simple Line Icons
const AsyncSimpleLineIconsComponent = Loadable({
	loader: () => import("Routes/icons/simple-line-icons"),
	loading: () => <JbsPageLoader />,
});

// Material Icons
const AsyncMaterialIconsComponent = Loadable({
	loader: () => import("Routes/icons/material-icons"),
	loading: () => <JbsPageLoader />,
});

// Basic Table
const AsyncBasicTableComponent = Loadable({
	loader: () => import("Routes/tables/basic"),
	loading: () => <JbsPageLoader />,
});

// Basic Table
const AsyncDataTableComponent = Loadable({
	loader: () => import("Routes/tables/data-table"),
	loading: () => <JbsPageLoader />,
});

// Responsive Table
const AsyncResponsiveTableComponent = Loadable({
	loader: () => import("Routes/tables/responsive"),
	loading: () => <JbsPageLoader />,
});

// Users List
const AsyncUsersListComponent = Loadable({
	loader: () => import("Routes/users/user-list"),
	loading: () => <JbsPageLoader />,
});

// Users Profile
const AsyncUserProfileComponent = Loadable({
	loader: () => import("Routes/users/user-profile"),
	loading: () => <JbsPageLoader />,
});

// Users Profile 1
const AsyncUserProfile1Component = Loadable({
	loader: () => import("Routes/users/user-profile-1"),
	loading: () => <JbsPageLoader />,
});

// Users Management
const AsyncUserManagementComponent = Loadable({
	loader: () => import("Routes/users/user-management"),
	loading: () => <JbsPageLoader />,
});

/*--------------- Charts ----------------*/

// Re charts
const AsyncRechartsComponent = Loadable({
	loader: () => import("Routes/charts/recharts"),
	loading: () => <JbsPageLoader />,
});

// ReactChartsjs2
const AsyncReactChartsjs2Component = Loadable({
	loader: () => import("Routes/charts/react-chartjs2"),
	loading: () => <JbsPageLoader />,
});

/*---------------------- Calendar -----------*/

// Basic Calendar
const AsyncBasicCalendarComponent = Loadable({
	loader: () => import("Routes/calendar/BasicCalendar"),
	loading: () => <JbsPageLoader />,
});

// Cultures Calendar
const AsyncCulturesComponent = Loadable({
	loader: () => import("Routes/calendar/Cultures"),
	loading: () => <JbsPageLoader />,
});

// Dnd Calendar
const AsyncDndComponent = Loadable({
	loader: () => import("Routes/calendar/Dnd"),
	loading: () => <JbsPageLoader />,
});

// Selectable Calendar
const AsyncSelectableComponent = Loadable({
	loader: () => import("Routes/calendar/Selectable"),
	loading: () => <JbsPageLoader />,
});

// Custom Calendar
const AsyncCustomComponent = Loadable({
	loader: () => import("Routes/calendar/Custom"),
	loading: () => <JbsPageLoader />,
});

/*---------------- Session ------------------*/

// Session Login
const AsyncSessionLoginComponent = Loadable({
	loader: () => import("Routes/session/login"),
	loading: () => <JbsPageLoader />,
});

// Session Register
const AsyncSessionRegisterComponent = Loadable({
	loader: () => import("Routes/session/register"),
	loading: () => <JbsPageLoader />,
});

// Session Lock Screen
const AsyncSessionLockScreenComponent = Loadable({
	loader: () => import("Routes/session/lock-screen"),
	loading: () => <JbsPageLoader />,
});

// Session Forgot Password
const AsyncSessionForgotPasswordComponent = Loadable({
	loader: () => import("Routes/session/forgot-password"),
	loading: () => <JbsPageLoader />,
});

// Session Page 404
const AsyncSessionPage404Component = Loadable({
	loader: () => import("Routes/session/404"),
	loading: () => <JbsPageLoader />,
});

// Session Page 404
const AsyncSessionPage500Component = Loadable({
	loader: () => import("Routes/session/500"),
	loading: () => <JbsPageLoader />,
});

// terms and condition
const AsyncTermsConditionComponent = Loadable({
	loader: () => import("Routes/pages/terms-condition"),
	loading: () => <JbsPageLoader />,
});

/*---------------- Editor -------------------*/

// editor quill
const AsyncQuillEditorComponent = Loadable({
	loader: () => import("Routes/editor/quill-editor"),
	loading: () => <JbsPageLoader />,
});

// editor Wysiwyg
const AsyncWysiwygEditorComponent = Loadable({
	loader: () => import("Routes/editor/wysiwyg-editor"),
	loading: () => <JbsPageLoader />,
});

/*------------- Form Elemets -------------*/

// forms elements
const AsyncFormElementsComponent = Loadable({
	loader: () => import("Routes/forms/form-elements"),
	loading: () => <JbsPageLoader />,
});

// forms TextField
const AsyncTextFieldComponent = Loadable({
	loader: () => import("Routes/forms/material-text-field"),
	loading: () => <JbsPageLoader />,
});

// forms TextField
const AsyncSelectListComponent = Loadable({
	loader: () => import("Routes/forms/select-list"),
	loading: () => <JbsPageLoader />,
});

/*------------------ UI Components ---------------*/

// components Alerts
const AsyncUIAlertsComponent = Loadable({
	loader: () => import("Routes/components/alert"),
	loading: () => <JbsPageLoader />,
});

// components Appbar
const AsyncUIAppbarComponent = Loadable({
	loader: () => import("Routes/components/app-bar"),
	loading: () => <JbsPageLoader />,
});

// components BottomNavigation
const AsyncUIBottomNavigationComponent = Loadable({
	loader: () => import("Routes/components/bottom-navigation"),
	loading: () => <JbsPageLoader />,
});

// components BottomNavigation
const AsyncUIAvatarsComponent = Loadable({
	loader: () => import("Routes/components/avatar"),
	loading: () => <JbsPageLoader />,
});

// components Buttons
const AsyncUIButtonsComponent = Loadable({
	loader: () => import("Routes/components/buttons"),
	loading: () => <JbsPageLoader />,
});

// components Badges
const AsyncUIBadgesComponent = Loadable({
	loader: () => import("Routes/components/badges"),
	loading: () => <JbsPageLoader />,
});

// components CardMasonary
const AsyncUICardMasonaryComponent = Loadable({
	loader: () => import("Routes/components/card-masonry"),
	loading: () => <JbsPageLoader />,
});

// components Cards
const AsyncUICardsComponent = Loadable({
	loader: () => import("Routes/components/cards"),
	loading: () => <JbsPageLoader />,
});

// components Chips
const AsyncUIChipsComponent = Loadable({
	loader: () => import("Routes/components/chip"),
	loading: () => <JbsPageLoader />,
});

// components Dialog
const AsyncUIDialogComponent = Loadable({
	loader: () => import("Routes/components/dialog"),
	loading: () => <JbsPageLoader />,
});

// components Dividers
const AsyncUIDividersComponent = Loadable({
	loader: () => import("Routes/components/dividers"),
	loading: () => <JbsPageLoader />,
});

// components Drawers
const AsyncUIDrawersComponent = Loadable({
	loader: () => import("Routes/components/drawers"),
	loading: () => <JbsPageLoader />,
});

// components ExpansionPanel
const AsyncUIExpansionPanelComponent = Loadable({
	loader: () => import("Routes/components/expansion-panel"),
	loading: () => <JbsPageLoader />,
});

// components Grid List
const AsyncUIGridListComponent = Loadable({
	loader: () => import("Routes/components/grid-list"),
	loading: () => <JbsPageLoader />,
});

// components List
const AsyncUIListComponent = Loadable({
	loader: () => import("Routes/components/list"),
	loading: () => <JbsPageLoader />,
});

// components Menu
const AsyncUIMenuComponent = Loadable({
	loader: () => import("Routes/components/menu"),
	loading: () => <JbsPageLoader />,
});

// components Popover
const AsyncUIPopoverComponent = Loadable({
	loader: () => import("Routes/components/popover"),
	loading: () => <JbsPageLoader />,
});

// components Progress
const AsyncUIProgressComponent = Loadable({
	loader: () => import("Routes/components/progress"),
	loading: () => <JbsPageLoader />,
});

// components Snackbar
const AsyncUISnackbarComponent = Loadable({
	loader: () => import("Routes/components/snackbar"),
	loading: () => <JbsPageLoader />,
});

// components SelectionControls
const AsyncUISelectionControlsComponent = Loadable({
	loader: () => import("Routes/components/selection-controls"),
	loading: () => <JbsPageLoader />,
});

/*---------------- Advance UI Components -------------*/

// advance components DateAndTimePicker
const AsyncAdvanceUIDateAndTimePickerComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/dateTime-picker"),
	loading: () => <JbsPageLoader />,
});

// advance components Tabs
const AsyncAdvanceUITabsComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/tabs"),
	loading: () => <JbsPageLoader />,
});

// advance components Stepper
const AsyncAdvanceUIStepperComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/stepper"),
	loading: () => <JbsPageLoader />,
});

// advance components NotificationComponent
const AsyncAdvanceUINotificationComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/notification"),
	loading: () => <JbsPageLoader />,
});

// advance components SweetAlert
const AsyncAdvanceUISweetAlertComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/sweet-alert"),
	loading: () => <JbsPageLoader />,
});

// advance components autoComplete
const AsyncAdvanceUIAutoCompleteComponent = Loadable({
	loader: () => import("Routes/advance-ui-components/autoComplete"),
	loading: () => <JbsPageLoader />,
});

/* ==================== My Account ================= */
/* My Account Components */
const AsyncTwoFaAuthenticationComponent = Loadable({
	loader: () => import("Routes/my-account/2fa-authentication"),
	loading: () => <JbsPageLoader />,
});

const AsyncLoginComponent = Loadable({
	loader: () => import("Routes/my-account/login"),
	loading: () => <JbsPageLoader />,
});

// MyAccount - Login History Simple Table - Parth
const AsyncLoginHistoryComponent = Loadable({
	loader: () => import("Routes/my-account/login-history"),
	loading: () => <JbsPageLoader />,
});

// MyAccount - IP History Data Table - Parth
const AsyncIPHistoryComponent = Loadable({
	loader: () => import("Routes/my-account/ip-history"),
	loading: () => <JbsPageLoader />,
});

export {
	AsyncUserWidgetComponent,
	AsyncUserChartsComponent,
	AsyncGeneralWidgetsComponent,
	AsyncPromoWidgetsComponent,
	AsyncAboutUsComponent,
	AsyncChatComponent,
	AsyncMailComponent,
	AsyncTodoComponent,
	AsyncGalleryComponent,
	AsyncFeedbackComponent,
	AsyncReportComponent,
	AsyncFaqComponent,
	AsyncPricingComponent,
	AsyncBlankComponent,
	AsyncGooleMapsComponent,
	AsyncLeafletMapComponent,
	AsyncShoplistComponent,
	AsyncShopGridComponent,
	AsyncInvoiceComponent,
	AsyncReactDragulaComponent,
	AsyncReactDndComponent,
	AsyncThemifyIconsComponent,
	AsyncSimpleLineIconsComponent,
	AsyncMaterialIconsComponent,
	AsyncBasicTableComponent,
	AsyncDataTableComponent,
	AsyncResponsiveTableComponent,
	AsyncUsersListComponent,
	AsyncUserProfileComponent,
	AsyncUserProfile1Component,
	AsyncUserManagementComponent,
	AsyncRechartsComponent,
	AsyncReactChartsjs2Component,
	AsyncBasicCalendarComponent,
	AsyncCulturesComponent,
	AsyncDndComponent,
	AsyncSelectableComponent,
	AsyncCustomComponent,
	AsyncSessionLoginComponent,
	AsyncSessionRegisterComponent,
	AsyncSessionLockScreenComponent,
	AsyncSessionForgotPasswordComponent,
	AsyncSessionPage404Component,
	AsyncSessionPage500Component,
	AsyncTermsConditionComponent,
	AsyncQuillEditorComponent,
	AsyncWysiwygEditorComponent,
	AsyncFormElementsComponent,
	AsyncTextFieldComponent,
	AsyncSelectListComponent,
	AsyncUIAlertsComponent,
	AsyncUIAppbarComponent,
	AsyncUIBottomNavigationComponent,
	AsyncUIAvatarsComponent,
	AsyncUIButtonsComponent,
	AsyncUIBadgesComponent,
	AsyncUICardMasonaryComponent,
	AsyncUICardsComponent,
	AsyncUIChipsComponent,
	AsyncUIDialogComponent,
	AsyncUIDividersComponent,
	AsyncUIDrawersComponent,
	AsyncUIExpansionPanelComponent,
	AsyncUIGridListComponent,
	AsyncUIListComponent,
	AsyncUIMenuComponent,
	AsyncUIPopoverComponent,
	AsyncUIProgressComponent,
	AsyncUISnackbarComponent,
	AsyncUISelectionControlsComponent,
	AsyncAdvanceUIDateAndTimePickerComponent,
	AsyncAdvanceUITabsComponent,
	AsyncAdvanceUIStepperComponent,
	AsyncAdvanceUINotificationComponent,
	AsyncAdvanceUISweetAlertComponent,
	AsyncAdvanceUIAutoCompleteComponent,
	AsyncShopComponent,
	AsyncCartComponent,
	AsyncCheckoutComponent,
	AsyncEcommerceDashboardComponent,
	AsyncSaasDashboardComponent,
	AsyncAgencyDashboardComponent,
	AsyncNewsDashboardComponent,
	AsyncTradingDashboardComponent,
	AsyncTwoFaAuthenticationComponent,
	AsyncLoginComponent,
	AsyncLoginHistoryComponent,
	AsyncIPHistoryComponent
};
