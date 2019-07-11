/**
 * App Success Theme
 */
import { createMuiTheme } from '@material-ui/core/styles';
import AppConfig from 'Constants/AppConfig';

const successTheme = createMuiTheme({
    palette: {
        primary: {
            main: AppConfig.themeColors.success
        },
        secondary: {
            main: AppConfig.themeColors.primary
        }
    }
});

export default successTheme;