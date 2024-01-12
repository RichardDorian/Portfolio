{
  const domParser = new DOMParser();
  let currentMain = '/index.html';

  const routes = [
    {
      path: '/',
      file: '/index.html',
    },
    {
      path: '/index.html',
      redirectTo: '/',
      file: '/index.html',
    },
    {
      path: '/about',
      file: '/pages/about.html',
    },
    {
      path: '/projects',
      file: '/pages/projects.html',
    },
  ];

  async function navigate(_route) {
    const route = routes.find((route) => route.path === _route);
    history.replaceState({}, '', route.redirectTo ?? route.path);

    if (route.file !== currentMain) {
      const response = await fetch(route.file);
      const text = await response.text();
      const doc = domParser.parseFromString(text, 'text/html');

      currentMain = route.file;
      document.querySelector('main').replaceWith(doc.querySelector('main'));
    }

    document.dispatchEvent(new CustomEvent('navigated', { detail: route }));
    window.requireNavUpdate = route;
  }

  document.addEventListener('navigate', (event) =>
    navigate(event.detail.route)
  );

  const pathname = location.pathname;
  const urlSearchParams = new URLSearchParams(location.search);
  const navigateParam = urlSearchParams.get('navigate');
  navigate(navigateParam ?? pathname);
}
