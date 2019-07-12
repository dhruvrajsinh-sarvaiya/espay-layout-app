import React, { Component } from 'react';
import { View, FlatList, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import MenuListItem from '../../native_theme/components/MenuListItem';
import SafeView from '../../native_theme/components/SafeView';

class SurveyMenuScreen extends Component {
    constructor(props) {
        super(props);

        /**
         * id = 1- featuresurvey, 
         * id = 2- coinlistsurvey
         * id = 3- feedbacksurvey 
         *  */

        //Define All State initial state
        this.state = {
            data: [
                {
                    title: R.strings.feature_survey,
                    icon: R.images.IC_ARROW_RIGHT_BOLD,
                    id: 1,
                },
                {
                    title: R.strings.coin_list_survey,
                    icon: R.images.IC_ARROW_RIGHT_BOLD,
                    id: 2
                },
                {
                    title: R.strings.feedback_survey,
                    icon: R.images.IC_ARROW_RIGHT_BOLD,
                    id: 3
                },
            ],
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    // pass id to next screen for get idwisedata from api 
    onModuleSelect(id, title) {
        this.props.navigation.navigate('SurveyScreen', { id: id, title: title })
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }} >

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Survey}
                    isBack={true}
                    nav={this.props.navigation}
                />

                <View style={{ flex: 1 }}>

                    {/* for display Headers for list  */}
                    {
                        this.state.data.length
                            ?
                            <View style={{ flex: 1, marginBottom: R.dimens.widgetMargin }}>
                                <FlatList
                                    data={this.state.data}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <MenuListItem title={item.title} onPress={() => this.onModuleSelect(item.id, item.title)} icon={item.icon} />
                                    )}
                                    keyExtractor={item => item.id.toString()}
                                    contentContainerStyle={[
                                        { flexGrow: 1 },
                                        this.state.data.length ? null : { justifyContent: 'center' }
                                    ]}
                                />

                            </View>
                            :
                            <ListEmptyComponent />
                    }
                </View>
            </SafeView>
        );
    }
}
export default SurveyMenuScreen