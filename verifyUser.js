export async function handler(event) {
  try {
    const { token } = JSON.parse(event.body);

    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const googleData = await googleRes.json();

    if (!googleData.email_verified) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Google email not verified" })
      };
    }

    const OWNER_EMAILS = ["plusnewyork43@gmail.com"];
    const role = OWNER_EMAILS.includes(googleData.email) ? "owner" : "user";

    return {
      statusCode: 200,
      body: JSON.stringify({ email: googleData.email, role })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
}
