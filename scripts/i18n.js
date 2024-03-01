function getElementsWithText() {
  return document.querySelectorAll('[data-i18n]');
}

async function fetchTranslations(language) {
  const response = await fetch(`/locales/${language}.json`);
  return response.json();
}

const AVAILABLE_LANGUAGES = Object.freeze(['en', 'fr']);

function updateUI(translations, language) {
  const elements = getElementsWithText();
  for (const element of elements) {
    const key = element.getAttribute('data-i18n');
    if (element.textContent !== translations[key])
      element.textContent = translations[key];
  }

  document.documentElement.lang = language;
  window.dispatchEvent(new Event('resize'));
}

const defaultLanguage =
  AVAILABLE_LANGUAGES.find((language) =>
    navigator.language.includes(language)
  ) ?? AVAILABLE_LANGUAGES[0];

const defaulTranslations = await fetchTranslations(defaultLanguage);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () =>
    updateUI(defaulTranslations, defaultLanguage)
  );
} else updateUI(defaulTranslations, defaultLanguage);
