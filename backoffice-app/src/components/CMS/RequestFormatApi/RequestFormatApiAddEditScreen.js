import { View, ScrollView, Keyboard } from "react-native";
import React from "react";
import { Component } from "react";
import CommonStatusBar from "../../../native_theme/components/CommonStatusBar";
import CustomToolbar from "../../../native_theme/components/CustomToolbar";
import EditText from "../../../native_theme/components/EditText";
import Button from "../../../native_theme/components/Button";
import { connect } from "react-redux";
import { isCurrentScreen } from "../../Navigation";
import { showAlert, changeTheme, parseArray, parseIntVal } from "../../../controllers/CommonUtils";
import { isEmpty, isInternet, validateResponseNew, isHtmlTag, isScriptTag } from "../../../validations/CommonValidation";
import CommonToast from "../../../native_theme/components/CommonToast";
import ProgressDialog from "../../../native_theme/components/ProgressDialog";
import R from "../../../native_theme/R";
import { TitlePicker } from "../../widget/ComboPickerWidget";
import SafeView from "../../../native_theme/components/SafeView";
import { clearRequestFormatApiData, addRequestFormat, editRequestFormat } from "../../../actions/CMS/RequestFormatApiActions";
import { getAppType } from "../../../actions/PairListAction";

//Create Common class for RequestFormatApiAddEditScreen
class RequestFormatApiAddEditScreen extends Component {
  constructor(props) {
    super(props);

    this.inputs = {};

    //item for edit from List screen
    let item =
      props.navigation.state.params && props.navigation.state.params.item;

    let methodType
    if (item) {
      if (item.MethodType == 'string')
        methodType = "String"
      else if (item.MethodType == 'GET')
        methodType = "GET"
      else if (item.MethodType == 'POST')
        methodType = "POST"
    }

    //Define All State initial state
    this.state = {
      item: item,
      isEdit: item ? true : false,
      appTypeDataState: null,

      RequestName: item ? item.RequestName : "",

      contentTypes: [
        { value: R.strings.Please_Select, code: '' },
        { value: "String", code: "string" },
        { value: "Application/Json", code: "application/Json" }
      ],
      selectedContentType: item ? (item.ContentType === "string" ? "String" : "Application/Json") : R.strings.Please_Select,
      selectedContentTypeCode: item ? item.ContentType : '',

      methodTypes: [
        { value: R.strings.Please_Select, code: '' },
        { value: "GET", code: "GET" },
        { value: "POST", code: "POST" },
        { value: "String", code: 'string' }
      ],
      selectedMethodType: item ? methodType : R.strings.Please_Select,
      selectedMethodTypeCode: item ? item.MethodType : '',

      RequestFormat: item ? item.RequestFormat : "",

      statuses: [
        { value: R.strings.select_status, code: "" },
        { value: R.strings.Inactive, code: 0 },
        { value: R.strings.Active, code: 1 }
      ],
      selectedStatus: item ? (item.Status == 1 ? R.strings.Active : R.strings.Inactive) : R.strings.select_status,
      selectedStatusCode: item ? item.Status : "",

      requestTypes: [{ value: R.strings.Please_Select }],
      selectedrequestType: R.strings.Please_Select,
      selectedrequestTypeCode: item ? item.RequestType : ""
    };

    // create reference
    this.toast = React.createRef();
  }

