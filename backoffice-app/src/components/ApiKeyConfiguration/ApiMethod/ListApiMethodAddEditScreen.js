import {
    View,
    ScrollView,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import SafeView from '../../../native_theme/components/SafeView';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { getSocketMethodData, getSystemResetMethodData, addApiMethod, updateApiMethod, } from '../../../actions/ApiKeyConfiguration/ApiMethodAction';
import { MultipleSelectionButton } from '../../../native_theme/components/MultipleSelection';
import RadioButton from '../../../native_theme/components/RadioButton';

//Create Common class for Add Edit Api Method List
class ListApiMethodAddEditScreen extends Component {

    constructor(props) {
        super(props);

        // Getting data from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.item

        // Define all initial state
        this.state = {
            item: item ? item : null,
            Id: item ? item.ID : 0,
            Status: item ? (item.Status == 1 ? true : false) : false,
            isEdit: item ? true : false,
            isFirstTime: false,
            MethodName: item ? item.MethodName : '',
            APIAccess: item ? (item.IsReadOnly == 1 ? true : false) : true,
            SocketMethod: [],
            GetSocketMethodListData: [{ value: R.strings.Please_Select }],
            RestMethod: [],
            GetRestMethodListData: [{ value: R.strings.Please_Select }],
            selectedSocketItems: [],
            selectedRestItems: [],
            EditSocketMethod: [],
            EditRestMethod: [],
            isEditSocketMethods: false,
            isEditRestMethods: false,
        }

        // create reference
        this.toast = React.createRef();

        this.inputs = {}
    }

    async componentDidMount() {

        changeTheme() //Add this method to change theme based on stored theme name.

        if (this.state.isEdit) {

            //for the SocketMethod
            if (this.state.item.SocketMethods) {
                let Actions = Object.values(this.state.item.SocketMethods)

                for (let i = 0; i < Actions.length; i++) {
                    this.state.EditSocketMethod.push(
                        { value: Actions[i] }
                    )
                }
            }

            //for the Rest Method
            if (this.state.item.RestMethods) {
                let Actions = Object.values(this.state.item.RestMethods)
                for (let i = 0; i < Actions.length; i++) {
                    this.state.EditRestMethod.push(
                        { value: Actions[i] }
                    )
                }
            }
        }

        // Check NetWork is Available or not
        if (await isInternet()) {
            //For Call Socket Api Method List
            this.props.getSocketMethodData()

            //For Call Rest Api Method List
            this.props.getSystemResetMethodData()
        }

    }

    static oldProps = {};

    //handle reponse 
    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (ListApiMethodAddEditScreen.oldProps !== props) {
            ListApiMethodAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { RestMethodListData, SocketMethodListData } = props.AddEditApiMethoddata;

            // Check Socket Method list Data Null or Not 
            if (SocketMethodListData) {
                try {
                    if (state.GetSocketMethodListData == null || (state.GetSocketMethodListData != null && SocketMethodListData !== state.GetSocketMethodListData)) {
                        if (validateResponseNew({ response: SocketMethodListData, isList: true, })) {

                            let res = parseArray(SocketMethodListData.Response);

                            let res1 = []
                            for (var dataApiMethodItem in res) {
                                let item = res[dataApiMethodItem]

                                // item.Email is not empty/undefined
                                if (!isEmpty(item.MethodName)) {
                                    item.value = item.MethodName
                                    res1.push(item)
                                }
                            }

                            let SocketMethodNames = [
                                // { value: R.strings.Please_Select },
                                ...res1
                            ];

                            //Set State For Api response 
                            return Object.assign({}, state, {
                                GetSocketMethodListData: SocketMethodListData,
                                SocketMethod: SocketMethodNames,
                            })
                        } else {
                            return Object.assign({}, state, {
                                GetSocketMethodListData: null,
                                SocketMethod: [{ value: R.strings.Please_Select }],
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        SocketMethod: [{ value: R.strings.Please_Select }]
                    })
                }
            }

            // Check Rest Method list Data Null or Not 
            if (RestMethodListData) {
                try {
                    if (state.GetRestMethodListData == null || (state.GetRestMethodListData != null && RestMethodListData !== state.GetRestMethodListData)) {
                        if (validateResponseNew({ response: RestMethodListData, isList: true, })) {

                            let res = parseArray(RestMethodListData.Response);

                            let res1 = []
                            for (var RestMethodListDataKey in res) {

                                let item = res[RestMethodListDataKey]

                                // item.Email is not empty/undefined
                                if (!isEmpty(item.MethodName)) {
                                    item.value = item.MethodName
                                    res1.push(item)
                                }
                            }

                            let RestMethodNames = [
                                // { value: R.strings.Please_Select },
                                ...res1
                            ];

                            //Set State For Api response 
                            return Object.assign({}, state, {
                                GetRestMethodListData: RestMethodListData,
                                RestMethod: RestMethodNames,
                            })
                        } else {
                            return Object.assign({}, state, {
                                GetRestMethodListData: null,
                                RestMethod: [{ value: R.strings.Please_Select }],
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        RestMethod: [{ value: R.strings.Please_Select }]
                    })
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {
        //Get All Updated field of Particular actions
        const { AddApiMethodData, UpdateApiMethodData } = this.props.AddEditApiMethoddata;

        // check previous props and existing props
        if (AddApiMethodData !== prevProps.AddEditApiMethoddata.AddApiMethodData) {
            if (AddApiMethodData) {
                try {
                    if (validateResponseNew({ response: AddApiMethodData })) {
                        showAlert(R.strings.Success, R.strings.ApiMethodAddedSuccessfully, 0, () => {
                            // Navigate to Api Method List Screen
                            this.props.navigation.state.params.onSuccess()
                            this.props.navigation.goBack()
                        });
                    }
                } catch (e) { }
            }
        }

        // Check resposne of update api method data 
        if (UpdateApiMethodData !== prevProps.AddEditApiMethoddata.UpdateApiMethodData) {
            if (UpdateApiMethodData) {
                try {
                    //If addProvder UpdateApiMethodData is validate than show success dialog else show failure dialog
                    if (validateResponseNew({ response: UpdateApiMethodData })) {
                        showAlert(R.strings.Success, R.strings.ApiMethodUpdateSuccessfully, 0, () => {
                            // Navigate to Api Method List Screen
                            this.props.navigation.state.params.onSuccess()
                            this.props.navigation.goBack()
                        });
                    }
                } catch (e) { }
            }
        }

    }

    //Add Or Update Button Presss
    onPress = async () => {

        //validations for Inputs 
        if (isEmpty(this.state.MethodName)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.methodName)
            return;
        }

        //Check If socket method not update from picker then pass previous screen value
        if (!this.state.isEditSocketMethods && this.state.isEdit) {
            let selectedsocketitem = []
            let EditSocketMethod = this.state.EditSocketMethod
            for (var socketData in EditSocketMethod) {
                let item = EditSocketMethod[socketData]
                let indexOfitem = this.state.SocketMethod.findIndex(el => el.MethodName === item.value);
                if (indexOfitem > -1) {
                    selectedsocketitem.push(this.state.SocketMethod[indexOfitem].ID)
                }
            }
            this.setState({ selectedSocketItems: selectedsocketitem, })
        }

        //Check If rest method not update from picker then pass previous screen value
        if (!this.state.isEditRestMethods && this.state.isEdit) {
            let selectedrestitem = []
            let EditRestMethodArray = this.state.EditRestMethod
            for (var EditRestMethodKey in EditRestMethodArray) {
                let item = EditRestMethodArray[EditRestMethodKey]
                let indexOfitem = this.state.RestMethod.findIndex(el => el.MethodName === item.value);
                if (indexOfitem > -1) {
                    selectedrestitem.push(this.state.RestMethod[indexOfitem].ID)
                }
            }
            this.setState({ selectedRestItems: selectedrestitem, })
        }

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Add / Update api method list
            let request = {
                ID: this.state.Id,
                MethodName: this.state.MethodName,
                IsReadOnly: this.state.APIAccess ? 1 : 0,
                IsFullAccess: this.state.APIAccess ? 0 : 1,
                Status: this.state.Status ? 1 : 0,
                SocketMethods: this.state.selectedSocketItems,
                RestMethods: this.state.selectedRestItems,
            }

            if (this.state.isEdit) {
                //Call Update Api method list method
                this.props.updateApiMethod(request);
            } else {
                //Call Add Api method list method
                this.props.addApiMethod(request);
            }
        }

    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { RestMethodListDataLoading, SocketMethodListDataLoading, AddApiMethodDataLoading, UpdateApiMethodDataLoading } = this.props.AddEditApiMethoddata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.isEdit ? (R.strings.edit + ' ' + R.strings.apiMethod) : (R.strings.add + ' ' + R.strings.apiMethod)}
                    isBack={true}
                    nav={this.props.navigation}

                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={RestMethodListDataLoading || SocketMethodListDataLoading || AddApiMethodDataLoading || UpdateApiMethodDataLoading} />

                {/* For Toast */}
                <CommonToast ref={comp => this.toast = comp} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient={true}
                    isToggle={this.state.Status}
                    title={this.state.Status ? R.strings.Enable : R.strings.Disable}
                    onValueChange={() => {
                        this.setState({
                            Status: !this.state.Status
                        })
                    }}
                />

                <View style={{ flex: 1, justifyContent: 'space-between', }}>
                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{
                            paddingTop: R.dimens.padding_top_bottom_margin,
                            paddingBottom: R.dimens.padding_top_bottom_margin,
                            paddingLeft: R.dimens.activity_margin,
                            paddingRight: R.dimens.activity_margin,
                        }}>

                            {/* To Set Charge Value in EditText */}
                            <EditText
                                reference={input => { this.inputs['etMethodName'] = input; }}
                                header={R.strings.methodName}
                                placeholder={R.strings.methodName}
                                multiline={false}
                                maxLength={20}
                                keyboardType='default'
                                returnKeyType={"done"}
                                editable={this.state.isEdit ? false : true}
                                onChangeText={(MethodName) => this.setState({ MethodName })}
                                value={this.state.MethodName}
                            />

                            {/* To Set Charge Type */}
                            <TextViewMR style={this.styles().radioButtonTitle}>{R.strings.ApiAccess}</TextViewMR>
                            <View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                <RadioButton item={{ title: R.strings.ReadOnly, selected: this.state.APIAccess }} onPress={() => this.setState({ APIAccess: !this.state.APIAccess })} />
                                <RadioButton item={{ title: R.strings.FullAccess, selected: !this.state.APIAccess }} onPress={() => this.setState({ APIAccess: !this.state.APIAccess })} />
                            </View>

                            {/* Multiselection button for recipients */}
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>
                                <MultipleSelectionButton
                                    header={R.strings.SocketMethod}
                                    navigate={this.props.navigation.navigate}
                                    data={this.state.SocketMethod}
                                    selectedItems={(selectedItems) => {
                                        let selectedsocketitem = []
                                        for (var dataSocket in selectedItems) {
                                            let item = selectedItems[dataSocket]
                                            let indexOfitem = this.state.SocketMethod.findIndex(el => el.MethodName === item.value);
                                            if (indexOfitem > -1) {
                                                selectedsocketitem.push(this.state.SocketMethod[indexOfitem].ID)
                                            }
                                        }
                                        this.setState({ selectedSocketItems: selectedsocketitem, isEditSocketMethods: true })
                                    }}
                                    selectedList={this.state.EditSocketMethod}
                                    viewMore={true}
                                    numColumns={3}
                                />
                            </View>

                            {/* Multiselection button for recipients */}
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>
                                <MultipleSelectionButton
                                    header={R.strings.RestMethod}
                                    navigate={this.props.navigation.navigate}
                                    data={this.state.RestMethod}
                                    selectedItems={(selectedItems) => {
                                        let selectedrestitem = []
                                        for (var dataRest in selectedItems) {
                                            let item = selectedItems[dataRest]
                                            let indexOfitem = this.state.RestMethod.findIndex(el => el.MethodName === item.value);
                                            if (indexOfitem > -1) {
                                                selectedrestitem.push(this.state.RestMethod[indexOfitem].ID)
                                            }
                                        }
                                        this.setState({ selectedRestItems: selectedrestitem, isEditRestMethods: true })
                                    }}
                                    selectedList={this.state.EditRestMethod}
                                    viewMore={true}
                                    numColumns={3}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.isEdit ? R.strings.update : R.strings.Add} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            radioButtonTitle: {
                marginLeft: R.dimens.LineHeight,
                fontSize: R.dimens.smallText,
                marginTop: R.dimens.widget_top_bottom_margin,
                color: R.colors.textPrimary
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        //Add Edit Api Method Data
        AddEditApiMethoddata: state.ApiMethodReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //For Get Socket Method List Api
        getSocketMethodData: () => dispatch(getSocketMethodData()),

        //For Get Rest Method List Api
        getSystemResetMethodData: () => dispatch(getSystemResetMethodData()),

        //For Add Api Method List Data
        addApiMethod: (request) => dispatch(addApiMethod(request)),

        //For update Api Method List Data
        updateApiMethod: (request) => dispatch(updateApiMethod(request)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListApiMethodAddEditScreen)