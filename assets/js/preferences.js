/* 在样式加载前应用主题，避免刷新时出现白色闪屏。 */
(() => {
  function readPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_) {
      return fallback;
    }
  }
  const savedTheme = readPreference('homepage-theme-v2', 'light');
  const savedLanguage = readPreference('homepage-language', 'auto');
  const preferences = {
    theme: ['light', 'dark', 'system'].includes(savedTheme) ? savedTheme : 'light',
    language: ['auto', 'zh', 'en'].includes(savedLanguage) ? savedLanguage : 'auto',
    systemTheme: window.matchMedia('(prefers-color-scheme: dark)'),
    resolveLanguage() {
      if (this.language !== 'auto') return this.language;
      const browserLanguage = navigator.languages?.[0] || navigator.language || 'en';
      return browserLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    },
    applyTheme() {
      const dark = this.theme === 'dark' || (this.theme === 'system' && this.systemTheme.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    },
    save(key, value) {
      try { localStorage.setItem(key, value); } catch (_) {}
    }
  };
  preferences.applyTheme();
  document.documentElement.lang = preferences.resolveLanguage() === 'zh' ? 'zh-CN' : 'en';
  window.homepagePreferences = preferences;
})();
