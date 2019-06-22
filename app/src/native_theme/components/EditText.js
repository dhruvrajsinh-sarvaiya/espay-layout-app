import React from 'react'
import { Component } from 'react';
import { View, TextInput, Platform } from 'react-native'
import { CheckAmountValidation } from '../../validations/AmountValidation';
import { validateNumeric, validWeek, validMonth, validPercentage, validCharacter } from '../../validations/CommonValidation';
import R from '../R';
import ImageButton from './ImageTextButton';
import CardView from './CardView';
import CountryPicker from 'react-native-country-picker-modal'
import TextViewMR from './TextViewMR';
import TextViewHML from './TextViewHML';
import { Fonts } from '../../controllers/Constants';

//Create Common class for Edit Text
class EditText extends Component {

    constructor(props) {
        super(props);

        this.textInputs = {};

        //Define All initial State
        this.state = {
            focused: false,
            cardElevation: R.dimens.CardViewElivation,
        }
    }

    //To check for common amount validation
    validate = (text) => {

        //For Only Digits
        if (this.props.onlyDigit) {
            if (text !== '') {
                if (validateNumeric(text)) {
                    this.props.onChangeText(text);
                }
            } else {
                this.props.onChangeText(text);
            }
        }

        //For Week Validation
        //Enter 1 to 4 digits
        else if (this.props.validWeek) {
            if (text !== '') {
                if (validWeek(text)) {
                    this.props.onChangeText(text);
                }
            } else {
                this.props.onChangeText(text);
            }
        }

        //For Month Validation
        //Enter 1 to 12 digits
        else if (this.props.validMonth) {
            if (text !== '') {
                if (validMonth(text)) {
                    this.props.onChangeText(text);
                }
            } else {
                this.props.onChangeText(text);
            }
        }

        //For Percentage Validation
        //Enter 1 to 100 digits
        else if (this.props.validPercentage) {
            if (text !== '') {
                if (validPercentage(text)) {
                    this.props.onChangeText(text);
                }
            } else {
                this.props.onChangeText(text);
            }
        }

        //For Only Characters Validation
        //Enter A-Z and a-z
        else if (this.props.onlyCharacters) {
            if (text !== '') {
                if (validCharacter(text)) {
                    this.props.onChangeText(text);
                }
            } else {
                this.props.onChangeText(text);
            }
        }
        else {
            if (text !== '') {
                if (CheckAmountValidation(text)) {
                    this.props.onChangeText(text);
                }
            } else {
                this.props.onChangeText(text);
            }
        }
    }

    // for card animation on focus
    onGetFocus = () => {
        if (this.props.focusable !== undefined && this.props.focusable)
            this.setState({ focused: true, cardElevation: R.dimens.CardViewElivation * 2 });
    }

    // for remove card animation on focus
    onLostFocus = () => {
        if (this.props.focusable !== undefined && this.props.focusable)
            this.setState({ focused: false, cardElevation: R.dimens.CardViewElivation });
    }

    render() {
        let props = this.props;
        let hasHeader = props.header !== undefined;
        let isRound = props.isRound !== undefined ? props.isRound : false;
        let isRequired = props.isRequired !== undefined ? props.isRequired : false;

        let radius = 0;
        let elevation = R.dimens.CardViewElivation;

        // check if isRound is true then apply radius for make edit text round corner
        if (isRound) {
            radius = R.dimens.LoginButtonBorderRadius;
        }

        let cardStyle = {
            paddingTop: R.dimens.CardViewElivation,
            paddingBottom: R.dimens.CardViewElivation,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: R.dimens.CardViewElivation,
            ...this.props.BorderStyle
        }

        if (props.multiline !== undefined && props.multiline == true) {

            delete cardStyle['height'];
        }

        if (this.props.BorderStyle !== undefined) {
            cardStyle = {
                ...cardStyle,
                borderWidth: this.props.BorderStyle.borderWidth !== undefined ? this.props.BorderStyle.borderWidth : R.dimens.pickerBorderWidth,
                borderColor: this.props.BorderStyle.borderColor !== undefined ? this.props.BorderStyle.borderColor : R.colors.textSecondary,
            }
            elevation = 0;
        }

        if (props.focusable !== undefined) {
            elevation = this.state.cardElevation;
        }

        return (
            /* To Set Transaction Per Hour Edit Text */
            <View style={[this.styles(hasHeader, isRound).container, props.style]}>

                {/* To Set Edit Text Title */}
                {props.header &&
                    <View style={{ flexDirection: 'row' }}>
                        <TextViewMR style={this.styles(hasHeader, isRound).text_style}>{props.header}
                            {isRequired && <TextViewMR style={{ color: R.colors.failRed }}> *</TextViewMR>}</TextViewMR>
                        {props.headerIcon &&
                            <ImageButton
                                style={{
                                    margin: 0,
                                    marginLeft: R.dimens.widgetMargin
                                }}
                                icon={props.headerIcon}
                                iconStyle={[{ width: R.dimens.etHeaderImageHeightWidth, height: R.dimens.etHeaderImageHeightWidth, tintColor: R.colors.textPrimary }, props.headerIconStyle]}
                                onPress={props.onPressHeaderIcon} />
                        }
                    </View>
                }

                {/* To Set White Border in Edit Text */}
                <CardView
                    style={cardStyle}
                    cardRadius={radius}
                    cardElevation={elevation}
                    onPress={props.onPress}>

                    {props.leftImage &&
                        <View style={{
                            width: R.dimens.dashboardMenuIcon,
                            height: R.dimens.dashboardMenuIcon,
                            marginLeft: R.dimens.widget_left_right_margin,
                        }}>
                            <ImageButton
                                style={{
                                    margin: 0,
                                }}
                                icon={props.leftImage}
                                iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }, props.ImageStyle]}
                                onPress={props.onPressLeft} />
                        </View>
                    }


                    {/* For Left Side Text */}
                    {props.leftText &&
                        <View style={{
                            marginRight: R.dimens.widget_left_right_margin
                        }}>
                            <TextViewHML
                                style={[{
                                    textAlign: 'center',
                                    fontSize: R.dimens.smallestText,
                                    color: R.colors.textSecondary,
                                    alignItems: 'center',
                                }, props.leftTextStyle]}
                                onPress={props.onPressLeft}>{props.leftText}</TextViewHML>
                        </View>
                    }

                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'flex-start' }}>
                        <TextInput
                            ref={props.reference}
                            style={[
                                this.styles(hasHeader, isRound).textInput_style,

                                // Added Style for iOS for multiline TextInput,
                                // if multiline is true then set minHeight so that textInput default height can be show,
                                // Not needed in android as numberOfLines works in android
                                // formula : numberOfLines * (textSize + padding of textInput + margin of textInput)
                                (Platform.OS === 'ios' && props.multiline !== undefined && props.multiline == true) && { minHeight: (props.numberOfLines * (R.dimens.smallText + R.dimens.widgetMargin + R.dimens.LineHeight)) },
                                props.textInputStyle]}
                            placeholder={props.placeholder}
                            placeholderTextColor={props.placeholderTextColor ? props.placeholderTextColor : R.colors.textSecondary}
                            underlineColorAndroid='transparent'
                            maxLength={props.maxLength}
                            multiline={props.multiline}
                            keyboardType={props.keyboardType}
                            returnKeyType={props.returnKeyType}

                            //If validate is passed as true then it will check amount validation otherwise it react as normal change text
                            onChangeText={(text) => props.validate ? this.validate(text) : props.onChangeText(text)}
                            onSubmitEditing={() => {
                                this.onLostFocus();
                                if (props.onSubmitEditing !== undefined) {
                                    props.onSubmitEditing();
                                }
                            }}
                            value={props.value}
                            numberOfLines={props.numberOfLines}
                            secureTextEntry={props.secureTextEntry}
                            editable={props.editable}
                            textAlignVertical={props.textAlignVertical}
                            blurOnSubmit={props.blurOnSubmit}
                            onBlur={props.onBlur}
                            onFocus={() => {
                                this.onGetFocus();
                                if (props.onFocus !== undefined) {
                                    props.onFocus();
                                }
                            }}
                        ></TextInput>
                    </View>

                    {props.rightImage &&
                        <View style={{
                            width: R.dimens.dashboardMenuIcon,
                            height: R.dimens.dashboardMenuIcon,
                            marginLeft: R.dimens.widgetMargin,
                        }}>
                            <ImageButton
                                style={{
                                    margin: 0,
                                }}
                                icon={props.rightImage}
                                iconStyle={[{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textSecondary }, props.ImageStyle]}
                                onPress={props.onPressRight} />
                        </View>
                    }

                    {/* For Right Side Text */}
                    {props.rightText &&
                        <View>
                            <TextViewHML
                                style={[{
                                    textAlign: 'center',
                                    fontSize: R.dimens.smallestText,
                                    color: R.colors.textSecondary,
                                    alignItems: 'center',
                                }, props.TextStyle]}
                                onPress={props.onPressRight}>{props.rightText}</TextViewHML>
                        </View>
                    }

                    {/* For Right Side country picker */}
                    {props.countryPicker &&
                        <View style={{
                            paddingTop: R.dimens.widgetMargin,
                            paddingBottom: R.dimens.widgetMargin,
                            alignItems: 'center',
                        }}>
                            <CountryPicker
                                styles={{ tintColor: R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                onChange={value => { props.onCountryChange(value) }}
                                cca2={props.contryPickerValue}
                                closeable={true}
                                filterable
                            />
                        </View>
                    }
                </CardView>
            </View>
        );
    }

    //Common Style For From Date and To Date
    styles = (hasHeader, isRound) => {
        return {
            container: {
                justifyContent: 'center',
                marginTop: hasHeader ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
            },
            textInput_style: {
                fontSize: R.dimens.smallText,
                color: R.colors.textSecondary,
                marginTop: R.dimens.pickerBorderWidth,
                paddingTop: R.dimens.widgetMargin,
                paddingBottom: R.dimens.widgetMargin,
                paddingLeft: isRound ? R.dimens.margin_left_right : 0,
                paddingRight: isRound ? R.dimens.margin_left_right : 0,
                textAlign: 'left',
                fontFamily: Fonts.HindmaduraiLight,
            },
            text_style: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
                marginLeft: R.dimens.LineHeight,
                alignSelf: 'flex-start',
                fontFamily: Fonts.MontserratRegular,
            },
        }
    }
}

export default EditText;