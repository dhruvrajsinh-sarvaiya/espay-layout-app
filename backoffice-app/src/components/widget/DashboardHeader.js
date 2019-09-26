import React, { Component } from 'react';
import { View } from 'react-native';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import { isCurrentScreen } from '../Navigation';
import { Fonts } from '../../controllers/Constants';
import TextViewMR from '../../native_theme/components/TextViewMR';

class DashboardHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.header !== nextProps.header || this.props.onPress !== nextProps.onPress || this.props.isGrid !== nextProps.isGrid)
            return isCurrentScreen(nextProps)
        else
            return false
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', marginLeft: R.dimens.padding_left_right_margin, marginRight: R.dimens.padding_left_right_margin, }}>
                <View style={{ flex: 1, justifyContent: 'center', }}>
                    <TextViewMR style={{ fontSize: R.dimens.largeText, color: R.colors.accent, fontFamily: Fonts.MontserratSemiBold }}>{this.props.header}</TextViewMR>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                    <ImageButton
                        icon={this.props.isGrid ? R.images.IC_VIEW_GRID : R.images.IC_VIEW_LIST}
                        style={{ margin: 0 }}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        onPress={this.props.onPress} />
                </View>
            </View>
        );
    }
}

export default DashboardHeader;
