// ChatUserListEdit
import React, { Component } from 'react';
import { View, ScrollView, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, showAlert } from '../../controllers/CommonUtils';
import Button from '../../native_theme/components/Button';
import { isInternet, validateResponseNew, isEmpty, validateValue } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../../components/Navigation';
import { connect } from 'react-redux';
import CommonToast from '../../native_theme/components/CommonToast';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { changeBlockUserChatStatus, changeBlockUserChatStatusClear } from '../../actions/CMS/ChatUserListAction';
import EditText from '../../native_theme/components/EditText';
import { FeatureSwitch } from '../../native_theme/components/FeatureSwitch';
import R from '../../native_theme/R';
import { getChatUserList } from '../../actions/PairListAction';
import SafeView from '../../native_theme/components/SafeView';

class ChatUserListEdit extends Component {

    constructor(props) {
        super(props)

        // create reference
        this.toast = React.createRef();

        // for get data for edit record
        const { params } = this.props.navigation.state;

        this.state = {
            name: '',//store name of user
            userName: '',//store username
            email: '',//store email of user
            mobile: '',//store mobile number of user
            isBlocked: true,//for block or unblocked user
            reason: '',//for store reason for block or unblocked user
            item: params == undefined ? undefined : params.item,//get data from the another screen and store it in item state
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (this.state.item) {
            // when data in item than seprate data from it and store in related state value  
            this.setState({
                name: this.state.item.Name,
                userName: this.state.item.UserName,
                email: this.state.item.Email,
                mobile: this.state.item.Mobile,
                isBlocked: this.state.item.IsBlocked,
                reason: '',
            })
        }

    }

    submitdata = async () => {
        // for check empty validation
        if (isEmpty(this.state.reason.trim())) {
            this.toast.Show(R.strings.EnterReason)
            return;
        }
        else {
            // check internet 
            if (await isInternet()) {

                // call action for edit record 
                this.props.changeBlockUserChatStatus({
                    Username: this.state.userName,
                    Reason: this.state.reason,
                    IsBlocked: this.state.isBlocked
                });
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { chatUserStatus } = this.props;

        if (chatUserStatus !== prevProps.chatUserStatus) {
            // get responce for edit record 
            if (chatUserStatus) {
                try {
                    // execute when change in responce data 
                    if (this.state.chatUserStatus == null || (this.state.chatUserStatus != null && chatUserStatus !== this.state.chatUserStatus)) {
                        if (validateResponseNew({ response: chatUserStatus, returnCode: chatUserStatus.ReturnCode, returnMessage: chatUserStatus.ReturnMsg })) {
                            showAlert(R.strings.Success, chatUserStatus.ReturnMsg, 0, () => {

                                // edited data clear from the reducer
                                this.props.changeBlockUserChatStatusClear()
                                this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                                this.props.navigation.goBack()
                            })
                        }

                        else {
                            // edited data clear from the reducer
                            this.props.changeBlockUserChatStatusClear()
                        }
                    }
                } catch (e) {
                    this.props.changeBlockUserChatStatusClear()
                }
            }
        }
    }

    render() {
        // for display progressdialog
        const { loading } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.EditChatUserStatus}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* show progress bar when fetching edit record */}
                <ProgressDialog isShow={loading} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* Toogle Switch for change chat status */}
                    <FeatureSwitch
                        isGradient={true}
                        title={this.state.isBlocked ? R.strings.Block : R.strings.UnBlock}
                        isToggle={this.state.isBlocked}
                        onValueChange={() => {
                            this.setState({
                                isBlocked: !this.state.isBlocked
                            })
                        }}
                        textStyle={{ color: R.colors.white }}
                    />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin }}>
                            {/* for Name / never edit*/}
                            <EditText
                                header={R.strings.name}
                                placeholder={R.strings.name}
                                editable={false}
                                value={validateValue(this.state.name)}
                            />
                            {/* for User Name / never edit*/}
                            <EditText
                                header={R.strings.UserName}
                                placeholder={R.strings.UserName}
                                editable={false}
                                value={validateValue(this.state.userName)}
                            />
                            {/* for email / never edit */}
                            <EditText
                                header={R.strings.Email}
                                placeholder={R.strings.Email}
                                editable={false}
                                value={validateValue(this.state.email)}
                            />
                            {/* for mobile / never edit*/}
                            <EditText
                                header={R.strings.Mobile}
                                placeholder={R.strings.Mobile}
                                editable={false}
                                value={validateValue(this.state.mobile)}
                            />
                            {/* for Reason */}
                            <EditText
                                header={R.strings.Reason}
                                placeholder={R.strings.Reason}
                                multiline={false}
                                maxLength={240}
                                returnKeyType={"done"}
                                onChangeText={(text) => this.setState({ reason: text })}
                                value={this.state.reason}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    {/* for update button*/}
                    <Button title={R.strings.update} onPress={this.submitdata}></Button>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        // Data get from the reducer
        loading: state.ChatUserListReducer.loading,
        chatUserStatus: state.ChatUserListReducer.chatUserStatus,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call action for getting chatuserlist
        getChatUserList: () => dispatch(getChatUserList()),
        // call action for edit userlist record
        changeBlockUserChatStatus: (RequestEditUserList) => dispatch(changeBlockUserChatStatus(RequestEditUserList)),
        // call action for clear edited data 
        changeBlockUserChatStatusClear: () => dispatch(changeBlockUserChatStatusClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatUserListEdit)