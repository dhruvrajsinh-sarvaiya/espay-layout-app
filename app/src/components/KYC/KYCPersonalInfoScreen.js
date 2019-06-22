import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, } from 'react-native';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import EditText from '../../native_theme/components/EditText';
import Button from '../../native_theme/components/Button';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { changeTheme, getDeviceID, showAlert, sendEvent } from '../../controllers/CommonUtils';
import CommonToast from '../../native_theme/components/CommonToast';
import { personalVerification } from '../../actions/KYC/KycAction';
import { connect } from 'react-redux';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import { ServiceUtilConstant, Events } from '../../controllers/Constants';
import ImagePicker from 'react-native-image-picker';
import Separator from '../../native_theme/components/Separator';
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import { TitlePicker } from '../Widget/ComboPickerWidget';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class KYCPersonalInfoScreen extends Component {
    constructor(props) {
        super(props);

        this.progressDialog = null;

        //Define All initial State
        this.state = {
            surname: '',
            name: '',
            front: {
                name: '',
            },
            back: {
                name: '',
            },
            selfie: {
                name: '',
            },
            identityCardItems: [{ value: R.strings.Select_IdentityCard }, { value: R.strings.ElectricityBill }, { value: R.strings.DrivingLicence }, { value: R.strings.AadhaarCard }],
            selectedIdentityCard: R.strings.Select_IdentityCard,
        };

        this.inputs = {};

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    //on Submit Button Press
    onSubmit = async () => {
        //Validations For Inputs
        if (isEmpty(this.state.surname)) {
            this.refs.Toast.Show(R.strings.enter_surname);
        } else if (isEmpty(this.state.name)) {
            this.refs.Toast.Show(R.strings.enter_name)
        } else if (isEmpty(this.state.selectedIdentityCard) || this.state.selectedIdentityCard === R.strings.Select_IdentityCard) {
            this.refs.Toast.Show(R.strings.Select_IdentityCard);
        } else if (isEmpty(this.state.front.name)) {
            this.refs.Toast.Show(R.strings.cardfrontside)
        } else if (isEmpty(this.state.back.name)) {
            this.refs.Toast.Show(R.strings.cardbackside)
        } else if (isEmpty(this.state.selfie.name)) {
            this.refs.Toast.Show(R.strings.photoid_note)
        } else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                try {
                    //Bind Request For Personal KYC
                    let reqKYC = {
                        Surname: this.state.surname,
                        GivenName: this.state.name,
                        ValidIdentityCard: this.state.selectedIdentityCard,
                        Front: this.state.front,
                        Back: this.state.back,
                        Selfie: this.state.selfie,
                        deviceId: await getDeviceID(),
                        mode: ServiceUtilConstant.Mode,
                        hostName: ServiceUtilConstant.hostName
                        //Note : ipAddress parameter is passed in its saga.
                    }
                    //call Personal KYC API
                    this.props.personalVerification(reqKYC);
                } catch (error) {
                    this.progressDialog.dismiss();
                    showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
                }
            }
        }
    }

    showImagePicker = (stateName) => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else {
                //if uri is not null then proceed further
                if (response.uri != null) {
                    let imageTypes = ['image/jpeg', 'image/png']
                    // check user selected file type is jpg or png
                    if (imageTypes.includes(response.type)) {
                        //store all data in state
                        this.setState({
                            [stateName]: {
                                ...this.state[stateName],
                                uri: response.uri,
                                type: response.type,
                                name: response.fileName,
                                data: response.data
                            },
                        });
                    } else {
                        //To Display Toast using Reference
                        this.refs.Toast.Show(R.strings.file_validation);
                        //store empty name for given state
                        this.setState({
                            [stateName]: {
                                ...this.state[stateName],
                                name: ''
                            },
                        });
                    }
                }
            }
        })
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        //Get All Updated Feild of Particular actions
        const { data, dataFetch } = this.props;

        if (data !== prevProps.data) {
            //To Check Limit Control Api Data Fetch or Not
            if (!dataFetch) {
                try {
                    //Validate API and display message
                    if (validateResponseNew({ response: data })) {
                        showAlert(R.strings.Success + '!', data.ReturnMsg, 0, () => {
                            //To move to dashboard
                            sendEvent(Events.MoveToMainScreen, 0);
                            this.props.navigation.navigate('MainScreen')
                        });
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props;
        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.kyc_personal_actionbar_title} isBack={true} nav={this.props.navigation} />

                {/* Toast */}
                <CommonToast ref="Toast" />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={loading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                            {/* Text for Verification Notice */}
                            <TextViewMR style={this.styles().verificationstr}>{R.strings.verification_string}</TextViewMR>

                            {/* EditText for Surname */}
                            <EditText
                                reference={input => { this.inputs['etSurname'] = input; }}
                                header={R.strings.surname}
                                placeholder={R.strings.surname}
                                multiline={false}
                                returnKeyType={"next"}
                                keyboardType='default'
                                maxLength={20}
                                onSubmitEditing={() => { this.focusNextField('etGivenName') }}
                                onChangeText={(text) => this.setState({ surname: text })}
                                value={this.state.surname}
                            />

                            {/* EditText for Name */}
                            <EditText
                                reference={input => { this.inputs['etGivenName'] = input; }}
                                header={R.strings.givanname}
                                placeholder={R.strings.givanname}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                maxLength={20}
                                onChangeText={(text) => this.setState({ name: text })}
                                value={this.state.name}
                            />

                            {/* Picker for Valid Identity Card */}
                            <TitlePicker
                                style={{
                                    marginTop: R.dimens.widget_top_bottom_margin,
                                }}
                                title={R.strings.valididentitycard}
                                array={this.state.identityCardItems}
                                selectedValue={this.state.selectedIdentityCard}
                                onPickerSelect={(index) => this.setState({ selectedIdentityCard: index })}
                            />

                            {/* Choose file for Card Front Side  */}
                            {this.returnTitleImagePicker({
                                text: isEmpty(this.state.front.name) ? R.strings.cardfrontside : this.state.front.name,
                                buttonText: this.state.front.name,
                                noteText: R.strings.cardfrontside_string,
                                onPress: () => this.showImagePicker('front')
                            })}

                            {/* Separator */}
                            <Separator style={{
                                backgroundColor: R.colors.tradeInput,
                                marginLeft: R.dimens.widgetMargin,
                                marginRight: R.dimens.widgetMargin,
                                marginTop: R.dimens.widget_left_right_margin
                            }} />

                            {/* Choose file for Card Back Side */}
                            {this.returnTitleImagePicker({
                                text: isEmpty(this.state.back.name) ? R.strings.cardbackside : this.state.back.name,
                                buttonText: this.state.back.name,
                                noteText: R.strings.cardbackside_string,
                                onPress: () => this.showImagePicker('back')
                            })}

                            {/* Separator */}
                            <Separator style={{
                                backgroundColor: R.colors.tradeInput,
                                marginLeft: R.dimens.widgetMargin,
                                marginRight: R.dimens.widgetMargin,
                                marginTop: R.dimens.widget_left_right_margin
                            }} />

                            {/* Choose file for Photo ID and Note */}
                            {this.returnTitleImagePicker({
                                text: isEmpty(this.state.selfie.name) ? R.strings.photoid_note : this.state.selfie.name,
                                buttonText: this.state.selfie.name,
                                noteText: R.strings.photoid_note_string,
                                onPress: () => this.showImagePicker('selfie')
                            })}

                            {/* Confirmation of Image Status */}
                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>
                                {this.returnImageCheckerText({
                                    text: R.strings.photoid_varification1,
                                    name: this.state.front.name
                                })}
                                {this.returnImageCheckerText({
                                    text: R.strings.photoid_varification2,
                                    name: this.state.back.name
                                })}
                                {this.returnImageCheckerText({
                                    text: R.strings.photoid_varification3,
                                    name: this.state.selfie.name
                                })}
                            </View>

                            {/* Design for Required Note */}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
                                <TextViewHML style={{ color: R.colors.failRed }}>*</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText, textAlign: 'justify' }}>The uploaded images should clearly show the face and text inforamtion</TextViewHML>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* Design for Submit Button */}
                        <Button title={R.strings.submit} onPress={this.onSubmit} />
                    </View>
                </View>
            </SafeView>
        );
    }

    returnTitleImagePicker = (props) => {
        let { text, noteText, onPress } = props;
        return <View style={{ marginTop: R.dimens.margin_top_bottom, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextViewMR
                    style={{
                        flex: 1,
                        fontSize: R.dimens.smallText,
                        color: R.colors.textPrimary,
                        marginRight: R.dimens.margin
                    }}>{text}</TextViewMR>

                <TouchableOpacity onPress={onPress} >
                    <View style={this.styles().choosebutton}>
                        <ImageButton
                            onPress={onPress}
                            style={{ margin: R.dimens.widgetMargin, }}
                            icon={R.images.IC_UPLOAD}
                            iconStyle={this.styles().icon_style}
                        />
                        <TextViewHML style={{ marginRight: R.dimens.widgetMargin, color: R.colors.white, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{R.strings.Upload}</TextViewHML>
                    </View>
                </TouchableOpacity>

            </View>
            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginTop: R.dimens.widgetMargin, textAlign: 'justify', justifyContent: 'center' }}>{noteText}</TextViewHML>
        </View>
    }

    returnImageCheckerText = (props) => {
        let { text, name } = props;
        return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* if state is empty then display cross otherwise checkmark */}
            <Image
                source={name === '' ? R.images.IC_CANCEL : R.images.IC_CHECKMARK}
                style={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: name === '' ? R.colors.failRed : R.colors.successGreen }} />
            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{text}</TextViewHML>
        </View>
    }

    styles = () => {
        return ({
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            verificationstr: {
                fontSize: R.dimens.secondCurrencyText,
                color: R.colors.textSecondary,
                textAlign: 'center',
            },
            choosebutton: {
                flexDirection: 'row',
                backgroundColor: R.colors.accent,
                borderRadius: R.dimens.CardViewElivation,
                alignItems: 'center',
                justifyContent: 'center',
            },
            icon_style: {
                tintColor: R.colors.white,
                width: R.dimens.dashboardMenuIcon,
                height: R.dimens.dashboardMenuIcon
            }
        })
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For KYC Action
        loading: state.KYCReducer.loading,
        data: state.KYCReducer.data,
        dataFetch: state.KYCReducer.dataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform personalVerification Action
        personalVerification: (reqKYC) => dispatch(personalVerification(reqKYC)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KYCPersonalInfoScreen)