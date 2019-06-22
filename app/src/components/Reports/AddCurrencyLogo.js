import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import EditText from '../../native_theme/components/EditText';
import Button from '../../native_theme/components/Button';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { changeTheme, getIPAddress, showAlert, showSlowInternetDialog, } from '../../controllers/CommonUtils';
import CommonToast from '../../native_theme/components/CommonToast';
import { connect } from 'react-redux';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import ImagePicker from 'react-native-image-picker';
import { addCurrencyLogo } from '../../actions/Wallet/AddCurrencyLogoAction'
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class AddCurrencyLogo extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            CurrencyName: '',
            imageDetails: {
                name: '',
            },
        };

        this.inputs = {};
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    showImagePicker = () => {

        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.didCancel) {
                // logger('User cancelled image picker');
            } else if (response.error) {
                //logger('ImagePicker Error: ', response.error);
            } else {
                //if uri is not null then proceed further
                if (response.uri != null) {

                    let imageTypes = ['image/jpg', 'image/jpeg', 'image/png']

                    // check user selected file type is jpg or png
                    if (imageTypes.includes(response.type)) {

                        //store all data in state
                        this.setState({
                            imageDetails: {
                                ...this.state.imageDetails,
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
                            imageDetails: {
                                ...this.state.imageDetails,
                                name: '',
                            },
                        });
                    }
                }
            }
        })
    }

    //on Submit Button Press
    onSubmit = async () => {
        if (isEmpty(this.state.CurrencyName)) {
            this.refs.Toast.Show(R.strings.enter + ' ' + R.strings.CoinName);
        } else if (isEmpty(this.state.imageDetails.name)) {
            this.refs.Toast.Show(R.strings.Image_Validation)
        } else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                try {
                    let ipAddress = await getIPAddress();

                    if (ipAddress === '') {
                        showSlowInternetDialog();
                        return;
                    }

                    //Bind Request For Add Currency Logo
                    let addCurrencyLogoRequest = {
                        CurrencyName: this.state.CurrencyName,
                        Image: this.state.imageDetails
                    }
                    //call add Currency Logo Api
                    this.props.addCurrencyLogo(addCurrencyLogoRequest);
                } catch (error) {
                    showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
                }
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { AddCurrencyLogoFetchData, AddCurrencyLogodata, } = this.props;

        if (AddCurrencyLogodata !== prevProps.AddCurrencyLogodata) {
            //To Check add Currency Logo Data Fetch Or Not
            if (!AddCurrencyLogoFetchData) {
                try {
                    let AddCurrencyImageRetrunMessage = AddCurrencyLogodata.ReturnMsg;
                    if (validateResponseNew({ response: AddCurrencyLogodata })) {
                        // on success responce Refresh List
                        showAlert(R.strings.Success + '!', AddCurrencyImageRetrunMessage, 0, () => this.setState({
                            CurrencyName: '',
                            imageDetails: {
                                ...this.state.imageDetails,
                                name: '',
                            },
                        }))
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
        const { AddCurrencyLogoisFetching } = this.props;

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.CoinConfiguration} isBack={true} nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

                {/* Progress Dialog */}
                <ProgressDialog isShow={AddCurrencyLogoisFetching} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* EditText for Coin Name */}
                            <EditText
                                reference={input => { this.inputs['etCurrencyName'] = input; }}
                                header={R.strings.CoinName}
                                placeholder={R.strings.CoinName}
                                multiline={false}
                                returnKeyType={"done"}
                                keyboardType='default'
                                maxLength={20}
                                onChangeText={(CurrencyName) => this.setState({ CurrencyName })}
                                value={this.state.CurrencyName}
                            />

                            {/* Choose file for Coin Image   */}
                            {this.returnTitleImagePicker({
                                text: isEmpty(this.state.imageDetails.name) ? R.strings.coinConfigurationImage : this.state.imageDetails.name,
                                onPress: () => this.showImagePicker()
                            })}

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
        let { text, onPress } = props;

        return <View style={{ marginTop: R.dimens.margin_top_bottom, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginRight: R.dimens.toolBarOutlineButtonPadding }}>{text}</TextViewMR>

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
        </View>
    }

    // style for this class
    styles = () => {
        return ({
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
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
        //Updated Data For Leader Boader List
        AddCurrencyLogoFetchData: state.AddCurrencyLogoReducer.AddCurrencyLogoFetchData,
        AddCurrencyLogodata: state.AddCurrencyLogoReducer.AddCurrencyLogodata,
        AddCurrencyLogoisFetching: state.AddCurrencyLogoReducer.AddCurrencyLogoisFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Leader Board List
        addCurrencyLogo: (addCurrencyLogoRequest) => dispatch(addCurrencyLogo(addCurrencyLogoRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCurrencyLogo)