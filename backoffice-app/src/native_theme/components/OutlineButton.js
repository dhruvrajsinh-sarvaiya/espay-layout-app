import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import R from '../R';

export function OutlineButton(props) {
    let item = props.item
    let bordercolor = '';
    if (props.isSelected) {
        bordercolor = R.colors.accent
    } else {
        bordercolor = R.colors.textSecondary
    }

    //if its array item then item will not be null otherwise its null then display simple button.
    if (item) {
        return (
            <TouchableWithoutFeedback onPress={props.onClick}>
                <View style={[styles.filterStyle, { width: props.width, marginLeft: (props.index == 0 || props.index == 4) ? R.dimens.widget_left_right_margin : 0 }]}>
                    <View style={[styles.filterSubStyle, { borderColor: bordercolor, }]}>
                        <Text style={[styles.filterText, { color: item.isSelected ? R.colors.accent : R.colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    } else {
        return (
            <TouchableWithoutFeedback onPress={props.onClick} disabled={props.disabled}>
                <View style={[styles.percentageStyle, props.style]}>
                    <Text style={styles.simpleText} >{props.title}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

const styles = StyleSheet.create({
    filterStyle: {
        marginTop: R.dimens.margin_top_bottom,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterSubStyle: {
        width: '90%',
        borderWidth: R.dimens.normalizePixels(0.5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: R.dimens.LineHeight,
    },
    filterText: {
        color: R.colors.textPrimary,
        fontSize: R.dimens.listHeaderText,
        paddingTop: R.dimens.LineHeight,
        paddingBottom: R.dimens.LineHeight,
    },
    simpleText: {
        color: R.colors.accent,
        fontSize: R.dimens.dashboardSelectedTabText,
        textAlign: 'center'
    },
    percentageStyle: {
        borderWidth: R.dimens.normalizePixels(1),
        borderColor: R.colors.accent,
        alignItems: 'center',
        padding: R.dimens.WidgetPadding
    },
})