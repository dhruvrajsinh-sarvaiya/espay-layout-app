import { moderateScale } from 'react-native-size-matters';

export const normalizePixels = (size) => moderateScale(size);

const dimens = {
    normalizePixels,
    MENU_ICON_SIZE: normalizePixels(32),
    LARGE_MENU_ICON_SIZE: normalizePixels(22),
    SMALL_MENU_ICON_SIZE: normalizePixels(18),
    SMALLEST_ICON_SIZE: normalizePixels(14),
    open_order_margin: normalizePixels(18),
    smallestText: normalizePixels(12),
    smallText: moderateScale(14),
    mediumText: normalizePixels(18),
    largeText: normalizePixels(22),
    login_text_size: normalizePixels(35),

    splashImageWidthHeight: normalizePixels(100),
    SplashPorgressHeight: normalizePixels(40),

    icon_header_width_height: normalizePixels(40),

    activity_margin: normalizePixels(30),
    license_code_activity_margin: normalizePixels(40),
    widget_left_right_margin: normalizePixels(10),
    widget_top_bottom_margin: normalizePixels(10),
    margin: normalizePixels(10),
    padding_left_right_margin: normalizePixels(16),
    padding_top_bottom_margin: normalizePixels(16),

    LoginScreenTopMargin: normalizePixels(20),
    LoginImageWidthHeight: normalizePixels(80),
    IconWidthHeight: normalizePixels(30),
    EditTextHeights: normalizePixels(60),
    WidgetPadding: normalizePixels(10),
    ToolbarHeights: normalizePixels(46),
    LineHeight: moderateScale(2),
    paginationButtonHeightWidth: normalizePixels(42),
    paginationButtonRadious: normalizePixels(64),
    CardViewElivation: moderateScale(3),

    LoginButtonHeight: normalizePixels(40),
    LoginButtonWidth: normalizePixels(125),
    LoginButtonBorderRadius: normalizePixels(20),
    LoginButtonTop_Margin: normalizePixels(5),
    widgetMargin: moderateScale(5),

    date_picker_left_right_margin: normalizePixels(35),
    date_picker_height: normalizePixels(40),
    margin_between_dtpicker_header: normalizePixels(60),
    date_picker_image_size: normalizePixels(24),
    date_picker_font_size: normalizePixels(18),

    roundButtonRedius: normalizePixels(30),
    ButtonHeight: normalizePixels(40),
    AlertDialogButtonMargin: normalizePixels(-5),
    AlertDialogHeight: normalizePixels(350),
    QRCodeIconWidthHeight: normalizePixels(150),
    listHeaderText: normalizePixels(14),
    listItemText: normalizePixels(14),
    firstCurrencyText: moderateScale(15),
    secondCurrencyText: normalizePixels(10),
    volumeText: normalizePixels(13),

    curveViewRedious: normalizePixels(20),
    splash_text_size: normalizePixels(35),


    listImageHeightWidth: normalizePixels(40),

    dashboardMenuIcon: normalizePixels(20),
    dashboardTabText: normalizePixels(10.5),
    dashboardSelectedTabText: normalizePixels(12),
    dashboardPaddingTop: moderateScale(8),
    dashboardSelecetedPaddingTop: normalizePixels(6),

    //For Barcode Scan
    barcodeFinderWidthHeight: normalizePixels(250),

    titleIconHeightWidth: normalizePixels(20),

    //For order history
    margin_left_right: normalizePixels(20),
    margin_top_bottom: normalizePixels(20),

    feess_charges_list_image_height_width: normalizePixels(20),
    checkbox_height_width: normalizePixels(20),

    // for drawer width
    drawer_width: moderateScale(300),
    adjust_size_of_drawer: normalizePixels(40),

    // for sign up screen
    signup_left_rigth_margin: normalizePixels(20),
    signup_screen_logo_height: normalizePixels(50),
    blockchain_textbox_heightwidth: normalizePixels(40),
    blockchain_textbox_border: normalizePixels(1),

    //For Filter Drawar
    FilterDrawarWidth: normalizePixels(280),

    //For Decentralized Address Generation
    QRCodeIconWidthHeightD: normalizePixels(120),

    //for Security image list
    security_image_selector_width_height: normalizePixels(230),

    //for memmbershiplevel text
    membershipNormal: normalizePixels(20),
    membershipMedium: normalizePixels(100),
    membershipItemPaddingTop: normalizePixels(40),

    //For Normal SignUp
    SignUpButtonHeight: normalizePixels(30),

    //for app intro screen
    appIntroImageWidthHeight: normalizePixels(150),

    //for Carousel library paging in membershiplevel
    Carousel: {
        pagination: {
            inactiveDotOpacity: normalizePixels(0.4),
            inactiveDotScale: normalizePixels(0.6),
        },
    },

    ViewProfileImageBorder: normalizePixels(7),

    replyMessageEditTextHeight: normalizePixels(40),
    ImageSliderWidthHeight: normalizePixels(300),
    piechartHeight: normalizePixels(150),

    Verify_Image_Width_Height: normalizePixels(60),

    chartHeightSmall: normalizePixels(175),
    chartHeightMedium: normalizePixels(225),
    chartHeightLarge: normalizePixels(275),

    toolBarOutlineButtonPadding: normalizePixels(2),

    // for refere_earn modules
    QRcode_height_width: normalizePixels(100),
    icon_padding: normalizePixels(3),
    icon_borderwidth: normalizePixels(1),
    Bg_height: normalizePixels(250),
    Bg_width: normalizePixels(350),
    refermargins: normalizePixels(40),
    iconheight: normalizePixels(20),
    text_left_right_margin: normalizePixels(25),
    text_right_margin: normalizePixels(35),
    referestepwidth_first_last: normalizePixels(80),
    referestepwidth_second: normalizePixels(140),

    GridImage: normalizePixels(200),
    card_margin: normalizePixels(20),
    normal_elevation: normalizePixels(2),

    statusIndicatorWidth: normalizePixels(4),
    statusIndicatorHeight: normalizePixels(30),
    cardBorderRadius: moderateScale(4),

    chartHeight50: normalizePixels(50),

    indicatorIconHeightWidth: normalizePixels(10),
    emptyListWidgetHeight: normalizePixels(150),

    toastElevation: normalizePixels(5),
    pickerBorderWidth: normalizePixels(1),

    listEmptyImageWidgetWidth: normalizePixels(50),
    listEmptyImageWidgetHeight: normalizePixels(50),

    cardWidgetHeight: normalizePixels(150),

    //For Picker
    accessorywidthheight: moderateScale(24),
    trianglewidthheight: moderateScale(8),
    triangleContainerwidth: moderateScale(12),
    triangleContainerheight: moderateScale(6),
    translateYminus: moderateScale(-4),
    rippleInsetsBottom: normalizePixels(-8),

    //Separator height
    separatorHeight: normalizePixels(0.7),

    //Drawer Menu Icon Size
    drawerMenuIconWidthHeight: normalizePixels(25),

    //for Alert Dialog
    dialogButtonMargin: normalizePixels(-20),

    // for highchart
    highChartHeight: normalizePixels(300),

    //For Edit Text Header's drawable right icon height and width
    etHeaderImageHeightWidth: normalizePixels(15),

    dashboardHeaderBalanceHeight: normalizePixels(200),
    dashboardHeaderBalanceCardRadius: normalizePixels(25),

    profilePicWidthHeight: normalizePixels(60),
    profilePicBorderRadius: normalizePixels(70),
    profilePicBorderWidth: normalizePixels(4),
    listCardElevation: moderateScale(4),
    detailCardRadius: normalizePixels(20),

    backGroundImageHeightWidth: normalizePixels(120),
    backGroundImageBottomMargin: normalizePixels(40),

    apiPlanPriceFontSize: normalizePixels(30),
    apiPlanButtonHeight: normalizePixels(25),

    graphFontSize: normalizePixels(7),
    switchScale: normalizePixels(0.9)
};

export default dimens;