import React from 'react';
import {
    View,
    Switch
} from "react-native";
import R from '../R';
import LinearGradient from 'react-native-linear-gradient';
import TextViewHML from './TextViewHML';
import { Fonts } from '../../controllers/Constants';
import TextViewMR from './TextViewMR';
import DeviceInfo from 'react-native-device-info';

export function FeatureSwitch(props) {

    let isGradient = props.isGradient;

    //If isGradient Property is passed than it will show gradient background.
    if (isGradient !== undefined && isGradient) {
        return (
            <LinearGradient
                locations={[0, 1]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={[R.colors.linearStart, R.colors.linearEnd]}>
                <FeatureSwitchOriginal {...props} />
            </LinearGradient>
        )
    } else
        return (<FeatureSwitchOriginal {...props} />)
}

// for different different font text
const TextViewAlias = (fontFamily) => {
    if (fontFamily !== undefined) {
        if (fontFamily === Fonts.HindmaduraiLight) {
            return TextViewHML;
        } else if (fontFamily === Fonts.MontserratRegular) {
            return TextViewMR;
        } else {
            return TextViewHML;
        }
    } else {
        return TextViewHML;
    }
}

/**
 * Horizontal Switch for enable disable features.
 */
function FeatureSwitchOriginal(props) {

    let onTintColor;
    let tintColor;
    let thumbTintColor;
    let trackColor;
    let thumbColor;
    let backgroundColor = props.backgroundColor;
    let height = props.height
    let width = props.width

    if (props.onTintColor && props.tintColor && props.thumbTintColor) {
        if (props.onTintColor.length == 2 && props.tintColor.length == 2 && props.thumbTintColor.length == 2) {
            onTintColor = props.isToggle ? props.onTintColor[0] : props.onTintColor[1];
            tintColor = props.isToggle ? props.tintColor[0] : props.tintColor[1];
            thumbTintColor = props.isToggle ? props.thumbTintColor[0] : props.thumbTintColor[1];
            trackColor = { true: props.onTintColor[0], false: props.onTintColor[1] };
            thumbColor = props.isToggle ? props.thumbTintColor[0] : props.thumbTintColor[1];
        } else {
            onTintColor = props.isToggle ? R.colors.lightAccent : R.colors.lightListValue;
            tintColor = props.isToggle ? R.colors.accent : R.colors.lightListValue;
            thumbTintColor = props.isToggle ? R.colors.accent : R.colors.listValue;
            trackColor = { true: R.colors.lightAccent, false: R.colors.lightListValue };
            thumbColor = props.isToggle ? R.colors.accent : R.colors.listValue;
        }
    } else {
        onTintColor = props.isToggle ? R.colors.textSecondary : R.colors.textSecondary;
        tintColor = props.isToggle ? R.colors.textSecondary : R.colors.textSecondary;
        thumbTintColor = props.isToggle ? R.colors.buyerGreen : R.colors.toastBackground;
        trackColor = { true: R.colors.textSecondary, false: R.colors.textSecondary };
        thumbColor = props.isToggle ? R.colors.buyerGreen : R.colors.toastBackground;
    }

    let isGradient = props.isGradient;

    let TextView = TextViewAlias(props.textStyle.fontFamily);

    return (
        <View style={[{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isGradient ? 'transparent' : (backgroundColor ? backgroundColor : R.colors.accent),
            paddingTop: R.dimens.widget_top_bottom_margin,
            paddingBottom: R.dimens.widget_top_bottom_margin,
            paddingLeft: R.dimens.margin_left_right,
            paddingRight: R.dimens.margin_left_right,
        }, props.style]}>

            {(props.reverse == undefined || props.reverse == false) && props.title &&
                /* Title of switch */
                <TextView style={[{
                    flex: 1,
                    color: R.colors.white,
                    fontSize: R.dimens.smallText,
                    marginRight: R.dimens.widgetMargin
                }, props.textStyle]}>
                    {props.title}
                </TextView>
            }

            {/* Switch to enable or disable */}
            <Switch
                style={[{
                    transform: [
                        { scaleX: width !== undefined ? width : R.dimens.switchScale },
                        { scaleY: height !== undefined ? height : R.dimens.switchScale }
                    ],

                }, DeviceInfo.isTablet() && {
                    marginLeft: !props.reverse == true ? R.dimens.margin : 0,
                    marginRight: props.reverse == true ? R.dimens.margin : 0,
                }]}
                value={props.isToggle}
                onTintColor={onTintColor}
                tintColor={tintColor}
                thumbTintColor={thumbTintColor}
                // trackColor={trackColor}
                // thumbColor={thumbColor}
                onValueChange={props.onValueChange}
            />

            {props.reverse == true && props.title &&
                /* Title of switch */
                <TextView style={[{
                    flex: 1,
                    marginLeft: R.dimens.widgetMargin,
                    color: R.colors.textSecondary,
                    fontSize: R.dimens.smallText
                }, props.textStyle]}>
                    {props.title}
                </TextView>
            }
        </View>
    )
}