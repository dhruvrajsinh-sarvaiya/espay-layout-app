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
import { isInternet, validateResponseNew, isEmpty, validCharacter } from "../../../validations/CommonValidation";
import CommonToast from "../../../native_theme/components/CommonToast";
import ProgressDialog from "../../../native_theme/components/ProgressDialog";
import R from "../../../native_theme/R";
import { TitlePicker } from "../../widget/ComboPickerWidget";
import SafeView from "../../../native_theme/components/SafeView";
import { addStateApi, editStateApi, getActiveLangauges, ClearListCountryData, getListCountryApi } from "../../../actions/CMS/LocalizationActions";
import { Flags } from "./Flags";

//Create Common class for AddEditStatesScreen
class AddEditStatesScreen extends Component {
  constructor(props) {
    super(props);

    this.inputs = {};

    //item for edit from List screen
    let item =
      props.navigation.state.params && props.navigation.state.params.item;

    //Define All State initial state
    this.state = {

      item: item,
      isEdit: item ? true : false,

      stateCode: item ? item.stateCode : "",
      stateName: item ? item.locale.en : "",

      statuses: [
        { value: R.strings.Active, code: 1 },
        { value: R.strings.Inactive, code: 0 }
      ],
      selectedStatus: item ? (item.status == 1 ? R.strings.Active : R.strings.Inactive) : R.strings.Active,
      selectedStatusCode: item ? item.status : 1,

      activeLanguageDataState: null,
      countryListDataState: null,

      languagesResponse: [],
      languages: [],
      selectedLanguage: R.strings.Please_Select,
      selectedLanguageCode: '',
      selectedLanguageId: '',

      countries: [],
      selectedCountry: R.strings.Please_Select,
      selectedCountryId: item ? item.countryId : '',

      statedata: {
        locale: item ? item.locale :
          {
            en: ""
          },
      },
    };

    // create reference
    this.toast = React.createRef();
  }

