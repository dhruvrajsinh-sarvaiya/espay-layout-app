import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { addCoinConfigurationList, updateCoinConfigurationList, clearAddUpdateCoinConfig, } from '../../../actions/Trading/CoinConfigurationAction'
import { addCurrencyLogo } from '../../../actions/Trading/AddCurrencyLogoAction';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import Button from '../../../native_theme/components/Button';
import { changeTheme, getCurrentDate, convertDate } from '../../../controllers/CommonUtils';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { validateResponseNew, isEmpty, isInternet, } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { showAlert } from '../../../controllers/CommonUtils';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import ImagePicker from 'react-native-image-picker';
import EditText from '../../../native_theme/components/EditText';
import DatePickerWidget from '../../widget/DatePickerWidget';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageViewWidget from '../../widget/ImageViewWidget';
import SafeView from '../../../native_theme/components/SafeView';

class CoinConfigurationAddUpdateScreen extends Component {

    constructor(props) {
        super(props)

        // create reference
        this.progressDialog = React.createRef();
        this.toast = React.createRef();

        // ger required fields from previous screen
        let { item, isEdit, isMargin } = props.navigation.state.params;
        this.inputs = {};

        // Bind all methods
        this.callUploadLogoAPI = this.callUploadLogoAPI.bind(this);
        this.showImagePicker = this.showImagePicker.bind(this);

        //Define All State initial state
        this.state = {
            title: (isEdit ? R.strings.editCoin : R.strings.addCoin),
            isEdit,

            ID: isEdit && item !== undefined ? item.ServiceId : null,

            coinName: item !== undefined ? item.Name.toString() : '',
            smsCode: item !== undefined ? item.SMSCode.toString() : '',
            totalSupply: item !== undefined ? item.TotalSupply.toString() : '',
            maxSupply: item !== undefined ? item.MaxSupply.toString() : '',
            issuePrice: item !== undefined ? item.IssuePrice.toString() : '',
            cirSupply: item !== undefined ? item.CirculatingSupply.toString() : '',
            websiteURL: item !== undefined ? item.WebsiteUrl.toString() : '',
            introduction: item !== undefined ? item.Introduction.toString() : '',

            statuses: [{ value: R.strings.Please_Select, code: -1 }, { value: R.strings.active, code: 1 }, { value: R.strings.inActive, code: 0 }],
            selectedStatus: item !== undefined ? (item.Status == 0 ? { value: R.strings.inActive, code: 0 } : { value: R.strings.active, code: 1 }) : { value: R.strings.Please_Select, code: -1 },

            issueDate: item !== undefined ? convertDate(item.IssueDate) : getCurrentDate(),

            isTransaction: item !== undefined ? item.IsTransaction : false,
            isWithdraw: item !== undefined ? item.IsWithdraw : false,
            isDeposit: item !== undefined ? item.IsDeposit : false,
            isBaseCurrency: item !== undefined ? item.IsBaseCurrency : false,
            explorer: item !== undefined ? (item.Explorer.length > 0 ? item.Explorer : [{ Data: '' }]) : [{ Data: '' }],
            community: item !== undefined ? (item.Community.length > 0 ? item.Community : [{ Data: '' }]) : [{ Data: '' }],
            isMargin: isMargin !== undefined ? isMargin : false,

            //for image details
            imageDetails: {
                name: '',
            },
            logoImage: item !== undefined ? item.SMSCode.toString() : '',
            responseMsg: '',
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate(prevProps, prevState) {
        //Get All Updated Feild of Particular actions
        let { addCoinConfigurationListData, updateCoinConfigurationListData } = this.props.appData;
        let { AddCurrencyLogodata } = this.props.addLogoData;

        // compare response with previous response
        if (addCoinConfigurationListData !== prevProps.appData.addCoinConfigurationListData) {

            try {
                // check response is available
                if (addCoinConfigurationListData) {

                    //if addCoinConfigurationListData response is success then store array list else store empty list
                    if (validateResponseNew({ response: addCoinConfigurationListData, isList: false })) {

                        // add message to state for showing it after image upload success
                        this.setState({ responseMsg: addCoinConfigurationListData.ReturnMsg != null ? addCoinConfigurationListData.ReturnMsg : R.strings.coinAdded })

                        //check for call image upload or not
                        if (this.state.isAddUpdateImage) {
                            this.callUploadLogoAPI();
                        } else {
                            showAlert(R.strings.Status, addCoinConfigurationListData.ReturnMsg != null ? addCoinConfigurationListData.ReturnMsg : R.strings.coinAdded, 0, () => {
                                //clear add data
                                this.props.clearAddUpdate()

                                //refresh previous list
                                this.props.navigation.state.params.onRefresh(true)

                                //navigate to back scrreen
                                this.props.navigation.goBack()
                            })
                        }
                    } else {
                        //clear add data
                        this.props.clearAddUpdate()
                    }
                }
            } catch (error) {
                //logger('Add Coin Configuration List : ' + error.message);
            }
        }

        // compare response with previous response
        if (updateCoinConfigurationListData !== prevProps.appData.updateCoinConfigurationListData) {
            try {
                // check response is available
                if (updateCoinConfigurationListData) {

                    //if updateCoinConfigurationListData response is success then store array list else store empty list
                    if (validateResponseNew({ response: updateCoinConfigurationListData, isList: false })) {

                        // add message to state for showing it after image upload success
                        this.setState({ responseMsg: updateCoinConfigurationListData.ReturnMsg != null ? updateCoinConfigurationListData.ReturnMsg : R.strings.coinUpdated })

                        //check for call image upload or not
                        if (this.state.isAddUpdateImage) {
                            this.callUploadLogoAPI();
                        } else {
                            showAlert(R.strings.Status, R.strings.coinUpdated, 0, () => {
                                //clear add data
                                this.props.clearAddUpdate()

                                //refresh previous list
                                this.props.navigation.state.params.onRefresh(true)

                                //navigate to back scrreen
                                this.props.navigation.goBack()
                            })
                        }
                    } else {
                        //clear add data
                        this.props.clearAddUpdate()
                    }
                }
            } catch (error) {
                //logger('Update Coin Configuration List : ' + error.message);
            }
        }

        if (AddCurrencyLogodata !== prevProps.addLogoData.AddCurrencyLogodata) {

            //To Check add Currency Logo Data Fetch Or Not
            if (AddCurrencyLogodata) {
                try {
                    if (validateResponseNew({ response: AddCurrencyLogodata })) {
                        // on success responce Refresh List
                        showAlert(R.strings.Success, R.strings.added_msg, 0, () => {
                            this.setState({
                                CurrencyName: '',
                                imageDetails: {
                                    ...this.state.imageDetails,
                                    name: '',
                                },
                            })

                            // clear reducer data
                            this.props.clearAddUpdate()

                            //refresh previous list
                            this.props.navigation.state.params.onRefresh(true)

                            //navigate to back scrreen
                            this.props.navigation.goBack()
                        })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
    }

    async callUploadLogoAPI() {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Add Currency Logo
            let addCurrencyLogoRequest = {
                CurrencyName: this.state.smsCode,
                Image: this.state.imageDetails
            }

            //call add Currency Logo Api
            this.props.addCurrencyLogo(addCurrencyLogoRequest);
        }
    }

    // used for validate Url 
    validateUrl = (url) => {
        var urlReg = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})"
        if (url.match(urlReg)) {
            return true
        }
        return false
    }

    // on submit button
    onPressSubmit = async () => {

        let Explorer = [], explorerValidate = true;
        let Community = [], communityValidate = true;

        if (this.state.explorer.length !== 0) {
            this.state.explorer.map(el => {
                //If item is not empty then check for further validation
                if (el.Data !== '') {

                    //If Website URL is not valid then show msg otherwise store it
                    if (!this.validateUrl(el.Data)) {
                        this.toast.Show(R.strings.enterValidExplorerURL);
                        explorerValidate = false;
                    } else {
                        explorerValidate = true;
                        Explorer.push({ Data: el.Data });
                    }
                }
            })
        }
        if (this.state.community.length !== 0) {
            this.state.community.map(el => {
                //If item is not empty then check for further validation
                if (el.Data !== '') {

                    //If Website URL is not valid then show msg otherwise store it
                    if (!this.validateUrl(el.Data)) {
                        this.toast.Show(R.strings.enterValidCommunityURL);
                        communityValidate = false;
                    } else {
                        communityValidate = true;
                        Community.push({ Data: el.Data });
                    }
                }
            })
        }

        //check validations 
        if (isEmpty(this.state.coinName)) {
            this.toast.Show(R.strings.enterCoinName);
        }
        else if (isEmpty(this.state.smsCode)) {
            this.toast.Show(R.strings.enterSMSCode);
        }
        else if (isEmpty(this.state.issueDate)) {
            this.toast.Show(R.strings.enterIssueDate);
        }
        else if (isEmpty(this.state.websiteURL)) {
            this.toast.Show(R.strings.enterWebsiteURL);
        }
        else if (isEmpty(this.state.introduction)) {
            this.toast.Show(R.strings.enterIntroduction);
        }
        else if (!this.validateUrl(this.state.websiteURL)) {
            this.toast.Show(R.strings.enterValidURL);
        }
        else if (this.state.selectedStatus.code === -1) {
            this.toast.Show(R.strings.statusValidate);
        }
        else if (!explorerValidate || !communityValidate) {
            //returns because exploer or community not proper
            return;
        }
        else if (!this.state.isEdit && isEmpty(this.state.imageDetails.name)) {
            this.toast.Show(R.strings.Image_Validation)
        }
        else {
            let request = {
                Name: this.state.coinName,
                SMSCode: this.state.smsCode,
                TotalSupply: isEmpty(this.state.totalSupply) ? 0 : parseInt(this.state.totalSupply),
                MaxSupply: isEmpty(this.state.maxSupply) ? 0 : parseInt(this.state.maxSupply),
                IssueDate: this.state.issueDate,
                CirculatingSupply: isEmpty(this.state.cirSupply) ? 0 : parseInt(this.state.cirSupply),
                IssuePrice: isEmpty(this.state.issuePrice) ? 0 : parseInt(this.state.issuePrice),
                WebsiteUrl: this.state.websiteURL,
                Introduction: this.state.introduction,
                IsTransaction: this.state.isTransaction ? parseInt(1) : parseInt(0),
                IsWithdraw: this.state.isWithdraw ? parseInt(1) : parseInt(0),
                IsDeposit: this.state.isDeposit ? parseInt(1) : parseInt(0),
                IsBaseCurrency: this.state.isBaseCurrency ? parseInt(1) : parseInt(0),
                Status: this.state.selectedStatus.code,
                Explorer: Explorer.length != 0 ? Explorer : [],
                Community: Community.length != 0 ? Community : []
            }
            //Check NetWork is Available or not
            if (await isInternet()) {

                //if screen is for Updating existing record then add ID of current item
                if (this.state.isEdit) {
                    request = {
                        ...request,
                        ServiceId: this.state.ID,
                    }
                    if (this.state.isMargin) {
                        request = { ...request, IsMargin: 1 }
                        // call API  for Updating API
                        this.props.updateCoinConfigurationList(request);
                    } else {

                        // call API  for Updating API
                        this.props.updateCoinConfigurationList(request);
                    }
                } else {
                    if (this.state.isMargin) {
                        request = { ...request, IsMargin: 1 }
                        // call API for Adding API
                        this.props.addCoinConfigurationList(request);
                    } else {

                        // call API for Adding API
                        this.props.addCoinConfigurationList(request);
                    }
                }
            }
        }
    }

    // for show image picker
    showImagePicker() {

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
                            logoImage: response.uri,
                            isAddUpdateImage: true,
                        });

                    } else {
                        //To Display Toast using Reference
                        this.toast.Show(R.strings.file_validation);

                        //store empty name for given state
                        this.setState({
                            imageDetails: {
                                ...this.state.imageDetails,
                                name: '',
                            },
                            isAddUpdateImage: false,
                        });
                    }
                }
            }
        })
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { isAddingCoinConfig, isUpdatingCoinConfig } = this.props.appData;
        let { isLoadinCurrencyLogo } = this.props.addLogoData;

        return (
            <SafeView style={this.styles().container}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar title={this.state.title} isBack={true} nav={this.props.navigation} />

                {/* Common progress dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={isAddingCoinConfig || isUpdatingCoinConfig || isLoadinCurrencyLogo} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Inputfield for CoinName */}
                            <EditText
                                reference={input => { this.inputs['etCoinName'] = input; }}
                                value={this.state.coinName}
                                header={R.strings.CoinName}
                                placeholder={R.strings.CoinName}
                                keyboardType='default'
                                maxLength={35}
                                isRequired={true}
                                blurOnSubmit={false}
                                onChangeText={(text) => this.setState({ coinName: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etSMSCode'].focus() }} />

                            {/* Inputfield for smsCode */}
                            <EditText
                                reference={input => { this.inputs['etSMSCode'] = input; }}
                                value={this.state.smsCode}
                                header={R.strings.smsCode}
                                placeholder={R.strings.smsCode}
                                keyboardType='default'
                                maxLength={35}
                                onChangeText={(text) => this.setState({ smsCode: text })}
                                multiline={false}
                                blurOnSubmit={false}
                                isRequired={true}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etTotalSupply'].focus() }} />

                            {/* Inputfield for totalSupply */}
                            <EditText
                                reference={input => { this.inputs['etTotalSupply'] = input; }}
                                value={this.state.totalSupply}
                                header={R.strings.total_supply}
                                placeholder={R.strings.total_supply}
                                keyboardType='numeric'
                                validate={true}
                                validateNumeric={true}
                                maxLength={35}
                                blurOnSubmit={false}
                                onChangeText={(text) => this.setState({ totalSupply: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etMaxSupply'].focus() }} />

                            {/* Inputfield for maxSupply */}
                            <EditText
                                reference={input => { this.inputs['etMaxSupply'] = input; }}
                                value={this.state.maxSupply}
                                header={R.strings.max_supply}
                                placeholder={R.strings.max_supply}
                                keyboardType='numeric'
                                validate={true}
                                blurOnSubmit={false}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ maxSupply: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etIssuePrice'].focus() }} />

                            {/* Inputfield for issuePrice */}
                            <EditText
                                reference={input => { this.inputs['etIssuePrice'] = input; }}
                                value={this.state.issuePrice}
                                header={R.strings.issue_price}
                                placeholder={R.strings.issue_price}
                                keyboardType='numeric'
                                validate={true}
                                validateNumeric={true}
                                blurOnSubmit={false}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ issuePrice: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etCirSupply'].focus() }} />

                            {/* Inputfield for cirSupply */}
                            <EditText
                                reference={input => { this.inputs['etCirSupply'] = input; }}
                                value={this.state.cirSupply}
                                header={R.strings.circulating_supply}
                                placeholder={R.strings.circulating_supply}
                                keyboardType='numeric'
                                validate={true}
                                blurOnSubmit={false}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ cirSupply: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etWebsiteURL'].focus() }} />

                            {/* Inputfield for websiteURL */}
                            <EditText
                                reference={input => { this.inputs['etWebsiteURL'] = input; }}
                                value={this.state.websiteURL}
                                header={R.strings.websiteURL}
                                placeholder={R.strings.websiteURL}
                                keyboardType='url'
                                blurOnSubmit={false}
                                onChangeText={(text) => this.setState({ websiteURL: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                isRequired={true}
                                onSubmitEditing={() => { this.inputs['etIntroduction'].focus() }} />

                            {/* Inputfield for introduction */}
                            <EditText
                                reference={input => { this.inputs['etIntroduction'] = input; }}
                                value={this.state.introduction}
                                header={R.strings.introduction}
                                placeholder={R.strings.introduction}
                                keyboardType='default'
                                multiline={true}
                                isRequired={true}
                                onChangeText={(text) => this.setState({ introduction: text })}
                                multiline={false}
                                returnKeyType={"done"} />

                            {/* dropdown for status */}
                            <TitlePicker
                                title={R.strings.status}
                                isRequired={true}
                                array={this.state.statuses}
                                selectedValue={this.state.selectedStatus.value}
                                onPickerSelect={(index, object) => {
                                    this.setState({ selectedStatus: object })
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }} />

                            {/* datepicker */}
                            <DatePickerWidget
                                fromTitle={R.strings.issue_date}
                                FromDate={this.state.issueDate}
                                FromDatePickerCall={(date) => this.setState({ issueDate: date })}
                                allowFutureDate={true}
                                allowPastDate={false} />

                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'column', alignItems: 'flex-start' }}>

                                {/* checkbox for usedForTransaction */}
                                <ImageButton
                                    isHML
                                    name={R.strings.usedForTransaction}
                                    icon={this.state.isTransaction ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={() => this.setState({ isTransaction: !this.state.isTransaction })}
                                    style={{ margin: R.dimens.widgetMargin, marginRight: 0, flexDirection: 'row-reverse' }}
                                    textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.widgetMargin }}
                                    iconStyle={{ tintColor: this.state.isTransaction ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />

                                {/* checkbox for usedForWithdraw */}
                                <ImageButton
                                    isHML
                                    name={R.strings.usedForWithdraw}
                                    icon={this.state.isWithdraw ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={() => this.setState({ isWithdraw: !this.state.isWithdraw })}
                                    style={{ margin: R.dimens.widgetMargin, marginRight: 0, flexDirection: 'row-reverse' }}
                                    textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.widgetMargin }}
                                    iconStyle={{ tintColor: this.state.isWithdraw ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />

                                {/* checkbox for usedForDeposit */}
                                <ImageButton
                                    isHML
                                    name={R.strings.usedForDeposit}
                                    icon={this.state.isDeposit ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={() => this.setState({ isDeposit: !this.state.isDeposit })}
                                    style={{ margin: R.dimens.widgetMargin, marginRight: 0, flexDirection: 'row-reverse' }}
                                    textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.widgetMargin }}
                                    iconStyle={{ tintColor: this.state.isDeposit ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />

                                {/* checkbox for usedForBaseCurrency */}
                                <ImageButton
                                    isHML
                                    name={R.strings.usedForBaseCurrency}
                                    icon={this.state.isBaseCurrency ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={() => this.setState({ isBaseCurrency: !this.state.isBaseCurrency })}
                                    style={{ margin: R.dimens.widgetMargin, marginRight: 0, flexDirection: 'row-reverse' }}
                                    textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.widgetMargin }}
                                    iconStyle={{ tintColor: this.state.isBaseCurrency ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />
                            </View>

                            <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.explorer}</Text>

                            {/* Inputfields for explorer link */}
                            {this.state.explorer.map((el, index) => {
                                return <EditText
                                    reference={input => { this.inputs['et' + el + index] = input; }}
                                    key={index}
                                    value={el.Data}
                                    placeholder={R.strings.explorer}
                                    keyboardType='url'
                                    onChangeText={(text) => {
                                        let explorer = this.state.explorer;
                                        explorer[index].Data = text;
                                        this.setState({ explorer })
                                    }}
                                    multiline={false}
                                    returnKeyType={this.state.explorer.length - 1 == index ? "done" : "next"}
                                    blurOnSubmit={this.state.explorer.length - 1 == index ? true : false}
                                    rightImage={index == 0 ? R.images.IC_PLUS : R.images.IC_DELETE}
                                    onPressRight={() => {
                                        let explorer = this.state.explorer;
                                        if (index == 0) {
                                            explorer.push({ Data: '' });
                                        } else {
                                            explorer.splice(index, 1);
                                        }
                                        this.setState({ explorer });
                                    }}
                                    onSubmitEditing={() => {
                                        if (this.state.explorer.length - 1 != index) {
                                            this.inputs['et' + el + (index + 1)].focus()
                                        }
                                    }} />
                            })}
                            <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.community}</Text>

                            {/* Inputfields for community link */}
                            {this.state.community.map((el, index) => {
                                return <EditText
                                    reference={input => { this.inputs['et' + el + index] = input; }}
                                    key={index}
                                    value={el.Data}
                                    placeholder={R.strings.community}
                                    keyboardType='url'
                                    onChangeText={(text) => {
                                        let community = this.state.community;
                                        community[index].Data = text;
                                        this.setState({ community })
                                    }}
                                    returnKeyType={this.state.community.length - 1 == index ? "done" : "next"}
                                    onPressRight={() => {
                                        let community = this.state.community;
                                        if (index == 0) {
                                            community.push({ Data: '' });
                                        } else {
                                            community.splice(index, 1);
                                        }
                                        this.setState({ community });
                                    }}
                                    blurOnSubmit={this.state.community.length - 1 == index ? true : false}
                                    onSubmitEditing={() => {
                                        if (this.state.community.length - 1 != index) {
                                            this.inputs['et' + el + (index + 1)].focus()
                                        }
                                    }}
                                    multiline={false}
                                    rightImage={index == 0 ? R.images.IC_PLUS : R.images.IC_DELETE}

                                />
                            })}

                            {/* Choose file for Coin Image   */}
                            <ReturnTitleImagePicker
                                imageDetails={this.state.imageDetails}
                                logoImage={this.state.logoImage}
                                onPress={this.showImagePicker}
                                text={isEmpty(this.state.imageDetails.name) ? R.strings.coinConfigurationImage : this.state.imageDetails.name}
                            />
                        </View>

                    </ScrollView>

                    <View
                        style={{
                            paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin,
                            paddingLeft: R.dimens.activity_margin,
                        }}>
                        {/* To Set Add or Edit Button */}
                        <Button
                            onPress={this.onPressSubmit}
                            title={this.state.isEdit ? R.strings.update : R.strings.add}
                        />
                    </View>
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background
            },
        }
    }
}

// class for image upload functionality
class ReturnTitleImagePicker extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        //if old item and new item are different than only render list item
        if (this.props.text !== nextProps.text || this.props.onPress !== nextProps.onPress ||
            this.props.logoImage !== nextProps.logoImage) {
            return true;
        }
        return false;
    }
    render() {

        // required field from props
        let { text, onPress, logoImage, imageDetails } = this.props;
        var base64Icon = 'data:image/png;base64,' + imageDetails.data;
        return (
            <View style={{ marginTop: R.dimens.margin_top_bottom, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {logoImage !== '' ?
                        !isEmpty(imageDetails.name) ?
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        alignItems: 'flex-start',
                                        width: R.dimens.IconWidthHeight,
                                        height: R.dimens.IconWidthHeight,
                                        resizeMode: Image.resizeMode.contain,
                                    }}
                                    source={{ uri: base64Icon }} />
                            </View>
                            :
                            <View style={{ flex: 1, }}>
                                <ImageViewWidget url={logoImage ? logoImage : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                            </View>
                        :
                        <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginRight: R.dimens.toolBarOutlineButtonPadding }}>{text}</TextViewMR>
                    }
                    <TouchableOpacity onPress={onPress} >
                        <View style={this.styles().choosebutton}>
                            <ImageTextButton
                                iconStyle={this.styles().icon_style}
                                onPress={onPress}
                                style={{ margin: R.dimens.widgetMargin, }}
                                icon={R.images.IC_UPLOAD}
                            />
                            <TextViewHML
                                style={{
                                    marginRight: R.dimens.widgetMargin,
                                    color: R.colors.white,
                                    fontSize: R.dimens.smallestText,
                                    textAlign: 'center'
                                }}>{R.strings.Upload}</TextViewHML>
                        </View>
                    </TouchableOpacity>

                </View>

            </View>
        );
    }

    styles = () => {
        return ({
            choosebutton: {
                backgroundColor: R.colors.accent,
                flexDirection: 'row',
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
    // data from coin configuration reducer
    return {
        appData: state.coinConfigurationReducer,
        addLogoData: state.AddCurrencyLogoReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // for add coin configuration
        addCoinConfigurationList: (payload) => dispatch(addCoinConfigurationList(payload)),
        // for Update coin configuration
        updateCoinConfigurationList: (payload) => dispatch(updateCoinConfigurationList(payload)),
        // for adding coin image 
        addCurrencyLogo: (request) => dispatch(addCurrencyLogo(request)),
        // for clear reducer
        clearAddUpdate: () => dispatch(clearAddUpdateCoinConfig()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CoinConfigurationAddUpdateScreen)
