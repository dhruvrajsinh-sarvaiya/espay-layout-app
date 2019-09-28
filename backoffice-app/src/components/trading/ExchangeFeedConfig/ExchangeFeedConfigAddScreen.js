import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import {
    addExchangeConfigurationList,
    updateExchangeConfigurationList,
    clearAdd,
    clearUpdate,
    getExchangeFeedConfigSocket,
    getExchangeFeedConfigLimits
} from '../../../actions/Trading/ExchangeFeedConfigAction'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import Button from '../../../native_theme/components/Button';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { isCurrentScreen } from '../../../components/Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { showAlert } from '../../../controllers/CommonUtils';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import SafeView from '../../../native_theme/components/SafeView';

class ExchangeFeedConfigAddScreen extends Component {

    constructor(props) {
        super(props)

        //Create reference
        this.toast = React.createRef();
        this.progressDialog = React.createRef();

        //Data from previous screen
        let { item, isEdit } = props.navigation.state.params;

        //Define all initial state
        this.state = {
            title: (isEdit ? R.strings.update_feed_configuration : R.strings.add_feed_configuration),
            isEdit,

            ID: isEdit && item !== undefined ? item.Id : null,
            socketMethodsList: [{ value: R.strings.Please_Select }],
            selectedSocketMethod: item !== undefined ? item.MethodName : R.strings.Please_Select,
            selectedSocketMethodID: item !== undefined ? item.MethodID : 0,

            limitMethodsList: [{ value: R.strings.Please_Select }],
            selectedLimitMethod: item !== undefined ? ('Limit' + ' ' + item.MinLimit + '-' + item.MaxLimit + ', ' + 'Size' + ' ' + item.MinSize + '-' + item.MaxSize) : R.strings.Please_Select,
            selectedLimitMethodID: item !== undefined ? item.LimitID : 0,

            statuses: [{ value: R.strings.Please_Select }, { value: R.strings.Active, code: 1 }, { value: R.strings.Inactive, code: 0 }],
            selectedStatus: item !== undefined ? item.StatusText : R.strings.Please_Select,
            selectedStatusCode: item !== undefined ? item.Status : null,

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
            this.props.getExchangeFeedConfigSocket();

            //To get limit of methods list
            this.props.getExchangeFeedConfigLimits();
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
        if (ExchangeFeedConfigAddScreen.oldProps !== props) {
            ExchangeFeedConfigAddScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { socketMethods, limitMethods, } = props.appData;

            //if socketMethods response is not null then handle resposne
            if (socketMethods) {
                try {
                    //if local socketMethods state is null or its not null and also different then new response then and only then validate response.
                    if (state.socketMethods == null || (state.socketMethods != null && socketMethods !== state.socketMethods)) {

                        //if socketMethods response is success then store array list else store empty list
                        if (validateResponseNew({ response: socketMethods, isList: true })) {
                            let res = parseArray(socketMethods.Response);

                            let data = [{ value: R.strings.Please_Select }];
                            res.map(el => {
                                data.push({
                                    value: el.MethodName,
                                    ...el,
                                })
                            })

                            return { ...state, socketMethods, socketMethodsList: data };
                        } else {
                            return { ...state, socketMethods, socketMethodsList: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, socketMethodsList: [{ value: R.strings.Please_Select }] };
                }

            }

            //if limitMethods response is not null then handle resposne
            if (limitMethods) {
                try {
                    //if local limitMethods state is null or its not null and also different then new response then and only then validate response.
                    if (state.limitMethods == null || (state.limitMethods != null && limitMethods !== state.limitMethods)) {

                        //if limitMethods response is success then store array list else store empty list
                        if (validateResponseNew({ response: limitMethods, isList: true })) {
                            let res = parseArray(limitMethods.Response);

                            let data = [{ value: R.strings.Please_Select }];
                            res.map(el => {
                                data.push({
                                    value: el.LimitDesc,
                                    ...el,
                                })
                            })

                            return { ...state, limitMethods, limitMethodsList: data };
                        } else {
                            return { ...state, limitMethods, limitMethodsList: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, limitMethodsList: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { addExchangeFeedList, updateExchangeFeedList } = this.props.appData;

        if (addExchangeFeedList !== prevProps.appData.addExchangeFeedList) {

            if (addExchangeFeedList) {
                try {
                    //if local addExchangeFeedList state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.addExchangeFeedList == null || (this.state.addExchangeFeedList != null && addExchangeFeedList !== this.state.addExchangeFeedList)) {
                        //if addExchangeFeedList response is success then store array list else store empty list
                        if (validateResponseNew({ response: addExchangeFeedList, isList: false })) {
                            showAlert(R.strings.Status, addExchangeFeedList.ReturnMsg, 0, () => {
                                //clear add data
                                this.props.clearAdd()

                                //refresh previous list
                                this.props.navigation.state.params.onRefresh(true)

                                //navigate to back scrreen
                                this.props.navigation.goBack()
                            })
                        } else {
                            //clear add data
                            this.props.clearAdd()
                        }
                    }
                } catch (error) {
                    this.props.clearAdd()
                }
            }
        }

        if (updateExchangeFeedList !== prevProps.appData.updateExchangeFeedList) {

            if (updateExchangeFeedList) {
                try {
                    //if local updateExchangeFeedList state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.updateExchangeFeedList == null || (this.state.updateExchangeFeedList != null && updateExchangeFeedList !== this.state.updateExchangeFeedList)) {
                        this.setState({ updateExchangeFeedList })

                        //if updateExchangeFeedList response is success then store array list else store empty list
                        if (validateResponseNew({ response: updateExchangeFeedList, isList: false })) {
                            showAlert(R.strings.Status, updateExchangeFeedList.ReturnMsg, 0, () => {
                                //clear add data
                                this.props.clearUpdate()

                                //refresh previous list
                                this.props.navigation.state.params.onRefresh(true)

                                //navigate to back scrreen
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.props.clearUpdate()
                        }
                    }
                } catch (error) {
                    this.props.clearUpdate()
                }
            }
        }
    }

    onPressSubmit = async () => {
        //check for validations
        if (this.state.selectedSocketMethod === R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.socketMethod);
            return;
        }

        if (this.state.selectedLimitMethod === R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.limitMethod);
            return;
        }

        if (this.state.selectedStatus === R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.status);
            return;
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                MethodID: this.state.selectedSocketMethodID,
                FeedLimitID: this.state.selectedLimitMethodID,
                Status: this.state.selectedStatusCode,
            }

            //if screen is for Updating existing record then add ID of current item
            if (this.state.isEdit) {

                request = Object.assign({}, request, {
                    ID: this.state.ID
                })

                // call API  for Updating API
                this.props.updateExchangeConfigurationList(request);
            } else {

                // call API for Adding API
                this.props.addExchangeConfigurationList(request);
            }
        }

    }

    render() {

        let { isLoadingSocketMethods, isLoadingLimitMethods, isAddingExchangeFeed, isUpdatingExchangeFeed } = this.props.appData;

        return (
            <SafeView style={this.styles().container}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={this.state.title} isBack={true} nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={isLoadingSocketMethods || isLoadingLimitMethods || isAddingExchangeFeed || isUpdatingExchangeFeed} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* dropdown for socketMethod */}
                            <TitlePicker
                                title={R.strings.socketMethod}
                                array={this.state.socketMethodsList}
                                selectedValue={this.state.selectedSocketMethod}
                                onPickerSelect={(index, object) => {
                                    this.setState({ selectedSocketMethod: index, selectedSocketMethodID: object.ID })
                                }}
                            />

                            {/* dropdown for limitMethod */}
                            <TitlePicker
                                title={R.strings.limitMethod}
                                array={this.state.limitMethodsList}
                                selectedValue={this.state.selectedLimitMethod}
                                onPickerSelect={(index, object) => {
                                    this.setState({ selectedLimitMethod: index, selectedLimitMethodID: object.ID })
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                            />

                            {/* dropdown for status */}
                            <TitlePicker
                                title={R.strings.status}
                                array={this.state.statuses}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(index, object) => {
                                    this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                            />
                        </View>
                    </ScrollView>

                    <View
                        style={{
                            paddingLeft: R.dimens.activity_margin,
                            paddingRight: R.dimens.activity_margin,
                            paddingBottom: R.dimens.widget_top_bottom_margin,
                            paddingTop: R.dimens.widget_top_bottom_margin
                        }}>
                        {/* To Set submit Button */}
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
                flexDirection: 'column',
                backgroundColor: R.colors.background
            },
        }
    }
}

function mapStateToProps(state) {
    //Updated exchangeFeedConfigReducer Data 
    return {
        appData: state.exchangeFeedConfigReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform addExchangeConfigurationList action
        addExchangeConfigurationList: (payload) => dispatch(addExchangeConfigurationList(payload)),
        //Perform updateExchangeConfigurationList action
        updateExchangeConfigurationList: (payload) => dispatch(updateExchangeConfigurationList(payload)),
        //Perform getExchangeFeedConfigSocket action
        getExchangeFeedConfigSocket: () => dispatch(getExchangeFeedConfigSocket()),
        //Perform getExchangeFeedConfigLimits action
        getExchangeFeedConfigLimits: () => dispatch(getExchangeFeedConfigLimits()),
        //clear add , update data
        clearUpdate: () => dispatch(clearUpdate()),
        clearAdd: () => dispatch(clearAdd())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExchangeFeedConfigAddScreen)
