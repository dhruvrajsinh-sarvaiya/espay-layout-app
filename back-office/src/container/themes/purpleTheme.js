/**
 * App Purple Theme
 */
import { createMuiTheme } from '@material-ui/core/styles';
import AppConfig from 'Constants/AppConfig';

const purpleTheme = createMuiTheme({
    palette: {
        primary: {
            main: AppConfig.themeColors.purple
        },
        secondary: {
            main: AppConfig.themeColors.primary
        }
    }
});

export default purpleTheme;