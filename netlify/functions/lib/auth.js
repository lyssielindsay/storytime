/**
 * Checks for the family_auth=1 cookie in the request.
 * Returns true if authenticated, false otherwise.
 */
function checkAuth(event) {
  const cookieHeader = event.headers['cookie'] || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  return cookies['family_auth'] === '1';
}

module.exports = { checkAuth };
