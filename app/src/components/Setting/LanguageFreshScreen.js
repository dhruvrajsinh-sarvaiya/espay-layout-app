import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, FlatList } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../controllers/CommonUtils';
import { setData, getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { isCurrentScreen, navigateReset } from '../Navigation';
import R from '../../native_theme/R';
import Button from '../../native_theme/components/Button';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class LanguageFreshScreen extends Component {
    constructor(props) {
        super(props);

        let locale = getData(ServiceUtilConstant.KEY_Locale);

        this.state = {
            locale,
            languages: [{
                "languageId": "english", "locale": "en", "name": "English", "icon": "en", "rtlLayout": "false", "sort_order": 1, "selected": "en" === locale
            },
            {
                "languageId": "dutch", "locale": "nl", "name": "Dutch", "icon": "nl", "rtlLayout": "false", "sort_order": 2, "selected": "nl" === locale
            }, {
                "languageId": "portuguese", "locale": "pt", "name": "Portuguese", "icon": "pt", "rtlLayout": "false", "sort_order": 4, "selected": "pt" === locale
            },
            {
                "languageId": "spenish", "locale": "es", "name": "Spenish", "icon": "es", "rtlLayout": "false", "sort_order": 3, "selected": "es" === locale
            }],
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    static getDerivedStateFromProps(props, state) {

        if (isCurrentScreen(props)) {

            if (state.locale !== props.preference[ServiceUtilConstant.KEY_Locale]) {

                let localArray = state.languages;

                localArray.map((el, index) => {
                    //if current item locale and parameter local field are same then it will store true else false
                    localArray[index].selected = el.locale === props.preference[ServiceUtilConstant.KEY_Locale];
                })

                //set updated language
                R.strings.setLanguage(props.preference[ServiceUtilConstant.KEY_Locale]);

                return Object.assign({}, state, {
                    locale: props.preference[ServiceUtilConstant.KEY_Locale],
                    languages: localArray
                })
            }
        }
        return null
    };

    updateLocale = (locale) => {

        //set selected language to whole app
        setData({ [ServiceUtilConstant.KEY_Locale]: locale });
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.languageTitle} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <View style={{ flex: 1 }}>
                        <TextViewHML
                            style={{
                                marginLeft: R.dimens.padding_left_right_margin,
                                marginBottom: R.dimens.padding_top_bottom_margin,
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallText
                            }}>{R.strings.languageSubtitle}</TextViewHML>

                        {this.state.languages.length > 0 && <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.languages}
                            extraData={this.state}
                            renderItem={({ item, index }) => <LanguageFreshItem
                                languageItem={item}
                                isFirstLanguage={index == 0}
                                isLastLanguage={index == (this.state.languages.length - 1)}
                                key={item.name}
                                onPress={() => this.updateLocale(item.locale)}
                            />}
                            keyExtractor={item => item.name}
                            contentContainerStyle={contentContainerStyle(this.state.languages)}
                            ListEmptyComponent={<ListEmptyComponent />}
                        />}
                    </View>

                    <View>
                        <Button
                            isRound={true}
                            title={R.strings.continue}
                            onPress={() => {
                                navigateReset('LoginNormalScreen')
                            }}
                            style={{ margin: R.dimens.padding_top_bottom_margin, width: R.screen().width / 2 }} />
                    </View>
                </View>
            </SafeView>
        );
    }
}

class LanguageFreshItem extends Component {
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

        let { isFirstLanguage, isLastLanguage, languageItem, onPress } = this.props;
        return (
            <AnimatableItem>
                <TouchableWithoutFeedback onPress={onPress}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: isFirstLanguage ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginBottom: isLastLanguage ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginLeft: R.dimens.padding_left_right_margin,
                        marginRight: R.dimens.padding_left_right_margin
                    }}>
                        <View >
                            <TextViewMR
                                style={{
                                    color: R.colors.textPrimary,
                                    fontSize: R.dimens.mediumText,
                                }}>
                                {this.state[languageItem.locale]}
                            </TextViewMR>
                            <TextViewHML
                                style={{
                                    color: R.colors.textSecondary,
                                    fontSize: R.dimens.smallText
                                }}>
                                {languageItem.name}
                            </TextViewHML>
                        </View>

                        {languageItem.selected && <Image source={R.images.IC_CHECKMARK} style={{
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
        preference: state.preference,
        // languageData: state.AppSettingsReducer,
    }
};

function mapStatToProps(dispatch) {
    return {
        //To get list of languages
        // getLanguages: () => dispatch(getLanguages()),
    }
}

export default connect(mapStateToProps, mapStatToProps)(LanguageFreshScreen);