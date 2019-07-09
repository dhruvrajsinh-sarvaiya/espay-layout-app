import React from 'react';
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import Accordion from 'react-native-collapsible/Accordion';
import { connect } from 'react-redux';
import { getFaqcategories, getFaqquestions } from '../../actions/CMS/FAQsScreenAction'
import { changeTheme } from '../../controllers/CommonUtils';
import { View, ScrollView, TouchableWithoutFeedback, Image } from 'react-native';
import { isInternet, } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import Separator from '../../native_theme/components/Separator';
import R from '../../native_theme/R';
import { isCurrentScreen } from '../Navigation';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import { getCardStyle } from '../../native_theme/components/CardView';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';

let title = ''

class FAQsScreen extends React.PureComponent {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            response: [],
            searchInput: '',
            isFirstTime: true,
            refreshing: true,
            activeSections: [],
        };
        //----------
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Fetch FAQ API
            // for get categories list
            this.props.getFaqcategories();

            // for get Faqs list
            this.props.getFaqquestions();
            //----------
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

        //check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated fields of Particular actions
            var { faqs_categories_list, faqs } = props.appData;
            let mainResponse = []
            try {
                //check response is available or not
                if (faqs && faqs_categories_list) {

                    // map for faq category and list
                    faqs_categories_list.map((ValueCat) => {
                        faqs.map((valueFaq) => {

                            //check category and questions that are metching 
                            if (ValueCat._id.toString() === valueFaq.category_id.toString()) {
                                try {
                                    mainResponse.push({
                                        category_name: ValueCat.locale[R.strings.getLanguage()].category_name,
                                        question: valueFaq.locale[R.strings.getLanguage()].question,
                                        answer: valueFaq.locale[R.strings.getLanguage()].answer
                                    })
                                } catch (e) {
                                    //while getting error, get default language
                                    mainResponse.push({
                                        category_name: ValueCat.locale.en.category_name,
                                        question: valueFaq.locale.en.question,
                                        answer: valueFaq.locale.en.answer
                                    })
                                }
                            }
                        })
                    })
                    return { ...state, response: mainResponse, refreshing: false }
                }
                else {
                    return { ...state, response: mainResponse, refreshing: false }
                }
            } catch (error) {
                return { ...state, response: mainResponse, refreshing: false }
            }
        }
        return null;
    }

    //for changing selection
    setSection = sections => {
        this.setState({ activeSections: sections.includes(undefined) ? [] : sections, });
    };

    // for displaying Question and answer of faq
    renderHeader = (section, _, isActive) => {
        return (
            <View>
                <View style={this.styles().simpleItem}>

                    <View style={this.styles().cardViewStyle}>

                        {/* View for displaying heaeder (Question) */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <ImageTextButton
                                icon={R.images.IC_CHAT}
                                style={{ justifyContent: 'center', alignSelf: 'center', marginRight: R.dimens.widgetMargin, width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.SMALL_MENU_ICON_SIZE, height: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.white }}
                            />
                            <TextViewMR style={[this.styles().headerText, { flex: 1, marginRight: R.dimens.widgetMargin, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }]}>{section.question}</TextViewMR>
                            <Image
                                source={isActive ? R.images.IC_COLLAPSE_ARROW : R.images.IC_EXPAND_ARROW}
                                style={{
                                    marginLeft: R.dimens.widgetMargin,
                                    tintColor: R.colors.textPrimary,
                                    height: R.dimens.SMALL_MENU_ICON_SIZE,
                                    width: R.dimens.SMALL_MENU_ICON_SIZE
                                }}
                            />

                        </View>

                        {/* Display answer when the active bit is true means need to display answer */}
                        {isActive && this.content(section, _, isActive)}
                    </View>
                </View>
            </View>
        )
    };

    // for display content (answer)
    content = (section, _, isActive) => {
        return (
            <View style={this.styles().content}>

                {/* text for displaying answer */}
                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{section.answer}</TextViewHML>

            </View>
        )
    }

    // for title of section
    _renderSectionTitle = (section, needHeader) => {

        //check title and category name are same or not
        if (!needHeader && title === section.category_name && title !== '') {
            title = ''
        }
        else {
            title = section.category_name
        }
        return (
            /* View for displaying section title */
            <View>
                {title === '' ? null :
                    <View style={{ marginLeft: R.dimens.padding_left_right_margin, marginRight: R.dimens.padding_left_right_margin, marginTop: R.dimens.widget_top_bottom_margin }}>
                        <TextViewMR style={{
                            color: R.colors.textPrimary,
                            fontSize: R.dimens.mediumText,
                        }}>{title}</TextViewMR>
                        <Separator style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />
                    </View>
                }
            </View>
        );
    }

    render() {

        //fetch loading bit for progressbar handling
        let isFetching = this.props.appData.faqloading;

        let finalItems = this.state.response
        if (finalItems.length > 0) {

            //for final items from search input (validate on Amount and status)
            //default searchInput is empty so it will display all records.
            finalItems = this.state.response.filter(item => (item.question.toLowerCase().includes(this.state.searchInput.toLowerCase())));
        }

        return (
            <SafeView style={this.styles().container} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.faq}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                <View style={{ flex: 1 }}>
                    {(isFetching || this.state.refreshing) ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={contentContainerStyle(finalItems)}>
                                {this.state.response.length > 0 ?
                                    <Accordion
                                        activeSections={this.state.activeSections}
                                        sections={finalItems}
                                        renderSectionTitle={(section) => this._renderSectionTitle(section, finalItems.length == 1)}
                                        touchableComponent={TouchableWithoutFeedback}
                                        renderHeader={this.renderHeader}
                                        renderContent={() => null}
                                        onChange={this.setSection}
                                    /> :
                                    <ListEmptyComponent />}
                            </ScrollView>
                        </View>
                    }
                </View>
            </SafeView>
        );
    }
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background
            },
            headerText: {
                textAlign: 'left',
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallText,
            },
            content: {
                marginTop: R.dimens.widgetMargin,
                marginRight: R.dimens.widgetMargin,
                paddingLeft: R.dimens.WidgetPadding,
                marginBottom: R.dimens.widgetMargin,
                paddingRight: R.dimens.WidgetPadding,
            },
            simpleItem: {
                flex: 1,
                marginRight: R.dimens.margin,
                marginLeft: R.dimens.margin,
            },
            cardViewStyle: {
                flex: 1,
                ...getCardStyle(R.dimens.CardViewElivation),
                margin: R.dimens.widgetMargin,
                backgroundColor: R.colors.cardBackground,
                padding: R.dimens.widgetMargin,
                borderRadius: R.dimens.cardBorderRadius,
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        //data get from the reducer and set to appData
        appData: state.FAQReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        getFaqcategories: () => dispatch(getFaqcategories()),
        getFaqquestions: () => dispatch(getFaqquestions()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FAQsScreen)