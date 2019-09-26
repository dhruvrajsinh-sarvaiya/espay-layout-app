import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import R from '../../../native_theme/R';
import { changeTheme } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CustomCard from '../../widget/CustomCard';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import DashboardHeader from '../../widget/DashboardHeader';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';

class RuleModuleDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			viewHeight: 0,
			isGrid: true,
			data: [
				{ id: '1', title: null, value: R.strings.ListRuleModule, icon: R.images.IC_VIEW_LIST, type: 1 },
				{ id: '2', title: null, value: R.strings.AddRuleModule, icon: R.images.IC_PLUS, type: 2 },
			],
		};
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		//stop twice api call
		return isCurrentScreen(nextProps);
	};

	onCustomCardPress = (item) => {
		let { navigate } = this.props.navigation

		//redirect screen based on card select
		if (item === R.strings.ListRuleModule)
			navigate('RuleModuleScreen')
		else if (item === R.strings.AddRuleModule)
			navigate('AddEditRuleModuleScreen', { item: undefined })

	}

	render() {
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
				{/* statusbar and actionbar  */}
				<CommonStatusBar />

				<CustomToolbar
					isBack={true}
					nav={this.props.navigation} />

				{/* for header name and icon */}
				<DashboardHeader
					navigation={this.props.navigation}
					header={R.strings.RuleModule}
					isGrid={this.state.isGrid}
					onPress={() => this.setState({ isGrid: !this.state.isGrid })} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<FlatList
						numColumns={this.state.isGrid ? 2 : 1}
						key={this.state.isGrid ? 'Grid' : 'List'}
						data={this.state.data}
						extraData={this.state}
						showsVerticalScrollIndicator={false}
						/* render all item in list */
						renderItem={({ item, index }) => {
							return (
								<CustomCard
									isGrid={this.state.isGrid}
									size={this.state.data.length}
									index={index}
									title={item.title}
									value={item.value}
									icon={item.icon}
									type={item.type}
									onChangeHeight={(height) => {
										this.setState({ viewHeight: height })
									}}
									viewHeight={this.state.viewHeight}
									onPress={() => this.onCustomCardPress(item.value)} />

							)
						}}
						keyExtractor={(item, index) => index.toString()}
					/>

					<View style={{ margin: R.dimens.widget_top_bottom_margin }}>
						<ImageButton
							style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
							iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
							icon={R.images.BACK_ARROW}
							onPress={() => this.props.navigation.goBack()} />
					</View>
				</View>
			</SafeView>
		);
	}
}

export default RuleModuleDashboard;
