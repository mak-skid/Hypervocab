import { english } from './en';
import { japanese } from './ja';
import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
    'en': english,
    'ja': japanese
});