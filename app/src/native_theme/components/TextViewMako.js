import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Fonts } from '../../controllers/Constants';
import { mergeStyle } from '../../controllers/CommonUtils';

class TextViewMako extends Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.preference.locale !== nextProps.preference.locale ||
            this.props.preference.theme !== nextProps.preference.theme) {
            return true;
        } else {
            if (this.props !== nextProps) {
                return true;
            } else {
                return false;
            }
        }
    }

    render() {

        let style = mergeStyle(this, {}, 'style')

        //apply font in exisiting style
        style = {
            ...style,
            fontFamily: Fonts.MakoRegular,
        }

        return (
            <Text {...this.props} style={style}>{this.props.children}</Text>
        )
    }
}

const mapStateToProps = (state) => ({
    preference: state.preference
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(TextViewMako)