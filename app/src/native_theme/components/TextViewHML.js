import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Fonts } from '../../controllers/Constants';
import R from '../R';
import { mergeStyle } from '../../controllers/CommonUtils';

class TextViewHML extends Component {

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

        // if there is no margin available in style then give slighter margin to top of textView
        if (style.marginTop === undefined || style.margin === undefined) {
            style = Object.assign({}, style, {
                marginTop: R.dimens.CardViewElivation
            })
        }

        //apply font in exisiting style
        style = Object.assign({}, style, {
            fontFamily: Fonts.HindmaduraiLight,
        })

        return (
            <Text {...this.props} style={style}>{this.props.children}</Text>
        )
    }
}

const mapStateToProps = (state) => ({
    preference: state.preference
})

export default connect(mapStateToProps)(TextViewHML)