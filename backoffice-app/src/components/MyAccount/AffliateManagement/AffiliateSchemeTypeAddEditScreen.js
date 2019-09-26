// AffiliateSchemeTypeAddEditScreen.js
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
import { addAffiliateSchemeType, affiliateSchemeTypeListClear, editAffiliateSchemeType } from '../../../actions/account/AffiliateSchemeTypeAction';
import SafeView from '../../../native_theme/components/SafeView';

class AffiliateSchemeTypeAddEditScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        var Status = R.strings.Delete
        var code = 9
        if (edit) {

            if (item.Status == 0) {
                Status = R.strings.inActive
                code = 0
            }
            else if (item.Status == 1) {
                code = 1
                Status = R.strings.active
            }
        }

        //Define All State initial state
        this.state = {
            item: item,
            edit: edit,

            status: !edit ?
                [
                    { value: R.strings.Please_Select, code: '99' },
                    { value: R.strings.active, code: '1' },
                    { value: R.strings.inActive, code: '0' },
                ] :
                [
                    { value: R.strings.Please_Select, code: '99' },
                    { value: R.strings.active, code: '1' },
                    { value: R.strings.inActive, code: '0' },
                    { value: R.strings.Delete, code: '9' }
                ],

            selectedStatus: edit ? Status : R.strings.Please_Select,
            selectedStatusId: edit ? code : 99,
            SchemeTypeName: edit ? item.SchemeTypeName : '',
            Description: edit ? item.Description : '',
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addSchemeTypeData, editSchemeTypeData } = this.props;

        if (addSchemeTypeData !== prevProps.addSchemeTypeData) {
            // for show responce add
            if (addSchemeTypeData) {
                try {
                    if (validateResponseNew({
                        response: addSchemeTypeData,
                    })) {
                        showAlert(R.strings.Success, addSchemeTypeData.ReturnMsg, 0, () => {
                            this.props.affiliateSchemeTypeListClear()
                            if (this.props.navigation.state.params !== undefined) {
                                this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                                this.props.navigation.goBack()
                            }
                            else {
                                this.props.navigation.goBack()
                            }
                        });
                    } else {
                        this.props.affiliateSchemeTypeListClear()
                    }
                } catch (e) {
                    this.props.affiliateSchemeTypeListClear()
                }
            }
        }

        if (editSchemeTypeData !== prevProps.editSchemeTypeData) {
            // for show responce update
            if (editSchemeTypeData) {
                try {
                    if (validateResponseNew({
                        response: editSchemeTypeData
                    })) {
                        showAlert(R.strings.Success, editSchemeTypeData.ReturnMsg, 0, () => {
                            this.props.affiliateSchemeTypeListClear()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.affiliateSchemeTypeListClear()
                    }
                } catch (e) {
                    this.props.affiliateSchemeTypeListClear()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onAddEditSchemeType = async (Id) => {

        //Input validations
        if (isEmpty(this.state.SchemeTypeName)) {
            this.toast.Show(R.strings.enter + " " + R.strings.schemeTypeName)
            return;
        }

        if (isEmpty(this.state.Description)) {
            this.toast.Show(R.strings.enter + " " + R.strings.description)
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
                SchemeTypeName: this.state.SchemeTypeName,
                Description: this.state.Description,
                Status: parseIntVal(this.state.status[this.state.status.findIndex(el => el.value === this.state.selectedStatus)].code),
            }

            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    SchemeTypeId: this.state.item.SchemeTypeId,
                }

                //call editAffiliateSchemeType api
                this.props.editAffiliateSchemeType(this.request)
            }
            else {

                //call addAffiliateSchemeType api
                this.props.addAffiliateSchemeType(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        const { isAddSchemeTypeFetch, isEditSchemeTypeFetch } = this.props;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.editAffiliateSchemeType : R.strings.addAffiliateSchemeType}
                    isBack={true}
                    nav={this.props.navigation}

                />
                {/* Progress Dialog */}
                <ProgressDialog isShow={isAddSchemeTypeFetch || isEditSchemeTypeFetch} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    paddingRight: R.dimens.activity_margin,
                    paddingLeft: R.dimens.activity_margin,
                    flex: 1, justifyContent: 'space-between',
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* EditText for schemeTypeName */}
                            <EditText
                                isRequired={true}
                                header={R.strings.schemeTypeName}
                                placeholder={R.strings.schemeTypeName}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation }}
                                onChangeText={(text) => this.setState({ SchemeTypeName: text })}
                                value={this.state.SchemeTypeName}
                                keyboardType={'default'}
                                maxLength={100}
                                onSubmitEditing={() => { this.focusNextField('etDescription') }}
                                returnKeyType={"next"}
                            />

                            {/* EditText for description */}
                            <EditText
                                style={{ marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation }}
                                isRequired={true}
                                header={R.strings.description}
                                placeholder={R.strings.description}
                                onChangeText={(text) => this.setState({ Description: text })}
                                value={this.state.Description}
                                maxLength={300}
                                multiline={true}
                                numberOfLines={4}
                                blurOnSubmit={true}
                                textAlignVertical={'top'}
                                reference={input => { this.inputs['etDescription'] = input; }}
                                returnKeyType={"done"}
                            />

                            {/* dropdown for status */}
                            <TitlePicker
                                style={{
                                    marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation,
                                    marginBottom: R.dimens.widget_top_bottom_margin
                                }}
                                isRequired={true}
                                pickerStyle={{
                                    margin: R.dimens.CardViewElivation,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    elevation: R.dimens.CardViewElivation,
                                    marginTop: R.dimens.widgetMargin,
                                    borderWidth: 0,
                                }}
                                title={R.strings.Status} selectedValue={this.state.selectedStatus}
                                array={this.state.status}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusId: object.id })} />
                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditSchemeType(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {

    //Updated AffiliateSchemeTypeReducer Data 
    return {
        isAddSchemeTypeFetch: state.AffiliateSchemeTypeReducer.isAddSchemeTypeFetch,
        addSchemeTypeData: state.AffiliateSchemeTypeReducer.addSchemeTypeData,
        addSchemeTypeDataFetch: state.AffiliateSchemeTypeReducer.addSchemeTypeDataFetch,

        isEditSchemeTypeFetch: state.AffiliateSchemeTypeReducer.isEditSchemeTypeFetch,
        editSchemeTypeData: state.AffiliateSchemeTypeReducer.editSchemeTypeData,
        editSchemeTypeDataFetch: state.AffiliateSchemeTypeReducer.editSchemeTypeDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //perform action for addAffiliateSchemeType api data
        addAffiliateSchemeType: (add) => dispatch(addAffiliateSchemeType(add)),
        //perform action for editAffiliateSchemeType api data
        editAffiliateSchemeType: (edit) => dispatch(editAffiliateSchemeType(edit)),
        //perform action for add edit data clear
        affiliateSchemeTypeListClear: () => dispatch(affiliateSchemeTypeListClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateSchemeTypeAddEditScreen)