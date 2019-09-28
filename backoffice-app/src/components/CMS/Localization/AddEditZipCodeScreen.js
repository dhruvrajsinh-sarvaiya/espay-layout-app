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
import { isInternet, validateResponseNew, isEmpty } from "../../../validations/CommonValidation";
import CommonToast from "../../../native_theme/components/CommonToast";
import ProgressDialog from "../../../native_theme/components/ProgressDialog";
import R from "../../../native_theme/R";
import { TitlePicker } from "../../widget/ComboPickerWidget";
import SafeView from "../../../native_theme/components/SafeView";
import { addZipCodeApi, editZipCodeApi, ClearListCountryData, getListCountryApi, getStateByCountryIdApi, getCityByStateIdApi } from "../../../actions/CMS/LocalizationActions";

//Create Common class for AddEditZipCodeScreen
class AddEditZipCodeScreen extends Component {
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

      cityByStateIdDataState: null,

      statuses: [
        { value: R.strings.Active, code: 1 },
        { value: R.strings.Inactive, code: 0 }
      ],
      selectedStatus: item ? (item.status == 1 ? R.strings.Active : R.strings.Inactive) : R.strings.Active,
      selectedStatusCode: item ? item.status : 1,

      countries: [],
      selectedCountry: R.strings.Please_Select,
      selectedCountryId: item ? (item.countryId != undefined ? item.countryId : '') : '',

      states: [],
      selectedState: R.strings.Please_Select,
      selectedStateId: item ? item.stateId : '',

      cities: [],
      selectedCity: R.strings.Please_Select,
      selectedCityId: item ? item.cityId : '',

