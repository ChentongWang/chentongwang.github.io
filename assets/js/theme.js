/* 中文直接编辑 HTML 正文，英文编辑对应元素的 data-en 属性。 */
(() => {
  const preferences = window.homepagePreferences;
  const themeSelect = document.getElementById('themeSelect');
  const languageSelect = document.getElementById('languageSelect');
  const translatedElements = Array.from(document.querySelectorAll('[data-en]')).map(element => ({
    element,
    chinese: element.innerHTML,
    english: element.dataset.en
  }));
  const translatedAttributes = [];
  for (const attribute of ['aria-label', 'alt']) {
    document.querySelectorAll('[data-en-' + attribute + ']').forEach(element => {
      translatedAttributes.push({
        element,
        attribute,
        chinese: element.getAttribute(attribute),
        english: element.getAttribute('data-en-' + attribute)
      });
    });
  }
  function applyLanguage() {
    const english = preferences.resolveLanguage() === 'en';
    document.documentElement.lang = english ? 'en' : 'zh-CN';
    for (const translation of translatedElements) {
      // 译文来自静态 HTML 属性，由网站所有者编辑。
      translation.element.innerHTML = english ? translation.english : translation.chinese;
    }
    for (const translation of translatedAttributes) {
      translation.element.setAttribute(translation.attribute, english ? translation.english : translation.chinese);
    }
    document.title = english ? 'Chentong Wang · Homepage' : 'Chentong Wang · 个人主页';
    document.querySelector('meta[name="description"]').content = english
      ? 'Chentong Wang’s academic homepage. Education, hyperspectral processing, deep learning and future research in embodied intelligence.'
      : 'Chentong Wang 的个人学术主页，介绍教育背景、高光谱处理与深度学习研究，以及面向具身智能的博士研究方向。';
    languageSelect.value = preferences.language;
    themeSelect.value = preferences.theme;
  }
  themeSelect.value = preferences.theme;
  themeSelect.addEventListener('change', () => {
    preferences.theme = themeSelect.value;
    preferences.save('homepage-theme-v2', preferences.theme);
    preferences.applyTheme();
  });
  languageSelect.addEventListener('change', () => {
    preferences.language = languageSelect.value;
    preferences.save('homepage-language', preferences.language);
    applyLanguage();
  });
  preferences.systemTheme.addEventListener('change', () => {
    if (preferences.theme === 'system') preferences.applyTheme();
  });
  window.addEventListener('languagechange', () => {
    if (preferences.language === 'auto') applyLanguage();
  });
  window.addEventListener('storage', event => {
    if (event.key === null || event.key === 'homepage-theme-v2') {
      const value = event.key === null ? 'light' : event.newValue;
      preferences.theme = ['light', 'dark', 'system'].includes(value) ? value : 'light';
      preferences.applyTheme();
    }
    if (event.key === null || event.key === 'homepage-language') {
      const value = event.key === null ? 'auto' : event.newValue;
      preferences.language = ['auto', 'zh', 'en'].includes(value) ? value : 'auto';
    }
    applyLanguage();
  });
  applyLanguage();
  document.querySelector('.preferences').hidden = false;
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
