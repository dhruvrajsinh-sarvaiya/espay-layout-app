import LocalizedStrings from 'react-native-localization';
import enUS from './enUS';
import nlNL from './nlNL';
import ptPT from './ptPT';
import esES from './esES';

const strings = new LocalizedStrings({
        en: { ...enUS }, //English
        nl: { ...nlNL }, //Dutch
        pt: { ...ptPT }, //Portuguese
        es: { ...esES }, //Spanish
});

export const languages = [
        { name: 'English', value: 'en' },
        { name: 'Dutch', value: 'nl' },
        { name: 'Portuguese', value: 'pt' },
        { name: 'Spanish', value: 'es' }]

export default strings;