import React, { Component } from 'react';
import { View, Modal } from 'react-native';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import { getData, setData } from '../../App';
//import firebase from 'firebase';
import Button from '../../native_theme/components/Button';
import TextViewMR from '../../native_theme/components/TextViewMR';
import Separator from '../../native_theme/components/Separator';

//Below code in index.js
/* var config = {
    databaseURL: "https://new-stack-dev.firebaseio.com",
    projectId: "new-stack-dev",
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);    
} */

class CRWidget extends Component {

	constructor(props) {
		super(props)

		let cr = {
			LC000068: [
				this.createCredential('Dhruvit Kukadiya', 'DhruvitK94', 'Kdk15@045'),
				this.createCredential('Jaydev Waghela', 'jdvvaghela', 'JdW@123'),
				this.createCredential('Jeet Rathod', 'jeet1994', 'Jeet@123'),
				this.createCredential('Janviba Zala', 'janviba911', '#Janvee#9'),
				this.createCredential('Dipesh Valera', 'dipeshvalera', 'Dipesh@123'),
				this.createCredential('Khushali Savani', 'khushali', 'Khushi@123'),
			],
			LC000069: [
				this.createCredential('Jaydev Waghela', 'jdwaghela', 'JdW@123'),
				this.createCredential('Dhruvit Kukadiya', 'DhruvitK', 'Kdk45@045'),
				this.createCredential('Dhruvdevsinh Gohil', 'dhruvdevsinhgohil@yahoo.com', 'Dj@3627')
			]
		}

		this.state = {
			showWidgetCR: false,
			needDefault: true,
			credentials: cr[getData(ServiceUtilConstant.KEY_LicenseCode)]
		}
	}

	createCredential(title, UserName, Password) { return { title, UserName, Password } }

	componentDidMount() {

		if (this.state.needDefault) {
			let defaultUser = getData('defaultUser') !== undefined ? getData('defaultUser') : 0;
			this.props.context.setState({ UserName: this.state.credentials[defaultUser].UserName, Password: this.state.credentials[defaultUser].Password })
		}
	}

	static getDerivedStateFromProps(props, state) {

		if (props.context.state.showWidgetCR !== undefined && props.context.state.showWidgetCR != state.showWidgetCR) {
			return Object.assign({}, state, {
				showWidgetCR: !state.showWidgetCR
			});
		}
		return null;
	}

	/* readUserData() {
		firebase.database().ref('Users/').once('value', function (snapshot) {
			cfirebaseonsole.warn(snapshot.val())
		});
	}

	writeUserData(email, fname, lname) {
		firebase.database().ref('Users/').set({
			email,
			fname,
			lname
		}).then((data) => {
			//success callback
			console.log('data ', data)
		}).catch((error) => {
			//error callback
			console.log('error ', error)
		})
	}

	updateSingleData(email) {
		firebase.database().ref('Users/').update({
			email,
		});
	}

	deleteData() {
		firebase.database().ref('Users/').remove();
	} */

	render() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<Modal
					supportedOrientations={['portrait', 'landscape']}
					animationType="slide"
					transparent={true}
					visible={this.state.showWidgetCR}
					onRequestClose={() => {
						this.setState({ showWidgetCR: !this.state.showWidgetCR })
					}}>
					<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0, 0.3)', justifyContent: 'flex-end', alignItems: 'center', padding: R.dimens.margin }}>

						<View style={{
							width: '100%',
							backgroundColor: R.colors.background,
							borderTopLeftRadius: R.dimens.LoginButtonBorderRadius,
							borderTopRightRadius: R.dimens.LoginButtonBorderRadius,
							borderBottomLeftRadius: 40,
							borderBottomRightRadius: 40,
							marginBottom: 10
						}}>

							<TextViewMR style={{
								fontSize: R.dimens.largeText,
								color: R.colors.textPrimary,
								marginTop: R.dimens.widget_top_bottom_margin,
								marginBottom: R.dimens.widget_top_bottom_margin,
								paddingLeft: R.dimens.margin_left_right,
								paddingRight: R.dimens.margin_left_right,
							}}>{R.strings.select + ' ' + R.strings.User}</TextViewMR>

							<Separator />

							{this.state.credentials.map((item, index) => <View key={item.title}
								style={{
									flexDirection: 'row', justifyContent: 'space-between',
									marginTop: index == 0 ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
									marginBottom: index == this.state.credentials.length - 1 ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin
								}}>
								<ImageTextButton
									name={item.title}
									icon={R.images.IC_USER}
									isLeftIcon
									style={{
										flex: 1,
										alignItems: 'center'
									}}
									iconStyle={{
										width: R.dimens.IconWidthHeight,
										height: R.dimens.IconWidthHeight,
										tintColor: this.props.context.state.UserName === item.UserName ? R.colors.successGreen : R.colors.textPrimary
									}}
									textStyle={{
										color: this.props.context.state.UserName === item.UserName ? R.colors.successGreen : R.colors.textPrimary,
										fontSize: R.dimens.mediumText,
										marginLeft: R.dimens.widgetMargin
									}}
									onPress={() => {

										// this.writeUserData('testing@gmail.com', 'First', 'LastName');
										// this.readUserData();
										// this.updateSingleData('newGmail@gmail.com');
										// this.deleteData();
										// return;

										setData({ 'defaultUser': index });
										this.props.context.setState({ UserName: item.UserName, Password: item.Password, showWidgetCR: false }, () => this.props.onPress())
									}} />

								{this.props.context.state.UserName === item.UserName &&
									<ImageTextButton
										name={'Forgot'}
										style={{
											justifyContent: 'flex-end',
											alignItems: 'center'
										}}
										textStyle={{ color: 'red', fontSize: R.dimens.mediumText }}
										onPress={() => {
											this.props.context.setState({ UserName: '', Password: '', showWidgetCR: false })
										}} />}
							</View>)}
							<Button
								isRound={true}
								title={'Cancel'}
								onPress={() => this.props.context.setState({ showWidgetCR: false })}
								style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.padding_top_bottom_margin, width: R.screen().width / 2 }} />
						</View>
					</View>
				</Modal>

			</View>
		);
	}
}

export default CRWidget;