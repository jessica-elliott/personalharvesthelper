const OAUTH_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';
const SCOPES = 'repo,user';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'login';

  if (type === 'callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('Missing code parameter', { status: 400 });
    }

    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const data = await tokenResponse.json();
    const token = data.access_token;

    if (!token) {
      return new Response('Failed to get access token', { status: 400 });
    }

    const pageContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Authorized</title></head>
      <body>
        <p>Authentication successful! You can close this window.</p>
        <script>
          window.opener.postMessage(
            { type: 'authorization', data: { token: '${token}' } },
            '${url.origin}/admin/'
          );
          window.close();
        </script>
      </body>
      </html>
    `;

    return new Response(pageContent, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Login flow: redirect to GitHub
  const redirectUri = `${url.origin}/api/auth?type=callback`;
  const authUrl = `${OAUTH_URL}?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${SCOPES}`;

  return Response.redirect(authUrl, 302);
}