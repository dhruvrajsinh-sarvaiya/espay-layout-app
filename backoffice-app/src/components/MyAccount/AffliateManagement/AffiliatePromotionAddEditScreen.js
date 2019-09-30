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
import { addAffiliatePromotion, editAffiliatePromotion, clearAffiliatePromotion } from '../../../actions/account/AffiliatePromotionAction';
import SafeView from '../../../native_theme/components/SafeView';

//commmon screen for affliate Promotion add and update based on condtion edit(bit)
class AffiliatePromotionAddEditScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //for the focus of textinputs
        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        var Status = R.strings.Delete
        var code = 9
        if (edit) {
            if (item.Status === 0) {
                Status = R.strings.inActive
                code = 0
            }
            else if (item.Status === 1) {
                Status = R.strings.active
                code = 1
            }
        }

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,

            status: edit ?
                [
                    { value: R.strings.Please_Select, code: '99' },
                    { value: R.strings.inActive, code: '0' },
                    { value: R.strings.active, code: '1' },
                    { value: R.strings.Delete, code: '9' }
                ] :
                [
                    { value: R.strings.Please_Select, code: '99' },
                    { value: R.strings.active, code: '1' },
                    { value: R.strings.inActive, code: '0' },
                ],

            selectedStatus: edit ? Status : R.strings.Please_Select,
            selectedStatusId: edit ? code : 99,

            promotionType: edit ? item.PromotionType : '',
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
                            this.props.clearAffiliatePromotion()
                            if (this.props.navigation.state.params !== undefined) {
                                this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                                this.props.navigation.goBack()
                            }
                            else {
                                this.props.navigation.goBack()
                            }
                        });
                    } else {
                        this.props.clearAffiliatePromotion()
                    }
                } catch (e) {
                    this.props.clearAffiliatePromotion()
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
                            this.props.clearAffiliatePromotion()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearAffiliatePromotion()
                    }
                } catch (e) {
                    this.props.clearAffiliatePromotion()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onAddPromotion = async (Id) => {

        //input validations
        if (isEmpty(this.state.promotionType)) {
            this.toast.Show(R.strings.enter + " " + R.strings.schemeName)
            return;
        }

        if ((this.state.selectedStatusId === 99)) {
            this.toast.Show(R.strings.Please_Select + " " + R.strings.status)
            return;
        }

        if (this.state.edit) {
            if ((this.state.promotionType === this.state.item.PromotionType && this.state.selectedStatusId === this.state.item.Status)) {
                this.toast.Show(R.strings.update_info_validate)
                return;
            }
        }

        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                PromotionType: this.state.promotionType,
                Status: parseIntVal(this.state.status[this.state.status.findIndex(el => el.value === this.state.selectedStatus)].code),
            }

            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    PromotionId: this.state.item.PromotionId,
                }

                //call editAffiliatePromotion api
                this.props.editAffiliatePromotion(this.request)
            }
            else {

                //call addAffiliatePromotion api
                this.props.addAffiliatePromotion(this.request)
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
                    title={this.state.edit ? (R.strings.update + ' ' + R.strings.affliatePromotion) : (R.strings.add + ' ' + R.strings.affliatePromotion)}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addLoading || editLoading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    paddingLeft: R.dimens.activity_margin,
                    flex: 1, justifyContent: 'space-between',
                    paddingRight: R.dimens.activity_margin,
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* EditText for promotionType */}
                            <EditText
                                header={R.strings.promotionType}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin + R.dimens.CardViewElivation }}
                                isRequired={true}
                                placeholder={R.strings.promotionType}
                                onChangeText={(text) => this.setState({ promotionType: text })}
                                value={this.state.promotionType}
                                keyboardType={'default'}
                                maxLength={100}
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
                                    marginTop: R.dimens.widgetMargin,
                                    justifyContent: 'center',
                                    borderRadius: R.dimens.cardBorderRadius,
                                    height: R.dimens.ButtonHeight,
                                    backgroundColor: R.colors.background,
                                    elevation: R.dimens.CardViewElivation,
                                    borderWidth: 0,
                                    margin: R.dimens.CardViewElivation,
                                }}
                                selectedValue={this.state.selectedStatus}
                                title={R.strings.Status}
                                array={this.state.status}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, selectedStatusId: object.id })} />
                        </ScrollView>
                    </View>
                    <View style={{  paddingTop: R.dimens.widget_top_bottom_margin, paddingBottom: R.dimens.widget_top_bottom_margin, }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddPromotion(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated AffiliatePromotionReducer Data 
        Listdata: state.AffiliatePromotionReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform addAffiliatePromotion action
        addAffiliatePromotion: (add) => dispatch(addAffiliatePromotion(add)),
        //Perform editAffiliatePromotion action
        editAffiliatePromotion: (edit) => dispatch(editAffiliatePromotion(edit)),
        //Perform clearAffiliatePromotion action
        clearAffiliatePromotion: () => dispatch(clearAffiliatePromotion()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AffiliatePromotionAddEditScreen)












