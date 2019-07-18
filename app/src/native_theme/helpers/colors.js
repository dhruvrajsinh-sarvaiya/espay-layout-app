import ThemeManager from 'react-native-color-theme';

// color range with for setting light and night theme color
const colorRange = {
    primary: { lightTheme: '#0667d0', nightTheme: '#121D27' },
    secondary: { lightTheme: '#D0EDF4', nightTheme: '#121D27' },
    primaryDark: { lightTheme: '#0358b5', nightTheme: '#121D27' },
    white: { lightTheme: '#ffffff', nightTheme: '#ffffff' },
    textPrimary: { lightTheme: '#1E2027', nightTheme: '#ffffff' },
    textSecondary: { lightTheme: '#9ba6b2', nightTheme: '#8A939F' },
    separator: { lightTheme: '#F4F7FA', nightTheme: '#262D34' },
    buyerGreenOpacity: { lightTheme: 'rgba(77, 165, 60, 0.9)', nightTheme: 'rgba(77, 165, 60, 0.9)' },
    buttonBorder: { lightTheme: '#00aa6d', nightTheme: '#00aa6d' },
    listValue: { lightTheme: '#1E2027', nightTheme: '#1E2027' },
    listSeprator: { lightTheme: '#000000', nightTheme: '#ffffff' },
    textHeaderBackground: { lightTheme: '#f2f2f2', nightTheme: '#121D27' },
    cardBackground: { lightTheme: '#ffffff', nightTheme: '#10103D' },
    pickerBackground: { lightTheme: '#ffffff', nightTheme: '#111143' },
    lightAccent: { lightTheme: '#f7df94', nightTheme: '#493802' },
    lightListValue: { lightTheme: '#bcbcbc', nightTheme: '#bcbcbc' },
    tradeAmountButtons: { lightTheme: '#c3c5c8', nightTheme: '#121D27' },
    tradeInput: { lightTheme: '#dbdee1', nightTheme: '#29333c' },
    graphBackground: { lightTheme: '#3db5ff', nightTheme: '#2e7eb0' },
    dialogTransparent: { lightTheme: 'rgba(0,0,0,0.5)', nightTheme: 'rgba(0,0,0,0.5)' },
    backgroundTransparent: { lightTheme: 'rgba(244,247,250,0.85)', nightTheme: 'rgba(7,15,21,0.85)' },
    orange: { lightTheme: '#FF6939', nightTheme: '#FF6939' },
    orangeOpacity: { lightTheme: 'rgba(255, 105, 57, 0.9)', nightTheme: 'rgba(255, 105, 57, 0.9)' },
    title: { lightTheme: '#0667d0', nightTheme: '#ffffff' },
    statusOpenOrder: { lightTheme: '#0667d0', nightTheme: '#e50370' },
    paginationSelectedText: { lightTheme: '#ffffff', nightTheme: '#ffffff' },
    paginationUnSelectedText: { lightTheme: '#1E2027', nightTheme: '#ffffff' },
    paginationSelectedBox: { lightTheme: '#181BFF', nightTheme: '#181BFF' },
    paginationUnSelectedBox: { lightTheme: '#ffffff', nightTheme: '#070745' },
    imageBorder: { lightTheme: '#1E2027', nightTheme: '#121D27' },
    chartColor1: { lightTheme: '#f45b5b', nightTheme: '#f45b5b' },
    chartColor2: { lightTheme: '#7798BF', nightTheme: '#7798BF' },
    chartColor3: { lightTheme: '#aaeeee', nightTheme: '#aaeeee' },
    chartColor4: { lightTheme: '#eeaaee', nightTheme: '#eeaaee' },
    chartColor5: { lightTheme: '#DF5353', nightTheme: '#DF5353' },
    arrowcolor: { lightTheme: '#e6ae58', nightTheme: '#e6ae58' },
    loginButtonTextColor: { lightTheme: '#0667d0', nightTheme: '#ffffff' },
    signintext: { lightTheme: '#99C0EA', nightTheme: '#9ba6b2' },
    currentLevelBlue: { lightTheme: '#1e90ff', nightTheme: '#1e90ff' },
    stepIndicatorLabel: { lightTheme: '#696969', nightTheme: '#696969' },
    chatCardBackground: { lightTheme: '#0667d0', nightTheme: '#ffffff' },
    chatCardTextColor: { lightTheme: '#ffffff', nightTheme: '#ffffff' },
    cardValue: { lightTheme: '#0667d0', nightTheme: '#0667d0' },
    cardTitle: { lightTheme: '#0667d0', nightTheme: '#C8C9CB' },
    cardHeader: { lightTheme: '#646064', nightTheme: '#C8C9CB' },
    cardRadius: { lightTheme: '#06E665', nightTheme: '#06E665' },
    cardRadiusNew: { lightTheme: '#EF5350', nightTheme: '#EF5350' },
    cardItem: { lightTheme: '#646064', nightTheme: '#ffffff' },
    boTrade1: { lightTheme: '#fb8c00', nightTheme: '#fb8c00' },
    boTrade2: { lightTheme: '#EC407A', nightTheme: '#EC407A' },
    boTrade3: { lightTheme: '#7CB342', nightTheme: '#7CB342' },
    boTrade4: { lightTheme: '#5D92F4', nightTheme: '#5D92F4' },
    boTrade5: { lightTheme: '#413EA0', nightTheme: '#413EA0' },
    boTrade6: { lightTheme: '#009688', nightTheme: '#009688' },
    boTrade7: { lightTheme: 'rgb(40, 167, 69)', nightTheme: 'rgb(40, 167, 69)' },
    boTrade8: { lightTheme: 'rgb(220, 53, 69)', nightTheme: 'rgb(220, 53, 69)' },
    bodashboardtext: { lightTheme: '#C7DDF4', nightTheme: '#C8C9CB' },
    gridTitle: { lightTheme: '#353435', nightTheme: '#ffffff' },
    gridImage: { lightTheme: '#444444', nightTheme: '#444444' },
    gridSeparator: { lightTheme: '#0667d0', nightTheme: '#F1BE1D' },
    gridBackground: { lightTheme: '#0667d0', nightTheme: '#070F15' },

    //App Theme
    background: { lightTheme: '#FFFFFF', nightTheme: '#050533' },
    buttonBackground: { lightTheme: '#181BFF', nightTheme: '#181BFF' },
    failRed: { lightTheme: '#E64646', nightTheme: '#E64646' },
    successGreen: { lightTheme: '#2DE671', nightTheme: '#2DE671' },
    buyerGreen: { lightTheme: '#2DE671', nightTheme: '#2DE671' },
    sellerPink: { lightTheme: '#E64646', nightTheme: '#E64646' },
    loginButtonBackground: { lightTheme: '#181BFF', nightTheme: '#181BFF' },
    accent: { lightTheme: '#181BFF', nightTheme: '#181BFF' },
    cardBalanceBlue: { lightTheme: '#59d8fc', nightTheme: '#59d8fc' },
    cardTransferGrey: { lightTheme: '#f2f2f3', nightTheme: '#070745' },

    bottomMenuBackground: { lightTheme: '#f5f5f5', nightTheme: '#070745' },
    bottomMenuUnselectedIcon: { lightTheme: '#a3a3a3', nightTheme: '#a3a3a3' },
    eyeColor: { lightTheme: 'rgba(255,255,255,0.50)', nightTheme: 'rgba(255,255,255,0.50)' },
    selectCardBackground: { lightTheme: '#dae3ec', nightTheme: '#515181' },
    yellow: { lightTheme: '#ffb70f', nightTheme: '#ffb70f' },
    swipeableBackground: { lightTheme: '#181BFF', nightTheme: '#181BFF' },
    greenShadow: { lightTheme: 'rgba(45,230,113,0.3)', nightTheme: 'rgba(45,230,113,0.3)' },
    redShadow: { lightTheme: 'rgba(230,70,70,0.3)', nightTheme: 'rgba(230,70,70,0.3)' },
    progressStatusColor: { lightTheme: 'rgba(0,0,0, 0.5)', nightTheme: 'rgba(18,29,39, 0.5)' },
    leaderListEdit: { lightTheme: '#18a5fe', nightTheme: '#18a5fe' },

    //For Detail Screen Background
    detailBgDark: { lightTheme: '#181BFF', nightTheme: '#050533' },
    detailBgLight: { lightTheme: '#59d8fc', nightTheme: '#050533' },
    darkTextColor: { lightTheme: '#FFFFFF', nightTheme: '#FFFFFF' },

    toastBackground: { lightTheme: 'rgba(78, 92, 110, 0.8)', nightTheme: 'rgba(255,255,255,0.8)' },
    toastText: { lightTheme: '#ffffff', nightTheme: '#1E2027' },
    networkErrorBg: { lightTheme: '#FF9700', nightTheme: '#FF9700' },
    sessionExpiredBg: { lightTheme: '#FF6939', nightTheme: '#FF6939' },
    editTextBorder: { lightTheme: '#BBBBBB', nightTheme: '#BBBBBB' },
    linearStart: { lightTheme: '#59d8fc', nightTheme: '#59d8fc' },
    linearEnd: { lightTheme: '#181BFF', nightTheme: '#181BFF' }
}

// to separate color and create total theme available in all items
function getColorThemes() {

    // set default all theme with empty braces
    let themes = { lightTheme: {}, nightTheme: {} };

    // loop through all colorName keys
    for (let keyName of Object.keys(colorRange)) {

        // if current item's light theme color is available than set its color
        if (typeof colorRange[keyName].lightTheme !== 'undefined') {
            themes.lightTheme[keyName] = colorRange[keyName].lightTheme;
        }
        // if current item's night theme color is available than set its color
        if (typeof colorRange[keyName].nightTheme !== 'undefined') {
            themes.nightTheme[keyName] = colorRange[keyName].nightTheme;
        }
    }

    return themes;
}

const Colors = new ThemeManager(getColorThemes())

export default Colors;