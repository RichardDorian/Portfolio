{
  let currentTheme = 'dark';

  function applyTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
  }

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === null || !['light', 'dark'].includes(savedTheme)) {
    localStorage.setItem('theme', currentTheme);
  } else currentTheme = savedTheme;

  function onPageLoaded() {
    applyTheme(currentTheme);

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
    });
  }

  if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', onPageLoaded);
  } else onPageLoaded();
}
