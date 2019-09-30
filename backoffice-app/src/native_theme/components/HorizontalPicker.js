import React, { Component } from 'react';
import { View } from 'react-native';
import R from '../R';
import ImageButton from './ImageTextButton';
import { connect } from 'react-redux';
import { getCardStyle } from './CardView';

class HorizontalPicker extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.Items === nextProps.Items &&
            this.props.selectedItem === nextProps.selectedItem &&
            this.props.preference.theme === nextProps.preference.theme &&
            this.props.preference.dimensions.isPortrait === nextProps.preference.dimensions.isPortrait) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let { Items, selectedItem, onPress } = this.props;

        return (
            <View style={{ flexDirection: 'row', margin: R.dimens.CardViewElivation, }}>
                {Items.map((item, index) =>
                    <View key={index} style={{
                        flex: 1,
                        ...getCardStyle(R.dimens.CardViewElivation),
                        borderRadius: R.dimens.cardBorderRadius,
                        opacity: R.colors.getTheme().includes('ni') ? 0.45 : 1,
                    }}>
                        <ImageButton
                            name={item.value}
                            onPress={() => onPress(item)}
                            numberOfLines={1}
                            isHML
                            style={[{
                                margin: 0,
                                paddingTop: R.dimens.widgetMargin,
                                paddingBottom: R.dimens.widgetMargin,
                                paddingLeft: R.dimens.margin_left_right,
                                paddingRight: R.dimens.margin_left_right,
                                width: '100%',
                                justifyContent: 'center',
                                alignContent: 'center',
                                backgroundColor: selectedItem === item.value ? R.colors.selectCardBackground : R.colors.cardBackground,
                            }]}
                            textStyle={[
                                this.styles().simpleText,
                                {
                                    textAlignVertical: 'center',
                                    textAlign: 'center',
                                    color: selectedItem === item.value ? R.colors.accent : R.colors.textPrimary,
                                    fontWeight: selectedItem === item.value ? 'bold' : 'normal',
                                }]}
                        />
                    </View>
                )}
            </View>
        );
    }
    styles = () => {
        return {
            simpleText: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.dashboardSelectedTabText,
                paddingTop: R.dimens.widgetMargin,
                paddingBottom: R.dimens.widgetMargin
            },
        }
    }
}
const mapStateToProps = (state) => {
    return {
        preference: state.preference,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalPicker);

