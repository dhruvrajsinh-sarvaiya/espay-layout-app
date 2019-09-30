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
import { isCurrentScreen } from '../../../components/Navigation';
import { showAlert, changeTheme } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { addServiceProvider, clearServiceProvider } from '../../../actions/Trading/ServiceProviderActions';
import R from '../../../native_theme/R';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Service provider
class ServiceProviderAddScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();

        //Define All State initial state
        this.state = {
            providerName: '',
            status: false,
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //Add this method to change theme based on stored theme name.
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { addServiceProviderData } = this.props.data;

        // compare response with previous response
        if (addServiceProviderData !== prevProps.data.addServiceProviderData) {

            // for show responce of add provider configuration data
            if (addServiceProviderData) {
                try {
                    if (validateResponseNew({ response: addServiceProviderData })) {

                        //if add service provider succcess redirect user to list Service provider screen
                        showAlert(R.strings.Success, R.strings.added_msg, 0, () => {

                            // clear reducer
                            this.props.clearServiceProvider();

                            //navigate to previous screen
                            this.props.navigation.goBack();

                            // refresh previous list for updated data
                            this.props.navigation.state.params.onRefresh(true)
                        });
                    }
                    else {
                        this.props.clearServiceProvider()
                    }
                } catch (e) {
                    this.props.clearServiceProvider()
                }
            }
        }
    }

    onSubmit = async () => {

        //validations for Inputs 
        if (isEmpty(this.state.providerName)) {
            this.toast.Show(R.strings.select + ' ' + R.strings.Provider_Name);
            return;
        }
        Keyboard.dismiss();

        // check for internet connection
        if (await isInternet()) {

            // bind request for add service provider
            const request = {
                ProviderName: this.state.providerName,
                Status: this.state.status ? 1 : 0
            };

            // call api for add Service provider
            this.props.addServiceProvider(request)

        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props.data;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.Add + ' ' + R.strings.Service_Provider}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={loading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient={true}
                    title={R.strings.status}
                    isToggle={this.state.status}
                    onValueChange={() => {
                        this.setState({
                            status: !this.state.status
                        })
                    }}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* Display Data in scrollview */}

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                            {/* EditText for Service Provider */}
                            <EditText
                                header={R.strings.Provider_Name}
                                placeholder={R.strings.Provider_Name}
                                onChangeText={(text) => this.setState({ providerName: text })}
                                value={this.state.weeklyLimit}
                                keyboardType={'default'}
                                returnKeyType={"done"}
                                multiline={false}
                            />
                        </View>

                    </ScrollView>
                    {/* for Add or Update Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.add} onPress={this.onSubmit}></Button>
                    </View>
                </View>
            </SafeView>

        );
    }
}

function mapStateToProps(state) {
    return {
        //data for Service Provider reducer
        data: state.ServiceProviderConfigReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {

        //for adding Service Provider data
        addServiceProvider: (request) => dispatch(addServiceProvider(request)),

        //for clear Service Provider data
        clearServiceProvider: () => dispatch(clearServiceProvider()),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ServiceProviderAddScreen)