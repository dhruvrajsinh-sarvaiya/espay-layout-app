import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import {
    addFeedLimitList,
    updateFeedLimitList,
    clearAddUpdateFeedLimitConfig,
    getExchangeFeedLimit,
} from '../../../actions/Trading/FeedLimitConfigAction'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import Button from '../../../native_theme/components/Button';
import { changeTheme, parseArray, parseFloatVal } from '../../../controllers/CommonUtils';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { isInternet, validateResponseNew, isEmpty, } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../../components/Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { showAlert } from '../../../controllers/CommonUtils';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import EditText from '../../../native_theme/components/EditText';
import AlertDialog from '../../../native_theme/components/AlertDialog';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import SafeView from '../../../native_theme/components/SafeView';

class FeedLimitConfigAddScreen extends Component {

    constructor(props) {
        super(props)

        //Create reference
        this.toast = React.createRef();
        this.progressDialog = React.createRef();

        //Data from previous screen
        let { item, isEdit } = props.navigation.state.params;
        this.inputs = {};

        //Define all initial state
        this.state = {
            title: (isEdit ? R.strings.updateExchangeFeedLimit : R.strings.addExchangeFeedLimit),
            isEdit,

            ID: isEdit && item !== undefined ? item.ID : null,

            maxRowCount: item !== undefined ? item.MaxRowCount.toString() : '',
            minSize: item !== undefined ? item.MinSize.toString() : '',
            maxSize: item !== undefined ? item.MaxSize.toString() : '',
            minRecordCount: item !== undefined ? item.MinRecordCount.toString() : '',
            maxRecordCount: item !== undefined ? item.MaxRecordCount.toString() : '',
            minLimit: item !== undefined ? item.MinLimit.toString() : '',
            maxLimit: item !== undefined ? item.MaxLimit.toString() : '',
            rowSize: item !== undefined ? item.RowLenghtSize.toString() : '',

            feedLimits: [{ value: R.strings.Please_Select }],
            selectedFeedLimit: item !== undefined ? item.LimitDesc : R.strings.Please_Select,
            selectedFeedLimitID: item !== undefined ? item.ID : 0,

            statuses: [{ value: R.strings.Please_Select }, { value: R.strings.active, code: 1 }, { value: R.strings.inActive, code: 0 }],
            selectedStatus: item !== undefined ? (item.Status == 0 ? R.strings.inActive : R.strings.active) : R.strings.Please_Select,
            selectedStatusCode: item !== undefined ? item.Status : null,

            showInfo: false,
            showMessage: '',
            isFirstTime: true,
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get socket method list
            this.props.getExchangeFeedLimit();
        }
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
        if (FeedLimitConfigAddScreen.oldProps !== props) {
            FeedLimitConfigAddScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { feedLimitTypes } = props.appData;

            //if feedLimitTypes response is not null then handle resposne
            if (feedLimitTypes) {
                try {
                    //if local feedLimitTypes state is null or its not null and also different then new response then and only then validate response.
                    if (state.feedLimitTypes == null || (state.feedLimitTypes != null && feedLimitTypes !== state.feedLimitTypes)) {

                        //if feedLimitTypes response is success then store array list else store empty list
                        if (validateResponseNew({ response: feedLimitTypes, isList: true })) {
                            let res = parseArray(feedLimitTypes.Response);

                            let data = [{ value: R.strings.Please_Select }];
                            res.map(el => {
                                data.push({
                                    value: el.LimitType,
                                    ...el,
                                })
                            })
                            return { ...state, feedLimitTypes, feedLimits: data };
                        } else {
                            return { ...state, feedLimitTypes, feedLimits: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (error) {
                    return { ...state, feedLimits: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { addFeedLimitListData, updateFeedLimitListData } = this.props.appData;

        if (addFeedLimitListData !== prevProps.appData.addFeedLimitListData) {
            //if addFeedLimitListData response is not null then handle resposne
            if (addFeedLimitListData) {
                try {
                    //if local addFeedLimitListData state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.addFeedLimitListData == null || (this.state.addFeedLimitListData != null && addFeedLimitListData !== this.state.addFeedLimitListData)) {

                        //if addFeedLimitListData response is success then store array list else store empty list
                        if (validateResponseNew({ response: addFeedLimitListData, isList: false })) {
                            showAlert(R.strings.Status, addFeedLimitListData.ReturnMsg, 0, () => {
                                //clear add data
                                this.props.clearAddUpdate()

                                //refresh previous list
                                this.props.navigation.state.params.onRefresh(true)

                                //navigate to back scrreen
                                this.props.navigation.goBack()
                            })
                        } else {
                            //clear add data
                            this.props.clearAddUpdate()
                        }
                    }
                } catch (e) {
                    this.props.clearAddUpdate()
                }
            }
        }

        if (updateFeedLimitListData !== prevProps.appData.updateFeedLimitListData) {
            if (updateFeedLimitListData) {
                try {
                    //if local updateFeedLimitListData state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.updateFeedLimitListData == null || (this.state.updateFeedLimitListData != null && updateFeedLimitListData !== this.state.updateFeedLimitListData)) {

                        //if updateFeedLimitListData response is success then store array list else store empty list
                        if (validateResponseNew({ response: updateFeedLimitListData, isList: false })) {
                            showAlert(R.strings.Status, updateFeedLimitListData.ReturnMsg, 0, () => {
                                //clear add data
                                this.props.clearAddUpdate()

                                //refresh previous list
                                this.props.navigation.state.params.onRefresh(true)

                                //navigate to back scrreen
                                this.props.navigation.goBack()
                            })
                        } else {
                            //clear add data
                            this.props.clearAddUpdate()
                        }
                    }
                } catch (e) {
                    this.props.clearAddUpdate()
                }
            }
        }
    }

    onPressSubmit = async () => {
        //If feed limit type is selected or not
        if (this.state.selectedFeedLimit === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectFeedLimitType);
        }
        else if (isEmpty(this.state.minSize) || isEmpty(this.state.maxSize)) {
            this.toast.Show(R.strings.enterMinMaxSize);
        }
        else if (isEmpty(this.state.minRecordCount) || isEmpty(this.state.maxRecordCount)) {
            this.toast.Show(R.strings.enterMinMaxRecordCount);
        }
        else if (isEmpty(this.state.minLimit) || isEmpty(this.state.maxLimit)) {
            this.toast.Show(R.strings.enterMinMaxLimit);
        }
        else if (parseFloatVal(this.state.minSize) > parseFloatVal(this.state.maxSize)) {
            this.toast.Show(R.strings.enterMinMaxSizeValidate);
        }
        else if (parseFloatVal(this.state.minRecordCount) > parseFloatVal(this.state.maxRecordCount)) {
            this.toast.Show(R.strings.enterMinMaxRecordCountValidate);
        }
        else if (parseFloatVal(this.state.minLimit) > parseFloatVal(this.state.maxLimit)) {
            this.toast.Show(R.strings.enterMinMaxLimitValidate);
        }
        else if (this.state.selectedStatus === R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.status);
        } else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                let request = {
                    MaxSize: isEmpty(this.state.maxSize) ? 0 : parseFloatVal(this.state.maxSize),
                    MinSize: isEmpty(this.state.minSize) ? 0 : parseFloatVal(this.state.minSize),
                    RowLenghtSize: isEmpty(this.state.rowSize) ? 0 : parseFloatVal(this.state.rowSize),
                    MaxRowCount: isEmpty(this.state.maxRowCount) ? 0 : parseFloatVal(this.state.maxRowCount),
                    MaxRecordCount: isEmpty(this.state.maxRecordCount) ? 0 : parseFloatVal(this.state.maxRecordCount),
                    MinRecordCount: isEmpty(this.state.minRecordCount) ? 0 : parseFloatVal(this.state.minRecordCount),
                    MaxLimit: isEmpty(this.state.maxLimit) ? 0 : parseFloatVal(this.state.maxLimit),
                    MinLimit: isEmpty(this.state.minLimit) ? 0 : parseFloatVal(this.state.minLimit),
                    LimitType: this.state.selectedFeedLimitID,
                    LimitDesc: this.state.selectedFeedLimit,
                    Status: this.state.selectedStatusCode,
                }

                //if screen is for Updating existing record then add ID of current item
                if (this.state.isEdit) {

                    request = Object.assign({}, request, {
                        ID: this.state.ID
                    })

                    // call API  for Updating API
                    this.props.updateFeedLimitList(request);
                } else {

                    // call API for Adding API
                    this.props.addFeedLimitList(request);
                }
            }
        }
    }

    render() {

        let { isLoadingFeedLimitTypes, isAddingFeedLimit, isUpdatingFeedLimit } = this.props.appData;

        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={this.state.title} isBack={true} nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={isLoadingFeedLimitTypes || isAddingFeedLimit || isUpdatingFeedLimit} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {this.alertDialogInfo()}

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* dropdown for feedLimit */}
                            <TitlePicker
                                title={R.strings.feedLimit}
                                isRequired={true}
                                array={this.state.feedLimits}
                                selectedValue={this.state.selectedFeedLimit}
                                onPickerSelect={(index, object) => {
                                    this.setState({ selectedFeedLimit: index, selectedFeedLimitID: object.ID })
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }} />

                            {/* Inputfield for maxRowCount */}
                            <EditText
                                reference={input => { this.inputs['etMaxRowCount'] = input; }}
                                value={this.state.maxRowCount}
                                header={R.strings.maxRowCount}
                                placeholder={R.strings.maxRowCount}
                                keyboardType='numeric'
                                validate={true}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ maxRowCount: text })}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etMinSize'].focus() }}
                                headerIcon={R.images.IC_INFO}
                                multiline={false} returnKeyType={"next"}
                                headerIconStyle={{ tintColor: R.colors.accent }}
                                onPressHeaderIcon={() => this.setState({ showInfo: true, showMessage: R.strings["exchangefeed.tooltip.maxrowcount"] })} />

                            {/* Inputfield for minSize */}
                            <EditText
                                reference={input => { this.inputs['etMinSize'] = input; }}
                                value={this.state.minSize}
                                header={R.strings.minSize}
                                placeholder={R.strings.minSize}
                                keyboardType='numeric'
                                validate={true}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ minSize: text })}
                                returnKeyType={"next"}  blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etMaxSize'].focus() }}
                                headerIconStyle={{ tintColor: R.colors.accent }}
                                multiline={false}  headerIcon={R.images.IC_INFO}
                                onPressHeaderIcon={() => this.setState({ showInfo: true, showMessage: R.strings["exchangefeed.tooltip.minsize"] })} />

                            {/* Inputfield for maxSize */}
                            <EditText
                                reference={input => { this.inputs['etMaxSize'] = input; }}
                                header={R.strings.maxSize}
                                placeholder={R.strings.maxSize}
                                keyboardType='numeric'
                                blurOnSubmit={false}
                                multiline={false}
                                validate={true}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ maxSize: text })}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etMinRecordCount'].focus() }}
                                headerIconStyle={{ tintColor: R.colors.accent }}
                                headerIcon={R.images.IC_INFO}
                                value={this.state.maxSize}
                                onPressHeaderIcon={() => this.setState({ showInfo: true, showMessage: R.strings["exchangefeed.tooltip.maxsize"] })} />

                            {/* Inputfield for minRecordCount */}
                            <EditText
                                reference={input => { this.inputs['etMinRecordCount'] = input; }}
                                value={this.state.minRecordCount}
                                headerIconStyle={{ tintColor: R.colors.accent }}
                                header={R.strings.minRecordCount}
                                blurOnSubmit={false}
                                keyboardType='numeric'
                                validate={true}
                                multiline={false}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ minRecordCount: text })}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etMaxRecordCount'].focus() }}
                                placeholder={R.strings.minRecordCount}
                                headerIcon={R.images.IC_INFO}
                                onPressHeaderIcon={() => this.setState({ showInfo: true, showMessage: R.strings["exchangefeed.tooltip.minrecordcount"] })} />

                            {/* Inputfield for maxRecordCount */}
                            <EditText
                                reference={input => { this.inputs['etMaxRecordCount'] = input; }}
                                headerIconStyle={{ tintColor: R.colors.accent }}
                                value={this.state.maxRecordCount}
                                header={R.strings.maxRecordCount}
                                placeholder={R.strings.maxRecordCount}
                                blurOnSubmit={false}
                                validate={true}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ maxRecordCount: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.inputs['etMinLimit'].focus() }}
                                headerIcon={R.images.IC_INFO}
                                keyboardType='numeric'
                                onPressHeaderIcon={() => this.setState({ showInfo: true, showMessage: R.strings["exchangefeed.tooltip.maxrecordcount"] })} />

                            {/* Inputfield for minLimit */}
                            <EditText
                                reference={input => { this.inputs['etMinLimit'] = input; }}
                                header={R.strings.minLimit}
                                headerIconStyle={{ tintColor: R.colors.accent }}
                                placeholder={R.strings.minLimit}
                                keyboardType='numeric'
                                validate={true}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ minLimit: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etMaxLimit'].focus() }}
                                headerIcon={R.images.IC_INFO}
                                value={this.state.minLimit}
                                onPressHeaderIcon={() => this.setState({ showInfo: true, showMessage: R.strings["exchangefeed.tooltip.minlimit"] })} />

                            {/* Inputfield for maxLimit */}
                            <EditText
                                reference={input => { this.inputs['etMaxLimit'] = input; }}
                                returnKeyType={"next"}   onSubmitEditing={() => { this.inputs['etRowSize'].focus() }}
                                value={this.state.maxLimit}
                                keyboardType='numeric'
                                validate={true}
                                validateNumeric={true}
                                maxLength={35}
                                header={R.strings.maxLimit}   placeholder={R.strings.maxLimit}
                                onChangeText={(text) => this.setState({ maxLimit: text })}  multiline={false}
                                headerIcon={R.images.IC_INFO}
                                headerIconStyle={{ tintColor: R.colors.accent }}
                                onPressHeaderIcon={() => this.setState({ showInfo: true, showMessage: R.strings["exchangefeed.tooltip.maxlimit"] })} />

                            {/* Inputfield for rowSize */}
                            <EditText
                                reference={input => { this.inputs['etRowSize'] = input; }}
                                value={this.state.rowSize}
                                header={R.strings.rowSize}
                                placeholder={R.strings.rowSize}
                                keyboardType='numeric'
                                validate={true}
                                validateNumeric={true}
                                maxLength={35}
                                onChangeText={(text) => this.setState({ rowSize: text })}
                                multiline={false}
                                returnKeyType={"done"}
                                headerIcon={R.images.IC_INFO}
                                headerIconStyle={{ tintColor: R.colors.accent }}
                                onPressHeaderIcon={() => this.setState({ showInfo: true, showMessage: R.strings["exchangefeed.tooltip.rowlength"] })} />

                            {/* dropdown for status */}
                            <TitlePicker
                                title={R.strings.status}
                                isRequired={true}
                                array={this.state.statuses}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(index, object) => {
                                    this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }} />
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button
                            title={this.state.isEdit ? R.strings.update : R.strings.add}
                            onPress={this.onPressSubmit} />
                    </View>
                </View>
            </SafeView>
        );
    }

    alertDialogInfo() {
        return (<AlertDialog
            visible={this.state.showInfo}
            title={R.strings.Information}
            negativeButton={{
                hide: true
            }}
            positiveButton={{
                title: R.strings.OK,
                onPress: () => this.setState({ showInfo: false }),
            }}
            requestClose={() => null}>

            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}>
                {this.state.showMessage}
            </TextViewHML>

        </AlertDialog>)
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
        //Updated feedLimitConfigReducer Data 
        appData: state.feedLimitConfigReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform addFeedLimitList action
        addFeedLimitList: (payload) => dispatch(addFeedLimitList(payload)),
        //Perform updateFeedLimitList action
        updateFeedLimitList: (payload) => dispatch(updateFeedLimitList(payload)),
        //Perform getExchangeFeedLimit action
        getExchangeFeedLimit: () => dispatch(getExchangeFeedLimit()),
        //clear data
        clearAddUpdate: () => dispatch(clearAddUpdateFeedLimitConfig()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FeedLimitConfigAddScreen)
