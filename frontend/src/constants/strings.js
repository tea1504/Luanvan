import LocalizedStrings from 'react-localization'
import Constants from '.'
import en from 'src/commons/locales/en'
import vi from 'src/commons/locales/vn'

const Strings = new LocalizedStrings({
  vi,
  en,
})

const language = localStorage.getItem(Constants.StorageKeys.LANGUAGE)
if (language) Strings.setLanguage(language)
else Strings.setLanguage(Constants.DefaultLanguage)

export default Strings