      zipCode: item ? item.zipcode : '',
      zipAreaName: item ? item.zipAreaName : '',
    };

    // create reference
    this.toast = React.createRef();
  }

  async componentDidMount() {
    //Add this method to change theme based on stored theme name.
    changeTheme();

    //Check NetWork is Available or not
    if (await isInternet()) {

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


  //submitData for add or edit button press
  submitData = async () => {

    //validations for Inputs
    if (isEmpty(this.state.zipCode)) {
      this.toast.Show(R.strings.enter + " " + R.strings.zip_postal);
      return;
    }
    if (this.state.zipCode.length < 2 || this.state.zipCode.length > 30) {
      this.toast.Show(R.strings.zipCodeCharLimit);
      return;
    }
    if (isEmpty(this.state.zipAreaName)) {
      this.toast.Show(R.strings.enter + " " + R.strings.zipAreaName);
      return;
    }
    if (this.state.zipAreaName.length < 2 || this.state.zipAreaName.length > 100) {
      this.toast.Show(R.strings.zipCodeCharLimit);
      return;
    }
    if (this.state.selectedCountry === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.country);
      return;
    }
    if (this.state.selectedState === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.state);
      return;
    }
    if (this.state.selectedCity === R.strings.Please_Select) {
      this.toast.Show(R.strings.select + " " + R.strings.city);
      return;
    }

    Keyboard.dismiss();

    //Check NetWork is Available or not
    if (await isInternet()) {

      let request = {
        countryId: this.state.selectedCountryId,
        stateId: this.state.selectedStateId,
        cityId: this.state.selectedCityId,
        status: this.state.selectedStatusCode,
        zipAreaName: this.state.zipAreaName
      };

      if (this.state.isEdit) {

        request = {
          ...request,
          zipcodesId: parseIntVal(this.state.item.zipcodesId),
          zipcode: this.state.zipCode,
        };

        //call editZipCodeApi api
        this.props.editZipCodeApi({ zipCodedata: request });
      } else {

        request = {
          ...request,
          zipCode: this.state.zipCode,
        };

        //call addZipCodeApi api
        this.props.addZipCodeApi({ zipCodedata: request });
      }
    }
  };

  componentDidUpdate = async (prevProps, prevState) => {

    const { countryListData, stateByCountryIdData, zipCodeAddData, zipCodeEditData } = this.props.Listdata;

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
            let selectedCountry = R.strings.Please_Select;

            for (var countryKey in countryListDataResponse) {
              let item = countryListDataResponse[countryKey]
              item.value = item.locale.en
            }

            // set country name based on previous screen country id
            if (this.state.isEdit) {

              //for add countryListDataResponse
              for (var selCountryKey in countryListDataResponse) {
                let item = countryListDataResponse[selCountryKey];

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

          } else {
          }
        } catch (e) {
        }
      }
    }

    if (stateByCountryIdData !== prevProps.Listdata.stateByCountryIdData) {

      if (stateByCountryIdData) {
        try {
          //if  response is success then store array list else store empty list
          if (validateResponseNew({
            response: stateByCountryIdData,
            returnCode: stateByCountryIdData.responseCode,
            isList: true,
          })) {

            let stateByCountryIdDataResponse = parseArray(stateByCountryIdData.data);

            for (var stateKey in stateByCountryIdDataResponse) {
              let item = stateByCountryIdDataResponse[stateKey]
              item.value = item.locale.en
            }

            let selectedState = R.strings.Please_Select;

            // set country name based on previous screen country id
            if (this.state.isEdit) {

              //for add stateByCountryIdDataResponse
              for (var statebyCountryKey in stateByCountryIdDataResponse) {
                let item = stateByCountryIdDataResponse[statebyCountryKey];

                if (this.state.item.stateId && item.stateId == this.state.item.stateId)
                  selectedState = item.locale.en;
              }

              if (this.state.item.countryId && await isInternet())

                // call getStateByCountryIdApi
                this.props.getCityByStateIdApi({ stateId: this.state.item.stateId })
            }

            let states = [
              { value: R.strings.Please_Select },
              ...stateByCountryIdDataResponse
            ];

            this.setState({
              states,
              selectedState
            })

          } else {
          }
        } catch (e) {
        }
      }
    }

    if (zipCodeAddData !== prevProps.Listdata.zipCodeAddData) {
      // for show responce  Add
      if (zipCodeAddData) {
        try {
          if (zipCodeAddData.statusCode == 200) {
            showAlert(R.strings.Success, R.strings.RedcordAddedSuccessfully, 0, () => {
              this.props.ClearListCountryData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            showAlert(R.strings.status, zipCodeAddData.message, 1, () => {
              this.props.ClearListCountryData();
            });
          }
        } catch (e) {
          this.props.ClearListCountryData();
        }
      }
    }

    if (zipCodeEditData !== prevProps.Listdata.zipCodeEditData) {
      // for show responce Update
      if (zipCodeEditData) {
        try {
          if (zipCodeEditData.statusCode == 200) {
            showAlert(R.strings.Success, R.strings.RedcordUpdatedSuccessfully, 0, () => {
              this.props.ClearListCountryData();
              this.props.navigation.state.params.onSuccess(); // if add success call list method from back screen
              this.props.navigation.goBack();
            });
          } else {
            showAlert(R.strings.status, zipCodeEditData.message, 1, () => {
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
    if (AddEditZipCodeScreen.oldProps !== props) {
      AddEditZipCodeScreen.oldProps = props;
    } else {
      return null;
    }

    if (isCurrentScreen(props)) {
      const { cityByStateIdData } = props.Listdata;
      if (cityByStateIdData) {
        try {
          //if local cityByStateIdData state is null or its not null and also different then new response then and only then validate response.
          if (state.cityByStateIdDataState == null || (state.cityByStateIdDataState != null && cityByStateIdData !== state.cityByStateIdDataState)) {

            //if  response is success then store array list else store empty list
            if (validateResponseNew({
              response: cityByStateIdData,
              returnCode: cityByStateIdData.responseCode,
              isList: true,
            })) {

              let cityByStateIdDataResponse = parseArray(cityByStateIdData.data);

              for (var cityByStateIdDataResponsekey in cityByStateIdDataResponse) {
                let item = cityByStateIdDataResponse[cityByStateIdDataResponsekey]
                item.value = item.locale.en
              }

              let selectedCity = R.strings.Please_Select;

              // set state name based on previous screen state id
              if (state.isEdit) {
                //for add cityByStateIdDataResponse
                for (var selctedCityKey in cityByStateIdDataResponse) {
                  let item = cityByStateIdDataResponse[selctedCityKey];
                  if (item.cityId == state.item.cityId)
                    selectedCity = item.locale.en;
                }
              }

              let cities = [
                { value: R.strings.Please_Select },
                ...cityByStateIdDataResponse
              ];

              return {
                ...state, cityByStateIdDataState: cityByStateIdData,
                refreshing: false,
                cities,
                selectedCity
              };
            } else {
              return { ...state, cityByStateIdDataState: cityByStateIdData };
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

  // on change country 
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

  // on change state press 
  onStateChangePress = async (index, item) => {

    try {
      //To Check User is Selected or Not
      if (index != R.strings.Please_Select) {

        //Check NetWork is Available or not
        if (await isInternet()) {

          //Call getCityByStateIdApi Api 
          this.props.getCityByStateIdApi({ stateId: item.stateId });
          this.setState({
            selectedState: index,
            selectedStateId: item.stateId,
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
      zipCodeAddFetching,
      zipCodeEditFetching,
      countryListFetching, stateByCountryIdFetching, cityByStateIdFetching
    } = this.props.Listdata;

    return (
      <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
        {/* To Set Status Bas as per out theme */}
        <CommonStatusBar />

        {/* To Set ToolBar as per out theme */}
        <CustomToolbar
          title={
            this.state.isEdit
              ? R.strings.updateZipCode
              : R.strings.addZipCode
          }
          isBack={true}
          nav={this.props.navigation}
        />

        {/* Progress Dialog */}
        <ProgressDialog
          isShow={
            zipCodeAddFetching ||
            zipCodeEditFetching ||
            countryListFetching ||
            stateByCountryIdFetching || cityByStateIdFetching
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

              {/* Inputfield for zippostal code */}
              <EditText
                isRequired={true}
                reference={input => {
                  this.inputs["etZipCode"] = input;
                }}
                header={R.strings.zip_postal}
                placeholder={R.strings.zip_postal}
                multiline={false}
                maxLength={30}
                keyboardType="default"
                returnKeyType={"next"}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.focusNextField("etZipArea");
                }}
                onChangeText={zipCode => this.setState({ zipCode })}
                value={this.state.zipCode}
              />

              {/* Inputfield for ZipArea code */}
              <EditText
                isRequired={true}
                reference={input => {
                  this.inputs["etZipArea"] = input;
                }}
                header={R.strings.zipAreaName}
                placeholder={R.strings.zipAreaName}
                multiline={false}
                maxLength={100}
                keyboardType="default"
                returnKeyType={"done"}
                blurOnSubmit={false}
                onChangeText={zipAreaName => this.setState({ zipAreaName })}
                value={this.state.zipAreaName}
              />

              {/* Dropdown for country */}
              <TitlePicker
                isRequired={true}
                title={R.strings.Country}
                searchable={true}
                array={this.state.countries}
                selectedValue={this.state.selectedCountry}
                onPickerSelect={(index, object) => {
                  this.onChangeCountryPress(index, object)
                }}
                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

              {/* Dropdown for State */}
              <TitlePicker
                isRequired={true}
                title={R.strings.state}
                searchable={true}
                array={this.state.states}
                selectedValue={this.state.selectedState}
                onPickerSelect={(stateName, object) => this.setState({ selectedState: stateName, selectedStateId: object.stateId })}
                onPickerSelect={(index, object) => {
                  this.onStateChangePress(index, object)
                }}
                style={{ marginTop: R.dimens.widget_top_bottom_margin, }} />

              {/* Dropdown for city */}
              <TitlePicker
                isRequired={true}
                title={R.strings.city}
                searchable={true}
                array={this.state.cities}
                selectedValue={this.state.selectedCity}
                onPickerSelect={(city, object) => this.setState({ selectedCity: city, selectedCityId: object.cityId })}
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
  //Updated Data For all reducers Data 
  let Listdata = {
    ...state.LocalizationReducer,
    ...state.CitiesReducer,
    ...state.ZipCodesReducer,
  }
  return { Listdata }
}

function mapDispatchToProps(dispatch) {
  return {
    //Perform getListCountryApi List Action 
    getListCountryApi: (request) => dispatch(getListCountryApi(request)),
    //Perform getStateByCountryIdApi List Action 
    getStateByCountryIdApi: (request) => dispatch(getStateByCountryIdApi(request)),
    //Perform getCityByStateIdApi List Action 
    getCityByStateIdApi: (request) => dispatch(getCityByStateIdApi(request)),
    //for addZipCodeApi  api data
    addZipCodeApi: request => dispatch(addZipCodeApi(request)),
    //for editZipCodeApi  api data
    editZipCodeApi: request => dispatch(editZipCodeApi(request)),
    //for data clear
    ClearListCountryData: () => dispatch(ClearListCountryData())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditZipCodeScreen);
