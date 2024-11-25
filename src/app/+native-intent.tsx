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
      if (path.includes('supabase.co/auth/v1/verify')) {
        const params = new URLSearchParams(path.split('?')[1]);
        const token = params.get('token');
        const type = params.get('type');

        if (token && type) {
          return `/reset-password?token=${token}&type=${type}`;
        }
      }

      const pathSegments = path.split('/');
      if (
        pathSegments.includes('feed') &&
        pathSegments.includes('new-marketplace')
      ) {
        const marketplace = new URLSearchParams(path).get('marketplace');
        const connection = new URLSearchParams(path).get('connection');

        console.log('Native Intent - Marketplace:', marketplace);
        console.log('Native Intent - Connection:', connection);

        if (marketplace && connection === 'success') {
          return `/feed/new-marketplace?marketplace=${marketplace}&connection=${connection}`;
        }
      }

      let redirectedPath = '';
      const segments = path.split('/');
      for (let i = 1; i < segments.length; i++) {
        const segment = segments[i];
        if (segment.includes('?')) {
          const [route, queryParams] = segment.split('?');
          redirectedPath += `/${route}?${queryParams}`;
        } else {
          redirectedPath += `/${segment}`;
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
