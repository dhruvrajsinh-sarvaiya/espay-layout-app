import React, { Component } from 'react';
import {
    ScrollView,
    YellowBox,
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import { countriesAddData, countriesUpdateData, clearAdd, clearUpdate } from '../../actions/CMS/CountriesAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import Button from '../../native_theme/components/Button';
import EditText from '../../native_theme/components/EditText';
import { changeTheme } from '../../controllers/CommonUtils';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
import { isEmpty, isInternet, validateResponseNew, } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../../components/Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { showAlert } from '../../controllers/CommonUtils';
import Picker from '../../native_theme/components/Picker';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';

class CountriesAddScreen extends Component {

    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();

        let item = props.navigation.state.params && props.navigation.state.params.ITEM;

        this.SpinnerStatusData = [{ value: R.strings.active }, { value: R.strings.inActive }];

        this.headerText = item == undefined ? R.strings.add_new_country : R.strings.edit_country;
        this.buttonText = item == undefined ? R.strings.submit : R.strings.update;

        //for focus on next field
        this.inputs = {}

        this.state = {
            countryName: item == undefined ? '' : item.countryName,
            countryCode: item == undefined ? '' : item.countryCode,
            isFromUpdate: item == undefined ? false : true,
            selectedStatus: item == undefined ? R.strings.select_status : item.status,
        }
        this.focusNextField = this.focusNextField.bind(this);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }
    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }
    componentDidUpdate = async (prevProps, prevState) => {
        let { countriesAddDatas, countriesUpdateDatas } = this.props.appData

        if (countriesAddDatas !== prevProps.appData.countriesAddDatas) {
            if (countriesAddDatas != null) {
                if (validateResponseNew({ response: countriesAddDatas, isList: false })) {
                    showAlert(R.strings.status, countriesAddDatas.ReturnMsg, 0, () => {
                        //clear add data
                        this.props.clearAdd()
                        //----
                        //refresh previous screen list
                        this.props.navigation.state.params.onRefresh(true)
                        //-----
                        //navigate to back scrreen
                        this.props.navigation.goBack()
                    })
                }
            }
        }
        if (countriesUpdateDatas !== prevProps.appData.countriesUpdateDatas) {
            if (countriesUpdateDatas != null) {
                if (validateResponseNew({ response: countriesUpdateDatas, isList: true })) {
                    showAlert(R.strings.status, countriesUpdateDatas.ReturnMsg, 0, () => {
                        //clear update data
                        this.props.clearUpdate()
                        //--
                        //refresh previous screen list
                        this.props.navigation.state.params.onRefresh(true)
                        //-----
                        //navigate to back scrreen
                        this.props.navigation.goBack()
                    })
                }
            }
        }
    }

    onPressSubmit = async () => {
        //check for validations
        if (isEmpty(this.state.countryName)) {
            this.toast.Show(R.strings.enter_country_name);
        }
        else if (isEmpty(this.state.countryCode)) {
            this.toast.Show(R.strings.enter_country_code);
        }
        else if (isEmpty(this.state.selectedStatus) || this.state.selectedStatus === R.strings.select_status) {
            this.toast.Show(R.strings.select_status);
        }
        else {
            if (this.state.isFromUpdate) {
                //Check NetWork is Available or not
                if (await isInternet()) {
                    // call API  for Updating countries
                    this.props.countriesUpdateData();
                }
            } else if (!this.state.isFromUpdate) {
                //Check NetWork is Available or not
                if (await isInternet()) {
                    // call API  for Adding countries
                    this.props.countriesAddData();
                }
            }
        }
    }
    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }
    //---
    render() {

        let { loading } = this.props.appData

        return (
            <View style={this.styles().container}>
                <CommonStatusBar />
                <CustomToolbar title={this.headerText} isBack={true} nav={this.props.navigation} />
                <ProgressDialog isShow={loading} />
                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            <EditText
                                reference={input => { this.inputs['etCoutnryName'] = input; }}
                                value={this.state.countryName}
                                header={R.strings.country_name}
                                placeholder={R.strings.country_name}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onChangeText={(countryName) => this.setState({ countryName })}
                                onSubmitEditing={() => { this.focusNextField('etCountryCode') }}
                            />
                            <EditText
                                reference={input => { this.inputs['etCountryCode'] = input; }}
                                value={this.state.countryCode}
                                header={R.strings.country_code}
                                placeholder={R.strings.country_code}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(countryCode) => this.setState({ countryCode })}
                            />
                            <Text style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin, }}>{R.strings.select_status}</Text>
                            <Picker
                                ref='spStatus'
                                data={this.SpinnerStatusData}
                                value={this.state.selectedStatus}
                                onPickerSelect={(value) => this.setState({ selectedStatus: value })}
                                displayArrow={'true'}
                                width={'100%'}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={this.buttonText}
                            onPress={this.onPressSubmit} />
                    </View>
                </View>
            </View>
        );
    }
    styles = () => {
        return {
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: R.colors.background
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        appData: state.CountriesReducer,
    }

}

function mapDispatchToProps(dispatch) {
    return {
        countriesAddData: () => dispatch(countriesAddData()),
        countriesUpdateData: () => dispatch(countriesUpdateData()),
        clearUpdate: () => dispatch(clearUpdate()),
        clearAdd: () => dispatch(clearAdd())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CountriesAddScreen)