  async componentDidMount() {
    //Add this method to change theme based on stored theme name.
    changeTheme();

    //Check NetWork is Available or not
    if (await isInternet()) {
      //call getActiveLangauges
      this.props.getActiveLangauges();

      //call getListCountryApi
      this.props.getListCountryApi({
        all: 'all',
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //For stop twice api call
    return isCurrentScreen(nextProps);
  }

  //chek state is empty or not
  stateEmptyCheck = (obj) => {
    for (var key in obj) {
      if (obj[key] === "")
        return true
    }
    return false;
  }

  //chek state length
  stateLengthCheck = (obj) => {
    for (var key in obj) {
      if (obj[key].length < 2 || obj[key].length > 100)
        return true
    }
    return false;
  }

  //chek regex for state name
  /* validateState = (obj) => {
    let reg = new RegExp(/^[A-Z a-z -]+$/);
    for (var key in obj) {
      if (!(reg.test(obj[key])))
        return true
    }
    return false
  } */

  //submitData
  submitData = async () => {
    const { locale } = this.state.statedata;

    // call validations functions
    let stateEmptyCheck = this.stateEmptyCheck(locale)
    let lengthCheck = this.stateLengthCheck(locale)
    //let validateState = this.validateState(locale)

    //validations for Inputs

    if (stateEmptyCheck) {
      this.toast.Show(R.strings.enter + " " + R.strings.State_Name);
      return;
    }
    if (lengthCheck) {
      this.toast.Show(R.strings.stateNameCharLimit);
      return;
    }
    /*  if (validateState) {
       this.toast.Show(R.strings.enterValidStateName);
       return;
     } */
    if (isEmpty(this.state.stateCode)) {
      this.toast.Show(R.strings.enter + " " + R.strings.stateCode);
      return;
    }
    if (!validCharacter(this.state.stateCode)) {
      this.toast.Show(R.strings.enterValidStateCode);
      return;
    }
    if (this.state.stateCode.length != 2) {
      this.toast.Show(R.strings.stateCodeCharLimit);
      return;
    }
    if (this.state.selectedCountry === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.country);
      return;
    }

    Keyboard.dismiss();

    //Check NetWork is Available or not
    if (await isInternet()) {

      let data = {
        stateCode: this.state.stateCode,
        countryId: this.state.selectedCountryId,
        locale,
        status: this.state.selectedStatusCode
      };

      if (this.state.isEdit) {
        data = {
          ...data,
          stateId: parseIntVal(this.state.item.stateId)
        };
        //call editStateApi api
        this.props.editStateApi({ statedata: data });
      } else {
        //call addStateApi api
        this.props.addStateApi({ statedata: data });
      }
    }
  };

  async componentDidUpdate(prevProps, prevState) {

    const { stateAddData, stateEditData } = this.props.Listdata;

    if (stateAddData !== prevProps.Listdata.stateAddData) {
      // for show responce  Add
      if (stateAddData) {
        try {
          if (stateAddData.statusCode == 200) {
            showAlert(R.strings.Success, R.strings.RedcordAddedSuccessfully, 0, () => {
              this.props.ClearListCountryData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            showAlert(R.strings.status, stateAddData.message, 1, () => {
              this.props.ClearListCountryData();
            });
          }
        } catch (e) {
          this.props.ClearListCountryData();
        }
      }
    }

    if (stateEditData !== prevProps.Listdata.stateEditData) {
      // for show responce Update
      if (stateEditData) {
        try {
          if (stateEditData.statusCode == 200) {
            showAlert(R.strings.Success, R.strings.RedcordUpdatedSuccessfully, 0, () => {
              this.props.ClearListCountryData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            showAlert(R.strings.status, stateEditData.message, 1, () => {
              this.props.ClearListCountryData();
            });
          }
        } catch (e) {
          this.props.ClearListCountryData();
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
    if (AddEditStatesScreen.oldProps !== props) {
      AddEditStatesScreen.oldProps = props;
    } else {
      return null;
    }

    if (isCurrentScreen(props)) {
      const { activeLanguageData, countryListData } = props.Listdata;

      if (activeLanguageData) {
        try {
          //if local currencyList state is null or its not null and also different then new response then and only then validate response.
          if (
            state.activeLanguageDataState == null ||
            (state.activeLanguageDataState != null &&
              activeLanguageData !== state.activeLanguageDataState)
          ) {
            //if currencyList response is success then store array list else store empty list
            if (validateResponseNew({
              esponse: activeLanguageData,
              statusCode: activeLanguageData.statusCode,
              returnCode: activeLanguageData.responseCode, returnMessage: activeLanguageData.message,
              isList: true
            })) {

              let res = parseArray(activeLanguageData.data);
              let selectedLanguage, selectedLanguageCode, selectedLanguageId

              // For add language and flag in response
              for (var key in res) {
                let item = res[key]
                item.value = item.language_name
                item.icon = { uri: Flags[item.code.toUpperCase()] }

                // set default english langauge selected
                if (item.code == 'en') {
                  selectedLanguage = item.language_name
                  selectedLanguageCode = item.code
                  selectedLanguageId = item.id
                }
              }

              let languages = [
                ...res
              ];

              return {
                ...state,
                languages,
                activeLanguageDataState: activeLanguageData,
                selectedLanguageId: selectedLanguageId,
                languagesResponse: res,
                selectedLanguage: selectedLanguage,
                selectedLanguageCode: selectedLanguageCode,
              };
            } else {
              return {
                ...state,
                languages: [],
                activeLanguageDataState: activeLanguageData
              };
            }
          }
        } catch (e) {
          return {
            ...state,
            languages: [],
          };
        }
      }

      if (countryListData) {
        try {
          //if local countryListData state is null or its not null and also different then new response then and only then validate response.
          if (state.countryListDataState == null || (state.countryListDataState != null && countryListData !== state.countryListDataState)) {

            //if  response is success then store array list else store empty list
            if (validateResponseNew({
              response: countryListData,
              returnCode: countryListData.responseCode,
              isList: true,
            })) {

              let countryListDataResponse = parseArray(countryListData.data);

              for (var countryListDataResponsekey in countryListDataResponse) {
                let item = countryListDataResponse[countryListDataResponsekey]
                item.value = item.locale.en
              }

              let selectedCountry = R.strings.Please_Select;

              // set country name based on previous screen country id
              if (state.isEdit) {
                //for add countryListDataResponse
                for (var data in countryListDataResponse) {
                  let item = countryListDataResponse[data];
                  if (item.countryId == state.item.countryId)
                    selectedCountry = item.locale.en;
                }
              }

              let countries = [
                { value: R.strings.Please_Select },
                ...countryListDataResponse
              ];

              return {
                ...state, countryListDataState: countryListData,
                refreshing: false,
                countries,
                selectedCountry
              };
            } else {
              return { ...state, countryListDataState: countryListData };
            }
          }
        } catch (e) {
          return { ...state };
        }
      }
    }
    return null;
  }

  //this Method is used to focus on next feild
  focusNextField(id) {
    this.inputs[id].focus();
  }

  // on change langauge 
  onChangelanguagePress = async (index, item) => {
    this.setState({
      selectedLanguage: index,
      selectedLanguageCode: item.code,
      selectedLanguageId: item.id,
    })
  }

  // on change detail
  onChangeAddCountryDetails(key, value, lang = '') {
    if (lang != '') {
      let statusCopy = Object.assign({}, this.state.statedata);
      statusCopy.locale[lang] = value;
      this.setState(statusCopy);
    }
    else {
      this.setState({
        statedata: {
          ...this.state.statedata,
          [key]: value
        }
      });
    }
  }

  render() {

    const {
      stateAddFetching,
      stateEditFetching,
      activeLanguageFetching, countryListFetching
    } = this.props.Listdata;

    const { locale } = this.state.statedata;

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
        {/* To Set Status Bas as per out theme */}
        <CommonStatusBar />

        {/* To Set ToolBar as per out theme */}
        <CustomToolbar
          title={
            this.state.isEdit
              ? R.strings.updateState
              : R.strings.AddState
          }
          isBack={true}
          nav={this.props.navigation}
        />

        {/* Progress Dialog */}
        <ProgressDialog
          isShow={
            stateAddFetching ||
            stateEditFetching ||
            activeLanguageFetching ||
            countryListFetching
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

              {/* Dropdown for langauage */}
              <TitlePicker
                title={R.strings.language}
                searchable={true}
                array={this.state.languages}
                selectedValue={this.state.selectedLanguage}
                onPickerSelect={(index, object) => {
                  this.onChangelanguagePress(index, object)
                }}
                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />


              {/* To Set State_Name in EditText */}
              {this.state.languagesResponse && this.state.languagesResponse.map((lang, key) => {
                if (this.state.selectedLanguageId == lang.id) {
                  return (
                    <EditText
                      key={key.toString()}
                      isRequired={true}
                      reference={input => {
                        this.inputs["etStateName"] = input;
                      }}
                      header={R.strings.State_Name + '' + '(' + this.state.selectedLanguageCode + ')'}
                      placeholder={R.strings.State_Name}
                      multiline={false}
                      maxLength={60}
                      keyboardType="default"
                      returnKeyType={"next"}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this.focusNextField("etStateCode");
                      }}
                      onChangeText={(stateName) => this.onChangeAddCountryDetails("stateName", stateName, lang.code)}
                      value={locale[lang.code]}
                    />
                  );
                }
              })}

              {/* To Set stateCode in EditText */}
              <EditText
                isRequired={true}
                reference={input => {
                  this.inputs["etStateCode"] = input;
                }}
                header={R.strings.stateCode}
                placeholder={R.strings.stateCode}
                multiline={false}
                maxLength={2}
                keyboardType="default"
                returnKeyType={"done"}
                blurOnSubmit={false}
                value={this.state.stateCode}
                onChangeText={stateCode => this.setState({ stateCode })}
              />

              {/* Dropdown for country */}
              <TitlePicker
                title={R.strings.country}
                isRequired={true}
                searchable={true}
                array={this.state.countries}
                selectedValue={this.state.selectedCountry}
                onPickerSelect={(countryName, object) => this.setState({ selectedCountry: countryName, selectedCountryId: object.countryId })}
                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

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
            </View>
          </ScrollView>

          {/* To Set Submit Button */}
          <View
            style={{
              paddingLeft: R.dimens.activity_margin,
              paddingRight: R.dimens.activity_margin,
              paddingBottom: R.dimens.widget_top_bottom_margin,
              paddingTop: R.dimens.widget_top_bottom_margin
            }}
          >
            <Button
              title={this.state.isEdit ? R.strings.update : R.strings.add}
              onPress={this.submitData}
            />
          </View>
        </View>
      </SafeView >
    );
  }
}

function mapStateToProps(state) {
  //Updated Data For LocalizationReducer Data 
  let Listdata = {
    ...state.LocalizationReducer,
  }
  return { Listdata }
}

function mapDispatchToProps(dispatch) {
  return {
    //Perform getListCountryApi List Action 
    getListCountryApi: (request) => dispatch(getListCountryApi(request)),
    //for addStateApi  api data
    addStateApi: request => dispatch(addStateApi(request)),
    //for editStateApi  api data
    editStateApi: request => dispatch(editStateApi(request)),
    //for getActiveLangauges  api data
    getActiveLangauges: () => dispatch(getActiveLangauges()),
    //for data clear
    ClearListCountryData: () => dispatch(ClearListCountryData())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditStatesScreen);
