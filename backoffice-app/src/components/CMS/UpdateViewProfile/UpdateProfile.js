import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Modal,
    FlatList
} from 'react-native';
import { changeTheme, showAlert } from '../../../controllers/CommonUtils';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText';
import { connect } from 'react-redux';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { editProfile, getProfileByID, clearReducerData } from '../../../actions/account/EditProfileActions';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../../Navigation';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import { setData, getData } from '../../../App';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';

class UpdateProfileScreen extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

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
            getAvatar: '',
            isFirstTime: true,
        };
        /* //To Bind All Method
        this.onPageChange = this.onPageChange.bind(this);
        this.onRefresh = this.onRefresh.bind(this); */
    }

    async  componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (!this.state.isAvail) {
            //Check NetWork is Available or not
            if (await isInternet()) {
                // call API validate OTP and login
                this.props.getProfileByID();
            }
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps || nextState);
    };

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
        if (UpdateProfileScreen.oldProps !== props) {
            UpdateProfileScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            let { data } = props.updateData;

            // To check data is null or not

            if (data) {

                //if local buySellTrade state is null or its not null and also different then new response then and only then validate response.
                if (state.viewProfile == null || (state.viewProfile != null && data !== state.viewProfile)) {
                    try {
                        // logger("View Profile : ", data);
                        //currently use status code as success temprory
                        if (validateResponseNew({ response: data, isList: false })) {

                            //To update FirstName and LastName in preference
                            setData({
                                [ServiceUtilConstant.LASTNAME]: data.UserData.LastName,
                                [ServiceUtilConstant.FIRSTNAME]: data.UserData.FirstName,
                            })
                            return {
                                ...state,
                                viewProfile: data,
                                userName: data.UserData.Username,
                                firstName: data.UserData.FirstName,
                                lastName: data.UserData.LastName,
                                email: data.UserData.Email,
                                isEmailConfirmed: data.UserData.IsEmailConfirmed,
                                phoneNumber: data.UserData.MobileNo,
                                userData: data.UserData
                            }
                        } else {
                            return { ...state, viewProfile }
                        }
                    } catch (error) {
                        return { ...state, }
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
                    showAlert(R.strings.status, dataUpdateProfile.ReturnMsg, 0, async () => {
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
        if (isEmpty(this.state.firstName)) {
            this.toast.Show(R.strings.firstNameValidate);
        }
        else if (isEmpty(this.state.lastName)) {
            this.toast.Show(R.strings.lastNameValidate);
        }
        else if (isEmpty(this.state.userName)) {
            this.toast.Show(R.strings.enter_Username);
        }
        else if (this.state.userData !== null &&
            this.state.userData.FirstName === this.state.firstName &&
            this.state.userData.LastName === this.state.lastName && this.state.selectedImage === this.state.getAvatar) {
            this.toast.Show(R.strings.update_info_validate);
        }
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
    }

    _onSelectImage = (image) => {
        //logger(image)
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
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                <CommonStatusBar />
                <CustomToolbar
                    title={R.strings.updateProfileTitle}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loading || loadingUpdateProfile} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        <LinearGradient style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            elevation: R.dimens.CardViewElivation
                        }}
                            locations={[0, 10]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            colors={[R.colors.cardBalanceBlue, R.colors.accent]}>
                            <View style={{ padding: R.dimens.WidgetPadding, alignItems: 'center', justifyContent: 'center', }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={this.state.selectedImage}
                                    onPress={this.onPressAvatar}
                                    iconStyle={this.styles().image_style/* { width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary } */}
                                />
                            </View>
                        </LinearGradient>

                        <View style={{ flex: 4, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.LoginScreenTopMargin }}>
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
                            <EditText
                                value={this.state.userName}
                                header={R.strings.Username}
                                placeholder={R.strings.Username}
                                keyboardType={'default'}
                                onChangeText={(text) => this.setState({ userName: text })}
                                multiline={false}
                                editable={false}
                            />

                            <EditText
                                value={this.state.email}
                                header={R.strings.Email}
                                placeholder={R.strings.Email}
                                keyboardType={'default'}
                                onChangeText={(text) => this.setState({ email: text })}
                                multiline={false}
                                //rightImage={R.images.IC_EDIT}
                                editable={false}
                            />

                            <EditText
                                value={this.state.phoneNumber}
                                header={R.strings.phoneNumber}
                                placeholder={R.strings.phoneNumber}
                                keyboardType={'default'}
                                onChangeText={(text) => this.setState({ phoneNumber: text })}
                                multiline={false}
                                //rightImage={R.images.IC_EDIT}
                                editable={false}
                            />
                            <Modal
                                visible={this.state.showAvatarSelector}
                                transparent={true}
                                animationType={"fade"}
                                onRequestClose={() => { this.setState({ showAvatarSelector: !this.state.showAvatarSelector }) }} >

                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0, 0.5)' }}>
                                    <View style={{
                                        width: '75%',
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
                                                    <ImageTextButton
                                                        style={{ margin: 0, flex: 1, flexDirection: 'row' }}
                                                        icon={item.image}
                                                        onPress={() => this._onSelectImage(item.image)}
                                                        iconStyle={{ height: R.dimens.security_image_selector_width_height, width: R.dimens.security_image_selector_width_height, tintColor: null }}
                                                    />
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
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* Submit Button */}
                        <Button title={R.strings.update} onPress={() => this.onSubmit()}></Button>
                    </View>
                </View>
            </View>
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
                borderRadius: R.dimens.normalizePixels(120) / 2,
                tintColor: null
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        updateData: state.EditProfileReducer,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateProfile: (payload) => dispatch(editProfile(payload)),
        getProfileByID: () => dispatch(getProfileByID()),
        clearReducerData: () => dispatch(clearReducerData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileScreen);