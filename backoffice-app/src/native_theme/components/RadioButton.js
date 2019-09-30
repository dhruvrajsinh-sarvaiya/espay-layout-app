import React, { Component } from 'react'
import { View } from 'react-native'
import R from '../R';
import ImageTextButton from './ImageTextButton';

export class RadioButton extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { item, onPress } = this.props;
        return (
            <View>
                <ImageTextButton
                    name={item.title}
                    icon={item.selected ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                    onPress={() => onPress(item)}
                    style={{ flex: 1, margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                    textStyle={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary }}
                    iconStyle={{ tintColor: item.selected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                />
            </View>
        )
    }
}

export default RadioButton
