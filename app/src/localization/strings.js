import LocalizedStrings from 'react-native-localization';
import en_US from './en_US';
import nl_NL from './nl_NL';
import pt_PT from './pt_PT';
import es_ES from './es_ES';

export const strings = new LocalizedStrings({
        en: { ...en_US }, //English
        nl: { ...nl_NL }, //Dutch
        pt: { ...pt_PT }, //Portuguese
        es: { ...es_ES }, //Spanish
});

export const languages = [
        { name: 'English', value: 'en' },
        { name: 'Dutch', value: 'nl' },
        { name: 'Portuguese', value: 'pt' },
        { name: 'Spanish', value: 'es' }]