  async componentDidMount() {
    //Add this method to change theme based on stored theme name.
    changeTheme();

    //Check NetWork is Available or not
    if (await isInternet()) {
      this.props.getAppType();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //For stop twice api call
    return isCurrentScreen(nextProps);
  }

  //submitData
  submitData = async () => {
    //validations for Inputs
    if (isEmpty(this.state.RequestName)) {
      this.toast.Show(R.strings.enter + " " + R.strings.requestName);
      return;
    }
    if (isHtmlTag(this.state.RequestName)) {
      this.toast.Show(R.strings.htmlTagNotAllowed + " " + R.strings.requestName);
      return;
    }
    if (isScriptTag(this.state.RequestName)) {
      this.Toast.Show(R.strings.scriptTagNotAllowed + " " + R.strings.requestName);
      return;
    }
    if (this.state.selectedContentType === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.contentType);
      return;
    }
    if (this.state.selectedMethodType === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.methodType);
      return;
    }
    if (isEmpty(this.state.RequestFormat)) {
      this.toast.Show(R.strings.enter + " " + R.strings.requestFormat);
      return;
    }
    if (isHtmlTag(this.state.RequestFormat)) {
      this.toast.Show(R.strings.htmlTagNotAllowed + " " + R.strings.requestFormat);
      return;
    }
    if (isScriptTag(this.state.RequestFormat)) {
      this.Toast.Show(R.strings.scriptTagNotAllowed + " " + R.strings.requestFormat);
      return;
    }
    if (this.state.selectedStatus === R.strings.select_status) {
      this.toast.Show(R.strings.select_status);
      return;
    }
    if (this.state.selectedrequestType === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.requestType);
      return;
    }

    Keyboard.dismiss();

    //Check NetWork is Available or not
    if (await isInternet()) {
      this.request = {
        RequestName: this.state.RequestName,
        ContentType: this.state.selectedContentTypeCode,
        MethodType: this.state.selectedMethodTypeCode,
        RequestFormat: this.state.RequestFormat,
        RequestType: parseIntVal(this.state.selectedrequestTypeCode),
        Status: parseIntVal(this.state.selectedStatusCode)
      };

      if (this.state.isEdit) {
        this.request = {
          ...this.request,
          RequestID: parseIntVal(this.state.item.RequestID)
        };

        //call editRequestFormat api
        this.props.editRequestFormat(this.request);
      } else {
        //call addRequestFormat api
        this.props.addRequestFormat(this.request);
      }
    }
  };

  async componentDidUpdate(prevProps, prevState) {

    const { addRequestFormatData, editRequestFormatData } = this.props.Listdata;

    if (addRequestFormatData !== prevProps.Listdata.addRequestFormatData) {
      // for show responce  Add
      if (addRequestFormatData) {
        try {
          if (validateResponseNew({ response: addRequestFormatData })) {
            showAlert(R.strings.Success, addRequestFormatData.ReturnMsg, 0, () => {
              this.props.clearRequestFormatApiData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            this.props.clearRequestFormatApiData();
          }
        } catch (e) {
          this.props.clearRequestFormatApiData();
        }
      }
    }

    if (editRequestFormatData !== prevProps.Listdata.editRequestFormatData) {
      // for show responce Update
      if (editRequestFormatData) {
        try {
          if (validateResponseNew({ response: editRequestFormatData })) {

            showAlert(R.strings.Success, editRequestFormatData.ReturnMsg, 0, () => {
              this.props.clearRequestFormatApiData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            this.props.clearRequestFormatApiData();
          }
        } catch (e) {
          this.props.clearRequestFormatApiData();
        }
      }
    }
  }

  static oldProps = {};

  //handle reponse
  static getDerivedStateFromProps(props, state) {
    //To Skip Render First Time for available reducer data if exists
    if (state.isFirstTime) {
      return {
        ...state,
        isFirstTime: false
      };
    }

    // To Skip Render if old and new props are equal
    if (RequestFormatApiAddEditScreen.oldProps !== props) {
      RequestFormatApiAddEditScreen.oldProps = props;
    } else {
      return null;
    }

    if (isCurrentScreen(props)) {
      const { appTypeData } = props.Listdata;

      if (appTypeData) {
        try {
          //if local currencyList state is null or its not null and also different then new response then and only then validate response.
          if (
            state.appTypeDataState == null ||
            (state.appTypeDataState != null &&
              appTypeData !== state.appTypeDataState)
          ) {
            //if currencyList response is success then store array list else store empty list
            if (validateResponseNew({ response: appTypeData, isList: true })) {
              let res = parseArray(appTypeData.Response);

              let res1 = [];
              //for add appTypeData
              for (var keyappTypeData in res) {
                let item = res[keyappTypeData];
                item.value = item.AppTypeName;
                res1.push(item);
              }

              let selectedrequestType = R.strings.Please_Select;

              if (state.isEdit) {
                //for add appTypeData
                for (var data in res1) {
                  let item = res[data];
                  if (item.Id == state.item.RequestType)
                    selectedrequestType = item.AppTypeName;
                }
              }

              let requestTypes = [{ value: R.strings.Please_Select }, ...res];

              return {
                ...state,
                selectedrequestType,
                requestTypes,
                appTypeDataState: appTypeData
              };
            } else {
              return {
                ...state,
                requestTypes: [{ value: R.strings.Please_Select }],
                appTypeDataState: appTypeData
              };
            }
          }
        } catch (e) {
          return {
            ...state,
            requestTypes: [{ value: R.strings.Please_Select }]
          };
        }
      }
    }
    return null;
  }

  //this Method is used to focus on next feild
  focusNextField(id) {
    this.inputs[id].focus();
  }

  render() {
    const {
      addRequestFormatFetching,
      editRequestFormatFetching,
      appTypeDataFetching
    } = this.props.Listdata;
    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
        {/* To Set Status Bas as per out theme */}
        <CommonStatusBar />

        {/* To Set ToolBar as per out theme */}
        <CustomToolbar
          title={
            this.state.isEdit
              ? R.strings.updateRequestFormatApi
              : R.strings.addRequestFormatApi
          }
          isBack={true}
          nav={this.props.navigation}
        />

        {/* Progress Dialog */}
        <ProgressDialog
          isShow={
            addRequestFormatFetching ||
            editRequestFormatFetching ||
            appTypeDataFetching
          }
        />

        {/* Common Toast */}
        <CommonToast ref={component => (this.toast = component)} />

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            <View
              style={{
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingBottom: R.dimens.widget_top_bottom_margin,
                paddingTop: R.dimens.widget_top_bottom_margin
              }}
            >
              {/* To Set requestName in EditText */}
              <EditText
                isRequired={true}
                reference={input => {
                  this.inputs["etrequestName"] = input;
                }}
                header={R.strings.requestName}
                placeholder={R.strings.requestName}
                multiline={false}
                maxLength={60}
                keyboardType="default"
                returnKeyType={"next"}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.focusNextField("etRequestFormat");
                }}
                onChangeText={RequestName => this.setState({ RequestName })}
                value={this.state.RequestName}
              />

              {/* Picker for contentType */}
              <TitlePicker
                isRequired={true}
                title={R.strings.contentType}
                array={this.state.contentTypes}
                selectedValue={this.state.selectedContentType}
                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                onPickerSelect={(item, object) =>
                  this.setState({ selectedContentType: item, selectedContentTypeCode: object.code })
                }
              />

              {/* Picker for methodType */}
              <TitlePicker
                isRequired={true}
                title={R.strings.methodType}
                array={this.state.methodTypes}
                selectedValue={this.state.selectedMethodType}
                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                onPickerSelect={(item, object) =>
                  this.setState({ selectedMethodType: item, selectedMethodTypeCode: object.code })
                }
              />

              {/* To Set requestFormat in EditText */}
              <EditText
                isRequired={true}
                reference={input => {
                  this.inputs["etRequestFormat"] = input;
                }}
                header={R.strings.requestFormat}
                placeholder={R.strings.requestFormat}
                textAlignVertical={"top"}
                multiline={true}
                maxLength={500}
                numberOfLines={4}
                keyboardType="default"
                returnKeyType={"done"}
                blurOnSubmit={false}
                onChangeText={RequestFormat => this.setState({ RequestFormat })}
                value={this.state.RequestFormat}
              />

              {/* Picker for status */}
              <TitlePicker
                isRequired={true}
                title={R.strings.status}
                array={this.state.statuses}
                selectedValue={this.state.selectedStatus}
                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                onPickerSelect={(item, object) =>
                  this.setState({
                    selectedStatus: item,
                    selectedStatusCode: object.code
                  })
                }
              />

              {/* Picker for requestTypes */}
              <TitlePicker
                isRequired={true}
                title={R.strings.requestType}
                array={this.state.requestTypes}
                selectedValue={this.state.selectedrequestType}
                style={{
                  marginTop: R.dimens.widget_top_bottom_margin,
                  marginBottom: R.dimens.margin_top_bottom
                }}
                onPickerSelect={(item, object) =>
                  this.setState({
                    selectedrequestType: item,
                    selectedrequestTypeCode: object.Id
                  })} />
            </View>

          </ScrollView>

          {/* To Set Submit Button */}
          <View
            style={{
              paddingTop: R.dimens.widget_top_bottom_margin,
              paddingRight: R.dimens.activity_margin,
              paddingBottom: R.dimens.widget_top_bottom_margin,
              paddingLeft: R.dimens.activity_margin,
            }} >
            <Button
              onPress={this.submitData}
              title={this.state.isEdit ?
                R.strings.update : R.strings.add}
            />
          </View>

        </View>
      </SafeView>

    );
  }

}

function mapStateToProps(state) {
  return {
    //Updated RequestFormatApiReducer data
    Listdata: state.RequestFormatApiReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //for addRequestFormat  api data
    addRequestFormat: request => dispatch(addRequestFormat(request)),
    //for editRequestFormat  api data
    editRequestFormat: request => dispatch(editRequestFormat(request)),
    //for getAppType  api data
    getAppType: () => dispatch(getAppType()),
    //for data clear
    clearRequestFormatApiData: () => dispatch(clearRequestFormatApiData())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestFormatApiAddEditScreen);
