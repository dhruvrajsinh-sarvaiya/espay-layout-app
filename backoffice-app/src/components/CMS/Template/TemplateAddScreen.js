import React, { Component } from 'react';
import { ScrollView, YellowBox, View } from 'react-native';
import { connect } from 'react-redux';
import { addNewEmailTemplate, getListTemplates, updateEmailTemplate, clearAddUpdate, getEmailTemplates } from '../../../actions/CMS/EmailTemplatesActions'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText'
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
import { isEmpty, isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { showAlert } from '../../../controllers/CommonUtils';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import { TitlePicker } from '../../widget/ComboPickerWidget';

class TemplateAddScreen extends Component {

    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();

        let item = props.navigation.state.params && props.navigation.state.params.ITEM;

        this.headerText = item == undefined ? R.strings.add_template : R.strings.edit_template;
        this.buttonText = item == undefined ? R.strings.submit : R.strings.update;

        //for focus on next field
        this.inputs = {};

        this.state = {

            SpinnerTemplateTypeData: [{ value: R.strings.select + ' ' + R.strings.template_type }, { value: R.strings.Email, type: 1 }, { value: R.strings.sms, type: 1 }],
            selectedTemplateType: item == undefined ? R.strings.select + ' ' + R.strings.template_type : item.CommServiceType,

            SpinnerTemplateNameData: [],
            selectedTemplateName: item == undefined ? R.strings.select + ' ' + R.strings.template_name : item.TemplateName,

            SpinnerStatusData: [{ value: R.strings.select_status }, { value: R.strings.active }, { value: R.strings.inActive }],
            selectedStatus: item == undefined ? R.strings.select_status : (item.IsOnOff == 1 ? R.strings.active : R.strings.inActive),

            subject: item == undefined ? '' : item.AdditionalInfo,
            content: item == undefined ? '' : item.Content,

            updateId: item == undefined ? '' : item.ID,

            TemplateID: item == undefined ? '' : item.TemplateID,

            isFromUpdate: item === undefined ? false : true,

            isFirstTime: true,
        }

        // bind all methods
        this.focusNextField = this.focusNextField.bind(this);

    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //this.props.getListTemplates();
            this.props.getEmailTemplates();
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        let { data, updateTemplateData } = this.props.appData

        if (data !== prevProps.data) {
            if (data != null) {
                try {
                    if (validateResponseNew({ response: data })) {
                        showAlert(R.strings.status, data.ReturnMsg, 0, () => {
                            //clear add data
                            this.props.clearAddUpdate()
                            //----

                            //refresh previous screen list
                            this.props.navigation.state.params.onRefresh(true)
                            //----

                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        })
                    }

                }
                catch (e) {

                }
            }
        }
        if (updateTemplateData !== prevProps.updateTemplateData) {
            if (updateTemplateData != null) {
                try {
                    if (validateResponseNew({ response: updateTemplateData, returnCode: updateTemplateData.ReturnCode, returnMessage: updateTemplateData.ReturnMsg, statusCode: updateTemplateData.statusCode })) {
                        showAlert(R.strings.status, updateTemplateData.ReturnMsg, 0, () => {
                            //clear add data
                            this.props.clearAddUpdate()
                            //----

                            //refresh previous screen list
                            this.props.navigation.state.params.onRefresh(true)
                            //----

                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        })
                    }
                }
                catch (e) {
                }
            }
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
        if (TemplateAddScreen.oldProps !== props) {
            TemplateAddScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            let { templates_list } = props.appData


            /* if (templates_listing) {
                try {
                    if (this.state.templates_listing == null || (this.state.templates_listing != null && templates_listing !== this.state.templates_listing)) {
                        this.setState({ templates_listing })
                        if (validateResponseNew({ response: templates_listing, isList: false })) {
 
                            //for spinner response
                            let data = parseArray(templates_listing.Result)
                            data.map((item, index) => {
                                data[index].value = data[index].Key
                            })
                            var res = [{ value: R.strings.select + ' ' + R.strings.template_name }, ...data]
                            this.setState({ SpinnerTemplateNameData: res })
                        }
                    }
                }
                catch (e) {
                }
            } */
            // for get templatelist data 
            if (templates_list != null) {
                try {
                    // this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
                    if (state.templates_list == null || (state.templates_list != null && templates_list !== state.templates_list)) {
                        if (validateResponseNew({ response: templates_list, returnCode: templates_list.ReturnCode, returnMessage: templates_list.ReturnMsg, statusCode: templates_list.statusCode, isList: true })) {
                            let data = parseArray(templates_list.Template)
                            data.map((item, index) => {
                                data[index].value = data[index].Key
                            })
                            var res = [{ value: R.strings.select + ' ' + R.strings.template_name }, ...data]
                            return { SpinnerTemplateNameData: res, templates_list }
                        }
                        else {
                            return { refreshing: false, data: [], templates_list }
                        }
                    }
                } catch (e) { }
            }

        }
        return null;
    }

    onPressSubmit = async () => {
        //check for validations
        if (isEmpty(this.state.selectedTemplateType) || this.state.selectedTemplateType === R.strings.select + ' ' + R.strings.template_type) {
            this.toast.Show(R.strings.select + ' ' + R.strings.template_type);
        }
        else if (isEmpty(this.state.selectedTemplateName) || this.state.selectedTemplateName === R.strings.select + ' ' + R.strings.template_name) {
            this.toast.Show(R.strings.select + ' ' + R.strings.template_name);
        }
        else if (isEmpty(this.state.subject)) {
            this.toast.Show(R.strings.Enter_Subject);
        }
        else if (isEmpty(this.state.content)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.content);
        }
        else if (isEmpty(this.state.selectedStatus) || this.state.selectedStatus === R.strings.select_status) {
            this.toast.Show(R.strings.select_status);
        }
        else {
            if (this.state.isFromUpdate) {
                let request = {
                    //static ID = 0 = Add new template
                    ID: this.state.updateId,
                    //service type id 1 = SMS and 0 = Email
                    TemplateID: this.state.TemplateID === '' ? 0 : this.state.TemplateID,
                    CommServiceTypeID: this.state.selectedTemplateType === R.strings.sms ? 1 : 0,
                    templateName: this.state.selectedTemplateName,
                    Content: this.state.content,
                    AdditionalInfo: this.state.subject,
                    //IsOnOff: this.state.selectedStatus === R.strings.active ? 1 : 0,
                }
                // call API  for update templates
                this.props.updateEmailTemplate(request);

            } else {
                //Check NetWork is Available or not
                if (await isInternet()) {
                    let request = {
                        //static ID = 0 = Add new template
                        ID: 0,
                        //service type id 1 = SMS and 0 = Email
                        TemplateID: this.state.TemplateID === '' ? 0 : this.state.TemplateID,
                        CommServiceTypeID: this.state.selectedTemplateType === R.strings.sms ? 1 : 0,
                        templateName: this.state.selectedTemplateName,
                        Content: this.state.content,
                        AdditionalInfo: this.state.subject,
                        //IsOnOff: this.state.selectedStatus === R.strings.active ? 1 : 0,
                    }
                    // call API  for Adding templates
                    this.props.addNewEmailTemplate(request);
                }

            }
        }
    }
    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }
    //---
    render() {

        let { loading } = this.props.appData

        return (
            <SafeView style={this.styles().container}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.headerText}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progressbar */}
                <ProgressDialog isShow={loading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Picker for Template Type */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.template_type}
                                array={this.state.SpinnerTemplateTypeData}
                                selectedValue={this.state.selectedTemplateType}
                                onPickerSelect={(item) => this.setState({ selectedTemplateType: item, })} />

                            {/* Picker for Template Name */}
                            <TitlePicker
                                isRequired={true}
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.template_name}
                                array={this.state.SpinnerTemplateNameData}
                                selectedValue={this.state.selectedTemplateName}
                                onPickerSelect={(item) => this.setState({ selectedTemplateName: item, })} />

                            {/* Set Subject value in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etSubject'] = input; }}
                                value={this.state.subject}
                                header={R.strings.subject}
                                placeholder={R.strings.subject}
                                blurOnSubmit={false}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(subject) => this.setState({ subject })}
                                onSubmitEditing={() => { this.focusNextField('etContent') }}
                            />

                            {/* Set Content value in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etContent'] = input; }}
                                value={this.state.content}
                                header={R.strings.content}
                                placeholder={R.strings.content}
                                multiline={true}
                                numberOfLines={3}
                                textAlignVertical={'top'}
                                blurOnSubmit={true}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(content) => this.setState({ content })}
                            //onSubmitEditing={() => { this.focusNextField('etContent') }}
                            />

                            {/* Picker for On/Off Status */}
                            <TitlePicker
                                isRequired={true}
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.is_on_off}
                                array={this.state.SpinnerStatusData}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item) => this.setState({ selectedStatus: item, })} />

                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={this.buttonText}
                            onPress={this.onPressSubmit} />
                    </View>
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background
            },
        }
    }
}


function mapStateToProps(state) {
    return {
        appData: state.TemplateReducer,
    }

}

function mapDispatchToProps(dispatch) {
    return {
        addNewEmailTemplate: (request) => dispatch(addNewEmailTemplate(request)),
        updateEmailTemplate: (request) => dispatch(updateEmailTemplate(request)),
        clearAddUpdate: () => dispatch(clearAddUpdate()),
        getListTemplates: () => dispatch(getListTemplates()),
        getEmailTemplates: () => dispatch(getEmailTemplates()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TemplateAddScreen)
