import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Text, Animated, Easing } from 'react-native'
import R from '../R';
import { Fonts } from '../../controllers/Constants';
import Ripple from 'react-native-material-ripple';
import { getCardStyle } from './CardView';
import { mergeStyle } from '../../controllers/CommonUtils';

//Create Common Button Method For Common Use
class Button extends Component {
    constructor(props) {
        super(props)

        //Define All initial State
        this.state = {
            scaleValue: new Animated.Value(0)
        }
    }

    componentDidMount() {

        // to apply animation on button 
        Animated.timing(                  // Animate over time
            this.state.scaleValue,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 3000,               // Make it take a while
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();                        // Starts the animation
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.isRound === nextProps.isRound &&
            this.props.isAlert === nextProps.isAlert &&
            this.props.disabled === nextProps.disabled &&
            this.props.title === nextProps.title &&
            this.props.preference.theme === nextProps.preference.theme &&
            this.props.preference.locale === nextProps.preference.locale &&
            this.props.isPortrait === nextProps.isPortrait &&
            this.state.scaleValue === nextState.scaleValue) {
            return false
        }
        return true
    }

    render() {

        const cardScale = this.state.scaleValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.05, 1]
        });

        let transformStyle = { transform: [{ scale: cardScale }] }
        if (this.props.isAlert) {
            return <ButtonOriginal {...this.props} />
        } else {
            return (
                <Animated.View style={transformStyle}>
                    <ButtonOriginal {...this.props} />
                </Animated.View>
            );
        }
    }
}

class ButtonOriginal extends Component {
    render() {
        let buttonStyle = {
            height: R.dimens.ButtonHeight,
            backgroundColor: this.props.disabled ? R.colors.textSecondary : R.colors.buttonBackground,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: this.props.isRound ? R.dimens.roundButtonRedius : R.dimens.cardBorderRadius,
            paddingLeft: R.dimens.WidgetPadding,
            paddingRight: R.dimens.WidgetPadding,
        }

        let textStyle = {
            color: R.colors.white,
            fontSize: R.dimens.mediumText,
            fontFamily: Fonts.MontserratRegular
        }

        buttonStyle = Object.assign({}, buttonStyle, getCardStyle(R.dimens.CardViewElivation));

        // check isRound is true then apply round button style 
        if (this.props.isRound) {
            buttonStyle = Object.assign({}, buttonStyle, { alignSelf: 'center', paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, });
        }

        buttonStyle = mergeStyle(this, buttonStyle, 'style');
        textStyle = mergeStyle(this, textStyle, 'textStyle');

        return <Ripple
            rippleOpacity={1}
            onPress={this.props.onPress}
            disabled={this.props.disabled}
            style={buttonStyle}
            rippleContainerBorderRadius={this.props.isRound ? R.dimens.roundButtonRedius : 0}
            rippleCentered={true}
            rippleColor={R.colors.textSecondary}>

            <Text
                numberOfLines={this.props.numberOfLines !== undefined ? this.props.numberOfLines : 1}
                ellipsizeMode={'tail'}
                style={textStyle}>{this.props.title}
            </Text>
        </Ripple>
    }
}

function mapStateToProps(state) {
    return {
        preference: state.preference,
        isPortrait: state.preference.dimensions.isPortrait
    }
}

export default connect(mapStateToProps)(Button)
