import React, { Component } from 'react'
import { View } from 'react-native'
import CardView from './CardView';
import TextViewHML from './TextViewHML';
import TextViewMR from './TextViewMR';
import R from '../R';

export class TextCard extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        if (this.props === nextProps) {
            return false
        }
        return true
    }

    render() {
        // props from main screen
        let { title, value, style, titleStyle, valueStyle, isRequired } = this.props

        return (
            <View style={[{ marginTop: R.dimens.margin }, style]}>

                {/* for title and isRequired sign */}
                <View style={{ flexDirection: 'row' }}>
                    <TextViewMR style={[this.styles().title, titleStyle]}>{title}
                        {isRequired && <TextViewMR style={{ color: R.colors.failRed }}> *</TextViewMR>}</TextViewMR>
                </View>

                {/* for value */}
                <CardView
                    cardRadius={0}
                    cardElevation={R.dimens.CardViewElivation}
                    style={{ margin: R.dimens.CardViewElivation, height: R.dimens.ButtonHeight }}>

                    <TextViewHML style={[{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }, valueStyle]}>
                        {value}
                    </TextViewHML>

                </CardView>
            </View >
        )
    }

    // common style
    styles = () => {
        return {
            title: {
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary,
                marginLeft: R.dimens.LineHeight,
                alignSelf: 'flex-start',
            },
        }
    }
}

export default TextCard
