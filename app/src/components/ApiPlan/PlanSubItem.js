import React, { Component } from 'react'
import { Text, View } from 'react-native'
import TextViewHML from '../../native_theme/components/TextViewHML';
import { validateValue } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import { Fonts } from '../../controllers/Constants';
import { connect } from 'react-redux'

export class PlanSubItem extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.title !== nextProps.title || this.props.value !== nextProps.value || this.props.isBold !== nextProps.isBold)
            return true
        return false
    }

    render() {
        // if isBold props is available then value is in bold text
        if (this.props.isBold)
            return (
                <View style={[{ flexDirection: 'row', alignItems: 'center', }, this.props.viewStyle]}>
                    <TextViewHML style={[this.styles().itemTitle, this.props.titleStyle]}>{this.props.title}</TextViewHML>
                    <Text style={[this.styles().itemValue, { fontFamily: Fonts.MontserratSemiBold, textAlign: this.props.leftAlign ? 'left' : 'right' }, this.props.styles]}>{validateValue(this.props.value)}</Text>
                </View>
            )
        // if isWidth props is available then divide two column in 60% and 40%
        else if (this.props.isWidth) {
            return (
                <View style={[{ flexDirection: 'row', alignItems: 'center', }, this.props.viewStyle]}>
                    <TextViewHML style={[this.styles().itemWidthTitle, this.props.titleStyle]}>{this.props.title}</TextViewHML>
                    <TextViewHML style={[this.styles().itemWidthValue, this.props.styles]}>{validateValue(this.props.value)}</TextViewHML>
                </View>
            )
        } else {
            return (
                <View style={[{ flexDirection: 'row', alignItems: 'center', }, this.props.viewStyle]}>
                    <TextViewHML style={[this.styles().itemTitle, this.props.titleStyle]}>{this.props.title}</TextViewHML>
                    <TextViewHML style={[this.styles().itemValue, this.props.styles]}>{validateValue(this.props.value)}</TextViewHML>
                </View>
            )
        }
    }

    styles = () => {
        return {
            itemTitle: {
                flex: 1,
                fontSize: R.dimens.smallestText,
                color: R.colors.textSecondary,
            },
            itemValue: {
                flex: 1,
                fontSize: R.dimens.smallestText,
                color: R.colors.textPrimary,
            },
            itemWidthTitle: {
                width: '60%',
                fontSize: R.dimens.smallestText,
                color: R.colors.textSecondary,
            },
            itemWidthValue: {
                width: '40%',
                fontSize: R.dimens.smallestText,
                color: R.colors.textPrimary,
                textAlign: 'right'
            },
        }
    }
}

const mapStateToProps = (state) => {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PlanSubItem)
