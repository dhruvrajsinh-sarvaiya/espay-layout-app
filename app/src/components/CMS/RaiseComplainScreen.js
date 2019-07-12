import React, { Component } from 'react';
import { View, ScrollView, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, showAlert, parseArray, } from '../../controllers/CommonUtils';
import EditText from '../../native_theme/components/EditText'
import Button from '../../native_theme/components/Button'
import { isEmpty, validateResponseNew, isInternet } from '../../validations/CommonValidation';
import { connect } from 'react-redux';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import CommonToast from '../../native_theme/components/CommonToast';
import { addComplain, clearAddComplainData, getComplaintType } from '../../actions/account/Complain';
import R from '../../native_theme/R';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { TitlePicker } from '../Widget/ComboPickerWidget';
import SafeView from '../../native_theme/components/SafeView';

class RaiseComplainScreen extends Component {
    constructor(props) {
        super(props)
        this.toast = React.createRef();

        //Define All State initial state
        this.state = {
            ComplaintType: [],
            selectType: '',
            ComplainId: 0,
            PriorityType: [
                { value: R.strings.urgent, code: 1 },
                { value: R.strings.high, code: 2 },
                { value: R.strings.medium, code: 3 },
                { value: R.strings.low, code: 4 },
            ],
            selecetdPriority: R.strings.urgent,
            ComplaintPriorityId: 1,
            attachmentSourceName: '',
            Description: '',
            Subject: '',
            isFirstTime: true,
        }
        this.inputs = {}
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check internet connection
        if (await isInternet()) {

            // Complaint Type Api Call 
            this.props.getComplaintType()
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
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
        if (RaiseComplainScreen.oldProps !== props) {
            RaiseComplainScreen.oldProps = props;
        } else {
            return null;
        }

        //check for current screen
        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            let { ComplaintTypeData, } = props.ComplaintResult

            // check for complaint type data is available or not
            if (ComplaintTypeData) {
                if (state.ComplaintTypeData == null || (state.ComplaintTypeData != null && ComplaintTypeData !== state.ComplaintTypeData)) {
                    try {
                        if (validateResponseNew({ response: ComplaintTypeData, isList: true })) {
                            var res = parseArray(ComplaintTypeData.TypeMasterList)
                            res.map((item, index) => {
                                res[index].value = res[index].Type
                            })

                            return { ...state, ComplaintType: res, selectType: res[0].value, ComplainId: res[0].id };
                        } else {
                            return { ...state, ComplaintType: [], selectType: '', ComplainId: 0 };
                        }
                    } catch (error) {
                        return { ...state, ComplaintType: [], selectType: '', ComplainId: 0 };
                    }
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, _prevState) => {
        let { AddComplaintData } = this.props.ComplaintResult;

        //compare response with previous response
        if (AddComplaintData !== prevProps.ComplaintResult.AddComplaintData) {

            //check for data is not null
            if (AddComplaintData != null) {
                try {
                    if (validateResponseNew({ response: AddComplaintData })) {
                        showAlert(R.strings.Success + '!', R.strings.raiseComplainSuccessfully, 0, () => {
                            this.setState({
                                data: this.state.ComplaintType,
                                selectType: '',
                                attachmentSourceName: '',
                                Description: '',
                                Subject: '',
                            })
                            this.props.clearAddComplainData()
                            this.props.navigation.state.params.onRefresh(true)
                            this.props.navigation.goBack()
                        })
                    }
                } catch (e) {

                }
            }
        }
    };

    // on submit complaint call api 
    submitComplain = async () => {
        // Check validation for editText and Picker
        if (this.state.selectType === R.strings.Select_Type || isEmpty(this.state.selectType)) {
            this.toast.Show(R.strings.PleaseSelectType);
            return;
        }
        else if (isEmpty(this.state.Subject)) {
            this.toast.Show(R.strings.subject_validation_text);
            return;
        }
        else if (isEmpty(this.state.Description)) {
            this.toast.Show(R.strings.description_validation_text);
            return;
        }
        else {

            //check for internet connection
            if (await isInternet()) {
                let req = {
                    typeid: this.state.ComplainId == 0 ? '' : this.state.ComplainId,
                    subject: this.state.Subject,
                    description: this.state.Description,
                    ComplaintPriorityId: this.state.ComplaintPriorityId
                }

                // call api for referal code fetch
                this.props.addComplain(req)
            }
        }
    }
    render() {

        let { AddComplaintLoading, ComplaintTypeLoading } = this.props.ComplaintResult
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.Raise_Complain} isBack={true} nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={comp => this.toast = comp} />

                {/* for progress dialog */}
                <ProgressDialog isShow={AddComplaintLoading || ComplaintTypeLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                            {/* picker to select Priority*/}
                            <TitlePicker
                                title={R.strings.priority}
                                array={this.state.PriorityType}
                                selectedValue={this.state.selecetdPriority}
                                onPickerSelect={(item, object) => { this.setState({ selecetdPriority: item, ComplaintPriorityId: object.code }) }}
                            />
                            {/* picker to select type of complain*/}
                            <TitlePicker
                                title={R.strings.Type}
                                array={this.state.ComplaintType}
                                selectedValue={this.state.selectType}
                                onPickerSelect={(item, object) => { this.setState({ selectType: item, ComplainId: object.id }) }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                            />
                            {/* textinput for enter subject and description  */}
                            <EditText
                                header={R.strings.subject}
                                placeholder={R.strings.Enter_Subject}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                multiline={false}
                                maxLength={80}
                                returnKeyType={"next"}
                                onChangeText={(text) => this.setState({ Subject: text })}
                                value={this.state.Subject}
                                reference={input => { this.inputs['etSubject'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('etDescription') }}
                            />
                            <EditText
                                header={R.strings.description}
                                placeholder={R.strings.Description_blank}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                multiline={true}
                                textAlignVertical='top'
                                numberOfLines={4}
                                blurOnSubmit={true}
                                maxLength={260}
                                returnKeyType={"done"}
                                onChangeText={(text) => this.setState({ Description: text })}
                                value={this.state.Description}
                                reference={input => { this.inputs['etDescription'] = input; }}
                            />
                            <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, marginTop: R.dimens.widgetMargin, color: R.colors.failRed, fontSize: R.dimens.smallestText }}>{'* ' + R.strings.requestDetailsMessage}</TextViewHML>
                        </View>
                    </ScrollView>
                </View>

                {/* for submit button */}
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                    <Button title={R.strings.submit} onPress={this.submitComplain} />
                </View>
            </SafeView>
        );
    }
}
function mapStateToProps(state) {
    return {
        // Updated state of Complain
        ComplaintResult: state.complainReducer,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        // To perform action for Add Complain
        addComplain: (payload) => dispatch(addComplain(payload)),
        // To perform action for get Complain Type
        getComplaintType: () => dispatch(getComplaintType()),
        // To perform action for clear Complain Type
        clearAddComplainData: () => dispatch(clearAddComplainData()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RaiseComplainScreen)