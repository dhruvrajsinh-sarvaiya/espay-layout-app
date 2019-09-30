import React, { Component } from 'react'
import Button from './Button';
import R from '../R';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export class BottomButton extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, _nextState) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.title === nextProps.title) {
            return false
        }
        return true
    }

    render() {
        let { title, onPress } = this.props
        return (
            <Button
                isRound={true}
                title={title}
                textStyle={{ fontSize: R.dimens.smallestText }}
                style={{ width: wp('20%'), paddingLeft: R.dimens.WidgetPadding, paddingRight: R.dimens.WidgetPadding }}
                onPress={onPress} />
        )
    }
}

export default BottomButton
