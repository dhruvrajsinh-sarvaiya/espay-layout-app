import React, { Component, PureComponent } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import { IndicatorViewPager as IndicatorViewPagerReal, PagerTitleIndicator } from 'rn-viewpager';
import R from '../R';
import Separator from './Separator';
import LinearTextGradient from '../components/LinearTextGradient';
import LinearGradient from 'react-native-linear-gradient';
import TextViewHML from './TextViewHML';
import { Fonts, Events } from '../../controllers/Constants';
import { addListener } from '../../controllers/CommonUtils';

class IndicatorViewPager extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.viewPager = React.createRef();

        let reduceWidth = 0, width = Dimensions.get('window').width;

        //If anyhow any kind of margins are given from user than change total screenwidth based on that margin
        if (props.style !== undefined) {
            if (props.style.marginLeft !== undefined && props.style.marginRight !== undefined) {
                reduceWidth = props.style.marginLeft + props.style.marginRight;
            } else if (props.style.marginLeft !== undefined) {
                reduceWidth = props.style.marginLeft;
            } else if (props.style.marginRight !== undefined) {
                reduceWidth = props.style.marginLeft;
            } else if (props.style.margin !== undefined) {
                reduceWidth = props.style.margin;
            } else {
                reduceWidth = 0;
            }

            if (props.style.width !== undefined) {
                width = props.style.width;
            }
        }

        //Define All initial State
        this.state = {
            itemWidth: 0,
            screenWidth: width - reduceWidth,

            //If titles are available in props than use it otherwise use empty array
            titles: props.titles !== undefined ? props.titles : [],

            //If titles are available and its size greater than 0 than use it otherwise use 0 size
            tabsSize: props.titles !== undefined ? (props.titles.length > 0 ? props.titles.length - 1 : 0) : 0,

            //Number of items to display in Tab
            numOfItems: props.numOfItems !== undefined ? props.numOfItems : 5
        };
    }

    componentDidMount() {
        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, this.onDimensionChange)
    }

    componentWillUnmount() {
        if (this.dimensionListener) {
            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    onDimensionChange = (data) => {
        let props = this.props;

        let reduceWidth = 0, width = data.width;

        //If anyhow any kind of margins are given from user than change total screenwidth based on that margin
        if (props.style !== undefined) {
            if (props.style.marginLeft !== undefined && props.style.marginRight !== undefined) {
                reduceWidth = props.style.marginLeft + props.style.marginRight;
            } else if (props.style.marginLeft !== undefined) {
                reduceWidth = props.style.marginLeft;
            } else if (props.style.marginRight !== undefined) {
                reduceWidth = props.style.marginLeft;
            } else if (props.style.margin !== undefined) {
                reduceWidth = props.style.margin;
            } else {
                reduceWidth = 0;
            }

            if (props.style.width !== undefined) {
                width = props.style.width;
            }
        }

        this.setState({ screenWidth: width - reduceWidth, });
    }

    setPage(selectedPage) {
        this.viewPager.setPage(selectedPage);
    }

    render() {
        return (
            <IndicatorViewPagerReal
                ref={comp => this.viewPager = comp}
                indicator={this.renderTitleIndicator()}
                {...this.props}
                style={[{ flex: 1, flexDirection: 'column-reverse', backgroundColor: R.colors.background }]}>
                {this.props.children}
            </IndicatorViewPagerReal>
        );
    }

    renderTitleIndicator() {
        return (
            <PagerTitleIndicator
                style={[{ backgroundColor: R.colors.background, height: R.dimens.ButtonHeight }, this.props.style]}
                trackScroll={this.state.titles.length > this.state.numOfItems}
                itemStyle={{ margin: 0, padding: 0, backgroundColor: 'transparent' }}
                selectedBorderStyle={{ backgroundColor: 'transparent' }}
                titles={this.state.titles}
                renderTitle={(index, title, isSelected) => this.renderTitle(index, title, isSelected)}
            />
        )
    }

    // for dispaying titles of view pager
    renderTitle(index, title, isSelected) {

        //get number of itmes from state
        let numOfItems = this.state.numOfItems;

        //Screen width
        let titleWidth = this.state.screenWidth;

        //final Width of last extra item
        let finalWidth = 0;

        //If item is last than store finalWidth from dynamic width
        if (index == this.state.tabsSize && this.state.itemWidth != 0) {
            let totalItems = (index + 1) * this.state.itemWidth;

            // to check if value is not negative
            if ((titleWidth - totalItems) > 0) {
                finalWidth = titleWidth - totalItems;
            }
        }

        return (
            <View
                onLayout={({ nativeEvent: { layout: { width } } }) => {

                    // if state itemWidth is 0 or 
                    // old itemWidth and new width is different and view is not last and width is greater than 0 
                    // then store new width
                    if (this.state.itemWidth == 0 || (this.state.itemWidth != width && index != this.state.tabsSize && width > 0)) {
                        this.setState({ itemWidth: width })
                    }
                }}
                style={[{ flexDirection: 'row', height: R.dimens.ButtonHeight }, index == this.state.tabsSize ? {} : { width: titleWidth / numOfItems }]}>

                <TitleItem
                    title={title}
                    isSelected={isSelected}
                    color={isSelected ? R.colors.accent : R.colors.textSecondary}
                    width={titleWidth / numOfItems}
                    onPress={this.props.onPress}
                    isGradient={this.props.isGradient} />

                {
                    //Extra Space Item
                    index == this.state.tabsSize && <TitleItem
                        title={' '}
                        isSelected={false}
                        color={R.colors.textSecondary}
                        width={finalWidth}
                        onPress={this.props.onPress}
                        isGradient={this.props.isGradient} />
                }
            </View>);
    }
}

export class TitleItem extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.title !== nextProps.title ||
            this.props.color !== nextProps.color ||
            this.props.width !== nextProps.width ||
            this.props.isSelected !== nextProps.isSelected ||
            this.props.isGradient !== nextProps.isGradient) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        let { title, color, width, isSelected, isGradient, onPress } = this.props;
        if (onPress !== undefined) {
            return (
                <TouchableWithoutFeedback onPress={() => {
                    onPress && onPress(title, isSelected)
                }}>
                    <View style={{ width: width, justifyContent: 'center' }}>
                        <TextAccessory
                            title={title}
                            color={color}
                            isSelected={isSelected}
                            isGradient={isGradient}
                        />
                        <IndicatorSeparator
                            width={width}
                            color={color}
                            isSelected={isSelected}
                            isGradient={isGradient}
                        />
                    </View>
                </TouchableWithoutFeedback>)
        } else {
            return (
                <View style={{ width: width, justifyContent: 'center' }}>
                    <TextAccessory
                        title={title}
                        color={color}
                        isSelected={isSelected}
                        isGradient={isGradient}
                    />
                    <IndicatorSeparator
                        width={width}
                        color={color}
                        isSelected={isSelected}
                        isGradient={isGradient}
                    />
                </View>)
        }
    }
}

