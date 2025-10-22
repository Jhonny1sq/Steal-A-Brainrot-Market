const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const username = (event.queryStringParameters && event.queryStringParameters.username) || '';
    if (!username) return { statusCode: 400, body: 'Missing username' };

    const body = { usernames: [username], excludeBannedUsers: false };
    const res = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
