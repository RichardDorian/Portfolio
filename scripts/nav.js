{
  const INDICATOR_PADDING = 15;

  const nav = document.querySelector('nav');
  const indicator = nav.querySelector('#indicator');
  let selected = nav.querySelector('li.selectable');

  function updateIndicator() {
    const boundingBox = selected.getBoundingClientRect();
    indicator.style.width = boundingBox.width + INDICATOR_PADDING * 2 + 'px';
    indicator.style.left = boundingBox.left - INDICATOR_PADDING + 'px';
  }

  window.addEventListener('resize', updateIndicator);

  const navItemToRoute = {
    '/': nav.querySelector('li.selectable#home'),
    '/about': nav.querySelector('li.selectable#about'),
    '/projects': nav.querySelector('li.selectable#projects'),
  };

  const updateSelectedNavEl = (route) =>
    (selected = navItemToRoute[route.redirectTo ?? route.path]);

  document.addEventListener('navigated', (event) =>
    updateSelectedNavEl(event.detail)
  );
  if (window.requireNavUpdate) {
    updateSelectedNavEl(window.requireNavUpdate);
    delete window.requireNavUpdate;
  }

  setTimeout(() => {
    indicator.style['background-color'] = 'var(--indicator)';
    setTimeout(() => {
      indicator.style.transition =
        indicator.computedStyleMap().get('transition').toString() +
        ', left 0.2s ease-in-out, width 0.2s ease-in-out';
    }, 300);

    updateIndicator();
  }, 500);

  const selectableElements = nav.querySelectorAll('.selectable');
  for (const element of selectableElements) {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      selected = element;
      updateIndicator();

      const route = element.querySelector('a').getAttribute('href');
      document.dispatchEvent(
        new CustomEvent('navigate', { detail: { route } })
      );
    });
  }
}

{
  const focusButton = document.querySelector('li > a#resume-nav');
  const downloadResume = document.querySelector('div#resume > button');

  for (const el of [focusButton, downloadResume]) {
    el.addEventListener('click', () => {
      const lang = document.documentElement.lang;
      window.open(`/assets/Resume Dorian RICHARD - ${lang}.pdf`);
    });
  }
}
