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
import { isInternet, validateResponseNew, validCharacter, isEmpty } from "../../../validations/CommonValidation";
import CommonToast from "../../../native_theme/components/CommonToast";
import ProgressDialog from "../../../native_theme/components/ProgressDialog";
import R from "../../../native_theme/R";
import { TitlePicker } from "../../widget/ComboPickerWidget";
import SafeView from "../../../native_theme/components/SafeView";
import { addCountryApi, editCountryApi, getActiveLangauges, ClearListCountryData } from "../../../actions/CMS/LocalizationActions";
import { Flags } from "./Flags";

//Create Common class for AddEditCountriesScreen
class AddEditCountriesScreen extends Component {
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
      countryCode: item ? item.countryCode : "",
      countryName: item ? item.locale.en : "",
      statuses: [
        { value: R.strings.select_status, code: "" },
        { value: R.strings.Inactive, code: 0 },
        { value: R.strings.Active, code: 1 }
      ],
      selectedStatus: item ? (item.status == 1 ? R.strings.Active : R.strings.Inactive) : R.strings.select_status,
      selectedStatusCode: item ? item.status : "",
      activeLanguageDataState: null,
      languagesResponse: [],

      languages: [],
      selectedLanguage: '',
      selectedLanguageCode: '',
      selectedLanguageId: '',

      countrydata: {
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
      this.props.getActiveLangauges();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //For stop twice api call
    return isCurrentScreen(nextProps);
  }

  //submitData
  submitData = async () => {
    //validations for Inputs

    const { locale } = this.state.countrydata;

    // call validations functions
    let countryEmpty = this.CountryEmptyCheck(locale)
    let contryLengthNotValid = this.CountryLengthCheck(locale)
    //let validateCountry = this.validateCountry(locale)

    //validations for Inputs
    if (countryEmpty) {
      this.toast.Show(R.strings.enter + " " + R.strings.country_name);
      return;
    }
    if (contryLengthNotValid) {
      this.toast.Show(R.strings.countryNameCharLimit);
      return;
    }
    /* if (validateCountry) {
      this.toast.Show('enter valid country name)
      return;
    } */
    if (isEmpty(this.state.countryCode)) {
      this.toast.Show(R.strings.enter + " " + R.strings.countryCode);
      return;
    }
    if (!validCharacter(this.state.countryCode)) {
      this.toast.Show(R.strings.enterValidCountryCode);
      return;
    }
    if (this.state.countryCode.length != 2) {
      this.toast.Show(R.strings.countryCodeCharLimit);
      return;
    }

    Keyboard.dismiss();

    //Check NetWork is Available or not
    if (await isInternet()) {

      let data = {
        locale,
        countryCode: this.state.countryCode,
        status: this.state.selectedStatusCode
      };

      if (this.state.isEdit) {
        data = {
          ...data,
          countryId: parseIntVal(this.state.item.countryId)
        };

        //call editCountryApi api
        this.props.editCountryApi({ countrydata: data });
      } else {
        //call addCountryApi api
        this.props.addCountryApi({ countrydata: data });
      }
    }
  };

