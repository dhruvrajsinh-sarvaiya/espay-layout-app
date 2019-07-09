import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, FlatList } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../controllers/CommonUtils';
import { setData, getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { getLanguages, setLanguages } from '../../actions/CMS/AppSettingsActions'
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import R from '../../native_theme/R';
import { languages as storedLanguages } from '../../localization/strings';
import ListLoader from '../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class LanguageScreen extends Component {
    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To bind method
        this.onBackPress = this.onBackPress.bind(this);

        //To set Back press method in params to handle h/w back button
        props.navigation.setParams({ onBackPress: this.onBackPress });

        let locale = getData(ServiceUtilConstant.KEY_Locale);

        this.state = {
            locale,
            languages: [],
            isFirstTime: true,
            selectedLanguage: locale
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //call api for get languages
            this.props.getLanguages();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.props.preference.locale !== nextProps.preference.locale ||
            this.props.languageData.languages !== nextProps.languageData.languages ||
            this.props.languageData.loading !== nextProps.languageData.loading ||
            this.state.locale !== nextState.locale ||
            this.props.languageData.isSettingLanguage !== nextProps.languageData.isSettingLanguage ||
            this.props.languageData.languageSetup !== nextProps.languageData.languageSetup) {
            return isCurrentScreen(nextProps);
        } else {
            return false;
        }
    }

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {
            let { languages } = props.languageData;

            if (languages) {

                try {
                    //if local subscribeNoti state is null or its not null and also different then new response then and only then validate response.
                    if (state.languagesData == null || (state.languagesData != null && languages !== state.languagesData)) {

                        if (validateResponseNew({ response: languages, statusCode: languages.statusCode, returnCode: languages.responseCode, returnMessage: languages.message })) {

                            let newLanguages = []

                            //Loop through all local languages
                            storedLanguages.map((item) => {

                                //to get index of same value if exist
                                let foundIndex = languages.data.language.findIndex(el => el.locale === item.value);

                                //if found index is greater than -1 means record is found
                                if (foundIndex > -1) {

                                    //To add 'selected' bit in each record which is default selected by user
                                    // languages.data.language[foundIndex].selected = languages.data.defaultlanguage.locale === item.value;
                                    languages.data.language[foundIndex].selected = languages.data.language[foundIndex].locale === state.locale;

                                    //to get the record of founded index from original languages response and add it to local array
                                    newLanguages.push(languages.data.language[foundIndex]);
                                }
                            })

                            return Object.assign({}, state, {
                                languages: newLanguages,
                                languagesData: languages,
                            })
                        } else {
                            return Object.assign({}, state, {
                                languages: [],
                            })
                        }
                    }
                }
                catch (e) {
                    return Object.assign({}, state, {
                        languages: [],
                    })
                }
            }

            if (state.locale !== props.preference[ServiceUtilConstant.KEY_Locale]) {

                let localArray = state.languages;

                localArray.map((el, index) => {
                    //if current item locale and parameter local field are same then it will store true else false
                    localArray[index].selected = el.locale === props.preference[ServiceUtilConstant.KEY_Locale];
                })

                return Object.assign({}, state, {
                    locale: props.preference[ServiceUtilConstant.KEY_Locale],
                    languages: localArray
                })
            }
        }
        return null
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { languageSet, languageSetup } = this.props.languageData;
        if (languageSet !== prevProps.languageData.languageSet) {
            if (!languageSetup) {
                try {
                    if (validateResponseNew({ response: languageSet })) {

                        R.strings.setLanguage(this.state.selectedLanguage);

                        //set selected language to whole app
                        setData({ [ServiceUtilConstant.KEY_Locale]: this.state.selectedLanguage });
                    }
                } catch (e) {
                }
            }
        }
    }

    updateLocale = async (locale) => {
        //If User Select Different Language then and only then call API
        //If User Select same Language then not Call API
        if (this.state.selectedLanguage !== locale) {
            //Check NetWork is Available or not
            if (await isInternet()) {
                //call api for get languages
                this.setState({ selectedLanguage: locale })
                this.props.setLanguages({ preferedLanguage: locale });
            }
        }
    }

    onBackPress() {

        //To update locale in previous screen
        this.props.navigation.state.params.updateLocale();

        //To go back
        this.props.navigation.goBack();
    }

    render() {
        let { loading, isSettingLanguage } = this.props.languageData

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.languageTitle}
                    isBack={true}
                    nav={this.props.navigation}
                    onBackPress={this.onBackPress}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isSettingLanguage} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <View style={{ flex: 1 }}>
                        <TextViewHML
                            style={{
                                marginLeft: R.dimens.padding_left_right_margin,
                                marginBottom: R.dimens.padding_top_bottom_margin,
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallText
                            }}>{R.strings.languageSubtitle}</TextViewHML>

                        {loading && <ListLoader />}

                        {!loading && this.state.languages.length > 0 && <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.languages}
                            extraData={this.state}
                            renderItem={({ item, index }) => <LanguageItem
                                item={item}
                                isFirst={index == 0}
                                isLast={index == (this.state.languages.length - 1)}
                                index={index}
                                key={item.name}
                                onPress={() => this.updateLocale(item.locale)}
                            />}
                            keyExtractor={item => item.name}
                            contentContainerStyle={contentContainerStyle(this.state.languages)}
                            ListEmptyComponent={<ListEmptyComponent />}
                        />}
                    </View>
                </View>
            </SafeView>
        );
    }
}

class LanguageItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            en: 'English',
            nl: 'Nederlands',
            pt: 'Português',
            es: 'Español'
        }
    }

    render() {

        let { isFirst, isLast, item: { name, locale, selected }, onPress } = this.props;
        return (
            <AnimatableItem>
                <TouchableWithoutFeedback onPress={onPress}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: isFirst ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginBottom: isLast ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginLeft: R.dimens.padding_left_right_margin,
                        marginRight: R.dimens.padding_left_right_margin
                    }}>
                        <View >
                            <TextViewMR
                                style={{
                                    color: R.colors.textPrimary,
                                    fontSize: R.dimens.mediumText,
                                }}>
                                {this.state[locale]}
                            </TextViewMR>
                            <TextViewHML
                                style={{
                                    color: R.colors.textSecondary,
                                    fontSize: R.dimens.smallText
                                }}>
                                {name}
                            </TextViewHML>
                        </View>

                        {selected && <Image source={R.images.IC_CHECKMARK} style={{
                            tintColor: R.colors.accent,
                            height: R.dimens.dashboardMenuIcon,
                            width: R.dimens.dashboardMenuIcon
                        }} />}
                    </View>

                </TouchableWithoutFeedback >
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // Updated state from reducer
        preference: state.preference,
        languageData: state.AppSettingsReducer,
    }
};

function mapStatToProps(dispatch) {
    return {
        //To get list of languages
        getLanguages: () => dispatch(getLanguages()),
        setLanguages: (selectedLanguage) => dispatch(setLanguages(selectedLanguage)),
    }
}

export default connect(mapStateToProps, mapStatToProps)(LanguageScreen);