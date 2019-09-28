import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Fonts } from '../../controllers/Constants';
import { mergeStyle } from '../../controllers/CommonUtils';

class TextViewMR extends Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.preference.locale !== nextProps.preference.locale ||
            this.props.preference.theme !== nextProps.preference.theme ||
            this.props !== nextProps) {
            return true;
        }
        return false;
    }

    render() {

        let style = mergeStyle(this, {}, 'style');

        //apply font in exisiting style
        style = Object.assign({}, style, {
            fontFamily: Fonts.MontserratRegular,
        })

        return (
            <Text {...this.props} style={style}>{this.props.children}</Text>
        )
    }
}

const mapStateToProps = (state) => ({
    preference: state.preference
})

export default connect(mapStateToProps)(TextViewMR)