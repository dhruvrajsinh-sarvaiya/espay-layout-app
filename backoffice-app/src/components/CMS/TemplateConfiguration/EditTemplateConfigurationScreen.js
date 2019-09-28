// EditTemplateConfigurationScreen.js
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
import { isInternet, validateResponseNew, isEmpty, } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getTemplateCategoryType, updateTemplateConfiguration, clearTemplateConfigurationList } from '../../../actions/CMS/TemplateConfigurationAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Edit
class EditTemplateConfigurationScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,

            templateType: item.Value != null ? item.Value : '',
            id: item.Key,

            TemplateName: [],
            selectedTemplateName: item.Value != null ? item.Value : R.strings.Please_Select,
            templateId: item.Key,

            status: [{ value: R.strings.Active }, { value: R.strings.Inactive }],
            selectedStatus: edit ? item.IsOnOff == 1 ? R.strings.Active : R.strings.Inactive : R.strings.Inactive,

            isFirstTime: true,
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            // for call template category by id api
            this.props.getTemplateCategoryType({ id: this.state.id })
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (EditTemplateConfigurationScreen.oldProps !== props) {
            EditTemplateConfigurationScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { TemplateCategoryList } = props.TemplateConfigResult

            // TemplateCategoryList is not null
            if (TemplateCategoryList) {
                try {
                    //if local TemplateCategoryList state is null or its not null and also different then new response then and only then validate response.
                    if (state.TemplateCategoryListState == null || (TemplateCategoryList !== state.TemplateCategoryListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: TemplateCategoryList, isList: true })) {
                            let res = parseArray(TemplateCategoryList.TemplateMasterObj);

                            // for get template name from response
                            res.map((item, index) => {
                                res[index].value = item.TemplateName;
                            })

                            let TemplateNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, TemplateCategoryListState: TemplateCategoryList, TemplateName: TemplateNames };
                        } else {
                            return { ...state, TemplateCategoryListState: TemplateCategoryList, TemplateName: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, TemplateName: [{ value: R.strings.Please_Select }] };
                }
            }

        }
        return null;
    }


    componentDidUpdate = async (prevProps, prevState) => {
        // for update Template Configuration

        const { UpdatedTemplateData } = this.props.TemplateConfigResult;

        if (UpdatedTemplateData !== prevProps.TemplateConfigResult.UpdatedTemplateData) {
            // for show responce update
            if (UpdatedTemplateData) {
                try {
                    if (validateResponseNew({
                        response: UpdatedTemplateData
                    })) {
                        showAlert(R.strings.Success, UpdatedTemplateData.ReturnMsg, 0, () => {
                            this.props.clearTemplateConfigurationList()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearTemplateConfigurationList()
                    }
                } catch (e) {
                    this.props.clearTemplateConfigurationList()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async () => {

        // for check validation for empty value and valid url
        if (this.state.selectedTemplateName === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectTemplateName)
            return;
        }
        else {

            //Check NetWork is Available or notF
            if (await isInternet()) {

                let request = {
                    TemplateType: this.state.id,
                    TemplateID: isEmpty(this.state.templateId) ? 0 : this.state.templateId,
                    Status: this.state.selectedStatus === R.strings.Active ? 1 : 0
                }
                //call Update Template Configuration api
                this.props.updateTemplateConfiguration(request)
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    render() {

        const { TemplateCategoryLoading, updatedTemplateDataLoading } = this.props.TemplateConfigResult;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.editTemplatesConfiguration}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={TemplateCategoryLoading || updatedTemplateDataLoading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.widget_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            <EditText
                                header={R.strings.templateType}
                                placeholder={R.strings.templateType}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                editable={false}
                                value={this.state.templateType}
                            />

                            <TitlePicker
                                title={R.strings.templateName}
                                isRequired={true}
                                array={this.state.TemplateName}
                                selectedValue={this.state.selectedTemplateName}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                onPickerSelect={(index, object) => this.setState({ selectedTemplateName: index, templateId: object.TemplateID })} />

                            <TitlePicker
                                isRequired={true}
                                title={R.strings.isOnOff}
                                array={this.state.status}
                                selectedValue={this.state.selectedStatus}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin, }}
                                onPickerSelect={(index) => this.setState({ selectedStatus: index, })} />

                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Edit Button */}
                        <Button title={R.strings.update} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // get Template Configuration data from reducer
        TemplateConfigResult: state.TemplateConfigurationReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({

    // get template category type Action
    getTemplateCategoryType: (request) => dispatch(getTemplateCategoryType(request)),

    // Update Template Configuration Action
    updateTemplateConfiguration: (request) => dispatch(updateTemplateConfiguration(request)),

    // clear data
    clearTemplateConfigurationList: () => dispatch(clearTemplateConfigurationList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplateConfigurationScreen)