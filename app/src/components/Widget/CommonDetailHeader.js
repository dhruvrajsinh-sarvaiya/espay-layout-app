import React, { Component } from 'react'
import { connect } from 'react-redux';
import { View, Text } from 'react-native'
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { Fonts } from '../../controllers/Constants';

//Create Common class for All Detail Screen Header
class CommonDetailHeader extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.value === nextProps.value &&
            this.props.title === nextProps.title &&
            this.props.preference.theme === nextProps.preference.theme &&
            this.props.preference.locale === nextProps.preference.locale &&
            this.props.preference.dimensions.isPortrait === nextProps.preference.dimensions.isPortrait) {
            return false
        }
        return true
    }

    render() {

        return (
            <View style={{ marginLeft: (R.dimens.margin_top_bottom * 2), marginRight: R.dimens.margin_top_bottom, marginTop: R.dimens.margin }}>
                <TextViewMR style={
                    {
                        fontSize: R.dimens.smallestText,
                        color: R.colors.white,
                        textAlign: 'left',
                    }}>{this.props.title}</TextViewMR>
                <Text style={
                    {
                        fontSize: R.dimens.largeText,
                        fontFamily: Fonts.MontserratSemiBold,
                        color: R.colors.white,
                        textAlign: 'left',
                    }}>{this.props.value} {this.props.subValue ? this.props.subValue : ''}</Text>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        // get updated state from reducer
        preference: state.preference
    }
}

export default connect(mapStateToProps)(CommonDetailHeader);