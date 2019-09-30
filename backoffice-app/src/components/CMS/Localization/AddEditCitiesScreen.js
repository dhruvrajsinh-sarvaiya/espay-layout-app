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
import { isInternet, validateResponseNew } from "../../../validations/CommonValidation";
import CommonToast from "../../../native_theme/components/CommonToast";
import ProgressDialog from "../../../native_theme/components/ProgressDialog";
import R from "../../../native_theme/R";
import { TitlePicker } from "../../widget/ComboPickerWidget";
import SafeView from "../../../native_theme/components/SafeView";
import { addCityApi, editCityApi, getActiveLangauges, ClearListCountryData, getListCountryApi, getStateByCountryIdApi } from "../../../actions/CMS/LocalizationActions";
import { Flags } from "./Flags";

//Create Common class for AddEditCitiesScreen
class AddEditCitiesScreen extends Component {
  constructor(props) {
    super(props);

    //item for edit from List screen
    let item =
      props.navigation.state.params && props.navigation.state.params.item;

    //Define All State initial state
    this.state = {

      item: item,
      isEdit: item ? true : false,

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
      selectedCountryId: item ? (item.countryId != undefined ? item.countryId : '') : '',

      states: [],
      selectedState: R.strings.Please_Select,
      selectedStateId: item ? item.stateId : '',

      citydata: {
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

  //chek city is empty or not
  CityEmptyChek = (obj) => {
    for (var key in obj) {
      if (obj[key] === "")
        return true
    }
    return false;
  }

  //chek city length
  CityLengthCheck = (obj) => {
    for (var key in obj) {
      if (obj[key].length < 2 || obj[key].length > 100)
        return true
    }
    return false;
  }

  //chek regex for city name
  /* validateState = (obj) => {
    let reg = new RegExp(/^[A-Z a-z -]+$/);
    for (var key in obj) {
      if (!(reg.test(obj[key])))
        return true
    }
    return false
  } */

  //submitData for add or edit button press
  submitData = async () => {
    const { locale } = this.state.citydata;

    // call validations functions
    let cityEmpty = this.CityEmptyChek(locale)
    let cityLengthNotValid = this.CityLengthCheck(locale)
    //let validateState = this.validateState(locale)

    //validations for Inputs
    if (cityEmpty) {
      this.toast.Show(R.strings.enter + " " + R.strings.cityName);
      return;
    }
    if (cityLengthNotValid) {
      this.toast.Show(R.strings.cityNameCharLimit);
      return;
    }
    /* if (validateState) {
      this.toast.Show('enter valid city name')
      return;
    } */

    if (this.state.selectedCountry === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.country);
      return;
    }

    if (this.state.selectedState === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.state);
      return;
    }

    Keyboard.dismiss();

    //Check NetWork is Available or not
    if (await isInternet()) {

      let data = {
        countryId: this.state.selectedCountryId,
        stateId: this.state.selectedStateId,
        locale,
        status: this.state.selectedStatusCode
      };

      if (this.state.isEdit) {
        data = {
          ...data,
          cityId: parseIntVal(this.state.item.cityId)
        };
        //call editCityApi api
        this.props.editCityApi({ citydata: data });
      } else {
        //call addCityApi api
        this.props.addCityApi({ citydata: data });
      }
    }
  };

  componentDidUpdate = async (prevProps, prevState) => {

    const { countryListData, cityAddData, cityEditData } = this.props.Listdata;

    if (countryListData !== prevProps.Listdata.countryListData) {

      if (countryListData) {
        try {
          //if  response is success then store array list else store empty list
          if (validateResponseNew({
            response: countryListData,
            returnCode: countryListData.responseCode,
            isList: true,
          })) {

            let countryListDataResponse = parseArray(countryListData.data);

            for (var key in countryListDataResponse) {
              let item = countryListDataResponse[key]
              item.value = item.locale.en
            }

            let selectedCountry = R.strings.Please_Select;

            // set country name based on previous screen country id
            if (this.state.isEdit) {

              //for add countryListDataResponse
              for (var data in countryListDataResponse) {
                let item = countryListDataResponse[data];

                if (this.state.item.countryId && item.countryId == this.state.item.countryId)
                  selectedCountry = item.locale.en;
              }

              if (this.state.item.countryId && await isInternet())

                // call getStateByCountryIdApi
                this.props.getStateByCountryIdApi({ countryId: this.state.item.countryId })
            }

            let countries = [
              { value: R.strings.Please_Select },
              ...countryListDataResponse
            ];

            this.setState({
              countries,
              selectedCountry
            })

          }
        } catch (e) {
        }
      }
    }

    if (cityAddData !== prevProps.Listdata.cityAddData) {
      // for show responce  Add
      if (cityAddData) {
        try {
          if (cityAddData.statusCode == 200) {
            showAlert(R.strings.Success, R.strings.RedcordAddedSuccessfully, 0, () => {
              this.props.ClearListCountryData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            showAlert(R.strings.status, cityAddData.message, 1, () => {
              this.props.ClearListCountryData();
            });
          }
        } catch (e) {
          this.props.ClearListCountryData();
        }
      }
    }

    if (cityEditData !== prevProps.Listdata.cityEditData) {
      // for show responce Update
      if (cityEditData) {
        try {
          if (cityEditData.statusCode == 200) {
            showAlert(R.strings.Success, R.strings.RedcordUpdatedSuccessfully, 0, () => {
              this.props.ClearListCountryData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            showAlert(R.strings.status, cityEditData.message, 1, () => {
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
    if (AddEditCitiesScreen.oldProps !== props) {
      AddEditCitiesScreen.oldProps = props;
    } else {
      return null;
    }

    if (isCurrentScreen(props)) {
      const { activeLanguageData, stateByCountryIdData } = props.Listdata;

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
              for (var langKey in res) {
                let item = res[langKey]
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

      if (stateByCountryIdData) {
        try {
          //if local stateByCountryIdData state is null or its not null and also different then new response then and only then validate response.
          if (state.stateByCountryIdDataState == null || (state.stateByCountryIdDataState != null && stateByCountryIdData !== state.stateByCountryIdDataState)) {

            //if  response is success then store array list else store empty list
            if (validateResponseNew({
              response: stateByCountryIdData,
              returnCode: stateByCountryIdData.responseCode,
              isList: true,
            })) {

              let stateByCountryIdDataResponse = parseArray(stateByCountryIdData.data);

              for (var stateByCountryIdDataResponsekey in stateByCountryIdDataResponse) {
                let item = stateByCountryIdDataResponse[stateByCountryIdDataResponsekey]
                item.value = item.locale.en
              }

              let selectedState = R.strings.Please_Select;

              // set state name based on previous screen state id
              if (state.isEdit) {
                //for add stateByCountryIdDataResponse
                for (var data in stateByCountryIdDataResponse) {
                  let item = stateByCountryIdDataResponse[data];
                  if (item.stateId == state.item.stateId)
                    selectedState = item.locale.en;
                }
              }

              let states = [
                { value: R.strings.Please_Select },
                ...stateByCountryIdDataResponse
              ];

              return {
                ...state, stateByCountryIdDataState: stateByCountryIdData,
                refreshing: false,
                states,
                selectedState
              };
            } else {
              return { ...state, stateByCountryIdDataState: stateByCountryIdData };
            }
          }
        } catch (e) {
          return { ...state };
        }
      }

    }
    return null;
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
      let statusCopy = Object.assign({}, this.state.citydata);
      statusCopy.locale[lang] = value;
      this.setState(statusCopy);
    }
    else {
      this.setState({
        citydata: {
          ...this.state.citydata,
          [key]: value
        }
      });
    }
  }

  // on change langauge 
  onChangeCountryPress = async (index, item) => {

    try {
      //To Check User is Selected or Not
      if (index != R.strings.Please_Select) {

        //Check NetWork is Available or not
        if (await isInternet()) {

          //Call Get Wallet List Api 
          this.props.getStateByCountryIdApi({ countryId: item.countryId });
          this.setState({
            selectedCountry: index,
            selectedCountryId: item.countryId,
          })
        }
      }
    }
    catch (e) {
      //Catch Code here
    }
  }

  render() {

    const {
      cityAddFetching,
      cityEditFetching,
      activeLanguageFetching, countryListFetching, stateByCountryIdFetching
    } = this.props.Listdata;

    const { locale } = this.state.citydata;

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
        {/* To Set Status Bas as per out theme */}
        <CommonStatusBar />

        {/* To Set ToolBar as per out theme */}
        <CustomToolbar
          title={
            this.state.isEdit
              ? R.strings.updateCity
              : R.strings.addCity
          }
          isBack={true}
          nav={this.props.navigation}
        />

        {/* Progress Dialog */}
        <ProgressDialog
          isShow={
            cityAddFetching ||
            cityEditFetching ||
            activeLanguageFetching ||
            countryListFetching ||
            stateByCountryIdFetching
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
                isRequired={true}
                array={this.state.languages}
                selectedValue={this.state.selectedLanguage}
                onPickerSelect={(index, object) => {
                  this.onChangelanguagePress(index, object)
                }}
                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />


              {/* To Set cityName in EditText */}
              {this.state.languagesResponse && this.state.languagesResponse.map((lang, key) => {
                if (this.state.selectedLanguageId == lang.id) {
                  return (
                    <EditText
                      key={key.toString()}
                      isRequired={true}
                      header={R.strings.cityName + '' + '(' + this.state.selectedLanguageCode + ')'}
                      placeholder={R.strings.cityName}
                      multiline={false}
                      maxLength={60}
                      keyboardType="default"
                      returnKeyType={"done"}
                      blurOnSubmit={false}
                      onChangeText={(cityName) => this.onChangeAddCountryDetails("cityName", cityName, lang.code)}
                      value={locale[lang.code]}
                    />
                  );
                }
              })}

              {/* Dropdown for country */}
              <TitlePicker
                title={R.strings.Country}
                searchable={true}
                isRequired={true}
                array={this.state.countries}
                selectedValue={this.state.selectedCountry}
                onPickerSelect={(index, object) => {
                  this.onChangeCountryPress(index, object)
                }}
                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

              {/* Dropdown for State */}
              <TitlePicker
                title={R.strings.state}
                searchable={true}
                isRequired={true}
                array={this.state.states}
                selectedValue={this.state.selectedState}
                onPickerSelect={(stateName, object) => this.setState({ selectedState: stateName, selectedStateId: object.stateId })}
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
    ...state.CitiesReducer,
  }
  return { Listdata }
}

function mapDispatchToProps(dispatch) {
  return {
    //Perform getListCountryApi List Action 
    getListCountryApi: (request) => dispatch(getListCountryApi(request)),
    //Perform getStateByCountryIdApi List Action 
    getStateByCountryIdApi: (request) => dispatch(getStateByCountryIdApi(request)),
    //for addCityApi  api data
    addCityApi: request => dispatch(addCityApi(request)),
    //for editCityApi  api data
    editCityApi: request => dispatch(editCityApi(request)),
    //for getActiveLangauges  api data
    getActiveLangauges: () => dispatch(getActiveLangauges()),
    //for data clear
    ClearListCountryData: () => dispatch(ClearListCountryData())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditCitiesScreen);
