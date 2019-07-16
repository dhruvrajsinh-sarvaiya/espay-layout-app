import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

global.isLicense = true;

AppRegistry.registerComponent(appName, () => App);