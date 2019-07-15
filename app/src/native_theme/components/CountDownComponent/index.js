import React from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AppState
} from 'react-native';
import R from '../../R';
import { parseIntVal } from '../../../controllers/CommonUtils';

const DEFAULT_DIGIT_STYLE = { backgroundColor: '#FAB913' };
const DEFAULT_DIGIT_TXT_STYLE = { color: '#000' };
const DEFAULT_TIME_LABEL_STYLE = { color: '#000' };
const DEFAULT_SEPARATOR_STYLE = { color: '#000' };
const DEFAULT_TIME_TO_SHOW = ['D', 'H', 'M', 'S'];
const DEFAULT_TIME_LABELS = {
    d: 'Days',
    h: 'Hours',
    m: 'Minutes',
    s: 'Seconds',
};

class CountDown extends React.Component {
    static propTypes = {
        digitStyle: PropTypes.object,
        digitTxtStyle: PropTypes.object,
        timeLabelStyle: PropTypes.object,
        separatorStyle: PropTypes.object,
        timeToShow: PropTypes.array,
        showSeparator: PropTypes.bool,
        size: PropTypes.number,
        until: PropTypes.number,
        onChange: PropTypes.func,
        onPress: PropTypes.func,
        onFinish: PropTypes.func,
    };

    //Define All initial State
    state = {
        until: Math.max(this.props.until, 0),
        lastUntil: null,
        wentBackgroundAt: null,
        olduntil: this.props.until,
    };

    constructor(props) {
        super(props);
        this.timer = setInterval(this.updateTimer, 1000);
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    static oldProps = {};

    //handle response with new life cycle
    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (CountDown.oldProps !== props) {
            CountDown.oldProps = props;
        } else {
            return null;
        }

        //Get All Updated Feild of Particular actions
        const { until } = props;

        if (state.olduntil !== until) {
            try {
                return {
                    lastUntil: state.until,
                    until: Math.max(until, 0)
                }
            } catch (e) {
                return {
                    lastUntil: null,
                    until: Math.max(state.olduntil, 0),
                }
                //Handle Catch and Notify User to Exception.
            }
        }
        return null;
    }

    // handle app active and background state for timer
    _handleAppStateChange = currentAppState => {
        const { until, wentBackgroundAt } = this.state;
        if (currentAppState === 'active' && wentBackgroundAt && this.props.running) {
            const diff = (Date.now() - wentBackgroundAt) / 1000.0;
            this.setState({
                lastUntil: until,
                until: Math.max(0, until - diff)
            });
        }
        if (currentAppState === 'background') {
            this.setState({ wentBackgroundAt: Date.now() });
        }
    }

    // to get time left in timer
    getTimeLeft = () => {
        const { until } = this.state;
        return {
            seconds: until % 60,
            minutes: parseIntVal(until / 60, 10) % 60,
            hours: parseIntVal(until / (60 * 60), 10) % 24,
            days: parseIntVal(until / (60 * 60 * 24), 10),
        };
    };

    // update timer as per time interval
    updateTimer = () => {
        const { lastUntil, until } = this.state;

        if (lastUntil === until || !this.props.running) {
            return;
        }
        if (until === 1 || (until === 0 && lastUntil !== 1)) {
            if (this.props.onFinish) {
                this.props.onFinish();
            }
            if (this.props.onChange) {
                this.props.onChange(until);
            }
        }

        if (until === 0) {
            this.setState({ lastUntil: 0, until: 0 });
        } else {
            if (this.props.onChange) {
                this.props.onChange(until);
            }
            this.setState({
                lastUntil: until,
                until: Math.max(0, until - 1)
            });
        }
    };

    // display timer digit
    renderDigit = (d) => {
        const { digitStyle, digitTxtStyle, size } = this.props;
        return (
            <View style={[
                styles.digitCont,
                digitStyle,
                { width: size * 2.3, height: size * 2.6 },
            ]}>
                <Text style={[
                    styles.digitTxt,
                    { fontSize: size },
                    digitTxtStyle,
                ]}>
                    {d}
                </Text>
            </View>
        );
    };

    // render lable of timer
    renderLabel = label => {
        const { timeLabelStyle, size } = this.props;
        if (label) {
            return (
                <Text style={[
                    styles.timeTxt,
                    { fontSize: size / 1.8 },
                    timeLabelStyle,
                ]}>
                    {label}
                </Text>
            );
        }
    };

    // display timer with double digit
    renderDoubleDigits = (label, digits) => {
        return (
            <View style={styles.doubleDigitCont}>
                <View style={styles.timeInnerCont}>
                    {this.renderDigit(digits)}
                </View>
                {this.renderLabel(label)}
            </View>
        );
    };

    // display separator for timer
    renderSeparator = () => {
        const { separatorStyle, size } = this.props;
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[
                    styles.separatorTxt,
                    { fontSize: size * 1.2 },
                    separatorStyle,
                ]}>
                    {':'}
                </Text>
            </View>
        );
    };

    // display 0 before timer value if number value is 0 to 9
    pad2(number) {
        return (parseIntVal(number) < 10 ? '0' : '') + parseIntVal(number)
    }

    // for display timer control
    renderCountDown = () => {
        const { timeToShow, timeLabels, showSeparator } = this.props;
        const { days, hours, minutes, seconds } = this.getTimeLeft();
        const Component = this.props.onPress ? TouchableOpacity : View;

        return (
            <Component
                style={styles.timeCont}
                onPress={this.props.onPress}
            >
                {timeToShow.includes('D') ? this.renderDoubleDigits(timeLabels.d, this.pad2(days)) : null}
                {showSeparator && timeToShow.includes('D') && timeToShow.includes('H') ? this.renderSeparator() : null}
                {timeToShow.includes('H') ? this.renderDoubleDigits(timeLabels.h, this.pad2(hours)) : null}
                {showSeparator && timeToShow.includes('H') && timeToShow.includes('M') ? this.renderSeparator() : null}
                {timeToShow.includes('M') ? this.renderDoubleDigits(timeLabels.m, this.pad2(minutes)) : null}
                {showSeparator && timeToShow.includes('M') && timeToShow.includes('S') ? this.renderSeparator() : null}
                {timeToShow.includes('S') ? this.renderDoubleDigits(timeLabels.s, this.pad2(seconds)) : null}
            </Component>
        );
    };

    render() {
        return (
            <View style={this.props.style}>
                {this.renderCountDown()}
            </View>
        );
    }
}

CountDown.defaultProps = {
    digitStyle: DEFAULT_DIGIT_STYLE,
    digitTxtStyle: DEFAULT_DIGIT_TXT_STYLE,
    timeLabelStyle: DEFAULT_TIME_LABEL_STYLE,
    timeLabels: DEFAULT_TIME_LABELS,
    separatorStyle: DEFAULT_SEPARATOR_STYLE,
    timeToShow: DEFAULT_TIME_TO_SHOW,
    showSeparator: false,
    until: 0,
    size: R.dimens.firstCurrencyText,
    running: true,
};

const styles = StyleSheet.create({
    timeCont: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    timeTxt: {
        color: 'white',
        marginVertical: 2,
        backgroundColor: 'transparent',
    },
    timeInnerCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    digitCont: {
        borderRadius: 5,
        marginHorizontal: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doubleDigitCont: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    digitTxt: {
        color: 'white',
        fontWeight: 'bold',
        fontVariant: ['tabular-nums']
    },
    separatorTxt: {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
    },
});

module.exports = CountDown;