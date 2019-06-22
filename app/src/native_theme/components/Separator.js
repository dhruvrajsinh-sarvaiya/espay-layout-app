import React, { Component } from 'react';
import { View } from 'react-native';
import R from '../R';
import LinearGradient from 'react-native-linear-gradient';

export default class Separator extends Component {

    render() {
        // Get required params from props
        let backgroundColor = this.props.color ? this.props.color : R.colors.textSecondary;
        let height = this.props.height ? this.props.height : R.dimens.separatorHeight;
        let width = this.props.width ? this.props.width : '100%';

        // check for display separator in gradient color or not
        if (this.props.isGradient) {
            return (
                <LinearGradient
                    style={[{
                        marginLeft: R.dimens.widget_left_right_margin,
                        marginRight: R.dimens.widget_left_right_margin,
                        height,
                        width
                    }, this.props.style]}
                    colors={[R.colors.linearStart, R.colors.linearEnd]}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />);
        } else {
            return (
                <View style={[{ marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin }, this.props.style]}>
                    <View style={{ backgroundColor, height, width }} />
                </View>

            );
        }

    }
}