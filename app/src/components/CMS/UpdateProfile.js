import React, { Component } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Image,
    ScrollView,
    Modal,
    FlatList
} from 'react-native';
import { changeTheme, showAlert } from '../../controllers/CommonUtils';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import Button from '../../native_theme/components/Button';
import EditText from '../../native_theme/components/EditText';
import { connect } from 'react-redux';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { editProfile, getProfileByID, clearReducerData } from '../../actions/account/EditProfileActions';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { setData, getData } from '../../App';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class UpdateProfileScreen extends Component {
    constructor(props) {
        super(props);

        //for focus on next field
        this.inputs = {};

        //getting user selected avatar from preference
        let avatar = getData(ServiceUtilConstant.KEY_USER_AVATAR);
        let userAvatar = '';
        try {
            if (JSON.parse(avatar)) {
                userAvatar = JSON.parse(avatar);
            } else {
                userAvatar = R.images.AVATAR_01;
            }
        } catch (error) {
            userAvatar = R.images.AVATAR_01;
        }

        //Define All initial State
        this.state = {
            viewProfile: null,
            updateProfile: null,
            firstName: this.props.navigation.state.params ? this.props.navigation.state.params.firstName : '',
            lastName: this.props.navigation.state.params ? this.props.navigation.state.params.lastName : '',
            userName: this.props.navigation.state.params ? this.props.navigation.state.params.userName : '',
            email: this.props.navigation.state.params ? this.props.navigation.state.params.email : '',
            isEmailConfirmed: null,
            phoneNumber: this.props.navigation.state.params ? this.props.navigation.state.params.phoneNumber : '',
            isAvail: this.props.navigation.state.params ? this.props.navigation.state.params.isAvail : false,
            redisDBKey: '',
            selectedImage: userAvatar,
            showAvatarSelector: false,
            dataSource: [{ 'image': R.images.AVATAR_01 },
            { 'image': R.images.AVATAR_02 },
            { 'image': R.images.AVATAR_03 },
            { 'image': R.images.AVATAR_04 },
            { 'image': R.images.AVATAR_05 },
            { 'image': R.images.AVATAR_06 }],
            userData: null,
            getAvatar: userAvatar,
            isFirstTime: true,
        };
    }

    async  componentDidMount() {
        changeTheme();
        //if response is not available from previus Screen Than call Api For viewProfile BY id
        if (!this.state.isAvail) {
            //Check NetWork is Available or not
            if (await isInternet()) {
                // call API get Profile by id 
                this.props.getProfileByID();
            }
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        return isCurrentScreen(nextProps || nextState);
    };

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }
        if (isCurrentScreen(props)) {

            let { data } = props.updateData;

            // To check data is null or not
            if (data) {

                //if local buySellTrade state is null or its not null and also different then new response then and only then validate response.
                if (state.viewProfile == null || (state.viewProfile != null && data !== state.viewProfile)) {
                    try {
                        //currently use status code as success temprory
                        if (validateResponseNew({ response: data, isList: false })) {
                            //To update FirstName and LastName in preference
                            setData({
                                [ServiceUtilConstant.FIRSTNAME]: data.UserData.FirstName,
                                [ServiceUtilConstant.LASTNAME]: data.UserData.LastName
                            })
                            return {
                                ...state,
                                viewProfile: data,
                                firstName: data.UserData.FirstName,
                                lastName: data.UserData.LastName,
                                userName: data.UserData.Username,
                                isEmailConfirmed: data.UserData.IsEmailConfirmed,
                                email: data.UserData.Email,
                                phoneNumber: data.UserData.MobileNo,
                                userData: data.UserData
                            }
                        } else {
                            return {
                                ...state,
                                viewProfile
                            }
                        }
                    } catch (error) {
                        return {
                            ...state,
                        }
                    }
                }
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        let { dataUpdateProfile } = this.props.updateData;

        if (dataUpdateProfile !== prevProps.updateData.dataUpdateProfile) {
            if (dataUpdateProfile != null) {
                if (validateResponseNew({ response: dataUpdateProfile })) {
                    showAlert(R.strings.Success + '!', dataUpdateProfile.ReturnMsg, 0, async () => {
                        setData({
                            [ServiceUtilConstant.FIRSTNAME]: this.state.firstName,
                            [ServiceUtilConstant.LASTNAME]: this.state.lastName
                        })
                        this.props.clearReducerData();
                        //-----
                        if (this.props.navigation.state.params && this.props.navigation.state.params.refresh !== undefined) {
                            this.props.navigation.state.params.refresh();
                        }
                        //to navigate to back on Ok press of dialog
                        this.props.navigation.goBack()
                        //-------
                    })
                }
                else {
                    this.props.clearReducerData();
                }
            }
        }
    };

    onSubmit = async () => {
        //applied Validation For Update Profile Input Fields 
        if (isEmpty(this.state.firstName)) {
            this.refs.Toast.Show(R.strings.firstNameValidate);
        }
        else if (isEmpty(this.state.lastName)) {
            this.refs.Toast.Show(R.strings.lastNameValidate);
        }
        else if (isEmpty(this.state.userName)) {
            this.refs.Toast.Show(R.strings.enter_Username);
        }
        else if (this.state.userData !== null &&
            this.state.userData.FirstName === this.state.firstName &&
            this.state.userData.LastName === this.state.lastName &&
            this.state.selectedImage === this.state.getAvatar) {
            this.refs.Toast.Show(R.strings.update_info_validate);
        }
        else {

            // Get data from View Profile
            if (this.state.isAvail) {
                let fName = this.props.navigation.state.params ? this.props.navigation.state.params.firstName : ''
                let lName = this.props.navigation.state.params ? this.props.navigation.state.params.lastName : ''

                if (fName === this.state.firstName && lName === this.state.lastName && this.state.selectedImage === this.state.getAvatar)
                    this.refs.Toast.Show(R.strings.update_info_validate);
                else {
                    setData({ [ServiceUtilConstant.KEY_USER_AVATAR]: this.state.selectedImage });
                    //Check NetWork is Available or not
                    if (await isInternet()) {
                        // call API for Update Profile
                        let updateRequest = {
                            firstName: this.state.firstName,
                            lastName: this.state.lastName,
                            username: this.state.userName,
                            isEmailConfirmed: this.state.isEmailConfirmed,
                            email: this.state.email,
                            mobileNo: this.state.phoneNumber,
                        }
                        this.props.onUpdateProfile(updateRequest);
                    }
                }
            } else {
                setData({ [ServiceUtilConstant.KEY_USER_AVATAR]: this.state.selectedImage });
                //Check NetWork is Available or not
                if (await isInternet()) {
                    // call API for Update Profile
                    let updateRequest = {
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        username: this.state.userName,
                        isEmailConfirmed: this.state.isEmailConfirmed,
                        email: this.state.email,
                        mobileNo: this.state.phoneNumber,
                    }
                    this.props.onUpdateProfile(updateRequest);
                }
            }


        }
    }

    // for change the avtar Image and Avtar Modal Closing 
    _onSelectImage = (image) => {
        this.setState({ selectedImage: image, showAvatarSelector: false })
    }

    onPressAvatar = () => {
        this.setState({ showAvatarSelector: true })
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }
    //---

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading, loadingUpdateProfile } = this.props.updateData;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.updateProfileTitle}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loading || loadingUpdateProfile} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <View style={{
                                borderRadius: R.dimens.QRCodeIconWidthHeight / 2,
                                borderWidth: R.dimens.CardViewElivation,
                                borderColor: R.colors.accent,
                            }}>
                                {/* For Profile Avtar Image Select */}
                                <TouchableWithoutFeedback
                                    onPress={this.onPressAvatar}>
                                    <Image
                                        style={this.styles().image_style}
                                        source={this.state.selectedImage}
                                    />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={{ flex: 4, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.LoginScreenTopMargin }}>
                            {/* First Name */}
                            <EditText
                                value={this.state.firstName}
                                header={R.strings.firstName}
                                reference={input => { this.inputs['etFirstName'] = input; }}
                                placeholder={R.strings.firstName}
                                keyboardType={'default'}
                                returnKeyType={"next"}
                                onChangeText={(text) => this.setState({ firstName: text })}
                                onSubmitEditing={() => { this.focusNextField('etLastName') }}
                                validate={true}
                                onlyCharacters={true}
                                multiline={false}
                            />
                            {/* Last Name */}
                            <EditText
                                value={this.state.lastName}
                                header={R.strings.lastName}
                                reference={input => { this.inputs['etLastName'] = input; }}
                                placeholder={R.strings.lastName}
                                keyboardType={'default'}
                                returnKeyType={"done"}
                                onChangeText={(text) => this.setState({ lastName: text })}
                                validate={true}
                                onlyCharacters={true}
                                multiline={false}
                            />
                            {/* User Name */}
                            <EditText
                                value={this.state.userName}
                                header={R.strings.Username}
                                placeholder={R.strings.Username}
                                keyboardType={'default'}
                                onChangeText={(text) => this.setState({ userName: text })}
                                multiline={false}
                                editable={false}
                                maxLength={50}
                            />
                            {/* Email */}
                            <EditText
                                value={this.state.email}
                                header={R.strings.EmailId}
                                placeholder={R.strings.EmailId}
                                keyboardType={'default'}
                                onChangeText={(text) => this.setState({ email: text })}
                                multiline={false}
                                editable={false}
                            />
                            {/* Phone Number */}
                            <EditText
                                value={this.state.phoneNumber}
                                header={R.strings.phoneNumber}
                                placeholder={R.strings.phoneNumber}
                                keyboardType={'default'}
                                onChangeText={(text) => this.setState({ phoneNumber: text })}
                                multiline={false}
                                editable={false}
                            />
                            {/* Modal For Profile Avtar Image  */}
                            <Modal
                                supportedOrientations={['portrait', 'landscape']}
                                visible={this.state.showAvatarSelector}
                                transparent={true}
                                animationType={"fade"}
                                onRequestClose={() => { this.setState({ showAvatarSelector: !this.state.showAvatarSelector }) }} >

                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0, 0.5)' }}>
                                    <View style={{
                                        width: wp('75%'),
                                        backgroundColor: R.colors.background,
                                        borderColor: R.colors.textPrimary,
                                        borderWidth: R.dimens.normalizePixels(0.5)
                                    }}>
                                        {/* Title of Dialog */}
                                        <TextViewMR style={{
                                            padding: R.dimens.WidgetPadding,
                                            color: R.colors.textPrimary,
                                            fontSize: R.dimens.mediumText,
                                            textAlign: 'center'
                                        }}>
                                            {R.strings.select_your_image}
                                        </TextViewMR>
                                        <View style={{ backgroundColor: R.colors.textSecondary, height: R.dimens.normalizePixels(0.7), width: '100%' }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                style={{ flex: 1 }}
                                                data={this.state.dataSource}
                                                horizontal={true}
                                                renderItem={({ item }) =>
                                                    <TouchableWithoutFeedback style={{ flex: 1, flexDirection: 'row' }}
                                                        onPress={() => this._onSelectImage(item.image)}>
                                                        <Image source={item.image} style={{ height: R.dimens.security_image_selector_width_height, width: R.dimens.security_image_selector_width_height }} />
                                                    </TouchableWithoutFeedback>
                                                }
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </ScrollView>

                    {/* To display button at the bottom */}
                    <View style={{ marginBottom: R.dimens.widget_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin }}>
                        {/* Submit Button */}
                        <Button title={R.strings.update} onPress={() => this.onSubmit()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
    styles = () => {
        return {
            image_style: {
                height: R.dimens.normalizePixels(120),
                width: R.dimens.normalizePixels(120),
                alignItems: 'center',
                justifyContent: 'center',
                padding: R.dimens.WidgetPadding,
                borderRadius: R.dimens.normalizePixels(120) / 2
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
        //Updated Data For Update Profile Action
        updateData: state.EditProfileReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Update Profile  Action
        onUpdateProfile: (payload) => dispatch(editProfile(payload)),
        //Perform get Profilebyid  Action
        getProfileByID: () => dispatch(getProfileByID()),
        //Perform Clear Data Action
        clearReducerData: () => dispatch(clearReducerData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileScreen);