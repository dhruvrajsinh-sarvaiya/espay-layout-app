// ImageViewWidget
import React, { Component } from 'react';
import { Image } from 'react-native';
import R from '../../native_theme/R';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { mergeStyle, getBaseUrl } from '../../controllers/CommonUtils';

class ImageViewWidget extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            isAvailable: true,
            url: props.url != '' ? getBaseUrl() + 'CurrencyLogo/' + props.url + '.png' : null,
        };
    }

    componentDidMount = () => {
        this._isMounted = true;
        Image
            .getSize(this.state.url,
                () => {
                    if (this._isMounted) {
                        this.setState({ isAvailable: true, url: this.state.url })
                    }
                },
                () => {
                    if (this._isMounted) {
                        this.setState({ isAvailable: false })
                    }
                })
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    static getDerivedStateFromProps(props, state) {

        let oldImage = props.url;
        let newImage = state.url;

        if (!props.url.includes('.png')) {
            oldImage = getBaseUrl() + 'CurrencyLogo/' + props.url + '.png';
        }

        if (oldImage !== newImage) {
            return Object.assign({}, state, { url: props.url });
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {

        let oldImage = prevState.url;
        let newImage = this.state.url;

        if (oldImage !== newImage) {
            Image.getSize(newImage,
                () => {
                    this.setState({ isAvailable: true, url: newImage })
                },
                () => {
                    this.setState({ isAvailable: false })
                })
        }
    }


    render() {

        // Get required field from props
        let backgroundColor = this.props.backgroundColor ? this.props.backgroundColor : 'transparent';
        let height = this.props.height ? this.props.height : R.dimens.IconWidthHeight;
        let width = this.props.width ? this.props.width : R.dimens.IconWidthHeight;
        let isNotAvailable = this.props.isNotAvailable ? true : false;

        let style = {
            backgroundColor: backgroundColor,
            width: width,
            height: height,
            marginRight: R.dimens.widgetMargin
        }

        // let image = this.state.isAvailable ? this.state.url : this.state.failureImage
        if (this.state.isAvailable && !this.state.url.includes('file://')) {

            let style = {
                backgroundColor: backgroundColor,
                width: width,
                height: height,
                marginRight: R.dimens.widgetMargin
            }

            return (
                <Image
                    resizeMode={'cover'}
                    source={{ uri: this.state.url }}
                    style={mergeStyle(this, style, 'style')} />
            );
        } else {
            const ignoreStrings = [R.strings.Select_Wallet, R.strings.selectToken, R.strings.Select_Coin, R.strings.Please_Select, R.strings.selectCurrency]

            style = Object.assign({}, style, { tintColor: isNotAvailable ? '#4e5c6e' : R.colors.textPrimary });

            style = mergeStyle(this, style, 'style');

            return (
                <Image
                    resizeMode={'cover'}
                    source={!ignoreStrings.includes(this.state.url.replace(getBaseUrl() + 'CurrencyLogo/', '').replace('.png', '')) ? R.images.IMG_CURRENCY : null}
                    style={style} />
            );
        }
    }
}

export default ImageViewWidget;