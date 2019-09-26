import React, { Component } from 'react'
import { Text, View } from 'react-native'
import TextViewHML from './TextViewHML';
import { changeTheme } from '../../controllers/CommonUtils';
import R from '../R';

export class RowItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.value === nextProps.value) {
            return false
        }
        return true
    }

    render() {
        let { marginBottom = false, title = '', value = '', status = false, color = R.colors.textPrimary } = this.props
        return (
            <View style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: R.dimens.widgetMargin,
                marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
            }, this.props.style]}>
                <TextViewHML style={[this.styles().contentItem, { color: R.colors.textSecondary }, this.props.titleStyle]}>{title}</TextViewHML>
                <TextViewHML style={[this.styles().contentItem, { color: status ? color : R.colors.textPrimary, textAlign: 'right' }, this.props.valueStyle]}>{value}</TextViewHML>
            </View>
        )
    }

    // style for this class
    styles = () => {
        return {
            contentItem: {
                flex: 1,
                fontSize: R.dimens.smallText,
                color: R.colors.textPrimary
            }
        }
    }
}

export default RowItem
