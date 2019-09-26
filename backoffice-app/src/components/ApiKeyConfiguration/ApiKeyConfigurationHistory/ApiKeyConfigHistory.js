import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import DatePickerWidget from '../../widget/DatePickerWidget';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray, getCurrentDate } from '../../../controllers/CommonUtils';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { getApiKeyConfigHistory, clearApiKeyConfigHistory } from '../../../actions/ApiKeyConfiguration/ApiKeyConfigHistoryAction';
import { getUserDataList, getApiPlanConfigList } from '../../../actions/PairListAction';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { DateValidation } from '../../../validations/DateValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import { AppConfig } from '../../../controllers/AppConfig';

export class ApiKeyConfigHistory extends Component {

    constructor(props) {
        super(props)

        // Define all initial state
        this.state = {
            ApiPlan: [],
            Status: [
                { value: R.strings.select_status },
                { value: R.strings.active, Id: 1 },
                { value: R.strings.inActive, Id: 0 },
                { value: R.strings.Disable, Id: 9 },
            ],
            UserNames: [],

            ApiKeyConfigHistoryState: null,
            UserDataListState: null,
            ApiPlanConfigListState: null,

            selectedUser: R.strings.selectUser,
            selectedStatus: R.strings.select_status,
            selectedApiPlan: R.strings.Select_Plan,

            UserId: 0,
            ApiPlanId: 0,
            StatusId: 0,
            isFirstTime: true,

            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
        }

        // create reference
        this.toast = React.createRef()
    }

