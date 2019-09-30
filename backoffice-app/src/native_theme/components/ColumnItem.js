import React, { Component } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import TextViewHML from './TextViewHML';
import { changeTheme } from '../../controllers/CommonUtils';
import R from '../R';

export class ColumnItem extends Component {
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
        let { marginBottom = false, title = '', value = '', color = false, onPress } = this.props
        return (
            <View style={[{
                marginTop: R.dimens.widgetMargin,
                marginBottom: marginBottom ? R.dimens.widget_top_bottom_margin : 0,
                paddingLeft: R.dimens.padding_left_right_margin,
                paddingRight: R.dimens.padding_left_right_margin,
            }, this.props.style]}>

                <TextViewHML style={[{
                    flex: 1, fontSize: R.dimens.smallText,
                    color: R.colors.textSecondary
                }, this.props.titleStyle]}>{title}</TextViewHML>

                <TouchableWithoutFeedback onPress={onPress}>
                    <TextViewHML style={[{
                        flex: 1, fontSize: R.dimens.smallText,
                        color: color ? color : R.colors.textPrimary
                    }, this.props.valueStyle]}>{value}</TextViewHML>
                </TouchableWithoutFeedback>

            </View>
        )
    }
}

export default ColumnItem