export class TextAccessory extends PureComponent {
    render() {
        let { title, color, isSelected, isGradient } = this.props;

        if (isGradient && isSelected) {
            return (
                <LinearTextGradient
                    style={{ fontSize: R.dimens.smallText, textAlign: 'center', fontFamily: Fonts.HindmaduraiLight }}>
                    {title}
                </LinearTextGradient>
            )
        } else {
            return (
                <TextViewHML style={[{
                    textAlign: 'center',
                    color: color,
                    fontSize: R.dimens.smallText,
                }]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {title}
                </TextViewHML>)
        }
    }
}

export class IndicatorSeparator extends PureComponent {
    render() {
        let { width, color, isSelected, isGradient } = this.props;
        if (isGradient && isSelected) {
            return (
                /* for bottom separator gradient line */
                <LinearGradient
                    style={{
                        width: width,
                        height: R.dimens.LineHeight,
                        position: 'absolute',
                        bottom: 0,
                        marginLeft: 0,
                        marginRight: 0
                    }}
                    colors={[R.colors.linearStart, R.colors.linearEnd]}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />
            )
        }
        else {
            return (
                <Separator
                    width={width}
                    height={R.dimens.LineHeight}
                    color={color}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        marginLeft: 0,
                        marginRight: 0
                    }} />
            )
        }
    }
}

export default IndicatorViewPager;    