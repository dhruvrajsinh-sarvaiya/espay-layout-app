import strings from "../localization/strings";
import dimens from './helpers/dimens';
import Colors from "./helpers/colors";
import drawables from "../assets/drawables";
import { getData } from '../App';
import { ServiceUtilConstant } from '../controllers/Constants';

//Resource
const R = {
    strings: strings,
    dimens: dimens,
    colors: Colors,
    images: drawables,

    // to get dynamic height, width & isPortrait
    screen: () => {
        return {
            height: getData(ServiceUtilConstant.KEY_DIMENSIONS).height,
            width: getData(ServiceUtilConstant.KEY_DIMENSIONS).width,
            isPortrait: getData(ServiceUtilConstant.KEY_DIMENSIONS).isPortrait
        }
    }
}

export default R;