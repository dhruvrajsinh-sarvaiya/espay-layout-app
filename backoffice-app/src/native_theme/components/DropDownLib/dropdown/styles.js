import { StyleSheet, Platform } from 'react-native';
import R from '../../../R';

export default StyleSheet.create({
  accessory: {
    width: R.dimens.accessorywidthheight,
    height: R.dimens.accessorywidthheight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  triangle: {
    width: R.dimens.trianglewidthheight,
    height: R.dimens.trianglewidthheight,
    transform: [{
      translateY: R.dimens.translateYminus,
    }, {
      rotate: '45deg',
    }],
  },

  triangleContainer: {
    width: R.dimens.triangleContainerwidth,
    height: R.dimens.triangleContainerheight,
    overflow: 'hidden',
    alignItems: 'center',

    backgroundColor: 'transparent', /* XXX: Required */
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  picker: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: R.dimens.LineHeight,

    position: 'absolute',

    ...Platform.select({
      ios: {
        shadowRadius: R.dimens.LineHeight,
        shadowColor: 'rgba(0, 0, 0, 1.0)',
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: R.dimens.LineHeight },
      },

      android: {
        elevation: R.dimens.CardViewElivation
      },
    }),
  },

  item: {
    textAlign: 'left',
  },

  scroll: {
    flex: 1,
    borderRadius: R.dimens.LineHeight,
  },

  scrollContainer: {
    paddingVertical: R.dimens.trianglewidthheight,
  },
});