  async componentDidUpdate(prevProps, prevState) {

    const { countryAddData, countryEditData } = this.props.Listdata;

    if (countryAddData !== prevProps.Listdata.countryAddData) {
      // for show responce  Add
      if (countryAddData) {
        try {
          if (countryAddData.statusCode == 200) {
            showAlert(R.strings.Success, R.strings.RedcordAddedSuccessfully, 0, () => {
              this.props.ClearListCountryData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            showAlert(R.strings.status, countryAddData.message, 1, () => {
              this.props.ClearListCountryData();
            });
          }
        } catch (e) {
          this.props.ClearListCountryData();
        }
      }
    }

    if (countryEditData !== prevProps.Listdata.countryEditData) {
      // for show responce Update
      if (countryEditData) {
        try {
          if (countryEditData.statusCode == 200) {
            showAlert(R.strings.Success, R.strings.RedcordUpdatedSuccessfully, 0, () => {
              this.props.ClearListCountryData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            showAlert(R.strings.status, countryEditData.message, 1, () => {
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
    if (AddEditCountriesScreen.oldProps !== props) {
      AddEditCountriesScreen.oldProps = props;
    } else {
      return null;
    }

    if (isCurrentScreen(props)) {
      const { activeLanguageData } = props.Listdata;

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
    }
    return null;
  }

  //this Method is used to focus on next feild
  focusNextField(id) {
    this.inputs[id].focus();
  }


  onChangelanguagePress = async (index, item) => {
    this.setState({
      selectedLanguage: index,
      selectedLanguageCode: item.code,
      selectedLanguageId: item.id,
    })
  }

  onChangeAddCountryDetails(key, value, lang = '') {
    if (lang != '') {
      let statusCopy = Object.assign({}, this.state.countrydata);
      statusCopy.locale[lang] = value;
      this.setState(statusCopy);
    }
    else {
      this.setState({
        countrydata: {
          ...this.state.countrydata,
          [key]: value
        }
      });
    }
  }

  //chek state is empty or not
  CountryEmptyCheck = (obj) => {
    for (var key in obj) {
      if (obj[key] === "")
        return true
    }
    return false;
  }

  //chek state length
  CountryLengthCheck = (obj) => {
    for (var key in obj) {
      if (obj[key].length < 2 || obj[key].length > 100)
        return true
    }
    return false;
  }

  //chek regex for state name
  /* validateCountry = (obj) => {
    let reg = new RegExp(/^[A-Z a-z -]+$/);
    for (var key in obj) {
      if (!(reg.test(obj[key])))
        return true
    }
    return false
  } */

  render() {

    const {
      countryAddFetching,
      countryEditFetching,
      activeLanguageFetching
    } = this.props.Listdata;

    const { locale } = this.state.countrydata;

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
        {/* To Set Status Bas as per out theme */}
        <CommonStatusBar />

        {/* To Set ToolBar as per out theme */}
        <CustomToolbar
          title={
            this.state.isEdit
              ? R.strings.updateCountry
              : R.strings.addCountry
          }
          isBack={true}
          nav={this.props.navigation}
        />

        {/* Progress Dialog */}
        <ProgressDialog
          isShow={
            countryAddFetching ||
            countryEditFetching ||
            activeLanguageFetching
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
                isRequired={true}
                title={R.strings.language}
                searchable={true}
                array={this.state.languages}
                selectedValue={this.state.selectedLanguage}
                onPickerSelect={(index, object) => {
                  this.onChangelanguagePress(index, object)
                }}
                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />


              {/* To Set country_name in EditText */}
              {this.state.languagesResponse && this.state.languagesResponse.map((lang, key) => {
                if (this.state.selectedLanguageId == lang.id) {
                  return (
                    <EditText
                      key={key.toString()}
                      isRequired={true}
                      reference={input => {
                        this.inputs["etCountryName"] = input;
                      }}
                      header={R.strings.country_name + '' + '(' + this.state.selectedLanguageCode + ')'}
                      placeholder={R.strings.country_name}
                      multiline={false}
                      maxLength={60}
                      keyboardType="default"
                      returnKeyType={"next"}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this.focusNextField("etCountryCode");
                      }}
                      onChangeText={(countryName) => this.onChangeAddCountryDetails("countryName", countryName, lang.code)}
                      value={locale[lang.code]}
                    />
                  );
                }
              })}

              {/* To Set countryCode in EditText */}
              <EditText
                isRequired={true}
                reference={input => {
                  this.inputs["etCountryCode"] = input;
                }}
                header={R.strings.countryCode}
                placeholder={R.strings.countryCode}
                multiline={false}
                maxLength={2}
                keyboardType="default"
                returnKeyType={"done"}
                blurOnSubmit={false}
                value={this.state.countryCode}
                onChangeText={countryCode => this.setState({ countryCode })}
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
    //for addCountryApi  api data
    addCountryApi: request => dispatch(addCountryApi(request)),
    //for editCountryApi  api data
    editCountryApi: request => dispatch(editCountryApi(request)),
    //for getActiveLangauges  api data
    getActiveLangauges: () => dispatch(getActiveLangauges()),
    //for data clear
    ClearListCountryData: () => dispatch(ClearListCountryData())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditCountriesScreen);
