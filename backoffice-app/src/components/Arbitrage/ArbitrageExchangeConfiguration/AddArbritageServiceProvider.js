import React, { Component } from 'react'
import { View, } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { changeTheme, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import { validateResponseNew, isInternet, isEmpty } from '../../../validations/CommonValidation';
import { addArbitrageServiceProvider } from '../../../actions/Arbitrage/ServiceProviderListAction';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import EditText from '../../../native_theme/components/EditText';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import Button from '../../../native_theme/components/Button';
import CommonToast from '../../../native_theme/components/CommonToast';

export class AddArbritageServiceProvider extends Component {
    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            ProviderName: '',
            ProviderStatus: false,
            AddServiceProviderList: null,
        };

        // Create reference
        this.toast = React.createRef();
    }


    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate(prevProps, _prevState) {

        //Get All Updated Feild of Particular actions
        const { AddServiceProviderdata } = this.props.ServiceProviderResult;

        // compare response with previous response
        if (AddServiceProviderdata !== prevProps.ServiceProviderResult.AddServiceProviderdata) {

            //To Check Add Service Provider Fetch Or Not
            if (AddServiceProviderdata) {
                try {
                    //if local Add Service Provider state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.AddServiceProviderList == null || (this.state.AddServiceProviderList !== null && ServiceProviderdata !== this.state.AddServiceProviderList)) {

                        if (validateResponseNew({ response: AddServiceProviderdata, isList: true })) {

                            this.setState({ AddServiceProviderList: AddServiceProviderdata })
                            showAlert(R.strings.status, R.strings.AddProviderSuccessMsg, 0, () => {
                                // Navigate to Service Provider List Screen
                                this.props.navigation.state.params.getArbitrageList()
                                this.props.navigation.goBack()
                            })
                        }
                    }
                } catch (e) {
                    this.setState({ AddServiceProviderList: AddServiceProviderdata })
                }
            }
        }
    }

    // Call when user press on add button
    onAddProvider = async () => {

        // check validation
        if (isEmpty(this.state.ProviderName)) {
            this.toast.Show(R.strings.EnterProviderName)
        } else {
            // Check internet is Available or not
            if (await isInternet()) {

                let Request = {
                    id: 0,
                    ProviderName: this.state.ProviderName,
                    status: this.state.ProviderStatus ? 1 : 0, //if status is true(enable) than status change False(disbale)
                }

                //Call For Add Service Provider Status
                this.props.addArbitrageServiceProvider(Request)
            }
        }
    }


    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { AddServiceProviderIsFetching } = this.props.ServiceProviderResult;
        //----------

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To Set ProgressDialog as per our theme */}
                <ProgressDialog isShow={AddServiceProviderIsFetching} />

                {/* For Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.AddServiceProvider}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* for status switch */}
                <FeatureSwitch
                    isGradient={true}
                    title={R.strings.Status}
                    isToggle={this.state.ProviderStatus}
                    onValueChange={() => {
                        this.setState({
                            ProviderStatus: !this.state.ProviderStatus
                        })
                    }}
                />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.padding_top_bottom_margin, paddingBottom: R.dimens.padding_top_bottom_margin,
                }}>

                    {/* To Set ProviderName Data in EditText */}
                    <EditText
                        header={R.strings.Provider_Name}
                        placeholder={R.strings.Provider_Name}
                        multiline={false}
                        keyboardType='default'
                        returnKeyType={"done"}
                        maxLength={50}
                        onChangeText={(item) => this.setState({ ProviderName: item })}
                        value={this.state.ProviderName}
                    />

                </View>

                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    {/* To Set Submit Button */}
                    <Button title={R.strings.add} onPress={this.onAddProvider}></Button>
                </View>

            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // get arbitrage Service Provider Configuration data from reducer
        ServiceProviderResult: state.ServiceProviderListReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Add Arbitrage Service Provider Action
    addArbitrageServiceProvider: (request) => dispatch(addArbitrageServiceProvider(request)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddArbritageServiceProvider)