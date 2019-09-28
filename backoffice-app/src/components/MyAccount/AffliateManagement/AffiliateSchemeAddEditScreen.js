import {
    View,
    ScrollView,
    Keyboard,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { showAlert, changeTheme, parseIntVal, } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { addAffiliateScheme, clearAffiliateScheme, editAffiliateScheme } from '../../../actions/account/AffiliateSchemeAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Transaction policy 
class AffiliateSchemeAddEditScreen extends Component {

    constructor(props) {
        super(props);

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        var code = 9
        var Status = R.strings.Delete
        if (edit) {
            if (item.Status === 0) {
                code = 0
                Status = R.strings.inActive
            } else if (item.Status === 1) {
                code = 1
                Status = R.strings.active
            }
        }

        // create reference
        this.inputs = {};
        this.toast = React.createRef();

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            
            status: edit ?
                [
                    { value: R.strings.Please_Select, code: '99' },
                    { value: R.strings.active, code: '1' },
                    { value: R.strings.Delete, code: '9' },
                    { value: R.strings.inActive, code: '0' },
                ] :
                [
                    { value: R.strings.Please_Select, code: '99' },
                    { value: R.strings.inActive, code: '0' },
                    { value: R.strings.active, code: '1' },
                ],

            selectedStatus: edit ? Status : R.strings.Please_Select,
            selectedStatusId: edit ? code : 99,

            schemeName: edit ? item.SchemeName : '',
            schemeType: edit ? item.SchemeType : '',
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addData, editData, } = this.props.Listdata;

        if (addData !== prevProps.Listdata.addData) {
            // for show responce add
            if (addData) {
                try {
                    if (validateResponseNew({
                        response: addData,
                    })) {
                        showAlert(R.strings.Success, addData.ReturnMsg, 0, () => {
                            this.props.clearAffiliateScheme()
                            if (this.props.navigation.state.params !== undefined) {
                                this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                                this.props.navigation.goBack()
                            }
                            else {
                                this.props.navigation.goBack()
                            }
                        });
                    } else {
                        this.props.clearAffiliateScheme()
                    }
                } catch (e) {
                    this.props.clearAffiliateScheme()
                }
            }
        }

        if (editData !== prevProps.Listdata.editData) {
            // for show responce update
            if (editData) {
                try {
                    if (validateResponseNew({
                        response: editData
                    })) {
                        showAlert(R.strings.Success, editData.ReturnMsg, 0, () => {
                            this.props.clearAffiliateScheme()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearAffiliateScheme()
                    }
                } catch (e) {
                    this.props.clearAffiliateScheme()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onAddEditScheme = async (Id) => {

        //input validations
        if (isEmpty(this.state.schemeName)) {
            this.toast.Show(R.strings.enter + " " + R.strings.schemeName)
            return;
        }
        if (isEmpty(this.state.schemeType)) {
            this.toast.Show(R.strings.enter + " " + R.strings.scheme + ' ' + R.strings.type)
            return;
        }
        if ((this.state.selectedStatusId === 99)) {
            this.toast.Show(R.strings.Please_Select + " " + R.strings.status)
            return;
        }

        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                SchemeName: this.state.schemeName,
                SchemeType: this.state.schemeType,
                Status: parseIntVal(this.state.status[this.state.status.findIndex(el => el.value === this.state.selectedStatus)].code),
            }

            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    SchemeMasterId: this.state.item.SchemeMasterId,
                }

                //call editAffiliateScheme api
                this.props.editAffiliateScheme(this.request)
            }
            else {

                //call addAffiliateScheme api
                this.props.addAffiliateScheme(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        const { addLoading, editLoading } = this.props.Listdata;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateAffiliateScheme : R.strings.addAffliateScheme}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addLoading || editLoading} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* EditText for schemeName */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation }}
                                isRequired={true}
                                header={R.strings.schemeName}
                                placeholder={R.strings.schemeName}
                                onChangeText={(text) => this.setState({ schemeName: text })}
                                value={this.state.schemeName}
                                keyboardType={'default'}
                                maxLength={100}
                                onSubmitEditing={() => { this.focusNextField('etSchemeType') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for schemeType */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation }}
                                isRequired={true}
                                header={R.strings.scheme_type}
                                placeholder={R.strings.scheme_type}
                                onChangeText={(text) => this.setState({ schemeType: text })}
                                value={this.state.schemeType}
                                keyboardType={'default'}
                                maxLength={100}
                                reference={input => { this.inputs['etSchemeType'] = input; }}
                                returnKeyType={"done"}
                            />

                            {/* dropdown for status */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation, marginBottom: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                                pickerStyle={{
                                    borderWidth: 0,
                                    justifyContent: 'center',
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    borderRadius: R.dimens.cardBorderRadius,
                                    marginTop: R.dimens.widgetMargin,
                                    elevation: R.dimens.CardViewElivation,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                selectedValue={this.state.selectedStatus}
                                title={R.strings.Status} array={this.state.status}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusId: object.id })} />
                        </ScrollView>
                    </View>
                    <View style={{  paddingTop: R.dimens.widget_top_bottom_margin, paddingBottom: R.dimens.widget_top_bottom_margin, }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditScheme(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data 
        Listdata: state.AffiliateSchemeReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform addAffiliateScheme action
        addAffiliateScheme: (add) => dispatch(addAffiliateScheme(add)),
        //Perform editAffiliateScheme action
        editAffiliateScheme: (edit) => dispatch(editAffiliateScheme(edit)),
        //Perform clearAffiliateScheme action
        clearAffiliateScheme: () => dispatch(clearAffiliateScheme()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AffiliateSchemeAddEditScreen)












