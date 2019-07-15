import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen, addComponentDidResume } from '../../Navigation';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { getTopGainersData } from '../../../actions/Trade/TopGainerLoser/TopGainerActions';
import { getTopLosersData } from '../../../actions/Trade/TopGainerLoser/TopLoserActions';
import R from '../../../native_theme/R';
import { Cache } from '../../../App';

import SafeView from '../../../native_theme/components/SafeView';
import TopGainerLoserItem from './TopGainerLoserItem';
const CacheName = 'TopGainerLooser';

class TopGainerLooser extends Component {
    constructor(props) {
        super(props);

        // To handle resume screen event
        addComponentDidResume({ props, componentDidResume: this.componentDidResume, widgetname: CacheName })

        //Define All initial State
        this.state = {
            isGainer: typeof props.isGainer === 'undefined' ? true : props.isGainer,
            response: [],
            types: [{ value: R.strings.volume, code: 1 }, { value: R.strings.changePercentage, code: 2 }, { value: R.strings.lastPrice, code: 3 }, { value: R.strings.changeValue, code: 4 }],
            type: R.strings.volume
        };
    }

    componentDidResume = () => {

        // check cache data is exist then store into state and clear cache
        if (Cache.getCache(CacheName) !== undefined) {
            this.setState(Cache.getCache([CacheName]));
            Cache.setCache({ [CacheName]: undefined });
        }
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        this.callAPI();
    };

    async callAPI() {
        //If data is already stored then put in list and also set the picker
        if (this.props[this.state.isGainer ? 'dataGainer' : 'dataLoser'][this.state.isGainer ? 'topGainers' : 'topLosers']) {
            this.setState({ type: this.state.types[this.state.types.findIndex(el => el.code == this.props[this.state.isGainer ? 'dataGainer' : 'dataLoser'].type)].value })
        } else {
            //To check internet
            if (await isInternet()) {
                let type = this.state.types[this.state.types.findIndex(el => el.value === this.state.type)].code;

                if (this.state.isGainer) {
                    //To get top gainers
                    this.props.getTopGainers({ type });
                } else {
                    //To get top loser
                    this.props.getTopLosers({ type });
                }
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme
            || this.props.preference.locale !== nextProps.preference.locale
            || this.props.preference.dimensions.isPortrait !== nextProps.preference.dimensions.isPortrait) {
            return true;
        } else {
            let reducerData = this.state.isGainer ? 'dataGainer' : 'dataLoser';
            let moduleData = this.state.isGainer ? 'topGainers' : 'topLosers';

            if (this.props[reducerData][moduleData] !== nextProps[reducerData][moduleData] ||
                this.props[reducerData].loading !== nextProps[reducerData].loading ||
                this.state.response !== nextState.response ||
                this.props.isGainer !== nextProps.isGainer) {
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    }

    static getDerivedStateFromProps(props, state) {

        try {

            //Get All Updated field of Particular actions 
            let { topGainers } = props.dataGainer;
            let { topLosers } = props.dataLoser;

            let topGainersLoser = props.isGainer ? topGainers : topLosers;

            // check topgainer data is available
            if (topGainersLoser) {

                //if local topGainers state is null or its not null and also different then new response then and only then validate response.
                if (state.topGainersLoser == null || (state.topGainersLoser != null && topGainersLoser !== state.topGainersLoser)) {
                    let newState = { topGainersLoser, isGainer: props.isGainer };

                    if (validateResponseNew({ response: topGainersLoser, isList: true })) {

                        let res = parseArray(topGainersLoser.Response);

                        let finalList = [];
                        res.forEach((el, index) => {
                            if (index < 5) {
                                finalList.push(el);
                            }
                        })

                        newState = Object.assign({}, newState, {
                            response: finalList,
                        });
                    }

                    //check for current screen
                    if (isCurrentScreen(props)) {
                        return Object.assign({}, state, newState);
                    } else {
                        Cache.setCache({ [CacheName]: newState });
                    }
                }
            } else {
                if (state.isGainer != props.isGainer) {
                    return Object.assign({}, state, { isGainer: props.isGainer });
                }
            }
        } catch (error) {
            return Object.assign({}, state, { response: [] });
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isGainer != prevState.isGainer) {
            this.callAPI();
        }
    }


    render() {

        let result = [];

        //check for response is available or not
        if (this.state.response.length) {
            result = this.state.response;
        }

        return (
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background,
            }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* Progress and List*/}
                {(this.state.isGainer ? this.props.dataGainer.loading : this.props.dataLoser.loading)
                    ?
                    <View style={{ height: R.dimens.emptyListWidgetHeight }}>
                        <ListLoader />
                    </View>
                    :
                    (result &&
                        <FlatList
                            data={result}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return <TopGainerLoserItem
                                    isPortrait={this.props.preference.dimensions.isPortrait}
                                    index={index}
                                    item={item}
                                    size={result.length}
                                    type={this.state.type}
                                    theme={this.props.preference.theme}
                                />
                            }}
                            keyExtractor={(_item, index) => index.toString()}
                            contentContainerStyle={contentContainerStyle(result)}
                            ListEmptyComponent={<View style={{ height: R.dimens.emptyListWidgetHeight }}>
                                <ListEmptyComponent />
                            </View>}
                        />)
                }
            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    return {
        // Updated state for reducer
        preference: state.preference,
        dataGainer: state.topGainerReducer,
        dataLoser: state.topLoserReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform action for Top Gainer
        getTopGainers: (payload) => dispatch(getTopGainersData(payload)),
        // Perform action for TopLoser
        getTopLosers: (payload) => dispatch(getTopLosersData(payload)),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TopGainerLooser);