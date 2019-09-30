import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import { changeTheme, addListener } from '../../controllers/CommonUtils';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { setData } from '../../App';
import { ServiceUtilConstant, Events } from '../../controllers/Constants';
import { navigateReset } from '../Navigation';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import SafeView from '../../native_theme/components/SafeView';
import { getBottomSpace } from '../../controllers/iPhoneXHelper';

export default class AppIntroScreen extends React.Component {
  constructor(props) {
    super(props)

    this.slider = React.createRef();
    this.onPageScroll = this.onPageScroll.bind(this);

    this.state = {
      page: 0,
      ...R.screen(),
      slides: [
        {
          key: 'screen1',
          title: R.strings.appIntroTitle1,
          text: R.strings.appIntroText1,
          titleStyle: { color: R.colors.textPrimary },
          textStyle: { color: R.colors.textPrimary },
          icon: R.images.ic_APPINTRO_1,
        },
        {
          key: 'screen2',
          title: R.strings.appIntroTitle2,
          text: R.strings.appIntroText2,
          titleStyle: { color: R.colors.textPrimary },
          textStyle: { color: R.colors.textPrimary },
          icon: R.images.ic_APPINTRO_2,
        },
        {
          key: 'screen3',
          title: R.strings.appIntroTitle3,
          text: R.strings.appIntroText3,
          titleStyle: { color: R.colors.textPrimary },
          textStyle: { color: R.colors.textPrimary },
          icon: R.images.ic_APPINTRO_3,
        }
      ],
    }
  }

  componentDidMount() {

    changeTheme();

    // add listener for update Dimensions
    this.dimensionListener = addListener(Events.Dimensions, (data) => this.setState(Object.assign({}, this.state, data)));
  }

  componentWillUnmount() {
    if (this.dimensionListener) {

      // remove listener of dimensions
      this.dimensionListener.remove();
    }
  }

  // for scrolling of page
  onPageScroll(scrollData) {

    // get position from scroll
    let { position } = scrollData

    if (this.state.page != position) {
      this.setState({ page: position });
    }
  }

  render() {
    return (
      <SafeView style={{ flex: 1 }}>

        {/* To set status bar as per our theme */}
        <CommonStatusBar />

        <IndicatorViewPager
          ref={comp => this.slider = comp}
          style={{ height: this.state.height, width: this.state.width }}
          indicator={this._renderDotIndicator()}
          onPageScroll={this.onPageScroll}>

          {this.state.slides.map((item) => <View key={item.key}>{this.renderItem(item)}</View>)}

        </IndicatorViewPager>

        <View style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          margin: R.dimens.margin,
        }}>
          {this.renderPrevButton()}
          <TextViewHML
            onPress={() => {

              //on Complete all Steps redirect to fresh language screen
              if (this.state.page == this.state.slides.length - 1) {

                setData({ [ServiceUtilConstant.KEY_PREF_FIRST_TIME]: false })

                // Redirecting to Fresh Language Selection
                navigateReset('LanguageFreshScreen')
              } else {

                //slide to next page
                this.slider.setPage(this.state.page + 1)
              }
            }}
            style={{
              flex: 1,
              textAlign: 'right',
              fontSize: R.dimens.mediumText,
              color: R.colors.accent
            }}>
            {this.state.page != this.state.slides.length - 1 ? R.strings.next.toUpperCase() : 'START'}
          </TextViewHML>
        </View>

      </SafeView>
    );
  }

  renderPrevButton() {
    if (this.state.page != 0) {
      return this.renderTextButton({
        title: R.strings.Prev,
        onPress: () => this.state.page != 0 && this.slider.setPage(this.state.page - 1),
      })
    } else {
      return null;
    }
  }

  renderNextStartButton() {
    let isLastIndex = this.state.page != this.state.slides.length - 1;

    return this.renderTextButton({
      title: isLastIndex ? R.strings.next : 'START',
      style: { textAlign: 'right' },
      onPress: () => {

        //on Complete all Steps redirect to fresh language screen
        if (isLastIndex) {

          setData({ [ServiceUtilConstant.KEY_PREF_FIRST_TIME]: false })

          // Redirecting to Fresh Language Selection
          navigateReset('LanguageFreshScreen')
        } else {

          //slide to next page
          this.slider.setPage(this.state.page + 1)
        }
      }
    });
  }

  renderTextButton(props) {
    return <TextViewHML
      onPress={props.onPress}
      style={[{
        flex: 1,
        fontSize: R.dimens.mediumText,
        color: R.colors.accent
      }, props.style]}>{props.title.toUpperCase()}</TextViewHML>
  }

  _renderDotIndicator() {
    let style = {
      height: R.dimens.margin,
      width: R.dimens.margin,
      borderRadius: R.dimens.widgetMargin,
      marginLeft: R.dimens.widgetMargin,
      marginRight: R.dimens.widgetMargin,
      marginBottom: R.dimens.margin + R.dimens.widgetMargin + (getBottomSpace() * 1.7)
    }
    return <PagerDotIndicator
      style={{ margin: R.dimens.margin }}
      pageCount={3}
      dotStyle={[style, { backgroundColor: R.colors.accent }]}
      selectedDotStyle={[style, { backgroundColor: R.colors.lightAccent }]} />;
  }

  renderItem = props => (
    <View
      style={this.styles().mainContent}
      colors={props.colors}>
      <View style={{
        width: this.state.isPortrait ? '100%' : '40%',
        height: this.state.isPortrait ? '50%' : '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image style={{ backgroundColor: 'transparent', width: R.dimens.appIntroImageWidthHeight, height: R.dimens.appIntroImageWidthHeight }} source={props.icon} size={100} color="white" />
      </View>

      <View style={{
        width: this.state.isPortrait ? '100%' : '60%',
        height: this.state.isPortrait ? '50%' : '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TextViewMR style={this.styles().title}>{props.title}</TextViewMR>
        <TextViewHML style={this.styles().text}>{props.text}</TextViewHML>
      </View>
    </View>
  );

  // styles for this class
  styles = () => {
    return {
      mainContent: {
        flex: 1,
        backgroundColor: R.colors.white,
        width: this.state.width,
        height: this.state.height,
        flexDirection: this.state.isPortrait ? 'column' : 'row'
      },
      text: {
        color: R.colors.textPrimary,
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: R.dimens.WidgetPadding,
        fontSize: R.dimens.smallText
      },
      title: {
        fontSize: R.dimens.largeText,
        color: R.colors.textPrimary,
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: R.dimens.widget_top_bottom_margin,
      }
    }
  }
}