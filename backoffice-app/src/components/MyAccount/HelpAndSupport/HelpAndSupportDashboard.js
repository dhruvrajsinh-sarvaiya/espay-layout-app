import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import { connect } from 'react-redux';
import { changeTheme } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../../components/Navigation';
import { getTotalComplainCount } from '../../../actions/account/HelpAndSupportActions';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import CustomCard from '../../../components/widget/CustomCard';
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import R from '../../../native_theme/R';
import DashboardHeader from '../../widget/DashboardHeader';
import ThemeToolbarWidget from '../../widget/ThemeToolbarWidget';
import SafeView from '../../../native_theme/components/SafeView';

class HelpAndSupportDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: 0,
            TotalComplainResponse: [
                { title: '-', value: R.strings.TotalComplain, icon: R.images.ic_list_alt, type: 1 },
                { title: '-', value: R.strings.OpenComplain, icon: R.images.IC_OPEN_FOLDER_OUTLINE, type: 1 },
                { title: '-', value: R.strings.CloseComplain, icon: R.images.IC_OPEN_FOLDER, type: 1 },
                { title: '-', value: R.strings.PendingComplain, icon: R.images.IC_PENCIL_BOX, type: 1 },
            ],
            isGrid: true,
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check internet connection available or not
        if (await isInternet()) {
            // Called Total Complain Count Api
            this.props.getTotalComplainCount()
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps)
    };

    /* When user press on particular grid item */
    onGridPress = (index) => {
        let { navigate } = this.props.navigation

        //redirect type screen based on card select
        if (index == 0)
            navigate('ComplainReportScreen', { All: true })
        else if (index == 1)
            navigate('ComplainReportScreen', { Status: 1, All: false })
        else if (index == 2)
            navigate('ComplainReportScreen', { Status: 2, All: false })
        else if (index == 3)
            navigate('ComplainReportScreen', { Status: 3, All: false })
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (HelpAndSupportDashboard.oldProps !== props) {
            HelpAndSupportDashboard.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated field of Particular actions
            const { TotalComplainCountData, } = props.TotalComplainResult

            // TotalComplainCountData is not null
            if (TotalComplainCountData) {
                try {
                    if (state.TotalComplainCountData == null || (state.TotalComplainCountData != null && TotalComplainCountData !== state.TotalComplainCountData)) {

                        if (validateResponseNew({ response: TotalComplainCountData })) {
                            //check Total Complain Count Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            let res = TotalComplainCountData.TotalCountDetails;
                            let Oldresponse = state.TotalComplainResponse

                            Oldresponse[0].title = validateValue(res.TotalCount)
                            Oldresponse[1].title = validateValue(res.TotalOpenCount)
                            Oldresponse[2].title = validateValue(res.TotalCloseCount)
                            Oldresponse[3].title = validateValue(res.TotalPendidngCount)

                            return Object.assign({}, state, { TotalComplainResponse: Oldresponse, TotalComplainCountData })
                        } else
                            return Object.assign({}, state, { TotalComplainResponse: state.TotalComplainResponse, TotalComplainCountData: null })
                    }
                } catch (error) {
                    return Object.assign({}, state, { TotalComplainResponse: state.TotalComplainResponse, TotalComplainCountData: null })
                }
            }
        }
        return null
    }

    render() {

        let { TotalComplainCountLoading } = this.props.TotalComplainResult

        return (
            <SafeView style={this.styles().container}>
                {/* Common Statusbar for Help and Support Dashboard */}
                <CommonStatusBar />

                {/* CustomToolbar for Help and Support Dashboard */}
                <CustomToolbar
                    isBack={true}
                    rightMenuRenderChilds={<ThemeToolbarWidget />}
                    nav={this.props.navigation} />

                {/* ProgressDialog for Help and Support Dashboard */}
                <ProgressDialog isShow={TotalComplainCountLoading} />

                {/* for header name and icon */}
                <DashboardHeader
                    navigation={this.props.navigation}
                    header={R.strings.HelpAndSupport}
                    isGrid={this.state.isGrid}
                    onPress={() => this.setState({ isGrid: !this.state.isGrid })}
                />

                <View style={{ flex: 1 }}>

                    {this.state.TotalComplainResponse.length > 0 ?
                        <FlatList
                            key={this.state.isGrid ? 'Grid' : 'List'}
                            numColumns={this.state.isGrid ? 2 : 1}
                            data={this.state.TotalComplainResponse}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                            /* render all item in list */
                            renderItem={({ item, index }) => {
                                return (
                                    <CustomCard
                                        isGrid={this.state.isGrid}
                                        index={index}
                                        size={this.state.TotalComplainResponse.length}
                                        title={item.title}
                                        value={item.value}
                                        type={item.type}
                                        icon={item.icon}
                                        onChangeHeight={(height) => {
                                            this.setState({ viewHeight: height })
                                        }}
                                        viewHeight={this.state.viewHeight}
                                        onPress={() => this.onGridPress(index)} />
                                )
                            }}
                            /* assign index as key valye to Ip History list item */
                            keyExtractor={(item, index) => index.toString()}
                        />
                        : null}
                </View>

                <View style={{ margin: R.dimens.margin }}>
                    <ImageButton
                        icon={R.images.BACK_ARROW}
                        style={{ margin: 0, width: '20%', height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.white, elevation: R.dimens.CardViewElivation, borderRadius: R.dimens.roundButtonRedius, justifyContent: 'center', alignItems: 'center' }}
                        iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.accent }]}
                        onPress={() => this.props.navigation.goBack()} />
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            }
        }
    }
}

/* return state from saga or reducer */
const mapStateToProps = (state) => {
    //Updated Data For HelpAndSupportReducer Data  
    return {
        TotalComplainResult: state.HelpAndSupportReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //Perform getTotalComplainCount List Action 
    getTotalComplainCount: () => dispatch(getTotalComplainCount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HelpAndSupportDashboard);