import { AppRegistry } from 'react-native';
import App from './src/App';

global.isLicense = true;

AppRegistry.registerComponent('NewStackApp', () => App);