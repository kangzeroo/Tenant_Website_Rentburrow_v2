export const i18n = (phrase) => {
  const code = localStorage.getItem('rentburrow_lang')
  return phrase[code]
}

export default i18n
