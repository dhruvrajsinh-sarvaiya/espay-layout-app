import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback, Platform } from 'react-native';
import PropTypes from 'prop-types';
import R from '../R';
import { mergeStyle } from '../../controllers/CommonUtils';

export default class CardView extends PureComponent {

    constructor(props) {
        super(props)
        this.cardStyle = {};
    }

    render() {
        let { cardBackground, cardElevation, cardRadius, onPress, disabled } = this.props;

        let cardStyle = {
            backgroundColor: cardBackground !== undefined ? cardBackground : R.colors.cardBackground,
            borderRadius: cardRadius,
            padding: R.dimens.WidgetPadding,
        };

        cardStyle = mergeStyle(this, cardStyle, 'style');

        // if elevation is not found from props.style than apply default cardElevation
        let elevation = cardStyle.elevation === undefined ? cardElevation : cardStyle.elevation;
        let borderWidth = cardStyle.borderWidth === undefined ? R.dimens.LineHeight : cardStyle.borderWidth;

        //Added Condition in cardview if API level is less then or equal to 19 then added boarder in cardview only for light theme
        cardStyle = Object.assign({}, cardStyle, getCardStyle(elevation, borderWidth));

        return (
            <TouchableWithoutFeedback onPress={onPress} disabled={disabled ? disabled : false}>
                <View style={cardStyle}>
                    {this.props.children}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

CardView.propTypes = {
    cardBackground: PropTypes.string,
    cardElevation: PropTypes.number,
    cardRadius: PropTypes.number,
    style: PropTypes.object,
    onPress: PropTypes.func
}

CardView.defaultProps = {
    cardElevation: R.dimens.listCardElevation,
    cardRadius: R.dimens.cardBorderRadius,
    style: {},
    onPress: () => { }
}

export function getCardStyle(elevation = R.dimens.listCardElevation, borderWidth = R.dimens.LineHeight) {

    let cardStyle = { elevation };
    //Added Condition in cardview if API level is less then or equal to 19 then added boarder in cardview only for light theme
    if (Platform.OS === 'android' && Platform.Version <= 19 && R.colors.getTheme() === 'lightTheme') {
        delete cardStyle['elevation'];

        cardStyle = Object.assign({}, cardStyle, {
            borderColor: R.colors.editTextBorder,
            borderWidth: borderWidth,
        });
    } else {
        cardStyle = Object.assign({}, cardStyle, {
            elevation: elevation,
        });
    }

    // if elevation is not undefined and not 0 than apply elevation and shadow as per platform.
    if (cardStyle.elevation !== undefined && cardStyle.elevation != 0) {
        cardStyle = Object.assign({}, cardStyle, Platform.select({
            android: {
                elevation: cardStyle.elevation,
            },
            ios: {
                shadowOffset: { width: 1, height: 1 },
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOpacity: 1,
            }
        }));
    }

    return cardStyle;
}