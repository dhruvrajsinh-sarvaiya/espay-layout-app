// ArbitrageCoinConfigurationAddEditScreen.js
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, getCurrentDate, convertDate } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import ImageViewWidget from '../../widget/ImageViewWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import DatePickerWidget from '../../widget/DatePickerWidget';
import ImagePicker from 'react-native-image-picker';
import { clearArbiCoinConfigurationData, updateArbiCoinConfigurationListData, addArbiCoinConfigurationListData } from '../../../actions/Arbitrage/ArbitrageCoinConfigurationActions';
import { addCurrencyLogo } from '../../../actions/Trading/AddCurrencyLogoAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit 
class ArbitrageCoinConfigurationAddEditScreen extends Component {

    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();
        this.progressDialog = React.createRef();

        // ger required fields from previous screen
        let { item, isEdit } = props.navigation.state.params;
        this.inputs = {};

        // Bind all methods
        this.showImagePicker = this.showImagePicker.bind(this);
        this.callUploadLogoAPI = this.callUploadLogoAPI.bind(this);

        //Define All State initial state
        this.state = {
            title: (isEdit ? R.strings.editCoin : R.strings.addCoin),
            isEdit,

            ID: isEdit && item !== undefined ? item.ServiceId : null,

            smsCode: item !== undefined ? item.SMSCode.toString() : '',
            coinName: item !== undefined ? item.Name.toString() : '',
            maxSupply: item !== undefined ? item.MaxSupply.toString() : '',
            totalSupply: item !== undefined ? item.TotalSupply.toString() : '',
            issuePrice: item !== undefined ? item.IssuePrice.toString() : '',
            websiteURL: item !== undefined ? item.WebsiteUrl.toString() : '',
            cirSupply: item !== undefined ? item.CirculatingSupply.toString() : '',
            introduction: item !== undefined ? item.Introduction.toString() : '',

            statuses: [{ value: R.strings.Please_Select, code: -1 }, { value: R.strings.active, code: 1 }, { value: R.strings.inActive, code: 0 }],
            selectedStatus: item !== undefined ? (item.Status == 0 ? { value: R.strings.inActive, code: 0 } : { value: R.strings.active, code: 1 }) : { value: R.strings.Please_Select, code: -1 },

            issueDate: item !== undefined ? convertDate(item.IssueDate) : getCurrentDate(),

            isTransaction: item !== undefined ? item.IsTransaction : false,
            isBaseCurrency: item !== undefined ? item.IsBaseCurrency : false,
            isDeposit: item !== undefined ? item.IsDeposit : false,
            isWithdraw: item !== undefined ? item.IsWithdraw : false,
            community: item !== undefined ? (item.Community.length > 0 ? item.Community : [{ Data: '' }]) : [{ Data: '' }],
            explorer: item !== undefined ? (item.Explorer.length > 0 ? item.Explorer : [{ Data: '' }]) : [{ Data: '' }],

            //for image details
            imageDetails: {
                name: '',
            },
            responseMsg: '',
            logoImage: item !== undefined ? item.SMSCode.toString() : '',
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    componentDidUpdate(prevProps, prevState) {

        //Get All Updated Feild of Particular actions
        let { AddArbiCoinConfigList, UpdateArbiCoinConfigList, AddCurrencyLogodata } = this.props.coinConfigurationResult;

        // compare response with previous response
        if (AddArbiCoinConfigList !== prevProps.coinConfigurationResult.AddArbiCoinConfigList) {

            try {
                // check response is available
                if (AddArbiCoinConfigList) {

                    //if AddArbiCoinConfigList response is success then store array list else store empty list
                    if (validateResponseNew({ response: AddArbiCoinConfigList, isList: false })) {

                        // add message to state for showing it after image upload success
                        this.setState({ responseMsg: AddArbiCoinConfigList.ReturnMsg != null ? AddArbiCoinConfigList.ReturnMsg : R.strings.coinAdded })

                        //check for call image upload or not
                        if (this.state.isAddUpdateImage) {
                            this.callUploadLogoAPI();
                        } else {
                            showAlert(R.strings.Status, AddArbiCoinConfigList.ReturnMsg != null ? AddArbiCoinConfigList.ReturnMsg : R.strings.coinAdded, 0, () => {
                                //clear add data
                                this.props.clearArbiCoinConfigurationData()

                                //refresh previous list
                                this.props.navigation.state.params.onSuccess()

                                //navigate to back scrreen
                                this.props.navigation.goBack()
                            })
                        }
                    } else {
                        //clear add data
                        this.props.clearArbiCoinConfigurationData()
                    }
                }
            } catch (error) {
                //logger('Add Coin Configuration List : ' + error.message);
            }
        }

        // compare response with previous response
        if (UpdateArbiCoinConfigList !== prevProps.coinConfigurationResult.UpdateArbiCoinConfigList) {
            try {
                // check response is available
                if (UpdateArbiCoinConfigList) {

                    //if UpdateArbiCoinConfigList response is success then store array list else store empty list
                    if (validateResponseNew({ response: UpdateArbiCoinConfigList, isList: false })) {

                        // add message to state for showing it after image upload success
                        this.setState({ responseMsg: UpdateArbiCoinConfigList.ReturnMsg != null ? UpdateArbiCoinConfigList.ReturnMsg : R.strings.coinUpdated })

                        //check for call image upload or not
                        if (this.state.isAddUpdateImage) {
                            this.callUploadLogoAPI();
                        } else {
                            showAlert(R.strings.Status, UpdateArbiCoinConfigList.ReturnMsg != null ? UpdateArbiCoinConfigList.ReturnMsg : R.strings.coinUpdated, 0, () => {
                                //clear add data
                                this.props.clearArbiCoinConfigurationData()

                                //refresh previous list
                                this.props.navigation.state.params.onSuccess()

                                //navigate to back scrreen
                                this.props.navigation.goBack()
                            })
                        }
                    } else {
                        //clear add data
                        this.props.clearArbiCoinConfigurationData()
                    }
                }
            } catch (error) {
                //logger('Update Coin Configuration List : ' + error.message);
            }
        }

        if (AddCurrencyLogodata !== prevProps.coinConfigurationResult.AddCurrencyLogodata) {

            //To Check add Currency Logo Data Fetch Or Not
            if (AddCurrencyLogodata) {
                try {
                    if (validateResponseNew({ response: AddCurrencyLogodata })) {
                        // on success responce Refresh List
                        showAlert(R.strings.Success, this.state.responseMsg, 0, () => {
                            this.setState({
                                CurrencyName: '',
                                imageDetails: {
                                    ...this.state.imageDetails,
                                    name: '',
                                },
                            })

                            // clear reducer data
                            this.props.clearArbiCoinConfigurationData()

                            //refresh previous list
                            this.props.navigation.state.params.onSuccess()

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

    // used for validate Url 
    validateUrl = (url) => {
        var urlReg = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})"
        if (url.match(urlReg)) {
            return true
        }
        return false
    }

    async callUploadLogoAPI() {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Add Currency Logo
            let addCurrencyLogoRequest = { CurrencyName: this.state.smsCode, Image: this.state.imageDetails }

            //call add Currency Logo Api
            this.props.addCurrencyLogo(addCurrencyLogoRequest);
        }
    }

    // on submit button
    onPressSubmit = async () => {

        let Community = [], communityValidate = true;
        let Explorer = [], explorerValidate = true;

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

        //If feed limit type is selected or not
        if (isEmpty(this.state.coinName))
            this.toast.Show(R.strings.enterCoinName);

        else if (isEmpty(this.state.smsCode))
            this.toast.Show(R.strings.enterSMSCode);

        else if (isEmpty(this.state.issueDate))
            this.toast.Show(R.strings.enterIssueDate);

        else if (isEmpty(this.state.websiteURL))
            this.toast.Show(R.strings.enterWebsiteURL);

        else if (isEmpty(this.state.introduction))
            this.toast.Show(R.strings.enterIntroduction);

        else if (!this.validateUrl(this.state.websiteURL))
            this.toast.Show(R.strings.enterValidURL);

        else if (this.state.selectedStatus.code === -1)
            this.toast.Show(R.strings.statusValidate);

        else if (!explorerValidate || !communityValidate)
            //returns because exploer or community not proper
            return;

        else if (!this.state.isEdit && isEmpty(this.state.imageDetails.name))
            this.toast.Show(R.strings.Image_Validation)

        else {
            let request = {
                Name: this.state.coinName,
                SMSCode: this.state.smsCode,
                MaxSupply: isEmpty(this.state.maxSupply) ? 0 : parseInt(this.state.maxSupply),
                WebsiteUrl: this.state.websiteURL,
                IssueDate: this.state.issueDate,
                CirculatingSupply: isEmpty(this.state.cirSupply) ? 0 : parseInt(this.state.cirSupply),
                IssuePrice: isEmpty(this.state.issuePrice) ? 0 : parseInt(this.state.issuePrice),
                TotalSupply: isEmpty(this.state.totalSupply) ? 0 : parseInt(this.state.totalSupply),
                IsTransaction: this.state.isTransaction ? parseInt(1) : parseInt(0),
                IsWithdraw: this.state.isWithdraw ? parseInt(1) : parseInt(0),
                IsDeposit: this.state.isDeposit ? parseInt(1) : parseInt(0),
                Introduction: this.state.introduction,
                IsBaseCurrency: this.state.isBaseCurrency ? parseInt(1) : parseInt(0),
                Status: this.state.selectedStatus.code,
                Explorer: Explorer.length != 0 ? Explorer : [{ Data: '' }],
                Community: Community.length != 0 ? Community : [{ Data: '' }],
            }
            //Check NetWork is Available or not
            if (await isInternet()) {

                //if screen is for Updating existing record then add ID of current item
                if (this.state.isEdit) {

                    request = {
                        ServiceId: this.state.ID,
                        ...request,
                    }

                    // call API  for Updating API
                    this.props.updateArbiCoinConfigurationListData(request);
                } else {
                    // call API for Adding API
                    this.props.addArbiCoinConfigurationListData(request);
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
                                uri: response.uri, type: response.type,
                                name: response.fileName, data: response.data
                            },
                            logoImage: response.uri,
                            isAddUpdateImage: true,
                        });

                    } else {
                        //To Display Toast using Reference
                        this.toast.Show(R.strings.file_validation);

                        //store empty name for given state
                        this.setState({
                            isAddUpdateImage: false,
                            imageDetails: {
                                ...this.state.imageDetails, name: '',
                            },
                        });
                    }
                }
            }
        })
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { AddArbiCoinConfigLoading, UpdateArbiCoinConfigLoading, isLoadinCurrencyLogo } = this.props.coinConfigurationResult;

        return (
            <SafeView style={this.styles().container}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar title={this.state.title} isBack={true} nav={this.props.navigation} />

                {/* Common progress dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={AddArbiCoinConfigLoading || UpdateArbiCoinConfigLoading || isLoadinCurrencyLogo} />

                {/* Common Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* To Set CoinName in EditText */}
                            <EditText
                                reference={input => { this.inputs['etArbiCoinName'] = input; }}
                                value={this.state.coinName}
                                isRequired={true}
                                header={R.strings.CoinName}
                                placeholder={R.strings.CoinName}
                                keyboardType='default'
                                maxLength={35}
                                blurOnSubmit={false}
                                onChangeText={(text) => this.setState({ coinName: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etArbiSMSCode'].focus() }} />

                            {/* To Set smsCode in EditText */}
                            <EditText
                                reference={input => { this.inputs['etArbiSMSCode'] = input; }}
                                value={this.state.smsCode}
                                placeholder={R.strings.smsCode}
                                keyboardType='default'
                                maxLength={35}
                                onChangeText={(text) => this.setState({ smsCode: text })}
                                multiline={false}
                                header={R.strings.smsCode}
                                blurOnSubmit={false}
                                isRequired={true}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etArbiTotalSupply'].focus() }} />

                            {/* To Set totalSupply in EditText */}
                            <EditText
                                reference={input => { this.inputs['etArbiTotalSupply'] = input; }}
                                validate={true} header={R.strings.total_supply}
                                placeholder={R.strings.total_supply}
                                keyboardType='numeric'
                                onChangeText={(text) => this.setState({ totalSupply: text })}
                                multiline={false}
                                validateNumeric={true} maxLength={35} blurOnSubmit={false}
                                returnKeyType={"next"}
                                value={this.state.totalSupply}
                                onSubmitEditing={() => { this.inputs['etArbiMaxSupply'].focus() }} />

                            {/* To Set maxSupply in EditText */}
                            <EditText
                                multiline={false} maxLength={35} returnKeyType={"next"}
                                value={this.state.maxSupply} header={R.strings.max_supply}
                                placeholder={R.strings.max_supply}
                                validateNumeric={true}
                                keyboardType='numeric'
                                reference={input => { this.inputs['etArbiMaxSupply'] = input; }}
                                validate={true}
                                onChangeText={(text) => this.setState({ maxSupply: text })}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etArbiIssuePrice'].focus() }} />

                            {/* To Set smissuePricesCode in EditText */}
                            <EditText
                                reference={input => { this.inputs['etArbiIssuePrice'] = input; }}
                                header={R.strings.issue_price}
                                value={this.state.issuePrice}
                                placeholder={R.strings.issue_price}
                                validate={true}
                                multiline={false} returnKeyType={"next"}
                                validateNumeric={true}
                                blurOnSubmit={false}
                                maxLength={35} onChangeText={(text) => this.setState({ issuePrice: text })}
                                keyboardType='numeric'
                                onSubmitEditing={() => { this.inputs['etArbiCirSupply'].focus() }} />

                            {/* To Set cirSupply in EditText */}
                            <EditText
                                validate={true} blurOnSubmit={false}
                                reference={input => { this.inputs['etArbiCirSupply'] = input; }}
                                value={this.state.cirSupply} header={R.strings.circulating_supply}
                                placeholder={R.strings.circulating_supply}
                                validateNumeric={true} maxLength={35}
                                onChangeText={(text) => this.setState({ cirSupply: text })}
                                returnKeyType={"next"}
                                keyboardType='numeric'
                                multiline={false}
                                onSubmitEditing={() => { this.inputs['etArbiWebsiteURL'].focus() }} />

                            {/* To Set websiteURL in EditText */}
                            <EditText
                                reference={input => { this.inputs['etArbiWebsiteURL'] = input; }}
                                blurOnSubmit={false}
                                header={R.strings.websiteURL}
                                keyboardType='url'
                                placeholder={R.strings.websiteURL} value={this.state.websiteURL}
                                onChangeText={(text) => this.setState({ websiteURL: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                isRequired={true}
                                onSubmitEditing={() => { this.inputs['etArbiIntroduction'].focus() }} />

                            {/* To Set introduction in EditText */}
                            <EditText
                                onChangeText={(text) => this.setState({ introduction: text })}
                                header={R.strings.introduction} placeholder={R.strings.introduction}
                                value={this.state.introduction}
                                isRequired={true}
                                keyboardType='default'
                                multiline={true}
                                reference={input => { this.inputs['etArbiIntroduction'] = input; }}
                                multiline={false}
                                returnKeyType={"done"} />

                            {/* dropdown for status selection */}
                            <TitlePicker
                                title={R.strings.status}
                                isRequired={true}
                                array={this.state.statuses}
                                selectedValue={this.state.selectedStatus.value}
                                onPickerSelect={(index, object) => {
                                    this.setState({ selectedStatus: object })
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }} />

                            {/* DatePicker for issueDate */}
                            <DatePickerWidget
                                fromTitle={R.strings.issue_date}
                                FromDate={this.state.issueDate}
                                isRequired={true}
                                FromDatePickerCall={(date) => this.setState({ issueDate: date })}
                                allowFutureDate={true}
                                allowPastDate={false} />

                            <View style={{ marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'column', alignItems: 'flex-start' }}>

                                <ImageTextButton
                                    name={R.strings.usedForTransaction}
                                    isHML
                                    icon={this.state.isTransaction ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={() => this.setState({ isTransaction: !this.state.isTransaction })}
                                    style={this.styles().imgButtonStyle}
                                    textStyle={this.styles().imgButtonTextStyle}
                                    iconStyle={{ tintColor: this.state.isTransaction ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />
                                <ImageTextButton
                                    name={R.strings.usedForWithdraw}
                                    isHML
                                    icon={this.state.isWithdraw ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={() => this.setState({ isWithdraw: !this.state.isWithdraw })}
                                    style={this.styles().imgButtonStyle}
                                    textStyle={this.styles().imgButtonTextStyle}
                                    iconStyle={{ tintColor: this.state.isWithdraw ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />
                                <ImageTextButton
                                    name={R.strings.usedForDeposit}
                                    isHML
                                    icon={this.state.isDeposit ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={() => this.setState({ isDeposit: !this.state.isDeposit })}
                                    style={this.styles().imgButtonStyle}
                                    textStyle={this.styles().imgButtonTextStyle}
                                    iconStyle={{ tintColor: this.state.isDeposit ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />
                                <ImageTextButton
                                    name={R.strings.usedForBaseCurrency}
                                    isHML
                                    icon={this.state.isBaseCurrency ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                                    onPress={() => this.setState({ isBaseCurrency: !this.state.isBaseCurrency })}
                                    style={this.styles().imgButtonStyle}
                                    textStyle={this.styles().imgButtonTextStyle}
                                    iconStyle={{ tintColor: this.state.isBaseCurrency ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />
                            </View>

                            <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.explorer}</Text>

                            {this.state.explorer.map((el, index) => {
                                return <EditText key={index} value={el.Data}
                                    reference={input => { this.inputs['et' + el + index] = input; }}
                                    keyboardType='url'
                                    placeholder={R.strings.explorer}
                                    onChangeText={(text) => {
                                        explorer[index].Data = text;
                                        let explorer = this.state.explorer;
                                        this.setState({ explorer })
                                    }}
                                    blurOnSubmit={this.state.explorer.length - 1 == index ? true : false}
                                    rightImage={index == 0 ? R.images.IC_PLUS : R.images.IC_DELETE}
                                    multiline={false} returnKeyType={this.state.explorer.length - 1 == index ? "done" : "next"}
                                    onPressRight={() => {
                                        let explorer = this.state.explorer;
                                        if (index == 0)
                                            explorer.push({ Data: '' });
                                        else
                                            explorer.splice(index, 1);
                                        this.setState({ explorer });
                                    }}
                                    onSubmitEditing={() => {
                                        if (this.state.explorer.length - 1 != index) {
                                            this.inputs['et' + el + (index + 1)].focus()
                                        }
                                    }} />
                            })}
                            <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.community}</Text>

                            {this.state.community.map((el, index) => {
                                return <EditText
                                    reference={input => { this.inputs['et' + el + index] = input; }} value={el.Data}
                                    placeholder={R.strings.community} keyboardType='url'
                                    key={index}
                                    onChangeText={(text) => {
                                        let community = this.state.community;
                                        this.setState({ community }); community[index].Data = text;
                                    }}
                                    blurOnSubmit={this.state.community.length - 1 == index ? true : false}
                                    multiline={false} returnKeyType={this.state.community.length - 1 == index ? "done" : "next"}
                                    rightImage={index == 0 ? R.images.IC_PLUS : R.images.IC_DELETE}
                                    onPressRight={() => {
                                        let community = this.state.community;
                                        if (index == 0)
                                            community.push({ Data: '' });
                                        else
                                            community.splice(index, 1);
                                        this.setState({ community });
                                    }}
                                    onSubmitEditing={() => {
                                        if (this.state.community.length - 1 != index) {
                                            this.inputs['et' + el + (index + 1)].focus()
                                        }
                                    }} />
                            })}

                            {/* Choose file for Coin Image   */}
                            <ReturnTitleImagePicker
                                imageDetails={this.state.imageDetails}
                                text={isEmpty(this.state.imageDetails.name) ? R.strings.coinConfigurationImage : this.state.imageDetails.name}
                                logoImage={this.state.logoImage}
                                onPress={this.showImagePicker}
                            />
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button
                            style={{
                                /* margin: R.dimens.widgetMargin,
                                marginLeft: R.dimens.widget_left_right_margin,
                                marginRight: R.dimens.widget_left_right_margin, */
                            }} title={this.state.isEdit ? R.strings.update : R.strings.add}
                            onPress={this.onPressSubmit} />
                    </View>
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: R.colors.background
            },
            imgButtonStyle: {
                margin: R.dimens.widgetMargin,
                marginRight: 0,
                flexDirection: 'row-reverse'
            },
            imgButtonTextStyle: {
                color: R.colors.textPrimary,
                marginLeft: R.dimens.widgetMargin
            }
        }
    }
}

// class for image upload functionality
class ReturnTitleImagePicker extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.text !== nextProps.text || this.props.onPress !== nextProps.onPress || this.props.logoImage !== nextProps.logoImage) {
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
                            <View style={{ alignItems: 'flex-start', flex: 1, }}>
                                <Image
                                    style={{
                                        flex: 1, alignItems: 'flex-start',
                                        resizeMode: Image.resizeMode.contain,
                                        height: R.dimens.IconWidthHeight,
                                        width: R.dimens.IconWidthHeight,
                                    }}
                                    source={{ uri: base64Icon }} />
                            </View>
                            :
                            <View style={{ flex: 1, }}>
                                <ImageViewWidget url={logoImage ? logoImage : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />
                            </View>
                        :
                        <TextViewMR style={{ color: R.colors.textPrimary, flex: 1, fontSize: R.dimens.smallText, marginRight: R.dimens.toolBarOutlineButtonPadding }}>{text}</TextViewMR>
                    }
                    <TouchableOpacity onPress={onPress} >
                        <View style={this.styles().choosebutton}>
                            <ImageTextButton
                                style={{ margin: R.dimens.widgetMargin, }}
                                onPress={onPress}
                                icon={R.images.IC_UPLOAD}
                                iconStyle={this.styles().icon_style}
                            />
                            <TextViewHML
                                style={{ color: R.colors.white, fontSize: R.dimens.smallestText,  marginRight: R.dimens.widgetMargin, textAlign: 'center' }}
                            >
                                {R.strings.Upload}
                            </TextViewHML>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    styles = () => {
        return ({
            choosebutton: {
                borderRadius: R.dimens.CardViewElivation, alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row', backgroundColor: R.colors.accent,
            },
            icon_style: {
                width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon,
                tintColor: R.colors.white,
            }
        })
    }
}

function mapStateToProps(state) {
    // data from coin configuration reducer
    return {
        coinConfigurationResult: state.ArbitrageCoinConfigurationReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {

        // for add coin configuration
        addArbiCoinConfigurationListData: (payload) => dispatch(addArbiCoinConfigurationListData(payload)),

        // for Update coin configuration
        updateArbiCoinConfigurationListData: (payload) => dispatch(updateArbiCoinConfigurationListData(payload)),

        // // for adding coin image 
        addCurrencyLogo: (request) => dispatch(addCurrencyLogo(request)),

        // for clear reducer
        clearArbiCoinConfigurationData: () => dispatch(clearArbiCoinConfigurationData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageCoinConfigurationAddEditScreen)