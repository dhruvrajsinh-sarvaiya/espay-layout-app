import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import R from '../R';
import LinearTextGradient from '../components/LinearTextGradient';
import { connect } from 'react-redux';
import TextViewHML from './TextViewHML';
import TextViewMR from './TextViewMR';
import { Fonts } from '../../controllers/Constants';
import { isEmpty } from '../../validations/CommonValidation';

class ImageButton extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            numberOfLines: 3,
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.name === nextProps.name &&
            this.props.style === nextProps.style &&
            this.props.isGradient === nextProps.isGradient &&
            this.state.numberOfLines === nextState.numberOfLines &&
            this.props.disabled === nextProps.disabled &&
            this.props.isVertical === nextProps.isVertical &&
            this.props.icon === nextProps.icon &&
            this.props.resizeMode === nextProps.resizeMode &&
            this.props.progressive === nextProps.progressive &&
            this.props.numberOfLines === nextProps.numberOfLines &&
            this.props.preference.theme === nextProps.preference.theme &&
            this.props.preference.dimensions.isPortrait === nextProps.preference.dimensions.isPortrait) {
            return false;
        }
        return true;
    };

    render() {

        //If tintColor is null then it will not used tintColor style
        let needTint = (this.props.iconStyle != undefined && this.props.iconStyle.tintColor != undefined) ? this.props.iconStyle.tintColor !== null : true;
        let isGradient = this.props.isGradient ? this.props.isGradient : false;

        return (
            <TouchableWithoutFeedback onPress={this.props.onPress} disabled={this.props.disabled}>
                {
                    (this.props.isVertical) ?
                        <View style={[{ justifyContent: 'center', alignItems: 'center' }, this.props.style]}>
                            {this.props.icon && <Image
                                source={this.props.icon}
                                style={[
                                    needTint ? { tintColor: R.colors.white } : {},
                                    { alignSelf: 'center' },
                                    this.props.resizeMode ? { resizeMode: this.props.resizeMode } : {},
                                    this.props.iconStyle]} />}
                            {this.props.name && this.renderText(isGradient)}
                        </View>
                        :
                        <View style={[{ margin: R.dimens.WidgetPadding, flexDirection: 'row' }, this.props.style]}>
                            {(this.props.isLeftIcon || this.props.name == undefined) && this.props.icon && <Image
                                source={this.props.icon}
                                style={[
                                    needTint ? { tintColor: R.colors.white } : {},
                                    { alignSelf: 'center' },
                                    this.props.resizeMode ? { resizeMode: this.props.resizeMode } : {}, this.props.iconStyle]} />}
                            {isEmpty(this.props.name) ? <View></View> : this.renderTextView(isGradient)}
                            {(this.props.isRightIcon || (this.props.isLeftIcon === undefined && this.props.name !== undefined)) && this.props.icon && <Image
                                source={this.props.icon}
                                style={[
                                    needTint ? { tintColor: R.colors.white } : {},
                                    { alignSelf: 'center' },
                                    this.props.resizeMode ? { resizeMode: this.props.resizeMode } : {}, this.props.iconStyle]} />}
                        </View>
                }
            </TouchableWithoutFeedback>
        );
    }

    // for displaying text view
    renderTextView(isGradient) {

        // If isLeftIcon & icon is not undefined than return original TextView or 
        // Otherwise return TextView with surrounded View
        if (this.props.isLeftIcon && this.props.icon && this.props.name) {

            // Taps will work on all rest width which is not occupied for Text
            return this.renderText(isGradient);
        } else {

            // Taps will work only on TextView
            return <View>{this.renderText(isGradient)}</View>
        }
    }

    // for displaying text of text view
    renderText(isGradient) {

        let isTextOnly = this.props.icon === undefined;
        let name = (this.props.name === undefined || this.props.name === '') ? ' ' : this.props.name;

        let textStyle = {
            flex: 1,
            fontSize: R.dimens.smallText,
            color: R.colors.white,
            alignContent: 'flex-end',
        }

        isTextOnly && delete textStyle['flex'];

        isGradient && delete textStyle['color'];

        //if textStyle is passed from parent
        if (this.props.textStyle !== undefined) {

            //if style is an array then get all objects
            if (Array.isArray(this.props.textStyle)) {
                this.props.textStyle.map(item => textStyle = { ...textStyle, ...item })
            } else {
                //as style is self object than merge with existing
                textStyle = { ...textStyle, ...this.props.textStyle };
            }
            //delete style so that it cannot override with new style
            delete this.props['textStyle'];
        }

        // check for need to display with gradient color or not
        if (isGradient) {
            if (this.props.isHML) {
                return <LinearTextGradient
                    style={[textStyle, { fontFamily: Fonts.HindmaduraiLight }]}> {name} </LinearTextGradient>
            } else if (this.props.isMR) {
                return <LinearTextGradient
                    style={[textStyle, { fontFamily: Fonts.MontserratRegular }]}> {name} </LinearTextGradient>
            } else {
                return <LinearTextGradient
                    style={textStyle}> {name} </LinearTextGradient>
            }
        } else {
            if (this.props.isHML) {
                return <TextViewHML
                    style={[textStyle]}
                    numberOfLines={this.props.numberOfLines !== undefined ? this.props.numberOfLines : this.state.numberOfLines}
                    ellipsizeMode={'tail'}>{name}</TextViewHML>
            } else if (this.props.isMR) {
                return <TextViewMR
                    style={[textStyle]}
                    numberOfLines={this.props.numberOfLines !== undefined ? this.props.numberOfLines : this.state.numberOfLines}
                    ellipsizeMode={'tail'}>{name}</TextViewMR>
            } else {
                return <Text
                    style={[textStyle]}
                    numberOfLines={this.props.numberOfLines !== undefined ? this.props.numberOfLines : this.state.numberOfLines}
                    ellipsizeMode={'tail'}>{name}</Text>
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        preference: state.preference,
        isPortrait: state.preference.dimensions.isPortrait
    }
}

export default connect(mapStateToProps)(ImageButton);