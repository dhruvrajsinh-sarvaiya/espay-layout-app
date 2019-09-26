import React, { Component } from 'react';
import { View } from 'react-native';

class ThemeToolbarWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return <View />
		/* return (
			<CardView
				style={{
					margin: R.dimens.margin,
					paddingTop: R.dimens.widgetMargin,
					paddingBottom: R.dimens.widgetMargin,
					paddingLeft: R.dimens.margin,
					paddingRight: R.dimens.margin
				}}
				cardRadius={R.dimens.paginationButtonRadious}>
				<View style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
					<ImageButton
						icon={R.images.IC_SUN}
						style={{ margin: 0, }}
						iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.yellow }]}
						onPress={() => R.colors.setTheme('lighttheme')}
					/>
					<ImageButton
						icon={R.images.IC_MOON}
						style={{ margin: 0, marginLeft: R.dimens.widget_left_right_margin }}
						iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
						onPress={() => R.colors.setTheme('nightTheme')}
					/>

				</View>
			</CardView>

		); */
	}
}

export default ThemeToolbarWidget;