    async componentDidMount() {

        changeTheme() // Add this method to change theme based on stored theme name.

        // check internet connection
        if (await isInternet()) {
            // Call User Data List Api
            this.props.getUserDataList()
            // Call Api Plan List Api
            this.props.getApiPlanConfigList()
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    // Call api after check all validation
    onSubmitPress = async () => {
        if (DateValidation(this.state.FromDate, this.state.ToDate, true))
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
        else if (this.state.selectedUser === R.strings.selectUser)
            this.toast.Show(R.strings.selectUser)
        else {

            // check internet connection
            if (await isInternet()) {

                let req = {
                    PageNo: 0,
                    PageSize: AppConfig.pageSize,
                    UserId: this.state.UserId,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
                    PlanId: this.state.selectedApiPlan !== R.strings.Select_Plan ? this.state.ApiPlanId : '',
                }

                // Call Get Api Key Configuration History
                this.props.getApiKeyConfigHistory(req)
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ApiKeyConfigHistory.oldProps !== props) {
            ApiKeyConfigHistory.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            // Get all upadated field of particular actions
            const { UserDataList, ApiPlanConfigList } = props.ApiKeyConfigHistoryResult

            // UserDataList is not null
            if (UserDataList) {
                try {
                    //if local UserDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.UserDataListState == null || (state.UserDataListState != null && UserDataList !== state.UserDataListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: UserDataList, isList: true })) {
                            let res = parseArray(UserDataList.GetUserData);

                            for (var dataApiKeyItem in res) {
                                let item = res[dataApiKeyItem]
                                item.value = item.UserName
                            }

                            let userNames = [
                                { value: R.strings.selectUser },
                                ...res
                            ];

                            return { ...state, UserDataListState: UserDataList, UserNames: userNames };
                        } else {
                            return { ...state, UserDataListState: null, UserNames: [{ value: R.strings.selectUser }] };
                        }
                    }
                } catch (e) {
                    return { ...state, UserNames: [{ value: R.strings.selectUser }], UserDataListState: null };
                }
            }

            // ApiPlanConfigList is not null
            if (ApiPlanConfigList) {
                try {
                    //if local ApiPlanConfigList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ApiPlanConfigListState == null || (state.ApiPlanConfigListState != null && ApiPlanConfigList !== state.ApiPlanConfigListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ApiPlanConfigList, isList: true })) {
                            let res = parseArray(ApiPlanConfigList.Response);

                            for (var apiPlanKey in res) {
                                let item = res[apiPlanKey]
                                item.value = item.PlanName
                            }

                            let planNames = [{ value: R.strings.Select_Plan },
                            ...res
                            ];

                            return {
                                ...state,
                                ApiPlanConfigListState: ApiPlanConfigList,
                                ApiPlan: planNames
                            };
                        } else {
                            return {
                                ...state,
                                ApiPlanConfigListState: ApiPlanConfigList,
                                ApiPlan: [{ value: R.strings.Select_Plan }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        ApiPlan: [{ value: R.strings.Select_Plan }],
                        ApiPlanConfigListState: ApiPlanConfigList
                    };
                }
            }

        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { ApiKeyConfigHistoryData } = this.props.ApiKeyConfigHistoryResult;

        // compare response with previous response
        if (ApiKeyConfigHistoryData !== prevProps.ApiKeyConfigHistoryResult.ApiKeyConfigHistoryData) {

            // ApiKeyConfigHistoryData is not null
            if (ApiKeyConfigHistoryData) {
                try {
                    // if local ApiKeyConfigHistory state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.ApiKeyConfigHistoryState == null || (this.state.ApiKeyConfigHistoryState != null && ApiKeyConfigHistory !== this.state.ApiKeyConfigHistoryState)) {
                        // handle response of API
                        if (validateResponseNew({ response: ApiKeyConfigHistoryData })) {

                            this.setState({ ApiKeyConfigHistoryState: ApiKeyConfigHistoryData })

                            let res = parseArray(ApiKeyConfigHistoryData.Response)

                            for (var itemData in res) {
                                let item = res[itemData]
                                let permission = R.strings.view_rights
                                let ipAccess = R.strings.unRestricted
                                let status = R.strings.Disable
                                if (item.APIPermission == 1)
                                    permission = R.strings.admin_rights

                                if (item.IPAccess == 1)
                                    ipAccess = R.strings.restricted

                                if (item.Status == 1)
                                    status = R.strings.active
                                else if (item.Status == 0)
                                    status = R.strings.inActive

                                item.IpAccessText = ipAccess
                                item.ApiPermissionText = permission
                                item.StatusText = status
                            }

                            // navigate Api Key Config History Detail Screen
                            this.props.navigation.navigate('ApiKeyConfigHistoryDetail', {
                                item: res,
                                ApiPlan: this.state.ApiPlan,
                                Status: this.state.Status,
                                UserNames: this.state.UserNames,

                                StatusId: this.state.StatusId,
                                UserId: this.state.UserId,
                                ApiPlanId: this.state.ApiPlanId,

                                SelectedApiPlan: this.state.selectedApiPlan,
                                SelectedUser: this.state.selectedUser,
                                SelectedStatus: this.state.selectedStatus,

                                FromDate: this.state.FromDate,
                                ToDate: this.state.ToDate,
                                TotalCount: ApiKeyConfigHistoryData.TotalCount,
                            })
                        } else {
                            this.setState({ ApiKeyConfigHistoryState: null })
                        }
                    }
                } catch (error) {
                    this.setState({ ApiKeyConfigHistoryState: null })
                }
            }
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { UserDataListLoading, ApiPlanConfigListLoading, ApiKeyConfigHistoryLoading } = this.props.ApiKeyConfigHistoryResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    isBack={true}
                    title={R.strings.apiKeyConfigurationHistory}
                    nav={this.props.navigation}
                />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Progressbar */}
                <ProgressDialog isShow={ApiPlanConfigListLoading || ApiKeyConfigHistoryLoading || UserDataListLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={this.styles().mainView}>

                            {/* FromDate and ToDate */}
                            <DatePickerWidget
                                FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                                ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
                                FromDate={this.state.FromDate}
                                ToDate={this.state.ToDate} />

                            {/* To Set User List in Dropdown */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.UserName}
                                array={this.state.UserNames}
                                selectedValue={this.state.selectedUser}
                                onPickerSelect={(item, object) => this.setState({ selectedUser: item, UserId: object.Id })} />

                            {/* To Set Api Plan List in Dropdown */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.planID}
                                array={this.state.ApiPlan}
                                selectedValue={this.state.selectedApiPlan}
                                onPickerSelect={(item, object) => this.setState({ selectedApiPlan: item, ApiPlanId: object.ID })} />

                            {/* To Set Status in Dropdown */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.Status}
                                array={this.state.Status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(item, object) => this.setState({ selectedStatus: item, StatusId: object.Id })} />
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={R.strings.submit} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }

    styles = () => {
        return {
            mainView: {
                flex: 1,
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingBottom: R.dimens.padding_top_bottom_margin,
                paddingTop: R.dimens.padding_top_bottom_margin,
            },
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get api Key Config history data from reducer
        ApiKeyConfigHistoryResult: state.ApiKeyConfigHistoryReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Api Key Config History Action
    getApiKeyConfigHistory: (payload) => dispatch(getApiKeyConfigHistory(payload)),
    // Perform User List Action
    getUserDataList: () => dispatch(getUserDataList()),
    // Perform Api Plan List Action
    getApiPlanConfigList: () => dispatch(getApiPlanConfigList()),
    // Perform Clear Api Key Config History Action
    clearApiKeyConfigHistory: () => dispatch(clearApiKeyConfigHistory()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyConfigHistory)