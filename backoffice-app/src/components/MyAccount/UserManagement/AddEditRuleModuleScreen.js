import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import EditText from '../../../native_theme/components/EditText';
import Button from '../../../native_theme/components/Button';
import { changeTheme, showAlert, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { addRuleModuleData, clearRuleModuleData, editRuleModuleData, getRuleModuleList } from '../../../actions/account/UserManagementActions';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import SafeView from '../../../native_theme/components/SafeView';

class AddEditRuleModuleScreen extends Component {
	constructor(props) {
		super(props);
		let { item } = props.navigation.state.params

		//deifine all initial state
		this.state = {
			ModuleId: item !== undefined ? item.ModuleID : 0,
			ModuleName: item !== undefined ? item.ModuleName : '',
			Status: [
				{ value: R.strings.select_status },
				{ value: R.strings.Active },
				{ value: R.strings.Inactive },
			],
			selectedStatus: item !== undefined ? (item.Status == 1 ? R.strings.Active : R.strings.Inactive) : R.strings.select_status,
			item: item,
			parentIds: [{ value: R.strings.Please_Select }],
			selectedParentId: R.strings.Please_Select,
			selectedParentIdCode: item !== undefined ? item.ParentID : '',
			isEdit: item !== undefined ? true : false
		};

		//create reference
		this.toast = React.createRef();
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		// Check internet connection
		if (await isInternet()) {
			// Call Rule Module List Api
			this.props.getRuleModuleList({
				PageNo: 0,
				PageSize: 100,
				AllRecords: 1,
				IsParentList: true
			})
		}

	}

	static oldProps = {};

	//handle reponse
	static getDerivedStateFromProps(props, state) {
		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return {
				...state,
				isFirstTime: false
			};
		}

		// To Skip Render if old and new props are equal
		if (AddEditRuleModuleScreen.oldProps !== props) {
			AddEditRuleModuleScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			const { RuleModuleListData } = props.AddRuleModuleResult;

			if (RuleModuleListData) {
				try {
					//if local currencyList state is null or its not null and also different then new response then and only then validate response.
					if (state.RuleModuleListDataState == null ||
						(state.RuleModuleListDataState != null &&
							RuleModuleListData !== state.RuleModuleListDataState)
					) {
						//if currencyList response is success then store array list else store empty list
						if (validateResponseNew({ response: RuleModuleListData, isList: true })) {
							let res = parseArray(RuleModuleListData.Result);

							let res1 = [];

							//for add RuleModuleListData picker
							for (var keyRuleModuleListData in res) {
								let item = res[keyRuleModuleListData];
								item.value = item.ModuleName;
								res1.push(item);
							}

							let selectedParentId = R.strings.Please_Select;

							// if edit true than set selected parent name
							if (state.isEdit) {
								//for add RuleModuleListData
								for (let i = 0; i < res1.length; i++) {
									let item = res[i];
									if (item.ModuleID == state.item.ParentID)
										selectedParentId = item.ModuleName;
								}
							}

							let parentIds = [{ value: R.strings.Please_Select }, ...res];

							return {
								...state,
								selectedParentId,
								parentIds,
								RuleModuleListDataState: RuleModuleListData
							};
						} else {
							return {
								...state,
								parentIds: [{ value: R.strings.Please_Select }],
								RuleModuleListDataState: RuleModuleListData
							};
						}
					}
				} catch (e) {
					return {
						...state,
						parentIds: [{ value: R.strings.Please_Select }]
					};
				}
			}
		}
		return null;
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	};

	onSubmitPress = async () => {
		// validations
		if (this.state.selectedParentId === R.strings.Please_Select)
			this.toast.Show(R.strings.selectParent)
		else if (isEmpty(this.state.ModuleName))
			this.toast.Show(R.strings.EnterModuleName)
		else if (this.state.selectedStatus === R.strings.select_status)
			this.toast.Show(R.strings.select_status)
		else {
			// Check internet connection
			if (await isInternet()) {
				// Common Request for Add and Edit Rule Module
				let req = {
					ModuleID: this.state.ModuleId,
					ModuleName: this.state.ModuleName,
					Status: this.state.selectedStatus === R.strings.Active ? 1 : 0,
					ParentID: this.state.selectedParentIdCode
				}

				if (typeof this.state.item == 'undefined') {
					// Add Rule Module Api Call
					this.props.addRuleModuleData(req)
				} else if (typeof this.state.item !== 'undefined') {
					// Edit Rule Module Api Call
					this.props.editRuleModuleData(req)
				}
			}
		}
	}

	componentDidUpdate(prevProps, _prevState) {
		//Get All Updated field of Particular actions
		const { AddRuleModuleData, EditRuleModuleData } = this.props.AddRuleModuleResult

		if (AddRuleModuleData !== prevProps.AddRuleModuleResult.AddRuleModuleData) {
			// AddRuleModuleData is not null
			if (AddRuleModuleData) {
				try {
					if (this.state.AddRuleModuleData == null || (this.state.AddRuleModuleData != null && AddRuleModuleData !== this.state.AddRuleModuleData)) {
						// Handle Response
						if (validateResponseNew({ response: AddRuleModuleData })) {
							showAlert(R.strings.Success + '!', AddRuleModuleData.ReturnMsg, 0, () => {
								this.props.clearRuleModuleData()
								this.props.navigation.goBack()
							})
							this.setState({ AddRuleModuleData })
						} else {
							this.props.clearRuleModuleData()
							this.setState({ AddRuleModuleData: null })
						}
					}
				} catch (error) {
					this.props.clearRuleModuleData()
					this.setState({ AddRuleModuleData: null })
				}
			}
		}

		if (EditRuleModuleData !== prevProps.AddRuleModuleResult.AddRuleModuleData) {
			// EditRuleModuleData is not null
			if (EditRuleModuleData) {
				try {
					if (this.state.EditRuleModuleData == null || (this.state.EditRuleModuleData != null && EditRuleModuleData !== this.state.EditRuleModuleData)) {
						// Handle Response
						if (validateResponseNew({ response: EditRuleModuleData })) {
							showAlert(R.strings.Success + '!', EditRuleModuleData.ReturnMsg, 0, () => {
								this.props.clearRuleModuleData()
								this.props.navigation.state.params.onRefresh(true)
								this.props.navigation.goBack()
							})

							this.setState({ EditRuleModuleData })
						} else {
							this.props.clearRuleModuleData()
							this.setState({ EditRuleModuleData: null })
						}
					}
				} catch (error) {
					this.props.clearRuleModuleData()
					this.setState({ EditRuleModuleData: null })
				}
			}
		}
	}

	render() {
		let { AddRuleModuleLoading, EditRuleModuleLoading, RuleModuleListLoading } = this.props.AddRuleModuleResult
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To Set Status Bas as per out theme */}
				<CommonStatusBar />

				{/* To Set ToolBar as per out theme */}
				<CustomToolbar
					title={this.state.item !== undefined ? R.strings.UpdateRuleModule : R.strings.AddRuleModule}
					isBack={true}
					nav={this.props.navigation} />

				{/* For Toast */}
				<CommonToast ref={component => this.toast = component} />

				{/* Progressbar */}
				<ProgressDialog isShow={AddRuleModuleLoading || EditRuleModuleLoading || RuleModuleListLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

							{/* Picker for parentIds */}
							<TitlePicker
								isRequired={true}
								title={R.strings.parent}
								array={this.state.parentIds}
								selectedValue={this.state.selectedParentId}
								style={{
									marginTop: R.dimens.widget_top_bottom_margin,
								}}
								onPickerSelect={(item, object) =>
									this.setState({
										selectedParentId: item,
										selectedParentIdCode: object.ModuleID
									})
								}
							/>

							{/* Input of Module Name */}
							<EditText
								isRequired={true}
								header={R.strings.ModuleName}
								placeholder={R.strings.EnterModuleName}
								multiline={false}
								keyboardType='default'
								returnKeyType={"done"}
								maxLength={250}
								onChangeText={(item) => this.setState({ ModuleName: item })}
								value={this.state.ModuleName}
							/>
							{/* Dropdown for Status*/}
							<TitlePicker
								isRequired={true}
								style={{ marginTop: R.dimens.margin }}
								title={R.strings.Status}
								array={this.state.Status}
								selectedValue={this.state.selectedStatus}
								onPickerSelect={(item) => this.setState({ selectedStatus: item })} />
						</View>
					</ScrollView>

					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={this.state.item !== undefined ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
					</View>
				</View>

			</SafeView>
		);
	}
}

// return state from saga or reducer
const mapStateToProps = (state) => {
	return {
		AddRuleModuleResult: state.RuleModuleReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Rule module list
	getRuleModuleList: (payload) => dispatch(getRuleModuleList(payload)),
	// Add Rule module
	addRuleModuleData: (payload) => dispatch(addRuleModuleData(payload)),
	// Edit Rule module
	editRuleModuleData: (payload) => dispatch(editRuleModuleData(payload)),
	// Clear Rule Module Data
	clearRuleModuleData: () => dispatch(clearRuleModuleData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditRuleModuleScreen);