export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  try {
    console.log('Native Intent - Received path:', path);
    console.log('Native Intent - Is initial:', initial);
    if (initial) {
      const pathSegments = path.split('/');
      let redirectedPath = '';
      for (let i = 1; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        if (segment.includes('?')) {
          const [route, queryParams] = segment.split('?');
          redirectedPath += `/${route}?${queryParams}`;
        } else {
          redirectedPath += `/${segment}`;
        }
      }
      if (redirectedPath.startsWith('/feed/new-marketplace')) {
        const marketplace = new URLSearchParams(path).get('marketplace');
        const connection = new URLSearchParams(path).get('connection');

        console.log('Native Intent - Marketplace:', marketplace);
        console.log('Native Intent - Connection:', connection);

        if (marketplace && connection === 'success') {
          return `/feed/new-marketplace?marketplace=${marketplace}&connection=${connection}`;
        }
      }
      return redirectedPath;
    }

    return path;
  } catch (error) {
    console.error('Native Intent - Error processing path:', error);
    return '/';
  }
}
