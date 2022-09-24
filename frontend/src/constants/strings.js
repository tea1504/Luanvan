import LocalizedStrings from 'react-localization'
import Constants from '.'
import en from 'src/commons/locales/en'
import vi from 'src/commons/locales/vn'

const Strings = new LocalizedStrings({
  en,
  vi,
})

const language = localStorage.getItem(Constants.StorageKeys.LANGUAGE)
console.log(language)
if (language) Strings.setLanguage(language)
else Strings.setLanguage(Constants.DefaultLanguage)

export default Strings
