import { AppRegistry } from 'react-native';
import App from './src/App';

// To stop calling api twice in first screen of splash screen
global.isLicense = true; // this will be set to false once license call api is executed and set to true once its response came.

// To stop calling api of exchange and margin twice based on its isMargin bit.
global.isMargin = false; // its value changes in trading modules

// To use delayed dialog for progress and aler modal. This feature will only work in iOS
global.isDelayedDialog = false; // default false, if require than use global.isDelayedDialog = true in any class constructor and set false in class unmount method
global.delayDialog = 250; // default 250 milliseconds

AppRegistry.registerComponent('NewStackApp', () => App);