{
  const pageCache = new Map();
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
      title: 'About me',
    },
    {
      path: '/projects',
      file: '/pages/projects.html',
      title: 'Projects',
    },
  ];

  async function navigate(_route) {
    const route = routes.find((route) => route.path === _route);
    history.replaceState({}, '', route.redirectTo ?? route.path);

    if (route.file !== currentMain) {
      if (!pageCache.has(route.file)) {
        const response = await fetch(route.file);
        pageCache.set(route.file, await response.text());
      }
      const doc = domParser.parseFromString(
        pageCache.get(route.file),
        'text/html'
      );
      console.log(doc);
      currentMain = route.file;
      document.querySelector('main').replaceWith(doc.querySelector('main'));
      document.title =
        (route.title ? `${route.title} • ` : '') + 'Richard Dorian • Developer';
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
