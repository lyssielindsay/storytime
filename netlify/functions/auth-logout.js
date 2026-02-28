exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': `family_auth=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  };
};
