/**
 * /api/reset — clears stale Vercel authentication cookies and redirects to the
 * app root.  Users who get a 403 "Forbidden" in non-incognito mode can visit
 * https://bassalchemy.nathanielschool.com/api/reset to clear the bad cookie
 * and land straight on the app.
 */
export default function handler(req, res) {
  const cookieOpts =
    'Max-Age=0; Path=/; Secure; SameSite=None; HttpOnly';

  res.setHeader('Set-Cookie', [
    `_vercel_jwt=; ${cookieOpts}`,
    `_vercel_protection_bypass=; ${cookieOpts}`,
  ]);

  res.setHeader('Location', '/');
  res.status(302).end();
}
